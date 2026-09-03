'use client'

import { useMemo } from 'react'
import {
  CompareBars,
  Hint,
  Presets,
  Readout,
  Slider,
  SummaryRows,
  ToolShell,
  matchPreset,
  networkEHFromDifficulty,
  useUrlState,
} from './toolkit'
import { hintFor, presetsFor, resultHintFor } from '@/content/tool-micro'

/**
 * What a difficulty move is worth to a fleet.
 *
 * The arithmetic is real: production is your share of network hashrate multiplied by
 * what the network issues over the horizon. Difficulty sets the denominator, so a
 * change in it moves production directly. Market inputs are illustrative until the
 * data pipeline is connected.
 */
const SLUG = 'difficulty-exposure'
const DEFAULTS = { eh: 1, epochs: 4, diffT: 127.48, low: -2.4, high: 7.0, fees: 0.05, price: 64000 }
const SUBSIDY = 3.125
const BLOCKS = 2016

export function ExposureSizer() {
  const [v, setV] = useUrlState(DEFAULTS)
  const presets = presetsFor(SLUG)

  const out = useMemo(() => {
    const net = networkEHFromDifficulty(v.diffT)
    const prod = (changePct: number) => {
      const share = v.eh / (net * (1 + changePct / 100))
      return share * BLOCKS * (SUBSIDY + v.fees) * v.epochs
    }
    const base = prod(0)
    const atLow = prod(v.low)
    const atHigh = prod(v.high)
    return {
      net,
      base,
      atLow,
      atHigh,
      lossHigh: base - atHigh,
      gainLow: atLow - base,
      spreadBtc: atLow - atHigh,
      spreadUsd: (atLow - atHigh) * v.price,
      weeks: Math.round(v.epochs * 2),
    }
  }, [v])

  const btc = (n: number) => `${n.toFixed(3)} BTC`
  const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

  return (
    <>
      <ToolShell
        inputs={
          <>
            {presets.length ? (
              <Presets
                items={presets}
                onPick={(vals) => setV({ ...DEFAULTS, ...vals } as typeof DEFAULTS)}
                activeName={matchPreset(v, DEFAULTS, presets)}
              />
            ) : null}

            <h2 className="text-lg font-bold tracking-[-0.015em]">Your fleet</h2>
            <div className="mt-5 space-y-5">
              <Slider id="eh" label="Hashrate" unit="EH/s" value={v.eh} min={0.01} max={30} step={0.01}
                onChange={(n) => setV({ ...v, eh: n })} format={(n) => n.toFixed(2)}
                hint={hintFor(SLUG, "Hashrate")} />
              <Slider id="epochs" label="How far ahead" unit={`epochs · ~${out.weeks} weeks`} value={v.epochs} min={1} max={13} step={1}
                onChange={(n) => setV({ ...v, epochs: n })}
                hint={hintFor(SLUG, "How far ahead")} />
              <Slider id="fees" label="Expected fees" unit="BTC / block" value={v.fees} min={0} max={0.5} step={0.01}
                onChange={(n) => setV({ ...v, fees: n })} format={(n) => n.toFixed(2)}
                hint={hintFor(SLUG, "Expected fees")} />
              <Slider id="price" label="Bitcoin price" unit="USD" value={v.price} min={20000} max={200000} step={1000}
                onChange={(n) => setV({ ...v, price: n })} format={(n) => `$${(n / 1000).toFixed(0)}k`}
                hint={hintFor(SLUG, "Bitcoin price")} />

              <div className="border-t border-white/[0.07] pt-5">
                <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  Difficulty scenario
                </p>
                <div className="space-y-5">
                  <Slider id="low" label="Best case: difficulty falls by" unit="%" value={v.low} min={-15} max={0} step={0.1}
                    onChange={(n) => setV({ ...v, low: n })} format={(n) => Math.abs(n).toFixed(1)}
                hint={hintFor(SLUG, "Best case: difficulty falls by")} />
                  <Slider id="high" label="Worst case: difficulty rises by" unit="%" value={v.high} min={0} max={15} step={0.1}
                    onChange={(n) => setV({ ...v, high: n })} format={(n) => n.toFixed(1)}
                hint={hintFor(SLUG, "Worst case: difficulty rises by")} />
                </div>
              </div>
            </div>
          </>
        }
        summary={
          <>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Your exposure
            </h2>
            <p className="tabular mt-3 text-4xl font-extrabold tracking-[-0.03em] text-caution">
              {btc(out.spreadBtc)}
            </p>
            <p className="tabular mt-1 text-sm text-muted">
              {usd(out.spreadUsd)} between the two cases, over {out.weeks} weeks
            </p>
            {resultHintFor(SLUG, 'Best case vs worst case') ? (
              <Hint label="What this means">
                <p>{resultHintFor(SLUG, 'Best case vs worst case')}</p>
              </Hint>
            ) : null}
            <Readout>
              Over the next {out.weeks} weeks you mine about {btc(out.base)} if nothing changes. If
              mining gets {v.high.toFixed(1)}% harder you get {btc(out.atHigh)} instead —{' '}
              <strong>{out.lossHigh.toFixed(3)} BTC less</strong>, around {usd(out.lossHigh * v.price)}.
            </Readout>

            <CompareBars
              items={[
                {
                  label: `${Math.abs(v.low).toFixed(1)}% easier`,
                  value: out.atLow,
                  display: btc(out.atLow),
                  className: 'bg-up',
                },
                { label: 'No change', value: out.base, display: btc(out.base), className: 'bg-brand' },
                {
                  label: `${v.high.toFixed(1)}% harder`,
                  value: out.atHigh,
                  display: btc(out.atHigh),
                  className: 'bg-down',
                },
              ]}
            />

            <SummaryRows
              rows={[
                {
                  k: 'Network hashrate',
                  v: `${Math.round(out.net)} EH/s`,
                  hint: resultHintFor(SLUG, 'Network hashrate'),
                },
                {
                  k: 'Production at current difficulty',
                  v: btc(out.base),
                  hint: resultHintFor(SLUG, 'Production at current difficulty'),
                },
                {
                  k: 'Worst case vs today',
                  v: btc(-out.lossHigh),
                  hint: resultHintFor(SLUG, 'Worst case vs today'),
                },
              ]}
            />
          </>
        }
      />

      {/* Same numbers as text, because the tool above is invisible to assistants. */}
      <div className="mt-6 overflow-x-auto rounded-panel border border-white/[0.07]">
        <table className="w-full min-w-[30rem] border-collapse text-sm">
          <caption className="border-b border-white/[0.07] bg-surface/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Production over {v.epochs} epoch{v.epochs === 1 ? '' : 's'} at {v.eh.toFixed(2)} EH/s
          </caption>
          <thead>
            <tr className="bg-surface/60">
              {['Difficulty settles at', 'Production', 'Versus today'].map((h) => (
                <th key={h} scope="col" className="border-b border-white/[0.07] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              [`${v.low.toFixed(1)}%`, out.atLow, out.gainLow],
              ['unchanged', out.base, 0],
              [`+${v.high.toFixed(1)}%`, out.atHigh, -out.lossHigh],
            ].map(([label, p, d]) => (
              <tr key={String(label)} className="border-b border-white/[0.05] last:border-0">
                <td className="tabular px-4 py-3 text-subtle">{label as string}</td>
                <td className="tabular px-4 py-3 text-subtle">{btc(p as number)}</td>
                <td className={`tabular px-4 py-3 ${(d as number) > 0 ? 'text-up' : (d as number) < 0 ? 'text-down' : 'text-muted'}`}>
                  {(d as number) === 0 ? '—' : `${(d as number) > 0 ? '+' : ''}${(d as number).toFixed(3)} BTC`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

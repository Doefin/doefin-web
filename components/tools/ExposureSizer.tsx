'use client'

import { useMemo } from 'react'
import { calculateExposure, exposureBounds, exposureDefaults } from '@/lib/exposure'
import { useCalculatorMeasurement } from '@/components/v3/Measurement'
import { useSiteVersion } from '@/components/routing/SiteVersionContext'
import { ScenarioBrief } from '@/components/v3/ScenarioBrief'
import {
  CompareBars,
  Hint,
  InputSection,
  Presets,
  Readout,
  Slider,
  SummaryRows,
  ToolShell,
  matchPreset,
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
const DEFAULTS = exposureDefaults
const BOUNDS = exposureBounds

export function ExposureSizer({ enhanced = false, nextStep }: { enhanced?: boolean; nextStep?: React.ReactNode }) {
  const isV3 = useSiteVersion() === 'v3'
  const [v, writeV] = useUrlState(DEFAULTS, enhanced || isV3 ? BOUNDS : undefined)
  const presets = presetsFor(SLUG)
  const out = useMemo(() => calculateExposure(v), [v])

  const measurement = useCalculatorMeasurement(SLUG, Object.values(out).every(Number.isFinite) && out.base >= 0 && v.diffT > 0, isV3)
  const setV = (next: typeof v) => {
    if (Object.keys(v).some(key => next[key as keyof typeof v] !== v[key as keyof typeof v])) measurement.markInputChange()
    writeV(next)
  }
  const sampleV = (next: typeof v, source: 'sample' | 'example' = 'sample') => { measurement.markSample(source); writeV(next) }

  const btc = (n: number) => `${n.toFixed(3)} BTC`
  const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

  return (
    <>
      <ToolShell
        preciseInputs={enhanced}
        onReset={() => sampleV(DEFAULTS)}
        mobileResult={<span><strong>{btc(out.spreadBtc)}</strong> <small>spread · {out.weeks} weeks</small></span>}
        inputs={
          <>
            {presets.length ? (
              <Presets
                items={presets}
                onPick={(vals) => sampleV({ ...DEFAULTS, ...vals } as typeof DEFAULTS, 'example')}
                activeName={matchPreset(v, DEFAULTS, presets)}
              />
            ) : null}

            {isV3 ? <>
              <InputSection number="01" title="Fleet & horizon" description="Set the scale and period of your production.">
<Slider id="eh" label="Hashrate" unit="EH/s" value={v.eh} min={0.01} max={30} step={0.01}
                onChange={(n) => setV({ ...v, eh: n })} format={(n) => n.toFixed(2)}
                hint={hintFor(SLUG, "Hashrate")} />
<Slider id="epochs" label="How far ahead" unit={`epochs · ~${out.weeks} weeks`} value={v.epochs} min={1} max={13} step={1}
                onChange={(n) => setV({ ...v, epochs: n })}
                hint={hintFor(SLUG, "How far ahead")} />
              </InputSection>
              <InputSection number="02" title="Market assumptions" description="Use your own price and fee expectations.">
<Slider id="fees" label="Expected fees" unit="BTC / block" value={v.fees} min={0} max={0.5} step={0.01}
                onChange={(n) => setV({ ...v, fees: n })} format={(n) => n.toFixed(2)}
                hint={hintFor(SLUG, "Expected fees")} />
<Slider id="price" label="Bitcoin price" unit="USD" value={v.price} min={20000} max={200000} step={1000}
                onChange={(n) => setV({ ...v, price: n })} format={(n) => `$${(n / 1000).toFixed(0)}k`}
                hint={hintFor(SLUG, "Bitcoin price")} />
              </InputSection>
              <InputSection wideFirst number="03" title="Difficulty range" description="Compare production around the same starting difficulty.">
                <div><Slider id="diffT" label="Starting difficulty" unit="T" value={v.diffT} min={1} max={1000} step={0.01}
                    onChange={n => setV({ ...v, diffT: n })} />
                  <p className="mt-2 text-xs leading-relaxed text-subtle">Your chosen model input. The 127.48T sample default is not live difficulty.</p>
                </div>
<Slider id="low" label="Difficulty change · easier case" unit="%" value={v.low} min={-15} max={0} step={0.1}
                    onChange={(n) => setV({ ...v, low: n })} format={(n) => Math.abs(n).toFixed(1)}
                hint={hintFor(SLUG, "Best case: difficulty falls by")} />
<Slider id="high" label="Difficulty change · harder case" unit="%" value={v.high} min={0} max={15} step={0.1}
                    onChange={(n) => setV({ ...v, high: n })} format={(n) => n.toFixed(1)}
                hint={hintFor(SLUG, "Worst case: difficulty rises by")} />
              </InputSection>
            </> : <>
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
                  {enhanced ? <div><Slider id="diffT" label="Starting difficulty" unit="T" value={v.diffT} min={1} max={1000} step={0.01}
                    onChange={n => setV({ ...v, diffT: n })} />
                    <p className="mt-2 text-xs leading-relaxed text-subtle">Your chosen model input. The 127.48T sample default is not live difficulty.</p>
                  </div> : null}
                  <Slider id="low" label="Best case: difficulty falls by" unit="%" value={v.low} min={-15} max={0} step={0.1}
                    onChange={(n) => setV({ ...v, low: n })} format={(n) => Math.abs(n).toFixed(1)}
                hint={hintFor(SLUG, "Best case: difficulty falls by")} />
                  <Slider id="high" label="Worst case: difficulty rises by" unit="%" value={v.high} min={0} max={15} step={0.1}
                    onChange={(n) => setV({ ...v, high: n })} format={(n) => n.toFixed(1)}
                hint={hintFor(SLUG, "Worst case: difficulty rises by")} />
                </div>
              </div>
            </div>
            </>}
          </>
        }
        summary={
          <>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
              Your exposure
            </h2>
            <p ref={measurement.resultRef} className="tabular mt-3 text-4xl font-extrabold tracking-[-0.03em] text-caution">
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
              Over {out.weeks} weeks of target block time, the model estimates {btc(out.base)} of expected production at starting difficulty.
              At {v.high.toFixed(1)}% higher difficulty, it estimates {btc(out.atHigh)}:{' '}
              <strong>{out.lossHigh.toFixed(3)} BTC less</strong> at the same hashrate, about {usd(out.lossHigh * v.price)}.
            </Readout>
            {!isV3 ? nextStep : null}

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
                  k: 'Production at starting difficulty',
                  v: btc(out.base),
                  hint: resultHintFor(SLUG, 'Production at current difficulty'),
                },
                {
                  k: 'Harder case vs starting case',
                  v: btc(-out.lossHigh),
                  hint: resultHintFor(SLUG, 'Worst case vs today'),
                },
              ]}
            />
            {isV3 ? nextStep : null}
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
              {['Selected difficulty', 'Production', 'Versus starting case'].map((h) => (
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
      {isV3 ? <ScenarioBrief inputs={v} /> : null}
    </>
  )
}

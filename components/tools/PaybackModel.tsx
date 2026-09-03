'use client'

import { useMemo } from 'react'
import {
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
 * Fleet payback under a range of difficulty paths rather than one fixed assumption.
 *
 * The point of the tool is the comparison, not the central number: most calculators
 * hard-code a single monthly growth rate, and over a two-year horizon a small error
 * in it moves the payback date by months.
 *
 * Market inputs are illustrative until the data pipeline is connected.
 */
const SLUG = 'fleet-payback'
const DEFAULTS = {
  th: 1000,        // fleet terahash — roughly five modern machines
  jPerTh: 15,      // efficiency
  power: 0.045,    // $/kWh all-in
  capex: 20000,    // $ — calibrated to the fleet size above
  price: 90000,    // BTC/USD
  diffT: 127.48,
  growth: 1.5,     // % per month, central
  months: 48,
}
const SUBSIDY = 3.125
const BLOCKS_DAY = 144

function simulate(v: typeof DEFAULTS, monthlyGrowthPct: number) {
  const net0 = networkEHFromDifficulty(v.diffT) * 1e6 // EH/s -> TH/s
  const kWhDay = (v.th * v.jPerTh) / 1000 * 24
  const powerDay = kWhDay * v.power
  let cum = -v.capex
  let paybackMonth: number | null = null
  const series: { m: number; cum: number }[] = []

  for (let m = 1; m <= v.months; m++) {
    const net = net0 * Math.pow(1 + monthlyGrowthPct / 100, m)
    const btcDay = (v.th / net) * BLOCKS_DAY * SUBSIDY
    const revDay = btcDay * v.price
    cum += (revDay - powerDay) * 30.4
    series.push({ m, cum })
    if (paybackMonth === null && cum >= 0) paybackMonth = m
  }
  return { paybackMonth, series, final: cum, powerDay }
}

export function PaybackModel() {
  const [v, setV] = useUrlState(DEFAULTS)
  const presets = presetsFor(SLUG)

  const runs = useMemo(() => {
    const low = simulate(v, Math.max(0, v.growth - 2))
    const mid = simulate(v, v.growth)
    const high = simulate(v, v.growth + 3)
    return { low, mid, high }
  }, [v])

  const label = (m: number | null) => (m === null ? `beyond ${v.months} months` : `${m} months`)
  const usd = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`

  // A small chart of the central path. The table beneath carries the same numbers.
  const pts = runs.mid.series
  const maxAbs = Math.max(...pts.map((p) => Math.abs(p.cum)), 1)
  const path = pts
    .map((p, i) => `${(i / (pts.length - 1)) * 300},${60 - (p.cum / maxAbs) * 50}`)
    .join(' ')

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
              <Slider id="th" label="Fleet hashrate" unit="TH/s" value={v.th} min={100} max={20000} step={50}
                onChange={(n) => setV({ ...v, th: n })} format={(n) => n.toLocaleString('en-US')}
                  hint={hintFor(SLUG, "Fleet hashrate")} />
              <Slider id="jPerTh" label="Efficiency" unit="J/TH" value={v.jPerTh} min={12} max={40} step={0.5}
                onChange={(n) => setV({ ...v, jPerTh: n })} format={(n) => n.toFixed(1)}
                  hint={hintFor(SLUG, "Efficiency")} />
              <Slider id="power" label="All-in power cost" unit="$/kWh" value={v.power} min={0.02} max={0.15} step={0.001}
                onChange={(n) => setV({ ...v, power: n })} format={(n) => n.toFixed(3)}
                  hint={hintFor(SLUG, "All-in power cost")} />
              <Slider id="capex" label="What you paid up front" unit="USD" value={v.capex} min={5000} max={2000000} step={1000}
                onChange={(n) => setV({ ...v, capex: n })} format={(n) => `$${(n / 1000).toFixed(0)}k`}
                  hint={hintFor(SLUG, "What you paid up front")} />
              <Slider id="price" label="Bitcoin price" unit="USD" value={v.price} min={20000} max={200000} step={1000}
                onChange={(n) => setV({ ...v, price: n })} format={(n) => `$${(n / 1000).toFixed(0)}k`}
                  hint={hintFor(SLUG, "Bitcoin price")} />
              <div className="border-t border-white/[0.07] pt-5">
                <Slider id="growth" label="Difficulty growth guess" unit="% per month" value={v.growth} min={0} max={8} step={0.1}
                  onChange={(n) => setV({ ...v, growth: n })} format={(n) => n.toFixed(1)}
                  hint={hintFor(SLUG, "Difficulty growth guess")} />
              </div>
            </div>
          </>
        }
        summary={
          <>
            <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Payback</h2>
            <p className="tabular mt-3 text-4xl font-extrabold tracking-[-0.03em] text-brand">
              {label(runs.mid.paybackMonth)}
            </p>
            <p className="tabular mt-1 text-sm text-muted">
              at {v.growth.toFixed(1)}% monthly difficulty growth
            </p>
            {resultHintFor(SLUG, 'Payback') ? (
              <Hint label="What this means">
                <p>{resultHintFor(SLUG, 'Payback')}</p>
              </Hint>
            ) : null}

            <svg viewBox="0 0 300 70" className="mt-5 w-full" role="img"
              aria-label={`Cumulative cash position over ${v.months} months, crossing zero at ${label(runs.mid.paybackMonth)}`}>
              <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" className="text-white/10" strokeWidth="1" />
              <polyline points={path} fill="none" stroke="currentColor" className="text-brand" strokeWidth="2" />
            </svg>

            <Readout>
              {runs.mid.paybackMonth === null ? (
                <>
                  At {v.growth.toFixed(1)}% a month this fleet never pays back the {usd(v.capex)} inside{' '}
                  {v.months} months. Cheaper power or a lower price paid is the only fix.
                </>
              ) : runs.high.paybackMonth === null ? (
                <>
                  At {v.growth.toFixed(1)}% a month you get the {usd(v.capex)} back in month{' '}
                  <strong>{runs.mid.paybackMonth}</strong>. If mining gets harder faster — {(v.growth + 3).toFixed(1)}%
                  a month — you never get it back. That is the part you do not control.
                </>
              ) : (
                <>
                  At {v.growth.toFixed(1)}% a month you get the {usd(v.capex)} back in month{' '}
                  <strong>{runs.mid.paybackMonth}</strong>. If mining gets harder faster it is month{' '}
                  {runs.high.paybackMonth} — {runs.high.paybackMonth - runs.mid.paybackMonth} months later,
                  on a guess nobody can make for you.
                </>
              )}
            </Readout>

            <SummaryRows
              rows={[
                {
                  k: `If growth is ${Math.max(0, v.growth - 2).toFixed(1)}%`,
                  v: label(runs.low.paybackMonth),
                  hint: resultHintFor(SLUG, 'Monthly difficulty growth'),
                },
                {
                  k: `If growth is ${v.growth.toFixed(1)}%`,
                  v: label(runs.mid.paybackMonth),
                },
                {
                  k: `If growth is ${(v.growth + 3).toFixed(1)}%`,
                  v: label(runs.high.paybackMonth),
                },
                {
                  k: `Cash after ${v.months} months`,
                  v: usd(runs.mid.final),
                  hint: resultHintFor(SLUG, 'Cash after 48 months'),
                },
                {
                  k: 'Power cost per day',
                  v: usd(runs.mid.powerDay),
                  hint: resultHintFor(SLUG, 'Power cost per day'),
                },
              ]}
            />
          </>
        }
      />

      <div className="mt-6 overflow-x-auto rounded-panel border border-white/[0.07]">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <caption className="border-b border-white/[0.07] bg-surface/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            Payback under three difficulty paths · {v.th.toLocaleString('en-US')} TH/s, {usd(v.capex)} outlay
          </caption>
          <thead>
            <tr className="bg-surface/60">
              {['Monthly difficulty growth', 'Payback', `Position at ${v.months} months`].map((h) => (
                <th key={h} scope="col" className="border-b border-white/[0.07] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {([
              [`${Math.max(0, v.growth - 2).toFixed(1)}%`, runs.low],
              [`${v.growth.toFixed(1)}% (central)`, runs.mid],
              [`${(v.growth + 3).toFixed(1)}%`, runs.high],
            ] as const).map(([g, r]) => (
              <tr key={g} className="border-b border-white/[0.05] last:border-0">
                <td className="tabular px-4 py-3 text-subtle">{g}</td>
                <td className="tabular px-4 py-3 text-subtle">{label(r.paybackMonth)}</td>
                <td className={`tabular px-4 py-3 ${r.final >= 0 ? 'text-up' : 'text-down'}`}>{usd(r.final)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

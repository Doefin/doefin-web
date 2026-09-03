'use client'

import { useMemo, useState } from 'react'
import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import type { NetworkPoint } from '@/content/sample-data'

/**
 * Interactive network history — difficulty, implied hashrate and price.
 *
 * This is ENHANCEMENT, not the record. The same numbers ship as a table beside it
 * (`SeriesTable`), because a crawler never runs this file and a chart alone would put
 * the figures out of reach of the assistants this site exists to be cited by.
 *
 * A client leaf on purpose: the page around it stays server-rendered.
 */
const SERIES = [
  { key: 'difficultyT', label: 'Difficulty', unit: 'T', axis: 'left', cls: 'text-brand', stroke: '#3475FE' },
  { key: 'hashrateEH', label: 'Hashrate', unit: 'EH/s', axis: 'left', cls: 'text-up', stroke: '#3EC875' },
  { key: 'priceUsd', label: 'Bitcoin price', unit: 'USD', axis: 'right', cls: 'text-caution', stroke: '#F0B429' },
] as const

type Key = (typeof SERIES)[number]['key']
const RANGES = [
  { label: '3M', points: 7 },
  { label: '6M', points: 13 },
  { label: '1Y', points: 26 },
] as const

const fmt = (k: Key, v: number) =>
  k === 'priceUsd' ? `$${(v / 1000).toFixed(0)}k` : k === 'difficultyT' ? `${v.toFixed(1)} T` : `${v} EH/s`

export function NetworkChart({ data }: { data: NetworkPoint[] }) {
  const [on, setOn] = useState<Record<Key, boolean>>({
    difficultyT: true, hashrateEH: false, priceUsd: false,
  })
  const [range, setRange] = useState<number>(26)

  const rows = useMemo(() => data.slice(-range), [data, range])
  const active = SERIES.filter((s) => on[s.key])
  const usesRight = active.some((s) => s.axis === 'right')

  return (
    <div className="rounded-panel border border-white/[0.07] bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {SERIES.map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setOn((p) => ({ ...p, [s.key]: !p[s.key] }))}
              aria-pressed={on[s.key]}
              className={
                'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-[13px] font-medium transition-colors ' +
                (on[s.key]
                  ? 'border-white/25 bg-white/[0.06] text-body'
                  : 'border-white/[0.1] text-muted hover:border-white/20 hover:text-subtle')
              }
            >
              <span aria-hidden className={`h-2 w-2 rounded-full bg-current ${s.cls}`} />
              {s.label}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-lg border border-white/[0.1] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r.label}
              type="button"
              onClick={() => setRange(r.points)}
              aria-pressed={range === r.points}
              className={
                'rounded px-2.5 py-1 text-xs font-semibold transition-colors ' +
                (range === r.points ? 'bg-brand text-white' : 'text-muted hover:text-body')
              }
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 h-[300px] w-full sm:h-[360px]">
        {active.length === 0 ? (
          <p className="grid h-full place-items-center text-sm text-muted">
            Select a series above to plot it.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
              <CartesianGrid stroke="currentColor" className="text-white/[0.06]" vertical={false} />
              <XAxis
                dataKey="date" tickLine={false} axisLine={false}
                tick={{ fontSize: 11, fill: '#838EA7' }} minTickGap={28}
                tickFormatter={(d: string) => d.slice(2, 7)}
              />
              <YAxis
                yAxisId="left" tickLine={false} axisLine={false} width={54}
                tick={{ fontSize: 11, fill: '#838EA7' }} domain={['auto', 'auto']}
              />
              {usesRight ? (
                <YAxis
                  yAxisId="right" orientation="right" tickLine={false} axisLine={false} width={54}
                  tick={{ fontSize: 11, fill: '#838EA7' }} domain={['auto', 'auto']}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
                />
              ) : null}
              <ReferenceLine yAxisId="left" y={0} stroke="transparent" />
              <Tooltip
                contentStyle={{
                  background: '#1c1f2e', border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, fontSize: 13,
                }}
                labelStyle={{ color: '#E8ECF4', fontWeight: 700, marginBottom: 4 }}
                labelFormatter={(d) => `Retarget of ${d}`}
                formatter={(v, name) => {
                  const s = SERIES.find((x) => x.label === name)
                  return [s && typeof v === 'number' ? fmt(s.key, v) : String(v), String(name)]
                }}
              />
              {active.map((s) => (
                <Line
                  key={s.key} yAxisId={s.axis} type="monotone" dataKey={s.key} name={s.label}
                  stroke={s.stroke} strokeWidth={2} dot={false} activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

/** The chart's crawlable twin. Same numbers, in the HTML, collapsed. */
export function SeriesTable({ data }: { data: NetworkPoint[] }) {
  return (
    <details className="group mt-4 rounded-panel border border-white/[0.07] bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-3.5 text-sm text-subtle [&::-webkit-details-marker]:hidden">
        <span className="font-semibold">All {data.length} retargets as a table</span>
        <span aria-hidden className="text-muted transition-transform group-open:rotate-180">▾</span>
      </summary>
      <div className="overflow-x-auto border-t border-white/[0.07]">
        <table className="w-full min-w-[32rem] border-collapse text-sm">
          <thead>
            <tr className="bg-surface/60">
              {['Retarget', 'Block', 'Difficulty', 'Implied hashrate', 'Bitcoin price'].map((h) => (
                <th key={h} scope="col" className="whitespace-nowrap border-b border-white/[0.07] px-4 py-2.5 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <tr key={p.height} className="border-b border-white/[0.05] last:border-0">
                <td className="tabular px-4 py-2.5 text-subtle">{p.date}</td>
                <td className="tabular px-4 py-2.5 text-muted">{p.height.toLocaleString('en-US')}</td>
                <td className="tabular px-4 py-2.5 text-subtle">{p.difficultyT.toFixed(2)} T</td>
                <td className="tabular px-4 py-2.5 text-subtle">{p.hashrateEH} EH/s</td>
                <td className="tabular px-4 py-2.5 text-subtle">${p.priceUsd.toLocaleString('en-US')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

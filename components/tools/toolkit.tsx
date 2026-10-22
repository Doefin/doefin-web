'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSiteVersion } from '@/components/routing/SiteVersionContext'
import styles from './workbench.module.css'
import { readToolQuery, toolQuery, type ToolBounds } from '@/lib/tool-url-state'

/* Shared pieces so every tool reads as one family. */

const PreciseInputs = createContext(false)

export function ToolShell({ inputs, summary, mobileResult, onReset, preciseInputs = false }: {
  inputs: React.ReactNode; summary: React.ReactNode; mobileResult?: React.ReactNode; onReset?: () => void; preciseInputs?: boolean
}) {
  const isV3 = useSiteVersion() === 'v3'
  if (isV3) return <PreciseInputs.Provider value={preciseInputs}>
    <div className={styles.workspace} data-calculator-workspace>
      {mobileResult ? <div className={styles.resultStrip}><span className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Current result</span>{mobileResult}</div> : null}
      <div className={styles.inputs} data-assumptions>
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.07] px-5 py-4 sm:px-6">
          <span className="text-sm font-bold">Scenario inputs</span>{onReset ? <button type="button" onClick={onReset} className="min-h-9 rounded-lg px-2 text-xs font-semibold text-highlight hover:bg-white/5">Reset inputs <span aria-hidden>↺</span></button> : null}
        </div>
        {inputs}
      </div>
      <aside className={styles.result} aria-label="Scenario results" data-results>
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-subtle"><span>Scenario analysis</span><span className="rounded-full border border-caution/30 bg-caution/5 px-2.5 py-1 text-caution">Illustrative</span></div>
        {summary}
      </aside>
    </div>
  </PreciseInputs.Provider>
  return (
    <PreciseInputs.Provider value={preciseInputs}>
    <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <div className="min-w-0 rounded-panel border border-white/[0.07] bg-surface p-6">{inputs}</div>
      <div className="min-w-0 rounded-panel border border-white/[0.07] bg-gradient-to-br from-surface to-surfaceAlt p-6">
        {summary}
      </div>
    </div>
    </PreciseInputs.Provider>
  )
}

export function InputSection({ number, title, description, wideFirst = false, children }: {
  number: string; title: string; description: string; wideFirst?: boolean; children: React.ReactNode
}) {
  return <section className={styles.section}>
    <div className="mb-5 flex items-start gap-3">
      <span className="tabular mt-0.5 text-xs font-bold text-highlight">{number}</span>
      <div><h2 className="text-sm font-bold">{title}</h2><p className="mt-1 text-xs leading-relaxed text-subtle">{description}</p></div>
    </div>
    <div className={styles.fields + (wideFirst ? " " + styles.wideFirst : "")}>{children}</div>
  </section>
}

export type InputHint = { means: string; whereToFind: string; typical: string }

/**
 * Help that ships collapsed but present.
 *
 * <details> keeps the text in the served HTML, so an AI crawler — which never
 * clicks anything — still reads it, while a human sees a clean panel. Rendering
 * it conditionally on state would hide it from both.
 */
export function Hint({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <details className="group mt-2">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-xs text-muted transition-colors hover:text-brand [&::-webkit-details-marker]:hidden">
        <span
          aria-hidden
          className="grid h-3.5 w-3.5 place-items-center rounded-full border border-current text-[9px] font-bold"
        >
          ?
        </span>
        <span className="underline decoration-dotted underline-offset-2 group-open:no-underline">
          {label}
        </span>
      </summary>
      <div className="mt-2 space-y-2 rounded-lg border border-white/[0.07] bg-ink/50 p-3 text-[13px] leading-[1.6] text-muted">
        {children}
      </div>
    </details>
  )
}

function SliderHint({ hint }: { hint: InputHint }) {
  return (
    <Hint label="What is this?">
      <p className="text-subtle">{hint.means}</p>
      <p>
        <span className="font-semibold text-body">Where to find yours: </span>
        {hint.whereToFind}
      </p>
      <p>
        <span className="font-semibold text-body">Typical: </span>
        {hint.typical}
      </p>
    </Hint>
  )
}

export function Slider({
  id, label, unit, value, min, max, step, onChange, format, hint,
}: {
  id: string; label: string; unit: string; value: number
  min: number; max: number; step: number
  onChange: (n: number) => void
  format?: (n: number) => string
  hint?: InputHint
}) {
  const precise = useContext(PreciseInputs)
  const isV3 = useSiteVersion() === 'v3'
  if (isV3) return <div className={styles.field}>
    <label htmlFor={id} className="block text-xs font-semibold leading-relaxed text-subtle">{label}</label>
    <div className={styles.valueControl}>
      <input aria-label={label + ' — exact value'} type="number" min={min} max={max} step={step}
        key={value} defaultValue={value} onBlur={e => {
          const n = e.target.valueAsNumber
          const next = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : value
          e.target.value = String(next)
          onChange(next)
        }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
        className="tabular min-w-0 flex-1 bg-transparent py-2 text-2xl font-bold tracking-tight text-body" />
      <span className="max-w-[45%] text-right text-[11px] leading-snug text-subtle">{unit}</span>
    </div>
    <input id={id} aria-label={label} type="range" min={min} max={max} step={step} value={value}
      onChange={e => onChange(Number(e.target.value))} className={styles.range}
      style={{ '--fill': `${(value - min) / (max - min) * 100}%` } as React.CSSProperties} />
    <div className="tabular flex justify-between gap-3 text-[10px] text-subtle"><span>{min.toLocaleString('en-US')}</span><span>{max.toLocaleString('en-US')}</span></div>
    {hint ? <details className={styles.guide}>
      <summary className="cursor-pointer text-[11px] font-semibold text-highlight">Input guide</summary>
      <div className="mt-2 space-y-2 text-xs leading-relaxed text-subtle"><p>{hint.means}</p><p><strong className="text-body">Where to find yours: </strong>{hint.whereToFind}</p><p><strong className="text-body">Typical: </strong>{hint.typical}</p></div>
    </details> : null}
  </div>
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <label htmlFor={id} className="text-sm font-medium text-subtle">{label}</label>
        <span className="tabular text-sm font-bold text-body">
          {format ? format(value) : value} <span className="font-normal text-muted">{unit}</span>
        </span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-brand"
      />
      {precise ? <div className="mt-1 flex items-center gap-2 text-xs text-subtle">
        <input aria-label={label + ' — exact value'} type="number" min={min} max={max} step={step}
          key={value} defaultValue={value} onBlur={e => {
            const n = e.target.valueAsNumber
            const next = Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : value
            e.target.value = String(next)
            onChange(next)
          }} onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
          className="tabular w-28 rounded-lg border border-white/15 bg-ink px-3 py-2 text-sm text-body" />
        <span>{unit}</span>
      </div> : null}
      {hint ? <SliderHint hint={hint} /> : null}
    </div>
  )
}

export type SummaryRow = { k: string; v: string; hint?: string }

export function SummaryRows({ rows }: { rows: SummaryRow[] }) {
  return (
    <dl className="mt-6 space-y-3 border-t border-white/[0.07] pt-5 text-sm">
      {rows.map(({ k, v, hint }) => (
        <div key={k}>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{k}</dt>
            <dd className="tabular font-semibold">{v}</dd>
          </div>
          {hint ? (
            <Hint label="What this means">
              <p>{hint}</p>
            </Hint>
          ) : null}
        </div>
      ))}
    </dl>
  )
}

/**
 * The headline sentence. This is the part that changes as you drag, and it is what
 * replaced four thousand words of static explanation: rather than telling someone in
 * advance what the output will mean, say what THIS output means, now.
 */
export function Readout({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 rounded-lg border-l-[3px] border-brand bg-brand/[0.07] px-4 py-3 text-[14px] leading-[1.6] text-body">
      {children}
    </p>
  )
}

/** Named scenarios. Clicking one moves every slider at once. */
export function Presets({
  items, onPick, activeName,
}: {
  items: { name: string; note: string; values: Record<string, number> }[]
  onPick: (values: Record<string, number>) => void
  activeName: string | null
}) {
  const isV3 = useSiteVersion() === 'v3'
  if (isV3) return <div className={styles.presets}>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-subtle">Sample starting points</p><span className="text-xs font-semibold text-highlight">{activeName ?? 'Custom scenario'}</span></div>
    <div className="grid gap-2 sm:grid-cols-3">{items.map(p => <button key={p.name} type="button" aria-pressed={p.name === activeName} onClick={() => onPick(p.values)} className={styles.preset}>
      <span className="flex items-center justify-between gap-2 text-xs font-bold"><span>{p.name}</span><span aria-hidden className={styles.radio} /></span>
      <span className="mt-2 block text-[11px] leading-relaxed text-subtle">{p.note}</span>
    </button>)}</div>
  </div>
  return (
    <div className="mb-6 border-b border-white/[0.07] pb-6">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-muted">Try a scenario</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((p) => {
          const on = p.name === activeName
          return (
            <button
              key={p.name}
              type="button"
              onClick={() => onPick(p.values)}
              aria-pressed={on}
              className={
                'rounded-lg border px-3.5 py-2.5 text-left transition-colors ' +
                (on
                  ? 'border-brand bg-brand/15 text-body'
                  : 'border-white/[0.12] text-subtle hover:border-white/25 hover:bg-white/[0.04]')
              }
            >
              <span className="block text-[13px] font-bold">{p.name}</span>
              <span className="mt-0.5 block text-[12px] leading-snug text-muted">{p.note}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Where a total comes from, as a bar. Replaces a paragraph explaining the same split. */
export function Bars({ items }: { items: { label: string; value: number; className: string }[] }) {
  const total = items.reduce((s, i) => s + Math.max(0, i.value), 0)
  if (total <= 0) return null
  return (
    <div className="mt-5">
      <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.06]">
        {items.map((i) => (
          <div
            key={i.label}
            className={i.className}
            style={{ width: `${(Math.max(0, i.value) / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((i) => (
          <li key={i.label} className="flex items-center gap-2 text-xs text-muted">
            <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${i.className}`} />
            <span className="flex-1">{i.label}</span>
            <span className="tabular font-semibold text-subtle">
              {((Math.max(0, i.value) / total) * 100).toFixed(0)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function PreviewNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 text-xs leading-relaxed text-muted/70">{children}</p>
}

/** Keeps tool state in the URL so a scenario can be pasted into a conversation. */
export function useUrlState<T extends Record<string, number>>(defaults: T, bounds?: ToolBounds<T>) {
  const [v, setV] = useState<T>(defaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const { values, found } = readToolQuery(defaults, new URLSearchParams(window.location.search), bounds)
    if (found) setV(values)
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    const qs = toolQuery(defaults, v)
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v, ready])

  return [v, setV] as const
}

/** Network hashrate implied by difficulty, assuming the 10-minute target. */
export { networkEHFromDifficulty } from '@/lib/exposure'

/** Which named scenario, if any, the sliders are currently sitting on. */
export function matchPreset<T extends Record<string, number>>(
  v: T,
  defaults: T,
  presets: { name: string; values: Record<string, number> }[],
): string | null {
  const hit = presets.find((p) =>
    (Object.keys(defaults) as (keyof T)[]).every((k) => {
      const want = p.values[String(k)] ?? defaults[k]
      return Math.abs(Number(want) - Number(v[k])) < 1e-9
    }),
  )
  return hit ? hit.name : null
}

/** Side-by-side magnitudes. One bar per scenario, scaled to the largest. */
export function CompareBars({
  items,
}: {
  items: { label: string; value: number; display: string; className: string }[]
}) {
  const max = Math.max(...items.map((i) => Math.abs(i.value)), 1e-9)
  return (
    <div className="mt-5 space-y-2.5">
      {items.map((i) => (
        <div key={i.label}>
          <div className="flex items-baseline justify-between gap-3 text-xs">
            <span className="text-muted">{i.label}</span>
            <span className="tabular font-semibold text-subtle">{i.display}</span>
          </div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full ${i.className}`}
              style={{ width: `${(Math.abs(i.value) / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

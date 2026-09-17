'use client'

import { createContext, useContext, useEffect, useState } from 'react'

/* Shared pieces so every tool reads as one family. */

const PreciseInputs = createContext(false)

export function ToolShell({ inputs, summary, preciseInputs = false }: {
  inputs: React.ReactNode; summary: React.ReactNode; preciseInputs?: boolean
}) {
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
export function useUrlState<T extends Record<string, number>>(defaults: T, bounds?: Partial<Record<keyof T, readonly [number, number]>>) {
  const [v, setV] = useState<T>(defaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    const next = { ...defaults }
    let found = false
    for (const k of Object.keys(defaults) as (keyof T)[]) {
      const raw = p.get(String(k))
      if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) {
        const range = bounds?.[k]
        next[k] = (range ? Math.min(range[1], Math.max(range[0], Number(raw))) : Number(raw)) as T[keyof T]
        found = true
      }
    }
    if (found) setV(next)
    setReady(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready) return
    const p = new URLSearchParams()
    for (const k of Object.keys(defaults) as (keyof T)[]) {
      if (v[k] !== defaults[k]) p.set(String(k), String(v[k]))
    }
    const qs = p.toString()
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

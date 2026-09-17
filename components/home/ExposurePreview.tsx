'use client'

import { useState } from 'react'
import Link from '@/components/routing/SiteLink'

const SCENARIOS = [5, 10, 15] as const
const BASE_PRODUCTION = 100

/** An illustrative sensitivity example, not a forecast or a contract payout. */
export function ExposurePreview() {
  const [change, setChange] = useState<number>(10)
  const production = BASE_PRODUCTION / (1 + change / 100)
  const loss = BASE_PRODUCTION - production

  return (
    <section
      aria-labelledby="exposure-preview-title"
      className="relative rounded-header border border-white/[0.12] bg-gradient-to-br from-surface to-ink p-6 shadow-2xl shadow-ink/40 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">The difficulty effect</p>
        <span className="rounded-full border border-caution/25 bg-caution/10 px-2.5 py-1 text-[11px] font-semibold text-caution">
          Illustrative scenario
        </span>
      </div>

      <h2 id="exposure-preview-title" className="mt-7 text-2xl font-bold tracking-[-0.03em] sm:text-[28px]">
        Same fleet. Different production.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-subtle">
        See what happens when difficulty rises and your hashrate stays the same.
      </p>

      <fieldset className="mt-7">
        <legend className="text-xs font-semibold text-subtle">Try a difficulty increase</legend>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {SCENARIOS.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={change === value}
              onClick={() => setChange(value)}
              className={`tabular rounded-lg border py-3 text-sm font-bold transition-colors ${
                change === value
                  ? 'border-brand bg-brand/20 text-body'
                  : 'border-white/10 bg-white/[0.02] text-subtle hover:border-white/30 hover:text-body'
              }`}
            >
              +{value}%
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-8" aria-live="polite" aria-atomic="true">
        <dl className="space-y-5">
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-subtle">Before the change</dt>
              <dd className="tabular text-sm font-semibold">100.00 BTC</dd>
            </div>
            <div aria-hidden="true" className="mt-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-sm text-subtle">With difficulty +{change}%</dt>
              <dd className="tabular text-sm font-semibold text-highlight">{production.toFixed(2)} BTC</dd>
            </div>
            <div aria-hidden="true" className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-300"
                style={{ width: `${production}%` }}
              />
            </div>
          </div>
        </dl>

        <div className="mt-7 flex items-end justify-between gap-3 border-t border-white/10 pt-6">
          <div>
            <p className="text-xs text-subtle">The difference to your production</p>
            <p className="tabular mt-2 text-4xl font-extrabold tracking-[-0.04em]">
              {loss.toFixed(2)} <span className="text-xl font-semibold text-subtle">BTC less</span>
            </p>
          </div>
          <span className="tabular mb-1 rounded-lg bg-down/10 px-2.5 py-1.5 text-sm font-semibold text-down">
            −{loss.toFixed(2)}%
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs leading-relaxed text-subtle">
        A hypothetical 100 BTC baseline over the same time period. Hashrate, block reward,
        fees and uptime are held constant. This is sensitivity arithmetic, not a forecast.
      </p>
      <Link
        href="/v2/tools/difficulty-exposure"
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:underline"
      >
        Calculate with your own fleet <span aria-hidden="true">→</span>
      </Link>
    </section>
  )
}

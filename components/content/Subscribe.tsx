'use client'

import { useState } from 'react'

/**
 * The signup form, rendered exactly as it will ship — including the audience-type
 * field, which is what turns a subscriber count into a number that means something.
 *
 * Nothing is wired to a provider yet. Submitting shows the confirmation state so the
 * flow can be reviewed, and stores nothing. When beehiiv is connected, replace the
 * handler with its embed or its API and delete the notice.
 *
 * This is a client component on purpose. It is a leaf — the pages that use it stay
 * server-rendered, so the surrounding prose still reaches crawlers.
 */
const AUDIENCES = [
  { value: 'miner', label: 'Mining operator' },
  { value: 'fund', label: 'Fund or trading desk' },
  { value: 'service', label: 'Service provider' },
  { value: 'other', label: 'Something else' },
] as const

export function Subscribe({
  title = 'Get the research',
  blurb = 'Reports, insights and analysis on Bitcoin mining difficulty. Commentary, never a sales message.',
  compact = false,
}: {
  title?: string
  blurb?: string
  compact?: boolean
}) {
  const [done, setDone] = useState(false)
  const [audience, setAudience] = useState<string>('')

  return (
    <section
      className={`rounded-panel border border-white/[0.07] bg-gradient-to-br from-surface to-surfaceAlt ${
        compact ? 'p-6' : 'p-8'
      }`}
      aria-labelledby="subscribe-heading"
    >
      <h2 id="subscribe-heading" className={`font-extrabold tracking-[-0.02em] ${compact ? 'text-xl' : 'text-2xl'}`}>
        {title}
      </h2>
      <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">{blurb}</p>

      {done ? (
        <div className="mt-6 rounded-lg border border-up/30 bg-up/10 p-5">
          <p className="font-semibold text-up">Check your inbox</p>
          <p className="mt-1 text-[15px] leading-relaxed text-subtle">
            We have sent a confirmation link. You are not subscribed until you click it — that
            double opt-in is what keeps the list clean and provable.
          </p>
        </div>
      ) : (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            setDone(true)
          }}
        >
          <div>
            <label htmlFor="sub-email" className="block text-xs font-bold uppercase tracking-[0.1em] text-muted">
              Email
            </label>
            <input
              id="sub-email"
              type="email"
              required
              placeholder="you@company.com"
              className="mt-2 w-full rounded-lg border border-white/[0.12] bg-ink px-4 py-3 text-body placeholder:text-muted/60 focus:border-brand focus:outline-none"
            />
          </div>

          <fieldset>
            <legend className="block text-xs font-bold uppercase tracking-[0.1em] text-muted">
              What do you do?
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAudience(a.value)}
                  aria-pressed={audience === a.value}
                  className={`rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors ${
                    audience === a.value
                      ? 'border-brand bg-brand/15 text-body'
                      : 'border-white/[0.12] text-muted hover:border-white/25 hover:text-body'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted/70">
              One field, and it is the difference between a subscriber count and knowing who is
              actually reading.
            </p>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-[filter] hover:brightness-110 sm:w-auto"
          >
            Subscribe
          </button>

          <p className="text-xs leading-relaxed text-muted/70">
            Double opt-in. Unsubscribe in one click from any email. We may show you other
            publications we recommend. Doefin is for professional investors only.
          </p>
        </form>
      )}

      <p className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-caution/40 bg-caution/10 px-2.5 py-1 text-xs font-semibold text-caution">
        <span aria-hidden>●</span> Preview — no provider connected, nothing is stored
      </p>
    </section>
  )
}

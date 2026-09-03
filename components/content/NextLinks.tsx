import Link from 'next/link'

/**
 * Slot S10 — where to go next.
 *
 * Three descriptive links, never "learn more": down to the definition, across to a
 * sibling, forward to the tool or dataset. It sits ABOVE the ask (S11) on purpose —
 * a reader who is not converting should still leave with somewhere to go.
 */
export function NextLinks({ items }: { items: { href: string; label: string; note: string }[] }) {
  if (!items.length) return null
  return (
    <nav aria-labelledby="next-links" className="mt-16 border-t border-white/[0.07] pt-8">
      <h2 id="next-links" className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
        Where to go next
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="group block">
              <span className="block font-semibold leading-snug tracking-[-0.015em] group-hover:text-brand">
                {i.label}
              </span>
              <span className="mt-1 block text-[14px] leading-relaxed text-muted">{i.note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/**
 * Slot S12 — provenance footer. Last element on the page, below the ask.
 *
 * One shared date, not a per-page invention: nothing here has an editorial review
 * cycle yet, and a fabricated per-page date would be worse than an honest shared one.
 */
export const REVIEWED = '2026-08-31'

export function Reviewed({ date = REVIEWED }: { date?: string }) {
  return (
    <p className="mt-12 border-t border-white/[0.07] pt-6 text-xs text-muted/70">
      Last reviewed{' '}
      <time dateTime={date}>
        {new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </time>
      . Figures marked illustrative are placeholders until the data pipeline is connected.
    </p>
  )
}

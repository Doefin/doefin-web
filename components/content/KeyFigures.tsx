import Link from 'next/link'
import type { KeyFigure } from '@/content/types'
import { dateShort } from '@/lib/format'
import { GRADE_LABEL } from '@/lib/masthead'

/**
 * The numbers a piece establishes, lifted out of the prose.
 *
 * This is the block that does the most work on this site. A question-shaped
 * heading with a self-contained numeric answer is the unit a retrieval system
 * lifts; a number buried in the fourth paragraph of a 900-word report is not.
 *
 * Everything renders as HTML text with its units, date and confidence attached,
 * which is the site's governing rule rather than a stylistic preference — a
 * figure that needs JavaScript to appear is invisible to the audience this site
 * exists for.
 *
 * Each figure carries its own date rather than inheriting the article's. A report
 * often cites measurements taken on different days, and flattening them to the
 * publication date would overstate how fresh the older ones are.
 */
export function KeyFigures({ figures, title = 'Key figures' }: { figures?: KeyFigure[]; title?: string }) {
  if (!figures?.length) return null

  return (
    <section className="mt-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">{title}</h2>
      <dl className="mt-4 grid gap-px overflow-hidden rounded-panel border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
        {figures.map((f) => {
          const body = (
            <>
              <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                {f.label}
              </dt>
              <dd className="tabular mt-2 text-2xl font-extrabold tracking-[-0.02em] text-body">
                {f.value}
              </dd>
              <dd className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-muted/80">
                <span className="tabular">
                  <time dateTime={f.asOf}>{dateShort(f.asOf)}</time>
                </span>
                <span aria-hidden>·</span>
                <span>{GRADE_LABEL[f.confidence]}</span>
              </dd>
            </>
          )

          return (
            <div key={f.label} className="bg-surface px-5 py-4">
              {f.href ? (
                <Link href={f.href} className="group block" title={`Check ${f.label.toLowerCase()}`}>
                  <div className="group-hover:[&_dd:first-of-type]:text-brand">{body}</div>
                </Link>
              ) : (
                body
              )}
            </div>
          )
        })}
      </dl>
    </section>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui'
import { site } from '@/lib/site'

/**
 * The one ask on a page whose reader has earned it — slot S11 of the spine.
 *
 * The eligibility line reads `site.entity` rather than naming the company inline,
 * so the legal entity is asserted in exactly one place. It names no regulator: the
 * two FAQ answers that do (app/about, app/for/institutions) are the only ones, and
 * they are wrong pending the correct registered entity.
 */
export function AppCTA({
  title,
  blurb,
}: {
  title: string
  blurb: string
}) {
  return (
    <section
      className="mt-12 rounded-panel border border-brand/25 bg-gradient-to-br from-surface to-surfaceAlt p-8"
      aria-labelledby="next-step"
    >
      <h2 id="next-step" className="text-2xl font-extrabold tracking-[-0.02em]">
        {title}
      </h2>
      <p className="mt-3 max-w-prose text-[16px] leading-[1.7] text-subtle">{blurb}</p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button href={site.appUrl} external>
          Open the app
        </Button>
        <a
          href={`mailto:${site.contactEmail}`}
          className="text-sm font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          Or talk to someone
        </a>
      </div>

      <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs leading-relaxed text-muted">
        {site.entity} offers Doefin to professional investors only. Nothing on this site is
        investment advice or a recommendation, and anyone who is not a professional investor
        should not act on it.
      </p>
    </section>
  )
}

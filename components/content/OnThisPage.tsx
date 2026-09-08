import { blockId, isHeading, type Block } from '@/content/types'

/**
 * Section index for a long article, derived from the body's own headings.
 *
 * Lifted out of the pattern already proven in `components/tools/GuideArticle.tsx`,
 * where the section list was hardcoded. Here it comes from the content, so it
 * cannot drift from the headings it points at.
 *
 * Three deliberate choices:
 *
 * - **In flow, not a rail.** The article column is `max-w-3xl`; a sticky side rail
 *   would either squeeze the measure or force the page wider than the prose cap.
 *   In-flow means one order for every reader and nothing hidden at any breakpoint.
 * - **No scrollspy.** Tracking the reading position needs client JS to restate what
 *   the reader already knows. The list is navigation, not a progress display.
 * - **Silent below the threshold.** Three sections do not need an index, and a
 *   two-item list mostly signals that the page is thin.
 */
export function OnThisPage({ body, min = 4 }: { body: Block[]; min?: number }) {
  const sections = body.filter(isHeading)
  if (sections.length < min) return null

  return (
    <nav aria-label="On this page" className="mt-10 border-y border-white/[0.07] py-5">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">On this page</h2>
      <ol className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
        {sections.map((s, i) => (
          <li key={blockId(s)} className="flex gap-3 text-[15px]">
            <span aria-hidden className="tabular text-muted/60">
              {i + 1}
            </span>
            <a href={`#${blockId(s)}`} className="text-subtle hover:text-brand hover:underline">
              {s.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

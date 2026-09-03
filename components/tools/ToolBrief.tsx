import Link from 'next/link'
import type { ToolMicro } from '@/content'

/**
 * What sits between the page title and the calculator.
 *
 * This block replaced roughly two thousand words. The test it has to pass: someone
 * who has landed on the wrong tool should be able to work that out and leave in
 * about three seconds, and someone on the right one should be able to start
 * dragging without reading anything else.
 */

export function ToolBrief({
  m,
  slug,
  guideTitle,
}: {
  m: ToolMicro
  slug: string
  guideTitle: string
}) {
  return (
    <div className="mt-8">
      <p className="max-w-2xl text-[17px] leading-[1.65] text-body">{m.blurb}</p>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <span className="inline-flex items-start gap-2 rounded-lg border border-up/25 bg-up/[0.07] px-3.5 py-2 text-[13px] leading-snug text-subtle">
          <span aria-hidden className="mt-px font-bold text-up">
            ✓
          </span>
          <span>
            <span className="font-semibold text-body">Use this if </span>
            {m.useIf}
          </span>
        </span>
        <span className="inline-flex items-start gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-3.5 py-2 text-[13px] leading-snug text-muted">
          <span aria-hidden className="mt-px font-bold text-muted">
            ✕
          </span>
          <span>
            <span className="font-semibold text-subtle">Not this if </span>
            {m.notFor}
          </span>
        </span>
      </div>

      <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {m.steps.map((s, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-lg border border-white/[0.07] bg-surface px-4 py-3.5 text-[14px] leading-snug text-subtle"
          >
            <span
              aria-hidden
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand/15 text-[11px] font-bold text-brand"
            >
              {i + 1}
            </span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <p className="mt-5 text-[14px] text-muted">
        Every setting explained, with a worked example —{' '}
        <Link
          href={`/academy/guides/${slug}`}
          className="font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
        >
          {guideTitle}
        </Link>
        .
      </p>
    </div>
  )
}

/**
 * The caveats, collapsed. They matter enough to ship on the tool page and not
 * enough to sit open in front of someone who has not used it yet.
 */
export function ToolWatchOut({ m, slug }: { m: ToolMicro; slug: string }) {
  return (
    <details className="group mt-8 rounded-panel border border-white/[0.07] bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-bold text-body">
          Before you rely on this
          <span className="ml-2 font-normal text-muted">
            {m.watchOut.length} things it does not do
          </span>
        </span>
        <span
          aria-hidden
          className="text-muted transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="border-t border-white/[0.07] px-6 py-5">
        <ul className="space-y-3">
          {m.watchOut.map((w, i) => (
            <li key={i} className="flex gap-3 text-[14px] leading-relaxed text-subtle">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-caution" />
              <span>{w}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-[14px] text-muted">
          <Link
            href={`/academy/guides/${slug}`}
            className="font-semibold text-brand underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
          >
            Read the full guide
          </Link>{' '}
          for where to find each number and what the answer does not cover.
        </p>
      </div>
    </details>
  )
}

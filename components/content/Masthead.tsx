import { getAuthor } from '@/content'
import type { Source } from '@/content/types'
import { dateLong, readingMinutes } from '@/lib/format'
import { GRADE_LABEL, GRADE_NOTE, evidenceGrade, sourceSummary } from '@/lib/masthead'

/**
 * The provenance strip that opens a long-form piece.
 *
 * This is the answer to "every article should have a banner" for a site with no
 * illustrator and no image pipeline. deagentic.ai solves the same problem with a
 * generated panel — a glow, a chip, a bold line and a sentence — but those are
 * three more copy fields per article that restate the headline and cannot be
 * quoted by anything. This carries information instead: who published it, when,
 * how strong the evidence is, and how long it takes to read.
 *
 * Every value is derived, so the cost per future article is zero.
 *
 * It sits above the prose because "can I trust this" is the question a
 * professional reader asks before the first paragraph, not after the last.
 */
export function Masthead({
  author,
  publishedAt,
  sources,
  body,
  eyebrow,
}: {
  author: string
  publishedAt: string
  sources?: Source[]
  body: Array<string | { heading: string }>
  eyebrow?: string
}) {
  const grade = evidenceGrade(sources)
  const summary = sourceSummary(sources)

  return (
    <div className="mt-5 border-y border-white/[0.07] py-4">
      <dl className="flex flex-wrap items-baseline gap-x-8 gap-y-3 text-sm">
        {eyebrow ? (
          <div>
            <dt className="sr-only">Type</dt>
            <dd className="font-semibold uppercase tracking-[0.1em] text-muted">{eyebrow}</dd>
          </div>
        ) : null}

        <div>
          <dt className="sr-only">Published by</dt>
          <dd className="text-subtle">{getAuthor(author).name}</dd>
        </div>

        <div>
          <dt className="sr-only">Published</dt>
          {/* A machine-readable date next to the human one: the publication date
              is part of the claim, not page furniture. */}
          <dd className="tabular text-subtle">
            <time dateTime={publishedAt}>{dateLong(publishedAt)}</time>
          </dd>
        </div>

        {summary ? (
          <div>
            <dt className="sr-only">Evidence</dt>
            <dd className="tabular text-muted">{summary}</dd>
          </div>
        ) : null}

        <div>
          <dt className="sr-only">Reading time</dt>
          <dd className="tabular text-muted">{readingMinutes(body)} min read</dd>
        </div>

        {grade ? (
          <div className="ms-auto">
            <dt className="sr-only">Evidence grade</dt>
            <dd
              title={GRADE_NOTE[grade]}
              className="border border-white/[0.12] px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-muted"
            >
              {GRADE_LABEL[grade]}
            </dd>
          </div>
        ) : null}
      </dl>
    </div>
  )
}

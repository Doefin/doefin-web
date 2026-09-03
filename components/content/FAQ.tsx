import { jsonLd } from '@/lib/seo'

export type QA = { q: string; a: string }

/**
 * Renders a visible question-and-answer section AND the FAQPage schema from the
 * same array, so the two can never drift apart.
 *
 * This matters more than it looks. Marking up questions a visitor cannot see is a
 * spam signal and can earn a manual penalty — the markup must describe what is
 * actually on the page. Always use this component; never hand-write FAQPage schema.
 *
 * Why FAQ sections earn their place here: assistants answer questions. A page that
 * states a question and answers it in one self-contained block is directly
 * retrievable as an answer, which is the whole mechanism behind being cited.
 */
export function FAQ({ items, title = 'Common questions' }: { items: QA[]; title?: string }) {
  if (!items.length) return null
  return (
    <section className="mt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((i) => ({
            '@type': 'Question',
            name: i.q,
            acceptedAnswer: { '@type': 'Answer', text: i.a },
          })),
        })}
      />
      <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{title}</h2>
      <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {items.map((i) => (
          <div key={i.q} className="py-6">
            <dt className="text-lg font-bold leading-snug tracking-[-0.015em] text-body">{i.q}</dt>
            {/* Answers are self-contained on purpose — an assistant lifts this
                paragraph out on its own, so it must make sense alone. */}
            <dd className="mt-2 max-w-prose text-[16px] leading-[1.7] text-subtle">{i.a}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

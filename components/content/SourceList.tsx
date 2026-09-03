import type { Source } from '@/content'

const label: Record<Source['confidence'], string> = {
  measured: 'Measured',
  'single-source': 'Single source',
  judgement: 'Judgement',
}

const tone: Record<Source['confidence'], string> = {
  measured: 'text-up',
  'single-source': 'text-caution',
  judgement: 'text-muted',
}

/**
 * Every claim carries its source and a confidence label. Keeping the distinction
 * visible is what separates a research publication from a blog with numbers in it.
 */
export function SourceList({ sources }: { sources?: Source[] }) {
  if (!sources?.length) return null
  return (
    <section className="mt-12 border-t border-white/[0.07] pt-8">
      <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Sources</h2>
      <ul className="mt-4 space-y-3">
        {sources.map((s, i) => (
          <li key={i} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
            <span className={`text-xs font-bold uppercase tracking-[0.08em] ${tone[s.confidence]}`}>
              {label[s.confidence]}
            </span>
            <span className="text-subtle">
              {s.url ? (
                <a href={s.url} className="text-brand hover:underline">
                  {s.label}
                </a>
              ) : (
                s.label
              )}
            </span>
            <span className="text-xs text-muted/70">read {s.accessedAt}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

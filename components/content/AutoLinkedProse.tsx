import Link from 'next/link'
import { allGlossary } from '@/content'

/**
 * Links the first mention of each glossary term in a body of prose.
 *
 * Internal linking is what turns a pile of pages into a corpus: an article links to
 * the definition, the definition links to the live figure, the figure links to the
 * methodology. Doing it by hand means it stops happening by the third article.
 *
 * Only the first occurrence is linked, so paragraphs stay readable.
 */
export function AutoLinkedProse({ paragraphs, skip = [] }: { paragraphs: string[]; skip?: string[] }) {
  const terms = allGlossary()
    .filter((t) => !skip.includes(t.slug))
    .flatMap((t) => [t.term, ...(t.aliases ?? [])].map((label) => ({ label, slug: t.slug, def: t.shortDef })))
    // Longest first, so "difficulty adjustment" wins over "difficulty".
    .sort((a, b) => b.label.length - a.label.length)

  const used = new Set<string>()

  return (
    <div className="prose-doefin">
      {paragraphs.map((para, pi) => {
        const nodes: React.ReactNode[] = []
        let rest = para
        let guard = 0

        while (rest.length && guard++ < 200) {
          let best: { index: number; label: string; slug: string; def: string } | null = null

          for (const t of terms) {
            if (used.has(t.slug)) continue
            const re = new RegExp(`\\b${t.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
            const m = rest.match(re)
            if (m?.index !== undefined && (best === null || m.index < best.index)) {
              best = { index: m.index, label: rest.slice(m.index, m.index + t.label.length), slug: t.slug, def: t.def }
            }
          }

          if (!best) break
          used.add(best.slug)
          nodes.push(rest.slice(0, best.index))
          nodes.push(
            <Link
              key={`${pi}-${best.slug}`}
              href={`/glossary/${best.slug}`}
              title={best.def}
              className="text-body underline decoration-brand/50 decoration-1 underline-offset-[3px] hover:decoration-brand"
            >
              {best.label}
            </Link>,
          )
          rest = rest.slice(best.index + best.label.length)
        }

        nodes.push(rest)
        return <p key={pi}>{nodes}</p>
      })}
    </div>
  )
}

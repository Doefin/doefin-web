import { allGlossary } from '@/content'
import { isHeading, type Block } from '@/content/types'

/**
 * Which glossary terms a body of prose actually mentions.
 *
 * Lifted out of `components/content/AutoLinkedProse.tsx` so one function decides
 * what a document is about. That matters because the same answer now drives two
 * things that must agree: the links rendered forward into the glossary, and the
 * "where this term is used" list rendered back out of it. Computed twice, they
 * would drift; computed once, reciprocity is guaranteed by construction rather
 * than by remembering.
 *
 * Matching rules, unchanged from the renderer:
 *  - aliases count as mentions of their term
 *  - longest label wins, so "difficulty adjustment" beats "difficulty"
 *  - first occurrence per page only, so prose stays readable
 *  - headings are never matched: a heading is a link target, not a link source
 */

export type TermMatch = { slug: string; block: number; index: number; label: string }

type Candidate = { label: string; slug: string; def: string }

/** Glossary labels, longest first. Exported so the renderer shares the ordering. */
export function termCandidates(skip: string[] = []): Candidate[] {
  return allGlossary()
    .filter((t) => !skip.includes(t.slug))
    .flatMap((t) =>
      [t.term, ...(t.aliases ?? [])].map((label) => ({ label, slug: t.slug, def: t.shortDef })),
    )
    .sort((a, b) => b.label.length - a.label.length)
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Every first-mention match in `body`, in document order. */
export function matchTerms(body: Block[], skip: string[] = []): TermMatch[] {
  const candidates = termCandidates(skip)
  const used = new Set<string>()
  const out: TermMatch[] = []

  body.forEach((block, bi) => {
    if (isHeading(block)) return
    let rest = block
    let offset = 0
    let guard = 0

    while (rest.length && guard++ < 200) {
      let best: (TermMatch & { length: number }) | null = null

      for (const c of candidates) {
        if (used.has(c.slug)) continue
        const m = rest.match(new RegExp(`\\b${escape(c.label)}\\b`, 'i'))
        if (m?.index !== undefined && (best === null || m.index < best.index)) {
          best = {
            slug: c.slug,
            block: bi,
            index: offset + m.index,
            label: rest.slice(m.index, m.index + c.label.length),
            length: c.label.length,
          }
        }
      }

      if (!best) break
      used.add(best.slug)
      out.push({ slug: best.slug, block: best.block, index: best.index, label: best.label })
      const consumed = best.index - offset + best.length
      rest = rest.slice(consumed)
      offset += consumed
    }
  })

  return out
}

/** Just the slugs, which is what the link graph needs. */
export const termsIn = (body: Block[], skip: string[] = []): string[] =>
  matchTerms(body, skip).map((m) => m.slug)

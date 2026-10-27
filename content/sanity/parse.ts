import type { GlossaryTerm } from '../types'

const topics = new Set(['network', 'revenue', 'operations', 'uncertainty'])
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const strings = (v: unknown): v is string[] => Array.isArray(v) && v.every(text)

/** Reject invalid API content instead of publishing partial or misleading pages. */
export function parseGlossary(value: unknown, preview = false): GlossaryTerm[] {
  if (!Array.isArray(value)) throw new Error('Sanity glossary response is not an array')
  const slugs = new Set<string>()
  return value.map((row: unknown) => {
    if (!row || typeof row !== 'object') throw new Error('Invalid Sanity glossary document')
    const t = row as Record<string, unknown>
    if (!text(t._id) || (!preview && /^(drafts|versions)\./.test(t._id)) ||
      !text(t.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t.slug) || slugs.has(t.slug) ||
      !text(t.term) || !text(t.shortDef) || t.shortDef.length >= 160 ||
      !text(t.browseTopic) || !topics.has(t.browseTopic) || !strings(t.body) || !t.body.length ||
      !text(t.updatedAt) || !/^\d{4}-\d{2}-\d{2}$/.test(t.updatedAt) || (Number.isNaN(Date.parse(t.updatedAt)) || new Date(t.updatedAt).toISOString().slice(0, 10) !== t.updatedAt) ||
      (t.domain !== undefined && t.domain !== null && !['network', 'product'].includes(String(t.domain))) ||
      (t.aliases !== undefined && t.aliases !== null && !strings(t.aliases)) ||
      (t.seeAlso !== undefined && t.seeAlso !== null && !strings(t.seeAlso)) ||
      (t.faq !== undefined && t.faq !== null && (!Array.isArray(t.faq) || !t.faq.every(q => q && text(q.q) && text(q.a))))) {
      throw new Error(`Invalid Sanity glossary document: ${String(t._id)}`)
    }
    slugs.add(t.slug)
    return { slug: t.slug, term: t.term, shortDef: t.shortDef, body: t.body,
      browseTopic: t.browseTopic as GlossaryTerm['browseTopic'],
      ...(t.domain ? { domain: t.domain as GlossaryTerm['domain'] } : {}),
      ...(t.aliases ? { aliases: t.aliases as string[] } : {}),
      ...(t.seeAlso ? { seeAlso: t.seeAlso as string[] } : {}),
      ...(t.faq ? { faq: t.faq as GlossaryTerm['faq'] } : {}), updatedAt: t.updatedAt }
  }).map(t => {
    if (t.seeAlso?.some(slug => !slugs.has(slug) || slug === t.slug)) throw new Error(`Invalid glossary references: ${t.slug}`)
    return t
  }).sort((a, b) => a.term.localeCompare(b.term))
}

import { isDocsAnchor, isSafeDocsHref, v3DocGroups } from '../docs-contract'
import type { V3Doc } from '../docs-types'
type Row = Record<string, unknown>
const text = (v: unknown): v is string => typeof v === 'string' && !!v.trim()
const slug = (v: unknown): v is string => text(v) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
const publicId = (v: unknown): v is string => text(v) && !/^(drafts|versions)\./.test(v)
const date = (v: unknown) => v == null || (text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0,10) === v)
/** Lightweight shell read: no authored body needed just to route a curated CTA. */
export function parseDocsManifest(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error('Sanity Docs response is not an array')
  const ids = new Set<string>(), slugs = new Set<string>()
  for (const row of value) {
    if (!row || typeof row !== 'object' || !publicId(row._id) || row._type !== 'docPage' || !slug(row.slug) || ids.has(row._id) || slugs.has(row.slug)) throw new Error('Invalid or duplicate Sanity Docs identity')
    ids.add(row._id); slugs.add(row.slug)
  }
  return [...slugs]
}
/** Published-only collection, with optional recommendations to unpublished Docs
 * filtered rather than turning a reversible unpublish into broken navigation. */
export function parseDocs(value: unknown): V3Doc[] {
  parseDocsManifest(value)
  const rows = value as Row[], byId = new Map(rows.map(row => [row._id as string, row]))
  return rows.map((row): V3Doc => {
    if (!text(row.title) || !text(row.summary) || !v3DocGroups.includes(row.group as V3Doc['group']) || !Number.isInteger(row.sortOrder) || Number(row.sortOrder) < 0 || !date(row.reviewedAt) || (row.reviewDateSource != null && row.reviewDateSource !== 'legacy-shared-review-date') || !Array.isArray(row.sections) || !row.sections.length || (row.related != null && !Array.isArray(row.related))) throw new Error(`Invalid Sanity Docs content: ${row.slug}`)
    const anchors = new Set<string>()
    const sections = row.sections.map((input: unknown) => {
      if (!input || typeof input !== 'object') throw new Error('Invalid Docs section')
      const section = input as Row
      if (!isDocsAnchor(section.id) || anchors.has(section.id) || !text(section.title)) throw new Error('Invalid or duplicate Docs anchor/title')
      anchors.add(section.id)
      const out: V3Doc['sections'][number] = {id: section.id, title: section.title}
      for (const field of ['paragraphs','steps'] as const) {
        if (section[field] != null) {
          if (!Array.isArray(section[field]) || !section[field].length || !section[field].every(text)) throw new Error('Invalid Docs prose/steps')
          out[field] = section[field] as string[]
        }
      }
      if (section.definitions != null) {
        if (!Array.isArray(section.definitions) || !section.definitions.length || !section.definitions.every(d => d && typeof d === 'object' && text(d.term) && text(d.definition))) throw new Error('Invalid Docs definitions')
        out.definitions = section.definitions.map(d => ({term:d.term,definition:d.definition}))
      }
      if (!out.paragraphs && !out.steps && !out.definitions) throw new Error('Empty Docs section')
      return out
    })
    const seen = new Set<string>(), related: string[] = []
    for (const input of (row.related ?? []) as unknown[]) {
      if (!input || typeof input !== 'object') throw new Error('Invalid Docs reference')
      const ref = input as Row
      if (!publicId(ref._ref) || ref._ref === row._id || seen.has(ref._ref) || !Object.hasOwn(ref,'target')) throw new Error('Invalid or duplicate Docs reference')
      seen.add(ref._ref)
      const target = byId.get(ref._ref)
      if (ref.target == null && !target) continue // optional recommendation was unpublished
      const r = ref.target as Row | null
      if (!target || !r || r._id !== ref._ref || r._type !== 'docPage' || r.slug !== target.slug) throw new Error('Broken Docs reference identity')
      related.push(target.slug as string)
    }
    let optionalLinks: V3Doc['optionalLinks']
    if (row.optionalLinks != null) {
      if (!Array.isArray(row.optionalLinks) || !row.optionalLinks.every(link => link && isSafeDocsHref(link.href) && text(link.label))) throw new Error('Invalid or unsafe Docs optional link')
      const hrefs = new Set<string>()
      optionalLinks = row.optionalLinks.map(link => { if (hrefs.has(link.href)) throw new Error('Duplicate Docs optional link'); hrefs.add(link.href); return {href:link.href,label:link.label} })
    }
    return {slug:row.slug as string,title:row.title,summary:row.summary,group:row.group as V3Doc['group'],sortOrder:Number(row.sortOrder),sections,related,
      ...(optionalLinks?.length ? {optionalLinks}:{}),...(row.reviewedAt ? {reviewedAt:row.reviewedAt as string}:{}),...(row.reviewDateSource ? {reviewDateSource:row.reviewDateSource as 'legacy-shared-review-date'}:{})}
  }).sort((a,b) => a.sortOrder-b.sortOrder || a.slug.localeCompare(b.slug))
}

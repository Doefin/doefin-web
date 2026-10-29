import { isResearchAnchor } from '../research-contract'
import type { V3Methodology, V3ResearchReport, V3ResearchSection } from '../research-types'
type Row = Record<string, unknown>
const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const date = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
function sections(value: unknown, min: number, max: number): V3ResearchSection[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new Error('Sanity research sections are incomplete')
  const ids = new Set<string>()
  return value.map(item => {
    if (!item || typeof item !== 'object') throw new Error('Invalid Sanity research section')
    const section = item as Row
    if (!isResearchAnchor(section.id) || ids.has(section.id as string) || !text(section.heading) || !Array.isArray(section.paragraphs) || !section.paragraphs.length || !section.paragraphs.every(text)) throw new Error('Invalid or duplicate Sanity research section')
    ids.add(section.id as string)
    return { id: section.id as string, heading: section.heading, paragraphs: section.paragraphs as string[] }
  })
}
export function parseResearch(value: unknown): { reports: V3ResearchReport[]; methodology: V3Methodology } {
  if (!value || typeof value !== 'object') throw new Error('Sanity research response is not an object')
  const data = value as Row
  if (!Array.isArray(data.reports) || !data.methodology) throw new Error('Sanity research collection is unavailable')
  const slugs = new Set<string>()
  const reports = data.reports.map((raw: unknown): V3ResearchReport => {
    if (!raw || typeof raw !== 'object') throw new Error('Invalid Sanity research report')
    const row = raw as Row
    if (row._type !== 'researchReport' || !text(row._id) || !text(row.slug) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug) || slugs.has(row.slug) || !text(row.title) || !text(row.summary) || (row.seoSummary != null && !text(row.seoSummary)) || !date(row.publishedAt)) throw new Error('Invalid or duplicate Sanity research report')
    slugs.add(row.slug)
    return { slug: row.slug, title: row.title, summary: row.summary, ...(row.seoSummary ? { seoSummary: row.seoSummary as string } : {}), publishedAt: row.publishedAt, sections: sections(row.sections, 1, 20) }
  })
  const method = data.methodology as Row
  if (method._type !== 'researchMethodology' || method.slug !== 'difficulty-index') throw new Error('Sanity research methodology is unavailable')
  return { reports, methodology: { slug: 'difficulty-index', sections: sections(method.sections, 4, 4) } }
}

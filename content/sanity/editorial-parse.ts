import { isEditorialAnchor } from '../editorial-contract'
import type { EditorialTopic, V3EditorialArticle } from '../editorial-types'
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0
const slug = (v: unknown): v is string => text(v) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v)
const date = (v: unknown) => v === undefined || v === null || (text(v) && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v)
const publicId = (v: unknown) => text(v) && !/^(drafts|versions)\./.test(v)
type Row = Record<string, unknown>
export type EditorialSnapshot = { topics: EditorialTopic[]; articles: V3EditorialArticle[] }

/** One published snapshot validates topic identity and every article reference. */
export function parseEditorial(value: unknown): EditorialSnapshot {
  if (!value || typeof value !== 'object') throw new Error('Sanity editorial response is not an object')
  const data = value as Row
  if (!Array.isArray(data.topics) || !Array.isArray(data.articles)) throw new Error('Sanity editorial collections are not arrays')
  const topicIds = new Map<string, EditorialTopic>(), topicSlugs = new Set<string>(), labels = new Set<string>()
  for (const input of data.topics) {
    if (!input || typeof input !== 'object') throw new Error('Invalid Sanity topic')
    const row = input as Row
    if (!publicId(row._id) || row._type !== 'topic' || !slug(row.slug) || !text(row.label) || topicIds.has(row._id as string) || topicSlugs.has(row.slug) || labels.has(row.label.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '-'))) throw new Error('Invalid or duplicate Sanity topic identity')
    const topic = { slug: row.slug, label: row.label }
    topicIds.set(row._id as string, topic); topicSlugs.add(row.slug); labels.add(row.label.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '-'))
  }
  const routes = new Set<string>(), articleIds = new Set<string>()
  const articles = data.articles.map((input: unknown): V3EditorialArticle => {
    if (!input || typeof input !== 'object') throw new Error('Invalid Sanity editorial article')
    const row = input as Row
    if (!publicId(row._id) || row._type !== 'editorialArticle' || articleIds.has(row._id as string) || !['blog', 'academy'].includes(String(row.kind)) || !slug(row.slug) || (row.kind === 'blog' && row.slug === 'tag') || (row.kind === 'academy' && row.slug === 'guides') || !text(row.title) || !text(row.summary) || !Number.isInteger(row.sortOrder) || Number(row.sortOrder) < 0 || !date(row.reviewedAt) || !date(row.publishedAt) || !Array.isArray(row.sections) || !row.sections.length || !Array.isArray(row.topics) || !row.topics.length) throw new Error(`Invalid Sanity editorial article: ${String(row._id)}`)
    const route = `${row.kind}/${row.slug}`
    if (routes.has(route)) throw new Error(`Duplicate editorial route: ${route}`)
    routes.add(route); articleIds.add(row._id as string)
    const seenTopics = new Set<string>()
    const topics = row.topics.map((ref: unknown) => {
      if (!ref || typeof ref !== 'object') throw new Error(`Unpublished or broken topic reference: ${route}`)
      const r = ref as Row, topic = topicIds.get(String(r._id))
      if (!topic || r._type !== 'topic' || r.slug !== topic.slug || r.label !== topic.label || seenTopics.has(String(r._id))) throw new Error(`Invalid editorial topic reference: ${route}`)
      seenTopics.add(String(r._id)); return topic
    })
    const anchors = new Set<string>()
    const sections = row.sections.map((input: unknown) => {
      if (!input || typeof input !== 'object') throw new Error(`Invalid editorial section: ${route}`)
      const section = input as Row
      if (!isEditorialAnchor(section.id) || anchors.has(section.id) || !text(section.heading) || !Array.isArray(section.paragraphs) || !section.paragraphs.length || !section.paragraphs.every(text)) throw new Error(`Invalid or duplicate editorial anchor/content: ${route}`)
      anchors.add(section.id)
      return { id: section.id, heading: section.heading, paragraphs: section.paragraphs as string[] }
    })
    return { kind: row.kind as V3EditorialArticle['kind'], slug: row.slug, title: row.title, summary: row.summary, sortOrder: Number(row.sortOrder), topics, tags: topics.map(topic => topic.label), sections,
      ...(row.reviewedAt ? { reviewedAt: row.reviewedAt as string } : {}), ...(row.publishedAt ? { publishedAt: row.publishedAt as string } : {}), ...(row.reviewDateSource ? { reviewDateSource: String(row.reviewDateSource) } : {}) }
  }).sort((a: V3EditorialArticle, b: V3EditorialArticle) => a.sortOrder - b.sortOrder || a.slug.localeCompare(b.slug))
  return { topics: [...topicIds.values()], articles }
}

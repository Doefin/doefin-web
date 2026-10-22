export type EditorialCoverKind = 'assumptions' | 'windows' | 'general'
export type ArticleLibraryEntry = {
  slug: string; title: string; summary: string; tags: string[]; minutes: number
  reviewedAt: string | null; reviewedLabel: string | null; cover: EditorialCoverKind
}
export const articleTopicPath = (tag: string) => '/v3/blog/tag/' + tag.replace(/\s+/g, '-')
export const articleTopicLabel = (tag: string) => tag[0].toUpperCase() + tag.slice(1)
export const editorialCoverFor = (slug: string): EditorialCoverKind => slug === 'what-a-static-growth-assumption-costs-you' ? 'assumptions' : slug === 'reading-a-hashrate-chart-honestly' ? 'windows' : 'general'
const normalize = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
/** Source order is deliberate; search never invents a date or popularity ranking. */
export function filterArticleLibrary<T extends Pick<ArticleLibraryEntry, 'title' | 'summary' | 'tags'>>(entries: readonly T[], query: string): T[] {
  const needle = normalize(query)
  return entries.filter(entry => normalize([entry.title, entry.summary, ...entry.tags].join(' ')).includes(needle))
}

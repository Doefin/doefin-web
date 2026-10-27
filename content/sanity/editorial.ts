import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseEditorial } from './editorial-parse'
import type { V3EditorialArticle } from '../editorial-types'

export const editorialQuery = `{
  "topics": *[_type == "topic"]{_id,_type,"slug":slug.current,label},
  "articles": *[_type == "editorialArticle"]{_id,_type,kind,"slug":slug.current,title,summary,sortOrder,reviewedAt,publishedAt,reviewDateSource,
    sections[]{id,heading,paragraphs},topics[]->{_id,_type,"slug":slug.current,label}}
}`
/** Published-only, origin API, per-render memoization, no fallback/cache. Optional
 * website preview remains glossary-only; editorial drafts are never requested. */
export const editorialSnapshot = cache(async () => {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', editorialQuery); url.searchParams.set('perspective', 'published')
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(`Sanity editorial content unavailable (${response.status})`)
  return parseEditorial((await response.json()).result)
})
export const allV3Editorial = async (kind: V3EditorialArticle['kind']) => (await editorialSnapshot()).articles.filter(article => article.kind === kind)
export const getV3Editorial = async (kind: V3EditorialArticle['kind'], slug: string) => (await allV3Editorial(kind)).find(article => article.slug === slug)
export const allV3Topics = async () => (await editorialSnapshot()).topics
export const getV3Topic = async (slug: string) => (await allV3Topics()).find(topic => topic.slug === slug)
export const allV3EditorialTopics = async () => {
  const articles = await allV3Editorial('blog')
  return [...new Map(articles.flatMap(article => article.topics).map(topic => [topic.slug, topic])).values()]
}
export const allV3EditorialTags = async () => (await allV3EditorialTopics()).map(topic => topic.label)

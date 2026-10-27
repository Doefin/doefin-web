import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseResearch } from './research-parse'

export const researchQuery = `{
  "reports": *[_type == "researchReport"] | order(publishedAt desc){_id,_type,"slug":slug.current,title,summary,seoSummary,publishedAt,sections[]{id,heading,paragraphs}},
  "methodology": *[_type == "researchMethodology" && slug.current == "difficulty-index"][0]{_id,_type,"slug":slug.current,sections[]{id,heading,paragraphs}}
}`
export const researchSnapshot = cache(async () => {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', researchQuery); url.searchParams.set('perspective', 'published')
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(`Sanity research content unavailable (${response.status})`)
  return parseResearch((await response.json()).result)
})
export const allV3Reports = async () => (await researchSnapshot()).reports
export const getV3Report = async (slug: string) => (await allV3Reports()).find(report => report.slug === slug)
export const getV3Methodology = async (slug: string) => slug === 'difficulty-index' ? (await researchSnapshot()).methodology : undefined

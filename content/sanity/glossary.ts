import 'server-only'
import { cache } from 'react'
import { draftMode } from 'next/headers'
import { glossaryQuery, sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseGlossary } from './parse'

/** One coherent snapshot per server render; no cross-request cache or local fallback.
 * Public reads use the origin API and the explicit published perspective. Publishing,
 * unpublishing or adding a term is visible on the next page request without a build.
 */
export const allGlossary = cache(async () => {
  const preview = (await draftMode()).isEnabled
  const token = preview ? process.env.SANITY_API_READ_TOKEN : undefined
  if (preview && !token) throw new Error('Sanity draft preview is not configured')
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', glossaryQuery)
  url.searchParams.set('perspective', preview ? 'drafts' : 'published')
  const response = await fetch(url, {
    cache: 'no-store', signal: AbortSignal.timeout(10000),
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!response.ok) throw new Error(`Sanity glossary unavailable (${response.status})`)
  const data = await response.json()
  return parseGlossary(data.result, preview)
})

export const getGlossary = async (slug: string) => (await allGlossary()).find(t => t.slug === slug)

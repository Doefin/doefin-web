import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseToolGuides, parseGuideManifest } from './tool-guides-parse'
export const toolGuidesQuery = `*[_type == "toolGuide"]{_id,_type,"slug":slug.current,toolSlug,sortOrder,reviewedAt,article,whatItIs,whoFor,howToUse,inputs,readingResults,walkthrough,mistakes,limits}`
export const toolGuidesManifestQuery = `*[_type == "toolGuide"]{_id,_type,"slug":slug.current}`
async function read(query: string) {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query',query);url.searchParams.set('perspective','published')
  const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)})
  if(!response.ok) throw new Error(`Sanity tool guides unavailable (${response.status})`)
  return (await response.json()).result
}
export const allGuides = cache(async () => parseToolGuides(await read(toolGuidesQuery)))
export const guideFor = async (slug: string) => (await allGuides()).find(row => row.slug === slug)?.guide
export const guidesNavigation = cache(async (): Promise<string[] | null> => {
  try {return parseGuideManifest(await read(toolGuidesManifestQuery))} catch {return null}
})
/** Optional guide recommendations must not take a working calculator offline. */
export const guideDiscovery = cache(async () => {
  try {return {guides:await allGuides(),unavailable:false}} catch {return {guides:[],unavailable:true}}
})

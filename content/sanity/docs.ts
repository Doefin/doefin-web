import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseDocs, parseDocsManifest } from './docs-parse'
export const docsQuery = `*[_type == "docPage"]{_id,_type,"slug":slug.current,title,summary,group,sortOrder,reviewedAt,reviewDateSource,
  sections[]{id,title,paragraphs,steps,definitions[]{term,definition}},optionalLinks[]{href,label},related[]{_ref,"target":@->{_id,_type,"slug":slug.current}}}`
export const docsManifestQuery = `*[_type == "docPage"]{_id,_type,"slug":slug.current}`
async function read(query: string) {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query',query); url.searchParams.set('perspective','published')
  const response = await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)})
  if (!response.ok) throw new Error(`Sanity Docs content unavailable (${response.status})`)
  return (await response.json()).result
}
export const allV3Docs = cache(async () => parseDocs(await read(docsQuery)))
export const getV3Doc = async (slug: string) => (await allV3Docs()).find(doc => doc.slug === slug)
/** Unrelated pages remain usable during a Docs outage. Unknown publication state
 * sends individual guide CTAs to the hub with an explicit unavailable label. */
export const docsNavigation = cache(async (): Promise<string[] | null> => {
  try { return parseDocsManifest(await read(docsManifestQuery)) } catch { return null }
})

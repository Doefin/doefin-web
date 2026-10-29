import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseHomeFaq } from './home-faq-parse'
export const homeFaqQuery = `*[_type == "homeFaqPlacement" && _id == "home-faq-homepage"]{_id,_type,items[]->{_id,_type,question,answer,href,label}}`
export const allHomeFaq = cache(async () => {
 const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
 url.searchParams.set('query', homeFaqQuery); url.searchParams.set('perspective','published')
 const response = await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)})
 if (!response.ok) throw new Error(`Sanity FAQ unavailable (${response.status})`)
 const rows = (await response.json()).result
 if (!Array.isArray(rows)) throw new Error('Sanity FAQ placement unavailable')
 if (rows.length === 0) return []
 return parseHomeFaq(rows.map((row: any) => ({...row, items:(row.items ?? []).filter(Boolean)})))
})

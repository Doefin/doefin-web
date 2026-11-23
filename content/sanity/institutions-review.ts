import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { institutionsReviewId } from '../institutions-review-contract'
import { parseInstitutionsReview } from './institutions-review-parse'
export const institutionsReviewQuery = `*[_type == "institutionsPage" && _id == "${institutionsReviewId}"][0]{_id,_type,visible,eyebrow,heading,intro,riskNote,cards[]{title,summary,disclosureSummary,disclosureParagraphs,links[]{label,href,contactSubject}},stripHeading,stripText,stripLabel,stripSubject}`
export const institutionsReviewSnapshot = cache(async () => {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', institutionsReviewQuery); url.searchParams.set('perspective', 'published')
  const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(10000) })
  if (!response.ok) throw new Error(`Sanity Institutions review content unavailable (${response.status})`)
  return parseInstitutionsReview((await response.json()).result)
})

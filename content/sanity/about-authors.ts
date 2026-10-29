import 'server-only'
import { cache } from 'react'
import { sanityApiVersion, sanityDataset, sanityProjectId } from './config'
import { parseAboutAuthors } from './about-authors-parse'
export const aboutAuthorsQuery=`*[_type == "aboutPage" && _id == "about-doefin"][0]{_id,_type,sections[]{id,heading,paragraphs},"author":author->{_id,_type,slug,kind,name,url,description,metadataDescription,sameAs}}`
export const aboutAuthorsSnapshot=cache(async()=>{
  const url=new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query',aboutAuthorsQuery);url.searchParams.set('perspective','published')
  const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(10000)})
  if(!response.ok)throw new Error(`Sanity About content unavailable (${response.status})`)
  return parseAboutAuthors((await response.json()).result)
})

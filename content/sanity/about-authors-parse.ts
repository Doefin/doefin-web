import { aboutSectionAnchor } from '../about-contract'
import { isSafeDocsHref } from '../docs-contract'
import type { AboutContent } from '../about-types'
import type { Author } from '../authors'
type Row = Record<string, unknown>
const text=(v:unknown):v is string=>typeof v==='string'&&v.trim().length>0
export function parseAboutAuthors(value:unknown):AboutContent {
  if(!value||typeof value!=='object') throw new Error('Sanity About response is not an object')
  const data=value as Row
  if(!Array.isArray(data.sections)||data.sections.length!==3||!data.author||typeof data.author!=='object') throw new Error('Sanity About page is incomplete')
  const ids=new Set<string>()
  const sections=data.sections.map((input:unknown)=>{
    if(!input||typeof input!=='object') throw new Error('Invalid Sanity About section')
    const row=input as Row
    if(!aboutSectionAnchor(row.id)||ids.has(row.id as string)||!text(row.heading)||!Array.isArray(row.paragraphs)||!row.paragraphs.length||!row.paragraphs.every(text)) throw new Error('Invalid or duplicate Sanity About section content')
    ids.add(row.id as string); return {id:row.id as string,heading:row.heading,paragraphs:row.paragraphs as string[]}
  })
  const raw=data.author as Row
  if(raw._id!=='author-doefin-research'||raw._type!=='authorProfile'||raw.slug!=='doefin-research'||!['organization','person'].includes(String(raw.kind))||!text(raw.name)||!isSafeDocsHref(raw.url)||!text(raw.description)||(raw.metadataDescription!==undefined&&raw.metadataDescription!==null&&!text(raw.metadataDescription))||(raw.sameAs!==undefined&&raw.sameAs!==null&&(!Array.isArray(raw.sameAs)||!raw.sameAs.every(value=>text(value)&&/^https:\/\/[^/]/i.test(value))))) throw new Error('Invalid or unpublished Doefin author profile')
  const author:Author={slug:raw.slug as string,kind:raw.kind as Author['kind'],name:raw.name,url:raw.url,description:raw.description,...(raw.metadataDescription?{metadataDescription:raw.metadataDescription as string}:{}),...(raw.sameAs?{sameAs:raw.sameAs as string[]}:{})}
  return {sections,author}
}

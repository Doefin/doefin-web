import { loadTypescript } from './load-typescript.mjs'
import { comparableHref } from './legacy-href.mjs'
const contract = loadTypescript('content/about-contract.ts')
const editorialContract = loadTypescript('content/editorial-contract.ts')
const docsContract = loadTypescript('content/docs-contract.ts', { './editorial-contract': editorialContract })
const aboutSource = loadTypescript('content/v3-research.ts')
const authorSource = loadTypescript('content/authors.ts')
export const aboutSeed = aboutSource.v3AboutSections
export const authorSeed = authorSource.authors
export const aboutDocumentId = contract.aboutId
export const authorDocumentId = slug => `author-${slug}`
export const normalizedAboutAuthorId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id
const text = value => typeof value === 'string' && value.trim().length > 0
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function aboutAuthorDocuments(sections = aboutSeed, authors = authorSeed) {
  if (!Array.isArray(sections) || sections.length !== 3 || !Array.isArray(authors) || authors.length !== 1) throw new Error('Expected the three source About sections and one author profile')
  const anchors = new Set()
  const aboutSections = sections.map((section, index) => {
    const id = contract.aboutAnchor(section.heading)
    if (!text(section.heading) || !contract.aboutSectionAnchor(id) || anchors.has(id) || !Array.isArray(section.paragraphs) || !section.paragraphs.length || !section.paragraphs.every(text)) throw new Error('Invalid or duplicate About section content')
    anchors.add(id)
    return { _key: `section-${index}`, _type: 'aboutSection', id, heading: section.heading, paragraphs: [...section.paragraphs] }
  })
  const authorDocs = authors.map(author => {
    if (!slugPattern.test(author.slug) || !['organization', 'person'].includes(author.kind) || !text(author.name) || !docsContract.isSafeDocsHref(author.url) || !text(author.description) || (author.metadataDescription !== undefined && !text(author.metadataDescription)) || (author.sameAs !== undefined && (!Array.isArray(author.sameAs) || !author.sameAs.every(value=>typeof value==='string'&&/^https:\/\/[^/]/i.test(value))))) throw new Error(`Invalid author profile: ${author?.slug}`)
    return { _id: authorDocumentId(author.slug), _type: 'authorProfile', slug: author.slug, kind: author.kind, name: author.name, url: author.url, description: author.description, ...(author.metadataDescription ? { metadataDescription: author.metadataDescription } : {}), ...(author.sameAs ? { sameAs: [...author.sameAs] } : {}) }
  })
  return { authors: authorDocs, about: { _id: aboutDocumentId, _type: 'aboutPage', sections: aboutSections, author: { _type: 'reference', _ref: authorDocs[0]._id, _weak: true } } }
}
const cmpAuthor = d => ({ _id:d._id,_type:d._type,slug:d.slug,kind:d.kind,name:d.name,url:comparableHref(d.url),description:d.description,metadataDescription:d.metadataDescription??null,sameAs:d.sameAs??null })
const cmpAbout = d => ({ _id:d._id,_type:d._type,sections:d.sections?.map(s=>({id:s.id,heading:s.heading,paragraphs:s.paragraphs})),author:d.author?{_ref:d.author._ref,weak:d.author._weak===true}:null })

export function planAboutAuthorsImport(snapshot, expected = aboutAuthorDocuments()) {
  if (!Array.isArray(snapshot) || snapshot.some(row => !row || !text(row._id) || !text(row._type))) throw new Error('Invalid authenticated raw snapshot')
  const docs = [...expected.authors, expected.about], conflicts=[],changed=[],missing=[]
  for (const doc of docs) {
    const family = snapshot.filter(row => normalizedAboutAuthorId(row._id) === doc._id), canonical = family.find(row => row._id === doc._id)
    if (family.some(row => row._type !== doc._type)) conflicts.push(`${doc._id}: reserved ID occupied by another type`)
    if (!canonical && family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists`)
    if (doc._type === 'authorProfile') {
      const collisions = snapshot.filter(row => (row.slug === doc.slug || row.slug?.current === doc.slug) && normalizedAboutAuthorId(row._id) !== doc._id)
      if (collisions.length) conflicts.push(`${doc._id}: author slug exists under another ID`)
    }
    if (canonical) {
      const compare = doc._type === 'aboutPage' ? cmpAbout : cmpAuthor
      if (JSON.stringify(compare(canonical)) !== JSON.stringify(compare(doc))) changed.push(doc._id)
      if (family.some(row => row._id !== doc._id)) conflicts.push(`${doc._id}: draft/version family exists alongside canonical record`)
    } else if (!family.length) missing.push(doc)
  }
  const expectedIds=new Set(docs.map(doc=>doc._id))
  return { conflicts, changed, missing, unrelated:snapshot.filter(row=>!expectedIds.has(normalizedAboutAuthorId(row._id))).length, snapshotRecords:snapshot.length }
}
export async function runAboutAuthorsImport(client, {apply=false, editorsPaused=false}={}) {
  const config=client.config()
  if(!config.token||config.projectId!=='yzvr33lo'||config.dataset!=='production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  if(apply&&!editorsPaused) throw new Error('A fresh exclusive About/authors editing window is required')
  const started=Date.now()
  const snapshot=await client.withConfig({perspective:'raw',useCdn:false}).fetch('*[]{_id,_type,_rev,slug,kind,name,url,description,metadataDescription,sameAs,sections,author}',{}, {perspective:'raw',cache:'no-store'})
  const plan=planAboutAuthorsImport(snapshot)
  if(plan.conflicts.length) throw new Error(`About/authors import blocked: ${plan.conflicts.join('; ')}`)
  if(plan.changed.length) throw new Error(`Existing About/authors records differ from source; preserve editor work: ${plan.changed.join(', ')}`)
  if(apply&&plan.missing.length){if(Date.now()-started>5000)throw new Error('Preflight snapshot is stale; rerun immediately');let tx=client.transaction();for(const doc of plan.missing)tx=tx.createIfNotExists(doc);await tx.commit({visibility:'sync'})}
  const countsByType={}
  for(const row of snapshot) countsByType[row._type]=(countsByType[row._type]??0)+1
  return {expectedAuthors:expectedCount.author,expectedAboutPages:1,missing:plan.missing.map(d=>d._id),changed:plan.changed,conflicts:plan.conflicts,unrelated:plan.unrelated,snapshotRecords:plan.snapshotRecords,publishedRecords:snapshot.filter(row=>!row._id.startsWith('drafts.')&&!row._id.startsWith('versions.')).length,draftRecords:snapshot.filter(row=>row._id.startsWith('drafts.')).length,versionRecords:snapshot.filter(row=>row._id.startsWith('versions.')).length,countsByType,rawSnapshot:snapshot,created:apply?plan.missing.length:0}
}
const expectedCount={author:authorSeed.length}

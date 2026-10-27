import { getCliClient } from 'sanity/cli'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../..',import.meta.url)))
const args=process.argv.slice(2)
if(!args.includes('--apply')||!args.includes('--editors-paused'))throw new Error('Require --apply and a fresh exclusive editing window (--editors-paused).')
const client=getCliClient({apiVersion:'2025-02-19'}),raw=client.withConfig({perspective:'raw',useCdn:false}),published=client.withConfig({perspective:'published',useCdn:false})
const {aboutAuthorDocuments,planAboutAuthorsImport}=await import('../../scripts/lib/about-authors-migration.mjs')
const expected=aboutAuthorDocuments(), originalRows=JSON.parse(await readFile('work/sanity-about-authors/pre-import-raw-baseline.json','utf8'))
const originalRevisions=new Map(originalRows.map(row=>[row._id,{_type:row._type,_rev:row._rev}]))
async function doc(id,view=raw){return view.fetch('*[_id == $id][0]{_id,_type,_rev,slug,kind,name,url,description,metadataDescription,sameAs,sections,author}',{id},{cache:'no-store'})}
const valueAt=(record,path)=>path==='description'?record.description:record.sections?.[1]?.paragraphs?.[0]
const transitions=[]
async function lifecycle(id,path,sourceDoc,label){
  const base=await doc(id,published)
  if(!base||base._type!==sourceDoc._type)throw new Error(`${label}: published baseline differs from frozen seed`)
  const original=valueAt(base,path)
  if(original!==valueAt(sourceDoc,path))throw new Error(`${label}: published baseline differs from frozen seed`)
  const marker=`[TEMP lifecycle check ${label} 2026-10-27]`
  let draftCreated=false,publishedTemp=false,restored=false
  try{
    await client.action({actionType:'sanity.action.document.edit',draftId:`drafts.${id}`,publishedId:id,patch:{set:{[path]:marker}}})
    draftCreated=true
    const draft=await doc(`drafts.${id}`)
    const duringDraft=await doc(id,published)
    if(!draft||valueAt(draft,path)!==marker||!duringDraft||valueAt(duringDraft,path)!==original||duringDraft._rev!==base._rev)throw new Error(`${label}: draft leaked into published perspective`)
    await client.action({actionType:'sanity.action.document.publish',draftId:`drafts.${id}`,publishedId:id,ifDraftRevisionId:draft._rev,ifPublishedRevisionId:base._rev})
    publishedTemp=true
    const changed=await doc(id,published)
    if(!changed||valueAt(changed,path)!==marker)throw new Error(`${label}: guarded publish did not expose temporary value`)
  } finally {
    const live=await doc(id,published),pending=await doc(`drafts.${id}`)
    if(valueAt(live,path)!==original||pending){
      if(pending&&valueAt(pending,path)!==marker&&valueAt(pending,path)!==original)throw new Error(`${label}: unexpected draft content prevents safe restore`)
      await client.action({actionType:'sanity.action.document.edit',draftId:`drafts.${id}`,publishedId:id,patch:{set:{[path]:original}}})
      const restoreDraft=await doc(`drafts.${id}`),latest=await doc(id,published)
      if(!restoreDraft||valueAt(restoreDraft,path)!==original||!latest)throw new Error(`${label}: exact restore draft was not prepared`)
      await client.action({actionType:'sanity.action.document.publish',draftId:`drafts.${id}`,publishedId:id,ifDraftRevisionId:restoreDraft._rev,ifPublishedRevisionId:latest._rev})
    }
    const final=await doc(id,published),remnant=await doc(`drafts.${id}`)
    if(!final||valueAt(final,path)!==original||remnant)throw new Error(`${label}: restore verification failed`)
    restored=true
  }
  transitions.push({document:id,field:path,draftExcludedFromPublished:true,guardedPublishExposedTemporaryValue:publishedTemp,exactOriginalRestored:restored,draftRevisionGuardUsed:draftCreated,publishedRevisionGuardUsed:true})
}
await lifecycle(expected.about._id,'sections[1].paragraphs[0]',expected.about,'aboutPage')
await lifecycle(expected.authors[0]._id,'description',expected.authors[0],'authorProfile')
const final=await raw.fetch('*[]{_id,_type,_rev,slug,kind,name,url,description,metadataDescription,sameAs,sections,author}',{}, {cache:'no-store'})
const plan=planAboutAuthorsImport(final,expected),changedOriginal=[...originalRevisions].filter(([id,old])=>{const now=final.find(row=>row._id===id);return !now||now._type!==old._type||now._rev!==old._rev}).map(([id])=>id)
if(final.length!==69||final.some(row=>row._id.startsWith('drafts.')||row._id.startsWith('versions.'))||plan.missing.length||plan.changed.length||plan.conflicts.length||changedOriginal.length)throw new Error(`Final restore/parity failed: records=${final.length}, missing=${plan.missing.length}, changed=${plan.changed.length}, conflicts=${plan.conflicts.length}, oldRevisionsChanged=${changedOriginal.length}`)
console.log(JSON.stringify({project:'yzvr33lo',dataset:'production',transitions,final:{published:final.length,drafts:0,versions:0,aboutAuthorParity:'exact',originalRecords:originalRevisions.size,originalRevisionsChanged:0,newIds:['about-doefin','author-doefin-research']}},null,2))

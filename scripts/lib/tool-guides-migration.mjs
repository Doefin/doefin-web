import { loadTypescript } from './load-typescript.mjs'
const contract=loadTypescript('content/tool-guide-contract.ts')
const {parseToolGuides}=loadTypescript('content/sanity/tool-guides-parse.ts',{'../tool-guide-contract':contract})
export const toolGuidesSeed=loadTypescript('content/tool-guides.ts').allGuides()
export const guideId=slug=>`tool-guide-${slug}`
export const normalizedGuideId=id=>id.startsWith('drafts.')?id.slice(7):id.startsWith('versions.')?id.split('.').slice(2).join('.'):id
export function toolGuideMigrationDocuments(seed=toolGuidesSeed) {
  const documents=seed.map(({slug,guide},sortOrder)=>({
    _id:guideId(slug),_type:'toolGuide',canonicalSlug:slug,canonicalToolSlug:slug,slug:{_type:'slug',current:slug},toolSlug:slug,sortOrder,reviewedAt:'2026-08-31',...structuredClone(guide),
    inputs:guide.inputs.map((input,index)=>({_key:`input-${index}`,_type:'inputsEntry',...input})),
    readingResults:guide.readingResults.map((result,index)=>({_key:`result-${index}`,_type:'readingResultsEntry',...result})),
  }))
  parseToolGuides(documents.map(doc=>({...doc,slug:doc.slug.current})))
  return documents
}
const comparison=doc=>({
  _id:doc._id,_type:doc._type,canonicalSlug:doc.canonicalSlug??null,canonicalToolSlug:doc.canonicalToolSlug??null,slug:doc.slug?.current,toolSlug:doc.toolSlug,sortOrder:doc.sortOrder,reviewedAt:doc.reviewedAt??null,
  article:doc.article?{title:doc.article.title,seoTitle:doc.article.seoTitle,summary:doc.article.summary,publishedAt:doc.article.publishedAt??null}:null,
  whatItIs:doc.whatItIs,whoFor:doc.whoFor,howToUse:doc.howToUse,inputs:doc.inputs?.map(({label,means,whereToFind,typical})=>({label,means,whereToFind,typical})),
  readingResults:doc.readingResults?.map(({figure,means,soWhat})=>({figure,means,soWhat})),walkthrough:doc.walkthrough?{title:doc.walkthrough.title,setup:doc.walkthrough.setup,steps:doc.walkthrough.steps,takeaway:doc.walkthrough.takeaway}:null,mistakes:doc.mistakes,limits:doc.limits,
})
export function planToolGuidesImport(snapshot,documents=toolGuideMigrationDocuments()) {
  if(!Array.isArray(snapshot)||snapshot.some(row=>!row||!contract.guideText(row._id)||!contract.guideText(row._type)))throw new Error('Invalid authenticated raw tool guides snapshot')
  parseToolGuides(documents.map(doc=>({...doc,slug:doc.slug.current})))
  const conflicts=[],changed=[],preservedDrafts=[],missing=[]
  for(const doc of documents){
    const family=snapshot.filter(row=>normalizedGuideId(row._id)===doc._id),canonical=family.find(row=>row._id===doc._id)
    if(family.some(row=>row._type!=='toolGuide'))conflicts.push(`${doc._id}: reserved ID occupied by another type`)
    if(!canonical&&family.length)conflicts.push(`${doc._id}: draft/version-only editor work exists`)
    const collisions=snapshot.filter(row=>row._type==='toolGuide'&&row.slug?.current===doc.slug.current&&normalizedGuideId(row._id)!==doc._id)
    if(collisions.length)conflicts.push(`${doc._id}: tool guide slug exists under another ID (including draft/version)`)
    if(canonical){
      if(JSON.stringify(comparison(canonical))!==JSON.stringify(comparison(doc)))changed.push(doc._id)
      if(family.some(row=>row._id!==doc._id))preservedDrafts.push(doc._id)
    }else if(!family.length&&!collisions.length)missing.push(doc)
  }
  return {conflicts,changed,preservedDrafts,missing,unrelated:snapshot.filter(row=>!documents.some(doc=>normalizedGuideId(row._id)===doc._id)).length}
}
export const toolGuidesRawQuery='*[]{_id,_type,_rev,slug,canonicalSlug, _type == "toolGuide" => {canonicalToolSlug,toolSlug,sortOrder,reviewedAt,article,whatItIs,whoFor,howToUse,inputs,readingResults,walkthrough,mistakes,limits}}'
export async function runToolGuidesImport(client,{apply=false,verify=false,editorsPaused=false}={}) {
  const config=client.config()
  if(!config.token||config.projectId!=='yzvr33lo'||config.dataset!=='production')throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  if(!(await client.users.getById('me'))?.id)throw new Error('Cannot establish authenticated CLI user identity')
  if(apply&&!editorsPaused)throw new Error('Obtain a new exclusive tool guides editing window and pass --editors-paused; earlier import windows do not apply')
  const started=Date.now()
  const snapshot=await client.withConfig({perspective:'raw',useCdn:false}).fetch(toolGuidesRawQuery,{},{perspective:'raw',cache:'no-store'})
  const plan=planToolGuidesImport(snapshot)
  if(plan.conflicts.length)throw new Error(`Tool guides import blocked: ${plan.conflicts.join('; ')}`)
  if((apply||verify)&&plan.changed.length)throw new Error(`Existing tool guides differ from seed; preserve editor work: ${plan.changed.join(', ')}`)
  if(verify&&plan.missing.length)throw new Error(`Tool guides parity verification failed: ${plan.missing.length} missing`)
  if(apply&&plan.missing.length){
    if(Date.now()-started>5000)throw new Error('Tool guides preflight snapshot is too old; rerun')
    let transaction=client.transaction()
    for(const doc of plan.missing)transaction=transaction.createIfNotExists(doc)
    await transaction.commit({visibility:'sync'})
  }
  return {seedGuides:toolGuideMigrationDocuments().length,missing:plan.missing.map(doc=>doc._id),changed:plan.changed,preservedDrafts:plan.preservedDrafts,unrelated:plan.unrelated,created:apply?plan.missing.length:0}
}

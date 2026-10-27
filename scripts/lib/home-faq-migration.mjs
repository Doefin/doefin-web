import { loadTypescript } from './load-typescript.mjs'
const contract = loadTypescript('content/home-faq-contract.ts')
export const homeFaqSeed = loadTypescript('content/home-faq.ts').homeFaqSeed
export const faqId = id => id
export const placementId = 'home-faq-homepage'
const valid = item => contract.faqText(item.question) && contract.faqText(item.answer) && contract.faqText(item.label) && contract.safeFaqHref(item.href)
export function homeFaqMigrationDocuments(seed=homeFaqSeed) {
 if (!Array.isArray(seed) || seed.length !== 5 || new Set(seed.map(x=>x.id)).size !== 5 || !seed.every(valid)) throw new Error('Invalid five-item homepage FAQ seed')
 const items=seed.map(x=>({_id:x.id,_type:'faqItem',question:x.question,answer:x.answer,href:x.href,label:x.label}))
 return [...items,{_id:placementId,_type:'homeFaqPlacement',placement:'homepage',items:items.map(x=>({_type:'reference',_ref:x._id,_weak:true}))}]
}
export const normalizedFaqId=id=>id.startsWith('drafts.')?id.slice(7):id.startsWith('versions.')?id.split('.').slice(2).join('.'):id
const comparable=d=>d._type==='faqItem'?{_id:d._id,_type:d._type,question:d.question,answer:d.answer,href:d.href,label:d.label}:{_id:d._id,_type:d._type,placement:d.placement,items:d.items?.map(x=>({_ref:x._ref,weak:x._weak===true}))}
export function planHomeFaqImport(snapshot, documents=homeFaqMigrationDocuments()) {
 if(!Array.isArray(snapshot)||snapshot.some(x=>!x||typeof x._id!=='string'||typeof x._type!=='string')) throw new Error('Invalid authenticated raw FAQ snapshot')
 const ids=new Set(documents.map(x=>x._id)); const conflicts=[],changed=[],missing=[]
 for(const doc of documents){const family=snapshot.filter(x=>normalizedFaqId(x._id)===doc._id),canonical=family.find(x=>x._id===doc._id)
  if(family.some(x=>x._type!==doc._type)) conflicts.push(`${doc._id}: reserved ID occupied by another type`)
  if(!canonical&&family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists`)
  const collision=typeof doc.slug?.current==='string'?snapshot.filter(x=>x._type===doc._type&&normalizedFaqId(x._id)!==doc._id&&x.slug?.current===doc.slug.current):[]
  if(collision.length) conflicts.push(`${doc._id}: duplicate canonical content identity`)
  if(canonical){if(JSON.stringify(comparable(canonical))!==JSON.stringify(comparable(doc))) changed.push(doc._id)} else if(!family.length) missing.push(doc)
 }
 return {conflicts,changed,missing,unrelated:snapshot.filter(x=>!ids.has(normalizedFaqId(x._id))).length}
}
export async function runHomeFaqImport(client,{apply=false,editorsPaused=false}={}){
 const c=client.config(); if(!c.token||c.projectId!=='yzvr33lo'||c.dataset!=='production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
 if(apply&&!editorsPaused) throw new Error('A fresh exclusive FAQ editing window is required')
 const started=Date.now(), snapshot=await client.withConfig({perspective:'raw',useCdn:false}).fetch('*[]{_id,_type,_rev,question,answer,href,label,placement,items}',{}, {perspective:'raw',cache:'no-store'})
 const plan=planHomeFaqImport(snapshot); if(plan.conflicts.length) throw new Error(`FAQ import blocked: ${plan.conflicts.join('; ')}`)
 if(plan.changed.length) throw new Error(`Existing FAQ documents differ from seed; preserve editor work: ${plan.changed.join(', ')}`)
 if(apply&&plan.missing.length){if(Date.now()-started>5000)throw new Error('FAQ preflight snapshot is stale; rerun immediately before import');let tx=client.transaction(); for(const d of plan.missing)tx=tx.createIfNotExists(d);await tx.commit({visibility:'sync'})}
 return {seedItems:5,seedPlacement:1,missing:plan.missing.map(x=>x._id),changed:plan.changed,unrelated:plan.unrelated,created:apply?plan.missing.length:0}
}

import assert from 'node:assert/strict'
import {loadTypescript} from './lib/load-typescript.mjs'
import {toolGuidesSeed,toolGuideMigrationDocuments,planToolGuidesImport,runToolGuidesImport} from './lib/tool-guides-migration.mjs'
import {migrationDocuments,runGlossaryImport} from './lib/glossary-migration.mjs'
import {editorialMigrationDocuments,runEditorialImport} from './lib/editorial-migration.mjs'
import {docsMigrationDocuments,runDocsImport} from './lib/docs-migration.mjs'
const contract=loadTypescript('content/tool-guide-contract.ts')
const {parseToolGuides,parseGuideManifest}=loadTypescript('content/sanity/tool-guides-parse.ts',{'../tool-guide-contract':contract})
const documents=toolGuideMigrationDocuments(),publicRows=documents.map(doc=>({...doc,slug:doc.slug.current}))
assert.equal(documents.length,3);assert.deepEqual(toolGuideMigrationDocuments(),documents)
const parsed=parseToolGuides(publicRows)
assert.deepEqual(parsed.map(({slug,guide})=>({slug,guide})),toolGuidesSeed,'Exact original text/array order/examples/publication dates')
assert(parsed.every(row=>row.reviewedAt==='2026-08-31'),'Preserve actual original shared review footer')
assert.deepEqual(parsed.map(row=>row.slug),['hosting-effective-rate','difficulty-exposure','fleet-payback'])
for(const name of ['formulas','bounds','presets','microcopy','calculatorInputs'])assert(documents.every(doc=>!(name in doc)))
const change=fn=>{const rows=structuredClone(publicRows);fn(rows[0]);return rows}
for(const mutate of [row=>row.slug='bad/slug',row=>row._id='drafts.some-guide',row=>row._id='versions.release.some-guide',row=>row.toolSlug='new-calculator',row=>row.toolSlug='fleet-payback',row=>row.sortOrder=-1,row=>row.article.publishedAt='2026-02-30',row=>row.reviewedAt='today',row=>row.inputs=[],row=>row.inputs[0].label='',row=>row.walkthrough.steps=[],row=>row.limits=null])assert.throws(()=>parseToolGuides(change(mutate)))
assert.throws(()=>parseToolGuides([...publicRows,publicRows[0]]))
assert.deepEqual(parseToolGuides([]),[])
assert.throws(()=>parseGuideManifest([{...publicRows[0],_type:'topic'}]))
const future={...structuredClone(publicRows[0]),_id:'editor-guide-id',slug:'second-hosting-guide',sortOrder:1000};delete future.article.publishedAt;delete future.reviewedAt
assert.equal(parseToolGuides([...publicRows,future]).at(-1).guide.article.publishedAt,undefined)
const hostile='</script><script>globalThis.__guideXss=true</script>'+'x'.repeat(5000)
assert.equal(parseToolGuides(change(row=>row.walkthrough.title=hostile))[0].guide.walkthrough.title,hostile)
const {topics,articles}=editorialMigrationDocuments()
const old58=[...migrationDocuments(),...topics,...articles,...docsMigrationDocuments(),...Array.from({length:12},(_,i)=>({_id:`system-${i}`,_type:'system.group'}))]
assert.equal(old58.length,58)
const initial=planToolGuidesImport(old58)
assert.equal(initial.conflicts.length,0);assert.equal(initial.missing.length,3);assert.equal(initial.unrelated,58)
const first=documents[0]
assert.equal(planToolGuidesImport([{...first,_id:'topic-same',_type:'topic'}]).conflicts.length,0,'Slugs are route-namespace scoped')
for(const row of [{...first,_type:'topic'},{...first,_id:`drafts.${first._id}`},{...first,_id:`versions.release.${first._id}`},{...first,_id:'drafts.alternate'},{...first,_id:'versions.release.alternate'}])assert(planToolGuidesImport([row]).conflicts.length)
assert.deepEqual(planToolGuidesImport([first,{...first,_id:`drafts.${first._id}`}]).preservedDrafts,[first._id])
assert(planToolGuidesImport([{...first,article:{...first.article,title:'Editor work'}}]).changed.length)
let snapshot=structuredClone(old58),mutations=[],commits=0,configSeen,optionsSeen
const client={config:()=>({token:'test-placeholder',projectId:'yzvr33lo',dataset:'production'}),users:{getById:async()=>({id:'test-user'})},withConfig(value){configSeen=value;return this},fetch:async(_q,_p,options)=>{optionsSeen=options;return snapshot},transaction:()=>({createIfNotExists(doc){mutations.push(doc);return this},async commit(options){assert.equal(options.visibility,'sync');snapshot.push(...mutations);mutations=[];commits++}})}
await assert.rejects(runToolGuidesImport({...client,config:()=>({})}),/Authenticated/)
await assert.rejects(runToolGuidesImport({...client,users:{getById:async()=>null}}),/identity/)
await assert.rejects(runToolGuidesImport(client,{apply:true}),/new exclusive/)
assert.equal((await runToolGuidesImport(client,{apply:true,editorsPaused:true})).created,3)
assert.equal(configSeen.perspective,'raw');assert.equal(configSeen.useCdn,false);assert.equal(optionsSeen.perspective,'raw');assert.equal(optionsSeen.cache,'no-store')
assert.deepEqual(snapshot.slice(0,58),old58);assert.equal(snapshot.length,61)
assert.equal((await runToolGuidesImport(client,{apply:true,verify:true,editorsPaused:true})).created,0);assert.equal(commits,1)
// Every existing authenticated verifier accepts the combined61 snapshot.
await runGlossaryImport(client,{verify:true});await runEditorialImport(client,{verify:true});await runDocsImport(client,{verify:true})
snapshot=[{...first,whoFor:'Editor publication'}];await assert.rejects(runToolGuidesImport(client,{apply:true,editorsPaused:true}),/preserve editor/)
snapshot=[{...first,_id:'drafts.other'}];await assert.rejects(runToolGuidesImport(client,{apply:true,editorsPaused:true}),/blocked/)
const realNow=Date.now;let time=0;Date.now=()=>time
try{await assert.rejects(runToolGuidesImport({...client,withConfig(){return {fetch:async()=>{time=6000;return []}}}},{apply:true,editorsPaused:true}),/too old/)}finally{Date.now=realNow}
const identity=loadTypescript('studio/glossaryIdentity.ts'),sanity={defineType:v=>v,defineField:v=>v,defineArrayMember:v=>v}
const schema=loadTypescript('studio/schemaTypes/toolGuide.ts',{sanity,'../../content/tool-guide-contract':contract,'../glossaryIdentity':identity}).toolGuide
const custom=field=>{let callback;const rule={required(){return this},integer(){return this},min(){return this},custom(value){callback=value;return this}};field.validation(rule);return callback}
const field=name=>schema.fields.find(row=>row.name===name)
const context=document=>({document,getClient:()=>({withConfig:()=>({fetch:async()=>[]})})})
assert.notEqual(await custom(field('slug'))({current:'renamed'},context({_id:'drafts.tool-guide-hosting-effective-rate'})),true)
assert.notEqual(await custom(field('toolSlug'))('fleet-payback',context({_id:'drafts.tool-guide-hosting-effective-rate'})),true)
assert.equal(await custom(field('toolSlug'))('hosting-effective-rate',context({_id:'drafts.tool-guide-hosting-effective-rate'})),true)
assert.equal(custom(field('reviewedAt'))(undefined),true);assert.notEqual(custom(field('reviewedAt'))('2026-02-30'),true)
assert.notEqual(custom(field('article').fields.find(row=>row.name==='title'))(''),true)
let draft={_id:'drafts.future-guide',_type:'toolGuide',_rev:'r1',slug:{current:'second-hosting-guide'},toolSlug:'hosting-effective-rate'},delegated=0,failed=[]
const actionClient={withConfig:()=>({fetch:async()=>[draft]}),patch(id){assert.equal(id,draft._id);return {ifRevisionId(rev){assert.equal(rev,draft._rev);return this},setIfMissing(value){this.value=value;return this},async commit(){draft={...this.value,...draft}}}}}
const actionFactory=loadTypescript('studio/permanentSlugPublishAction.ts',{react:{useState:v=>[v,()=>{}]},'@sanity/ui/toast':{useToast:()=>({push:v=>failed.push(v)})},'./glossaryIdentity':identity}).permanentSlugPublishAction
const action=actionFactory(()=>({onHandle(){assert.equal(draft.canonicalToolSlug,'hosting-effective-rate');delegated++}}),{getClient:()=>actionClient})
await action({id:'future-guide'}).onHandle();assert.equal(delegated,1);assert.equal(draft.canonicalSlug,'second-hosting-guide')
draft={...draft,toolSlug:'fleet-payback'};await action({id:'future-guide'}).onHandle();assert.equal(delegated,1);assert.equal(failed.length,1)
draft={_id:'drafts.future-guide',_type:'toolGuide',_rev:'r2',slug:{current:'future'},toolSlug:'hosting-effective-rate'}
const badClient={...actionClient,patch(){return {ifRevisionId(){return this},setIfMissing(){return this},async commit(){throw new Error('Revision conflict')}}}}
await actionFactory(()=>({onHandle(){delegated++}}),{getClient:()=>badClient})({id:'future-guide'}).onHandle();assert.equal(delegated,1);assert.equal(failed.length,2)
const site=loadTypescript('lib/site.ts'),versioning=loadTypescript('lib/versioning.ts')
const links=loadTypescript('lib/docs-links.ts',{'./site':site,'./versioning':versioning})
const {toolGuideLinkState}=loadTypescript('lib/tool-guide-links.ts',{'./docs-links':links})
for(const href of ['/academy/guides/hosting-effective-rate?x=1#settings','https://doefin.com/v3/academy/guides/hosting-effective-rate#settings',{pathname:'/v3/academy/guides/hosting-effective-rate',query:{x:'1'},hash:'settings'}])assert.equal(toolGuideLinkState(href,['hosting-effective-rate']),'published')
assert.equal(toolGuideLinkState('/v3/academy/guides/gone',[]),'missing');assert.equal(toolGuideLinkState('/v3/academy/guides/gone',null),'unavailable');assert.equal(toolGuideLinkState('https://elsewhere.test/v3/academy/guides/gone',[]),undefined)
console.log('Passed3-guide exact source parity, optional dates/hostile prose, permanent slug/tool action+revision guards, namespace/draft/version/all-type import safety, old58 preservation, combined61 verifier compatibility, create-only/idempotence and curated URL policy.')
const config=loadTypescript('content/sanity/config.ts')
const parser={parseToolGuides,parseGuideManifest},requests=[]
const adapter=loadTypescript('content/sanity/tool-guides.ts',{'server-only':{},react:{cache:fn=>fn},'./config':config,'./tool-guides-parse':parser})
const realFetch=globalThis.fetch
try{
 globalThis.fetch=async(input,init)=>{requests.push({url:new URL(input),init});return new Response(JSON.stringify({result:publicRows}),{status:200})}
 assert.equal((await adapter.allGuides()).length,3);assert.equal((await adapter.guideFor('hosting-effective-rate')).article.title,toolGuidesSeed[0].guide.article.title)
 assert.equal(await adapter.guideFor('not-published'),undefined)
 for(const request of requests){assert.equal(request.url.hostname,'yzvr33lo.api.sanity.io');assert.equal(request.url.searchParams.get('perspective'),'published');assert.equal(request.init.cache,'no-store');assert(request.init.signal);assert(!request.init.headers?.Authorization)}
 globalThis.fetch=async()=>new Response('Unavailable',{status:503})
 await assert.rejects(adapter.allGuides(),/unavailable/);assert.equal(await adapter.guidesNavigation(),null);assert.deepEqual(await adapter.guideDiscovery(),{guides:[],unavailable:true})
}finally{globalThis.fetch=realFetch}
console.log('Actual guide reader passed fresh published-only requests, no credentials/local fallback, unknown slug and isolated recommendation/manifest outage behavior.')

/** Real built-route regressions against isolated query-shaped CMS fixtures.
 * No network writes, website-source overrides or production credentials. */
import assert from 'node:assert/strict'
import { mkdir,writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { editorialFixture } from './lib/editorial-fixture.mjs'
const port=Number(process.argv.find(a=>a.startsWith('--port='))?.slice(7)??3061)
assert(Number.isInteger(port)&&port>1024&&port<65536)
await mkdir('work',{recursive:true})
const file=resolve(`work/docs-runtime-${port}.json`),base=`http://127.0.0.1:${port}`,original=editorialFixture()
let fixture=structuredClone(original),output=''
const save=()=>writeFile(file,JSON.stringify(fixture));await save()
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_OPTIONS:`--require=${resolve('scripts/lib/mock-sanity.cjs')}`,DOEFIN_GLOSSARY_TEST_FIXTURE:file},stdio:['ignore','pipe','pipe']})
server.stdout.on('data',b=>{output+=b});server.stderr.on('data',b=>{output+=b})
const get=async(path,status=200)=>{const response=await fetch(base+path,{headers:{'user-agent':'Googlebot'}});assert.equal(response.status,status,path);return response.text()}
const dom=html=>html.replace(/<script[\s\S]*?<\/script>/g,'')
const schemas=html=>[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;')
try{
 for(let attempt=0;;attempt++){try{await fetch(base+'/robots.txt');break}catch{if(attempt>40||server.exitCode!==null)throw new Error(output);await new Promise(r=>setTimeout(r,250))}}
 for(const doc of original.docs){
  const path='/v3/docs/'+doc.slug,html=await get(path),body=dom(html)
  assert(html.includes(`<link rel="canonical" href="https://doefin.com${path}"`));assert(html.includes('<meta name="robots" content="noindex, nofollow"'))
  assert(body.includes('<h1')&&body.includes(esc(doc.title)))
  const dates=[...body.matchAll(/<time\b[^>]*dateTime="([^"]+)"/gi)].map(m=>m[1]);assert.deepEqual(dates,[doc.reviewedAt],path)
  const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,path)
  for(const section of doc.sections){
   assert.equal(ids.filter(id=>id===section.id).length,1);assert(body.includes(`href="#${section.id}"`))
   for(const text of [...section.paragraphs??[],...section.steps??[],...(section.definitions??[]).flatMap(d=>[d.term,d.definition])])assert(body.includes(esc(text)),`${doc.slug}: original content`)
  }
  const crumb=schemas(html).find(s=>s['@type']==='BreadcrumbList');assert.equal(crumb.itemListElement.at(-1).name,doc.title)
  assert(!/article:(?:published|modified)_time/.test(html));assert(!schemas(html).some(s=>s.datePublished||s.dateModified),'Do not infer publication metadata from review')
 }
 await get('/v3/docs/no-published-doc',404)
 const index=dom(await get('/v3/docs'));for(const doc of original.docs)assert(index.includes(`href="/v3/docs/${doc.slug}"`))
 const discovery=await get('/llms.txt');for(const doc of original.docs)assert(discovery.includes(`https://doefin.com/v3/docs/${doc.slug}`))
 const future={...structuredClone(original.docs[0]),_id:'docs-future-guide',slug:'future-guide',title:'Future guide',summary:'A guide published after the build.',group:'Reference',sortOrder:1000,sections:[{id:'original-deep-link',title:'Original heading',paragraphs:['Future paragraph.']}],related:[]}
 delete future.reviewedAt;delete future.reviewDateSource;delete future.related
 fixture.docs.push(future);await save()
 let html=await get('/v3/docs/future-guide');assert(!/<time\b/.test(dom(html)));assert(!schemas(html).some(s=>s.datePublished||s.dateModified));assert(dom(await get('/v3/docs')).includes('/v3/docs/future-guide'));assert((await get('/llms.txt')).includes('/v3/docs/future-guide'))
 future.title='Edited title';future.sections[0].title='Edited heading';future.group='Use the app';future.sortOrder=0;await save()
 html=dom(await get('/v3/docs/future-guide'));assert(html.includes('id="original-deep-link"'));assert(html.includes('href="#original-deep-link"'));assert(html.includes('Edited heading'))
 const hostile='</script><script>globalThis.__docsXssProbe=true</script>'
 future.title=hostile;future.summary=hostile;future.sections[0].paragraphs=[hostile];await save()
 html=await get('/v3/docs/future-guide');assert.equal(schemas(html).find(s=>s['@type']==='BreadcrumbList').itemListElement.at(-1).name,hostile);assert(!html.includes('<script>globalThis.__docsXssProbe'));assert(dom(html).includes('&lt;/script&gt;'))
 for(const id of ['main','v3-mobile-menu','v3-navigation-0','article-body','article-next','docs-content','docs-resources']){
  fixture=structuredClone(original);fixture.docs[0].sections[0].id=id;await save();const body=dom(await get('/v3/docs/overview',500));const ids=[...body.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length)
 }
 fixture=structuredClone(original);fixture.docs[0].sections[1].id=fixture.docs[0].sections[0].id;await save();await get('/v3/docs/overview',500)
 fixture=structuredClone(original);fixture.docs[0].optionalLinks=[{href:'javascript:alert(1)',label:'Unsafe link'}];await save();await get('/v3/docs/overview',500)
 fixture=structuredClone(original)
 fixture.docs=fixture.docs.filter(doc=>doc.slug!=='smart-contracts').map(doc=>({...doc,related:doc.related.map(ref=>ref._ref==='docs-smart-contracts'?{...ref,target:null}:ref)}));await save()
 await get('/v3/docs/smart-contracts',404)
 assert(!(await get('/llms.txt')).includes('/v3/docs/smart-contracts'))
 for(const path of ['/v3','/v3/product','/v3/for/institutions','/v3/resources','/v3/about','/v3/docs/overview']){
  const body=dom(await get(path));assert(!body.includes('href="/v3/docs/smart-contracts"'),path+' absent target');assert(body.includes('data-docs-fallback="missing"'),path+' labeled fallback')
 }
 // Canonical absolute CMS links share relative availability; external origins
 // remain untouched, including matching pathnames on a different host.
 fixture.docs.find(doc=>doc.slug==='overview').optionalLinks=[
  {href:'https://doefin.com/v3/docs/smart-contracts?ref=a#missing-section',label:'Canonical unavailable guide'},
  {href:'https://external.example/v3/docs/smart-contracts?ref=a#missing-section',label:'External guide'},
  {href:'https://doefin.com/v3/docs/key-terms?ref=a#underlying-and-market',label:'Canonical published guide'},
 ];await save()
 let optional=dom(await get('/v3/docs/overview'))
 assert(!optional.includes('href="https://doefin.com/v3/docs/smart-contracts'))
 assert(optional.includes('data-docs-fallback="missing"'))
 assert(optional.includes('href="https://external.example/v3/docs/smart-contracts?ref=a#missing-section"'))
 assert(optional.includes('href="https://doefin.com/v3/docs/key-terms?ref=a#underlying-and-market"'))
 fixture.docsManifestStatus=503;await save();optional=dom(await get('/v3/docs/overview'))
 assert(!optional.includes('href="https://doefin.com/v3/docs/smart-contracts'))
 assert(optional.includes('href="https://doefin.com/v3/docs/key-terms?ref=a#underlying-and-market"'))
 assert(optional.includes('data-docs-fallback="missing"'))
 assert(optional.includes('data-docs-fallback="unavailable"'),'Outside shell retains safe unknown state')
 assert(optional.includes('href="https://external.example/v3/docs/smart-contracts?ref=a#missing-section"'))
 // A healthy validated full Docs snapshot is authoritative inside its layout,
 // even if the independent lightweight shell manifest fails or is malformed.
 for(const manifestState of [{docsManifestStatus:503},{docsManifest:{malformed:true}}]){
  fixture={...structuredClone(original),...manifestState};await save()
  const index=dom(await get('/v3/docs')),overview=dom(await get('/v3/docs/overview'))
  for(const doc of original.docs)assert(index.includes(`href="/v3/docs/${doc.slug}"`),'Healthy body keeps real card/sidebar targets')
  assert(index.includes('<h3'),'Actual card children/labels remain present')
  const article=overview.match(/<article id="docs-content"[^>]*>([\s\S]*?)<\/article>/)[1]
  assert(!article.includes('data-docs-fallback="unavailable"'))
  assert(article.includes('href="/v3/docs/bitcoin-mining-difficulty"'))
  assert(overview.includes('data-docs-fallback="unavailable"'),'Global shell remains unknown')
 }
 fixture=structuredClone(original);fixture.docsStatus=503;await save()
 await get('/v3/docs',500);await get('/v3/docs/overview',500);await get('/llms.txt',500)
 for(const path of ['/v3/privacy','/v3/product','/v3/blog']){const body=dom(await get(path));assert(body.includes('data-docs-fallback="unavailable"'));assert(body.includes('Browse documentation'))}
 fixture=structuredClone(original);fixture.docs[0].sections=null;await save()
 await get('/v3/docs/overview',500);await get('/v3/privacy');await get('/v3/product')
 fixture=structuredClone(original);fixture.docs=[];await save();assert(dom(await get('/v3/docs')).includes('No documentation is currently published'));await get('/v3/docs/overview',404)
 fixture=structuredClone(original);await save()
 await get('/v3/glossary/hashrate');await get('/v3/blog/reading-a-hashrate-chart-honestly');await get('/v3/academy/guides/difficulty-exposure')
 console.log('All18 built Docs parity/anchors/dates, future routes, hostile content, unpublish/discovery/curated fallback, error/empty states and unrelated-route isolation passed.')
}finally{server.kill('SIGTERM')}

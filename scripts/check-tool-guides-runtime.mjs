/** Built Next runtime, mutable local API fixture only; no Sanity writes. */
import assert from 'node:assert/strict'
import {mkdir,writeFile} from 'node:fs/promises'
import {resolve} from 'node:path'
import {spawn} from 'node:child_process'
import {editorialFixture} from './lib/editorial-fixture.mjs'
const port=Number(process.argv.find(arg=>arg.startsWith('--port='))?.slice(7)??3056)
const base=`http://127.0.0.1:${port}`,file=resolve(`work/tool-guides-runtime-${port}.json`),original=editorialFixture()
await mkdir('work',{recursive:true});let fixture=structuredClone(original),output=''
const save=()=>writeFile(file,JSON.stringify(fixture));await save()
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_OPTIONS:`--require=${resolve('scripts/lib/mock-sanity.cjs')}`,DOEFIN_GLOSSARY_TEST_FIXTURE:file},stdio:['ignore','pipe','pipe']})
server.stdout.on('data',b=>output+=b);server.stderr.on('data',b=>output+=b)
const get=async(path,status=200)=>{const res=await fetch(base+path,{headers:{'user-agent':'Googlebot'}});assert.equal(res.status,status,path);return res.text()}
const dom=html=>html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<!--[\s\S]*?-->/g,'')
const schema=html=>[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1])).find(v=>v['@type']==='Article')
const escape=value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#x27;')
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.entries(value).filter(([key])=>!key.startsWith('_')).flatMap(([,v])=>strings(v)):[]
try{
  for(let i=0;;i++){try{await fetch(base+'/robots.txt');break}catch{if(i>40||server.exitCode!==null)throw new Error(output);await new Promise(r=>setTimeout(r,250))}}
  for(const row of original.guides){
    const path='/academy/guides/'+row.slug,html=await get(path),body=dom(html),article=schema(html)
    assert(html.includes(`<link rel="canonical" href="https://doefin.com${path}"`));assert(html.includes('noindex, nofollow'))
    assert.equal(article.headline,row.article.title);assert.equal(article.datePublished,'2026-08-31')
    for(const text of strings({whatItIs:row.whatItIs,whoFor:row.whoFor,howToUse:row.howToUse,inputs:row.inputs,readingResults:row.readingResults,walkthrough:row.walkthrough,mistakes:row.mistakes,limits:row.limits}))assert(body.includes(escape(text)),`Original guide text missing: ${text.slice(0,60)}`)
    for(const id of ['how-to-use','settings','reading','walkthrough','mistakes','limits']){assert.equal((body.match(new RegExp(`id="${id}"`,'g'))??[]).length,1);assert(body.includes(`href="#${id}"`))}
    assert(body.includes('dateTime="2026-08-31"'));assert(body.includes(`/tools/${row.toolSlug}`))
  }
  const future={...structuredClone(fixture.guides[0]),_id:'editor-future',slug:'future-hosting-guide',sortOrder:1000};delete future.article.publishedAt;delete future.reviewedAt
  future.article.title='Future guide';future.walkthrough.title='Changed walkthrough heading'
  fixture.guides.push(future);await save()
  let html=await get('/academy/guides/future-hosting-guide')
  assert.equal(schema(html).datePublished,undefined);assert(!dom(html).includes('<time'));assert(dom(html).includes('id="walkthrough"'));assert(dom(html).includes('/tools/hosting-effective-rate'))
  assert(dom(await get('/academy')).includes('future-hosting-guide'));assert((await get('/llms.txt')).includes('future-hosting-guide'))
  const tool=dom(await get('/tools/hosting-effective-rate'));assert(tool.includes('Read the input guide: What your hosting contract really costs'));assert(!tool.includes('Read the input guide: Future guide'),'Canonical tool recommendation uses exact guide slug regardless of other guide ordering')
  fixture.guides.reverse();await save();assert(dom(await get('/tools/hosting-effective-rate')).includes('Read the input guide: What your hosting contract really costs'))
  future.article.title='Published revision without rebuild';fixture.guides.find(row=>row._id==='editor-future').article.title=future.article.title;await save();assert.equal(schema(await get('/academy/guides/future-hosting-guide')).headline,future.article.title)
  fixture=structuredClone(original);fixture.guides[0].walkthrough.title='</script><script>globalThis.__guideXss=true</script>'+'x'.repeat(5000);await save()
  html=await get('/academy/guides/hosting-effective-rate');assert(!html.includes('</script><script>globalThis.__guideXss'));assert(dom(html).includes('&lt;/script&gt;'));assert(dom(html).includes('overflow-wrap:anywhere'))
  fixture=structuredClone(original);fixture.guidesManifestStatus=503;await save()
  assert(!dom(await get('/academy')).includes('data-guides-fallback'),'Valid full collection overrides shell manifest failure')
  assert(!dom(await get('/tools')).includes('data-guides-fallback'))
  assert(!dom(await get('/resources')).includes('data-guides-fallback'))
  assert(!dom(await get('/tools/hosting-effective-rate')).includes('data-guides-fallback'))
  fixture=structuredClone(original);fixture.guides=fixture.guides.filter(row=>row.slug!=='hosting-effective-rate');await save()
  await get('/academy/guides/hosting-effective-rate',404);assert(!dom(await get('/academy')).includes('What your hosting contract really costs'));assert(!(await get('/llms.txt')).includes('/academy/guides/hosting-effective-rate'))
  for(const path of ['/tools','/resources']){const body=dom(await get(path));assert(body.includes('data-guides-fallback="missing"'));assert(body.includes('Browse calculator guides'));assert(!body.includes('href="/academy/guides/hosting-effective-rate"'))}
  fixture=structuredClone(original);fixture.guides=[];await save();assert(dom(await get('/academy')).includes('No calculator guides are currently published'));await get('/academy/guides/difficulty-exposure',404)
  fixture=structuredClone(original);fixture.guidesStatus=503;await save();await get('/academy/guides/hosting-effective-rate',500)
  assert(dom(await get('/tools/hosting-effective-rate')).includes('Calculator guides are temporarily unavailable'))
  assert(dom(await get('/tools')).includes('data-guides-fallback="unavailable"'));await get('/product');await get('/docs/overview')
  fixture=structuredClone(original);fixture.guides[0].article.publishedAt='2026-02-30';await save();await get('/academy/guides/hosting-effective-rate',500)
  fixture=structuredClone(original);await save();await get('/academy/guides/hosting-effective-rate');await get('/academy/guides/not-published',404)
  if(process.argv.includes('--checks')) {
    for(const [script,args] of [['check-crawlable.mjs',[]],['check-seo.mjs',[]],['check-v3-routes.mjs',['--built']],['check-v3-metadata.mjs',[]]]) {
      await new Promise((resolve,reject)=>{
        const child=spawn(process.execPath,[`scripts/${script}`,...args,`--base=${base}`],{stdio:['ignore','pipe','pipe']});let log=''
        child.stdout.on('data',b=>log+=b);child.stderr.on('data',b=>log+=b)
        child.on('exit',async code=>{await writeFile(`work/tool-guides-${script}.log`,log);code===0?resolve():reject(new Error(`${script}: ${log.slice(-3000)}`))})
      })
      console.log(`Passed ${script} against combined fixture.`)
    }
  }
  console.log('Passed built3-guide full prose/date/anchor/meta parity; future existing-tool guide and updates without rebuild; deterministic canonical recommendation; hostile text; scoped manifest failure; removal/empty/unavailable/discovery/curated fallback. Local fixture evidence only.')
}finally{server.kill('SIGTERM');await new Promise(resolve=>server.once('exit',resolve))}

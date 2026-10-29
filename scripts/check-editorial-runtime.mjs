/** Actual built-route regressions in an isolated fixture server. No Sanity writes. */
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { editorialFixture } from './lib/editorial-fixture.mjs'
const port = Number(process.argv.find(arg => arg.startsWith('--port='))?.slice(7) ?? 3051)
assert(Number.isInteger(port) && port > 1024 && port < 65536)
const base = `http://127.0.0.1:${port}`, file = resolve(`work/editorial-runtime-${port}.json`)
await mkdir('work', {recursive:true})
const original=editorialFixture();let fixture=structuredClone(original)
const save=()=>writeFile(file,JSON.stringify(fixture))
await save()
const server=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{env:{...process.env,NODE_OPTIONS:`--require=${resolve('scripts/lib/mock-sanity.cjs')}`,DOEFIN_GLOSSARY_TEST_FIXTURE:file},stdio:['ignore','pipe','pipe']})
let output='';server.stdout.on('data',b=>{output+=b});server.stderr.on('data',b=>{output+=b})
const get=async(path,status=200)=>{const response=await fetch(base+path,{headers:{'user-agent':'Googlebot'}});assert.equal(response.status,status,path);return response.text()}
const jsonld=html=>[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))
try {
  for(let attempt=0;;attempt++){try{await fetch(base+'/robots.txt');break}catch{if(attempt>40||server.exitCode!==null)throw new Error(output);await new Promise(r=>setTimeout(r,250))}}
  for(const article of original.editorial.articles){
    const path=`/${article.kind}/${article.slug}`,html=await get(path)
    assert(html.includes(`<link rel="canonical" href="https://doefin.com${path}"`))
    const schema=jsonld(html).find(v=>v['@type']==='Article')
    assert.equal(schema.headline,article.title);assert.equal(schema.description,article.summary)
    assert(!schema.datePublished&&!schema.dateModified,'Do not infer publication or modification from review date')
    for(const section of article.sections)assert(html.includes(`id="${section.id}"`),'Stable original heading anchors')
    const dates=[...html.matchAll(/<time\b[^>]*dateTime="([^"]+)"/gi)].map(m=>m[1]);assert.deepEqual(dates,[article.reviewedAt])
  }
  const reservedAnchors = ['main', 'v3-mobile-menu', 'article-body', 'article-next', 'v3-navigation-0', 'v3-navigation-future']
  for (const anchor of reservedAnchors) {
    fixture = structuredClone(original); fixture.editorial.articles[0].sections[0].id = anchor; await save()
    const html = await get('/blog/' + fixture.editorial.articles[0].slug, 500)
    const body = html.replace(/<script[\s\S]*?<\/script>/g, '')
    const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map(match => match[1])
    assert.equal(new Set(ids).size, ids.length, `Rejected ${anchor} must not insert duplicate DOM IDs`)
    assert(!body.includes(`<h2 id="${anchor}"`), 'Invalid CMS heading must never be inserted into the route DOM')
  }
  fixture = structuredClone(original); fixture.editorial.articles[0].sections[1].id = fixture.editorial.articles[0].sections[0].id; await save()
  await get('/blog/' + fixture.editorial.articles[0].slug, 500)
  fixture = structuredClone(original); fixture.editorial.articles[0].sections[0].id = 'custom-stable-anchor'; await save()
  const validAnchorHTML = await get('/blog/' + fixture.editorial.articles[0].slug)
  const validDOM = validAnchorHTML.replace(/<script[\s\S]*?<\/script>/g, '')
  assert.equal((validDOM.match(/\bid="custom-stable-anchor"/g) || []).length, 1)
  assert(validDOM.includes('href="#custom-stable-anchor"'), 'TOC must target the unique CMS heading')
  fixture = structuredClone(original)
  for (const kind of ['blog', 'academy']) {
    const source = original.editorial.articles.find(article => article.kind === kind)
    const undated = { ...structuredClone(source), _id: `editorial-${kind}-undated-${kind}`, slug: `undated-${kind}`, sortOrder: 1000 }
    delete undated.reviewedAt; delete undated.publishedAt; delete undated.reviewDateSource
    fixture.editorial.articles.push(undated)
  }
  await save()
  for (const kind of ['blog', 'academy']) {
    const html = await get(`/${kind}/undated-${kind}`)
    const article = jsonld(html).find(value => value['@type'] === 'Article')
    assert(!article.datePublished && !article.dateModified, 'Undated future records must not inherit seed/global dates')
    assert.equal((html.match(/<time\b/gi) || []).length, 0, 'Undated future record has no fallback review date')
  }
  const undatedFeed = await get('/feed.xml')
  const undatedItem = [...undatedFeed.matchAll(/<item>([\s\S]*?)<\/item>/g)].find(match => match[1].includes('/blog/undated-blog'))
  assert(undatedItem && !undatedItem[1].includes('<pubDate>'), 'Undated Blog feed item has no invented publication date')
  fixture = structuredClone(original); await save()
  for(const topic of original.editorial.topics)await get('/blog/tag/'+topic.slug)
  await get('/academy/guides/difficulty-exposure') // Dedicated academy routes must not swallow retained guides.
  await get('/blog/no-published-article',404);await get('/academy/no-published-article',404);await get('/blog/tag/no-published-topic',404)
  const feed=await get('/feed.xml');assert.equal((feed.match(/<pubDate>/g)||[]).length,1,'Only unchanged local research has a supported publication date')
  const glossary=await get('/glossary/hashrate');assert(glossary.includes('/blog/reading-a-hashrate-chart-honestly'))
  const newTopic={_id:'topic-new-topic',_type:'topic',slug:'new-topic',label:'New topic'}
  const added={...structuredClone(original.editorial.articles[0]),_id:'editorial-blog-new-article',slug:'new-article',title:'New article',summary:'A newly published educational fixture.',sortOrder:1000,topics:[newTopic],sections:[{id:'stable-section',heading:'A stable section',paragraphs:['Network hashrate is an estimate. Review its observation window before comparing values.']}]}
  fixture.editorial.topics.push(newTopic);fixture.editorial.articles.push(added);await save()
  assert((await get('/blog')).includes('data-blog-article="new-article"'))
  assert((await get('/resources')).includes('/blog/new-article'))
  assert((await get('/blog/tag/new-topic')).includes('/blog/new-article'))
  assert((await get('/blog/new-article')).includes('/glossary/hashrate'))
  assert((await get('/glossary/hashrate')).includes('/blog/new-article'),'Current article prose drives glossary return links')
  assert((await get('/feed.xml')).includes('/blog/new-article'))
  assert((await get('/llms.txt')).includes('/blog/new-article'))
  fixture.editorial.topics.at(-1).label='Renamed topic label';fixture.editorial.articles.at(-1).topics[0].label='Renamed topic label';await save()
  const renamed=await get('/blog/tag/new-topic');assert(renamed.includes('Renamed topic label'));assert(renamed.includes('href="/blog/tag/new-topic"'))
  await get('/blog/tag/renamed-topic-label',404)
  fixture.editorial.articles.at(-1).sections[0].heading='Edited heading text';await save()
  assert((await get('/blog/new-article')).includes('id="stable-section"'),'Heading edits preserve stored anchor')
  for(const article of fixture.editorial.articles)article.reviewedAt='2025-04-12'
  await save()
  for(const article of fixture.editorial.articles){const html=await get(`/${article.kind}/${article.slug}`);assert.deepEqual([...html.matchAll(/<time\b[^>]*dateTime="([^"]+)"/gi)].map(m=>m[1]),['2025-04-12'])}
  const hostile='</script><script>globalThis.__editorialXssProbe=1</script>'
  fixture.editorial.articles.at(-1).title=hostile;fixture.editorial.articles.at(-1).summary=hostile;await save()
  for(const path of ['/blog','/blog/new-article','/blog/tag/new-topic','/academy']){
    const html=await get(path);jsonld(html);assert(!html.includes('<script>globalThis.__editorialXssProbe=1</script>'))
    if(path==='/blog/new-article')assert.equal(jsonld(html).find(v=>v['@type']==='Article').headline,hostile)
  }
  assert((await get('/feed.xml')).includes('&lt;/script&gt;'))
  fixture.editorial.articles.pop();await save();await get('/blog/new-article',404)
  assert(!(await get('/blog')).includes('data-blog-article="new-article"'))
  assert(!(await get('/feed.xml')).includes('/blog/new-article'))
  assert(!(await get('/llms.txt')).includes('/blog/new-article'))
  assert(!(await get('/glossary/hashrate')).includes('/blog/new-article'))
  fixture.editorial.topics.pop();await save();await get('/blog/tag/new-topic',404)
  fixture.editorial.articles = fixture.editorial.articles.filter(article => !['how-difficulty-adjustment-works','reading-a-hashrate-chart-honestly'].includes(article.slug));await save()
  assert(!(await get('/')).includes('href="/blog/reading-a-hashrate-chart-honestly"'),'Unpublished featured article must not leave a dead homepage CTA')
  assert(!(await get('/glossary')).includes('href="/academy/how-difficulty-adjustment-works"'),'Unpublished lesson must not leave a dead glossary sidebar CTA')
  fixture.editorial={topics:[],articles:[]};await save()
  assert((await get('/blog')).includes('No articles have been published yet.'))
  assert((await get('/academy')).includes('No Academy lessons have been published yet.'))
  await get('/blog/'+original.editorial.articles[0].slug,404)
  fixture.editorial=null;await save();await get('/blog',500)
  console.log('Passed actual built editorial/topic routes: source parity, preserved guides/anchors/dates, new topic+article without rebuild, stable label/URL split, current graph/feed/llms, hostile JSON-LD, removal404, empty and malformed CMS. Isolated fixtures only; no live CMS mutations.')
} finally {if(server.exitCode===null){server.kill('SIGTERM');await new Promise(r=>server.once('exit',r))}}

import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
import { editorialFixture } from './lib/editorial-fixture.mjs'
import { editorialSeed, editorialAnchor } from './lib/editorial-migration.mjs'
const contract = loadTypescript('content/editorial-contract.ts')
const parser = loadTypescript('content/sanity/editorial-parse.ts', {'../editorial-contract': contract})
const fixture = editorialFixture().editorial
const view = parser.parseEditorial(fixture)
assert.equal(view.topics.length, 4); assert.equal(view.articles.length, 5)
for (const [i, original] of editorialSeed.entries()) {
  const article = view.articles[i]
  assert.equal(article.kind, original.kind); assert.equal(article.slug, original.slug)
  assert.equal(article.title, original.title); assert.equal(article.summary, original.summary)
  assert.deepEqual(article.tags, original.tags)
  assert.deepEqual(article.sections, original.sections.map(section => ({ id: editorialAnchor(section.heading), ...section })))
  assert.equal(article.reviewedAt, original.reviewedAt ?? '2026-10-19')
  assert(!article.publishedAt, 'No inferred publication date')
}
const clone = () => JSON.parse(JSON.stringify(fixture))
for (const mutate of [
  value => { value.articles[0].topics[0] = null },
  value => { value.topics[0]._id = 'drafts.private-topic' },
  value => { value.articles[0]._id = 'drafts.private-article' },
  value => { value.topics.push({ ...value.topics[0], _id: 'duplicate-id' }) },
  value => { value.articles.push({ ...value.articles[0], _id: 'duplicate-route' }) },
  value => { value.articles[0].topics[0]._type = 'glossaryTerm' },
  value => { value.articles[0].sections[1].id = value.articles[0].sections[0].id },
  value => { value.articles[0].reviewedAt = '2026-02-31' },
  value => { value.articles[0].kind = 'research' },
  value => { value.articles[0].sortOrder = -1 },
]) { const value=clone(); mutate(value); assert.throws(() => parser.parseEditorial(value)) }
for (const reserved of [...contract.reservedEditorialAnchors, 'v3-navigation-0', 'v3-navigation-future']) {
  const value = clone(); value.articles[0].sections[0].id = reserved
  assert.throws(() => parser.parseEditorial(value), /anchor/, `Reject template/shell collision ${reserved}`)
}
assert.deepEqual(parser.parseEditorial({ topics: [], articles: [] }), { topics: [], articles: [] })
const renamed = clone(); renamed.topics[0].label = 'Changed label';
for (const article of renamed.articles) for (const topic of article.topics) if (topic._id === renamed.topics[0]._id) topic.label = 'Changed label'
const renamedView = parser.parseEditorial(renamed)
assert.equal(renamedView.topics[0].slug, view.topics[0].slug, 'Label edits preserve stored URL identity')
assert.equal(renamedView.articles[0].tags[0], 'Changed label')
const config = loadTypescript('content/sanity/config.ts')
let result = fixture, status = 200, options, url
const realFetch = globalThis.fetch
globalThis.fetch = async (input, init) => { url = new URL(input); options=init; return new Response(JSON.stringify({result}), {status}) }
const adapter = loadTypescript('content/sanity/editorial.ts', {'server-only':{}, react:{cache:fn=>fn}, './config':config,'./editorial-parse':parser})
try {
  assert.equal((await adapter.allV3Editorial('blog')).length,2)
  assert.equal(url.searchParams.get('perspective'),'published'); assert.equal(options.cache,'no-store'); assert(!options.headers)
  assert.equal(await adapter.getV3Editorial('academy','missing'),undefined)
  assert.equal(await adapter.getV3Topic('unknown'),undefined)
  const extra={...fixture.articles[0],_id:'new-article',slug:'future-slug',sortOrder:1000}
  result={...fixture,articles:[...fixture.articles,extra]}
  assert.equal((await adapter.getV3Editorial('blog','future-slug')).slug,'future-slug')
  result={topics:[],articles:[]};assert.deepEqual(await adapter.allV3Editorial('blog'),[],'No local fallback for empty dataset')
  status=503;await assert.rejects(adapter.editorialSnapshot(),/unavailable/)
  status=200;result=null;await assert.rejects(adapter.editorialSnapshot(),/not an object/)
} finally {globalThis.fetch=realFetch}
const {renderEditorialFeed}=loadTypescript('lib/editorial-feed.ts',{'./site':{site:{url:'https://doefin.com',name:'Doefin',description:'Test'}}})
const xml=renderEditorialFeed(view.articles.filter(a=>a.kind==='blog'),[{slug:'unchanged-research',title:'Research',summary:'Existing feed source',publishedAt:'2026-08-01'}])
assert.equal((xml.match(/<pubDate>/g)??[]).length,1,'Review dates must not become publication dates')
assert(xml.includes('unchanged-research'));assert(xml.includes(view.articles[0].title))
console.log('Passed editorial source parity, topics/anchors/references, date semantics, published/empty/error/new-slug source behavior and feed publication metadata.')

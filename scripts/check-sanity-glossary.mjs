import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
import { seed, migrationDocuments, idFor } from './lib/glossary-migration.mjs'
const config = loadTypescript('content/sanity/config.ts')
const parser = loadTypescript('content/sanity/parse.ts')
const rows = seed.map(t => ({ _id: idFor(t.slug), ...t }))
const parsed = parser.parseGlossary(rows)
assert.equal(parsed.length, 19)
assert.deepEqual(parsed, [...seed].sort((a, b) => a.term.localeCompare(b.term)), 'Migration preserves all source content and topic assignments')
const docs = migrationDocuments()
assert.deepEqual(migrationDocuments(), docs, 'Migration is deterministic on rerun')
assert(docs.every(d => !d._id.includes('.') && d._type === 'glossaryTerm'), 'Seed IDs must be public and scoped')
for (const doc of docs) for (const ref of doc.seeAlso ?? []) assert(docs.some(d => d._id === ref._ref), 'Every strong reference resolves')
assert.deepEqual(Object.fromEntries(['network', 'revenue', 'operations', 'uncertainty'].map(t => [t, parsed.filter(d => d.browseTopic === t).length])), { network: 7, revenue: 7, operations: 3, uncertainty: 2 })
assert(parsed.every(t => !t.domain), 'Migration must not invent network/product classifications')
const extra = { ...rows[0], _id: 'new-term', slug: 'new-term', term: 'New term', seeAlso: [] }
assert(parser.parseGlossary([...rows, extra]).some(t => t.slug === 'new-term'), 'New terms need no slug mapping in components')
for (const malformed of [null, {}, [{ ...rows[0], browseTopic: 'unknown' }], [...rows, rows[0]], [{ ...rows[0], _id: 'drafts.test' }], [{ ...rows[0], _id: 'versions.release.test' }], [{ ...rows[0], seeAlso: ['missing-term'] }], [{ ...rows[0], shortDef: 'a'.repeat(160) }], [{ ...rows[0], faq: [{ q: 'Question', a: '' }] }]]) {
  assert.throws(() => parser.parseGlossary(malformed), 'Invalid public content must fail closed')
}
assert.deepEqual(parser.parseGlossary([]), [], 'Empty dataset is distinct from unavailable data')
const { termsIn } = loadTypescript('lib/terms.ts', { '@/content/types': { isHeading: b => typeof b !== 'string' } })
assert.deepEqual(termsIn([{ heading: 'Hashrate' }, 'The difficulty adjustment changes mining difficulty. Hashrate follows.'], parsed), ['difficulty-adjustment', 'mining-difficulty', 'hashrate'])
assert.deepEqual(termsIn(['Network hashrate and hashrate again.'], parsed), ['hashrate'], 'Aliases share first-mention rules')

let preview = false
const originalFetch = globalThis.fetch
const originalToken = process.env.SANITY_API_READ_TOKEN
let reply = rows, status = 200, calls = []
globalThis.fetch = async (url, options) => { calls.push({ url: new URL(url), options }); return new Response(JSON.stringify({ result: reply }), { status }) }
const { allGlossary, getGlossary } = loadTypescript('content/sanity/glossary.ts', {
  'server-only': {}, react: { cache: f => f }, 'next/headers': { draftMode: async () => ({ isEnabled: preview }) }, './config': config, './parse': parser,
})
try {
  process.env.SANITY_API_READ_TOKEN = 'test-only-placeholder'
  assert.equal((await allGlossary()).length, 19)
  assert.equal(calls[0].url.hostname, 'yzvr33lo.api.sanity.io')
  assert.equal(calls[0].url.searchParams.get('perspective'), 'published')
  assert.equal(calls[0].options.cache, 'no-store')
  assert(!calls[0].options.headers.Authorization, 'Public requests never send a token')
  assert.equal(await getGlossary('does-not-exist'), undefined)
  reply = [...rows, extra]
  assert.equal((await getGlossary('new-term')).term, 'New term', 'Fresh published source serves a term added after build')
  reply = []
  assert.deepEqual(await allGlossary(), [], 'No seed fallback when dataset is empty')
  status = 503
  await assert.rejects(allGlossary(), /unavailable/, 'No seed fallback on API failure')
  status = 200; reply = null
  await assert.rejects(allGlossary(), /not an array/)
  preview = true
  delete process.env.SANITY_API_READ_TOKEN
  await assert.rejects(allGlossary(), /not configured/)
  process.env.SANITY_API_READ_TOKEN = 'test-only-placeholder'
  reply = [{ ...extra, _id: 'drafts.new-term' }]
  assert.equal((await allGlossary())[0].slug, 'new-term')
  assert.equal(calls.at(-1).url.searchParams.get('perspective'), 'drafts')
  assert.equal(calls.at(-1).options.cache, 'no-store')
  assert(calls.at(-1).options.headers.Authorization)
} finally {
  globalThis.fetch = originalFetch
  if (originalToken === undefined) delete process.env.SANITY_API_READ_TOKEN
  else process.env.SANITY_API_READ_TOKEN = originalToken
}
console.log('Passed glossary migration fidelity, public IDs/references, taxonomy, matching, new terms, missing/empty/unavailable data, and published/draft isolation.')

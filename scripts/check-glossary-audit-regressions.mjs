import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
import { editorialMigrationDocuments } from './lib/editorial-migration.mjs'
import { migrationDocuments, planGlossaryImport, runGlossaryImport } from './lib/glossary-migration.mjs'

const { jsonLd } = loadTypescript('lib/seo.ts', { './site': { site: { url: 'https://doefin.com' } }, './versioning': { versionedPath: p => p } })
const hostile = '</script><script>globalThis.__glossaryXssProbe=true</script>'
const serialized = jsonLd({ term: hostile, shortDef: hostile, faq: [{ q: hostile, a: hostile }] }).__html
assert(!serialized.includes('<'), 'JSON-LD must contain no HTML opening delimiter')
assert.deepEqual(JSON.parse(serialized), { term: hostile, shortDef: hostile, faq: [{ q: hostile, a: hostile }] }, 'Escaping must preserve exact content after JSON decoding')

const docs = migrationDocuments(), first = docs[0]
for (const snapshot of [
  [{ ...first, _id: `drafts.${first._id}` }],
  [{ ...first, _id: 'drafts.editor-work' }],
  [{ ...first, _id: 'versions.release.editor-work' }],
  [{ ...first, _type: 'unrelatedType' }],
]) assert(planGlossaryImport(snapshot).conflicts.length, 'Draft-only identities and alternate-ID slug collisions block import')
const pair = [{ ...first }, { ...first, _id: `drafts.${first._id}`, term: 'Unpublished edit' }]
const plan = planGlossaryImport(pair)
assert.equal(plan.conflicts.length, 0)
assert(!plan.missing.some(d => d._id === first._id), 'Published/draft pairs are never overwritten')
assert.deepEqual(plan.preservedDrafts, [first.slug.current])
let rawConfig, rawOptions, writes = [], committed = false
const client = {
  config: () => ({ token: 'test-user-placeholder', projectId: 'yzvr33lo', dataset: 'production' }),
  users: { getById: async () => ({ id: 'authenticated-test-user' }) },
  withConfig: config => { rawConfig = config; return client },
  fetch: async (_query, _params, options) => { rawOptions = options; return [] },
  transaction: () => ({ createIfNotExists(doc) { writes.push(doc); return this }, async commit(options) { assert.equal(options.visibility, 'sync'); committed = true } }),
}
await assert.rejects(runGlossaryImport({ ...client, config: () => ({}) }), /Authenticated/)
await assert.rejects(runGlossaryImport({ ...client, users: { getById: async () => null } }), /identity/)
await assert.rejects(runGlossaryImport(client, { apply: true }), /Pause glossary editing/)
await assert.rejects(runGlossaryImport({ ...client, withConfig: () => ({ fetch: async () => [{ ...first, _id: 'drafts.editor-work' }] }) }, { apply: true, editorsPaused: true }), /Import blocked/)
assert.equal(writes.length, 0, 'No writes after conflict or missing authentication')
const applied = await runGlossaryImport(client, { apply: true, editorsPaused: true })
assert.equal(applied.created, 19)
assert.equal(writes.length, 19)
assert(writes.every(d => d._type === 'glossaryTerm'))
assert(committed)
assert.equal(rawConfig.perspective, 'raw')
assert.equal(rawConfig.useCdn, false)
assert.equal(rawOptions.perspective, 'raw')
// Run the actual SDK reconciliation path with the completed mixed CMS corpus.
const editorialDocuments = editorialMigrationDocuments()
const internalRecords = Array.from({ length: 12 }, (_, index) => ({ _id: `_.internal-${index}`, _type: index === 11 ? 'system.retention' : 'system.group' }))
const mixedCorpus = [...docs, ...editorialDocuments.topics, ...editorialDocuments.articles, ...internalRecords]
assert.equal(mixedCorpus.length, 40)
let mixedRows = mixedCorpus, namespaceMutations = 0
const mixedSDK = { ...client,
  withConfig(config) { assert.equal(config.perspective, 'raw'); assert.equal(config.useCdn, false); return mixedSDK },
  async fetch(query, _params, options) {
    assert(query.trimStart().startsWith('*[]'), 'Preflight must retain other-type canonical-ID conflicts')
    assert.equal(options.perspective, 'raw'); return structuredClone(mixedRows)
  },
  transaction() { namespaceMutations++; throw new Error('Read-only verify must never mutate') },
}
const mixedResult = await runGlossaryImport(mixedSDK, { verify: true })
assert.deepEqual(mixedResult.missing, []); assert.deepEqual(mixedResult.changed, []); assert.equal(mixedResult.created, 0)
assert.equal(mixedResult.additional, 21, 'Four topics, five articles and twelve internal records remain unrelated')
const hashrate = docs.find(doc => doc.slug.current === 'hashrate')
// A valid arbitrary-ID Blog article may use the same slug in its own route namespace.
mixedRows = mixedCorpus.map(row => row._id === editorialDocuments.articles[0]._id
  ? { ...row, _id: 'independent-blog-hashrate', canonicalSlug: 'hashrate', slug: { current: 'hashrate' } } : row)
await runGlossaryImport(mixedSDK, { verify: true })
for (const id of ['other-glossary-hashrate', 'drafts.other-glossary-hashrate', 'versions.release.other-glossary-hashrate']) {
  mixedRows = [...mixedCorpus, { ...hashrate, _id: id }]
  await assert.rejects(runGlossaryImport(mixedSDK, { verify: true }), /Import blocked:.*glossary slug/, `Real glossary duplicate ${id} must still block`)
}
for (const id of [hashrate._id, `drafts.${hashrate._id}`, `versions.release.${hashrate._id}`]) {
  mixedRows = [...mixedCorpus.filter(row => row._id !== id), { ...hashrate, _id: id, _type: 'topic' }]
  await assert.rejects(runGlossaryImport(mixedSDK, { verify: true }), /Import blocked:.*another document type/, `Other type occupying canonical family ${id} must block`)
}
for (const id of [`drafts.${hashrate._id}`, `versions.release.${hashrate._id}`]) {
  mixedRows = [...mixedCorpus.filter(row => row._id !== hashrate._id), { ...hashrate, _id: id }]
  await assert.rejects(runGlossaryImport(mixedSDK, { verify: true }), /Import blocked:.*draft\/version-only/, 'Draft/version-only glossary counterpart must still block')
}
assert.equal(namespaceMutations, 0, 'All mixed-corpus verification paths are read-only')
const now = Date.now
let clock = 0
Date.now = () => clock
try {
  await assert.rejects(runGlossaryImport({ ...client, withConfig: () => ({ fetch: async () => { clock = 6000; return [] } }) }, { apply: true, editorsPaused: true }), /too old/)
} finally { Date.now = now }

const identity = loadTypescript('studio/glossaryIdentity.ts')
const schema = loadTypescript('studio/schemaTypes/glossaryTerm.ts', {
  sanity: { defineType: x => x, defineField: x => x, defineArrayMember: x => x }, '../glossaryIdentity': identity,
}).glossaryTerm
let validator
schema.fields.find(field => field.name === 'slug').validation({ required() { return this }, custom(fn) { validator = fn; return this } })
const context = doc => ({ document: doc, getClient: () => ({ withConfig: () => ({ fetch: async () => [] }) }) })
assert.notEqual(await validator({ current: 'renamed' }, context({ _id: 'drafts.glossary-hashrate' })), true, 'Actual imported-term validator blocks rename after unpublish')
assert.equal(await validator({ current: 'hashrate' }, context({ _id: 'drafts.glossary-hashrate' })), true)
let draft = { _id: 'drafts.new-editor-id', _rev: 'r1', slug: { current: 'first-url' } }, stamp
const identityClient = {
  withConfig: () => ({ fetch: async () => [draft] }),
  patch(id) { assert.equal(id, draft._id); return { ifRevisionId(rev) { assert.equal(rev, 'r1'); return this }, setIfMissing(value) { stamp = value; return this }, async commit() { draft = { ...draft, ...stamp } } } },
}
let delegated = false
const actionFactory = loadTypescript('studio/permanentSlugPublishAction.ts', {
  react: { useState: x => [x, () => {}] }, '@sanity/ui/toast': { useToast: () => ({ push: () => assert.fail('Unexpected publish error') }) }, './glossaryIdentity': identity,
}).permanentSlugPublishAction
const action = actionFactory(() => ({ label: 'Publish', onHandle() { assert.equal(draft.canonicalSlug, 'first-url'); delegated = true } }), { getClient: () => identityClient })
await action({ id: 'new-editor-id' }).onHandle()
assert(delegated, 'Actual publish wrapper stamps before invoking built-in Publish')
assert.notEqual(await validator({ current: 'renamed' }, context(draft)), true, 'Actual arbitrary-ID validator blocks unpublish → rename → republish')
assert.equal(await validator({ current: 'first-url' }, context(draft)), true, 'Unpublish preserves ability to republish same URL')
const studioConfig = loadTypescript('studio/sanity.config.ts', {
  sanity: { defineConfig: value => value }, 'sanity/structure': { structureTool: () => ({}) },
  './permanentSlugPublishAction': { permanentSlugPublishAction: actionFactory }, './schemaTypes/glossaryTerm': { glossaryTerm: schema },
  './schemaTypes/docPage': { docPage: {name:'docPage'} },
  './schemaTypes/topic': { topic: { name: 'topic' } }, './schemaTypes/editorialArticle': { editorialArticle: { name: 'editorialArticle' } },
}).default
const defaultActions = ['publish', 'duplicate', 'restore', 'unpublish'].map(name => Object.assign(() => ({ label: name }), { action: name }))
assert.deepEqual(studioConfig.document.actions(defaultActions, { schemaType: 'glossaryTerm', getClient: () => identityClient }).map(action => action.action), ['publish', 'unpublish'], 'Actual Studio config disables duplicate and restore paths that could erase permanent identity')
assert.equal(studioConfig.releases.enabled, false)
assert.equal(studioConfig.scheduledDrafts.enabled, false)
console.log('Passed audit regressions: hostile JSON-LD roundtrip; authenticated raw draft/version-aware import; no-write conflicts; fresh-snapshot guard; actual publish action and actual slug validator across unpublish.')

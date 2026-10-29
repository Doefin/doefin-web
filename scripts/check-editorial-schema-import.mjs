import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
import { editorialSeed, editorialMigrationDocuments, planEditorialImport, runEditorialImport, articleId, topicId } from './lib/editorial-migration.mjs'

const documents = editorialMigrationDocuments()
assert.equal(documents.topics.length, 4)
assert.equal(documents.articles.length, 5)
assert.deepEqual(editorialMigrationDocuments(), documents, 'Seed generation must be deterministic')
const { blockId } = loadTypescript('content/types.ts')
for (const [index, original] of editorialSeed.entries()) {
  const imported = documents.articles[index]
  assert.equal(imported._id, articleId(original.kind, original.slug))
  assert.equal(imported.slug.current, original.slug)
  assert.equal(imported.title, original.title)
  assert.equal(imported.summary, original.summary)
  assert.equal(imported.sortOrder, index)
  assert.deepEqual(imported.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs })), original.sections, 'Every heading/paragraph and their order survive import')
  assert.deepEqual(imported.sections.map(section => section.id), original.sections.map(section => blockId({ heading: section.heading })), 'Initial anchors match existing rendered anchors')
  assert.deepEqual(imported.topics.map(ref => documents.topics.find(topic => topic._id === ref._ref)?.label), original.tags, 'Topic references preserve source tag labels and order')
  assert.equal(imported.reviewedAt, original.reviewedAt ?? '2026-10-19')
  assert.equal(imported.reviewDateSource, original.reviewedAt ? undefined : 'legacy-shared-review-date')
  assert(!('publishedAt' in imported) && !('author' in imported), 'Do not invent attribution or publication dates')
  assert(!imported._id.includes('.'))
  assert(imported.topics.every(ref => ref._type === 'reference' && !ref._weak))
}
const ambiguous = [...editorialSeed, { ...editorialSeed[0], slug: 'a-new-copy', tags: ['Difficulty'] }]
assert.throws(() => editorialMigrationDocuments(ambiguous), /Ambiguous topic/)
assert.throws(() => editorialMigrationDocuments([{ ...editorialSeed[0], slug: 'tag' }]), /Invalid/)
assert.throws(() => editorialMigrationDocuments([{ ...editorialSeed[2], slug: 'guides' }]), /Invalid/)
assert.throws(() => editorialMigrationDocuments([{ ...editorialSeed[0], sections: [{ heading: 'Same', paragraphs: ['Text'] }, { heading: 'Same!', paragraphs: ['Other'] }] }]), /anchor/)

const firstTopic = documents.topics[0], firstArticle = documents.articles[0]
const unrelated = [{ _id: 'glossary-hashrate', _type: 'glossaryTerm', slug: { current: 'hashrate' }, term: 'Preserved glossary' }, { _id: '_.retention', _type: 'system.retention' }]
const initial = planEditorialImport(unrelated)
assert.equal(initial.conflicts.length, 0, 'Topic/glossary slug namespaces may overlap')
assert.equal(initial.unrelated, 2)
for (const snapshot of [
  [{ ...firstTopic, _id: `drafts.${firstTopic._id}` }],
  [{ ...firstArticle, _id: `drafts.${firstArticle._id}` }],
  [{ ...firstTopic, _id: 'drafts.topic-editor-id' }],
  [{ ...firstArticle, _id: 'versions.release.editor-article' }],
  [{ ...firstTopic, _type: 'glossaryTerm' }],
  [{ ...firstArticle, _type: 'unrelatedType' }],
  [{ ...firstTopic, _id: 'other-topic', slug: { current: 'different' }, label: firstTopic.label.toUpperCase() }],
]) assert(planEditorialImport(snapshot).conflicts.length, 'Draft/version/ID/slug/label ambiguity blocks import')
const pair = [{ ...firstArticle }, { ...firstArticle, _id: `drafts.${firstArticle._id}`, summary: 'Editor draft must remain untouched' }]
const paired = planEditorialImport(pair)
assert.equal(paired.conflicts.length, 0)
assert(!paired.missingArticles.some(doc => doc._id === firstArticle._id))
assert.deepEqual(paired.preservedDrafts, [firstArticle._id])
assert.throws(() => planEditorialImport([], { topics: documents.topics, articles: [{ ...firstArticle, topics: [{ _ref: 'missing-topic' }] }] }), /Unsafe.*references/)

let snapshot = [...unrelated], writes = [], committed = 0, configRead, fetchOptions
const client = {
  config: () => ({ token: 'test-user-placeholder', projectId: 'yzvr33lo', dataset: 'production' }),
  users: { getById: async () => ({ id: 'authenticated-test-user' }) },
  withConfig(config) { configRead = config; return this },
  fetch: async (_query, _params, options) => { fetchOptions = options; return snapshot },
  transaction: () => ({ createIfNotExists(doc) { writes.push(doc); return this }, async commit(options) { assert.equal(options.visibility, 'sync'); committed++; snapshot = [...snapshot, ...writes]; writes = [] } }),
}
await assert.rejects(runEditorialImport({ ...client, config: () => ({}) }), /Authenticated/)
await assert.rejects(runEditorialImport(client, { apply: true }), /new exclusive/)
let result = await runEditorialImport(client, { apply: true, editorsPaused: true })
assert.equal(result.created, 9)
assert.equal(result.unrelated, 2)
assert.equal(configRead.perspective, 'raw')
assert.equal(configRead.useCdn, false)
assert.equal(fetchOptions.perspective, 'raw')
assert.deepEqual(snapshot.slice(0, 2), unrelated, 'Existing glossary/internal records remain byte-for-byte unchanged')
assert.deepEqual(snapshot.slice(2, 6).map(doc => doc._type), ['topic', 'topic', 'topic', 'topic'], 'Topic create operations precede article reference creations')
result = await runEditorialImport(client, { apply: true, verify: true, editorsPaused: true })
assert.equal(result.created, 0, 'Second import is idempotent')
assert.equal(committed, 1, 'No mutation transaction for fully existing seeds')
snapshot = [{ ...firstArticle, summary: 'Existing editor publication' }]
await assert.rejects(runEditorialImport(client, { apply: true, editorsPaused: true }), /preserve editor work/)
assert.equal(committed, 1)
snapshot = [{ ...firstArticle, _id: 'drafts.another-id' }]
await assert.rejects(runEditorialImport(client, { apply: true, editorsPaused: true }), /import blocked/)
assert.equal(committed, 1)
const realNow = Date.now
let time = 0
Date.now = () => time
try {
  await assert.rejects(runEditorialImport({ ...client, withConfig() { return { fetch: async () => { time = 6000; return [] } } } }, { apply: true, editorsPaused: true }), /too old/)
} finally { Date.now = realNow }

const identity = loadTypescript('studio/glossaryIdentity.ts')
const sanity = { defineType: value => value, defineField: value => value, defineArrayMember: value => value }
const topicSchema = loadTypescript('studio/schemaTypes/topic.ts', { sanity, '../glossaryIdentity': identity }).topic
const anchorContract = loadTypescript('content/editorial-contract.ts')
const articleSchema = loadTypescript('studio/schemaTypes/editorialArticle.ts', { sanity, '../glossaryIdentity': identity, '../../content/editorial-contract': anchorContract }).editorialArticle
const validator = (schema, field) => {
  let callback
  const rule = { required() { return this }, min() { return this }, unique() { return this }, custom(fn) { callback = fn; return this } }
  schema.fields.find(item => item.name === field).validation(rule)
  return callback
}
const noRowsContext = document => ({ document, getClient: () => ({ withConfig: () => ({ fetch: async () => [] }) }) })
const topicSlugValidator = validator(topicSchema, 'slug')
assert.notEqual(await topicSlugValidator({ current: 'renamed' }, noRowsContext({ _id: 'drafts.topic-hashrate', _type: 'topic' })), true, 'Actual topic validator locks imported URL after unpublish')
const articleSlugValidator = validator(articleSchema, 'slug'), kindValidator = validator(articleSchema, 'kind')
assert.notEqual(await articleSlugValidator({ current: 'new-url' }, noRowsContext({ _id: 'drafts.editorial-blog-old-url', _type: 'editorialArticle', kind: 'blog' })), true)
assert.notEqual(await kindValidator('academy', noRowsContext({ _id: 'drafts.editorial-blog-old-url', _type: 'editorialArticle', kind: 'academy' })), true, 'Kind cannot change route after imported article unpublish')
assert.notEqual(await articleSlugValidator({ current: 'tag' }, noRowsContext({ _id: 'drafts.new', _type: 'editorialArticle', kind: 'blog' })), true)
assert.notEqual(await articleSlugValidator({ current: 'guides' }, noRowsContext({ _id: 'drafts.new', _type: 'editorialArticle', kind: 'academy' })), true)
const equivalentTopic = validator(topicSchema, 'label')
assert.notEqual(await equivalentTopic(' MINING ECONOMICS ', { document: { _id: 'drafts.new-topic' }, getClient: () => ({ withConfig: () => ({ fetch: async () => [{ _id: 'topic-mining-economics', label: 'mining economics' }] }) }) }), true)
const uniqueSlug = topicSchema.fields.find(field => field.name === 'slug').options.isUnique
assert.equal(await uniqueSlug('difficulty', { document: { _id: 'drafts.new-topic', _type: 'topic' }, getClient: () => ({ withConfig: () => ({ fetch: async () => [{ _id: 'versions.release.other-topic' }] }) }) }), false, 'Actual slug uniqueness sees release versions')
const uniqueArticleSlug = articleSchema.fields.find(field => field.name === 'slug').options.isUnique
assert.equal(await uniqueArticleSlug('same-slug', { document: { _id: 'drafts.new-article', _type: 'editorialArticle', kind: 'blog' }, getClient: () => ({ withConfig: () => ({ fetch: async () => [{ _id: 'academy-other', kind: 'academy' }] }) }) }), true, 'Different route kinds are distinct namespaces')
const topicRefs = validator(articleSchema, 'topics')
const refContext = rows => ({ getClient: () => ({ withConfig: config => { assert.equal(config.perspective, 'published'); return { fetch: async () => rows } } }) })
assert.equal(await topicRefs([{ _ref: 'topic-difficulty' }], refContext([{ _id: 'topic-difficulty', _type: 'topic' }])), true)
assert.notEqual(await topicRefs([{ _ref: 'topic-difficulty' }], refContext([{ _id: 'drafts.topic-difficulty', _type: 'topic' }])), true, 'Draft-only topic cannot satisfy published article references')
assert.notEqual(await topicRefs([{ _ref: 'topic-difficulty' }], refContext([{ _id: 'topic-difficulty', _type: 'glossaryTerm' }])), true)
assert.notEqual(await topicRefs([{ _ref: 'topic-difficulty', _weak: true }], refContext([])), true)
const sectionSchema = articleSchema.fields.find(field => field.name === 'sections').of[0]
const sectionAnchorValidator = validator(sectionSchema, 'id')
for (const reserved of [...anchorContract.reservedEditorialAnchors, 'v3-navigation-0', 'v3-navigation-future']) {
  assert.notEqual(sectionAnchorValidator(reserved), true, `Actual Studio anchor validator rejects ${reserved}`)
}
assert.equal(sectionAnchorValidator('custom-stable-anchor'), true)
assert.notEqual(validator(articleSchema, 'sections')([{ id: 'same' }, { id: 'same' }]), true)

let draft = { _id: 'drafts.new-article-id', _type: 'editorialArticle', _rev: 'r1', slug: { current: 'first-url' }, kind: 'blog' }, stamp, delegated = false
const actionClient = {
  withConfig: () => ({ fetch: async () => [draft] }),
  patch(id) { assert.equal(id, draft._id); return { ifRevisionId(rev) { assert.equal(rev, draft._rev); return this }, setIfMissing(value) { stamp = value; return this }, async commit() { draft = { ...stamp, ...draft } } } },
}
const actionFactory = loadTypescript('studio/permanentSlugPublishAction.ts', {
  react: { useState: value => [value, () => {}] }, '@sanity/ui/toast': { useToast: () => ({ push: () => assert.fail('Unexpected publish error') }) }, './glossaryIdentity': identity,
}).permanentSlugPublishAction
const publish = actionFactory(() => ({ label: 'Publish', onHandle() { assert.equal(draft.canonicalSlug, 'first-url'); assert.equal(draft.canonicalKind, 'blog'); delegated = true } }), { getClient: () => actionClient })
await publish({ id: 'new-article-id' }).onHandle()
assert(delegated, 'Actual normal publish action stamps slug and kind before delegation')
assert.notEqual(await articleSlugValidator({ current: 'renamed' }, noRowsContext(draft)), true)
assert.notEqual(await kindValidator('academy', noRowsContext(draft)), true, 'Arbitrary-ID kind remains fixed after unpublish')
assert.equal(await kindValidator('blog', noRowsContext(draft)), true)
const config = loadTypescript('studio/sanity.config.ts', { sanity: { defineConfig: value => value }, 'sanity/structure': { structureTool: () => ({}) }, './permanentSlugPublishAction': { permanentSlugPublishAction: actionFactory }, './schemaTypes/glossaryTerm': { glossaryTerm: {} }, './schemaTypes/toolGuide': { toolGuide: {} }, './schemaTypes/faqItem': { faqItem: {} }, './schemaTypes/homeFaqPlacement': { homeFaqPlacement: {} }, './schemaTypes/docPage': {docPage:{}}, './schemaTypes/topic': { topic: topicSchema }, './schemaTypes/editorialArticle': { editorialArticle: articleSchema } }).default
for (const type of ['glossaryTerm', 'topic', 'editorialArticle']) {
  const actions = ['publish', 'duplicate', 'restore', 'unpublish'].map(name => Object.assign(() => ({ label: name }), { action: name }))
  assert.deepEqual(config.document.actions(actions, { schemaType: type, getClient: () => actionClient }).map(action => action.action), ['publish', 'unpublish'])
}
console.log('Passed editorial seed fidelity/anchors/dates, topic identities, safe draft-aware create-only import and idempotence, existing-record preservation, actual schema references/uniqueness, and publish/unpublish slug+kind permanence.')

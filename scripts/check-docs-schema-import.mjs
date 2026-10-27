import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
import { docsSeed, docsMigrationDocuments, docsId, planDocsImport, runDocsImport } from './lib/docs-migration.mjs'
import { migrationDocuments as glossaryDocuments } from './lib/glossary-migration.mjs'
import { editorialMigrationDocuments } from './lib/editorial-migration.mjs'

const editorialContract = loadTypescript('content/editorial-contract.ts')
const contract = loadTypescript('content/docs-contract.ts', { './editorial-contract': editorialContract })
const documents = docsMigrationDocuments()
assert.equal(documents.length, 18)
assert.deepEqual(docsMigrationDocuments(), documents, 'Docs seed generation is deterministic')
assert.deepEqual(Object.fromEntries(contract.v3DocGroups.map(group => [group, documents.filter(doc => doc.group === group).length])), { 'Understand Doefin': 6, 'Use the app': 8, Reference: 4 })
assert.equal(documents.filter(doc => doc.reviewDateSource === 'legacy-shared-review-date').length, 13)
for (const [order, original] of docsSeed.entries()) {
  const doc = documents[order]
  assert.equal(doc._id, docsId(original.slug))
  assert.equal(doc.slug.current, original.slug)
  assert.equal(doc.title, original.title)
  assert.equal(doc.summary, original.summary)
  assert.equal(doc.group, original.group)
  assert.equal(doc.sortOrder, order, 'Preserve allV3Docs reading order, not source array order')
  assert.equal(doc.reviewedAt, original.reviewedAt ?? '2026-10-19')
  assert.equal(doc.reviewDateSource, original.reviewedAt ? undefined : 'legacy-shared-review-date')
  assert(!('publishedAt' in doc) && !('author' in doc), 'No invented publication or attribution metadata')
  assert.deepEqual(doc.sections.map(({ id, title, paragraphs, steps, definitions }) => ({
    title, ...(paragraphs ? { paragraphs } : {}), ...(steps ? { steps } : {}), ...(definitions ? { definitions: definitions.map(({ term, definition }) => ({ term, definition })) } : {}),
  })), original.sections, 'All original paragraph/step/definition text and ordering survive')
  assert.deepEqual(doc.sections.map(section => section.id), original.sections.map(section => contract.docsSectionId(section.title)), 'Preserve existing section anchors')
  assert.deepEqual(doc.optionalLinks?.map(({ href, label }) => ({ href, label })), original.optionalLinks)
  assert.deepEqual(doc.related.map(ref => ref._ref), original.related.map(docsId))
  assert(doc.related.every(ref => ref._weak === true && ref._type === 'reference'), 'Recommendations are intentionally weak so targets can unpublish independently')
}
const modified = change => docsSeed.map((doc, index) => index === 0 ? change(structuredClone(doc)) : structuredClone(doc))
// Browsers normalize these into site destinations; reject the ambiguous input
// in the actual importer and Studio field before navigation can bypass filtering.
const ambiguousDocsHrefs = [
  'https:doefin.com/v3/docs/gone',
  'https:/doefin.com/v3/docs/gone',
  'https:///doefin.com/v3/docs/gone',
  '/v3/%2e%2e/v3/docs/smart-contracts',
  '/v3/docs/%2e/smart-contracts',
]
for (const href of ambiguousDocsHrefs) {
  assert.throws(() => docsMigrationDocuments(modified(doc => ({ ...doc, optionalLinks: [{ href, label: 'Ambiguous destination' }] }))), `Importer rejects browser-normalized destination ${href}`)
}
for (const seed of [
  modified(doc => ({ ...doc, group: 'Other' })),
  modified(doc => ({ ...doc, sections: [{ title: 'Main', paragraphs: ['Text'] }] })),
  modified(doc => ({ ...doc, sections: [{ title: 'Docs content', paragraphs: ['Text'] }] })),
  modified(doc => ({ ...doc, sections: [{ title: 'A title', paragraphs: ['Text'] }, { title: 'A title!', steps: ['Step'] }] })),
  modified(doc => ({ ...doc, sections: [{ title: 'Empty' }] })),
  modified(doc => ({ ...doc, sections: [{ title: 'Definitions', definitions: [{ term: 'Term', definition: '' }] }] })),
  modified(doc => ({ ...doc, optionalLinks: [{ href: 'javascript:alert(1)', label: 'Unsafe' }] })),
  modified(doc => ({ ...doc, optionalLinks: [{ href: '/v3/tools', label: 'First' }, { href: '/v3/tools', label: 'Different label, same destination' }] })),
  modified(doc => ({ ...doc, related: ['missing-doc'] })),
  modified(doc => ({ ...doc, related: [doc.slug] })),
]) assert.throws(() => docsMigrationDocuments(seed), 'Malformed Docs seeds fail before any write')
const { topics, articles } = editorialMigrationDocuments()
const unrelated = [...glossaryDocuments(), ...topics, ...articles, ...Array.from({ length: 12 }, (_, index) => ({ _id: `system-${index}`, _type: index === 11 ? 'system.retention' : 'system.group' }))]
assert.equal(unrelated.length, 40)
const first = documents[0]
const initial = planDocsImport(unrelated)
assert.equal(initial.conflicts.length, 0)
assert.equal(initial.missing.length, 18)
assert.equal(initial.unrelated, 40)
assert.equal(planDocsImport([{ _id: 'topic-overview', _type: 'topic', slug: { current: 'overview' } }]).conflicts.length, 0, 'Only Docs route namespace shares uniqueness')
for (const snapshot of [
  [{ ...first, _id: `drafts.${first._id}` }],
  [{ ...first, _id: `versions.release.${first._id}` }],
  [{ ...first, _id: 'drafts.editor-doc' }],
  [{ ...first, _id: 'versions.release.editor-doc' }],
  [{ ...first, _type: 'glossaryTerm' }],
  [{ ...first, _id: `drafts.${first._id}`, _type: 'unrelatedType' }],
]) assert(planDocsImport(snapshot).conflicts.length, 'Raw draft/version/wrongtype/alternate-ID collisions block import')
const pair = [{ ...first }, { ...first, _id: `drafts.${first._id}`, title: 'Editor draft must survive' }]
const paired = planDocsImport(pair)
assert.deepEqual(paired.preservedDrafts, [first._id])
assert(planDocsImport([{ ...first, related: first.related.map(ref => ({ ...ref, _type: 'notReference' })) }]).changed.includes(first._id), 'Parity checks include related-reference types as well as targets and weakness')
assert(!paired.missing.some(doc => doc._id === first._id))
assert.throws(() => planDocsImport([], [{ ...first, related: [{ _ref: 'missing-target', _weak: true }] }]), /Unsafe Docs seed/)
assert.throws(() => planDocsImport([], documents.map((doc, index) => index === 0 ? { ...doc, related: [{ _ref: documents[1]._id, _weak: false }] } : doc)), /Unsafe Docs seed/)

let snapshot = structuredClone(unrelated), pending = [], ledger = [], commits = 0, rawConfig, fetchOptions
const client = {
  config: () => ({ token: 'test-user-placeholder', projectId: 'yzvr33lo', dataset: 'production' }),
  users: { getById: async () => ({ id: 'authenticated-test-user' }) },
  withConfig(value) { rawConfig = value; return this },
  fetch: async (_query, _params, options) => { fetchOptions = options; return snapshot },
  transaction: () => ({ createIfNotExists(doc) { pending.push(doc); return this }, async commit(options) {
    assert.equal(options.visibility, 'sync'); commits++; ledger.push(...pending.map(doc => doc._id)); snapshot = [...snapshot, ...pending]; pending = []
  } }),
}
await assert.rejects(runDocsImport({ ...client, config: () => ({}) }), /Authenticated/)
await assert.rejects(runDocsImport({ ...client, users: { getById: async () => null } }), /identity/)
await assert.rejects(runDocsImport(client, { apply: true }), /new exclusive Docs/)
let result = await runDocsImport(client, { apply: true, editorsPaused: true })
assert.equal(result.created, 18)
assert.equal(result.unrelated, 40)
assert.equal(rawConfig.perspective, 'raw')
assert.equal(rawConfig.useCdn, false)
assert.equal(fetchOptions.perspective, 'raw')
assert.equal(fetchOptions.cache, 'no-store')
assert(ledger.every(id => id.startsWith('docs-')))
assert.deepEqual(snapshot.slice(0, 40), unrelated, 'Existing 40 glossary/editorial/internal records remain byte-for-byte untouched')
result = await runDocsImport(client, { apply: true, verify: true, editorsPaused: true })
assert.equal(result.created, 0)
assert.equal(commits, 1, 'Idempotent rerun performs no mutation transaction')
snapshot = [{ ...first, title: 'Existing editor publication' }]
await assert.rejects(runDocsImport(client, { apply: true, editorsPaused: true }), /preserve editor work/)
snapshot = [{ ...first, _id: 'drafts.other-doc' }]
await assert.rejects(runDocsImport(client, { apply: true, editorsPaused: true }), /Docs import blocked/)
assert.equal(commits, 1)
const realNow = Date.now
let time = 0
Date.now = () => time
try { await assert.rejects(runDocsImport({ ...client, withConfig() { return { fetch: async () => { time = 6000; return [] } } } }, { apply: true, editorsPaused: true }), /too old/) } finally { Date.now = realNow }

const identity = loadTypescript('studio/glossaryIdentity.ts')
const sanity = { defineType: value => value, defineField: value => value, defineArrayMember: value => value }
const schema = loadTypescript('studio/schemaTypes/docPage.ts', { sanity, '../../content/docs-contract': contract, '../glossaryIdentity': identity }).docPage
const custom = definition => {
  let callback
  const rule = { required() { return this }, min() { return this }, unique() { return this }, custom(value) { callback = value; return this } }
  definition.validation(rule)
  return callback
}
const field = name => schema.fields.find(item => item.name === name)
const noRows = document => ({ document, getClient: () => ({ withConfig: () => ({ fetch: async () => [] }) }) })
const slug = custom(field('slug'))
assert.notEqual(await slug({ current: 'renamed' }, noRows({ _id: 'drafts.docs-overview', _type: 'docPage' })), true, 'Actual imported Doc validator locks slug after unpublish')
assert.equal(await slug({ current: 'overview' }, noRows({ _id: 'drafts.docs-overview', _type: 'docPage' })), true)
const uniqueSlug = field('slug').options.isUnique
assert.equal(await uniqueSlug('overview', { document: { _id: 'drafts.new-doc', _type: 'docPage' }, getClient: () => ({ withConfig: () => ({ fetch: async () => [{ _id: 'versions.release.other-doc' }] }) }) }), false)
const sections = field('sections'), section = sections.of[0]
const anchor = custom(section.fields.find(item => item.name === 'id'))
for (const reserved of ['main', 'docs-content', 'docs-resources', 'v3-mobile-menu', 'v3-navigation-tools']) assert.notEqual(anchor(reserved), true, 'Actual schema uses shared reserved-anchor validation')
assert.equal(anchor('stable-section'), true)
assert.notEqual(custom(sections)([{ id: 'same' }, { id: 'same' }]), true)
assert.notEqual(custom(section)({ title: 'Empty' }), true)
for (const value of [{ paragraphs: ['Text'] }, { steps: ['Step'] }, { definitions: [{ term: 'Term', definition: 'Definition' }] }, { paragraphs: ['Text'], steps: ['Step'] }]) assert.equal(custom(section)(value), true)
const optionalLinks = custom(field('optionalLinks'))
assert.equal(optionalLinks(undefined), true, 'Optional links remain optional')
assert.equal(optionalLinks([{ href: '/v3/tools', label: 'Tools' }, { href: '/v3/glossary', label: 'Glossary' }]), true)
assert.notEqual(optionalLinks([{ href: '/v3/tools', label: 'First' }, { href: '/v3/tools', label: 'Different label, same destination' }]), true, 'Actual schema rejects duplicate hrefs before publish, matching runtime validation')
const href = custom(field('optionalLinks').of[0].fields.find(item => item.name === 'href'))
for (const unsafe of ['javascript:alert(1)', 'data:text/html,unsafe', '//evil.example', '/%2f/evil', '/bad\\link', 'https://user:pass@example.com', 'https://example.com/a\nb']) assert.notEqual(href(unsafe), true)
for (const ambiguous of ambiguousDocsHrefs) assert.notEqual(href(ambiguous), true, `Actual Studio href validator rejects browser-normalized destination ${ambiguous}`)
for (const safe of ['/v3/tools/difficulty-exposure', 'https://example.com/research']) assert.equal(href(safe), true)
const related = custom(field('related'))
const relatedContext = (rows = []) => ({ document: { _id: 'drafts.docs-overview' }, getClient: () => ({ withConfig: () => ({ fetch: async () => rows }) }) })
assert.equal(field('related').of[0].weak, true)
assert.equal(await related([{ _ref: 'docs-temporarily-unpublished', _weak: true }], relatedContext()), true, 'Weak absent targets are allowed recommendations, later filtered by runtime')
assert.equal(await related([{ _ref: 'docs-other', _weak: true }], relatedContext([{ _id: 'drafts.docs-other', _type: 'docPage' }])), true)
for (const refs of [
  [{ _ref: 'docs-overview', _weak: true }], [{ _ref: 'drafts.docs-other', _weak: true }], [{ _ref: 'docs-other', _weak: false }],
  [{ _ref: 'docs-other', _weak: true }, { _ref: 'docs-other', _weak: true }],
]) assert.notEqual(await related(refs, relatedContext()), true)
assert.notEqual(await related([{ _ref: 'docs-other', _weak: true }], relatedContext([{ _id: 'docs-other', _type: 'topic' }])), true)

let draft = { _id: 'drafts.new-doc-id', _type: 'docPage', _rev: 'r1', slug: { current: 'first-doc-url' } }, stamp, delegated = 0, failed = []
const actionClient = {
  withConfig: () => ({ fetch: async () => [draft] }),
  patch(id) { assert.equal(id, draft._id); return { ifRevisionId(rev) { assert.equal(rev, draft._rev); return this }, setIfMissing(value) { stamp = value; return this }, async commit() { draft = { ...stamp, ...draft } } } },
}
const actionFactory = loadTypescript('studio/permanentSlugPublishAction.ts', {
  react: { useState: value => [value, () => {}] }, '@sanity/ui/toast': { useToast: () => ({ push: value => failed.push(value) }) }, './glossaryIdentity': identity,
}).permanentSlugPublishAction
const publish = actionFactory(() => ({ label: 'Publish', onHandle() { assert.equal(draft.canonicalSlug, 'first-doc-url'); delegated++ } }), { getClient: () => actionClient })
await publish({ id: 'new-doc-id' }).onHandle()
assert.equal(delegated, 1, 'Actual Doc publish action stamps URL before delegation')
assert.equal(failed.length, 0)
assert.notEqual(await slug({ current: 'renamed' }, noRows(draft)), true, 'Arbitrary-ID Doc remains permanent after unpublish')
draft = { ...draft, slug: { current: 'renamed' } }
await publish({ id: 'new-doc-id' }).onHandle()
assert.equal(delegated, 1, 'Failed permanent-URL guard must not delegate publish')
assert.equal(failed.length, 1)
const failingClient = { ...actionClient, patch() { return { ifRevisionId() { return this }, setIfMissing() { return this }, async commit() { throw new Error('Revision conflict') } } } }
draft = { _id: 'drafts.new-doc-id', _type: 'docPage', _rev: 'r2', slug: { current: 'new-first-url' } }
const failedPublish = actionFactory(() => ({ label: 'Publish', onHandle() { delegated++ } }), { getClient: () => failingClient })
await failedPublish({ id: 'new-doc-id' }).onHandle()
assert.equal(delegated, 1, 'Stamp failure must not delegate publish')
assert.equal(failed.length, 2)
const config = loadTypescript('studio/sanity.config.ts', { sanity: { defineConfig: value => value }, 'sanity/structure': { structureTool: () => ({}) }, './permanentSlugPublishAction': { permanentSlugPublishAction: actionFactory }, './schemaTypes/glossaryTerm': { glossaryTerm: {} }, './schemaTypes/topic': { topic: {} }, './schemaTypes/editorialArticle': { editorialArticle: {} }, './schemaTypes/docPage': { docPage: schema } }).default
const actions = ['publish', 'duplicate', 'restore', 'unpublish'].map(name => Object.assign(() => ({ label: name }), { action: name }))
assert.deepEqual(config.document.actions(actions, { schemaType: 'docPage', getClient: () => actionClient }).map(action => action.action), ['publish', 'unpublish'])
console.log('Passed 18 Docs seed fidelity/order/anchors/dates/definitions/steps, weak related identity safety, raw draft-aware create-only import and preservation of 40 existing records, idempotence, and actual Studio validators/publish failure guards.')

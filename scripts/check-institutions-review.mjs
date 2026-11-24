import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'
const contract = loadTypescript('content/institutions-review-contract.ts')
const editorialContract = loadTypescript('content/editorial-contract.ts')
const docsContract = loadTypescript('content/docs-contract.ts', { './editorial-contract': editorialContract })
const { parseInstitutionsReview: parse } = loadTypescript('content/sanity/institutions-review-parse.ts', { '../institutions-review-contract': contract, '../docs-contract': docsContract })
const seed = loadTypescript('content/institutions-review.ts').institutionsReviewSeed
const { institutionsReviewDocument, planInstitutionsReviewImport } = await import('./lib/institutions-review-migration.mjs')

const doc = institutionsReviewDocument()
assert.equal(doc._id, contract.institutionsReviewId)
assert.equal(doc._type, contract.institutionsReviewType)
assert.equal(doc.visible, true)
assert.equal(doc.cards.length, contract.institutionsReviewCardCount)
assert.deepEqual(institutionsReviewDocument(), doc, 'Document generation must be deterministic')

// The published reader query returns identity fields plus content, without array keys.
const strip = value => Array.isArray(value) ? value.map(strip) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([key]) => key !== '_key').map(([key, v]) => [key, strip(v)])) : value
assert.deepEqual(parse(strip(doc)), seed, 'Published document round-trips to the seed review content')

// Import planning is create-only and never overwrites editor work.
assert.equal(planInstitutionsReviewImport([]).missing.length, 1)
const raw = [{ ...structuredClone(doc), _rev: 'fixture' }]
assert.equal(planInstitutionsReviewImport(raw).missing.length, 0)
assert.equal(planInstitutionsReviewImport(raw).changed.length, 0)
const edited = structuredClone(raw); edited[0].heading += ' Editor change.'
assert(planInstitutionsReviewImport(edited).changed.includes(doc._id), 'Editor edits block reimport')
// The API returns fields in projection order, which differs from builder key order;
// the comparison must be order-insensitive so a fresh import reconciles cleanly.
const { _id, _type, visible, eyebrow, heading, intro, riskNote, cards, stripHeading, stripText, stripLabel, stripSubject } = doc
assert.equal(planInstitutionsReviewImport([{ _id, _type, _rev: 'fixture', visible, eyebrow, heading, intro, riskNote, cards, stripHeading, stripText, stripLabel, stripSubject }]).changed.length, 0, 'Projection field order must not read as an editor change')
assert(planInstitutionsReviewImport([{ _id: 'drafts.' + doc._id, _type: 'institutionsPage' }]).conflicts.length)
assert(planInstitutionsReviewImport([{ _id: doc._id, _type: 'other' }]).conflicts.length)

// The runtime reader rejects invalid or unsafe API content.
assert.throws(() => parse(null), /not an object/)
assert.throws(() => parse({ ...strip(doc), _id: 'other' }), /Unexpected/)
const noVisible = structuredClone(strip(doc)); delete noVisible.visible
assert.throws(() => parse(noVisible), /incomplete/)
assert.throws(() => parse({ ...strip(doc), visible: 'yes' }), /incomplete/)
assert.throws(() => parse({ ...strip(doc), cards: strip(doc).cards.slice(0, 3) }), /incomplete/)
const badHref = structuredClone(strip(doc)); badHref.cards[0].links = [{ label: 'Bad', href: 'javascript:alert(1)' }]
assert.throws(() => parse(badHref), /Unsafe/)
const bothKinds = structuredClone(strip(doc)); bothKinds.cards[0].links = [{ label: 'Both', href: '/docs', contactSubject: 'Subject' }]
assert.throws(() => parse(bothKinds), /Invalid institutions review link/)
console.log('Passed institutions review seed parity, create-only import plan and published-reader validation.')

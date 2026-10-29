import assert from 'node:assert/strict'
import { researchDocuments, planResearchImport } from './lib/research-migration.mjs'
import { loadTypescript } from './lib/load-typescript.mjs'
const source = loadTypescript('content/v3-research.ts')
const docs = researchDocuments()
const { parseResearch } = loadTypescript('content/sanity/research-parse.ts', { '../research-contract': loadTypescript('content/research-contract.ts', { './editorial-contract': loadTypescript('content/editorial-contract.ts') }) })
assert.deepEqual(docs.reports.map(doc => doc._id), ['research-report-observed-difficulty-adjustments', 'research-report-difficulty-forecast-accuracy-2026'])
assert.equal(docs.reports.reduce((n, doc) => n + doc.sections.length, 0), 7)
assert.equal(docs.reports.reduce((n, doc) => n + doc.sections.reduce((m, section) => m + section.paragraphs.length, 0), 0), 14)
assert.equal(docs.methodology.sections.length, 4)
assert.equal(docs.methodology.sections.reduce((n, section) => n + section.paragraphs.length, 0), 8)
for (const [sourceReport, doc] of source.v3Reports.map((row, i) => [row, docs.reports[i]])) {
  assert.equal(doc.title, sourceReport.title); assert.equal(doc.summary, sourceReport.summary); assert.equal(doc.publishedAt, sourceReport.publishedAt)
  assert.deepEqual(doc.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs })), sourceReport.sections)
  assert.equal(doc.seoSummary ?? null, sourceReport.seoSummary ?? null)
}
assert.deepEqual(docs.methodology.sections.map(({ heading, paragraphs }) => ({ heading, paragraphs })), source.v3Methodology)
const published = parseResearch({ reports: docs.reports.map(doc => ({ ...doc, slug: doc.slug.current })), methodology: { ...docs.methodology, slug: docs.methodology.slug.current } })
assert.equal(published.reports.length, 2); assert.equal(published.methodology.sections.length, 4)
assert.throws(() => parseResearch({ reports: [], methodology: null }))
assert.throws(() => parseResearch({ reports: [{ ...docs.reports[0], slug: docs.reports[0].slug.current, sections: [{ ...docs.reports[0].sections[0], id: 'article-next' }] }], methodology: { ...docs.methodology, slug: 'difficulty-index' } }))
const plan = planResearchImport([])
assert.deepEqual(plan.missing.map(doc => doc._id), [...docs.reports, docs.methodology].map(doc => doc._id))
for (const row of [
  { _id: 'drafts.research-report-observed-difficulty-adjustments', _type: 'researchReport' },
  { _id: 'occupied', _type: 'researchMethodology', slug: { current: 'difficulty-index' } },
  { _id: 'research-report-observed-difficulty-adjustments', _type: 'topic' },
]) assert.ok(planResearchImport([row]).conflicts.length)
assert.equal(planResearchImport([...docs.reports, docs.methodology]).missing.length, 0)
assert.equal(planResearchImport([...docs.reports, docs.methodology]).changed.length, 0)
const mutate = structuredClone(docs.reports[0]); mutate.summary += ' edited'
assert.equal(planResearchImport([mutate, docs.reports[1], docs.methodology]).changed.length, 1)
console.log(JSON.stringify({ reports: docs.reports.length, reportSections: 7, reportParagraphs: 14, methodologySections: 4, methodologyParagraphs: 8, ids: [...docs.reports, docs.methodology].map(doc => doc._id), idempotent: true, conflictCases: 3, changedContentDetected: true }, null, 2))

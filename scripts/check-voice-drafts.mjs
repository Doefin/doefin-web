/**
 * Checks a Sanity copy rewrite before an editor writes it as drafts
 * (studio/scripts/voice-drafts.mjs). Needs no credentials: it reads published content
 * the way the site does.
 *
 *   node scripts/check-voice-drafts.mjs [rewrite.json] [--snapshot=<published.json>]
 *
 * Fails when a row no longer matches the published text, a field would be left empty,
 * a length limit is broken or the brand rules find generated-sounding phrasing (CUT).
 */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { planVoiceDrafts } from './lib/voice-drafts.mjs'
import { sanityApiVersion, sanityDataset, sanityProjectId } from '../content/sanity/config.ts'

const argv = process.argv.slice(2)
const file = argv.find(a => a.endsWith('.json') && !a.startsWith('--')) ?? 'studio/rewrites/2026-10-29-v3-voice.json'
const snapshot = argv.find(a => a.startsWith('--snapshot='))?.slice(11)

// 1. The planner, on a fixture.
{
  const base = { _id: 'd', _type: 'docPage', title: 'T', sections: [
    { _key: 's0', paragraphs: ['a', 'b', 'c'], definitions: [{ _key: 'x', term: 'X', definition: 'dx' }, { _key: 'y', term: 'Y', definition: 'dy' }] },
  ] }
  const rows = [
    { _id: 'd', path: 'title', before: 'T', after: 'T2', verdict: 'Change' },
    { _id: 'd', path: 'sections[_key=="s0"].paragraphs[1]', before: 'b', after: '', verdict: 'Cut' },
    { _id: 'd', path: 'sections[_key=="s0"].paragraphs[2]', before: 'c', after: 'c2', verdict: 'Change' },
    { _id: 'd', path: 'sections[_key=="s0"].definitions[_key=="x"].definition', before: 'dx', after: '', verdict: 'Cut' },
    { _id: 'd', path: 'sections[_key=="s0"].definitions[_key=="y"].definition', before: 'dy', after: 'dy', verdict: 'Keep' },
  ]
  const { drafts, conflicts } = planVoiceDrafts(rows, [base])
  assert.deepEqual(conflicts, [])
  assert.equal(drafts[0].set.title, 'T2')
  assert.deepEqual(drafts[0].set.sections[0].paragraphs, ['a', 'c2'])
  assert.deepEqual(drafts[0].set.sections[0].definitions.map(d => d._key), ['y'])
  assert.equal(base.sections[0].paragraphs.length, 3, 'the published document is not mutated')
  assert.match(planVoiceDrafts(rows, [{ ...base, title: 'Edited' }]).conflicts[0], /published text changed at title/)
  assert.match(planVoiceDrafts(rows, [base], { draftIds: new Set(['drafts.d']) }).conflicts[0], /already has a draft/)
  const list = planVoiceDrafts([{ _id: 'd', path: 'sections[_key=="s0"].paragraphs', before: ['a', 'b', 'c'], after: ['one', 'two'], verdict: 'Matteo' }], [base])
  assert.deepEqual(list.drafts[0].set.sections[0].paragraphs, ['one', 'two'])
}

// 2. The rewrite file against published content.
const rows = JSON.parse(await readFile(file, 'utf8'))
const verdicts = new Set(['Keep', 'Change', 'Cut', 'Matteo'])
for (const row of rows) {
  assert(verdicts.has(row.verdict), `${row._id} ${row.path}: verdict ${row.verdict}`)
  if (row.verdict === 'Keep') assert.deepEqual(row.after, row.before, `${row._id} ${row.path}: Keep must not change the text`)
  if (row.verdict === 'Change') assert(typeof row.after === 'string' && row.after.trim() && row.after !== row.before, `${row._id} ${row.path}: Change needs new text`)
  if (row.verdict === 'Cut') assert(/\]$|\]\.(definition|q|a)$/.test(row.path) && row.after === '', `${row._id} ${row.path}: only list items can be cut`)
}
const ids = [...new Set(rows.map(row => row._id))]
let published
if (snapshot) published = JSON.parse(await readFile(snapshot, 'utf8')).result.filter(doc => ids.includes(doc._id))
else {
  const url = new URL(`https://${sanityProjectId}.api.sanity.io/v${sanityApiVersion}/data/query/${sanityDataset}`)
  url.searchParams.set('query', '*[_id in $ids]')
  url.searchParams.set('$ids', JSON.stringify(ids))
  url.searchParams.set('perspective', 'published')
  published = (await (await fetch(url)).json()).result
}
const { drafts, conflicts } = planVoiceDrafts(rows, published)
assert.deepEqual(conflicts, [], 'Every row must match the published text')

// 3. Limits and phrasing on the new text.
const limits = { shortDef: 160, summary: 160, seoSummary: 160, metadataDescription: 160, seoTitle: 70 }
const problems = []
for (const row of rows.filter(r => r.verdict === 'Change' || r.verdict === 'Matteo')) {
  const field = row.path.split('.').at(-1).replace(/\[.*$/, '')
  for (const text of [row.after].flat()) {
    if (limits[field] && text.length >= limits[field]) problems.push(`${row._id} ${row.path}: ${text.length} characters, limit ${limits[field]}`)
  }
}
const rules = JSON.parse(await readFile('vendor/doefin-brand/tools/rules.json', 'utf8')).rules
  .filter(r => !(r.except ?? []).includes('web'))
  .map(r => ({ ...r, re: new RegExp(r.match, r.case_sensitive ? 'gu' : 'giu') }))
const counts = { cut: 0, check: 0, style: 0 }
for (const row of rows.filter(r => r.verdict === 'Change')) {
  for (const rule of rules) {
    for (const m of row.after.matchAll(rule.re)) {
      counts[rule.kind]++
      if (rule.kind !== 'check') console.log(`${rule.kind.toUpperCase().padEnd(6)} ${row._id} ${row.path}  "${m[0]}"  ->  ${rule.say}`)
    }
  }
}
for (const p of problems) console.log(`LIMIT  ${p}`)
for (const draft of drafts) for (const [field, value] of Object.entries(draft.set)) {
  assert(value !== undefined && value !== '', `${draft._id}: ${field} would be empty`)
}
const changed = rows.filter(r => r.verdict !== 'Keep').length
console.log(`Voice drafts: ${drafts.length} documents, ${changed} of ${rows.length} strings changed or cut, ${counts.check} for Matteo, ${counts.style} style notes.`)
if (problems.length || counts.cut) process.exit(1)

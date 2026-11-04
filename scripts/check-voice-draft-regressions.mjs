// Offline regressions for copy planning and the actual checker entrypoint.
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { planVoiceDrafts } from './lib/voice-drafts.mjs'

const base = { _id: 'd', _type: 'docPage', title: 'Original', paragraphs: ['First'], items: [{ _key: 'one', text: 'One' }, { _key: 'two', text: 'Two' }], nested: { text: 'Nested' } }
const title = { _id: 'd', path: 'title', before: base.title, after: 'Revised', verdict: 'Change' }
const other = { _id: 'other', _type: 'docPage', title: 'Other' }
const otherRow = { ...title, _id: 'other', before: 'Other' }

// A cut outside an array cannot leave the document with only its other edits.
const invalidCut = { _id: 'd', path: 'nested.text', before: 'Nested', after: '', verdict: 'Matteo' }
const blocked = planVoiceDrafts([title, invalidCut, otherRow], [base, other])
assert.deepEqual(blocked.drafts.map(d => d._id), ['other'])
assert.match(blocked.conflicts[0], /cannot cut nested.text/)
assert.equal(base.title, 'Original')
assert.equal(base.nested.text, 'Nested')

// Keyed list items can be removed without losing their unchanged neighbours.
const keyedCut = { _id: 'd', path: 'items[_key=="one"]', before: base.items[0], after: '', verdict: 'Cut' }
const keyed = planVoiceDrafts([title, keyedCut], [base])
assert.deepEqual(keyed.conflicts, [])
assert.deepEqual(keyed.drafts[0].set.items, [base.items[1]])
assert.equal(base.items.length, 2)

// A missing destination also blocks the whole document, even when before is absent.
const missing = { ...title, path: 'missing.text', before: undefined }
const missingPlan = planVoiceDrafts([title, missing, otherRow], [base, other])
assert.deepEqual(missingPlan.drafts.map(d => d._id), ['other'])
assert.match(missingPlan.conflicts[0], /cannot set missing.text/)
assert.equal(planVoiceDrafts([title], [base], { draftIds: new Set(['drafts.d']) }).drafts.length, 0)
assert.equal(planVoiceDrafts([title], [{ ...base, title: 'Editor changed this' }]).drafts.length, 0)

const dir = await mkdtemp(join(tmpdir(), 'doefin-voice-regressions-'))
try {
  const input = join(dir, 'rewrite.json'), snapshot = join(dir, 'published.json')
  await writeFile(snapshot, JSON.stringify({ result: [base] }))
  const run = async rows => {
    await writeFile(input, JSON.stringify(rows))
    return spawnSync(process.execPath, ['--experimental-strip-types', '--no-warnings', 'scripts/check-voice-drafts.mjs', input, `--snapshot=${snapshot}`], { encoding: 'utf8' })
  }
  const matteo = { _id: 'd', path: 'paragraphs', before: base.paragraphs, after: ['Review the position cost.', 'You can lose the full amount paid for a position.'], verdict: 'Matteo' }
  const valid = await run([title, matteo])
  assert.equal(valid.status, 0, valid.stdout + valid.stderr)
  assert.match(valid.stdout, /0 style notes/)
  const flagged = await run([title, { ...matteo, after: ['Review the profit and loss.'] }])
  assert.equal(flagged.status, 0, flagged.stdout + flagged.stderr)
  assert.match(flagged.stdout, /1 for Matteo/)
  for (const after of ['Unlock your potential.', ['Review the terms.', 'Unlock your potential.']]) {
    const result = await run([{ ...matteo, path: Array.isArray(after) ? 'paragraphs' : 'title', before: Array.isArray(after) ? base.paragraphs : base.title, after }])
    assert.equal(result.status, 1, result.stdout + result.stderr)
    assert.match(result.stdout, /CUT.*unlock/i)
  }
  // The documented Keep policy does not pretend to validate current published text.
  const kept = await run([{ ...title, before: 'Historical', after: 'Historical', verdict: 'Keep' }])
  assert.equal(kept.status, 0, kept.stdout + kept.stderr)
  const stale = await run([{ ...title, before: 'Stale' }])
  assert.notEqual(stale.status, 0)
  assert.match(stale.stderr, /published text changed/)
  const unscoped = spawnSync(process.execPath, ['studio/scripts/voice-drafts.mjs', '--apply'], { encoding: 'utf8' })
  assert.notEqual(unscoped.status, 0)
  assert.match(unscoped.stderr, /requires an approved --only=/)
} finally {
  await rm(dir, { recursive: true, force: true })
}
console.log('Passed voice regressions: document conflicts, keyed cuts, existing drafts, changed source, Matteo text/arrays, CUT rejection and scoped-write guard. No network requests or CMS writes.')

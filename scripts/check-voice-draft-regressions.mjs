// Offline regressions for copy planning and the actual checker entrypoint.
import assert from 'node:assert/strict'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { planVoiceDrafts, voiceDraftActions, writeVoiceDrafts } from './lib/voice-drafts.mjs'

const base = { _id: 'd', _type: 'docPage', _rev: 'published-d', title: 'Original', paragraphs: ['First'], items: [{ _key: 'one', text: 'One' }, { _key: 'two', text: 'Two' }], nested: { text: 'Nested' }, sections: [{ _key: 's0', paragraphs: ['Keep this paragraph'], definitions: [{ _key: 'x', definition: 'Definition' }], faqs: [{ _key: 'q', q: 'Question', a: 'Answer' }] }] }
const title = { _id: 'd', path: 'title', before: base.title, after: 'Revised', verdict: 'Change' }
const other = { _id: 'other', _type: 'docPage', _rev: 'published-other', title: 'Other' }
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

// Neither verdict may turn an empty paragraph field into deletion of its section.
for (const verdict of ['Cut', 'Matteo']) {
  const fieldCut = { _id: 'd', path: 'sections[_key=="s0"].paragraphs', before: base.sections[0].paragraphs, after: '', verdict }
  const plan = planVoiceDrafts([title, fieldCut, otherRow], [base, other])
  assert.deepEqual(plan.drafts.map(d => d._id), ['other'])
  assert.match(plan.conflicts[0], /only list items can be cut/)
  for (const [path, before] of [
    ['sections[_key=="s0"].definitions[_key=="x"].definition', 'Definition'],
    ['sections[_key=="s0"].faqs[_key=="q"].q', 'Question'],
    ['sections[_key=="s0"].faqs[_key=="q"].a', 'Answer'],
    ['paragraphs[0]', 'First'],
  ]) {
    const allowed = planVoiceDrafts([{ _id: 'd', path, before, after: '', verdict }], [base])
    assert.deepEqual(allowed.conflicts, [], path)
    assert.equal(allowed.drafts.length, 1, path)
  }
}

// Contract simulation only: no live Sanity requests. Run the production submission
// helper against an atomic action adapter, with races injected after planning.
const planned = planVoiceDrafts([title, otherRow], [base, other]).drafts
assert.equal(planned[0].baseRevision, base._rev)
assert.deepEqual(voiceDraftActions(planned)[0], {
  actionType: 'sanity.action.document.version.create', publishedId: 'd', baseId: 'd',
  versionId: 'drafts.d', ifBaseRevisionId: base._rev,
})
function actionFixture(documents) {
  let state = new Map(documents.map(doc => [doc._id, structuredClone(doc)]))
  let calls = 0
  return {
    get state() { return state },
    get calls() { return calls },
    async action(actions) {
      calls++
      const pending = structuredClone(state)
      for (const action of actions) {
        if (action.actionType === 'sanity.action.document.version.create') {
          assert(!('document' in action), 'Do not copy a fetched document into a draft')
          if (pending.has(action.versionId)) throw new Error('409: draft already exists')
          const source = pending.get(action.baseId)
          if (!source || source._rev !== action.ifBaseRevisionId) throw new Error('409: published revision changed')
          pending.set(action.versionId, { ...structuredClone(source), _id: action.versionId })
        } else {
          assert.equal(action.actionType, 'sanity.action.document.edit', 'No publish/replace/delete actions')
          assert(pending.has(action.draftId), 'A conditional create must precede every edit')
          Object.assign(pending.get(action.draftId), action.patch.set)
        }
      }
      state = pending
    },
  }
}
for (const racedDocuments of [
  [base, other, { ...other, _id: 'drafts.other', _rev: 'editor-draft', title: 'Editor created this' }],
  [base, other, { ...other, _id: 'drafts.other', _rev: 'editor-new-revision', title: 'Editor changed this' }],
  [base, { ...other, _rev: 'new-published', title: 'New live text' }],
  [base],
]) {
  const client = actionFixture(racedDocuments)
  const before = structuredClone(client.state)
  await assert.rejects(writeVoiceDrafts(client, planned), /409/)
  assert.deepEqual(client.state, before, 'A conflict on the second document must roll back the first')
  assert.equal(client.calls, 1, 'A failed plan must not be retried')
}
const success = actionFixture([{ ...base, untouched: 'Keep server content' }, other])
assert.deepEqual(await writeVoiceDrafts(success, planned), ['d', 'other'])
assert.equal(success.calls, 1)
assert.equal(success.state.get('drafts.d').title, 'Revised')
assert.equal(success.state.get('drafts.d').untouched, 'Keep server content')
assert.deepEqual(success.state.get('d'), { ...base, untouched: 'Keep server content' })
assert.deepEqual(await writeVoiceDrafts(success, []), [])
assert.equal(success.calls, 1, 'An empty plan must not make a request')
await assert.rejects(writeVoiceDrafts(success, [{ ...planned[0], baseRevision: undefined }]), /revision is required/)
assert.equal(success.calls, 1, 'A missing revision must fail before a request')

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
  const unsafeMatteoCut = await run([{ _id: 'd', path: 'sections[_key=="s0"].paragraphs', before: base.sections[0].paragraphs, after: '', verdict: 'Matteo' }])
  assert.notEqual(unsafeMatteoCut.status, 0)
  assert.match(unsafeMatteoCut.stderr, /only list items can be cut/)
  const unscoped = spawnSync(process.execPath, ['studio/scripts/voice-drafts.mjs', '--apply'], { encoding: 'utf8' })
  assert.notEqual(unscoped.status, 0)
  assert.match(unscoped.stderr, /requires an approved --only=/)
} finally {
  await rm(dir, { recursive: true, force: true })
}
console.log('Passed voice regressions: document conflicts, cut allowlist, existing drafts, changed source, atomic race-contract simulation, Matteo text/arrays, CUT rejection and scoped-write guard. No network requests or CMS writes.')

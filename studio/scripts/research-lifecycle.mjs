import { getCliClient } from 'sanity/cli'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../..', import.meta.url)))
if (!process.argv.includes('--apply') || !process.argv.includes('--editors-paused')) throw new Error('Require --apply and a fresh exclusive editing window (--editors-paused).')
const client = getCliClient({ apiVersion: '2025-02-19' })
const raw = client.withConfig({ perspective: 'raw', useCdn: false }), published = client.withConfig({ perspective: 'published', useCdn: false })
const { researchDocuments, planResearchImport } = await import('../../scripts/lib/research-migration.mjs')
const expected = researchDocuments(), originalRows = JSON.parse(await readFile('work/sanity-research-methodology/pre-import-raw-baseline.json', 'utf8'))
const originalRevisions = new Map(originalRows.map(row => [row._id, { _type: row._type, _rev: row._rev }]))
if (originalRows.length !== 69 || originalRevisions.size !== 69) throw new Error('Frozen pre-import baseline must contain the original 69 records')
const authored = [...expected.reports, expected.methodology]
async function doc(id, view = raw) { return view.fetch('*[_id == $id][0]{_id,_type,_rev,slug,title,summary,seoSummary,publishedAt,sections}', { id }, { cache: 'no-store' }) }
const transitions = []
async function lifecycle(seed) {
  const id = seed._id, path = 'sections[0].paragraphs[0]', base = await doc(id, published), original = seed.sections[0].paragraphs[0]
  if (!base || base._type !== seed._type || base.sections?.[0]?.paragraphs?.[0] !== original) throw new Error(`${id}: published seed differs before lifecycle`)
  const marker = `[TEMP lifecycle check ${id} 2026-10-27]`
  let publishedTemp = false, restored = false
  try {
    await client.action({ actionType: 'sanity.action.document.edit', draftId: `drafts.${id}`, publishedId: id, patch: { set: { [path]: marker } } })
    const draft = await doc(`drafts.${id}`), during = await doc(id, published)
    if (!draft || draft.sections?.[0]?.paragraphs?.[0] !== marker || !during || during.sections?.[0]?.paragraphs?.[0] !== original || during._rev !== base._rev) throw new Error(`${id}: draft leaked into published perspective`)
    await client.action({ actionType: 'sanity.action.document.publish', draftId: `drafts.${id}`, publishedId: id, ifDraftRevisionId: draft._rev, ifPublishedRevisionId: base._rev })
    const temporary = await doc(id, published)
    if (!temporary || temporary.sections?.[0]?.paragraphs?.[0] !== marker) throw new Error(`${id}: guarded publish did not expose temporary marker`)
    publishedTemp = true
  } finally {
    const live = await doc(id, published), pending = await doc(`drafts.${id}`)
    if (!live || live.sections?.[0]?.paragraphs?.[0] !== original || pending) {
      const currentDraft = await doc(`drafts.${id}`)
      if (currentDraft && currentDraft.sections?.[0]?.paragraphs?.[0] !== marker && currentDraft.sections?.[0]?.paragraphs?.[0] !== original) throw new Error(`${id}: unexpected draft prevents safe restore`)
      const latest = await doc(id, published)
      await client.action({ actionType: 'sanity.action.document.edit', draftId: `drafts.${id}`, publishedId: id, patch: { set: { [path]: original } } })
      const restoreDraft = await doc(`drafts.${id}`), restorePublished = await doc(id, published)
      if (!restoreDraft || restoreDraft.sections?.[0]?.paragraphs?.[0] !== original || !restorePublished || !latest) throw new Error(`${id}: exact restore draft not prepared`)
      await client.action({ actionType: 'sanity.action.document.publish', draftId: `drafts.${id}`, publishedId: id, ifDraftRevisionId: restoreDraft._rev, ifPublishedRevisionId: restorePublished._rev })
    }
    const final = await doc(id, published), remnant = await doc(`drafts.${id}`)
    if (!final || final.sections?.[0]?.paragraphs?.[0] !== original || remnant) throw new Error(`${id}: exact restoration failed`)
    restored = true
  }
  transitions.push({ id, draftExcluded: true, guardedPublishVisible: publishedTemp, sourceParagraphRestored: restored, revisionGuards: true })
}
for (const seed of authored) await lifecycle(seed)
const final = await raw.fetch('*[]{_id,_type,_rev,slug,title,summary,seoSummary,publishedAt,sections}', {}, { cache: 'no-store' })
const plan = planResearchImport(final, expected)
const changedOriginal = [...originalRevisions].filter(([id, previous]) => { const current = final.find(row => row._id === id); return !current || current._type !== previous._type || current._rev !== previous._rev }).map(([id]) => id)
if (final.length !== 72 || final.some(row => row._id.startsWith('drafts.') || row._id.startsWith('versions.')) || plan.missing.length || plan.changed.length || plan.conflicts.length || changedOriginal.length) throw new Error(`Final parity failed: records=${final.length}; missing=${plan.missing.length}; changed=${plan.changed.length}; conflicts=${plan.conflicts.length}; originalRevisionsChanged=${changedOriginal.length}`)
console.log(JSON.stringify({ project: 'yzvr33lo', dataset: 'production', transitions, final: { published: 72, drafts: 0, versions: 0, researchParity: 'exact', originalRecords: 69, originalRevisionsChanged: 0, newIds: authored.map(doc => doc._id) } }, null, 2))

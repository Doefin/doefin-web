import { getCliClient } from 'sanity/cli'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
// Writes a reviewed copy rewrite into Sanity as drafts. It never publishes: an editor
// reviews each draft in the Studio and publishes it, or discards it to keep the live text.
process.chdir(fileURLToPath(new URL('../..', import.meta.url)))
const args = process.argv.slice(2)
const file = args.find(arg => arg.endsWith('.json')) ?? 'studio/rewrites/2026-10-29-v3-voice.json'
const only = args.find(arg => arg.startsWith('--only='))?.slice(7).split(',')
if (args.includes('--apply') && (!only?.length || only.some(id => !id.trim()))) {
  throw new Error('Writing drafts requires an approved --only=<id>,<id> scope. See docs/brand-copy-integration-2026-11-04.md.')
}
const client = getCliClient({ apiVersion: '2025-02-19' })
const c = client.config()
if (!c.token || c.projectId !== 'yzvr33lo' || c.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
const { planVoiceDrafts, writeVoiceDrafts } = await import('../../scripts/lib/voice-drafts.mjs')
const rows = JSON.parse(await readFile(file, 'utf8')).filter(row => !only || only.includes(row._id))
const ids = [...new Set(rows.map(row => row._id))]
const raw = client.withConfig({ perspective: 'raw', useCdn: false })
const published = await client.withConfig({ perspective: 'published', useCdn: false }).fetch('*[_id in $ids]', { ids }, { cache: 'no-store' })
const draftIds = new Set(await raw.fetch('*[_id in $ids]._id', { ids: ids.map(id => `drafts.${id}`) }, { cache: 'no-store' }))
const plan = planVoiceDrafts(rows, published, { draftIds })
const written = args.includes('--apply') ? await writeVoiceDrafts(client, plan.drafts) : []
console.log(JSON.stringify({
  project: 'yzvr33lo', dataset: 'production', file,
  drafts: plan.drafts.map(({ _id, _type, rows, set }) => ({ _id, _type, rows, fields: Object.keys(set) })),
  conflicts: plan.conflicts,
  written,
  next: written.length ? 'Review each draft in the Studio, then publish it or discard it.' : 'Plan only. Add --apply to write these drafts.',
}, null, 2))

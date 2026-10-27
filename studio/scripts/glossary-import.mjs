import { getCliClient } from 'sanity/cli'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
const client = getCliClient({ apiVersion: '2025-02-19' })
// Existing loaders resolve typed seed files relative to the repository root.
process.chdir(fileURLToPath(new URL('../..', import.meta.url)))
const { migrationDocuments, runGlossaryImport } = await import('../../scripts/lib/glossary-migration.mjs')
const args = process.argv.slice(2)
const result = await runGlossaryImport(client, {
  apply: args.includes('--apply'), verify: args.includes('--verify'), editorsPaused: args.includes('--editors-paused'),
})
console.log(JSON.stringify({ project: 'yzvr33lo', dataset: 'production', perspective: 'raw', ...result }, null, 2))
if (args.includes('--write')) {
  await mkdir('work', { recursive: true })
  await writeFile(resolve('work/glossary.ndjson'), migrationDocuments().map(d => JSON.stringify(d)).join('\n') + '\n')
  console.log('Local seed file written after authenticated reconciliation. Import always repeats preflight.')
}

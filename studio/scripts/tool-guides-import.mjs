import { getCliClient } from 'sanity/cli'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
const client = getCliClient({ apiVersion: '2025-02-19' })
process.chdir(fileURLToPath(new URL('../..', import.meta.url)))
const { toolGuideMigrationDocuments, runToolGuidesImport } = await import('../../scripts/lib/tool-guides-migration.mjs')
const args = process.argv.slice(2)
const result = await runToolGuidesImport(client, { apply: args.includes('--apply'), verify: args.includes('--verify'), editorsPaused: args.includes('--editors-paused') })
console.log(JSON.stringify({ project: 'yzvr33lo', dataset: 'production', perspective: 'raw', ...result }, null, 2))
if (args.includes('--write')) {
  await mkdir('work', { recursive: true })
  await writeFile('work/tool-guides.ndjson', toolGuideMigrationDocuments().map(doc => JSON.stringify(doc)).join('\n') + '\n')
  console.log('Local Tool guides seed file written after authenticated reconciliation. Import always repeats preflight.')
}

/** Local NDJSON is only a review artifact. Remote operations always regenerate
 * seeds and repeat authenticated raw preflight inside the official Sanity CLI. */
import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { docsMigrationDocuments } from './lib/docs-migration.mjs'
const args = process.argv.slice(2)
if (args.some(arg => ['--reconcile', '--verify', '--apply'].includes(arg))) {
  const result = spawnSync(process.execPath, [resolve('studio/node_modules/sanity/bin/sanity'), 'exec', './scripts/docs-import.mjs', '--with-user-token', '--', ...args], { cwd: resolve('studio'), stdio: 'inherit' })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}
const docs = docsMigrationDocuments()
if (args.includes('--write')) {
  await mkdir('work', { recursive: true })
  await writeFile('work/docs.ndjson', docs.map(doc => JSON.stringify(doc)).join('\n') + '\n')
  console.log(`Wrote ${docs.length} local Docs seed records; this is not authenticated import authorization.`)
} else console.log(`Dry run: ${docs.length} Docs seed documents. No remote changes.`)

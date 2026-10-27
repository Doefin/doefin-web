/** Local seed generation is harmless; every remote operation goes through the
 * authenticated official CLI runner and repeats the full raw preflight.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { migrationDocuments } from './lib/glossary-migration.mjs'
const args = process.argv.slice(2)
if (args.some(arg => ['--reconcile', '--verify', '--apply'].includes(arg))) {
  const result = spawnSync(process.execPath, [resolve('studio/node_modules/sanity/bin/sanity'), 'exec', './scripts/glossary-import.mjs', '--with-user-token', '--', ...args], { cwd: resolve('studio'), stdio: 'inherit' })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}
const docs = migrationDocuments()
if (args.includes('--write')) {
  await mkdir('work', { recursive: true })
  await writeFile('work/glossary.ndjson', docs.map(d => JSON.stringify(d)).join('\n') + '\n')
  console.log(`Wrote ${docs.length} local seed documents. This file is not an authenticated preflight and cannot authorize import.`)
} else console.log(`Dry run: ${docs.length} deterministic seed documents. No remote changes. --reconcile requires official CLI sign-in.`)

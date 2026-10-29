/** Every remote operation delegates to authenticated raw preflight. Local NDJSON
 * is only a review artifact; the applying runner regenerates and rechecks seeds.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { editorialMigrationDocuments } from './lib/editorial-migration.mjs'
const args = process.argv.slice(2)
if (args.some(arg => ['--reconcile', '--verify', '--apply'].includes(arg))) {
  const result = spawnSync(process.execPath, [resolve('studio/node_modules/sanity/bin/sanity'), 'exec', './scripts/editorial-import.mjs', '--with-user-token', '--', ...args], { cwd: resolve('studio'), stdio: 'inherit' })
  if (result.error) throw result.error
  process.exit(result.status ?? 1)
}
const { topics, articles } = editorialMigrationDocuments()
if (args.includes('--write')) {
  await mkdir('work', { recursive: true })
  await writeFile('work/editorial.ndjson', [...topics, ...articles].map(doc => JSON.stringify(doc)).join('\n') + '\n')
  console.log(`Wrote ${topics.length} topic and ${articles.length} article seed documents locally; this is not authenticated import authorization.`)
} else console.log(`Dry run: ${topics.length} topic and ${articles.length} article seed documents. No remote changes.`)

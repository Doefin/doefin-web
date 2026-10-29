/**
 * Refreshes vendor/doefin-brand from github.com/Doefin/doefin-brand.
 *
 *   npm run brand:sync -- v0.2.0              a tagged release (needs read access to the private repo)
 *   npm run brand:sync -- --from=../doefin-brand   a local checkout, to test an unreleased change
 *
 * The brand is vendored, not a git submodule, because Vercel builds this repository and
 * cannot fetch a private submodule. The lock file records the version, the commit and a
 * checksum per file, so `npm run check:brand` fails if anyone edits the copy by hand.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { cp, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join, relative, resolve } from 'node:path'

const REPO = 'https://github.com/Doefin/doefin-brand.git'
const DEST = resolve('vendor/doefin-brand')
const LOCK = 'brand-lock.json'

const arg = process.argv.slice(2).find(a => !a.startsWith('--'))
const from = process.argv.find(a => a.startsWith('--from='))?.slice(7)
if (!arg && !from) {
  console.error('Usage: npm run brand:sync -- <tag>   or   npm run brand:sync -- --from=<local checkout>')
  process.exit(2)
}

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim()

let src = from ? resolve(from) : null
let tmp = null
if (!src) {
  tmp = await mkdtemp(join(tmpdir(), 'doefin-brand-'))
  git('-c', 'advice.detachedHead=false', 'clone', '--quiet', '--depth', '1', '--branch', arg, REPO, tmp)
  src = tmp
}
const commit = git('-C', src, 'rev-parse', 'HEAD')
const dirty = from ? git('-C', src, 'status', '--porcelain') : ''
const version = (await readFile(join(src, 'VERSION'), 'utf8')).trim()

await rm(DEST, { recursive: true, force: true })
await cp(src, DEST, { recursive: true, filter: path => basename(path) !== '.git' })

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(path))
    else if (entry.isFile() && entry.name !== LOCK) out.push(path)
  }
  return out
}
const files = {}
for (const path of (await walk(DEST)).sort()) {
  files[relative(DEST, path)] = createHash('sha256').update(await readFile(path)).digest('hex')
}
await writeFile(join(DEST, LOCK), JSON.stringify({
  repo: 'github.com/Doefin/doefin-brand',
  version,
  tag: arg ?? null,
  commit,
  source: from ? 'local checkout' + (dirty ? ' with uncommitted changes' : '') : 'release',
  syncedAt: new Date().toISOString(),
  files,
}, null, 2) + '\n')
if (tmp) await rm(tmp, { recursive: true, force: true })

console.log(`vendor/doefin-brand is now ${version} (${commit.slice(0, 7)}), ${Object.keys(files).length} files.`)
if (dirty) console.log('Warning: the local checkout has uncommitted changes. Release a tag before merging.')
console.log('Next: run `npm run check:brand`, review the diff, and commit vendor/doefin-brand together.')

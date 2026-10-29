/**
 * The brand guard. Rules come from vendor/doefin-brand/tools/rules.json, the same rules the
 * brand book's Copy check and the brand repo's Python checker use.
 *
 *   npm run check:brand                         vendored brand untouched, and copy in the lines you
 *                                               added since origin/main. Fails on CUT items.
 *   npm run check:brand -- --since=<ref>        compare against another ref.
 *   npm run check:brand -- --all                every string and JSX text in app/, components/,
 *                                               content/ and studio/. Report only.
 *   npm run check:brand -- --base=http://127.0.0.1:3039
 *                                               visible text of every page in the sitemap, so
 *                                               Sanity content is covered too. Run after build +
 *                                               start. Report only; add --strict to fail on CUT.
 *
 * CUT   sounds generated: rewrite the sentence.
 * CHECK compliance-sensitive: keep only if true and needed, and show it to the approver.
 * STYLE house style (em dash, emoji, exclamation mark, hashtag).
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join, relative } from 'node:path'

const VENDOR = 'vendor/doefin-brand'
const SOURCES = ['app', 'components', 'content', 'lib', 'studio/schemaTypes']
const EXTS = new Set(['.ts', '.tsx', '.mdx', '.md', '.json'])
const argv = process.argv.slice(2)
const opt = name => argv.find(a => a === `--${name}` || a.startsWith(`--${name}=`))
const val = name => opt(name)?.split('=').slice(1).join('=')
const strict = Boolean(opt('strict'))

let failed = false
const fail = msg => { failed = true; console.log(msg) }

// 1. The vendored brand matches its lock file.
async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...await walk(path))
    else if (entry.isFile()) out.push(path)
  }
  return out
}
if (!existsSync(join(VENDOR, 'brand-lock.json'))) {
  fail(`${VENDOR} is missing. Run \`npm run brand:sync -- <tag>\`.`)
} else {
  const lock = JSON.parse(await readFile(join(VENDOR, 'brand-lock.json'), 'utf8'))
  const seen = new Set()
  const problems = []
  for (const path of await walk(VENDOR)) {
    const rel = relative(VENDOR, path)
    if (rel === 'brand-lock.json' || rel.endsWith('.DS_Store') || rel.includes('__pycache__')) continue
    seen.add(rel)
    const sum = createHash('sha256').update(await readFile(path)).digest('hex')
    if (!lock.files[rel]) problems.push(`added by hand: ${rel}`)
    else if (lock.files[rel] !== sum) problems.push(`edited by hand: ${rel}`)
  }
  for (const rel of Object.keys(lock.files)) if (!seen.has(rel)) problems.push(`deleted: ${rel}`)
  if (problems.length) {
    fail(`The vendored brand (${lock.version}) was changed by hand. Change it in github.com/Doefin/doefin-brand and run \`npm run brand:sync\`:`)
    for (const p of problems) console.log(`  ${p}`)
  } else {
    console.log(`Brand ${lock.version} (${lock.commit.slice(0, 7)}): vendored copy intact.`)
  }
}

// 2. Copy rules.
const rulesFile = join(VENDOR, 'tools', 'rules.json')
if (!existsSync(rulesFile)) process.exit(1)
const { rules } = JSON.parse(await readFile(rulesFile, 'utf8'))
const compiled = rules.map(r => ({ ...r, re: new RegExp(r.match, 'giu') }))

function scan(text) {
  const hits = []
  for (const r of compiled) {
    r.re.lastIndex = 0
    let m
    while ((m = r.re.exec(text))) {
      if (!m[0].length) { r.re.lastIndex++; continue }
      hits.push({ kind: r.kind, found: m[0].trim(), say: r.say })
    }
  }
  return hits
}

// Prose inside source lines: JSX text and string literals that read like sentences, not class lists or paths.
const classLike = s => {
  const words = s.trim().split(/\s+/)
  return words.every(w => /^[!a-z0-9:_\-[\]/.%#()&>~*=,@]+$/.test(w)) && words.some(w => /[-:[\]/]/.test(w))
}
function prose(line) {
  const out = []
  for (const m of line.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)) out.push(m[1])
  for (const m of line.matchAll(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g)) {
    const s = m[2]
    if (s.trim().split(/\s+/).length < 3 || classLike(s) || /^(\.{0,2}\/|@\/|https?:)/.test(s)) continue
    out.push(s)
  }
  return out
}

const counts = { cut: 0, check: 0, style: 0 }
function report(where, text) {
  for (const h of scan(text)) {
    counts[h.kind]++
    console.log(`${h.kind.toUpperCase().padEnd(5)}  ${where}  "${h.found}"  ->  ${h.say}`)
  }
}

const base = val('base')
if (base) {
  // 3a. Every page of a running site: the sitemap plus every internal link reachable from / and /v3.
  const limit = Number(val('limit') ?? 400)
  const xml = await (await fetch(new URL('/sitemap.xml', base))).text().catch(() => '')
  const queue = ['/', '/v3', ...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname)]
  const seen = new Set()
  while (queue.length && seen.size < limit) {
    const path = queue.shift()
    if (seen.has(path)) continue
    seen.add(path)
    const res = await fetch(new URL(path, base), { headers: { 'user-agent': 'doefin-brand-check' }, redirect: 'manual' })
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('text/html')) continue
    const html = await res.text()
    for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) {
      const next = m[1].replace(/\/$/, '') || '/'
      if (!seen.has(next) && !/\.[a-z0-9]{2,4}$/i.test(next) && !next.startsWith('/_next') && !next.startsWith('/api')) queue.push(next)
    }
    const text = html
      .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' ').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    report(path, text)
  }
  console.log(`Checked the visible text of ${seen.size} pages at ${base}.`)
  if (strict && counts.cut) failed = true
} else if (opt('all')) {
  // 3b. Every source file.
  for (const dir of SOURCES) {
    if (!existsSync(dir)) continue
    for (const file of await walk(dir)) {
      if (!EXTS.has(extname(file))) continue
      const lines = (await readFile(file, 'utf8')).split('\n')
      lines.forEach((line, i) => prose(line).forEach(s => report(`${file}:${i + 1}`, s)))
    }
  }
  if (strict && counts.cut) failed = true
} else {
  // 3c. Only lines added on this branch, including uncommitted work and new files.
  const git = (...args) => { try { return execFileSync('git', args, { encoding: 'utf8' }) } catch { return '' } }
  const since = val('since') ?? (git('rev-parse', '--verify', '--quiet', 'origin/main') ? 'origin/main' : 'main')
  const mergeBase = git('merge-base', since, 'HEAD').trim() || since
  const diff = git('diff', '-U0', '--no-color', mergeBase, '--', ...SOURCES)
  let file = null, lineNo = 0
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) { file = line.slice(6); continue }
    const hunk = line.match(/^@@ -\d+(?:,\d+)? \+(\d+)/)
    if (hunk) { lineNo = Number(hunk[1]); continue }
    if (line.startsWith('+') && file && EXTS.has(extname(file))) {
      prose(line.slice(1)).forEach(s => report(`${file}:${lineNo}`, s))
      lineNo++
    }
  }
  for (const f of git('ls-files', '--others', '--exclude-standard', '--', ...SOURCES).split('\n').filter(Boolean)) {
    if (!EXTS.has(extname(f))) continue
    ;(await readFile(f, 'utf8')).split('\n').forEach((line, i) => prose(line).forEach(s => report(`${f}:${i + 1}`, s)))
  }
  console.log(`Checked copy added since ${since}.`)
  if (counts.cut) failed = true
}

console.log(`${counts.cut} to cut, ${counts.check} for the approver, ${counts.style} style notes.`)
if (failed) {
  console.log('Brand check failed. Rules: vendor/doefin-brand/brand/voice.md and compliance.md.')
  process.exit(1)
}

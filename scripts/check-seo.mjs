/**
 * Automated SEO / AEO assertions over the built output.
 *
 * This checks what a crawler actually receives — the rendered HTML in
 * .next/server/app — rather than what the JSX intends. Run after `next build`.
 */
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

const ROOT = join(process.cwd(), '.next', 'server', 'app')
const MIN_WORDS = 120
const MAX_TITLE = 60
const MAX_DESC = 160

async function walk(dir) {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await walk(p)))
    else if (entry.name.endsWith('.html')) out.push(p)
  }
  return out
}

// React escapes apostrophes, quotes and ampersands in text nodes, so visible copy
// arrives here as `miner&#x27;s` while the JSON-LD it is compared against holds a
// literal apostrophe. Without decoding, the FAQ visibility check below fires on
// any question written in natural English.
const decode = (s) =>
  s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')

const strip = (html) =>
  decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()

const one = (html, re) => (html.match(re) ?? [])[1]

const files = await walk(ROOT)
const problems = []
const titles = new Map()
let checked = 0

for (const file of files) {
  const rel = relative(ROOT, file)
  // Next's internal shells are never served to a crawler as a real page.
  if (rel.startsWith('_not-found') || rel.startsWith('_global-error')) continue
  const html = await readFile(file, 'utf8')
  checked++

  const add = (msg) => problems.push(`${rel}: ${msg}`)

  const title = one(html, /<title>([^<]*)<\/title>/)
  const desc = one(html, /<meta name="description" content="([^"]*)"/)
  const words = strip(html).split(' ').filter(Boolean).length

  if (!title) add('no <title>')
  else {
    if (title.length > MAX_TITLE + 12) add(`title ${title.length} chars — trim toward ${MAX_TITLE}`)
    const seen = titles.get(title)
    if (seen) add(`duplicate title, also on ${seen}`)
    else titles.set(title, rel)
  }

  if (!desc) add('no meta description')
  else if (desc.length > MAX_DESC + 20) add(`description ${desc.length} chars`)

  if (!/rel="canonical"/.test(html)) add('no canonical link')
  if (!/<h1[\s>]/.test(html)) add('no <h1>')
  if ((html.match(/<h1[\s>]/g) ?? []).length > 1) add('more than one <h1>')
  if (words < MIN_WORDS) add(`only ${words} words of prose — near-invisible to crawlers`)
  if (!/application\/ld\+json/.test(html)) add('no structured data')

  const blocks = []
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      blocks.push(JSON.parse(m[1]))
    } catch {
      add('malformed JSON-LD')
    }
  }

  // Structured data must describe what is actually on the page. Marking up
  // questions a visitor cannot see is a spam signal and can earn a penalty.
  const visible = strip(html)
  for (const b of blocks) {
    if (b['@type'] !== 'FAQPage') continue
    for (const q of b.mainEntity ?? []) {
      if (!visible.includes(q.name)) add(`FAQ question not visible on the page: "${q.name}"`)
      const answer = q.acceptedAnswer?.text ?? ''
      if (answer && !visible.includes(answer.slice(0, 60))) {
        add(`FAQ answer not visible on the page: "${q.name}"`)
      }
    }
  }
}

console.log(`Checked ${checked} rendered pages.\n`)
if (problems.length) {
  for (const p of problems) console.error(`  FAIL  ${p}`)
  console.error(`\n${problems.length} problem(s).`)
  process.exit(1)
}
console.log('  All pages: title, description, canonical, single h1, prose, valid structured data.')

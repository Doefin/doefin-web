/**
 * Internal linking, enforced rather than remembered.
 *
 * deagentic.ai has the better-specified rule here — a six-link hub-and-spoke
 * contract with a minimum glossary-link count — but it lives in a brief-writer
 * prompt and an editorial checklist, and its theme contains no link check at all.
 * A rule a human has to remember stops being applied around the fourth article.
 * doefin can enforce the same idea at build time, which is strictly better.
 *
 * Two severities, deliberately:
 *   FAIL  structural faults that are wrong at any corpus size
 *   WARN  thresholds that only become meaningful once there is more content
 *
 * The warnings become failures as the corpus grows; the note at the bottom says
 * when. Failing them now would block every commit on a six-article site.
 *
 *   node scripts/check-links.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const read = (p) => readFileSync(p, 'utf8')
const fails = []
const warns = []

/* ── 1. seeAlso must be reciprocal ──────────────────────────────────────── */

const glossarySrc = read('content/glossary.ts')
const entries = [...glossarySrc.matchAll(/slug:\s*'([^']+)'([\s\S]*?)(?=slug:\s*'|$)/g)]
const seeAlso = new Map()
for (const [, slug, body] of entries) {
  const m = body.match(/seeAlso:\s*\[([\s\S]*?)\]/)
  seeAlso.set(slug, m ? [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [])
}

for (const [slug, targets] of seeAlso) {
  for (const t of targets) {
    if (!seeAlso.has(t)) {
      fails.push(`glossary "${slug}" links to "${t}", which does not exist`)
    } else if (!seeAlso.get(t).includes(slug)) {
      // A one-way "see also" is a dead end for the reader who arrives from the
      // other side, and it is invisible when authoring because you only ever
      // look at one of the two files.
      fails.push(`glossary "${slug}" -> "${t}" is not reciprocal; add "${slug}" to ${t}.seeAlso`)
    }
  }
}

/* ── 2. no route may hardcode its "where to go next" links ──────────────── */

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
  )
}

// Only editorial routes belong in the graph. A hub page such as /data or /about
// is not a content item, so a hand-written list there is correct — warning about
// it forever would only teach people to ignore this script.
const EDITORIAL = /^app\/(blog|research|academy|glossary)\/\[/
const routes = walk('app').filter((f) => f.endsWith('.tsx'))
for (const f of routes.filter((f) => EDITORIAL.test(f))) {
  if (/<NextLinks[\s\S]{0,120}items=\{\[/.test(read(f))) {
    fails.push(`${f} passes a literal array to <NextLinks> — derive it from content/graph.ts`)
  }
}

/* ── 3. every long-form piece should mention at least two glossary terms ── */

const MIN_TERMS = 2
const terms = [...glossarySrc.matchAll(/\bterm:\s*'([^']+)'/g)].map((m) => m[1].toLowerCase())
const aliasBlocks = [...glossarySrc.matchAll(/aliases:\s*\[([\s\S]*?)\]/g)]
const aliases = aliasBlocks.flatMap((b) => [...b[1].matchAll(/'([^']+)'/g)].map((x) => x[1].toLowerCase()))
const vocabulary = [...new Set([...terms, ...aliases])]

for (const file of ['content/posts.ts', 'content/academy.ts', 'content/research.ts']) {
  const src = read(file)
  for (const [, slug, body] of src.matchAll(/slug:\s*'([^']+)'([\s\S]*?)(?=\n  \{\n    slug:|$)/g)) {
    const prose = body.toLowerCase()
    const hits = vocabulary.filter((t) => new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(prose))
    if (hits.length < MIN_TERMS) {
      warns.push(`${file}: "${slug}" mentions ${hits.length} glossary term(s); ${MIN_TERMS} is the floor`)
    }
  }
}

/* ── 4. every glossary term should be used somewhere ─────────────────────── */

const allProse = ['content/posts.ts', 'content/academy.ts', 'content/research.ts']
  .map(read)
  .join('\n')
  .toLowerCase()

for (const [, slug, body] of entries) {
  const label = (body.match(/\bterm:\s*'([^']+)'/) ?? [])[1]
  if (!label) continue
  const alias = body.match(/aliases:\s*\[([\s\S]*?)\]/)
  const labels = [label, ...(alias ? [...alias[1].matchAll(/'([^']+)'/g)].map((x) => x[1]) : [])]
  const used = labels.some((l) =>
    new RegExp(`\\b${l.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(allProse),
  )
  if (!used) {
    warns.push(`glossary "${slug}" is not mentioned by any article — nothing links to it`)
  }
}

/* ── report ─────────────────────────────────────────────────────────────── */

for (const w of warns) console.log(`warn  ${w}`)
for (const f of fails) console.error(`FAIL  ${f}`)

console.log(
  `\n${fails.length} failure(s), ${warns.length} warning(s) across ` +
    `${seeAlso.size} glossary terms and ${routes.length} routes.`,
)

if (!fails.length && !warns.length) console.log('Internal linking is reciprocal and derived.')
if (warns.length && !fails.length) {
  console.log(
    '\nWarnings do not fail the build yet. Promote them once the corpus passes\n' +
      'roughly 15 long-form pieces, at which point a thin-linked article is a\n' +
      'genuine outlier rather than a consequence of the site being new.',
  )
}

process.exit(fails.length ? 1 : 0)

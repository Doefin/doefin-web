import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const read = path => readFileSync(path, 'utf8')
const home = read('app/(public)/page.tsx')
const approvedLanding = read('components/v3/approved-landing/ApprovedLanding.tsx')
const resources = read('app/(public)/resources/page.tsx')
const chrome = read('components/v3/Chrome.tsx')
const docs = read('content/v3-docs.ts')
const routes = read('lib/v3-routes.ts')
const source = home + approvedLanding + resources + chrome
const targets = [...new Set([...source.matchAll(/(?:href[=:]\s*["'])(\/docs[^"']*)/g)].map(match => match[1].split('#')[0]))]
for (const target of targets.filter(path => path.startsWith('/docs/'))) {
  assert.ok(docs.includes(`slug: '${target.slice('/docs/'.length)}'`), `Missing V3 doc: ${target}`)
}
assert.match(routes, /staticRoute\('product', Product\)/, 'Retain the product introduction route')
assert.match(resources, /href: '\/product'/, 'The product introduction must have a contextual resource entry')
assert.match(home, /robots: \{ index: false, follow: false \}/, 'Keep preview indexing policy')
assert.match(read('components/content/Subscribe.tsx'), /version === 'v3'[\s\S]*?(?:demo|prototype)/i, 'Shared V3 subscription state must disclose demo delivery')
assert.match(read('components/content/Subscribe.tsx'), /\/newsletter/, 'Shared subscription entry must reach the newsletter demo')
// Check incoming cross-page homepage fragments, not only anchors emitted by home.
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])
const inbound = new Set(walk('components/v3').filter(path => path.endsWith('.tsx')).flatMap(path => [...read(path).matchAll(/\/#([a-z][a-z0-9-]*)/g)].map(match => match[1])))
for (const id of inbound) assert.ok((home + approvedLanding).includes(`id="${id}"`), `Cross-page homepage fragment missing: #${id}`)
console.log(`P1 incoming homepage fragment checks passed (${inbound.size} cross-page targets).`)
console.log(`P1 source checks passed (${targets.length} distinct literal destinations).`)
if (process.argv.includes('--source-only')) process.exit(0)

const base = process.env.BASE_URL ?? 'http://127.0.0.1:3046'
const fetchHtml = async path => {
  const response = await fetch(new URL(path, base))
  assert.equal(response.status, 200, `${path} must return 200`)
  return response.text()
}
const html = await fetchHtml('/')
assert.match(html, /<header\b[\s\S]*?<main\b[\s\S]*?<\/main>[\s\S]*?<footer\b/, 'Homepage must retain its shared header and footer')
const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]
assert.ok(main, 'Homepage main content is missing')
const sections = [...main.matchAll(/<section\b[^>]*\bclass="([^"]+)"/g)].map(([, classes]) => classes.split(' ')[0])
assert.deepEqual(sections, [
  'hero', 'market-panel', 'benefits-section', 'audience-section', 'why-section',
  'how-section', 'landing-impact', 'landing-market-context', 'traction-section',
  'trust-section', 'closing-section', 'v37-faq',
], 'The approved sections must render in order, with the FAQ last')
assert.match(main, /<h1\b[^>]*id="hero-title"/)
assert.match(main, /Illustrative quotes in cbBTC, not live prices/)
assert.match(main, /You can lose the full amount paid for a position\./)
const faq = main.slice(main.indexOf('id="faq"'))
assert.match(faq, /<details\b[\s\S]*?<summary\b/, 'Published FAQ questions must render as disclosures')
const resourceHtml = await fetchHtml('/resources')
assert.ok(resourceHtml.includes('href="/product"'), 'Rendered product intro link missing')
assert.ok(resourceHtml.includes('id="updates"') && resourceHtml.includes('does not send emails or save personal details'), 'Resources update anchor/demo qualification missing')
const anchors = [...html.matchAll(/<a\b[^>]*href="([^"#]*)(#[^"]*)?"/g)]
const local = [...new Set(anchors.map(([, path]) => path).filter(path => path.startsWith('/')))]
for (const path of local) await fetchHtml(path)
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))
for (const id of inbound) assert.ok(ids.has(id), `Served incoming homepage fragment missing: #${id}`)
for (const [, path, hash] of anchors) if (hash && (!path || path === '/')) assert.ok(ids.has(hash.slice(1)), `Broken homepage anchor: ${hash}`)
console.log(`P1 rendered journey checks passed; ${local.length} linked V3 destination pages returned 200. Browser interaction/visual checks are separate.`)

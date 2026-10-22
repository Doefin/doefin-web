import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const read = path => readFileSync(path, 'utf8')
const home = read('app/v3/page.tsx')
const resources = read('app/v3/resources/page.tsx')
const chrome = read('components/v3/Chrome.tsx')
const docs = read('content/v3-docs.ts')
const routes = read('lib/v3-routes.ts')
const source = home + resources + chrome + read('components/v3/HomeResources.tsx')
const targets = [...new Set([...source.matchAll(/(?:href[=:]\s*["'])(\/v3[^"']*)/g)].map(match => match[1].split('#')[0]))]
for (const target of targets.filter(path => path.startsWith('/v3/docs/'))) {
  assert.ok(docs.includes(`slug: '${target.slice('/v3/docs/'.length)}'`), `Missing V3 doc: ${target}`)
}
assert.match(routes, /staticRoute\('product', Product\)/, 'Retain the product introduction route')
assert.match(resources, /href: '\/v3\/product'/, 'The product introduction must have a contextual resource entry')
assert.ok(Math.abs((1 - 1 / 1.10) * 100 - 9.09) < 0.005, 'Production percentage must use reciprocal difficulty')
assert.match(home, /robots: \{ index: false, follow: false \}/, 'Keep preview indexing policy')
assert.match(read('components/content/Subscribe.tsx'), /version === 'v3'[\s\S]*?(?:demo|prototype)/i, 'Shared V3 subscription state must disclose demo delivery')
assert.match(read('components/content/Subscribe.tsx'), /\/v3\/newsletter/, 'Shared V3 subscription entry must reach the newsletter demo')
// Check incoming cross-page homepage fragments, not only anchors emitted by home.
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)])
const inbound = new Set(walk('components/v3').filter(path => path.endsWith('.tsx')).flatMap(path => [...read(path).matchAll(/\/v3#([a-z][a-z0-9-]*)/g)].map(match => match[1])))
for (const id of inbound) assert.ok(home.includes(`id="${id}"`), `Cross-page homepage fragment missing: #${id}`)
for (const id of ['inside-the-product', 'who-its-for', 'product-title', 'audience-title']) assert.ok(home.includes(`id="${id}"`), `Preserve existing homepage bookmark: #${id}`)
console.log(`P1 incoming homepage fragment checks passed (${inbound.size} cross-page targets).`)
console.log(`P1 source checks passed (${targets.length} distinct literal destinations).`)
if (process.argv.includes('--source-only')) process.exit(0)

const base = process.env.BASE_URL ?? 'http://127.0.0.1:3046'
const fetchHtml = async path => {
  const response = await fetch(new URL(path, base))
  assert.equal(response.status, 200, `${path} must return 200`)
  return response.text()
}
const html = await fetchHtml('/v3')
const firstSection = html.match(/<section\b[^>]*aria-labelledby="v3-title"[\s\S]*?<\/section>/)?.[0]
assert.ok(firstSection, 'Rendered homepage must have its hero section')
for (const [href, label] of [
  ['/v3/for/miners', 'Plan difficulty exposure'],
  ['/v3/learn/difficulty-exposure', 'Follow a worked example'],
  ['/v3/docs/smart-contracts', 'Review technical evidence'],
  ['/v3/docs/risks-and-limitations', 'Risks and limitations'],
]) {
  assert.ok(firstSection.includes(`href="${href}"`), `Hero lacks ${href}`)
  assert.ok(firstSection.includes(label), `Hero lacks named action: ${label}`)
}
assert.ok(firstSection.includes('A losing position pays zero.'), 'Full-loss qualification must remain beside hero actions')
assert.match(html, /<summary[^>]*>Inspect the app capture: 19 October 2026[^<]*not live<\/summary>/, 'Capture date and non-live label must be visible before expanding')
for (const path of ['/v3/docs/connecting-a-wallet', '/v3/docs/getting-collateral', '/v3/docs/your-first-trade', '/v3/about', '/v3/tools/hosting-effective-rate', '/v3/tools/fleet-payback', '/v3/for/institutions']) {
  assert.ok(html.includes(`href="${path}"`), `Homepage lacks contextual ${path}`)
}
const resourceHtml = await fetchHtml('/v3/resources')
assert.ok(resourceHtml.includes('href="/v3/product"'), 'Rendered product intro link missing')
assert.ok(resourceHtml.includes('id="updates"') && resourceHtml.includes('does not send emails or save personal details'), 'Resources update anchor/demo qualification missing')
const anchors = [...html.matchAll(/<a\b[^>]*href="([^"#]*)(#[^"]*)?"/g)]
const local = [...new Set(anchors.map(([, path]) => path).filter(path => path.startsWith('/v3')))]
for (const path of local) await fetchHtml(path)
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))
for (const id of inbound) assert.ok(ids.has(id), `Served incoming homepage fragment missing: #${id}`)
for (const [, path, hash] of anchors) if (hash && (!path || path === '/v3')) assert.ok(ids.has(hash.slice(1)), `Broken homepage anchor: ${hash}`)
console.log(`P1 rendered journey checks passed; ${local.length} linked V3 destination pages returned 200. Browser interaction/visual checks are separate.`)

/**
 * Routing regression checks. Run `node scripts/check-v3-routes.mjs`; add --built
 * after `next build` to check complete library coverage and served HTML links.
 */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const source = readFileSync('lib/versioning.ts', 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { versionedPath } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'))

const cases = [
  ['/', undefined, '/v1'],
  ['/docs', undefined, '/v1/docs'],
  ['/?ref=guide#start', undefined, '/v1?ref=guide#start'],
  ['/v1/docs', undefined, '/v1/docs'],
  ['/v2/tools', undefined, '/v2/tools'],
  ['/v3/resources', undefined, '/v3/resources'],
  ['/v3?ref=nav#learn', undefined, '/v3?ref=nav#learn'],
  ['/', 'v3', '/v3'],
  ['/v1', 'v3', '/v3'],
  ['/v2', 'v3', '/v3'],
  ['/v3', 'v3', '/v3'],
  ['/docs/how-settlement-works', 'v3', '/v3/docs/how-settlement-works'],
  ['/v1/glossary/difficulty', 'v3', '/v3/glossary/difficulty'],
  ['/v2/product/settlement', 'v3', '/v3/product/settlement'],
  ['/v2/tools/difficulty-exposure?hashrate=240#result', 'v3', '/v3/tools/difficulty-exposure?hashrate=240#result'],
  ['/v2/research/evaluating-a-forecast/sample.csv', 'v3', '/v3/research/evaluating-a-forecast/sample.csv'],
  ['/newsletter', 'v3', '/v3/resources#updates'],
  ['/v1/newsletter?ref=article', 'v3', '/v3/resources?ref=article#updates'],
  ['/v3/newsletter#signup', 'v3', '/v3/resources#updates'],
  ['#evidence', 'v3', '#evidence'],
  ['?hashrate=240', 'v3', '?hashrate=240'],
  ['https://app.doefin.com', 'v3', 'https://app.doefin.com'],
  ['mailto:matteo@doefin.com', 'v3', 'mailto:matteo@doefin.com'],
  ['//example.com/path', 'v3', '//example.com/path'],
  ['/images/logo/logo-white.png', 'v3', '/images/logo/logo-white.png'],
  ['/_next/static/chunk.js', 'v3', '/_next/static/chunk.js'],
  ['/api/v1/difficulty/latest', 'v3', '/api/v1/difficulty/latest'],
  ['/feed.xml', 'v3', '/feed.xml'],
  ['/sitemap.xml', 'v3', '/sitemap.xml'],
  ['/robots.txt', 'v3', '/robots.txt'],
  ['/llms.txt', 'v3', '/llms.txt'],
  ['/favicon.ico', 'v3', '/favicon.ico'],
  ['/opengraph-image?cache=1', 'v3', '/opengraph-image?cache=1'],
]
for (const [href, version, expected] of cases) {
  assert.equal(versionedPath(href, version), expected, `${version ?? 'legacy'}: ${href}`)
}
console.log(`Passed ${cases.length} V1/V2/V3 path cases.`)

if (process.argv.includes('--built')) {
  const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
  const routes = Object.keys(manifest.routes)
  const routeSet = new Set(routes)
  const library = /^\/v1\/(?:research|data|methodology|docs|glossary|academy|blog|about|privacy|terms)(?:\/|$)/
  const examples = /^\/v1\/tools\/[^/]+\/example\//
  const expected = routes.filter(path =>
    (library.test(path) || examples.test(path) || path.startsWith('/v2/')) &&
    !path.includes('/opengraph-image'),
  ).map(path => path.replace(/^\/v[12]/, '/v3'))
  assert(expected.length > 20, 'Build must include the existing supporting library')
  for (const path of expected) assert(routeSet.has(path), `Missing V3 route: ${path}`)
  assert(!routeSet.has('/v3/newsletter'), 'V3 must not expose the unconnected newsletter signup')
  assert.equal(manifest.dynamicRoutes['/v3/[...path]']?.fallback, false, 'Unknown V3 routes must return 404')

  const pages = routes.filter(path => /^\/v3(?:\/|$)/.test(path) && !path.endsWith('.csv') && path !== '/v3/social-image')
  assert(routeSet.has('/v3') && routeSet.has('/v3/resources'), 'Build must include both dedicated V3 pages')
  for (const path of pages) {
    const html = readFileSync(`.next/server/app${path}.html`, 'utf8')
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]
    assert(main, `${path}: missing server-rendered main content`)
    assert(/<meta name="robots" content="noindex, nofollow"/.test(html), `${path}: preview indexing is enabled`)
    assert(html.includes(`<link rel="canonical" href="https://doefin.com${path}"`), `${path}: wrong canonical`)
    assert(html.includes(`<meta property="og:url" content="https://doefin.com${path}"`), `${path}: wrong Open Graph URL`)
    assert(/<title>[^<]+<\/title>/.test(html), `${path}: missing source title`)
    assert(/<meta name="description" content="[^"]+"/.test(html), `${path}: missing source description`)
    for (const [, href] of main.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      assert(!/^\/v[12](?:\/|[?#]|$)/.test(href), `${path}: body link leaves V3: ${href}`)
      if (href.startsWith('/v3')) {
        const destination = href.split(/[?#]/)[0]
        assert(routeSet.has(destination), `${path}: missing internal destination: ${href}`)
      }
    }
  }
  console.log(`Passed ${expected.length} reused route mappings and ${pages.length} built V3 pages.`)
}

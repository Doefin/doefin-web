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
  ['/', undefined, '/v3'],
  ['/docs', undefined, '/v3/docs'],
  ['/?ref=guide#start', undefined, '/v3?ref=guide#start'],
  ['/v1/docs', undefined, '/v3/docs'],
  ['/v2/tools', undefined, '/v3/tools'],
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
  ['/newsletter', 'v3', '/v3/newsletter'],
  ['/v1/newsletter?ref=article', 'v3', '/v3/newsletter?ref=article'],
  ['/v3/newsletter#signup', 'v3', '/v3/newsletter#signup'],
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
console.log(`Passed ${cases.length} V3 path cases, including retained content-link normalization.`)

if (process.argv.includes('--built')) {
  const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
  const routes = Object.keys(manifest.routes)
  const routeSet = new Set(routes)
  const expected = JSON.parse(readFileSync('scripts/fixtures/v3-routes.json', 'utf8'))
  assert(expected.length > 80, 'Expected the complete original V3 route inventory')
  for (const path of expected) assert(routeSet.has(path), `Missing V3 route: ${path}`)
  assert(!routes.some(path => /^\/v[124](?:\/|$)/.test(path)), 'Build must contain V3 only')
  const appPaths = JSON.parse(readFileSync('.next/server/app-paths-manifest.json', 'utf8'))
  assert(!Object.keys(appPaths).some(path => /^\/v[124](?:\/|$)/.test(path)), 'Removed versions must not remain dynamic routes')
  const redirects = JSON.parse(readFileSync('.next/routes-manifest.json', 'utf8')).redirects
  assert.equal(redirects.find(route => route.source === '/')?.destination, '/v3', 'Root must open V3')
  assert(!redirects.some(route => /^\/v[124](?:\/|$)/.test(route.destination)), 'Redirects must not target removed versions')
  assert(routeSet.has('/v3/newsletter'), 'V3 must expose the explicitly labelled newsletter demo')
  assert(routeSet.has('/v3/prototype-review'), 'V3 must expose the internal journey review')
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
    assert(!html.includes('aria-label="Website version"'), `${path}: removed version switcher remains`)
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      assert(!/^\/v[124](?:\/|[?#]|$)/.test(href), `${path}: body link leaves V3: ${href}`)
      if (href.startsWith('/v3')) {
        const destination = href.split(/[?#]/)[0]
        assert(routeSet.has(destination), `${path}: missing internal destination: ${href}`)
      }
    }
  }
  console.log(`Passed ${expected.length} preserved V3 routes and ${pages.length} built V3 pages.`)
}

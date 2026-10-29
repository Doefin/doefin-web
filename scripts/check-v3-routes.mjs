/**
 * Routing regression checks. Run `node scripts/check-v3-routes.mjs`; add --built
 * after `next build` to check complete library coverage and served HTML links.
 */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { relative, sep } from 'node:path'
import ts from 'typescript'

const source = readFileSync('lib/versioning.ts', 'utf8')
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } })
const { versionedPath } = await import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'))

const cases = [
  ['/', undefined, '/'], ['/docs', undefined, '/docs'], ['/?ref=guide#start', undefined, '/?ref=guide#start'],
  ['/v1/docs', undefined, '/docs'], ['/v2/tools', undefined, '/tools'], ['/resources', undefined, '/resources'],
  ['/v3?ref=nav#learn', undefined, '/?ref=nav#learn'], ['/', 'v3', '/'], ['/v1', 'v3', '/'], ['/v2', 'v3', '/'], ['/v3', 'v3', '/'],
  ['/docs/how-settlement-works', 'v3', '/docs/how-settlement-works'], ['/v1/glossary/difficulty', 'v3', '/glossary/difficulty'],
  ['/v2/product/settlement', 'v3', '/product/settlement'], ['/v2/tools/difficulty-exposure?hashrate=240#result', 'v3', '/tools/difficulty-exposure?hashrate=240#result'],
  ['/v2/research/evaluating-a-forecast/sample.csv', 'v3', '/research/evaluating-a-forecast/sample.csv'], ['/newsletter', 'v3', '/newsletter'],
  ['/v1/newsletter?ref=article', 'v3', '/newsletter?ref=article'], ['/v3/newsletter#signup', 'v3', '/newsletter#signup'],
  ['#evidence', 'v3', '#evidence'], ['?hashrate=240', 'v3', '?hashrate=240'], ['https://app.doefin.com', 'v3', 'https://app.doefin.com'],
  ['mailto:matteo@doefin.com', 'v3', 'mailto:matteo@doefin.com'], ['//example.com/path', 'v3', '//example.com/path'],
  ['/images/logo/logo-white.png', 'v3', '/images/logo/logo-white.png'], ['/_next/static/chunk.js', 'v3', '/_next/static/chunk.js'],
  ['/api/v1/difficulty/latest', 'v3', '/api/v1/difficulty/latest'], ['/api/v3/research/v1/forecasts', 'v3', '/api/v3/research/v1/forecasts'],
  ['/feed.xml', 'v3', '/feed.xml'], ['/sitemap.xml', 'v3', '/sitemap.xml'], ['/robots.txt', 'v3', '/robots.txt'], ['/llms.txt', 'v3', '/llms.txt'],
  ['/favicon.ico', 'v3', '/favicon.ico'], ['/opengraph-image?cache=1', 'v3', '/opengraph-image?cache=1'],
]
for (const [href, version, expected] of cases) {
  assert.equal(versionedPath(href, version), expected, `${version ?? 'legacy'}: ${href}`)
}
console.log(`Passed ${cases.length} V3 path cases, including retained content-link normalization.`)
assert(readFileSync('components/v3/MinersPage.tsx', 'utf8').includes('href="/#who-its-for"'), 'Miners page returns to the home page anchor')
for (const [source, asset] of [
  ['components/v3/ProductPreview.tsx', '/images/v3/market-detail-2026-10-19.jpg'],
  ['components/v3/ProductUpdates.tsx', '/images/v3/product-updates-envelope.png'],
]) {
  assert(readFileSync(source, 'utf8').includes(asset), `${source}: asset URL retains its images/v3 prefix`)
  assert(existsSync(`public${asset}`), `${source}: referenced image exists`)
}
assert(readFileSync('lib/bitcoin-analytics.ts', 'utf8').includes("fetchEndpoint<CurrentHashrate>('/v3/bitcoin/hashrate/current'"), 'Server hashrate lookup retains the backend V3 endpoint')

if (process.argv.includes('--built')) {
  const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
  const routes = Object.keys(manifest.routes)
  const routeSet = new Set(routes)
  const base = process.argv.find(a => a.startsWith('--base='))?.slice(7)
  const htmlByPath = new Map()
  const expected = JSON.parse(readFileSync('scripts/fixtures/v3-routes.json', 'utf8'))
  assert(expected.length > 80, 'Expected the complete original V3 route inventory')
  for (const path of expected) {
    if (base) {
      const response = await fetch(base + path)
      assert.equal(response.status, 200, `Missing preserved V3 route: ${path}`)
      if (path !== '/social-image' && !path.endsWith('.csv')) htmlByPath.set(path, await response.text())
      routeSet.add(path)
    } else assert(routeSet.has(path), `Missing static V3 route: ${path}; supply --base to verify dynamic CMS routes`)
  }
  assert(!routes.some(path => /^\/v[124](?:\/|$)/.test(path)), 'Build must contain V3 only')
  const appPaths = JSON.parse(readFileSync('.next/server/app-paths-manifest.json', 'utf8'))
  assert(!Object.keys(appPaths).some(path => /^\/v[124](?:\/|$)/.test(path)), 'Removed versions must not remain dynamic routes')
  const redirects = JSON.parse(readFileSync('.next/routes-manifest.json', 'utf8')).redirects
  assert.equal(redirects.find(route => route.source === '/v3')?.destination, '/', 'Legacy V3 root redirects home')
  assert.equal(redirects.find(route => route.source === '/v3/:path*')?.destination, '/:path*', 'Legacy V3 pages redirect to root paths')
  assert(!redirects.some(route => /^\/v[124](?:\/|$)/.test(route.destination)), 'Redirects must not target removed versions')
  assert(routeSet.has('/newsletter'), 'V3 must expose the explicitly labelled newsletter demo')
  assert(routeSet.has('/prototype-review'), 'V3 must expose the internal journey review')
  if (base) {
    const legacy = await fetch(base + '/v3/tools?ref=legacy', { redirect: 'manual' })
    assert.equal(legacy.status, 308, 'Legacy pages use permanent redirects')
    assert.equal(legacy.headers.get('location'), '/tools?ref=legacy', 'Legacy redirect preserves query strings')
    const marketSnapshot = await fetch(base + '/api/v3/market-snapshot', { redirect: 'manual' })
    assert([200, 451].includes(marketSnapshot.status), `Versioned API must be available or explicitly blocked by the API environment, got HTTP ${marketSnapshot.status}`)
    assert(![301, 302, 303, 307, 308].includes(marketSnapshot.status), 'Versioned API must not redirect')
    for (const path of ['/not-a-page', '/glossary/not-a-published-term']) {
      assert.equal((await fetch(base + path, { headers: { 'user-agent': 'Googlebot' } })).status, 404, `${path}: unknown route must 404`)
    }
  } else assert.equal(manifest.dynamicRoutes['/[...path]']?.fallback, false, 'Unknown V3 routes must return 404')

  const pages = expected.filter(path => path !== '/social-image' && !path.endsWith('.csv'))
  const appRoot = '.next/server/app'
  const builtFiles = []
  const collectHtml = directory => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const file = `${directory}/${entry.name}`
      if (entry.isDirectory()) collectHtml(file)
      else if (entry.name.endsWith('.html')) builtFiles.push(file)
    }
  }
  collectHtml(appRoot)
  const artifactRoute = file => {
    const segments = relative(appRoot, file).split(sep).filter(segment => !/^\(.*\)$/.test(segment))
    const route = `/${segments.join('/')}`.replace(/\.html$/, '')
    return route === '/index' ? '/' : route
  }
  const builtHtmlPath = path => {
    return builtFiles.find(file => artifactRoute(file) === path) ?? `${appRoot}${path === '/' ? '/index' : path}.html`
  }
  assert(routeSet.has('/') && routeSet.has('/resources'), 'Build must include homepage and resources')
  for (const path of pages) {
    const html = htmlByPath.get(path) ?? readFileSync(builtHtmlPath(path), 'utf8')
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1]
    assert(main, `${path}: missing server-rendered main content`)
    assert(/<meta name="robots" content="noindex, nofollow"/.test(html), `${path}: preview indexing is enabled`)
    assert(html.includes(`<link rel="canonical" href="https://doefin.com${path === '/' ? '' : path}"`), `${path}: wrong canonical`)
    assert(html.includes(`<meta property="og:url" content="https://doefin.com${path === '/' ? '' : path}"`), `${path}: wrong Open Graph URL`)
    assert(/<title>[^<]+<\/title>/.test(html), `${path}: missing source title`)
    assert(/<meta name="description" content="[^"]+"/.test(html), `${path}: missing source description`)
    assert(!html.includes('aria-label="Website version"'), `${path}: removed version switcher remains`)
    for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      assert(!/^\/v[1234](?:\/|[?#]|$)/.test(href), `${path}: body link leaves V3: ${href}`)
      if (href.startsWith('/') && !/^\/(?:api|images|_next|feed\.xml|sitemap\.xml|robots\.txt|llms\.txt|favicon\.ico)(?:\/|[?#]|$)/.test(href)) {
        const destination = href.split(/[?#]/)[0]
        if (!routeSet.has(destination) && base) {
          const response = await fetch(base + destination)
          assert.equal(response.status, 200, `${path}: missing internal destination: ${href}`)
          routeSet.add(destination)
        } else assert(routeSet.has(destination), `${path}: missing internal destination: ${href}`)
      }
    }
  }
  console.log(`Passed ${expected.length} preserved routes and ${pages.length} root pages.`)
}

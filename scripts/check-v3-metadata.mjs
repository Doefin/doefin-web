/** Focused metadata regression check. Add --built or --base=http://127.0.0.1:3036. */
import assert from 'node:assert/strict'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const cache = new Map()
function load(file) {
  file = resolve(file)
  if (cache.has(file)) return cache.get(file).exports
  const module = { exports: {} }
  cache.set(file, module)
  const code = ts.transpileModule(readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText
  const localRequire = specifier => {
    if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return require(specifier)
    const base = specifier.startsWith('@/') ? resolve(specifier.slice(2)) : resolve(dirname(file), specifier)
    const target = [base, base + '.ts', base + '/index.ts'].find(path => existsSync(path) && statSync(path).isFile())
    assert(target, `Cannot resolve ${specifier} from ${file}`)
    return load(target)
  }
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports)
  return module.exports
}

const { seo, jsonLd, authorNode, ID, v3SocialImage } = load('lib/seo.ts')
const { site } = load('lib/site.ts')
const { getAuthor } = load('content/authors.ts')
const unsupported = /published confidence intervals|public accuracy scoreboard|scoring every estimator|registered in Mauritius|Port Louis|Publishes (?:forward )?difficulty forecasts/i
const truthful = value => assert(!unsupported.test(value), `Unsupported shared metadata claim: ${value}`)
truthful(site.description)
truthful(authorNode(getAuthor('doefin-research')).description)

const sampleSchema = { '@id': ID.org, url: `${site.url}/glossary/mining-difficulty`, author: authorNode(getAuthor('doefin-research')), external: 'https://bitcoin.org/en/' }
const defaultSchema = JSON.parse(jsonLd(sampleSchema).__html)
const v3Schema = JSON.parse(jsonLd(sampleSchema, 'v3').__html)
assert.equal(defaultSchema.url, `${site.url}/v3/glossary/mining-difficulty`)
assert.equal(v3Schema.url, `${site.url}/v3/glossary/mining-difficulty`)
assert.equal(v3Schema.author.url, `${site.url}/v3/about#doefin-research`)
assert.equal(v3Schema['@id'], ID.org, 'Organization identity must remain stable')
assert.equal(v3Schema.author['@id'], defaultSchema.author['@id'], 'Author identity must remain stable')
assert.equal(v3Schema.external, sampleSchema.external)
const defaultMetadata = seo({ title: 'Example', description: 'Example', path: '/docs' })
assert.equal(defaultMetadata.alternates.canonical, `${site.url}/v3/docs`)
assert.deepEqual(defaultMetadata.openGraph.images, [v3SocialImage], 'Default metadata must use V3 social imagery')
const preview = seo({ title: 'Example', description: 'Example', path: '/v3/docs' })
assert.equal(preview.alternates.canonical, `${site.url}/v3/docs`)
assert.deepEqual(preview.openGraph.images, [v3SocialImage])
assert.deepEqual(preview.twitter.images, [v3SocialImage])
const llms = await load('app/llms.txt/route.ts').GET().text()
truthful(llms)
assert(llms.includes('V3 website prototype'))
assert(llms.includes('illustrative examples'))
assert(llms.includes(`${site.url}/v3/glossary/mining-difficulty`))
assert(!/\/v[124](?:\/|[)\s])/.test(llms), 'Discovery must not point to removed versions')

function schemas(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]))
}

function checkPage(html, path) {
  assert(html.includes(`<link rel="canonical" href="${site.url}${path}"`), `${path}: canonical`)
  assert(html.includes('<meta name="robots" content="noindex, nofollow"'), `${path}: preview robots`)
  assert(html.includes(`<meta property="og:image" content="${v3SocialImage.url}"`), `${path}: Open Graph image`)
  assert(html.includes(`<meta name="twitter:image" content="${v3SocialImage.url}"`), `${path}: Twitter image`)
  const data = schemas(html)
  const org = data.find(value => value['@id'] === ID.org)
  const website = data.find(value => value['@id'] === ID.website)
  assert(org && website, `${path}: missing shared entity graph`)
  for (const entity of [org, website]) truthful(entity.description)
  assert(!org.address && !org.legalName, `${path}: unverified legal entity metadata`)
  // These retained reference pages opt into explicit server schema versions.
  if (/^\/v3\/(?:glossary|academy\/guides)(?:\/|$)/.test(path)) {
    for (const entity of data) {
      assert(!JSON.stringify(entity).includes(`${site.url}/v1`), `${path}: removed-version schema URL`)
      if (entity.author?.description) truthful(entity.author.description)
    }
    const breadcrumbs = data.find(value => value['@type'] === 'BreadcrumbList')
    assert.equal(breadcrumbs?.itemListElement[0]?.item, `${site.url}/v3`, `${path}: versioned Home crumb`)
  }
}

let checked = 0
if (process.argv.includes('--built')) {
  const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
  for (const path of Object.keys(manifest.routes).filter(path => /^\/v3(?:\/|$)/.test(path) && !path.endsWith('.csv') && path !== '/v3/social-image')) {
    checkPage(readFileSync(`.next/server/app${path}.html`, 'utf8'), path)
    checked++
  }
  assert(checked > 20, 'Expected complete V3 build')
}

const base = process.argv.find(arg => arg.startsWith('--base='))?.slice(7)
if (base) {
  for (const path of ['/v3', '/v3/product', '/v3/glossary', '/v3/glossary/mining-difficulty', '/v3/academy/guides/difficulty-exposure']) {
    const response = await fetch(base + path)
    assert.equal(response.status, 200, path)
    checkPage(await response.text(), path)
    checked++
  }
  const image = await fetch(base + '/v3/social-image')
  assert.equal(image.status, 200)
  assert(image.headers.get('content-type')?.startsWith('image/png'))
  assert.equal(image.headers.get('x-robots-tag'), 'noindex, nofollow')
  const png = Buffer.from(await image.arrayBuffer())
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
  truthful(await (await fetch(base + '/llms.txt')).text())
}
console.log(`Passed shared claims, author identity, V3 defaults, V3 schema URLs and social metadata; checked ${checked} rendered pages.`)

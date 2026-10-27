// Explicit local runtime-regression preload. Never imported by website source.
const fs = require('node:fs')
const file = process.env.DOEFIN_GLOSSARY_TEST_FIXTURE
if (!file) throw new Error('Runtime fixture file is required for the test preload')
const realFetch = globalThis.fetch
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url)
  if (url.hostname === 'yzvr33lo.api.sanity.io' && url.pathname === '/v2025-02-19/data/query/production') {
    const fixture = JSON.parse(fs.readFileSync(file, 'utf8'))
    const editorial = url.searchParams.get('query')?.includes('editorialArticle')
    const docs = url.searchParams.get('query')?.includes('docPage')
    const manifest = docs && !url.searchParams.get('query')?.includes('sections')
    const result = docs ? (manifest && Object.hasOwn(fixture,'docsManifest') ? fixture.docsManifest : fixture.docs ?? []) : Array.isArray(fixture) ? (editorial ? { topics: [], articles: [] } : fixture) : (editorial ? fixture.editorial : fixture.glossary)
    const status = manifest ? fixture.docsManifestStatus ?? fixture.docsStatus ?? fixture.status : docs ? fixture.docsStatus ?? fixture.status : fixture.status
    if (status) return new Response('Fixture API failure', { status })
    return new Response(JSON.stringify({result}), {status:200,headers:{'content-type':'application/json'}})
  }
  return realFetch(input, init)
}

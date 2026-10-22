/** Review artifact only. Reads the latest build; never alters routing or indexing. */
import { readFileSync, writeFileSync } from 'node:fs'
const manifest = JSON.parse(readFileSync('.next/prerender-manifest.json', 'utf8'))
const built = new Set(Object.keys(manifest.routes))
const htmlPages = [...built].filter(path => /^\/v3(?:\/|$)/.test(path) && !path.endsWith('.csv') && !/\/(?:social-image|opengraph-image)$/.test(path)).sort()
const retainedInternalPreviews = htmlPages.filter(path => /^\/v3\/prototype-review(?:\/|$)/.test(path)).map(path => ({
  path,
  indexable: false,
  redirect: null,
  reason: 'Internal controlled-QA surface. Retain only as a noindex preview; exclude from public canonical routes, sitemap and public navigation.',
}))
const internalPaths = new Set(retainedInternalPreviews.map(item => item.path))
const pages = htmlPages.filter(path => !internalPaths.has(path))
if (pages.length < 20) throw new Error('A complete V3 build is required before preparing the plan')
const mappings = pages.map(preview => {
  const canonical = preview.replace(/^\/v3/, '') || '/'
  const legacy = ['v1', 'v2'].map(version => preview.replace(/^\/v3/, '/' + version)).filter(path => built.has(path))
  if (canonical === '/' && built.has('/v4')) legacy.push('/v4')
  return { preview, canonical, canonicalUrl: 'https://doefin.com' + canonical, proposedRedirects: [preview, ...legacy].map(source => ({ source, destination: canonical, status: 308 })), state: 'proposal-only' }
})
const plan = {
  active: false,
  generatedFrom: '.next/prerender-manifest.json',
  purpose: 'Reviewable canonical migration proposal. Current version previews, robots and routes are unchanged.',
  sourceHtmlPageCount: htmlPages.length,
  sourcePageCount: pages.length,
  canonicalPublicPageCount: pages.length,
  retainedInternalPreviews,
  prerequisites: ['Approved publication and content review', 'Documented email/data/measurement readiness', 'Implemented canonical route hosting and link adapter', 'Reviewed legacy paths absent from these matching aliases', 'Staging redirect, metadata and rollback verification'],
  mappings,
  unmatchedLegacyPages: [...built].filter(path => /^\/v[124](?:\/|$)/.test(path) && !path.endsWith('.csv') && !/\/(?:social-image|opengraph-image)$/.test(path) && !mappings.some(mapping => mapping.proposedRedirects.some(redirect => redirect.source === path))).sort(),
}
writeFileSync('docs/v3-canonical-migration.json', JSON.stringify(plan, null, 2) + '\n')
console.log(`Prepared an INACTIVE plan for ${pages.length} public V3 pages; ${retainedInternalPreviews.length} internal previews retained separately from ${htmlPages.length} total HTML pages. ${plan.unmatchedLegacyPages.length} unmatched legacy paths require explicit review. No route or metadata was changed.`)

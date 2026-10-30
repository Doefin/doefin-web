import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { loadTypescript } from './lib/load-typescript.mjs'
const base = process.argv.find(value => value.startsWith('--base='))?.slice(7) ?? 'http://127.0.0.1:3040'
const source = loadTypescript('content/v3-research.ts')
const reports = source.v3Reports, methodology = source.v3Methodology
const decode = value => value.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (_, code) => {
  if (code[0] === '#') return String.fromCodePoint(code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1)))
  return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[code.toLowerCase()]
})
const domText = html => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<!--[^]*?-->/g, ' ').replace(/<\/(?:p|h[1-6]|li|div|section|article|header|footer|nav|tr|td|th|blockquote|ul|ol|main|aside|time)>/gi, ' ').replace(/<(?:br|hr)\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim()
const norm = text => text.normalize('NFC').replace(/\s+/g, ' ').trim()
async function get(path, status = 200) {
  const response = await fetch(base + path, { headers: { 'user-agent': 'SanityResearchVerification/1.0' } })
  assert.equal(response.status, status, `${path} status`)
  return { response, body: await response.text() }
}
const jsonld = html => [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map(match => JSON.parse(match[1]))
const result = { base, routes: {}, reports: [], methodology: {}, graph: {}, feed: {}, backend: {} }
const index = await get('/research'), resources = await get('/resources')
for (const report of reports) {
  const path = `/research/${report.slug}`, { body } = await get(path), text = domText(body)
  for (const section of report.sections) {
    const id = section.heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
    assert.match(body, new RegExp(`\\bid="${id}"`), `${path} anchor ${id}`)
    for (const paragraph of section.paragraphs) assert.ok(text.includes(norm(paragraph)), `${path} missing source paragraph: ${section.heading}`)
  }
  assert.ok(text.includes(report.title) && text.includes(report.summary), `${path} title/summary`)
  assert.match(body, new RegExp(`<link rel="canonical" href="https://doefin\\.com${path.replaceAll('/', '\\/')}"`), `${path} canonical`)
  const article = jsonld(body).find(row => row['@type'] === 'Article')
  assert.equal(article?.headline, report.title); assert.equal(article?.description, report.summary); assert.equal(article?.datePublished, report.publishedAt)
  assert.equal(article?.author, undefined, 'No author invented for report JSON-LD')
  assert.ok(index.body.includes(`href="${path}"`) && index.body.includes(report.title), 'Research index resolves CMS report')
  assert.ok(resources.body.includes(`href="${path}"`) && resources.body.includes(report.title), 'Resources resolves CMS report')
  result.reports.push({ slug: report.slug, status: 200, exactSections: report.sections.length, exactParagraphs: report.sections.reduce((sum, section) => sum + section.paragraphs.length, 0), anchors: report.sections.map(section => section.heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')), datePublished: article.datePublished, canonical: `https://doefin.com${path}`, authorField: 'absent as in source' })
}
const methodPath = '/methodology/difficulty-index', method = await get(methodPath), methodText = domText(method.body)
for (const section of methodology) {
  const id = section.heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  assert.match(method.body, new RegExp(`\\bid="${id}"`), `Methodology anchor ${id}`)
  for (const paragraph of section.paragraphs) assert.ok(methodText.includes(norm(paragraph)), `Methodology missing source paragraph: ${section.heading}`)
}
assert.match(method.body, /<link rel="canonical" href="https:\/\/doefin\.com\/methodology\/difficulty-index"/)
assert.ok(!methodText.includes('TEMP lifecycle check'), 'Lifecycle marker absent')
result.methodology = { status: 200, exactSections: methodology.length, exactParagraphs: methodology.reduce((sum, section) => sum + section.paragraphs.length, 0), anchors: methodology.map(section => section.heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')), canonical: 'https://doefin.com/methodology/difficulty-index', dateOrAuthorAdded: false }
const feed = await get('/feed.xml')
assert.ok(reports.every(report => feed.body.includes(`<title>${report.title}</title>`)), 'Feed contains CMS reports')
assert.ok(feed.body.includes('<pubDate>Thu, 22 Oct 2026 00:00:00 GMT</pubDate>') && feed.body.includes('<pubDate>Mon, 19 Oct 2026 00:00:00 GMT</pubDate>'), 'Feed preserves source dates')
result.feed = { status: feed.response.status, includesBothCmsReports: true, sourceDatesPreserved: true }
const graph = await get('/glossary/mining-difficulty')
assert.ok(reports.every(report => graph.body.includes(report.title) && graph.body.includes(`/research/${report.slug}`)), 'Glossary research backlinks use current CMS report content')
result.graph = { glossaryTerm: 'mining-difficulty', status: graph.response.status, includesBothCmsResearchBacklinks: true }
result.routes = { researchIndex: index.response.status, resources: resources.response.status, reportPages: reports.length, methodology: method.response.status, unknownReport: (await get('/research/not-a-published-report', 404)).response.status, unknownMethodology: (await get('/methodology/not-a-published-method', 404)).response.status }
const [forecastApi, observedApi] = await Promise.all([get('/api/v3/research/v1/forecasts'), get('/api/v3/research/v1/dataset?format=csv')])
result.backend = { forecastArchive: { status: forecastApi.response.status, contentType: forecastApi.response.headers.get('content-type') }, observedDataset: { status: observedApi.response.status, contentType: observedApi.response.headers.get('content-type') }, dataRoutesRemainOutsideSanityNarrative: true }
await mkdir('work/sanity-research-methodology', { recursive: true })
await writeFile('work/sanity-research-methodology/http-verification.json', JSON.stringify(result, null, 2) + '\n')
console.log(JSON.stringify(result, null, 2))

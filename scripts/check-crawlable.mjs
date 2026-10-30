/**
 * Fails the build if a page would return an empty body to a crawler.
 *
 * The trading app's CI passes green with an empty body — that is how the site
 * shipped invisible to every search engine. This is the guard that stops it
 * happening here. Run after `next build`.
 */
const MIN_WORDS = 120
const baseArgument = process.argv.find(argument => argument === '--base' || argument.startsWith('--base='))
const usage = 'Usage: npm run check:crawlable -- --base=http://127.0.0.1:3039\nStart the site first with `npm run start -- --port 3039` (or `npm run dev`).'
if (!baseArgument?.startsWith('--base=') || !baseArgument.slice(7).trim()) {
  console.error(`${usage}\nA running site URL is required; this check fetches dynamic pages and does not read build artifacts.`)
  process.exit(2)
}

let base
try {
  const url = new URL(baseArgument.slice(7))
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Expected an HTTP or HTTPS URL')
  base = url.toString().replace(/\/+$/, '')
} catch (error) {
  console.error(`Invalid --base URL: ${error.message}\n${usage}`)
  process.exit(2)
}

const PAGES = [
  ['/', 'Home'],
  ['/academy/guides/hosting-effective-rate', 'Calculator guide'],
  ['/docs', 'Docs index'],
  ['/docs/key-terms', 'Docs definitions'],
  ['/resources', 'Resources'],
  ['/tools/difficulty-exposure', 'Enhanced tool'],
  ['/product/settlement', 'Settlement'],
  ['/glossary/hashprice', 'Glossary'],
  ['/research/difficulty-forecast-accuracy-2026', 'Research'],
  ['/learn/difficulty-exposure', 'Tutorial'],
  ['/data/difficulty', 'Difficulty data'],
  ['/for/miners', 'Miners planner'],
]

const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

let failed = 0
for (const [file, label] of PAGES) {
  let html
  try {
    const response = await fetch(base + file)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    html = await response.text()
  } catch (error) {
    console.error(`FAIL  ${label.padEnd(22)} ${file} (${error.message})`)
    failed++
    continue
  }
  const words = text(html).split(' ').filter(Boolean).length
  const hasH1 = /<h1[\s>]/.test(html)
  const hasTitle = /<title>/.test(html)
  const hasCanonical = /rel="canonical"/.test(html)

  const problems = []
  if (words < MIN_WORDS) problems.push(`only ${words} words`)
  if (!hasH1) problems.push('no <h1>')
  if (!hasTitle) problems.push('no <title>')
  if (!hasCanonical) problems.push('no canonical')

  if (problems.length) {
    console.error(`FAIL  ${label.padEnd(22)} ${problems.join(', ')}`)
    failed++
  } else {
    console.log(`ok    ${label.padEnd(22)} ${words} words, h1 + title + canonical present`)
  }
}

if (failed) {
  console.error(`\n${failed} page(s) would be invisible to crawlers.`)
  process.exit(1)
}
console.log(`\nAll ${PAGES.length} checked pages at ${base} return real prose to a crawler.`)

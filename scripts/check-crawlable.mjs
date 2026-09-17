/**
 * Fails the build if a page would return an empty body to a crawler.
 *
 * The trading app's CI passes green with an empty body — that is how the site
 * shipped invisible to every search engine. This is the guard that stops it
 * happening here. Run after `next build`.
 */
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const ROOT = join(process.cwd(), '.next', 'server', 'app')
const MIN_WORDS = 120

const PAGES = [
  ['v2.html', 'V2 home'],
  ['v2/learn/difficulty-exposure.html', 'V2 tutorial'],
  ['v2/research/evaluating-a-forecast.html', 'V2 sample report'],
  ['v1.html', 'V1 home'],
  ['v1/data/difficulty.html', 'Difficulty forecast'],
  ['v1/glossary/hashprice.html', 'Glossary term'],
  ['v1/research/difficulty-forecast-accuracy-2026.html', 'Research report'],
  ['v1/for/miners.html', 'For miners'],
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
    html = await readFile(join(ROOT, file), 'utf8')
  } catch {
    console.error(`FAIL  ${label.padEnd(22)} ${file} not found — did the build run?`)
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
console.log('\nAll checked pages return real prose to a crawler.')

/**
 * Fails the build if a page would return an empty body to a crawler.
 *
 * The trading app's CI passes green with an empty body — that is how the site
 * shipped invisible to every search engine. This is the guard that stops it
 * happening here. Run after `next build`.
 */
import { readFile, readdir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const ROOT = join(process.cwd(), '.next', 'server', 'app')
const MIN_WORDS = 120
const base = process.argv.find(a => a.startsWith('--base='))?.slice(7)

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

const builtFiles = []
const collectHtml = async directory => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) await collectHtml(file)
    else if (entry.name.endsWith('.html')) builtFiles.push(file)
  }
}
await collectHtml(ROOT)
const artifactRoute = file => {
  const segments = relative(ROOT, file).split(sep).filter(segment => !/^\(.*\)$/.test(segment))
  const route = `/${segments.join('/')}`.replace(/\.html$/, '')
  return route === '/index' ? '/' : route
}
const builtPath = path => {
  const match = builtFiles.find(file => artifactRoute(file) === path)
  return match ?? join(ROOT, `${path === '/' ? 'index' : path.slice(1)}.html`)
}

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
    if (base) {
      const response = await fetch(base + file)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      html = await response.text()
    } else html = await readFile(builtPath(file), 'utf8')
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

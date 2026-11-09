/** Route/presentation contracts. No browser or legal certification is implied. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

async function load(path) {
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } })
  return import('data:text/javascript;base64,' + Buffer.from(outputText).toString('base64'))
}
const policy = await load('lib/v3-publication.ts')
const glossary = await load('content/glossary.ts')
assert.equal(policy.publicationMode, 'preview', 'Publication cutover must remain inactive')
assert.deepEqual(policy.publicationUi(), { showVersionSelector: false, showPreviewLabel: true })
assert.deepEqual(policy.publicationUi('canonical'), { showVersionSelector: false, showPreviewLabel: false })
assert.deepEqual(policy.navigationGroups.map(group => group.label), ['Product', 'Tools', 'Data & research', 'Learn'])
for (const path of ['/research', '/research/example', '/data/scoreboard', '/methodology/difficulty-index', '/learn', '/learn/difficulty-exposure', '/academy/guides/hosting-effective-rate', '/blog/tag/uncertainty', '/glossary/hashrate', '/glossary/?ref=a#b', '/newsletter', '/newsletter?ref=research#sample-issue']) {
  assert(policy.isCommentaryPath(path), path)
  assert(!policy.navigationForPath(path).some(group => group.label === 'Product'), `${path}: product acquisition navigation must be absent`)
  assert.equal(policy.commentaryPromotionFor(path), null, `${path}: no approved promotion may be assumed`)
}
for (const path of ['/', '/product', '/product/settlement', '/for/miners', '/for/institutions', '/tools/difficulty-exposure', '/docs', '/data-unrelated', '/v4/research']) {
  assert(!policy.isCommentaryPath(path), path)
  assert.equal(policy.navigationForPath(path).length, 4)
}
const destinations = policy.navigationGroups.flatMap(group => group.sections.flatMap(section => section.items.map(item => item.href)))
assert.deepEqual([...destinations].sort(), [
  '/product', '/product/settlement', '/for/miners', '/for/institutions',
  '/docs', '/docs/smart-contracts', '/docs/risks-and-limitations', '/about',
  '/tools', '/tools/difficulty-exposure', '/tools/hosting-effective-rate', '/tools/fleet-payback',
  '/data', '/data/difficulty', '/data/hashrate', '/data/scoreboard',
  '/methodology/difficulty-index', '/research', '/newsletter',
  '/learn', '/learn/difficulty-exposure', '/academy', '/academy#guides', '/blog', '/glossary', '/resources',
].sort())
for (const group of policy.navigationGroups) {
  assert(group.sections.some(section => section.items.includes(group.feature.item)), group.label)
}
assert.deepEqual(policy.navigationShortcuts(true).map(item => item.href), ['/tools/difficulty-exposure'])
assert.deepEqual(policy.navigationShortcuts(false).map(item => item.href), ['/product', '/tools/difficulty-exposure'])
assert.equal(policy.plannedCanonicalPath('/v3'), '/')
assert.equal(policy.plannedCanonicalPath('/v3/tools/difficulty-exposure?eh=2#result'), '/tools/difficulty-exposure?eh=2#result')
assert.equal(policy.plannedCanonicalPath('/v1/glossary/hashrate'), '/glossary/hashrate')
assert.equal(policy.plannedCanonicalPath('/v4'), '/')
for (const path of ['/api/v3/market-snapshot', 'https://example.com/v3', '/v31/learn', '/docs']) assert.equal(policy.plannedCanonicalPath(path), null)
assert.equal(glossary.glossary.length, 19)
for (const term of glossary.glossary) assert(term.shortDef.length < 160, `${term.slug}: ${term.shortDef.length} characters`)
const chrome = readFileSync('components/v3/Chrome.tsx', 'utf8')
const header = readFileSync('components/v3/SiteHeader.tsx', 'utf8')
assert(header.includes('!commentary && <a href={site.appUrl}'), 'Header app promotion must be conditional')
assert(chrome.includes('For professional investors. You can lose the full amount paid for a position.'), 'Professional investor line and risk line must remain')
assert(chrome.includes('commentaryPromotionFor(pathname)'), 'Commentary templates must use the separate optional promotion layer')
assert(!readFileSync('components/v3/V3Learn.tsx', 'utf8').includes('site.appUrl'), 'Learning index must remain educational')
const tutorial = readFileSync('components/v3/pages/TutorialPage.tsx', 'utf8')
const tutorialRelated = readFileSync('components/v3/TutorialRelatedContent.tsx', 'utf8')
assert(tutorial.includes('<TutorialRelatedContent {...tutorial.related} />'), 'Reused tutorial must use its V3-aware next-reading boundary')
assert(!tutorialRelated.includes('useSiteVersion'), 'The selected V3 tutorial must not depend on version switching')
assert(tutorialRelated.includes("href: '/docs/how-settlement-works'"), 'Tutorial must point to neutral settlement documentation')
assert(tutorialRelated.includes('action={action}'), 'Tutorial calculator actions must retain their supplied props')
assert(!tutorialRelated.includes('/product/settlement'), 'The V3 next-reading override must not promote the product route')
console.log('V3 publication contracts passed: commentary/product routes, four-job discovery, inactive cutover, empty promotion layer, and 19 short glossary definitions.')

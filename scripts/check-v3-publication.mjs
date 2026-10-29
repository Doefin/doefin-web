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
assert.deepEqual(policy.navigationGroups.map(group => group.label), ['Product', 'Tools', 'Data & Research', 'Learn'])
for (const path of ['/v3/research', '/v3/research/example', '/v3/data/scoreboard', '/v3/methodology/difficulty-index', '/v3/learn', '/v3/learn/difficulty-exposure', '/v3/academy/guides/hosting-effective-rate', '/v3/blog/tag/uncertainty', '/v3/glossary/hashrate', '/v3/glossary/?ref=a#b', '/v3/newsletter', '/v3/newsletter?ref=research#sample-issue']) {
  assert(policy.isCommentaryPath(path), path)
  assert(!policy.navigationForPath(path).some(group => group.label === 'Product'), `${path}: product acquisition navigation must be absent`)
  assert.equal(policy.commentaryPromotionFor(path), null, `${path}: no approved promotion may be assumed`)
}
for (const path of ['/v3', '/v3/product', '/v3/product/settlement', '/v3/for/miners', '/v3/for/institutions', '/v3/tools/difficulty-exposure', '/v3/docs', '/v3/data-unrelated', '/v4/research']) {
  assert(!policy.isCommentaryPath(path), path)
  assert.equal(policy.navigationForPath(path).length, 4)
}
const destinations = policy.navigationGroups.flatMap(group => group.items.map(item => item.href))
for (const destination of ['/v3/docs', '/v3/docs/smart-contracts', '/v3/for/miners', '/v3/for/institutions', '/v3/tools', '/v3/research', '/v3/data', '/v3/learn', '/v3/academy', '/v3/blog', '/v3/glossary', '/v3/resources']) assert(destinations.includes(destination), destination)
assert.equal(policy.plannedCanonicalPath('/v3'), '/')
assert.equal(policy.plannedCanonicalPath('/v3/tools/difficulty-exposure?eh=2#result'), '/tools/difficulty-exposure?eh=2#result')
assert.equal(policy.plannedCanonicalPath('/v1/glossary/hashrate'), '/glossary/hashrate')
assert.equal(policy.plannedCanonicalPath('/v4'), '/')
for (const path of ['/api/v3/market-snapshot', 'https://example.com/v3', '/v31/learn', '/docs']) assert.equal(policy.plannedCanonicalPath(path), null)
assert.equal(glossary.glossary.length, 19)
for (const term of glossary.glossary) assert(term.shortDef.length < 160, `${term.slug}: ${term.shortDef.length} characters`)
const chrome = readFileSync('components/v3/Chrome.tsx', 'utf8')
assert(chrome.includes('!commentary && <a href={site.appUrl}'), 'Header app promotion must be conditional')
assert(chrome.includes('For professional investors. Positions involve risk.'), 'Professional investor line must remain')
assert(chrome.includes('commentaryPromotionFor(pathname)'), 'Commentary templates must use the separate optional promotion layer')
assert(!readFileSync('components/v3/V3Learn.tsx', 'utf8').includes('site.appUrl'), 'Learning index must remain educational')
const tutorial = readFileSync('components/v3/pages/TutorialPage.tsx', 'utf8')
const tutorialRelated = readFileSync('components/v3/TutorialRelatedContent.tsx', 'utf8')
assert(tutorial.includes('<TutorialRelatedContent {...tutorial.related} />'), 'Reused tutorial must use its V3-aware next-reading boundary')
assert(!tutorialRelated.includes('useSiteVersion'), 'The selected V3 tutorial must not depend on version switching')
assert(tutorialRelated.includes("href: '/v3/docs/how-settlement-works'"), 'V3 tutorial must point to neutral settlement documentation')
assert(tutorialRelated.includes('action={action}'), 'Tutorial calculator actions must retain their supplied props')
assert(!tutorialRelated.includes('/product/settlement'), 'The V3 next-reading override must not promote the product route')
console.log('V3 publication contracts passed: commentary/product routes, four-job discovery, inactive cutover, empty promotion layer, and 19 short glossary definitions.')

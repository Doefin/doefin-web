/** Run with `node scripts/check-scenario-brief.mjs`; no build or extra test dependency. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import ts from 'typescript'

// Compile only the pure local helpers, so this works with the repository's Node runtimes.
const modules = new Map()
function loadTs(file) {
  const path = resolve(file)
  if (modules.has(path)) return modules.get(path).exports
  const module = { exports: {} }
  modules.set(path, module)
  const { outputText } = ts.transpileModule(readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  })
  const localRequire = name => {
    assert(name.startsWith('.'), `Pure helper has a nonlocal dependency: ${name}`)
    return loadTs(resolve(dirname(path), name + '.ts'))
  }
  new Function('require', 'module', 'exports', outputText)(localRequire, module, module.exports)
  return module.exports
}

const { calculateExposure, exposureBounds, exposureDefaults } = loadTs('lib/exposure.ts')
const { readToolQuery, toolQuery } = loadTs('lib/tool-url-state.ts')
const { createScenarioBrief, restoreExposureScenario, scenarioUrl, scenarioBriefHtml, scenarioDiscussionHref, isLocalScenarioUrl, scenarioContextFields, normalizeScenarioContext } = loadTs('lib/scenario-brief.ts')
const date = '2026-10-19T23:59:59.000Z'
const origin = 'https://preview.example.com'
const keys = Object.keys(exposureDefaults)
let passed = 0
function check(name, run) {
  try { run(); passed++ } catch (error) { console.error(`FAIL ${name}`); throw error }
}

check('Default calculation reference and unchanged production', () => {
  const out = calculateExposure(exposureDefaults)
  // Independent dimensional form: hashes/second × seconds ÷ hashes/block × BTC/block.
  const reference = (1e18 * (4 * 2016 * 600) / (127.48e12 * 2 ** 32)) * 3.175
  assert(Math.abs(out.base - reference) < 1e-10)
  const brief = createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin))
  assert.deepEqual(brief.results, out)
  assert.equal(brief.preparedDate, '2026-10-19')
  assert(brief.scenarios[1].production.includes(out.base.toFixed(3)))
})

check('Custom inputs keep decimals and exactly match the calculator', () => {
  const inputs = { eh: 2.345, epochs: 3, diffT: 141.123, low: -3.25, high: 8.75, fees: 0.123, price: 73456.789 }
  const brief = createScenarioBrief(inputs, date, scenarioUrl(inputs, origin))
  assert.deepEqual(brief.inputs, inputs)
  assert.deepEqual(brief.results, calculateExposure(inputs))
  assert.equal(brief.inputRows.find(row => row[0] === 'Bitcoin price')[1], '$73,456.789 / BTC')
  assert.equal(brief.inputRows.find(row => row[0] === 'Fleet hashrate')[1], '2.345 EH/s')
  assert.deepEqual(restoreExposureScenario(new URL(brief.scenarioUrl).searchParams), inputs)
})

check('Every boundary combination is finite and shareable without changing results', () => {
  for (let mask = 0; mask < 2 ** keys.length; mask++) {
    const inputs = Object.fromEntries(keys.map((key, i) => [key, exposureBounds[key][(mask >> i) & 1]]))
    const url = scenarioUrl(inputs, origin)
    const restored = restoreExposureScenario(new URL(url).searchParams)
    assert.deepEqual(restored, inputs)
    const brief = createScenarioBrief(restored, date, url)
    assert.deepEqual(brief.results, calculateExposure(inputs))
    assert(Object.values(brief.results).every(Number.isFinite))
    assert(!/NaN|Infinity/.test(scenarioBriefHtml(brief)))
  }
})

check('Shared URLs include every input even at defaults', () => {
  const url = new URL(scenarioUrl(exposureDefaults, origin))
  assert.equal(url.origin, origin)
  assert.equal(url.pathname, '/tools/difficulty-exposure')
  assert.deepEqual([...url.searchParams.keys()], keys)
  for (const key of keys) assert.equal(url.searchParams.get(key), String(exposureDefaults[key]))
  assert.equal(url.hash, '')
})

check('URL bounds clamp valid numbers and preserve defaults for invalid values', () => {
  const restored = restoreExposureScenario(new URLSearchParams('eh=-8&epochs=99&diffT=0&low=-100&high=999&fees=-4&price=1'))
  assert.deepEqual(restored, { eh: 0.01, epochs: 13, diffT: 1, low: -15, high: 15, fees: 0, price: 20000 })
  const invalid = new URLSearchParams('eh=NaN&epochs=Infinity&diffT=&low=%20&high=hello&fees=1e999&price=undefined&unknown=42')
  assert.deepEqual(restoreExposureScenario(invalid), exposureDefaults)
  assert.equal(readToolQuery(exposureDefaults, invalid, exposureBounds).found, false)
  assert(Object.values(calculateExposure(restored)).every(Number.isFinite))
})

check('URL restore does not mutate defaults and preserves existing unbounded behavior', () => {
  const defaults = Object.freeze({ a: 4, b: 8 })
  assert.deepEqual(readToolQuery(defaults, new URLSearchParams('a=-99&b=2.5')).values, { a: -99, b: 2.5 })
  assert.deepEqual(readToolQuery(defaults, new URLSearchParams('a=-99&b=2.5'), { a: [0, 10] }).values, { a: 0, b: 2.5 })
  assert.equal(toolQuery(defaults, { a: 4, b: 8 }), '')
  assert.equal(toolQuery(defaults, { a: 4, b: 2.5 }), 'b=2.5')
  assert.deepEqual(defaults, { a: 4, b: 8 })
})

check('Invalid or nonfinite brief inputs fail before producing a document', () => {
  for (const bad of [NaN, Infinity, -Infinity, 0, -1, 1001]) {
    assert.throws(() => createScenarioBrief({ ...exposureDefaults, diffT: bad }, date, null), /calculator range/)
  }
  assert.throws(() => createScenarioBrief(exposureDefaults, 'not-a-date', null), /preparation date/)
  assert.throws(() => scenarioUrl(exposureDefaults, 'javascript:alert(1)'), /HTTP or HTTPS/)
})

check('Download requires a preparation date and scenario URL', () => {
  assert.throws(() => scenarioBriefHtml(createScenarioBrief(exposureDefaults, null, null)), /dated scenario link/)
})

check('Standalone download includes all actual inputs, rows, limits and print support', () => {
  const brief = createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin))
  const html = scenarioBriefHtml(brief)
  assert(html.startsWith('<!doctype html>'))
  assert(html.includes('@page{size:A4'))
  assert(html.includes('@media print'))
  for (const [, value] of brief.inputRows) assert(html.includes(value))
  for (const row of brief.scenarios) assert(html.includes(row.production))
  assert(html.includes('not a hedge size, contract payout'))
  assert(!/<script|<iframe|<img|<link\b/i.test(html))
})

check('Download escapes dynamic content and rejects executable link schemes', () => {
  const brief = createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin))
  const malicious = '<img src=x onerror="alert(1)"><script>alert(2)</script>&\''
  const html = scenarioBriefHtml({ ...brief, inputRows: [['Unsafe label', malicious]], assumptions: [malicious], scenarioUrl: 'https://example.com/?one=1&two="quoted"' })
  assert(!/<script|<img/i.test(html))
  assert(html.includes('&lt;img'))
  assert(html.includes('&quot;alert(1)&quot;'))
  assert(html.includes('&amp;'))
  assert(html.includes('&#39;'))
  assert.throws(() => scenarioBriefHtml({ ...brief, scenarioUrl: 'javascript:alert(1)' }), /HTTP or HTTPS/)
})

check('Discussion action is a mail draft with the same scenario and no sending transport', () => {
  const brief = createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin))
  const mail = new URL(scenarioDiscussionHref(brief, 'team@example.com'))
  assert.equal(mail.protocol, 'mailto:')
  assert.equal(decodeURIComponent(mail.pathname), 'team@example.com')
  assert.equal(mail.searchParams.get('subject'), 'Discuss a Doefin difficulty scenario')
  const body = mail.searchParams.get('body')
  assert(body.includes(brief.scenarioUrl))
  assert(body.includes('not a hedge size or contract payout'))
  for (const row of brief.scenarios) assert(body.includes(row.production))
})

check('Local URL detection covers loopback names and addresses without matching public names', () => {
  for (const url of ['http://localhost:3000', 'http://preview.localhost:3000', 'http://LOCALHOST.:3000', 'http://127.0.0.1:3000', 'http://127.0.0.2:3000', 'http://[::1]:3000']) {
    assert.equal(isLocalScenarioUrl(url), true, url)
  }
  for (const url of [origin, 'https://doefin.com', 'https://localhost.example.com', 'https://example.com/localhost', 'https://example.com/?host=127.0.0.1', null, 'invalid']) {
    assert.equal(isLocalScenarioUrl(url), false, String(url))
  }
})

check('Only local HTML downloads and email drafts explain local sharing while preserving actual origins', () => {
  for (const sourceOrigin of ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://[::1]:3000', origin]) {
    const url = scenarioUrl(exposureDefaults, sourceOrigin)
    const brief = createScenarioBrief(exposureDefaults, date, url)
    const html = scenarioBriefHtml(brief)
    const email = new URL(scenarioDiscussionHref(brief, 'team@example.com')).searchParams.get('body')
    const local = isLocalScenarioUrl(url)
    assert.equal(html.includes('local preview on the originating computer'), local)
    assert.equal(email.includes('local preview on the originating computer'), local)
    assert.equal(html.includes('Forward the downloaded brief to share the results.'), local)
    assert.equal(email.includes('Forward the downloaded brief to share the results.'), local)
    assert.equal(new URL(brief.scenarioUrl).origin, sourceOrigin)
    assert(email.includes(url))
  }
})

check('Discussion context is included in the model, HTML and email without changing numeric calculations', () => {
  const context = { preparedFor: 'Mining operations team', decision: 'Review production sensitivity\nbefore choosing an operating plan.', questions: 'Which uptime assumption should we use?\n\nWho reviews settlement terms?' }
  const url = scenarioUrl(exposureDefaults, origin)
  const brief = createScenarioBrief(exposureDefaults, date, url, context)
  const plain = createScenarioBrief(exposureDefaults, date, url)
  assert.deepEqual(brief.context, context)
  assert.deepEqual(brief.results, plain.results)
  assert.deepEqual(brief.inputRows, plain.inputRows)
  assert.deepEqual(brief.scenarios, plain.scenarios)
  assert.equal(brief.inputKey, plain.inputKey)
  assert.notEqual(brief.briefKey, plain.briefKey)
  assert.deepEqual(brief.contextRows.map(([label]) => label), ['Prepared for', 'Decision to discuss', 'Questions requiring review'])
  const html = scenarioBriefHtml(brief)
  const email = new URL(scenarioDiscussionHref(brief, 'team@example.com')).searchParams.get('body')
  for (const value of Object.values(context)) {
    assert(html.includes(value))
    assert(email.includes(value))
  }
  assert(html.includes('white-space:pre-wrap'))
  assert(email.includes('Decision to discuss:\n' + context.decision))
})

check('Blank optional fields omit both labels and empty context sections cleanly', () => {
  const url = scenarioUrl(exposureDefaults, origin)
  const plain = createScenarioBrief(exposureDefaults, date, url)
  const blank = createScenarioBrief(exposureDefaults, date, url, { preparedFor: '  ', decision: '\r\n\t', questions: '' })
  assert.deepEqual(blank.contextRows, [])
  assert.equal(scenarioBriefHtml(blank), scenarioBriefHtml(plain))
  assert.equal(scenarioDiscussionHref(blank, 'team@example.com'), scenarioDiscussionHref(plain, 'team@example.com'))
  const partial = createScenarioBrief(exposureDefaults, date, url, { questions: 'Check inputs.' })
  assert.deepEqual(partial.contextRows, [['Questions requiring review', 'Check inputs.']])
  const html = scenarioBriefHtml(partial)
  assert(!html.includes('<dt>Prepared for</dt>'))
  assert(!html.includes('<dt>Decision to discuss</dt>'))
})

check('Context normalization enforces field bounds and keeps usable line breaks', () => {
  const values = Object.fromEntries(scenarioContextFields.map(field => [field.key, 'x'.repeat(field.maxLength + 50)]))
  const bounded = normalizeScenarioContext(values)
  for (const field of scenarioContextFields) assert.equal(bounded[field.key].length, field.maxLength)
  assert.deepEqual(normalizeScenarioContext({ preparedFor: '  Team\r\nAlpha  ', decision: '\r\nFirst\r\nSecond\rThird\n', questions: 'Keep\u0000 this\nquestion' }), {
    preparedFor: 'Team Alpha', decision: 'First\nSecond\nThird', questions: 'Keep this\nquestion',
  })
  const unicode = Object.fromEntries(scenarioContextFields.map(field => [field.key, 'x'.repeat(field.maxLength - 1) + '😀']))
  const normalized = normalizeScenarioContext(unicode)
  for (const field of scenarioContextFields) {
    assert(normalized[field.key].length <= field.maxLength)
    assert(!/[\uD800-\uDBFF]$/.test(normalized[field.key]))
  }
  assert.doesNotThrow(() => scenarioDiscussionHref(createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin), unicode), 'team@example.com'))
})

check('User context is escaped in HTML while remaining plain text in the email draft', () => {
  const context = { preparedFor: '<img src=x onerror="alert(1)">', decision: '<script>alert(2)</script>\nReview "A" & \'B\'', questions: 'First < second?\nCheck > threshold.' }
  const brief = createScenarioBrief(exposureDefaults, date, scenarioUrl(exposureDefaults, origin), context)
  const html = scenarioBriefHtml(brief)
  assert(!/<script|<img/i.test(html))
  assert(html.includes('&lt;img'))
  assert(html.includes('&lt;script&gt;alert(2)&lt;/script&gt;\nReview &quot;A&quot; &amp; &#39;B&#39;'))
  const email = new URL(scenarioDiscussionHref(brief, 'team@example.com')).searchParams.get('body')
  assert(email.includes(context.decision))
  assert(email.includes(context.questions))
})

check('Copied scenario URLs contain numeric inputs only, never optional context', () => {
  const context = { preparedFor: 'PRIVATE_RECIPIENT', decision: 'PRIVATE_DECISION', questions: 'PRIVATE_QUESTIONS' }
  const url = scenarioUrl(exposureDefaults, origin)
  const brief = createScenarioBrief(exposureDefaults, date, url, context)
  assert.equal(brief.scenarioUrl, url)
  assert.deepEqual([...new URL(brief.scenarioUrl).searchParams.keys()], keys)
  for (const value of Object.values(context)) assert(!brief.scenarioUrl.includes(value))
  // Even accidental extra object properties cannot enter the explicit input allowlist.
  assert.equal(scenarioUrl({ ...exposureDefaults, ...context }, origin), url)
  assert.deepEqual(restoreExposureScenario(new URL(url).searchParams), exposureDefaults)
})

console.log(`Passed ${passed} scenario brief checks, including all ${2 ** keys.length} input-boundary combinations.`)

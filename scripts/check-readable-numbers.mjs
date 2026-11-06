import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { loadTypescript } from './lib/load-typescript.mjs'

const format = loadTypescript('lib/readable-numbers.ts')
const { readableDifficulty: difficulty, readableHashrate: hashrate, readablePercentageChange: change } = format
let cases = 0
for (const [fn, input, expected] of [
  [difficulty, 148364561003867.4, '~148.36T'],
  [difficulty, '143809999999999.999999999999999999', '~143.81T'],
  [difficulty, '148360000000000', '148.36T'],
  [difficulty, '999995000000000', '~1,000T'],
  [difficulty, '999994999999999.99999999999999', '~999.99T'],
  [difficulty, '1.483645610038674e14', '~148.36T'],
  [hashrate, '1039876543210123456789.123456789012345678', '~1,039.88 EH/s'],
  [hashrate, '1000000000000000000.000000', '1 EH/s'],
  [hashrate, '1.234e18', '~1.23 EH/s'],
  [hashrate, '1.235e18', '~1.24 EH/s'],
  [hashrate, '9.99999999999999999999999999999999999999999999999999e20', '~1,000 EH/s'],
  [hashrate, '1' + '0'.repeat(200) + '.123', `~100${',000'.repeat(60)} EH/s`],
  [hashrate, '9944999999999999.99999999999999999', '~0.0099 EH/s'],
  [hashrate, '9995000000000000', '~0.01 EH/s'],
  [hashrate, '10000000000000000', '0.01 EH/s'],
  [hashrate, '10000000000000001', '~0.01 EH/s'],
  [hashrate, '12000000000000', '0.000012 EH/s'],
  [hashrate, '12345678900000', '~0.000012 EH/s'],
  [hashrate, '12345678900', '~1.2e−8 EH/s'],
  [hashrate, '99999999999', '~1e−7 EH/s'],
  [hashrate, '1e-100', '1e−118 EH/s'],
  [hashrate, '0', '0 EH/s'], [hashrate, '-0.00000', '0 EH/s'],
  [hashrate, '-1', 'Unavailable'], [difficulty, '-1', 'Unavailable'],
  [change, -0.0307123456789, '~−3.07%'],
  [change, '0.0307000000', '+3.07%'],
  [change, '-0.00000012345', '~−0.000012%'],
  [change, '-0.00000000000000012345', '~−1.2e−14%'],
  [change, '-0.00009995', '~−0.01%'],
  [change, '-0', '0%'], [change, 0, '0%'],
  [change, '0.99995', '~+100%'],
]) { assert.equal(fn(input), expected, `${fn.name}(${input})`); cases++ }
for (const input of [null, undefined, NaN, Infinity, -Infinity, '', ' ', 'bad', '1,000', '0x10', '--1', '1e', '1.2.3', {}, [], '1e1001', '1e-1001']) {
  for (const fn of [difficulty, hashrate, change]) { assert.equal(fn(input), 'Unavailable'); cases++ }
}
// Changing only the discarded tail must not disappear through Number coercion.
assert.equal(hashrate('1234999999999999999.' + '9'.repeat(300)), '~1.23 EH/s')
assert.equal(hashrate('1235000000000000000.' + '0'.repeat(300)), '~1.24 EH/s')
cases += 2

const requireInstalled = createRequire(import.meta.url)
function loadTsx(path, mocks) {
  const module = { exports: {} }
  const code = ts.transpileModule(readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText
  const require = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name]
    if (name === 'react/jsx-runtime') return requireInstalled(name)
    throw new Error(`Unexpected dependency ${name} in ${path}`)
  }
  new Function('require', 'module', 'exports', code)(require, module, module.exports)
  return module.exports
}
const contract = loadTypescript('lib/bitcoin-analytics-contract.ts')
const dataDetail = loadTsx('components/v3/DataDetail.tsx', {
  '@/components/routing/SiteLink': {}, '@/components/content/Breadcrumbs': {}, '@/components/layout/Container': {},
  '@/content': {}, '@/lib/format': {}, './Arrow': {}, './data-detail.module.css': {},
})
const server = loadTsx('components/v3/data-reading.tsx', {
  '@/components/routing/SiteLink': {}, '@/lib/bitcoin-analytics-contract': contract, '@/lib/readable-numbers': format,
  './DataDetail': dataDetail, './Arrow': {}, './BrowserAnalyticsFallback': { BrowserAnalyticsFallback: () => null },
})
const fixtures = {
  difficulty: { current_block_height: 970000, current_difficulty: 148364561003867.4, current_difficulty_epoch: 481, current_epoch_average_block_time: 582.545,
    blocks_till_next_adjustment: 10, last_difficulty_adjsutment_timestamp: 1793000000, time_to_next_adjustment: 6000,
    next_adjustment_timestamp: 1794006000, next_difficulty_estimation: 143809999999999.9, next_difficulty_pct_changes: -0.0307123456789,
    next_difficulty_adjustment_block_height: 970010 },
  hashrate: { block_number: 970000, timestamp: 1794000000, difficulty: '148364561003867.4',
    rolling_avg_hashrate_120: '1039876543210123456789.123456789012345678',
    rolling_avg_hashrate_144: '1000000000000000000.000000', rolling_avg_hashrate_2016: null },
}
const before = JSON.stringify(fixtures)
for (const value of Object.values(fixtures)) Object.freeze(value)
const result = kind => ({ status: 'available', httpStatus: 200, receivedAt: new Date(1794000060 * 1000).toISOString(), data: fixtures[kind] })
const htmlFor = (kind, browser, dataResult = result(kind)) => {
  if (!browser) return renderToStaticMarkup(React.createElement(kind === 'difficulty' ? server.DifficultyReadingPanel : server.HashrateReadingPanel, { result: dataResult, detail: true }))
  const component = loadTsx('components/v3/BrowserAnalyticsFallback.tsx', {
    react: { useEffect: () => {}, useState: () => [dataResult, () => {}] },
    '@/lib/browser-analytics': { describeServerOutcome: () => 'Server returned no usable data.' },
    '@/lib/bitcoin-analytics-contract': contract, '@/lib/readable-numbers': format,
  }).BrowserAnalyticsFallback
  return renderToStaticMarkup(React.createElement(component, { kind, serverStatus: 'unavailable' }))
}
const prose = []
for (const browser of [false, true]) {
  for (const kind of ['difficulty', 'hashrate']) {
    const html = htmlFor(kind, browser)
    prose.push(html)
    const disclosures = [...html.matchAll(/<details\b[^>]*>([\s\S]*?)<\/details>/g)]
    assert.equal(disclosures.length, 1)
    assert.match(disclosures[0][1], /<summary[^>]*>Show exact source values<\/summary>/)
    assert.doesNotMatch(html, /<details[^>]*\bopen(?:[\s=>])/)
    assert.match(disclosures[0][1], /970,000/)
    assert.match(disclosures[0][1], /UTC/)
    if (kind === 'difficulty') {
      assert.match(html, /~148\.36T/); assert.match(html, /~143\.81T/); assert.match(html, /~−3\.07%/)
      for (const exact of ['148364561003867.4', '143809999999999.9', '-0.0307123456789']) assert.ok(disclosures[0][1].includes(exact))
      assert.match(disclosures[0][1], /source ratio/)
    } else {
      assert.match(html, /~1,039\.88 EH\/s/)
      for (const raw of [fixtures.hashrate.rolling_avg_hashrate_120, fixtures.hashrate.rolling_avg_hashrate_144]) assert.ok(disclosures[0][1].includes(raw + ' H/s'))
      assert.match(disclosures[0][1], /120 blocks/); assert.match(disclosures[0][1], /144 blocks/)
      assert.ok(disclosures[0][1].includes(contract.hashrateHpsToEhps(fixtures.hashrate.rolling_avg_hashrate_120)))
    }
  }
  for (const status of ['region-restricted', 'not-found', 'invalid', 'unavailable']) {
    const html = htmlFor('difficulty', browser, { status, httpStatus: status === 'region-restricted' ? 451 : 503, receivedAt: result('difficulty').receivedAt })
    assert.doesNotMatch(html, /~148|~143|Show exact source values/)
    assert.match(html, /role="status"/)
  }
  const empty = htmlFor('hashrate', browser, { ...result('hashrate'), data: { ...fixtures.hashrate, rolling_avg_hashrate_120: null, rolling_avg_hashrate_144: null } })
  assert.doesNotMatch(empty, /Show exact source values/)
  assert.match(empty, /no (?:populated )?hashrate windows/)
}
const serverHashrate = htmlFor('hashrate', false)
assert.match(serverHashrate, /API record/)
assert.match(htmlFor('hashrate', false, { ...result('hashrate'), receivedAt: new Date((1794000000 + 1801) * 1000).toISOString() }), /Stale source timestamp/)
assert.match(htmlFor('hashrate', false, { ...result('hashrate'), receivedAt: new Date((1794000000 - 1) * 1000).toISOString() }), /Source clock mismatch/)
assert.match(htmlFor('difficulty', false), /cannot verify the data’s age/)
assert.equal(JSON.stringify(fixtures), before, 'rendering must preserve source objects')
if (process.argv.includes('--prose')) console.log(prose.join('\n').replace(/<\/(?:p|dt|dd|summary|h2)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/ +/g, ' '))
else console.log(JSON.stringify({ numericCases: cases, rendering: ['server HTML', 'browser recovery render'], exactSourcePreserved: true, failureAndMissingWindows: true, freshnessBranchesPreserved: true }, null, 2))

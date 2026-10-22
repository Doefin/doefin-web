/** Deterministic arithmetic replay and public-planner error/recovery checks. No external data or orders. */
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import ts from 'typescript'

const read = file => readFileSync(file, 'utf8')
function compile(source, require) {
  const module = { exports: {} }
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
  new Function('require', 'module', 'exports', output)(require, module, module.exports)
  return module.exports
}
const cache = new Map()
function load(file) {
  const path = resolve(file)
  if (!cache.has(path)) cache.set(path, compile(read(path), name => load(name.startsWith('@/') ? name.slice(2) + '.ts' : resolve(dirname(path), name + '.ts'))))
  return cache.get(path)
}
let checks = 0
async function check(name, fn) { await fn(); checks++; console.log(`PASS ${name}`) }
const { EXAMPLES } = load('content/tools.ts')
const { TOOL_GUIDES } = load('content/tool-guides.ts')
const { TOOL_MICRO } = load('content/tool-micro.ts')
const { calculateExposure } = load('lib/exposure.ts')
const near = (actual, expected, tolerance = 0.0005) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`)
await check('exposure example reproduces the actual production helper, including spread vs downside', () => {
  const example = EXAMPLES.find(e => e.toolSlug === 'difficulty-exposure')
  const result = calculateExposure(example.calculatorInputs)
  near(result.base, 28.057); near(result.atLow, 28.747); near(result.atHigh, 26.222); near(result.spreadBtc, 2.525); near(result.lossHigh, 1.836)
  assert.ok(result.spreadBtc > result.lossHigh)
  assert.ok(example.steps.some(row => row[1] === `${result.spreadBtc.toFixed(3)} BTC`))
  assert.ok(example.steps.some(row => row[1] === `−${result.lossHigh.toFixed(3)} BTC`))
})
await check('all three hosting examples reproduce the actual calculator formula', () => {
  const source = read('components/tools/HostingCalculator.tsx')
  const body = source.match(/const out = useMemo\(\(\) => \{([\s\S]*?)\n  \}, \[v\]\)/)?.[1]
  assert.ok(body, 'Could not locate actual hosting calculation')
  const calculate = new Function('v', body)
  const expected = [0.0796, 0.0653, 0.0832]
  EXAMPLES.filter(e => e.toolSlug === 'hosting-effective-rate').forEach((example, index) => {
    const result = calculate(example.calculatorInputs)
    near(result.afterPool, expected[index], 0.00005)
    assert.ok(example.headline.includes(`$${result.afterPool.toFixed(4)}`))
    assert.ok(example.headline.includes(`${Math.round(result.upliftPct)}%`))
    assert.equal(Number(example.steps.at(-1)[1].slice(1)), Number(result.afterPool.toFixed(4)))
  })
})
await check('payback example replays the actual simulation and does not equate finite horizon to never', () => {
  const source = read('components/tools/PaybackModel.tsx')
  const body = source.slice(source.indexOf('function simulate('), source.indexOf('\nconst BOUNDS'))
  const { simulate } = compile(`const SUBSIDY = 3.125; const BLOCKS_DAY = 144; const networkEHFromDifficulty = (diffT: number) => diffT * 1e12 * 2 ** 32 / 600 / 1e18; ${body}; export { simulate }`, () => { throw Error('Unexpected import') })
  const example = EXAMPLES.find(e => e.toolSlug === 'fleet-payback')
  const low = simulate(example.calculatorInputs, 0), mid = simulate(example.calculatorInputs, 1.5), high = simulate(example.calculatorInputs, 4.5)
  assert.equal(low.paybackMonth, 24); assert.equal(mid.paybackMonth, 38); assert.equal(high.paybackMonth, null)
  assert.equal(Math.round(high.final), -17282); near(high.powerDay, 16.2)
  assert.ok(example.headline.includes('within 48 months'))
  assert.ok(!/to never|never returns|too small to hedge/.test(example.body.join(' ')))
})
await check('difficulty guide and microcopy have no unsupported fleet eligibility or advice thresholds', () => {
  const content = JSON.stringify([TOOL_GUIDES['difficulty-exposure'], TOOL_MICRO['difficulty-exposure']])
  assert.ok(!/under about 5%|over 20%|at least about 0.2|nothing here to act on|smallest move worth|site.s published range|Hold that much bitcoin/i.test(content))
  assert.ok(content.includes('not a published forecast'))
  assert.equal(EXAMPLES.length, 5)
  for (const example of EXAMPLES) assert.ok(Object.keys(example.calculatorInputs).length >= 6)
})
const { publicPlannerDataState } = load('lib/public-planner-state.ts')
const { normalizePublicSnapshot, PUBLIC_MARKET_STALE_MS } = load('lib/public-markets.ts')
const now = Date.now()
const fixture = normalizePublicSnapshot({ current_block_height: 972622, current_difficulty: 140577680051919.62 }, { markets: [{ id: 'cbBTC-490-148-x', marketId: 29, currency: 'cbBTC', targetBlock: 987840, settlementBlock: 987846, difficultyThresholdTrillions: 148, yesPriceExact: '0.61', noPriceExact: '0.46', resolved: false }] }, { avg_fee_btc: '0.05' }, new Date(now).toISOString())
await check('planner pauses for unavailable, refresh, stale, future and failed snapshots; valid recovery unlocks', () => {
  assert.deepEqual(publicPlannerDataState(null, false, null, now), { available: false, stale: false, fallback: true })
  assert.equal(publicPlannerDataState(fixture, true, null, now).available, false)
  assert.equal(publicPlannerDataState(fixture, false, 'Unavailable', now).fallback, true)
  assert.equal(publicPlannerDataState(fixture, false, null, now + PUBLIC_MARKET_STALE_MS + 1).stale, true)
  assert.equal(publicPlannerDataState({ ...fixture, fetchedAt: new Date(now + 31_000).toISOString() }, false, null, now).available, false)
  assert.equal(publicPlannerDataState({ ...fixture, fetchedAt: 'invalid' }, false, null, now).available, false)
  assert.deepEqual(publicPlannerDataState(fixture, false, null, now), { available: true, stale: false, fallback: false })
})
await check('actual hook preserves old values on failure, clears error on recovery and discards older request completion', async () => {
  const values = [], refs = []; let stateIndex = 0, refIndex = 0
  const react = { useState: initial => { const index = stateIndex++; if (!(index in values)) values[index] = initial; return [values[index], value => { values[index] = value }] }, useRef: initial => { const index = refIndex++; return refs[index] ??= { current: initial } }, useCallback: fn => fn, useEffect: () => {} }
  const hooks = compile(read('components/v3/usePublicMarkets.ts'), name => name === 'react' ? react : load(name.slice(2) + '.ts'))
  const render = () => { stateIndex = 0; refIndex = 0; return hooks.usePublicMarkets() }
  const originalFetch = globalThis.fetch
  const queue = []
  globalThis.fetch = () => new Promise((resolve, reject) => queue.push({ resolve, reject }))
  const response = data => ({ ok: true, json: async () => data })
  try {
    let hook = render()
    let request = hook.refresh(); queue.shift().resolve(response(fixture)); await request
    hook = render(); assert.equal(hook.available, true)
    request = hook.refresh(); queue.shift().reject(new Error('Network failed')); await assert.rejects(request)
    hook = render(); assert.equal(hook.snapshot, fixture); assert.equal(hook.available, false); assert.equal(hook.fallback, true)
    const older = hook.refresh(), newer = hook.refresh()
    const first = queue.shift(), second = queue.shift()
    second.resolve(response(fixture)); await newer
    first.reject(new Error('Late failed request')); await assert.rejects(older)
    hook = render(); assert.equal(hook.error, null); assert.equal(hook.loading, false); assert.equal(hook.available, true)
    request = hook.refresh(); queue.shift().resolve({ ok: false, status: 451 }); await assert.rejects(request, /location/)
    hook = render(); assert.equal(hook.available, false); assert.equal(hook.snapshot, fixture)
    request = hook.refresh(); queue.shift().resolve(response({ ...fixture, fetchedAt: new Date(now - PUBLIC_MARKET_STALE_MS - 1).toISOString() })); await assert.rejects(request, /out of date/)
    hook = render(); assert.equal(hook.available, false)
    request = hook.refresh(); queue.shift().resolve(response(fixture)); await request
    hook = render(); assert.equal(hook.error, null); assert.equal(hook.available, true)
  } finally { globalThis.fetch = originalFetch }
})
console.log(`${checks} P0 correction checks passed.`)

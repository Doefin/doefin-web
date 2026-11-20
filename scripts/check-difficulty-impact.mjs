import assert from 'node:assert/strict'
import { loadTypescript } from './lib/load-typescript.mjs'

const impact = loadTypescript('lib/difficulty-impact.ts')
const analyticsContract = loadTypescript('lib/bitcoin-analytics-contract.ts')
const now = Date.now()
const receivedAt = new Date(now).toISOString()
const snapshot = { difficulty: 150e12, blockHeight: 976147, receivedAt, subsidyBtc: 3.125 }
let checks = 0
const check = async (name, action) => { await action(); checks++; console.log(`PASS ${name}`) }
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) <= Math.max(1e-15, Math.abs(expected) * 1e-12), `${actual} != ${expected}`)

await check('uses raw difficulty, PH/s, seconds and subsidy without a fixed BTC baseline', () => {
  const result = impact.calculateDifficultyImpact(snapshot, 0)
  near(result.baselineProduction, 0.00041909515857696533)
  near(result.production, result.baselineProduction)
  near(result.difficultyTrillions, 150)
  near(result.impliedHashrateEh, 1073.741824)
  assert.equal(result.productionChange, 0)
})

await check('difficulty scenarios preserve the inverse relationship and a fixed comparison scale', () => {
  const baseline = impact.calculateDifficultyImpact(snapshot, 0)
  const rise = impact.calculateDifficultyImpact(snapshot, 10)
  const fall = impact.calculateDifficultyImpact(snapshot, -10)
  near(rise.production / baseline.production, 1 / 1.1)
  near(fall.production / baseline.production, 1 / 0.9)
  near(rise.productionChange, -9.090909090909093)
  near(fall.productionChange, 11.111111111111116)
  const low = impact.calculateDifficultyImpact(snapshot, -30)
  const high = impact.calculateDifficultyImpact(snapshot, 30)
  near(low.productionChange, 42.85714285714286)
  near(high.productionChange, -23.076923076923073)
  assert.equal(low.maxProduction, high.maxProduction)
  near(low.production, low.maxProduction)
  near(baseline.production / baseline.maxProduction, 0.7)
  for (const invalid of [-31, 31, 1.5, NaN, Infinity]) assert.throws(() => impact.calculateDifficultyImpact(snapshot, invalid))
})

await check('subsidy follows the block-height halving boundary and whole-satoshi floor', () => {
  assert.equal(impact.bitcoinSubsidyBtc(209999), 50)
  assert.equal(impact.bitcoinSubsidyBtc(210000), 25)
  assert.equal(impact.bitcoinSubsidyBtc(839999), 6.25)
  assert.equal(impact.bitcoinSubsidyBtc(840000), 3.125)
  assert.equal(impact.bitcoinSubsidyBtc(1050000), 1.5625)
  assert.equal(impact.bitcoinSubsidyBtc(32 * 210000), 0.00000001)
  assert.equal(impact.bitcoinSubsidyBtc(33 * 210000), 0)
  assert.equal(impact.bitcoinSubsidyBtc(64 * 210000), 0)
  for (const invalid of [-1, 1.5, NaN, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => impact.bitcoinSubsidyBtc(invalid))
  const afterHalving = impact.calculateDifficultyImpact({ ...snapshot, blockHeight: 1050000, subsidyBtc: 1.5625 }, 0)
  near(afterHalving.production, impact.calculateDifficultyImpact(snapshot, 0).production / 2)
  const noSubsidy = impact.calculateDifficultyImpact({ ...snapshot, blockHeight: 6930000, subsidyBtc: 0 }, 30)
  assert.equal(noSubsidy.production, 0)
  assert.equal(noSubsidy.productionChange, 0)
})

await check('rejects malformed route data, mismatched subsidy and future timestamps', () => {
  assert.deepEqual(impact.parseDifficultyImpactResult({ status: 'available', snapshot }, now), { status: 'available', snapshot })
  for (const malformed of [null, {}, { difficulty: '150' }, { difficulty: 0 }, { difficulty: Infinity }, { blockHeight: -1 }, { blockHeight: 1.5 }, { subsidyBtc: 6.25 }, { receivedAt: 'not a date' }, { receivedAt: '1' }, { receivedAt: new Date(now + 31000).toISOString() }]) {
    const value = malformed === null ? null : { ...snapshot, ...malformed }
    // Empty overrides remain valid, so test empty snapshot separately.
    if (malformed && Object.keys(malformed).length === 0) {
      assert.equal(impact.parseDifficultyImpactResult({ status: 'available', snapshot: {} }, now), null)
    } else assert.equal(impact.parseDifficultyImpactResult({ status: 'available', snapshot: value }, now), null)
  }
  assert.equal(impact.parseDifficultyImpactResult({ status: 'live', snapshot }, now), null)
  assert.equal(impact.parseDifficultyImpactResult({ status: 'unavailable' }, now), null)
})

await check('keeps old timestamps so cached data becomes visibly stale', () => {
  const old = { ...snapshot, receivedAt: new Date(now - impact.DIFFICULTY_IMPACT_STALE_MS).toISOString() }
  assert.deepEqual(impact.parseDifficultyImpactResult({ status: 'available', snapshot: old }, now).snapshot, old)
  assert.equal(impact.isDifficultyImpactStale(old, now), true)
  assert.equal(impact.isDifficultyImpactStale(snapshot, now + impact.DIFFICULTY_IMPACT_STALE_MS - 1), false)
  assert.equal(impact.isDifficultyImpactStale(snapshot, now + impact.DIFFICULTY_IMPACT_STALE_MS), true)
})

await check('trusted server snapshots remain calculable when the browser clock is behind', () => {
  const actualNow = Date.now
  const browserNow = now - 60_000
  try {
    Date.now = () => browserNow
    const result = impact.calculateDifficultyImpact(snapshot, 10)
    near(result.production, 0.00041909515857696533 / 1.1)
    assert.equal(impact.isDifficultyImpactStale(snapshot), true)
    assert.equal(impact.parseDifficultyImpactResult({ status: 'available', snapshot }), null)
  } finally {
    Date.now = actualNow
  }
})

await check('maps upstream failures without fabricating a production baseline', () => {
  for (const [httpStatus, expected] of [[451, 'region-restricted'], [404, 'unavailable'], [503, 'unavailable']]) {
    const result = impact.normalizeDifficultyImpactResult(analyticsContract.apiFailure(httpStatus, {}, receivedAt), now)
    assert.deepEqual(result, { status: expected, receivedAt })
    assert.equal('snapshot' in result, false)
  }
  assert.deepEqual(impact.normalizeDifficultyImpactResult({ status: 'invalid', httpStatus: 200, receivedAt }, now), { status: 'invalid', receivedAt })
})

await check('server cache stores only successes, separates origins and preserves retrieval time', async () => {
  const previousOrigin = process.env.DOFIN_API_BASE_URL
  let upstreamCalls = 0
  let failed = false
  let lastResult
  const server = loadTypescript('lib/server/difficulty-impact.ts', {
    'server-only': {},
    './homepage-fixture': { getHomepageFixture: async () => null },
    '../difficulty-impact': impact,
    '../bitcoin-analytics': { getDifficultyAnalytics: async () => {
      upstreamCalls++
      return failed
        ? { status: 'region-restricted', httpStatus: 451, receivedAt }
        : { status: 'available', httpStatus: 200, receivedAt, data: { current_difficulty: snapshot.difficulty, current_block_height: snapshot.blockHeight } }
    } },
    'next/cache': { unstable_cache: (read, keys, options) => {
      assert.equal(options.revalidate, 300)
      assert.deepEqual(keys, ['difficulty-impact-v1'])
      const values = new Map()
      return async (...args) => {
        const key = JSON.stringify(args)
        if (!values.has(key)) values.set(key, await read(...args))
        return values.get(key)
      }
    } },
  })
  try {
    process.env.DOFIN_API_BASE_URL = 'https://first.example.test'
    lastResult = await server.getDifficultyImpactSnapshot()
    assert.equal(lastResult.status, 'available')
    const cached = await server.getDifficultyImpactSnapshot()
    assert.equal(upstreamCalls, 1)
    assert.equal(cached.snapshot.receivedAt, receivedAt)
    process.env.DOFIN_API_BASE_URL = 'https://second.example.test'
    failed = true
    assert.equal((await server.getDifficultyImpactSnapshot()).status, 'region-restricted')
    failed = false
    assert.equal((await server.getDifficultyImpactSnapshot()).status, 'available')
    assert.equal(upstreamCalls, 3)
  } finally {
    if (previousOrigin === undefined) delete process.env.DOFIN_API_BASE_URL
    else process.env.DOFIN_API_BASE_URL = previousOrigin
  }
  assert.equal(lastResult.snapshot.difficulty, snapshot.difficulty)
})

await check('route returns explicit HTTP failures and prevents browser/CDN caching', async () => {
  for (const [result, expected] of [[{ status: 'available', snapshot }, 200], [{ status: 'region-restricted', receivedAt }, 451], [{ status: 'unavailable', receivedAt }, 503], [{ status: 'invalid', receivedAt }, 503]]) {
    const { GET } = loadTypescript('app/api/v3/difficulty-impact/route.ts', {
      '@/lib/server/difficulty-impact': { getDifficultyImpactSnapshot: async () => result },
    })
    const response = await GET()
    assert.equal(response.status, expected)
    assert.equal(response.headers.get('cache-control'), 'no-store')
    assert.deepEqual(await response.json(), result)
  }
})

console.log(`${checks} difficulty-impact regression checks passed.`)

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { forecastHash, validateForecast, evaluateForecasts, observationSummary, sha256 } from '../lib/research-archive.ts'
import { illustrativeComparison, summarizeIllustrativeProvider } from '../content/v3-forecast-comparison.ts'
import { epochs } from '../content/sample-data.ts'

const capture = JSON.parse(readFileSync(new URL('../content/research-archive/v1.json', import.meta.url), 'utf8'))
assert.equal(sha256(capture.sourceRaw), capture.sourceSha256, 'Captured source bytes must match the public digest')
const raw = JSON.parse(capture.sourceRaw).sort((a, b) => a[1] - b[1])
assert.equal(capture.rows.length, raw.length - 1, 'Keep every consecutive pair; do not cherry-pick outcomes')
raw.forEach((row, i) => {
  assert.equal(row[1] % 2016, 0)
  assert.ok(row.every(Number.isFinite))
  assert.ok(row[0] * 1000 < Date.parse(capture.capturedAt), 'No future network observations')
  if (!i) return
  const observed = capture.rows[i - 1]
  assert.equal(row[1] - raw[i - 1][1], 2016)
  assert.equal(observed.changePct, (row[2] / raw[i - 1][2] - 1) * 100)
  assert.equal(observed.date, new Date(row[0] * 1000).toISOString().replace('.000Z', 'Z'))
})
for (const check of capture.sourceBlockChecks) {
  assert.equal(sha256(check.rawBlock), check.rawBlockSha256)
  const block = JSON.parse(check.rawBlock)
  const row = capture.rows.find(row => row.height === check.height)
  assert.equal(block.height, check.height)
  assert.equal(block.timestamp, row.timestamp)
  assert.ok(Math.abs(block.difficulty / row.difficulty - 1) < 1e-12)
}
const summary = observationSummary(capture.rows)
assert.equal(summary.count, 25)
assert.equal(summary.increases + summary.decreases + summary.unchanged, summary.count)
assert.equal(capture.forecasts.length, 0, 'Observed rows must never become prospective forecasts')
assert.equal(capture.doi, null)

const make = (overrides = {}) => {
  const r = { id: 'test-only', provider: 'test provider', methodVersion: 'test-v1', issuedAt: '2025-01-01T00:00:00Z', inputHeight: 2015, targetHeight: 2016, predictedChangePct: 2, interval: [-1, 3], sourceUrl: 'https://example.test/capture', previousHash: null, ...overrides }
  return { ...r, hash: forecastHash(r) }
}
const outcome = { height: 2016, timestamp: Date.parse('2025-01-02T00:00:00Z') / 1000, date: '2025-01-02T00:00:00Z', previousDifficulty: 100, difficulty: 101, changePct: 1 }
const score = evaluateForecasts([make()], [outcome]).rows[0]
assert.equal(score.absoluteErrorPp, 1)
assert.equal(score.intervalCovered, true)
assert.equal(score.intervalWidthPp, 4)
assert.equal(score.status, 'arithmetic-only', 'Arithmetic must not claim independently verified publication')
assert.equal(evaluateForecasts([make()], []).rows[0].status, 'awaiting-outcome')
for (const invalid of [
  { timestamp: NaN },
  { timestamp: Infinity },
  { timestamp: outcome.timestamp + 0.5 },
  { timestamp: -1 },
  { date: 'invalid date' },
  { date: '2025-01-03T00:00:00Z' },
  { date: '2999-01-01T00:00:00Z', timestamp: Date.parse('2999-01-01T00:00:00Z') / 1000 },
  { previousDifficulty: NaN },
  { previousDifficulty: 0 },
  { previousDifficulty: -100 },
  { difficulty: Infinity },
  { difficulty: 0 },
  { changePct: NaN },
  { changePct: Infinity },
  { changePct: 2 },
  { previousDifficulty: 100, difficulty: 24, changePct: -76 },
  { previousDifficulty: 100, difficulty: 401, changePct: 301 },
  { height: 2015 },
]) {
  assert.throws(() => evaluateForecasts([make()], [{ ...outcome, ...invalid }]), /Invalid|inconsistent/, `Reject malformed observed data: ${Object.keys(invalid).join(', ')}`)
}
assert.throws(() => evaluateForecasts([make()], [{ ...outcome, timestamp: NaN, changePct: NaN }]), /timestamp/, 'NaN must not bypass outcome timing or serialize as a null score')
assert.throws(() => evaluateForecasts([make()], [outcome, { ...outcome }]), /Duplicate outcome target height/, 'Do not silently select the first duplicate outcome')
assert.throws(() => evaluateForecasts([], [{ ...outcome, changePct: NaN }]), /Invalid observed change/, 'Validate even outcomes not matched to a forecast')
assert.throws(() => observationSummary([{ ...outcome, changePct: NaN }]), /Invalid observed change/)
assert.throws(() => validateForecast({ ...make(), predictedChangePct: 99 }), /content or chain/)
assert.throws(() => validateForecast(make({ targetHeight: 2015 })), /future adjustment/)
assert.throws(() => validateForecast(make({ predictedChangePct: NaN })), /bounds/)
assert.throws(() => validateForecast(make({ interval: [3, 2] })), /interval/)
assert.throws(() => validateForecast(make({ sourceUrl: 'http://example.test' })), /HTTPS/)
assert.throws(() => validateForecast(make({ issuedAt: '2999-01-01T00:00:00Z' })), /issue time/)
assert.throws(() => evaluateForecasts([make({ issuedAt: '2025-01-03T00:00:00Z' })], [outcome]), /after its outcome/)
const first = make()
const second = make({ id: 'test-next', previousHash: first.hash, issuedAt: '2025-01-01T01:00:00Z' })
assert.equal(evaluateForecasts([first, second], [outcome]).rows.length, 2)
assert.throws(() => evaluateForecasts([first, make({ id: first.id, previousHash: first.hash })], []), /Duplicate/)
assert.throws(() => evaluateForecasts([first, make({ id: 'next', previousHash: 'changed' })], []), /chain/)
for (const model of illustrativeComparison) {
  const summary = summarizeIllustrativeProvider(model)
  assert.equal(summary.count, 2)
  assert.equal(summary.missing, 1)
  for (const row of model.forecasts) assert.equal(row.outcome, epochs.find(epoch => epoch.height === row.targetHeight)?.realisedPct ?? null)
}
assert.ok(Math.abs(summarizeIllustrativeProvider(illustrativeComparison[0]).maePp - 1.02) < 1e-12)
assert.equal(summarizeIllustrativeProvider(illustrativeComparison[1]).coveragePct, 50)
assert.equal(summarizeIllustrativeProvider(illustrativeComparison[2]).widthPp, 10)
console.log(`Research archive: ${summary.count} observed changes reproduce from captured source bytes; provenance, forecast timing, bounds, missing outcomes and tamper checks pass.`)

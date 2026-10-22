import { createHash } from 'node:crypto'

export type Observation = { height: number; timestamp: number; date: string; previousDifficulty: number; difficulty: number; changePct: number }
export type ForecastRecord = { id: string; provider: string; methodVersion: string; issuedAt: string; inputHeight: number; targetHeight: number; predictedChangePct: number; interval?: [number, number]; sourceUrl: string; previousHash: string | null; hash: string }

export const sha256 = (value: string) => createHash('sha256').update(value).digest('hex')
export function forecastHash(record: Omit<ForecastRecord, 'hash'>): string {
  // Explicit field order makes content identity independent of JSON input order.
  return sha256(JSON.stringify([record.id, record.provider, record.methodVersion, record.issuedAt, record.inputHeight, record.targetHeight, record.predictedChangePct, record.interval ?? null, record.sourceUrl, record.previousHash]))
}
export function validateForecast(record: ForecastRecord, previous: ForecastRecord | undefined, now = new Date()): void {
  const issued = Date.parse(record.issuedAt)
  if (!record.id || !record.provider.trim() || !record.methodVersion.trim() || !Number.isFinite(issued) || issued > now.getTime()) throw new Error('Invalid identity, method or issue time')
  if (!Number.isSafeInteger(record.inputHeight) || record.inputHeight < 0 || !Number.isSafeInteger(record.targetHeight) || record.targetHeight % 2016 !== 0 || record.targetHeight <= record.inputHeight) throw new Error('Target must be a future adjustment relative to the input block')
  if (!Number.isFinite(record.predictedChangePct) || record.predictedChangePct < -75 || record.predictedChangePct > 300) throw new Error('Prediction outside protocol adjustment bounds')
  if (record.interval && (record.interval.length !== 2 || !record.interval.every(Number.isFinite) || record.interval[0] > record.interval[1] || record.interval[0] < -75 || record.interval[1] > 300)) throw new Error('Invalid interval')
  const source = new URL(record.sourceUrl)
  if (source.protocol !== 'https:') throw new Error('An HTTPS source capture is required')
  if (record.previousHash !== (previous?.hash ?? null) || (previous && issued < Date.parse(previous.issuedAt)) || record.hash !== forecastHash(record)) throw new Error('Forecast content or chain changed')
}
function validatedOutcomes(outcomes: Observation[]): Map<number, Observation> {
  const indexed = new Map<number, Observation>()
  const now = Date.now()
  for (const outcome of outcomes) {
    if (!Number.isSafeInteger(outcome.height) || outcome.height <= 0 || outcome.height % 2016 !== 0) throw new Error('Invalid observed adjustment height')
    const date = typeof outcome.date === 'string' ? Date.parse(outcome.date) : NaN
    if (!Number.isSafeInteger(outcome.timestamp) || outcome.timestamp < 0 || !Number.isFinite(date) || date !== outcome.timestamp * 1000 || date > now) throw new Error('Invalid or inconsistent outcome timestamp/date')
    if (![outcome.previousDifficulty, outcome.difficulty].every(value => Number.isFinite(value) && value > 0)) throw new Error('Invalid observed difficulty levels')
    const impliedChange = (outcome.difficulty / outcome.previousDifficulty - 1) * 100
    if (!Number.isFinite(outcome.changePct) || !Number.isFinite(impliedChange) || outcome.changePct < -75 || outcome.changePct > 300 || Math.abs(outcome.changePct - impliedChange) > 1e-9) throw new Error('Invalid observed change or inconsistent difficulty arithmetic')
    if (indexed.has(outcome.height)) throw new Error('Duplicate outcome target height')
    indexed.set(outcome.height, outcome)
  }
  return indexed
}
export function evaluateForecasts(records: ForecastRecord[], outcomes: Observation[]) {
  // Validate the whole outcome set before matching: NaN must never bypass timing
  // checks or silently become a null error value when the result is serialized.
  const outcomesByHeight = validatedOutcomes(outcomes)
  const ids = new Set<string>()
  records.forEach((record, index) => {
    validateForecast(record, records[index - 1])
    if (ids.has(record.id)) throw new Error('Duplicate forecast id')
    ids.add(record.id)
  })
  const rows = records.map(record => {
    const outcome = outcomesByHeight.get(record.targetHeight)
    if (!outcome) return { id: record.id, provider: record.provider, targetHeight: record.targetHeight, status: 'awaiting-outcome' as const }
    if (Date.parse(record.issuedAt) >= outcome.timestamp * 1000) throw new Error('Forecast issued after its outcome')
    return { id: record.id, provider: record.provider, targetHeight: record.targetHeight, status: 'arithmetic-only' as const, absoluteErrorPp: Math.abs(record.predictedChangePct - outcome.changePct), intervalCovered: record.interval ? outcome.changePct >= record.interval[0] && outcome.changePct <= record.interval[1] : null, intervalWidthPp: record.interval ? record.interval[1] - record.interval[0] : null }
  })
  // No aggregate ranking: timing, independent publication and matched leads need review first.
  return { publicationVerification: 'Independent publication timestamps and market-listing precedence are not established by a local hash chain.', rows }
}
export function observationSummary(rows: Observation[]) {
  if (!rows.length) throw new Error('Empty observed dataset')
  validatedOutcomes(rows)
  return { count: rows.length, increases: rows.filter(r => r.changePct > 0).length, decreases: rows.filter(r => r.changePct < 0).length, unchanged: rows.filter(r => r.changePct === 0).length, meanAbsoluteChangePct: rows.reduce((s, r) => s + Math.abs(r.changePct), 0) / rows.length, minimumChangePct: Math.min(...rows.map(r => r.changePct)), maximumChangePct: Math.max(...rows.map(r => r.changePct)), firstDate: rows[0].date, lastDate: rows.at(-1)!.date }
}

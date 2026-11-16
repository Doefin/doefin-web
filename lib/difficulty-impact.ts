import type { BackendData, DifficultyAnalytics } from './bitcoin-analytics-contract'

export const DIFFICULTY_IMPACT_REFRESH_MS = 5 * 60 * 1000
export const DIFFICULTY_IMPACT_STALE_MS = 10 * 60 * 1000
export const DIFFICULTY_IMPACT_HASHRATE_PH = 1
export const DIFFICULTY_IMPACT_PERIOD_HOURS = 24
export const DIFFICULTY_IMPACT_MIN_CHANGE = -30
export const DIFFICULTY_IMPACT_MAX_CHANGE = 30

export type DifficultyImpactSnapshot = {
  /** Raw, dimensionless network difficulty, not trillions. */
  difficulty: number
  blockHeight: number
  /** When Doefin's response was retrieved, not the block's observation time. */
  receivedAt: string
  subsidyBtc: number
}

export type DifficultyImpactResult =
  | { status: 'available'; snapshot: DifficultyImpactSnapshot }
  | { status: 'region-restricted' | 'unavailable' | 'invalid'; receivedAt: string }

/** Bitcoin floors the subsidy to whole satoshis at each 210,000-block halving. */
export function bitcoinSubsidyBtc(blockHeight: number): number {
  if (!Number.isSafeInteger(blockHeight) || blockHeight < 0) throw new RangeError('Invalid block height')
  const halvings = Math.floor(blockHeight / 210_000)
  if (halvings >= 64) return 0
  return Number(5_000_000_000n >> BigInt(halvings)) / 100_000_000
}

function validReceivedAt(value: unknown, now?: number): value is string {
  if (typeof value !== 'string') return false
  const milliseconds = Date.parse(value)
  return Number.isFinite(milliseconds) && milliseconds > 0 && (now === undefined || milliseconds <= now + 30_000) &&
    new Date(milliseconds).toISOString() === value
}

function parseSnapshot(value: unknown, now?: number): DifficultyImpactSnapshot | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  if (typeof row.difficulty !== 'number' || !Number.isFinite(row.difficulty) || row.difficulty < 1 ||
      !Number.isFinite(row.difficulty * (1 + DIFFICULTY_IMPACT_MAX_CHANGE / 100)) ||
      !Number.isSafeInteger(row.blockHeight) || Number(row.blockHeight) < 0 ||
      !validReceivedAt(row.receivedAt, now)) return null
  const blockHeight = Number(row.blockHeight)
  const subsidyBtc = bitcoinSubsidyBtc(blockHeight)
  if (row.subsidyBtc !== subsidyBtc) return null
  return { difficulty: row.difficulty, blockHeight, receivedAt: row.receivedAt, subsidyBtc }
}

/** Validate route responses before any values reach the client calculator. Old data stays dated. */
export function parseDifficultyImpactResult(value: unknown, now = Date.now()): DifficultyImpactResult | null {
  if (!value || typeof value !== 'object' || !Number.isFinite(now)) return null
  const row = value as Record<string, unknown>
  if (row.status === 'available') {
    const snapshot = parseSnapshot(row.snapshot, now)
    return snapshot ? { status: 'available', snapshot } : null
  }
  if ((row.status === 'region-restricted' || row.status === 'unavailable' || row.status === 'invalid') && validReceivedAt(row.receivedAt, now)) {
    return { status: row.status, receivedAt: row.receivedAt }
  }
  return null
}

export function normalizeDifficultyImpactResult(result: BackendData<DifficultyAnalytics>, now = Date.now()): DifficultyImpactResult {
  const receivedAt = validReceivedAt(result.receivedAt, now) ? result.receivedAt : new Date(now).toISOString()
  if (result.status !== 'available') {
    return { status: result.status === 'region-restricted' || result.status === 'invalid' ? result.status : 'unavailable', receivedAt }
  }
  const blockHeight = result.data.current_block_height
  if (!Number.isSafeInteger(blockHeight) || blockHeight < 0) return { status: 'invalid', receivedAt }
  return parseDifficultyImpactResult({
    status: 'available',
    snapshot: {
      difficulty: result.data.current_difficulty,
      blockHeight,
      receivedAt: result.receivedAt,
      subsidyBtc: bitcoinSubsidyBtc(blockHeight),
    },
  }, now) ?? { status: 'invalid', receivedAt }
}

export function isDifficultyImpactStale(snapshot: DifficultyImpactSnapshot, now = Date.now()): boolean {
  const receivedAt = Date.parse(snapshot.receivedAt)
  return !Number.isFinite(now) || !validReceivedAt(snapshot.receivedAt, now) || now - receivedAt >= DIFFICULTY_IMPACT_STALE_MS
}

/** Fixed sample fleet and period. Excludes transaction fees, pool fees and downtime. */
export function calculateDifficultyImpact(snapshot: DifficultyImpactSnapshot, change: number) {
  // A trusted server snapshot remains calculable when the browser clock differs.
  // Ingestion and freshness checks own timestamp plausibility, not this pure maths.
  if (!parseSnapshot(snapshot) || !Number.isInteger(change) || change < DIFFICULTY_IMPACT_MIN_CHANGE || change > DIFFICULTY_IMPACT_MAX_CHANGE) {
    throw new RangeError('Invalid difficulty scenario')
  }
  const factor = 1 + change / 100
  const difficulty = snapshot.difficulty * factor
  const hashes = DIFFICULTY_IMPACT_HASHRATE_PH * 1e15 * DIFFICULTY_IMPACT_PERIOD_HOURS * 3600
  const baselineProduction = hashes / 2 ** 32 / snapshot.difficulty * snapshot.subsidyBtc
  return {
    baselineProduction,
    production: baselineProduction / factor,
    productionChange: baselineProduction > 0 ? (1 / factor - 1) * 100 : 0,
    difficultyTrillions: difficulty / 1e12,
    impliedHashrateEh: difficulty / 1e18 * 2 ** 32 / 600,
    maxProduction: baselineProduction / (1 + DIFFICULTY_IMPACT_MIN_CHANGE / 100),
  }
}

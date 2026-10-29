export type DifficultyAnalytics = {
  current_block_height: number
  current_difficulty: number
  current_difficulty_epoch: number
  current_epoch_average_block_time: number
  blocks_till_next_adjustment: number
  last_difficulty_adjsutment_timestamp: number
  time_to_next_adjustment: number
  next_adjustment_timestamp: number
  next_difficulty_estimation: number
  next_difficulty_pct_changes: number
  next_difficulty_adjustment_block_height: number
}

export type CurrentHashrate = {
  block_number: number
  timestamp: number
  difficulty: string | null
  rolling_avg_hashrate_120: string | null
  rolling_avg_hashrate_144: string | null
  rolling_avg_hashrate_2016: string | null
}

export type BackendData<T> =
  | { status: 'available'; httpStatus: number; receivedAt: string; data: T }
  | { status: 'region-restricted' | 'not-found' | 'unavailable' | 'invalid'; httpStatus: number | null; receivedAt: string; detail?: string }

const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value)
const nonnegativeInteger = (value: unknown): value is number => Number.isInteger(value) && Number(value) >= 0

export function parseDifficultyAnalytics(value: unknown): DifficultyAnalytics | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const fields = ['current_difficulty', 'time_to_next_adjustment', 'next_adjustment_timestamp', 'next_difficulty_estimation', 'next_difficulty_pct_changes'] as const
  const integers = ['current_block_height', 'current_difficulty_epoch', 'blocks_till_next_adjustment', 'last_difficulty_adjsutment_timestamp', 'next_difficulty_adjustment_block_height'] as const
  if (!fields.every(key => finite(row[key])) || !integers.every(key => nonnegativeInteger(row[key])) || !finite(row.current_epoch_average_block_time)) return null
  if (Number(row.next_adjustment_timestamp) > 253402300799 || Number(row.last_difficulty_adjsutment_timestamp) > 253402300799) return null
  if (Number(row.current_difficulty) <= 0 || Number(row.next_difficulty_estimation) <= 0 || Number(row.current_epoch_average_block_time) <= 0) return null
  return Object.fromEntries([...fields, ...integers, 'current_epoch_average_block_time'].map(key => [key, row[key]])) as DifficultyAnalytics
}

const decimalPattern = /^(?:\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?$/i
const decimalString = (value: unknown): value is string => {
  if (typeof value !== 'string' || value.length > 128) return false
  const match = decimalPattern.exec(value)
  if (!match) return false
  if (match[1] === undefined) return true
  const exponent = Number(match[1])
  return Number.isSafeInteger(exponent) && Math.abs(exponent) <= 100
}
export function parseCurrentHashrate(value: unknown): CurrentHashrate | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  if (!nonnegativeInteger(row.block_number) || !nonnegativeInteger(row.timestamp) || row.timestamp > 253402300799) return null
  const fields = ['difficulty', 'rolling_avg_hashrate_120', 'rolling_avg_hashrate_144', 'rolling_avg_hashrate_2016'] as const
  if (!fields.every(key => row[key] === null || decimalString(row[key]))) return null
  return { block_number: row.block_number, timestamp: row.timestamp, difficulty: row.difficulty as string | null, rolling_avg_hashrate_120: row.rolling_avg_hashrate_120 as string | null, rolling_avg_hashrate_144: row.rolling_avg_hashrate_144 as string | null, rolling_avg_hashrate_2016: row.rolling_avg_hashrate_2016 as string | null }
}

export function apiFailure(status: number, payload: unknown, receivedAt: string): BackendData<never> {
  const row = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {}
  if (status === 451 || row.error === 'region_restricted') return { status: 'region-restricted', httpStatus: status, receivedAt }
  if (status === 404) return { status: 'not-found', httpStatus: status, receivedAt }
  return { status: 'unavailable', httpStatus: status, receivedAt }
}

/** API stores H/s as decimal strings. Shift the decimal point exactly by 18 places. */
export function hashrateHpsToEhps(value: string): string | null {
  if (!decimalString(value)) return null
  const match = /^(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/i.exec(value)
  if (!match || (!match[1] && !match[2])) return null
  const integer = match[1] ?? ''
  const fraction = match[2] ?? ''
  const digits = (integer + fraction).replace(/^0+(?=\d)/, '') || '0'
  const shift = Number(match[3] ?? 0) - fraction.length - 18
  const decimalIndex = digits.length + shift
  let output: string
  if (decimalIndex <= 0) output = `0.${'0'.repeat(-decimalIndex)}${digits}`
  else if (decimalIndex >= digits.length) output = digits + '0'.repeat(decimalIndex - digits.length)
  else output = `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`
  if (output.includes('.')) output = output.replace(/0+$/, '').replace(/\.$/, '')
  return output
}

export const HASHRATE_STALE_AFTER_MS = 30 * 60 * 1000
export function hashrateFreshness(timestamp: number, receivedAt: string): 'current' | 'stale' | 'future' | 'unknown' {
  const age = Date.parse(receivedAt) - timestamp * 1000
  if (!Number.isFinite(age) || age < 0) return 'future'
  return age > HASHRATE_STALE_AFTER_MS ? 'stale' : 'current'
}

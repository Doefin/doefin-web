/** Read-only public data. Prices are indicative summaries, never executable quotes. */
export type PublicMarket = {
  id: string; marketId: number; currency: string; targetBlock: number; settlementBlock: number;
  difficultyTrillions: number; yesPrice: string; noPrice: string;
}
export type PublicMarketSnapshot = {
  fetchedAt: string; currentBlock: number; currentDifficultyTrillions: number;
  averageFeeBtc: string | null; markets: PublicMarket[];
}
export const PUBLIC_MARKET_STALE_MS = 180_000
export type MarketSide = 'yes' | 'no'
const object = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' ? value as Record<string, unknown> : {}
const positiveInteger = (value: unknown): value is number => typeof value === 'number' && Number.isSafeInteger(value) && value > 0
const positive = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0
export function validDecimal(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 100 && /^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)
}
function price(value: unknown): string | null {
  // Numeric fallback is explicitly indicative; prefer exact source strings whenever present.
  const text = typeof value === 'number' && Number.isFinite(value) ? String(value) : value
  return validDecimal(text) && Number(text) > 0 && Number(text) <= 1 ? text : null
}
export function marketIdentity(market: PublicMarket): string {
  return JSON.stringify([market.id, market.marketId, market.currency, market.targetBlock, market.settlementBlock, market.difficultyTrillions])
}
export function samePublicMarket(a: PublicMarket, b: PublicMarket): boolean { return marketIdentity(a) === marketIdentity(b) }
export function marketReviewUrl(market: PublicMarket, side: MarketSide, origin = 'https://www.doefin.com'): string {
  if (side !== 'yes' && side !== 'no') throw new Error('Invalid market side.')
  const base = new URL(origin)
  if (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname))) throw new Error('Invalid application origin.')
  const url = new URL(`/app/market-review/${encodeURIComponent(market.currency)}/${market.targetBlock}/${market.difficultyTrillions}`, base.origin)
  url.searchParams.set('marketId', String(market.marketId))
  url.searchParams.set('side', side)
  return url.href
}
export function normalizePublicSnapshot(analyticsValue: unknown, marketsValue: unknown, feesValue: unknown, fetchedAt = new Date().toISOString()): PublicMarketSnapshot {
  const analytics = object(analyticsValue), payload = object(marketsValue)
  const currentBlock = analytics.current_block_height
  const rawDifficulty = analytics.current_difficulty
  if (!positiveInteger(currentBlock) || !positive(rawDifficulty) || !Array.isArray(payload.markets)) throw new Error('The network or market response is incomplete.')
  const currentDifficultyTrillions = rawDifficulty / 1e12
  const candidates: PublicMarket[] = []
  for (const value of payload.markets) {
    const row = object(value)
    if (row.resolved !== false || !positiveInteger(row.marketId) || !positiveInteger(row.targetBlock) || row.targetBlock <= currentBlock || !positiveInteger(row.settlementBlock) || row.settlementBlock < row.targetBlock || !positive(row.difficultyThresholdTrillions) || typeof row.currency !== 'string' || !/^[A-Za-z0-9_-]{1,32}$/.test(row.currency) || typeof row.id !== 'string' || !row.id || row.id.length > 200) continue
    const yesPrice = price(row.yesPriceExact ?? row.yesPrice), noPrice = price(row.noPriceExact ?? row.noPrice)
    // A missing price cannot safely supply either side's estimate on the public site.
    if (!yesPrice || !noPrice) continue
    candidates.push({ id: row.id, marketId: row.marketId, currency: row.currency, targetBlock: row.targetBlock, settlementBlock: row.settlementBlock, difficultyTrillions: row.difficultyThresholdTrillions, yesPrice, noPrice })
  }
  const keys = (market: PublicMarket) => [String(market.marketId), market.id, JSON.stringify([market.currency, market.targetBlock, market.difficultyTrillions])]
  const counts = new Map<string, number>()
  for (const market of candidates) keys(market).forEach((key, index) => counts.set(`${index}:${key}`, (counts.get(`${index}:${key}`) ?? 0) + 1))
  const markets = candidates.filter(market => keys(market).every((key, index) => counts.get(`${index}:${key}`) === 1)).sort((a, b) => a.targetBlock - b.targetBlock || a.difficultyTrillions - b.difficultyTrillions || a.currency.localeCompare(b.currency))
  const fee = object(feesValue).avg_fee_btc
  return { fetchedAt, currentBlock, currentDifficultyTrillions, averageFeeBtc: validDecimal(fee) ? fee : null, markets }
}
export function isPublicSnapshot(value: unknown): value is PublicMarketSnapshot {
  const row = object(value)
  return typeof row.fetchedAt === 'string' && Number.isFinite(Date.parse(row.fetchedAt)) && positiveInteger(row.currentBlock) && positive(row.currentDifficultyTrillions) && (row.averageFeeBtc === null || validDecimal(row.averageFeeBtc)) && Array.isArray(row.markets) && row.markets.every(value => {
    const m = object(value)
    return typeof m.id === 'string' && typeof m.currency === 'string' && positiveInteger(m.marketId) && positiveInteger(m.targetBlock) && positiveInteger(m.settlementBlock) && positive(m.difficultyTrillions) && price(m.yesPrice) !== null && price(m.noPrice) !== null
  })
}

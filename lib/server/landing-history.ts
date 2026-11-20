import 'server-only'

import { unstable_cache } from 'next/cache'
import { getDifficultyImpactSnapshot } from './difficulty-impact'
import { getHomepageFixture } from './homepage-fixture'

const BLOCKS_PER_EPOCH = 2016
const ADJUSTMENTS = 25

export type HistoryPoint = {
  height: number
  date: string
  changePct: number
  averageEH: number | null
}

async function getBoundary(origin: string, height: number, signal: AbortSignal) {
  const response = await fetch(new URL('/v1/block/history', origin), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query_type: 'number', query_data: { identifier: height } }),
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error('History request failed')
  const data = await response.json()
  const block = data?.blocks?.[0]
  if (
    block?.block_number !== height ||
    !Number.isFinite(block.difficulty) || block.difficulty <= 0 ||
    !Number.isSafeInteger(block.timestamp) || block.timestamp <= 0 ||
    block.timestamp * 1000 > Date.now() + 2 * 60 * 60 * 1000
  ) throw new Error('Invalid history boundary')
  return { height, timestamp: Number(block.timestamp), difficulty: Number(block.difficulty) }
}

const readHistory = unstable_cache(async (origin: string, latestBoundary: number) => {
  const signal = AbortSignal.timeout(6500)
  const heights = Array.from({ length: ADJUSTMENTS + 1 }, (_, i) => latestBoundary - (ADJUSTMENTS - i) * BLOCKS_PER_EPOCH)
  const boundaries: Awaited<ReturnType<typeof getBoundary>>[] = []
  for (let start = 0; start < heights.length; start += 6) {
    boundaries.push(...await Promise.all(heights.slice(start, start + 6).map(height => getBoundary(origin, height, signal))))
  }
  const points = boundaries.slice(1).map((block, index): HistoryPoint => {
    const previous = boundaries[index]
    const elapsed = block.timestamp - previous.timestamp
    if (elapsed <= 0) throw new Error('Invalid history interval')
    return {
      height: block.height,
      date: new Date(block.timestamp * 1000).toISOString(),
      changePct: (block.difficulty / previous.difficulty - 1) * 100,
      averageEH: previous.difficulty * 2 ** 32 * BLOCKS_PER_EPOCH / elapsed / 1e18,
    }
  })
  return { points, retrievedAt: new Date().toISOString() }
}, ['landing-history-v1'], { revalidate: 86_400 })

export async function getLandingHistory() {
  const fixture = await getHomepageFixture()
  if (fixture) return { points: fixture.points, retrievedAt: fixture.retrievedAt }
  try {
    const tip = await getDifficultyImpactSnapshot()
    if (tip.status !== 'available') return null
    // Wait for six blocks before adding a newly observed adjustment.
    const latestBoundary = Math.floor((tip.snapshot.blockHeight - 6) / BLOCKS_PER_EPOCH) * BLOCKS_PER_EPOCH
    if (latestBoundary < ADJUSTMENTS * BLOCKS_PER_EPOCH) return null
    const origin = process.env.DOFIN_API_BASE_URL || 'https://api.doefin.com'
    return await readHistory(origin, latestBoundary)
  } catch {
    return null
  }
}

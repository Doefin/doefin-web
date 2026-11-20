import 'server-only'
import { unstable_cache } from 'next/cache'
import { getDifficultyAnalytics } from '../bitcoin-analytics'
import { DIFFICULTY_IMPACT_REFRESH_MS, normalizeDifficultyImpactResult, type DifficultyImpactResult } from '../difficulty-impact'
import { getHomepageFixture } from './homepage-fixture'

type Failure = Exclude<DifficultyImpactResult, { status: 'available' }>
class DifficultyImpactUnavailable extends Error {
  constructor(readonly result: Failure) { super(result.status) }
}

// This project has not enabled Cache Components. Keep the cache scoped to this
// read instead of changing the application's rendering configuration.
const readCachedSnapshot = unstable_cache(
  async (_apiOrigin: string) => {
    const result = normalizeDifficultyImpactResult(await getDifficultyAnalytics())
    // Rejections are not cached. A transient failure must not poison the baseline.
    if (result.status !== 'available') throw new DifficultyImpactUnavailable(result)
    return result.snapshot
  },
  ['difficulty-impact-v1'],
  { revalidate: DIFFICULTY_IMPACT_REFRESH_MS / 1000 },
)

export async function getDifficultyImpactSnapshot(): Promise<DifficultyImpactResult> {
  const fixture = await getHomepageFixture()
  if (fixture) return { status: 'available', snapshot: fixture.snapshot }
  try {
    // The configured origin is part of the key, including local verification APIs.
    const origin = (process.env.DOFIN_API_BASE_URL || 'https://api.doefin.com').replace(/\/+$/, '')
    const snapshot = await readCachedSnapshot(origin)
    // Preserve receivedAt on cache hits, including stale data after a failed refresh.
    return { status: 'available', snapshot }
  } catch (error) {
    return error instanceof DifficultyImpactUnavailable
      ? error.result
      : { status: 'unavailable', receivedAt: new Date().toISOString() }
  }
}

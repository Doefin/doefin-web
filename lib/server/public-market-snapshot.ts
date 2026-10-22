import { normalizePublicSnapshot } from '@/lib/public-markets'

/** Fixed public GET endpoints: caller-controlled upstream URLs are never accepted. */
const ORIGIN = 'https://www.doefin.com'
export class PublicMarketDataUnavailable extends Error {
  constructor(readonly status: number) { super(status === 451 ? 'Market data is unavailable in this location.' : 'The application data service is unavailable.') }
}
async function read(path: string): Promise<unknown> {
  const response = await fetch(`${ORIGIN}${path}`, { cache: 'no-store', signal: AbortSignal.timeout(12_000), headers: { Accept: 'application/json' } })
  if (!response.ok) throw new PublicMarketDataUnavailable(response.status)
  return response.json()
}
export async function getPublicMarketSnapshot() {
  const [analytics, markets, fees] = await Promise.all([
    read('/api/analytics'), read('/api/markets?status=Active'),
    read('/api/backend/v3/bitcoin/fees/average').catch(() => null),
  ])
  return normalizePublicSnapshot(analytics, markets, fees)
}

import { PUBLIC_MARKET_STALE_MS, type PublicMarketSnapshot } from './public-markets'

/** Shared fail-closed gate: displaying old values must never imply a current handoff. */
export function publicPlannerDataState(snapshot: PublicMarketSnapshot | null, loading: boolean, error: string | null, now: number) {
  const fetched = snapshot ? Date.parse(snapshot.fetchedAt) : NaN
  const stale = !!snapshot && (!Number.isFinite(fetched) || now - fetched > PUBLIC_MARKET_STALE_MS || fetched > now + 30_000)
  const available = !!snapshot && !loading && !error && !stale
  return { stale, available, fallback: !!error || stale || (!loading && !snapshot) }
}

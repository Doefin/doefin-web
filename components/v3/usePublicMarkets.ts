'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { publicPlannerDataState } from '@/lib/public-planner-state'
import { isPublicSnapshot, PUBLIC_MARKET_STALE_MS, type PublicMarketSnapshot } from '@/lib/public-markets'

export async function fetchPublicMarkets(): Promise<PublicMarketSnapshot> {
  const response = await fetch('/api/v3/market-snapshot', { cache: 'no-store', signal: AbortSignal.timeout(16_000) })
  if (!response.ok) throw new Error(response.status === 451 ? 'Market data is unavailable in this location.' : 'Market data could not be refreshed. Try again before continuing.')
  const data: unknown = await response.json()
  if (!isPublicSnapshot(data) || Date.now() - Date.parse(data.fetchedAt) > PUBLIC_MARKET_STALE_MS || Date.parse(data.fetchedAt) > Date.now() + 30_000) throw new Error('The market snapshot is out of date. Please refresh.')
  return data
}
export function usePublicMarkets() {
  const [snapshot, setSnapshot] = useState<PublicMarketSnapshot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  const sequence = useRef(0)
  const refresh = useCallback(async () => {
    const request = ++sequence.current
    setLoading(true)
    try {
      const next = await fetchPublicMarkets()
      if (request === sequence.current) { setSnapshot(next); setError(null) }
      return next
    } catch (failure) {
      if (request === sequence.current) setError(failure instanceof Error ? failure.message : 'Market data is unavailable.')
      throw failure
    } finally { if (request === sequence.current) setLoading(false) }
  }, [])
  useEffect(() => {
    const update = () => { void refresh().catch(() => {}) }
    update()
    const interval = setInterval(update, 120_000)
    const tick = setInterval(() => setNow(Date.now()), 15_000)
    window.addEventListener('focus', update)
    return () => { sequence.current++; clearInterval(interval); clearInterval(tick); window.removeEventListener('focus', update) }
  }, [refresh])
  return { snapshot, loading, error, ...publicPlannerDataState(snapshot, loading, error, now), refresh }
}

'use client'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { emitV3Measurement } from '@/lib/v3-measurement'
import { site } from '@/lib/site'
import { marketReviewUrl, samePublicMarket, type MarketSide, type PublicMarket } from '@/lib/public-markets'
import { fetchPublicMarkets } from './usePublicMarkets'

export function MarketReviewButton({ market, side, children, className = '', disabled = false }: { market: PublicMarket; side: MarketSide; children?: ReactNode; className?: string; disabled?: boolean }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const current = useRef({ market, side, disabled }); current.current = { market, side, disabled }
  async function review() {
    if (current.current.disabled || busy) return
    emitV3Measurement('planner_progress', { stage: 'app-handoff', state: 'ready', signal: 'action' })
    const intended = { market, side }
    setBusy(true); setError(null)
    try {
      const snapshot = await fetchPublicMarkets()
      const supportResponse = await fetch('/api/v3/market-review-support', { cache: 'no-store', signal: AbortSignal.timeout(10_000) })
      if (!supportResponse.ok || (await supportResponse.json()).supported !== true) throw new Error('Market review is temporarily unavailable. You can browse the app’s markets below.')
      if (!mounted.current) return
      if (current.current.disabled || current.current.side !== intended.side || !samePublicMarket(current.current.market, intended.market)) throw new Error('Your selection changed. Review it and continue again.')
      if (!snapshot.markets.some(item => samePublicMarket(item, intended.market))) throw new Error('This market is no longer available. Refresh and choose a market again.')
      emitV3Measurement('planner_handoff_result', { state: 'navigation-requested', signal: 'action' })
      window.location.assign(marketReviewUrl(intended.market, intended.side))
    } catch (failure) { if (mounted.current) { emitV3Measurement('planner_handoff_result', { state: 'recheck-failed', signal: 'action' }); setError(failure instanceof Error ? failure.message : 'Could not verify the market. Please retry.'); setBusy(false) } }
  }
  return <div><button type="button" onClick={() => { void review() }} disabled={disabled || busy} className={`inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white transition hover:bg-brandDeep focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 ${className}`} aria-busy={busy}>{busy ? 'Checking this market…' : children ?? `Review ${side.toUpperCase()} market in app`}<span aria-hidden="true">↗</span></button>{error && <div className="mt-3"><p role="alert" className="text-sm leading-relaxed text-caution">{error}</p><a href={site.appUrl} className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-highlight underline underline-offset-4">Browse markets in app ↗</a></div>}</div>
}

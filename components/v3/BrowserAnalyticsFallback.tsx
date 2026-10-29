'use client'

import { useEffect, useState } from 'react'
import { describeServerOutcome, fetchBrowserAnalytics, type BrowserFallbackServerStatus } from '@/lib/browser-analytics'
import { hashrateFreshness, hashrateHpsToEhps, HASHRATE_STALE_AFTER_MS, parseCurrentHashrate, parseDifficultyAnalytics, type BackendData, type CurrentHashrate, type DifficultyAnalytics } from '@/lib/bitcoin-analytics-contract'

type Kind = 'difficulty' | 'hashrate'
type Result = BackendData<DifficultyAnalytics> | BackendData<CurrentHashrate>

const endpoint: Record<Kind, string> = {
  difficulty: 'https://api.doefin.com/v1/block/analytics',
  hashrate: 'https://api.doefin.com/v3/bitcoin/hashrate/current',
}

function describe(result: Exclude<Result, { status: 'available' }>) {
  if (result.status === 'region-restricted') return `The API returned HTTP ${result.httpStatus}: access is region-restricted.`
  if (result.status === 'not-found') return 'The API returned HTTP 404; no published record is available.'
  if (result.status === 'invalid') return `The API returned HTTP ${result.httpStatus}, but its response did not match the supported schema.`
  return result.detail ?? (result.httpStatus ? `The API returned HTTP ${result.httpStatus}.` : 'The browser could not reach the API. CORS, network policy or a timeout may have blocked the request.')
}

const stamp = (value: string) => new Date(value).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hour12: false }) + ' UTC'
const decimal = (value: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value)
export function BrowserAnalyticsFallback({ kind, serverStatus }: { kind: Kind; serverStatus: BrowserFallbackServerStatus }) {
  const [result, setResult] = useState<Result | null>(null)
  useEffect(() => {
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 8000)
    const request = kind === 'difficulty'
      ? fetchBrowserAnalytics(endpoint.difficulty, parseDifficultyAnalytics, fetch, controller.signal)
      : fetchBrowserAnalytics(endpoint.hashrate, parseCurrentHashrate, fetch, controller.signal)
    request.then(value => {
      if (!controller.signal.aborted) setResult(value)
    })
    return () => { window.clearTimeout(timer); controller.abort() }
  }, [kind])

  if (!result) return <div className="mt-4 border-t border-white/10 pt-4 text-xs text-subtle" role="status">Trying the public API from this browser…</div>
  if (result.status !== 'available') return <div className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle" role="status"><strong className="font-semibold text-body">Browser API request did not return usable data.</strong><p className="mt-2">{describe(result)}</p><p className="mt-2">Checked {stamp(result.receivedAt)}. No sample values are substituted.</p></div>

  if (kind === 'difficulty') {
    const data = result.data as DifficultyAnalytics
    const change = data.next_difficulty_pct_changes * 100
    return <div className="mt-4 border-t border-white/10 pt-4" role="status"><p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Live API data from this browser · HTTP {result.httpStatus}</p><p className="mt-2 text-xs text-subtle">{describeServerOutcome(serverStatus)} Source height {data.current_block_height.toLocaleString('en-US')}.</p><dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">{[
      ['Current difficulty', String(data.current_difficulty)], ['Next difficulty point estimate', String(data.next_difficulty_estimation)],
      ['Estimated change', `${change >= 0 ? '+' : ''}${decimal(change)}%`], ['Next adjustment block', data.next_difficulty_adjustment_block_height.toLocaleString('en-US')],
      ['Blocks remaining', data.blocks_till_next_adjustment.toLocaleString('en-US')], ['Average epoch block time', `${decimal(data.current_epoch_average_block_time)} seconds`],
    ].map(([label, value]) => <div key={label}><dt className="text-subtle">{label}</dt><dd className="tabular mt-1 break-all font-semibold text-body">{value}</dd></div>)}</dl><p className="mt-3 text-xs text-subtle">Forecast range: unavailable; this endpoint returns a point estimate only. Browser response received {stamp(result.receivedAt)}.</p></div>
  }

  const data = result.data as CurrentHashrate
  const freshness = hashrateFreshness(data.timestamp, result.receivedAt)
  const age = Math.max(0, (Date.parse(result.receivedAt) - data.timestamp * 1000) / 60000)
  const windows = [['120 blocks (~20 hours)', data.rolling_avg_hashrate_120], ['144 blocks (~1 day)', data.rolling_avg_hashrate_144], ['2016 blocks (~2 weeks)', data.rolling_avg_hashrate_2016]] as const
  const present = windows.filter(([, value]) => value !== null)
  return <div className="mt-4 border-t border-white/10 pt-4" role="status"><p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Live API data from this browser · HTTP {result.httpStatus}</p><p className="mt-2 text-xs text-subtle">{describeServerOutcome(serverStatus)} Source block {data.block_number.toLocaleString('en-US')} at {stamp(new Date(data.timestamp * 1000).toISOString())}.</p><p className="mt-2 text-xs text-subtle">{freshness === 'current' ? `Source record age ${decimal(age)} minutes (stale after ${HASHRATE_STALE_AFTER_MS / 60000} minutes).` : freshness === 'stale' ? `Source record is older than ${HASHRATE_STALE_AFTER_MS / 60000} minutes.` : 'Source time is ahead of response time; freshness cannot be established.'}</p>{present.length ? <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2">{present.map(([label, value]) => <div key={label}><dt className="text-subtle">{label}</dt><dd className="tabular mt-1 break-all font-semibold text-body">{hashrateHpsToEhps(value!)} EH/s</dd><dd className="mt-1 break-all text-subtle">Exact API value: {value} H/s</dd></div>)}</dl> : <p className="mt-3 text-xs text-subtle">The block record has no populated hashrate windows.</p>}<p className="mt-3 text-xs text-subtle">No range is inferred from rolling averages. Browser response received {stamp(result.receivedAt)}.</p></div>
}

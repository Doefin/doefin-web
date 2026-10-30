import Link from '@/components/routing/SiteLink'
import { hashrateFreshness, hashrateHpsToEhps, HASHRATE_STALE_AFTER_MS, type BackendData, type CurrentHashrate, type DifficultyAnalytics } from '@/lib/bitcoin-analytics-contract'
import { DataFields, dataPanel } from './DataDetail'
import { Arrow } from './Arrow'
import { BrowserAnalyticsFallback } from './BrowserAnalyticsFallback'

const receivedAt = (value: string) => new Date(value).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hour12: false }) + ' UTC'
const sourceStatus = (result: Exclude<BackendData<unknown>, { status: 'available' }>) => {
  if (result.status === 'region-restricted') return { heading: 'Live backend data is region-restricted.', message: `The backend denied this request with HTTP ${result.httpStatus}. No source values are shown.` }
  if (result.status === 'not-found') return { heading: 'No backend record is available.', message: 'The endpoint returned 404. No source values are shown.' }
  if (result.status === 'invalid') return { heading: 'Backend data could not be validated.', message: `The endpoint returned HTTP ${result.httpStatus} with an unsupported response. No source values are shown.` }
  return { heading: 'Live backend data is unavailable.', message: result.httpStatus ? `The endpoint returned HTTP ${result.httpStatus}. No source values are shown.` : 'The endpoint could not be reached or timed out. No source values are shown.' }
}

export function DifficultyReadingPanel({ result, detail = false }: { result: BackendData<DifficultyAnalytics>; detail?: boolean }) {
  if (result.status !== 'available') {
    const state = sourceStatus(result)
    return <article role="status" className={`${dataPanel} border-caution/30`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Current difficulty estimate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Unavailable</span></div><p className="mt-4 text-sm font-semibold text-body">{state.heading}</p><p className="mt-2 text-xs leading-relaxed text-subtle">{state.message}</p><p className="mt-3 text-[11px] text-subtle">Response checked {receivedAt(result.receivedAt)}.</p><p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">No sample estimate or authored range is substituted for live data. The endpoint does not publish a forecast interval.</p><BrowserAnalyticsFallback kind="difficulty" serverStatus={result.status} />{!detail && <Link href="/data/difficulty" className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Open difficulty guide <Arrow className="h-4 w-4" /></Link>}</article>
  }
  const data = result.data
  const percent = data.next_difficulty_pct_changes * 100
  return <article className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20">
    <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Next difficulty adjustment estimate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-highlight">Live backend estimate</span></div>
      <p className="mt-2 text-xs text-subtle">Bitcoin difficulty scalar · source height <span className="tabular text-body">{data.current_block_height.toLocaleString('en-US')}</span></p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-8"><div><p className="text-xs text-subtle">Current difficulty</p><p className="tabular mt-2 break-all text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl">{String(data.current_difficulty)}</p><p className="mt-2 text-xs text-subtle">Raw API value; unitless protocol difficulty.</p></div><div className="border-l border-white/10 pl-3 sm:pl-8"><p className="text-xs text-subtle">Estimated next difficulty</p><p className="tabular mt-2 break-all text-xl font-extrabold leading-tight tracking-[-0.03em] text-highlight sm:text-2xl">{String(data.next_difficulty_estimation)}</p><p className="mt-2 text-xs text-subtle">Point estimate from the backend analytics response.</p></div></div>
      <div className="mt-6 border-t border-white/10 pt-5"><DataFields rows={[
        { label: 'Estimated difficulty change', value: `${percent >= 0 ? '+' : ''}${new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(percent)}%`, note: 'Backend returns a ratio; displayed as a percentage by multiplying by 100.' },
        { label: 'Next adjustment block', value: data.next_difficulty_adjustment_block_height.toLocaleString('en-US') },
        { label: 'Blocks until adjustment', value: data.blocks_till_next_adjustment.toLocaleString('en-US') },
        { label: 'Average block time this epoch', value: `${data.current_epoch_average_block_time.toLocaleString('en-US')} seconds` },
        { label: 'Estimated adjustment time', value: <time dateTime={new Date(data.next_adjustment_timestamp * 1000).toISOString()}>{receivedAt(new Date(data.next_adjustment_timestamp * 1000).toISOString())}</time> },
        { label: 'Forecast range', value: 'Unavailable', note: 'The backend endpoint publishes a point estimate only; no interval is returned.' },
      ]} /></div>
      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">The response has no source timestamp for its current block. Its age cannot be independently verified; response received {receivedAt(result.receivedAt)}.</p>
    </div><div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/10 px-5 py-4 sm:px-7"><p className="tabular text-xs text-subtle">Last adjustment timestamp: {receivedAt(new Date(data.last_difficulty_adjsutment_timestamp * 1000).toISOString())}</p>{!detail && <Link href="/data/difficulty" className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Read the difficulty guide <Arrow className="h-4 w-4" /></Link>}</div>
  </article>
}

export function HashrateReadingPanel({ result, detail = false }: { result: BackendData<CurrentHashrate>; detail?: boolean }) {
  if (result.status !== 'available') {
    const state = sourceStatus(result)
    return <article role="status" className={`${dataPanel} border-caution/30`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Observed network hashrate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Unavailable</span></div><p className="mt-4 text-sm font-semibold text-body">{state.heading}</p><p className="mt-2 text-xs leading-relaxed text-subtle">{state.message}</p><p className="mt-3 text-[11px] text-subtle">Response checked {receivedAt(result.receivedAt)}.</p><p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">No synthetic center or authored spread is substituted for backend data.</p><BrowserAnalyticsFallback kind="hashrate" serverStatus={result.status} />{!detail && <Link href="/data/hashrate" className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Open hashrate guide <Arrow className="h-4 w-4" /></Link>}</article>
  }
  const data = result.data, freshness = hashrateFreshness(data.timestamp, result.receivedAt)
  const ageMinutes = Math.max(0, (Date.parse(result.receivedAt) - data.timestamp * 1000) / 60000)
  const windows = [
    ['120 blocks (~20 hours)', data.rolling_avg_hashrate_120],
    ['144 blocks (~1 day)', data.rolling_avg_hashrate_144],
    ['2016 blocks (~2 weeks)', data.rolling_avg_hashrate_2016],
  ] as const
  const present = windows.filter(([, raw]) => raw !== null)
  return <article className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20">
    <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Observed rolling network hashrate</h2><span className={`text-[10px] font-bold uppercase tracking-wider ${freshness === 'stale' || freshness === 'future' ? 'text-caution' : 'text-highlight'}`}>{freshness === 'stale' ? 'Stale source timestamp' : freshness === 'future' ? 'Source clock mismatch' : freshness === 'unknown' ? 'Freshness unknown' : 'Backend record'}</span></div>
      <p className="mt-2 text-xs text-subtle">Source block <span className="tabular text-body">{data.block_number.toLocaleString('en-US')}</span> · timestamp <time dateTime={new Date(data.timestamp * 1000).toISOString()}>{receivedAt(new Date(data.timestamp * 1000).toISOString())}</time></p>
      {freshness === 'stale' ? <p role="status" className="mt-3 text-xs leading-relaxed text-caution">Source record is {ageMinutes.toFixed(1)} minutes old; this page marks source timestamps older than {HASHRATE_STALE_AFTER_MS / 60000} minutes as stale.</p> : freshness === 'current' ? <p className="mt-3 text-xs text-subtle">Source record is {ageMinutes.toFixed(1)} minutes old (site freshness threshold: {HASHRATE_STALE_AFTER_MS / 60000} minutes).</p> : <p role="status" className="mt-3 text-xs text-caution">Source timestamp is later than the response time; freshness cannot be established.</p>}
      {present.length ? <div className="mt-6 border-t border-white/10 pt-5"><DataFields rows={present.map(([label, raw]) => ({ label, value: `${hashrateHpsToEhps(raw!) ?? 'Unavailable'} EH/s`, note: `Exact backend value: ${raw} H/s.` }))} /></div> : <p role="status" className="mt-6 border-t border-white/10 pt-5 text-sm text-subtle">The endpoint returned a block record but no hashrate windows.</p>}
      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">These are rolling averages of network work, not machine counts or forecast intervals. API values are stored as H/s decimal strings and converted to EH/s without rounding.</p>
    </div>{!detail && <div className="border-t border-white/10 px-5 py-3 sm:px-7"><Link href="/data/hashrate" className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Read the hashrate guide <Arrow className="h-4 w-4" /></Link></div>}
  </article>
}

import Link from '@/components/routing/SiteLink'
import { hashrateFreshness, hashrateHpsToEhps, HASHRATE_STALE_AFTER_MS, type BackendData, type CurrentHashrate, type DifficultyAnalytics } from '@/lib/bitcoin-analytics-contract'
import { readableDifficulty, readableHashrate, readablePercentageChange } from '@/lib/readable-numbers'
import { DataFields, dataPanel } from './DataDetail'
import { Arrow } from './Arrow'
import { BrowserAnalyticsFallback } from './BrowserAnalyticsFallback'

const receivedAt = (value: string) => new Date(value).toLocaleString('en-GB', { timeZone: 'UTC', dateStyle: 'medium', timeStyle: 'medium', hour12: false }) + ' UTC'
const sourceStatus = (result: Exclude<BackendData<unknown>, { status: 'available' }>) => {
  if (result.status === 'region-restricted') return { heading: 'Regional access rules blocked the server request.', message: `The API returned HTTP ${result.httpStatus} to the server. That response contains no usable source values.` }
  if (result.status === 'not-found') return { heading: 'The server received no record for this request.', message: 'The API returned HTTP 404 to the server. That response contains no source values.' }
  if (result.status === 'invalid') return { heading: 'The server received a response it could not read.', message: `The API returned HTTP ${result.httpStatus} with an unsupported response to the server. No values from that response are shown.` }
  return { heading: 'The server could not retrieve the data.', message: result.httpStatus ? `The API returned HTTP ${result.httpStatus} to the server. That response contains no usable source values.` : 'The server could not reach the API, or the request timed out.' }
}

export function DifficultyReadingPanel({ result, detail = false }: { result: BackendData<DifficultyAnalytics>; detail?: boolean }) {
  if (result.status !== 'available') {
    const state = sourceStatus(result)
    return <article role="status" className={`${dataPanel} border-caution/30`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Next difficulty adjustment estimate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Server request unavailable</span></div><p className="mt-4 text-sm font-semibold text-body">{state.heading}</p><p className="mt-2 text-xs leading-relaxed text-subtle">{state.message}</p><p className="mt-3 text-[11px] text-subtle">Response checked {receivedAt(result.receivedAt)}.</p><p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">This panel shows no substitute example values. The API does not publish a forecast range.</p><BrowserAnalyticsFallback kind="difficulty" serverStatus={result.status} />{!detail && <Link href="/data/difficulty" className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Open difficulty guide <Arrow className="h-4 w-4" /></Link>}</article>
  }
  const data = result.data
  const percent = data.next_difficulty_pct_changes * 100
  return <article className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20">
    <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Next difficulty adjustment estimate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-highlight">Current API estimate</span></div>
      <p className="mt-2 text-xs text-subtle">Bitcoin mining difficulty · source block <span className="tabular text-body">{data.current_block_height.toLocaleString('en-US')}</span></p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-8"><div><p className="text-xs text-subtle">Current difficulty</p><p className="tabular mt-2 break-all text-xl font-extrabold leading-tight tracking-[-0.03em] sm:text-2xl">{readableDifficulty(data.current_difficulty)}</p><p className="mt-2 text-xs text-subtle">T means trillion. Difficulty has no unit.</p></div><div className="border-l border-white/10 pl-3 sm:pl-8"><p className="text-xs text-subtle">Estimated next difficulty</p><p className="tabular mt-2 break-all text-xl font-extrabold leading-tight tracking-[-0.03em] text-highlight sm:text-2xl">{readableDifficulty(data.next_difficulty_estimation)}</p><p className="mt-2 text-xs text-subtle">A single estimate, shown in trillions.</p></div></div>
      <div className="mt-6 border-t border-white/10 pt-5"><DataFields rows={[
        { label: 'Estimated difficulty change', value: readablePercentageChange(data.next_difficulty_pct_changes) },
        { label: 'Next adjustment block', value: data.next_difficulty_adjustment_block_height.toLocaleString('en-US') },
        { label: 'Blocks until adjustment', value: data.blocks_till_next_adjustment.toLocaleString('en-US') },
        { label: 'Average block time this epoch', value: `${data.current_epoch_average_block_time.toLocaleString('en-US')} seconds` },
        { label: 'Estimated adjustment time', value: <time dateTime={new Date(data.next_adjustment_timestamp * 1000).toISOString()}>{receivedAt(new Date(data.next_adjustment_timestamp * 1000).toISOString())}</time> },
        { label: 'Forecast range', value: 'Unavailable', note: 'The API supplies a single estimate, with no lower or upper forecast limit.' },
      ]} /></div>
      <details className="mt-5 border-t border-white/10 pt-4"><summary className="min-h-10 cursor-pointer text-xs font-semibold text-highlight">Show exact source values</summary><div className="mt-3 text-xs text-subtle"><p>Analytics API, source block {data.current_block_height.toLocaleString('en-US')}. Response received {receivedAt(result.receivedAt)}.</p><div className="mt-4 break-all"><DataFields rows={[
        { label: 'Current difficulty (no unit)', value: String(data.current_difficulty) },
        { label: 'Estimated next difficulty (no unit)', value: String(data.next_difficulty_estimation) },
        { label: 'Estimated difficulty change (source ratio)', value: String(data.next_difficulty_pct_changes) },
        { label: 'Estimated difficulty change (ratio × 100)', value: `${String(percent)}%` },
      ]} /></div></div></details>
      <p className="mt-3 text-xs text-subtle">Values marked ~ are rounded. Exact source values are available above.</p>
      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">The API does not say when its current block was recorded, so this page cannot verify the data’s age. Response received {receivedAt(result.receivedAt)}.</p>
    </div><div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/10 px-5 py-4 sm:px-7"><p className="tabular text-xs text-subtle">Last adjustment timestamp: {receivedAt(new Date(data.last_difficulty_adjsutment_timestamp * 1000).toISOString())}</p>{!detail && <Link href="/data/difficulty" className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Read the difficulty guide <Arrow className="h-4 w-4" /></Link>}</div>
  </article>
}

export function HashrateReadingPanel({ result, detail = false }: { result: BackendData<CurrentHashrate>; detail?: boolean }) {
  if (result.status !== 'available') {
    const state = sourceStatus(result)
    return <article role="status" className={`${dataPanel} border-caution/30`}><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Observed network hashrate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Server request unavailable</span></div><p className="mt-4 text-sm font-semibold text-body">{state.heading}</p><p className="mt-2 text-xs leading-relaxed text-subtle">{state.message}</p><p className="mt-3 text-[11px] text-subtle">Response checked {receivedAt(result.receivedAt)}.</p><p className="mt-4 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">This panel shows no made-up estimate or range in place of source data.</p><BrowserAnalyticsFallback kind="hashrate" serverStatus={result.status} />{!detail && <Link href="/data/hashrate" className="mt-3 inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Open hashrate guide <Arrow className="h-4 w-4" /></Link>}</article>
  }
  const data = result.data, freshness = hashrateFreshness(data.timestamp, result.receivedAt)
  const ageMinutes = Math.max(0, (Date.parse(result.receivedAt) - data.timestamp * 1000) / 60000)
  const windows = [
    ['120 blocks (~20 hours)', data.rolling_avg_hashrate_120],
    ['144 blocks (~1 day)', data.rolling_avg_hashrate_144],
    ['2,016 blocks (~2 weeks)', data.rolling_avg_hashrate_2016],
  ] as const
  const present = windows.filter(([, raw]) => raw !== null)
  return <article className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20">
    <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Network hashrate over recent blocks</h2><span className={`text-[10px] font-bold uppercase tracking-wider ${freshness === 'stale' || freshness === 'future' ? 'text-caution' : 'text-highlight'}`}>{freshness === 'stale' ? 'Stale source timestamp' : freshness === 'future' ? 'Source clock mismatch' : freshness === 'unknown' ? 'Freshness unknown' : 'API record'}</span></div>
      <p className="mt-2 text-xs text-subtle">Source block <span className="tabular text-body">{data.block_number.toLocaleString('en-US')}</span> · timestamp <time dateTime={new Date(data.timestamp * 1000).toISOString()}>{receivedAt(new Date(data.timestamp * 1000).toISOString())}</time></p>
      {freshness === 'stale' ? <p role="status" className="mt-3 text-xs leading-relaxed text-caution">Source record is {ageMinutes.toFixed(1)} minutes old; this page marks source timestamps older than {HASHRATE_STALE_AFTER_MS / 60000} minutes as stale.</p> : freshness === 'current' ? <p className="mt-3 text-xs text-subtle">Source record is {ageMinutes.toFixed(1)} minutes old (site freshness threshold: {HASHRATE_STALE_AFTER_MS / 60000} minutes).</p> : <p role="status" className="mt-3 text-xs text-caution">Source timestamp is later than the response time; freshness cannot be established.</p>}
      {present.length ? <div className="mt-6 border-t border-white/10 pt-5"><DataFields rows={present.map(([label, raw]) => ({ label, value: readableHashrate(raw) }))} /></div> : <p role="status" className="mt-6 border-t border-white/10 pt-5 text-sm text-subtle">The endpoint returned a block record but no hashrate windows.</p>}
      {present.length > 0 && <details className="mt-5 border-t border-white/10 pt-4"><summary className="min-h-10 cursor-pointer text-xs font-semibold text-highlight">Show exact source values</summary><div className="mt-3 text-xs text-subtle"><p>Hashrate API, source block {data.block_number.toLocaleString('en-US')} at {receivedAt(new Date(data.timestamp * 1000).toISOString())}.</p><div className="mt-4 break-all"><DataFields rows={present.map(([label, raw]) => ({ label, value: `${raw} H/s`, note: `Exact conversion: ${hashrateHpsToEhps(raw ?? '') ?? 'Unavailable'} EH/s.` }))} /></div><p className="mt-3">The API supplies decimal H/s values as text. Conversion to EH/s preserves their full precision.</p></div></details>}
      <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">EH/s means exahashes per second. Values marked ~ are rounded. These estimates average network work over recent blocks. They are not machine counts or forecast ranges.</p>
    </div>{!detail && <div className="border-t border-white/10 px-5 py-3 sm:px-7"><Link href="/data/hashrate" className="inline-flex min-h-10 items-center gap-2 text-xs font-bold text-highlight hover:underline">Read the hashrate guide <Arrow className="h-4 w-4" /></Link></div>}
  </article>
}

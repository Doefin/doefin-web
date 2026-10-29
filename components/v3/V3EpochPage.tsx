import { notFound } from 'next/navigation'
import { epochs, networkSeries } from '@/content'
import { dateLong, dateShort, int, pct, tera } from '@/lib/format'
import { seo } from '@/lib/seo'
import { DataDetail, DataFields, DataNext, DataRange, DataRecords, DataSection, dataCopy, dataPanel } from './DataDetail'

const findEpoch = (height: string) => epochs.find(epoch => String(epoch.height) === height)
export const generateStaticParams = () => epochs.map(epoch => ({ height: String(epoch.height) }))
export async function generateMetadata({ params }: { params: Promise<{ height: string }> }) {
  const epoch = findEpoch((await params).height)
  return epoch ? seo({ title: `Sample difficulty record: ${epoch.height}`, description: 'Inspect an authored difficulty forecast, before/after levels, a supplied outcome and error arithmetic. All values and dates are synthetic.', path: '/v3/data/difficulty/epoch/' + epoch.height }) : {}
}

export default async function V3EpochPage({ params }: { params: Promise<{ height: string }> }) {
  const epoch = findEpoch((await params).height)
  if (!epoch) notFound()
  const outcome = epoch.realisedPct
  const difference = outcome === undefined ? undefined : outcome - epoch.forecastPct
  const error = difference === undefined ? undefined : Math.abs(difference)
  const inRange = outcome === undefined ? undefined : outcome >= epoch.band95[0] && outcome <= epoch.band95[1]
  const projected = epoch.difficultyBeforeT * (1 + epoch.forecastPct / 100)
  const seriesPoint = networkSeries.find(point => point.height === epoch.height)
  return <DataDetail title={`A record at block ${int(epoch.height)}.`} summary="Trace the authored forecast, the supplied outcome and the difference between them." category="Dated example" current="difficulty" crumbs={[{ name: 'Difficulty', href: '/v3/data/difficulty' }, { name: `Block ${int(epoch.height)}`, href: '/v3/data/difficulty/epoch/' + epoch.height }]}>
    <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
      <section className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20" aria-labelledby="forecast-outcome-title">
        <div className="p-5 sm:p-7"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="forecast-outcome-title" className="text-lg font-bold">Forecast → outcome</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic record</span></div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-8">
            <div><p className="text-xs text-subtle">Forecast change</p><p className="tabular mt-3 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.04em] text-highlight min-[360px]:text-[34px] sm:text-[42px]">{pct(epoch.forecastPct)}</p><p className="tabular mt-3 text-xs leading-[1.8] text-subtle">Reference<br /><time dateTime={epoch.startedAt}>{dateShort(epoch.startedAt)}</time></p></div>
            <div className="border-l border-white/10 pl-3 sm:pl-8"><p className="text-xs text-subtle">Example outcome</p>{outcome === undefined ? <p className="mt-3 text-base font-semibold leading-snug">Not included</p> : <p className="tabular mt-3 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.04em] min-[360px]:text-[34px] sm:text-[42px]">{pct(outcome)}</p>}<p className="tabular mt-3 text-xs leading-[1.8] text-subtle">{epoch.settledAt ? <>Outcome date<br /><time dateTime={epoch.settledAt}>{dateShort(epoch.settledAt)}</time></> : 'No outcome date supplied'}</p></div>
          </div>
        </div>
        <div className="grid gap-5 border-t border-white/10 px-5 py-5 sm:grid-cols-2 sm:px-7"><div><h3 className="text-xs text-subtle">Absolute error</h3><p className="tabular mt-2 text-xl font-bold text-highlight">{error === undefined ? 'Not calculable' : `${error.toFixed(2)} pp`}</p></div><div><h3 className="text-xs text-subtle">Outcome vs authored range</h3><p className="mt-2 text-sm font-semibold">{inRange === undefined ? 'Not assessable' : inRange ? 'Inside the range' : 'Outside the range'}</p><p className="mt-1 text-xs leading-relaxed text-subtle">{outcome === undefined ? 'An outcome is required.' : 'This is interval membership, not calibration.'}</p></div></div>
      </section>
      <section className={dataPanel}><DataRange id={`record-range-${epoch.height}`} low={epoch.band95[0]} high={epoch.band95[1]} forecast={epoch.forecastPct} outcome={outcome} /><p className={'mt-5 border-t border-white/10 pt-4 ' + dataCopy}>{outcome === undefined ? 'This record supplies a forecast and a range, but no outcome. A missing value is not a pending live adjustment or a zero error.' : `The example outcome is ${Math.abs(difference!).toFixed(2)} percentage points ${difference! >= 0 ? 'higher' : 'lower'} than the forecast. It falls ${inRange ? 'inside' : 'outside'} the authored endpoints.`}</p><p className="mt-3 text-xs leading-[1.8] text-subtle">The endpoints were authored with the record. They do not establish a confidence level or the probability of an outcome.</p></section>
    </div>

    <DataSection title="Follow the level, not just the percentage." description="T means trillion. These are the difficulty levels supplied with this record, kept separate from the forecast change.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className={dataPanel}><DataFields rows={[
          { label: 'Difficulty before', value: tera(epoch.difficultyBeforeT) },
          { label: 'Level implied by the forecast', value: tera(projected), note: 'Derived from the before level and forecast; displayed to two decimals.' },
          { label: 'Difficulty after', value: epoch.difficultyAfterT === undefined ? 'Not included' : tera(epoch.difficultyAfterT), note: epoch.difficultyAfterT === undefined ? 'No after level is supplied in this example.' : 'An authored value, not a verified network observation.' },
        ]} /></section>
        <section className={dataPanel}><h3 className="text-base font-bold">Check the calculation</h3><p className="tabular mt-4 rounded-lg bg-ink/45 p-4 text-sm leading-[1.9]">Forecast level = {epoch.difficultyBeforeT.toFixed(2)} × (1 + ({epoch.forecastPct.toFixed(2)} ÷ 100))<br /><span className="font-semibold text-highlight">= {projected.toFixed(2)}T</span></p>{outcome === undefined ? <p className={'mt-4 ' + dataCopy}>Without an after level and outcome, there is no realised change or error to reproduce. The forecast-level calculation remains a hypothetical projection.</p> : <><p className="tabular mt-4 text-sm leading-[1.9]">Absolute error = |{outcome.toFixed(2)} − ({epoch.forecastPct.toFixed(2)})|<br /><span className="font-bold text-highlight">= {error!.toFixed(2)} percentage points</span></p><p className={'mt-4 ' + dataCopy}>The before/after levels imply <span className="tabular">{(((epoch.difficultyAfterT! / epoch.difficultyBeforeT) - 1) * 100).toFixed(2)}%</span> when rounded, matching the authored outcome. The error measures the gap between two percentage changes; it is not a percentage loss or trading return.</p></>}</section>
      </div>
    </DataSection>

    <DataSection title="Read the dates as part of the record."><div className="grid gap-5 lg:grid-cols-2"><section className={dataPanel}><DataFields rows={[
      { label: 'Target block', value: int(epoch.height) },
      { label: 'Forecast reference date', value: <time dateTime={epoch.startedAt}>{dateLong(epoch.startedAt)}</time> },
      { label: 'Outcome date', value: epoch.settledAt ? <time dateTime={epoch.settledAt}>{dateLong(epoch.settledAt)}</time> : 'Not included' },
      { label: 'Original forecast capture', value: 'Not supplied', note: 'No time-stamped external publication or input snapshot accompanies this example.' },
      { label: 'Method version / revision log', value: 'Not supplied' },
    ]} /></section><section className={dataPanel}><h3 className="text-base font-bold">What this record can establish</h3><p className={'mt-3 ' + dataCopy}>You can inspect the supplied forecast, range and {outcome === undefined ? 'absence of an outcome' : 'outcome, and reproduce the arithmetic'}. A measured historical record would also need original input data, captured forecast timestamps, method version and a verifiable outcome.</p><p className={'mt-3 ' + dataCopy}>This is an editable example page, not an immutable archive. Corrections to a measured record should identify revisions and retain the evidence needed to reproduce the earlier result.</p>{seriesPoint && <details className="mt-5 border-t border-white/10 pt-2"><summary className="cursor-pointer py-3 text-xs font-semibold text-highlight">Why this record differs from the chart series</summary><p className="pb-2 text-xs leading-[1.9] text-subtle">The separate series assigns block <span className="tabular">{int(seriesPoint.height)}</span> a level of <span className="tabular">{tera(seriesPoint.difficultyT)}</span> on <time dateTime={seriesPoint.date}>{dateLong(seriesPoint.date)}</time>. This record starts on <time dateTime={epoch.startedAt}>{dateLong(epoch.startedAt)}</time>{epoch.settledAt ? <> and assigns its outcome to <time dateTime={epoch.settledAt}>{dateLong(epoch.settledAt)}</time></> : ' and supplies no outcome date'}. These authored examples do not form a verified shared timeline.</p></details>}</section></div></DataSection>

    <DataSection title="Inspect another example record."><DataRecords exclude={epoch.height} /></DataSection>
    <DataNext items={[{ href: '/v3/data/difficulty', label: 'Return to the difficulty example', note: 'Read the snapshot, level calculation and separate source series.' }, { href: '/v3/data/scoreboard', label: 'Understand accuracy metrics', note: 'Put an individual error in context with sample size, coverage and evaluation rules.' }]} />
  </DataDetail>
}

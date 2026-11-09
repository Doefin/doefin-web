import { notFound } from 'next/navigation'
import { epochs, networkSeries } from '@/content'
import { dateLong, dateShort, int, pct, tera } from '@/lib/format'
import { seo } from '@/lib/seo'
import { DataDetail, DataFields, DataNext, DataRange, DataRecords, DataSection, dataCopy, dataPanel } from './DataDetail'

const findEpoch = (height: string) => epochs.find(epoch => String(epoch.height) === height)
export const generateStaticParams = () => epochs.map(epoch => ({ height: String(epoch.height) }))
export async function generateMetadata({ params }: { params: Promise<{ height: string }> }) {
  const epoch = findEpoch((await params).height)
  return epoch ? seo({ title: `Sample difficulty record: ${epoch.height}`, description: 'Follow an example difficulty forecast, the levels before and after, and the error calculation. All values and dates are synthetic.', path: '/data/difficulty/epoch/' + epoch.height }) : {}
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
  return <DataDetail title={`A forecast example at block ${int(epoch.height)}.`} summary="Compare the example forecast with its outcome and work through the difference." category="Dated example" current="difficulty" crumbs={[{ name: 'Difficulty', href: '/data/difficulty' }, { name: `Block ${int(epoch.height)}`, href: '/data/difficulty/epoch/' + epoch.height }]}>
    <div className="grid items-start gap-5 lg:grid-cols-[1.3fr_1fr]">
      <section className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20" aria-labelledby="forecast-outcome-title">
        <div className="p-5 sm:p-7"><h2 id="forecast-outcome-title" className="text-lg font-bold">Forecast → outcome</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-8">
            <div><p className="text-xs text-subtle">Forecast change</p><p className="tabular mt-3 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.04em] text-highlight min-[360px]:text-[34px] sm:text-[42px]">{pct(epoch.forecastPct)}</p><p className="tabular mt-3 text-xs leading-[1.8] text-subtle">Reference<br /><time dateTime={epoch.startedAt}>{dateShort(epoch.startedAt)}</time></p></div>
            <div className="border-l border-white/10 pl-3 sm:pl-8"><p className="text-xs text-subtle">Example outcome</p>{outcome === undefined ? <p className="mt-3 text-base font-semibold leading-snug">Not included</p> : <p className="tabular mt-3 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.04em] min-[360px]:text-[34px] sm:text-[42px]">{pct(outcome)}</p>}<p className="tabular mt-3 text-xs leading-[1.8] text-subtle">{epoch.settledAt ? <>Outcome date<br /><time dateTime={epoch.settledAt}>{dateShort(epoch.settledAt)}</time></> : 'No outcome date supplied'}</p></div>
          </div>
        </div>
        <div className="grid gap-5 border-t border-white/10 px-5 py-5 sm:grid-cols-2 sm:px-7"><div><h3 className="text-xs text-subtle">Absolute error</h3><p className="tabular mt-2 text-xl font-bold text-highlight">{error === undefined ? 'Not calculable' : `${error.toFixed(2)} pp`}</p></div><div><h3 className="text-xs text-subtle">Outcome within example range</h3><p className="mt-2 text-sm font-semibold">{inRange === undefined ? 'Not assessable' : inRange ? 'Inside the range' : 'Outside the range'}</p><p className="mt-1 text-xs leading-relaxed text-subtle">{outcome === undefined ? 'An outcome is required.' : 'This shows whether the outcome is inside the range, not whether the range is reliable.'}</p></div></div>
      </section>
      <section className={dataPanel}><DataRange id={`record-range-${epoch.height}`} low={epoch.band95[0]} high={epoch.band95[1]} forecast={epoch.forecastPct} outcome={outcome} /><p className={'mt-5 border-t border-white/10 pt-4 ' + dataCopy}>{outcome === undefined ? 'This record supplies a forecast and a range, but no outcome. A missing value is not a pending live adjustment or a zero error.' : `The example outcome is ${Math.abs(difference!).toFixed(2)} percentage points ${difference! >= 0 ? 'higher' : 'lower'} than the forecast. It falls ${inRange ? 'inside' : 'outside'} the example range.`}</p><p className="mt-3 text-xs leading-[1.8] text-subtle">The range was made up for this example. Its endpoints do not establish a confidence level or an outcome’s probability.</p></section>
    </div>

    <DataSection title="From a percentage change to a level." description="T means trillion. The values below show difficulty levels, rather than percentage changes.">
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className={dataPanel}><DataFields rows={[
          { label: 'Difficulty before', value: tera(epoch.difficultyBeforeT) },
          { label: 'Level implied by the forecast', value: tera(projected), note: 'Derived from the before level and forecast; displayed to two decimals.' },
          { label: 'Difficulty after', value: epoch.difficultyAfterT === undefined ? 'Not included' : tera(epoch.difficultyAfterT), note: epoch.difficultyAfterT === undefined ? 'No after level is supplied in this example.' : 'A made-up value, not a verified network observation.' },
        ]} /></section>
        <section className={dataPanel}><h3 className="text-base font-bold">Check the calculation</h3><p className="tabular mt-4 rounded-lg bg-ink/45 p-4 text-sm leading-[1.9]">Forecast level = {epoch.difficultyBeforeT.toFixed(2)} × (1 + ({epoch.forecastPct.toFixed(2)} ÷ 100))<br /><span className="font-semibold text-highlight">= {projected.toFixed(2)}T</span></p>{outcome === undefined ? <p className={'mt-4 ' + dataCopy}>Without the difficulty level after the adjustment and its outcome, there is no realised change or error to calculate. The projected difficulty level remains hypothetical.</p> : <><p className="tabular mt-4 text-sm leading-[1.9]">Absolute error = |{outcome.toFixed(2)} − ({epoch.forecastPct.toFixed(2)})|<br /><span className="font-bold text-highlight">= {error!.toFixed(2)} percentage points</span></p><p className={'mt-4 ' + dataCopy}>The levels before and after imply <span className="tabular">{(((epoch.difficultyAfterT! / epoch.difficultyBeforeT) - 1) * 100).toFixed(2)}%</span> when rounded, matching the example outcome. The error measures the gap between two percentage changes; it is not a percentage loss or trading return.</p></>}</section>
      </div>
    </DataSection>

    <DataSection title="Dates and source records."><div className="grid gap-5 lg:grid-cols-2"><section className={dataPanel}><DataFields rows={[
      { label: 'Target block', value: int(epoch.height) },
      { label: 'Forecast reference date', value: <time dateTime={epoch.startedAt}>{dateLong(epoch.startedAt)}</time> },
      { label: 'Outcome date', value: epoch.settledAt ? <time dateTime={epoch.settledAt}>{dateLong(epoch.settledAt)}</time> : 'Not included' },
      { label: 'Original forecast capture', value: 'Not supplied', note: 'No time-stamped external publication or input snapshot accompanies this example.' },
      { label: 'Method version / revision log', value: 'Not supplied' },
    ]} /></section><section className={dataPanel}><h3 className="text-base font-bold">What this example can show</h3><p className={'mt-3 ' + dataCopy}>You can inspect the supplied forecast, range and {outcome === undefined ? 'absence of an outcome' : 'outcome, and reproduce the arithmetic'}. A measured historical record also needs original input data, saved forecast timestamps, the method version and an outcome that can be checked.</p><p className={'mt-3 ' + dataCopy}>This example page can be edited. It is not a permanent, unchangeable archive. A corrected measured record should show what changed and keep the evidence needed to repeat the earlier result.</p>{seriesPoint && <details className="mt-5 border-t border-white/10 pt-2"><summary className="cursor-pointer py-3 text-xs font-semibold text-highlight">Why this record differs from the chart series</summary><p className="pb-2 text-xs leading-[1.9] text-subtle">The separate series assigns block <span className="tabular">{int(seriesPoint.height)}</span> a level of <span className="tabular">{tera(seriesPoint.difficultyT)}</span> on <time dateTime={seriesPoint.date}>{dateLong(seriesPoint.date)}</time>. This record starts on <time dateTime={epoch.startedAt}>{dateLong(epoch.startedAt)}</time>{epoch.settledAt ? <> and assigns its outcome to <time dateTime={epoch.settledAt}>{dateLong(epoch.settledAt)}</time></> : ' and supplies no outcome date'}. These made-up examples do not share a verified timeline.</p></details>}</section></div></DataSection>

    <DataSection title="Compare another example."><DataRecords exclude={epoch.height} /></DataSection>
    <DataNext items={[{ href: '/data/difficulty', label: 'Return to the difficulty example', note: 'Read the current estimate and the separate example chart.' }, { href: '/data/scoreboard', label: 'Understand accuracy metrics', note: 'Put an individual error in context with sample size, coverage and evaluation rules.' }]} />
  </DataDetail>
}

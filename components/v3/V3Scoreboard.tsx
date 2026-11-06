import Link from '@/components/routing/SiteLink'
import { epochs, getForecastReport, scoreboard, illustrativeComparison, summarizeIllustrativeProvider } from '@/content'
import { dateLong, int, pct } from '@/lib/format'
import { seo } from '@/lib/seo'
import { IllustrativeComparison } from './IllustrativeComparison'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'
import { DataDetail, DataFields, DataNext, DataSection, dataCopy, dataPanel } from './DataDetail'

export const metadata = seo({ title: 'How to read forecast accuracy metrics', description: 'Inspect a synthetic error profile, understand average error and interval coverage, and see which evidence a measured forecast comparison needs.', path: '/data/scoreboard' })

const metrics = [
  { name: 'Mean absolute error', unit: 'pp', unitName: 'Percentage points', meaning: 'The average size of the gaps between forecasts and outcomes, with each pair weighted equally. It ignores direction, so it cannot show a consistent tendency to predict too high or too low.' },
  { name: 'Interval coverage', unit: '%', unitName: 'Share of outcomes', meaning: 'The share of outcomes inside the ranges published with the forecasts. Read it alongside range width: a wide range can include more outcomes while telling you less.' },
  { name: 'Interval width', unit: 'pp', unitName: 'Percentage points', meaning: 'The gap between a range’s lowest and highest values, summarised across the forecasts tested. A narrow range is useful only if it also contains outcomes often enough for its stated confidence level.' },
  { name: 'Sample count', unit: 'n', unitName: 'Scored forecasts', meaning: 'The number of forecast–outcome pairs included in the calculation. Missing or excluded forecasts do not contribute to the score, so they must be recorded separately.' },
]

export default function V3Scoreboard() {
  const intervalExample = epochs.find(epoch => epoch.height === 911232)!
  const report = getForecastReport()
  const errors = report.rows.map(row => ({ sample: row.sample, error: Math.abs(row.observed - row.forecast) }))
  const mae = errors.reduce((total, row) => total + row.error, 0) / errors.length
  const max = Math.max(...errors.map(row => row.error))
  const [modelA, modelB] = illustrativeComparison
  const comparisonA = summarizeIllustrativeProvider(modelA)
  const comparisonB = summarizeIllustrativeProvider(modelB)
  return <DataDetail title="What does forecast accuracy tell you?" summary="An average error summarises a set of forecasts. The individual misses, forecast ranges and sample size help you judge what it means." category="Accuracy" current="scoreboard" datasetNotice={<><strong className="font-semibold text-caution">Forecast examples are synthetic.</strong> The scores and ranges use made-up forecasts and outcomes. They do not measure any provider’s performance.</>} crumbs={[{ name: 'Accuracy metrics', href: '/data/scoreboard' }]}>
    <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20 p-5 sm:p-7" aria-labelledby="sample-error-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="sample-error-title" className="text-lg font-bold">Average error in a worked example</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic arithmetic</span></div>
        <p className="tabular mt-5 text-[48px] font-extrabold leading-none tracking-[-0.05em] text-highlight">{mae.toFixed(2)} <span className="text-xl font-semibold">pp</span></p><p className="mt-3 text-xs leading-[1.8] text-subtle">Mean absolute error across <span className="tabular">{errors.length}</span> synthetic pairs. Sample reference: <time dateTime={report.publishedAt}>{dateLong(report.publishedAt)}</time>.</p>
        <figure className="mt-6 border-t border-white/10 pt-5"><figcaption className="text-xs font-semibold">The average hides the individual misses.</figcaption><ol className="tabular mt-4 space-y-4">{errors.map(row => <li key={row.sample}><div className="flex items-baseline justify-between gap-4 text-xs"><span className="text-subtle">{row.sample}</span><span className="font-semibold">{row.error.toFixed(2)} pp</span></div><div className="mt-2 h-1.5 rounded-full bg-ink/60" aria-hidden="true"><div className="h-full rounded-full bg-chart/70" style={{ width: `${row.error / max * 100}%` }} /></div></li>)}</ol><p className="mt-5 text-xs leading-[1.8] text-subtle">Each bar is one absolute error. Length is relative to this sample’s largest error, <span className="tabular">{max.toFixed(2)} pp</span>; it is not a probability.</p></figure>
        <Link href="/research/evaluating-a-forecast#evidence" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">Inspect the forecast/outcome pairs →</Link>
      </section>
      <section className={dataPanel}><p className="text-[10px] font-bold uppercase tracking-wider text-caution">Measured comparison unavailable</p><h2 className="mt-3 text-xl font-bold tracking-tight">This sample does not rank providers.</h2><p className={'mt-4 ' + dataCopy}>The site has no measured comparison of Doefin and other estimators, or evidence that one forecasts better. <Link href="/research/observed-difficulty-adjustments" className="font-semibold text-highlight underline">Historical network observations</Link> do not supply the missing predictions.</p><div className="mt-6 border-y border-white/10 py-5"><DataFields rows={[{ label: 'Observed adjustment periods scored', value: scoreboard.epochsScored }, { label: 'Measured provider errors', value: 'Not available' }, { label: 'Measured interval coverage', value: 'Not available', note: 'The five-pair calculation does not include lower or upper forecast limits.' }]} /></div><p className={'mt-5 ' + dataCopy}>The five example rows do not count as observed adjustment periods.</p></section>
    </div>

    <DataSection title="Four measures of forecast accuracy." description="Read these measures together. Check the units before comparing the numbers.">
      <div className="grid gap-4 sm:grid-cols-2">{metrics.map(metric => <article key={metric.name} className={dataPanel}><div className="flex items-baseline justify-between gap-4"><h3 className="text-base font-bold">{metric.name}</h3><span className="tabular text-xl font-bold text-highlight" aria-label={metric.unitName}>{metric.unit}</span></div><p className={'mt-4 ' + dataCopy}>{metric.meaning}</p></article>)}</div>
    </DataSection>

    <IllustrativeComparison />
    <DataSection title="What the comparison shows.">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={dataPanel}>
          <h3 className="text-lg font-bold">Lower error, fewer outcomes inside the range.</h3>
          <p className={'mt-3 ' + dataCopy}>In this illustrative comparison, {modelB.provider} has a lower mean error: <span className="tabular">{comparisonB.maePp.toFixed(2)} pp</span>, compared with <span className="tabular">{comparisonA.maePp.toFixed(2)} pp</span> for {modelA.provider}.</p>
          <p className={'mt-3 ' + dataCopy}>But its ranges include only <span className="tabular">{comparisonB.coveragePct.toFixed(0)}%</span> of the outcomes, against <span className="tabular">{comparisonA.coveragePct.toFixed(0)}%</span> for A. Its mean range width is also smaller: <span className="tabular">{comparisonB.widthPp.toFixed(2)} pp</span>, against <span className="tabular">{comparisonA.widthPp.toFixed(2)} pp</span>.</p>
          <p className={'mt-3 ' + dataCopy}>B’s point estimates were closer on average, while A’s wider ranges included more outcomes. Neither result establishes a better model from two invented outcomes.</p>
        </section>
        <section className={dataPanel}>
          <h3 className="mt-3 text-lg font-bold">How one range is scored</h3>
          <p className={'mt-3 ' + dataCopy}>In the separate synthetic block <span className="tabular">{int(intervalExample.height)}</span> record, <span className="tabular">{pct(intervalExample.realisedPct!)}</span> sits between <span className="tabular">{pct(intervalExample.band95[0], 1)}</span> and <span className="tabular">{pct(intervalExample.band95[1], 1)}</span>. That counts as one outcome inside the range.</p>
          <p className={'mt-3 ' + dataCopy}>Inclusion is a yes-or-no check for each outcome. Testing a stated confidence level needs many comparable recorded forecasts, not a single inclusion or these invented pairs.</p>
        </section>
      </div>
    </DataSection>

    <DataSection title="What a measured comparison needs.">
      <p className={dataCopy}>Compare the same target and outcome definition at similar lead times. Later forecasts can use information unavailable to earlier ones.</p>
      <p className={'mt-4 ' + dataCopy}>Keep the original timestamped forecasts, source inputs and method versions. State the evaluated dates, scored count, missing forecasts and exclusion rules, including large misses.</p>
      <p className={'mt-4 ' + dataCopy}>A small or selected sample may not represent future conditions. Measured errors cannot guarantee the next forecast, a trading result or production at your fleet.</p>
    </DataSection>
    <ResearchArchiveSummary compact />
    <DataNext items={[{ href: '/research/difficulty-forecast-accuracy-2026', label: 'Read the comparison guide', note: 'Evaluate the assumptions and evidence behind a forecast claim.' }, { href: '/research/evaluating-a-forecast', label: 'Reproduce the error calculation', note: 'Inspect the full synthetic pairs, follow the arithmetic and download the CSV.' }, { href: '/methodology/difficulty-index', label: 'Assess a forecast method', note: 'See how block pace informs an estimate and what supports its range.' }, { href: '/data', label: 'Return to the data field guide', note: 'Current estimates, historical network changes and dated examples, explained.' }]} />
  </DataDetail>
}

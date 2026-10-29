import Link from '@/components/routing/SiteLink'
import { epochs, getForecastReport, scoreboard } from '@/content'
import { dateLong, int, pct } from '@/lib/format'
import { seo } from '@/lib/seo'
import { IllustrativeComparison } from './IllustrativeComparison'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'
import { DataDetail, DataFields, DataNext, DataSection, dataCopy, dataPanel } from './DataDetail'

export const metadata = seo({ title: 'How to read forecast accuracy metrics', description: 'Inspect a synthetic error profile, understand average error and interval coverage, and see which evidence a measured forecast comparison needs.', path: '/v3/data/scoreboard' })

const metrics = [
  { name: 'Mean absolute error', unit: 'pp', unitName: 'Percentage points', meaning: 'The average absolute difference between a predicted percentage change and its outcome.', check: 'Read alongside the forecast lead time and evaluation window. An average can hide individual large misses.' },
  { name: 'Interval coverage', unit: '%', unitName: 'Share of outcomes', meaning: 'The proportion of observed outcomes that fall inside the ranges published with the forecasts.', check: 'Read alongside the stated confidence level and interval width. Wide ranges can cover more outcomes without being more useful.' },
  { name: 'Interval width', unit: 'pp', unitName: 'Percentage points', meaning: 'The distance between a range’s lower and upper endpoints, summarized over the evaluated forecasts.', check: 'Read alongside coverage. A narrow range tells you little if it regularly misses the outcome.' },
  { name: 'Sample count', unit: 'n', unitName: 'Scored forecasts', meaning: 'The number of forecast–outcome pairs actually included in the comparison.', check: 'Check the dates, exclusions and missing forecasts. A small or selected sample may not represent future conditions.' },
]

export default function V3Scoreboard() {
  const intervalExample = epochs.find(epoch => epoch.height === 911232)!
  const report = getForecastReport()
  const errors = report.rows.map(row => ({ sample: row.sample, error: Math.abs(row.observed - row.forecast) }))
  const mae = errors.reduce((total, row) => total + row.error, 0) / errors.length
  const max = Math.max(...errors.map(row => row.error))
  return <DataDetail title="Read accuracy beyond the headline." summary="See what an average error summarizes, what it hides, and which evidence you need before comparing forecasts." category="Accuracy" current="scoreboard" datasetNotice={<><strong className="font-semibold text-caution">Forecast examples are synthetic.</strong> Scores and ranges use authored forecasts and outcomes. The separate observed-network report below is historical data, not scored forecasting performance.</>} crumbs={[{ name: 'Accuracy metrics', href: '/v3/data/scoreboard' }]}>
    <ResearchArchiveSummary />
    <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
      <section className="rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20 p-5 sm:p-7" aria-labelledby="sample-error-title">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 id="sample-error-title" className="text-lg font-bold">An authored error profile</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic arithmetic</span></div>
        <p className="tabular mt-5 text-[48px] font-extrabold leading-none tracking-[-0.05em] text-highlight">{mae.toFixed(2)} <span className="text-xl font-semibold">pp</span></p><p className="mt-3 text-xs leading-[1.8] text-subtle">Mean absolute error across <span className="tabular">{errors.length}</span> synthetic pairs. Sample reference: <time dateTime={report.publishedAt}>{dateLong(report.publishedAt)}</time>. This is not measured forecasting performance.</p>
        <figure className="mt-6 border-t border-white/10 pt-5"><figcaption className="text-xs font-semibold">The average hides the individual misses.</figcaption><ol className="tabular mt-4 space-y-4">{errors.map(row => <li key={row.sample}><div className="flex items-baseline justify-between gap-4 text-xs"><span className="text-subtle">{row.sample}</span><span className="font-semibold">{row.error.toFixed(2)} pp</span></div><div className="mt-2 h-1.5 rounded-full bg-ink/60" aria-hidden="true"><div className="h-full rounded-full bg-chart/70" style={{ width: `${row.error / max * 100}%` }} /></div></li>)}</ol><p className="mt-5 text-xs leading-[1.8] text-subtle">Each bar is one absolute error. Length is relative to this sample’s largest error, <span className="tabular">{max.toFixed(2)} pp</span>; it is not a probability.</p></figure>
        <Link href="/v3/research/evaluating-a-forecast#evidence" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">Inspect the forecast/outcome pairs →</Link>
      </section>
      <section className={dataPanel}><p className="text-[10px] font-bold uppercase tracking-wider text-caution">Measured comparison unavailable</p><h2 className="mt-3 text-xl font-bold tracking-tight">This sample does not rank providers.</h2><p className={'mt-4 ' + dataCopy}>The synthetic error profile demonstrates a metric. The site has no measured comparison of Doefin and other estimators, and no evidence of a forecasting advantage.</p><div className="mt-6 border-y border-white/10 py-5"><DataFields rows={[{ label: 'Measured epochs scored', value: scoreboard.epochsScored }, { label: 'Measured provider errors', value: 'Not available' }, { label: 'Measured interval coverage', value: 'Not available', note: 'The five-pair arithmetic sample does not publish interval endpoints.' }]} /></div><p className={'mt-5 ' + dataCopy}>The measured count and the synthetic sample count describe different things. Five authored rows do not become five observed epochs.</p></section>
    </div>

    <IllustrativeComparison />
    <DataSection title="Four readings, one comparison." description="Accuracy is more than one small number. Read these measures together and keep their units explicit.">
      <div className="grid gap-4 sm:grid-cols-2">{metrics.map(metric => <article key={metric.name} className={dataPanel}><div className="flex items-baseline justify-between gap-4"><h3 className="text-base font-bold">{metric.name}</h3><span className="tabular text-xl font-bold text-highlight" aria-label={metric.unitName}>{metric.unit}</span></div><p className={'mt-4 ' + dataCopy}>{metric.meaning}</p><p className="mt-4 border-t border-white/10 pt-4 text-xs leading-[1.8] text-subtle"><span className="font-bold text-body">Read it with context. </span>{metric.check}</p></article>)}</div>
    </DataSection>

    <DataSection title="A small error and a useful range are different tests."><div className="grid gap-5 lg:grid-cols-2"><section className={dataPanel}><p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Point forecast</p><h3 className="mt-3 text-lg font-bold">How far away was the prediction?</h3><p className={'mt-3 ' + dataCopy}>The forecast and outcome are percentage changes. Subtracting them gives percentage-point error. Absolute error discards the sign; it does not tell you whether a model consistently predicts too high or too low.</p><p className={'mt-3 ' + dataCopy}>A mean gives each included error equal weight. Check the individual misses and the maximum as well as the average, especially when a large miss matters more to your decision.</p></section><section className={dataPanel}><p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Interval forecast</p><h3 className="mt-3 text-lg font-bold">Did the range contain the outcome?</h3><p className={'mt-3 ' + dataCopy}>In the synthetic block <span className="tabular">{int(intervalExample.height)}</span> record, <span className="tabular">{pct(intervalExample.realisedPct!)}</span> sits between <span className="tabular">{pct(intervalExample.band95[0], 1)}</span> and <span className="tabular">{pct(intervalExample.band95[1], 1)}</span>. That is one inclusion in an authored range.</p><p className={'mt-3 ' + dataCopy}>It does not establish that a claimed confidence level is calibrated. That requires a sufficiently broad, comparable set of recorded forecasts, evaluated against the stated level with interval widths visible.</p><p className="mt-4 text-xs text-subtle">This is a synthetic example; no published per-retarget record page is available.</p></section></div></DataSection>

    <DataSection title="Check the comparison before the score." description="The same error unit does not make two tests equivalent. These details should be visible beside any measured ranking.">
      <ol className="grid gap-4 sm:grid-cols-2">{[
        ['Match the target and lead time', 'Compare forecasts of the same adjustment, frozen at comparable times. A later forecast may use information unavailable to an earlier one.'],
        ['State the window and sample', 'Give the evaluated dates, number of scored outcomes, missing forecasts and exclusion rules. Do not hide large misses by selecting the sample.'],
        ['Keep the evidence reproducible', 'Retain time-stamped forecast captures, source inputs, the method version and a verifiable outcome definition.'],
        ['Keep the claim within the test', 'Measured errors describe the evaluated sample. They do not guarantee the next forecast, a trading result or production at your fleet.'],
      ].map(([title, text], i) => <li key={title} className="flex gap-4 border-t border-white/10 pt-5"><span className="tabular text-xs font-bold text-highlight">0{i + 1}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-sm leading-[1.8] text-subtle">{text}</p></div></li>)}</ol>
    </DataSection>
    <DataNext items={[{ href: '/v3/research/difficulty-forecast-accuracy-2026', label: 'Read the comparison guide', note: 'Evaluate the assumptions and evidence behind a forecast claim.' }, { href: '/v3/research/evaluating-a-forecast', label: 'Reproduce the error calculation', note: 'Inspect the full synthetic pairs, follow the arithmetic and download the CSV.' }, { href: '/v3/methodology/difficulty-index', label: 'Inspect the methodology checklist', note: 'Look at input conventions, uncertainty and evaluation requirements.' }, { href: '/v3/data', label: 'Return to the data field guide', note: 'Difficulty, hashrate and dated records, with their meanings and context.' }]} />
  </DataDetail>
}

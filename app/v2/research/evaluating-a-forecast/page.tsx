import { Container } from '@/components/layout/Container'
import { Eyebrow, DataTable } from '@/components/ui'
import { ResearchUpdates } from '@/components/preview/ResearchUpdates'
import { PageIntro, RelatedContent, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { getForecastReport } from '@/content'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('How to evaluate a difficulty forecast', 'Inspect a synthetic evidence table, reproduce the error calculation and download the sample dataset.', preview.report)

export default function ReportPreview() {
  const report = getForecastReport()
  const mae = report.rows.reduce((sum, row) => sum + Math.abs(row.observed - row.forecast), 0) / report.rows.length
  return <>
    <PageIntro section="Data & Research / Report" title={report.title} description={report.description}>
      <p className="text-xs text-subtle">Research format preview · <time dateTime={report.publishedAt}>17 September 2026</time></p>
      <p className="mt-3 text-xs font-semibold text-caution">{report.classification}</p>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className={panelClass}><Eyebrow>Research summary</Eyebrow><h2 className={headingClass}>Make the forecast accountable to the outcome.</h2><p className="mt-5 text-[17px] leading-[1.8] text-subtle">{report.summary}</p></div>
        <dl className={panelClass}><dt className="text-sm text-subtle">Mean absolute error in this synthetic sample</dt><dd className="tabular mt-4 text-4xl font-extrabold text-highlight">{mae.toFixed(2)} <span className="text-xl">pp</span></dd><dt className="mt-6 text-sm text-subtle">Observations</dt><dd className="tabular mt-2 text-2xl font-bold">{report.rows.length} synthetic pairs</dd><dd className="mt-4 text-xs leading-relaxed text-subtle">pp = percentage points. This figure is a calculation example, not a measured accuracy claim.</dd></dl>
      </section>
      <section className="mt-14"><h2 className={headingClass}>What to look for in a report.</h2><div className="mt-7 grid gap-5 md:grid-cols-3">{report.findings.map((item, i) => <article key={item.title} className={panelClass}><span className="tabular text-sm font-bold text-highlight">0{i + 1}</span><h3 className="mt-4 text-lg font-bold">{item.title}</h3><p className="mt-3 text-sm leading-[1.75] text-subtle">{item.body}</p></article>)}</div></section>
      <section id="evidence" className="mt-14 scroll-mt-36">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-5"><div><Eyebrow>The evidence</Eyebrow><h2 className={headingClass}>Every row behind the result.</h2></div><a href={preview.report + '/sample.csv'} download="doefin-synthetic-forecast-sample.csv" className="rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-highlight hover:border-brand/50">Download sample CSV ↓</a></div>
        <DataTable caption="Synthetic difficulty changes · sample prepared 17 September 2026" head={['Observation', 'Forecast change (%)', 'Example outcome (%)', 'Absolute error (pp)']} rows={report.rows.map(row => [row.sample, row.forecast.toFixed(1), row.observed.toFixed(1), Math.abs(row.observed - row.forecast).toFixed(1)])} />
      </section>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className={panelClass}><h2 className="text-xl font-bold">Method</h2><ol className="mt-5 list-decimal space-y-3 pl-5 text-sm leading-[1.75] text-subtle"><li>Use the same difficulty-change definition for forecast and outcome.</li><li>For each pair, subtract forecast from outcome and take the absolute value.</li><li>Sum the absolute errors and divide by the number of observations.</li></ol><p className="tabular mt-5 rounded-lg bg-ink/60 p-4 text-sm leading-relaxed">({report.rows.map(row => Math.abs(row.observed - row.forecast).toFixed(1)).join(' + ')}) ÷ {report.rows.length} = {mae.toFixed(2)} pp</p></section>
        <section className={panelClass}><h2 className="text-xl font-bold">Limits and provenance</h2><p className="mt-4 text-sm leading-[1.75] text-subtle">All five pairs were authored for this website prototype. There is no live model, observation period or historical source behind them.</p><p className="mt-4 text-sm leading-[1.75] text-subtle">A real report would include forecast timestamps, observation heights, model version, an unedited evaluation window and a comparison baseline. This sample does not assess uncertainty intervals or performance across market conditions.</p><p className="mt-4 text-xs font-semibold text-caution">Evidence classification: illustrative fixture</p></section>
      </div>
      <div className="mt-12"><ResearchUpdates /></div>
      <RelatedContent {...report.related} />
    </Container>
  </>
}

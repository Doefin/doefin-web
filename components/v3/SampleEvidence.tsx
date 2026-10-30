import Link from '@/components/routing/SiteLink'
import { DataTable } from '@/components/ui'
import { getForecastReport } from '@/content'

export function SampleEvidence() {
  const report = getForecastReport()
  const mae = report.rows.reduce((sum, row) => sum + Math.abs(row.observed - row.forecast), 0) / report.rows.length
  return <section className="mt-9">
    <h2 className="text-2xl font-bold">Reproduce the example</h2>
    <p className="mt-4 text-[16px] leading-relaxed text-subtle">These {report.rows.length} synthetic pairs have a mean absolute error of {mae.toFixed(2)} percentage points. Sample reference date: <time dateTime={report.publishedAt}>17 September 2026</time>. This is an arithmetic example, not measured forecasting performance.</p>
    <div className="mt-6"><DataTable caption="Synthetic difficulty-change pairs · 17 September 2026 · changes in %, errors in percentage points" head={['Sample', 'Forecast (%)', 'Example outcome (%)', 'Absolute error (pp)']} rows={report.rows.map(row => [row.sample, row.forecast.toFixed(1), row.observed.toFixed(1), Math.abs(row.observed - row.forecast).toFixed(1)])} /></div>
    <p className="mt-4 text-sm leading-relaxed text-subtle">Subtract the forecast from the example outcome, take the absolute value, then average those errors. No observations were collected from a network or forecaster for this dataset.</p>
    <Link href="/research/evaluating-a-forecast/sample.csv" prefetch={false} download="doefin-synthetic-forecast-sample.csv" className="mt-5 inline-flex min-h-11 items-center rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-highlight hover:border-brand/50">Download the sample CSV ↓</Link>
  </section>
}

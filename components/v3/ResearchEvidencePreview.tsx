import Link from '@/components/routing/SiteLink'
import { getForecastReport } from '@/content'
import { dateShort } from '@/lib/format'
import { Arrow } from './Arrow'

/** One pair previews the task; the full dataset and arithmetic live in the example. */
export function ResearchEvidencePreview() {
  const sample = getForecastReport()
  const pair = sample.rows[0]
  const error = Math.abs(pair.observed - pair.forecast)

  return <article aria-labelledby="example-preview-title" className="flex min-w-0 flex-col overflow-hidden rounded-panel border border-white/10 bg-surfaceAlt/35">
    <div className="p-5 sm:p-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-highlight">The calculation</p>
      <h2 id="example-preview-title" className="mt-5 text-balance text-[25px] font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl">Calculate forecast error.</h2>
      <p className="mt-4 text-sm leading-relaxed text-subtle">Follow the arithmetic over {sample.rows.length} synthetic forecast/outcome pairs. Check each error, reproduce their mean and download the CSV.</p>
      <Link href="/v3/research/evaluating-a-forecast" className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border border-brand/40 bg-brand/10 px-4 text-sm font-bold text-highlight transition-colors hover:border-brand/70 hover:bg-brand/20">Work through the calculation <Arrow className="h-4 w-4" /></Link>
    </div>
    <div className="mt-auto border-t border-white/10 bg-ink/35 p-5 sm:px-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-subtle">One synthetic pair</p>
      <p className="tabular mt-3 text-xl font-bold tracking-tight text-highlight">|{pair.observed.toFixed(1)}% − {pair.forecast.toFixed(1)}%| = {error.toFixed(1)} pp</p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">Absolute difference between example outcome and forecast. pp = percentage points.</p>
      <p className="mt-3 text-[11px] leading-relaxed text-subtle">Sample prepared <time dateTime={sample.publishedAt}>{dateShort(sample.publishedAt)}</time>. Authored values, not captured forecasts.</p>
    </div>
  </article>
}

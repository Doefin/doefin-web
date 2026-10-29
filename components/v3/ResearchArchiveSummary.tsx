import Link from '@/components/routing/SiteLink'
import { researchBase, researchCapture, researchSummary } from '@/lib/research-data'

/** Actual observations and forecast examples deliberately never share a count. */
export function ResearchArchiveSummary() {
  return <section aria-labelledby="observed-research-title" className="my-9 rounded-panel border border-white/10 bg-surface/25 p-5 sm:p-7">
    <p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Observed network research · v{researchCapture.version}</p>
    <h2 id="observed-research-title" className="mt-3 text-xl font-bold">{researchSummary.count} difficulty adjustments you can inspect.</h2>
    <p className="mt-3 max-w-3xl text-sm leading-[1.8] text-subtle">From {researchSummary.firstDate.slice(0, 10)} to {researchSummary.lastDate.slice(0, 10)}, the captured observations contain {researchSummary.increases} increases and {researchSummary.decreases} decreases. Mean absolute difficulty change: {researchSummary.meanAbsoluteChangePct.toFixed(2)}%. This is historical network movement, separate from forecast error and the synthetic examples below.</p>
    <p className="mt-3 text-xs leading-[1.8] text-subtle">Source: mempool.space, captured {researchCapture.capturedAt.slice(0, 10)}. Frozen one-year source window; no claim of live coverage or independent node verification.</p>
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-highlight">
      <Link href="/v3/research/observed-difficulty-adjustments" className="inline-flex min-h-11 items-center hover:underline">Read findings and method →</Link>
      <a href={researchBase + '/dataset?format=csv'} className="inline-flex min-h-11 items-center hover:underline">Download observed CSV</a>
      <a href={researchBase} className="inline-flex min-h-11 items-center hover:underline">Free API and citation manifest</a>
    </div>
    <details id="prospective-archive" className="mt-4 border-t border-white/10 pt-2"><summary className="cursor-pointer py-3 text-xs font-semibold">Prospective forecast archive: no published records</summary><p className="max-w-3xl text-xs leading-[1.8] text-subtle">The prototype’s dated forecasts and scoreboard are illustrative. It has no captured provider predictions, independently timestamped publication receipts or market-listing receipts. Observed adjustments are not scored forecasts.</p><a className="inline-flex min-h-11 items-center text-xs font-semibold text-highlight hover:underline" href={researchBase + '/forecasts'}>Inspect the archive status →</a></details>
  </section>
}

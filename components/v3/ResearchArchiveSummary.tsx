import Link from '@/components/routing/SiteLink'
import { researchBase, researchCapture, researchSummary } from '@/lib/research-data'

/** Actual observations and forecast examples deliberately never share a count. */
export function ResearchArchiveSummary({ compact = false }: { compact?: boolean } = {}) {
  return <section aria-labelledby="observed-research-title" className="my-9 rounded-panel border border-white/10 bg-surface/25 p-5 sm:p-7">
    <p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Observed network research · v{researchCapture.version}</p>
    <h2 id="observed-research-title" className="mt-3 text-xl font-bold">{compact ? 'Download and cite the dataset.' : <>{researchSummary.count} recorded difficulty adjustments.</>}</h2>
    {!compact && <p className="mt-3 max-w-3xl text-sm leading-[1.8] text-subtle">From {researchSummary.firstDate.slice(0, 10)} to {researchSummary.lastDate.slice(0, 10)}, the dataset records {researchSummary.increases} increases and {researchSummary.decreases} decreases. Mean absolute difficulty change: {researchSummary.meanAbsoluteChangePct.toFixed(2)}%. These are historical network changes, not forecast errors.</p>}
    <p className="mt-3 text-xs leading-[1.8] text-subtle">Source: mempool.space, captured {researchCapture.capturedAt.slice(0, 10)}. {!compact && <>This is a fixed one-year snapshot, not a live feed. No independent check against a Bitcoin node is documented.</>}</p>
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs font-semibold text-highlight">
      {!compact && <Link href="/research/observed-difficulty-adjustments" className="inline-flex min-h-11 items-center hover:underline">Read findings and method →</Link>}
      <a href={researchBase + '/dataset?format=csv'} className="inline-flex min-h-11 items-center hover:underline">Download observed CSV</a>
      <a href={researchBase} className="inline-flex min-h-11 items-center hover:underline">Free API and citation manifest</a>
    </div>
    <details id="prospective-archive" className="mt-4 border-t border-white/10 pt-2"><summary className="cursor-pointer py-3 text-xs font-semibold">{compact ? 'Inspect the forecast archive status' : 'Forecast archive: no published predictions'}</summary>{!compact && <p className="max-w-3xl text-xs leading-[1.8] text-subtle">The archive contains no captured provider predictions or independent timestamps proving publication before an outcome or market listing. Dated forecast examples elsewhere on this site use made-up values.</p>}<a className="inline-flex min-h-11 items-center text-xs font-semibold text-highlight hover:underline" href={researchBase + '/forecasts'}>Inspect the archive status →</a></details>
  </section>
}

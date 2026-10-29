import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { epochs } from '@/content'
import { getCurrentHashrate, getDifficultyAnalytics } from '@/lib/bitcoin-analytics'
import { dateShort, int, pct } from '@/lib/format'
import { seo } from '@/lib/seo'
import { Arrow } from './Arrow'
import { DifficultyReadingPanel, HashrateReadingPanel } from './data-reading'
import styles from './data-reading.module.css'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'

export const metadata = seo({ title: 'Bitcoin mining data, explained', description: 'Read current Bitcoin difficulty and hashrate estimates beside sourced historical observations and clearly labelled teaching examples.', path: '/v3/data' })
export const dynamic = 'force-dynamic'

export default async function V3DataIndex() {
  const [difficultyResult, hashrateResult] = await Promise.all([getDifficultyAnalytics(), getCurrentHashrate()])
  return <Container className="pb-16 pt-5 sm:pb-20 sm:pt-10">
    <div className="hidden sm:block"><Breadcrumbs items={[{ name: 'Resources', href: '/v3/resources' }, { name: 'Data', href: '/v3/data' }]} /></div>
    <header className="mt-2 grid gap-4 sm:mt-9 sm:gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-highlight">The data field guide</p>
        <h1 className="mt-3 max-w-2xl text-balance sm:mt-4 text-[34px] font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-[52px]">Bitcoin mining data,<br className="hidden sm:block" /> explained.</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-subtle sm:mt-5 sm:text-base">Read difficulty, hashrate and forecast accuracy in context.</p>
      </div>
      <div className="border-l-2 border-caution/50 pl-4 lg:mb-1">
        <p className="max-w-sm text-xs leading-[1.8] text-subtle"><strong className="font-bold text-highlight">Separate live readings from examples.</strong> Current difficulty and hashrate come from the backend API. Forecast ranges and dated learning examples are synthetic and do not establish performance.</p>
      </div>
    </header>

    <nav aria-label="On this page" className="mb-6 mt-5 flex flex-wrap gap-2 sm:mb-8 sm:mt-9">
      {[['Difficulty guide', '/v3/data/difficulty'], ['Hashrate guide', '/v3/data/hashrate'], ['Dated records', '#sample-records']].map(([label, href]) => <a key={href} href={href} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-subtle hover:border-brand/40 hover:text-highlight">{label}<span aria-hidden="true">{href.startsWith('#') ? '↓' : '→'}</span></a>)}
    </nav>

    <ResearchArchiveSummary />

    <section id="read-the-numbers" aria-label="Current backend readings" className="grid scroll-mt-28 gap-5 lg:grid-cols-2">
      <DifficultyReadingPanel result={difficultyResult} />
      <HashrateReadingPanel result={hashrateResult} />
    </section>

    <section id="sample-records" aria-labelledby="sample-records-title" className="mt-12 scroll-mt-28 sm:mt-16">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-end sm:gap-12">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-highlight">Backend forecast archive</p><h2 id="sample-records-title" className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">No published retarget forecast records.</h2></div>
        <p className="max-w-xl text-sm leading-[1.8] text-subtle">The backend exposes a current point estimate, but no endpoint for published forecast records or their ranges and outcomes. No per-retarget pages are linked until those records are available.</p>
      </div>
      <p role="status" className="mt-6 rounded-panel border border-white/10 bg-surface/15 p-5 text-sm leading-relaxed text-subtle">Published forecast records: 0 available from the current API contract. The dated rows below are a separate synthetic teaching illustration.</p>
      <details className="mt-5 rounded-panel border border-white/10 bg-surface/15">
        <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-highlight">Show {epochs.length} synthetic example rows (not published records)</summary>
      <div className="mt-6 overflow-hidden rounded-panel border border-white/10 bg-surface/15">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-5 py-4 sm:px-6"><p className="text-xs font-semibold text-caution">Synthetic dated records</p><p className="text-xs text-subtle">Changes in % · dates belong to the examples</p></div>
        <table className={`${styles.records} w-full text-left text-sm`}>
          <caption className="sr-only">Three synthetic difficulty records. Forecast reference dates, forecast changes and authored outcomes; no measured history.</caption>
          <thead className="bg-ink/25 text-[11px] uppercase tracking-wider text-subtle"><tr><th scope="col">Target block</th><th scope="col">Forecast date</th><th scope="col">Forecast</th><th scope="col">Outcome</th><th scope="col">Outcome date</th></tr></thead>
          <tbody>{epochs.map(epoch => <tr key={epoch.height}>
            <th scope="row" className="tabular"><span className="sm:hidden">Block </span>{int(epoch.height)}</th>
            <td><span className={styles.mobileLabel}>Forecast date</span><time dateTime={epoch.startedAt}>{dateShort(epoch.startedAt)}</time></td>
            <td><span className={styles.mobileLabel}>Forecast</span>{pct(epoch.forecastPct)}</td>
            <td><span className={styles.mobileLabel}>Outcome</span>{epoch.realisedPct === undefined ? <span className="text-subtle">Not included</span> : pct(epoch.realisedPct)}</td>
            <td><span className={styles.mobileLabel}>Outcome date</span>{epoch.settledAt ? <time dateTime={epoch.settledAt}>{dateShort(epoch.settledAt)}</time> : <span className="text-subtle">—</span>}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="mx-5 mb-5 mt-4 max-w-3xl text-xs leading-relaxed text-subtle">“Not included” means the teaching example has no outcome. It does not describe a pending live adjustment. These rows have no matching per-retarget route.</p>
      </details>
    </section>

    <section id="accuracy" aria-labelledby="accuracy-title" className="mt-12 grid scroll-mt-28 gap-7 rounded-panel border border-white/10 bg-surfaceAlt/30 p-6 sm:mt-14 sm:p-8 md:grid-cols-[1fr_1fr] md:gap-14">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-highlight">Read accuracy with care</p><h2 id="accuracy-title" className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">A smaller error needs<br className="hidden sm:block" /> a bigger explanation.</h2><p className="mt-4 max-w-md text-sm leading-[1.8] text-subtle">The units, sample count and evaluation window matter. An average alone cannot tell you which forecast to trust.</p><Link href="/v3/data/scoreboard" className="mt-5 inline-flex min-h-11 items-center gap-4 text-sm font-bold text-highlight hover:underline">Read the accuracy metrics<Arrow /></Link></div>
      <div className="border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"><p className="text-sm font-bold">Want to check the workings?</p><p className="mt-3 text-sm leading-[1.8] text-subtle">Research shows how to evaluate a forecast comparison and reproduce error calculations from a downloadable sample.</p><Link href="/v3/research" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-highlight hover:underline">Go to Research<Arrow className="h-4 w-4" /></Link><Link href="/v3/methodology/difficulty-index" className="mt-1 block w-fit py-2 text-xs font-semibold text-subtle underline decoration-white/20 underline-offset-4 hover:text-highlight">Inspect inputs and methodology</Link></div>
    </section>
  </Container>
}

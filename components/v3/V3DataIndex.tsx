import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { epochs, hashrate } from '@/content'
import { dateShort, int, pct } from '@/lib/format'
import { seo } from '@/lib/seo'
import { Arrow } from './Arrow'
import { DifficultyReadingPanel } from './data-reading'
import styles from './data-reading.module.css'

export const metadata = seo({ title: 'Bitcoin mining data, explained', description: 'Read difficulty forecasts, hashrate estimates and dated records using clearly labelled synthetic examples.', path: '/v3/data' })

export default function V3DataIndex() {
  return <Container className="pb-16 pt-5 sm:pb-20 sm:pt-10">
    <div className="hidden sm:block"><Breadcrumbs items={[{ name: 'Resources', href: '/v3/resources' }, { name: 'Data', href: '/v3/data' }]} /></div>
    <header className="mt-2 grid gap-4 sm:mt-9 sm:gap-6 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-highlight">The data field guide</p>
        <h1 className="mt-3 max-w-2xl text-balance sm:mt-4 text-[34px] font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-[52px]">Bitcoin mining data,<br className="hidden sm:block" /> explained.</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.75] text-subtle sm:mt-5 sm:text-base">Read difficulty, hashrate and forecast accuracy in context.</p>
      </div>
      <div className="border-l-2 border-caution/50 pl-4 lg:mb-1">
        <p className="max-w-sm text-xs leading-[1.8] text-subtle"><strong className="font-bold text-caution">Synthetic learning dataset.</strong> Values and records are authored examples, not current network data or measured performance.</p>
      </div>
    </header>

    <nav aria-label="On this page" className="mb-6 mt-5 flex flex-wrap gap-2 sm:mb-8 sm:mt-9">
      {[['Difficulty guide', '/v3/data/difficulty'], ['Hashrate guide', '/v3/data/hashrate'], ['Dated records', '#sample-records']].map(([label, href]) => <a key={href} href={href} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-subtle hover:border-brand/40 hover:text-highlight">{label}<span aria-hidden="true">{href.startsWith('#') ? '↓' : '→'}</span></a>)}
    </nav>

    <section id="read-the-numbers" aria-label="Read the example numbers" className="grid scroll-mt-28 gap-5 lg:grid-cols-[1.75fr_1fr]">
      <DifficultyReadingPanel />
      <article className="flex flex-col rounded-panel border border-white/10 bg-surface/25 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Network hashrate</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic</span></div>
        <p className="mt-7 text-xs text-subtle">An inferred rate, not a machine count</p>
        <p className="tabular mt-2 text-[52px] font-extrabold leading-none tracking-[-0.055em]">{int(hashrate.currentEH)} <span className="text-xl font-semibold tracking-tight text-subtle">EH/s</span></p>
        <p className="mt-3 text-xs leading-relaxed text-subtle">Exahashes per second · sample reference block <span className="tabular text-body">{int(hashrate.asOfHeight)}</span></p>
        <div className="mb-6 mt-7 border-y border-white/10 py-5">
          <h3 className="text-sm font-bold">The window changes the reading.</h3>
          <p className="mt-2 text-sm leading-[1.8] text-subtle">Hashrate is inferred from difficulty and block timing. Short and long observation windows can disagree even without a change in mining machines.</p>
          <p className="mt-3 text-xs leading-relaxed text-subtle">No observation window or measured uncertainty is established for this synthetic value.</p>
        </div>
        <Link href="/v3/data/hashrate" className="mt-auto inline-flex min-h-11 items-center justify-between gap-4 text-sm font-bold text-highlight hover:underline">Read the hashrate example<Arrow /></Link>
      </article>
    </section>

    <section id="sample-records" aria-labelledby="sample-records-title" className="mt-12 scroll-mt-28 sm:mt-16">
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr] sm:items-end sm:gap-12">
        <div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-highlight">Inspect the dataset</p><h2 id="sample-records-title" className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">A forecast and its later outcome.</h2></div>
        <p className="max-w-xl text-sm leading-[1.8] text-subtle">Open a record to see the range, dates and error calculation. These <span className="tabular">{epochs.length}</span> authored examples demonstrate a record’s structure; they are not a verified history or an immutable archive.</p>
      </div>
      <div className="mt-6 overflow-hidden rounded-panel border border-white/10 bg-surface/15">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-white/10 px-5 py-4 sm:px-6"><p className="text-xs font-semibold text-caution">Synthetic dated records</p><p className="text-xs text-subtle">Changes in % · dates belong to the examples</p></div>
        <table className={`${styles.records} w-full text-left text-sm`}>
          <caption className="sr-only">Three synthetic difficulty records. Forecast reference dates, forecast changes and authored outcomes; no measured history.</caption>
          <thead className="bg-ink/25 text-[11px] uppercase tracking-wider text-subtle"><tr><th scope="col">Target block</th><th scope="col">Forecast date</th><th scope="col">Forecast</th><th scope="col">Outcome</th><th scope="col">Outcome date</th></tr></thead>
          <tbody>{epochs.map(epoch => <tr key={epoch.height}>
            <th scope="row"><Link href={'/v3/data/difficulty/epoch/' + epoch.height} className="inline-flex min-h-10 items-center gap-3 font-bold text-highlight hover:underline"><span className="sm:hidden">Block </span>{int(epoch.height)}<Arrow className="h-4 w-4" /></Link></th>
            <td><span className={styles.mobileLabel}>Forecast date</span><time dateTime={epoch.startedAt}>{dateShort(epoch.startedAt)}</time></td>
            <td><span className={styles.mobileLabel}>Forecast</span>{pct(epoch.forecastPct)}</td>
            <td><span className={styles.mobileLabel}>Outcome</span>{epoch.realisedPct === undefined ? <span className="text-subtle">Not included</span> : pct(epoch.realisedPct)}</td>
            <td><span className={styles.mobileLabel}>Outcome date</span>{epoch.settledAt ? <time dateTime={epoch.settledAt}>{dateShort(epoch.settledAt)}</time> : <span className="text-subtle">—</span>}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-xs leading-relaxed text-subtle">“Not included” means the example contains no outcome. It does not describe a pending live adjustment. Each record is independent of the difficulty specimen above.</p>
    </section>

    <section id="accuracy" aria-labelledby="accuracy-title" className="mt-12 grid scroll-mt-28 gap-7 rounded-panel border border-white/10 bg-surfaceAlt/30 p-6 sm:mt-14 sm:p-8 md:grid-cols-[1fr_1fr] md:gap-14">
      <div><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-highlight">Read accuracy with care</p><h2 id="accuracy-title" className="mt-3 text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl">A smaller error needs<br className="hidden sm:block" /> a bigger explanation.</h2><p className="mt-4 max-w-md text-sm leading-[1.8] text-subtle">The units, sample count and evaluation window matter. An average alone cannot tell you which forecast to trust.</p><Link href="/v3/data/scoreboard" className="mt-5 inline-flex min-h-11 items-center gap-4 text-sm font-bold text-highlight hover:underline">Read the accuracy metrics<Arrow /></Link></div>
      <div className="border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0"><p className="text-sm font-bold">Want to check the workings?</p><p className="mt-3 text-sm leading-[1.8] text-subtle">Research shows how to evaluate a forecast comparison and reproduce error calculations from a downloadable sample.</p><Link href="/v3/research" className="mt-4 inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-highlight hover:underline">Go to Research<Arrow className="h-4 w-4" /></Link><Link href="/v3/methodology/difficulty-index" className="mt-1 block w-fit py-2 text-xs font-semibold text-subtle underline decoration-white/20 underline-offset-4 hover:text-highlight">Inspect inputs and methodology</Link></div>
    </section>
  </Container>
}

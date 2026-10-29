import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'
import { ResearchEvidencePreview } from './ResearchEvidencePreview'
import { allV3Reports } from '@/content'
import { dateShort } from '@/lib/format'
import { seo, jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'

export const metadata = seo({ title: 'Research on Bitcoin mining difficulty', description: 'Explore sample research and worked examples on Bitcoin mining difficulty, forecast accuracy and mining economics.', path: '/v3/research' })

/** Keep prototype research honest without changing the original comparison site. */
export default async function ResearchIndex() {
  const reports = await allV3Reports()
  return <Container className="pb-14 pt-7 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Doefin research examples',
      itemListElement: [...reports.map(report => ({ name: report.title, url: `${site.url}/v3/research/${report.slug}` })), { name: 'Evaluate a difficulty forecast', url: `${site.url}/v3/research/evaluating-a-forecast` }].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
    }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Resources', href: '/v3/resources' }, { name: 'Research', href: '/v3/research' }]} /></div>
    <header className="mb-7 mt-2 sm:mb-9 sm:mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-highlight">Doefin / Research</p>
      <h1 className="mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Evaluate a difficulty forecast.</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-subtle">Check a forecast comparison. Reproduce the error calculation.</p>
      <p className="mt-5 max-w-3xl border-l-2 border-caution/60 pl-3 text-xs leading-relaxed text-subtle"><span className="font-semibold text-caution">Educational research.</span> Forecast examples are synthetic. A separate sourced network dataset is available; it does not rank providers.</p>
    </header>

    <ResearchArchiveSummary />
    {reports.length === 0 ? <p role="status" className="rounded-panel border border-white/10 bg-surface/30 p-6 text-sm text-subtle">No published research reports are available yet.</p> : <div className="grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="min-w-0 space-y-6">{reports.map(report => <article key={report.slug} className="flex flex-col overflow-hidden rounded-panel border border-white/10 bg-surface/30">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-highlight">{report.slug === 'observed-difficulty-adjustments' ? 'Observed network analysis' : 'Comparison criteria'}</p><p className="text-[11px] text-subtle">Published <time dateTime={report.publishedAt}>{dateShort(report.publishedAt)}</time></p></div>
          <h2 className="mt-5 text-balance text-[25px] font-extrabold leading-tight tracking-[-0.03em] sm:text-3xl"><Link href={'/v3/research/' + report.slug} className="hover:text-highlight">{report.title}</Link></h2>
          <p className="mt-4 text-sm leading-relaxed text-subtle">{report.summary}</p>
          <Link href={'/v3/research/' + report.slug} className="mt-5 inline-flex min-h-11 items-center justify-center gap-3 rounded-lg bg-brand px-4 text-sm font-bold text-white transition-colors hover:bg-brandDeep">{report.slug === 'observed-difficulty-adjustments' ? 'Read observed findings' : 'Read the comparison criteria'} <Arrow className="h-4 w-4" /></Link>
        </div>
        <div className="mt-auto border-t border-white/10 bg-ink/35 px-5 py-5 sm:px-7">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">Use this to check</h3>
          <ul className="mt-4 space-y-3">{(report.slug === 'observed-difficulty-adjustments' ? ['A defined observation window', 'The source data and arithmetic', 'Versioned public downloads and citation'] : ['The same target and forecast timing', 'Error and uncertainty as separate measures', 'A reproducible evidence record']).map(item => <li key={item} className="flex items-baseline gap-3 text-xs leading-relaxed text-body"><span aria-hidden="true" className="h-1 w-1 shrink-0 self-center rounded-full bg-chart" />{item}</li>)}</ul>
        </div>
      </article>)}
      </div>
      <ResearchEvidencePreview />
    </div>}

    <section aria-labelledby="research-sources-title" className="mt-10 border-t border-white/10 pt-7 sm:mt-12">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-2"><h2 id="research-sources-title" className="text-xl font-bold tracking-tight">Check the supporting method and data.</h2><Link href="/v3/resources" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight hover:underline">All resources <Arrow className="h-4 w-4" /></Link></div>
      <div className="grid gap-4 md:grid-cols-3">{[
        { label: 'The method', title: 'How is a forecast built?', description: 'Inspect the inputs, calculation and requirements for an uncertainty interval.', href: '/v3/methodology/difficulty-index', action: 'Read the methodology' },
        { label: 'The context', title: 'What does the data mean?', description: 'Read example difficulty, hashrate and dated records with their assumptions visible.', href: '/v3/data', action: 'Explore data examples' },
        { label: 'The comparison', title: 'How should accuracy be read?', description: 'Understand error, coverage, interval width and sample count before comparing forecasts.', href: '/v3/data/scoreboard', action: 'Read accuracy metrics' },
      ].map(item => <Link key={item.href} href={item.href} className="group flex flex-col rounded-panel border border-white/[0.07] bg-surface/20 p-5 transition-colors hover:border-brand/40"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">{item.label}</p><h3 className="mt-3 text-lg font-bold tracking-tight group-hover:text-highlight">{item.title}</h3><p className="mb-4 mt-2 text-xs leading-relaxed text-subtle">{item.description}</p><span className="mt-auto inline-flex min-h-8 items-center justify-between gap-3 text-xs font-semibold text-highlight">{item.action}<Arrow className="h-4 w-4" /></span></Link>)}</div>
    </section>
  </Container>
}

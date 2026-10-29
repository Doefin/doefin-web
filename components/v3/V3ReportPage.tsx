import { notFound } from 'next/navigation'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { getV3Report } from '@/content'
import { v3Reports } from '@/content/v3-research'
import { dateShort } from '@/lib/format'
import { seo, jsonLd, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import styles from './article-reading.module.css'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'
import { NewsletterDelivery } from './NewsletterDelivery'
import { researchBase } from '@/lib/research-data'

// Stable route inventory remains source-defined; all public report fields are CMS-only.
export const generateStaticParams = () => v3Reports.map(report => ({ slug: report.slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const report = await getV3Report((await params).slug)
  return report ? seo({ title: report.title, description: report.seoSummary ?? report.summary, path: '/v3/research/' + report.slug, type: 'article', publishedTime: report.publishedAt }) : {}
}

export default async function V3ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const report = await getV3Report((await params).slug)
  if (!report) notFound()
  const observed = report.slug === 'observed-difficulty-adjustments'
  return <Container className="pb-14 pt-6 sm:pt-9">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: report.title, description: report.summary, datePublished: report.publishedAt, publisher: publisherRef, mainEntityOfPage: `${site.url}/v3/research/${report.slug}` }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Research', href: '/v3/research' }, { name: report.title, href: '/v3/research/' + report.slug }]} /></div>
    <header className="mt-2 border-b border-white/10 pb-7 sm:mt-6 sm:pb-9">
      <Link href="/v3/research" className="mb-4 inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-highlight hover:underline"><span aria-hidden>←</span> All evaluation guides</Link>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight">{observed ? 'Observed network research' : 'Comparison criteria'}</p>
      <h1 className="mt-3 max-w-3xl text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-[42px]">{report.title}</h1>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-body">{observed ? 'Inspect the findings, provenance and full dataset without signing up.' : 'Use these criteria to check target, timing, error and evidence before comparing difficulty forecasts.'}</p>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-subtle">{report.summary}</p>
      <p className="mt-5 text-[11px] text-subtle">{observed ? 'Observed network report' : 'Educational comparison guide'} · Published <time dateTime={report.publishedAt}>{dateShort(report.publishedAt)}</time></p>
    </header>
    <div className="mt-7 grid items-start gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Comparison criteria sections" className="hidden lg:sticky lg:top-28 lg:block"><p className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">Check before comparing</p><ol className="space-y-2">{report.sections.map((section, i) => <li key={section.id}><a href={'#' + section.id} className="flex min-h-11 gap-3 py-2 text-xs leading-relaxed text-subtle hover:text-highlight"><span className="tabular text-[10px] text-highlight">{String(i + 1).padStart(2, '0')}</span>{section.heading}</a></li>)}</ol></nav>
      <div className="min-w-0 max-w-[44rem]">
        <article aria-label={report.title} className={styles.reading}><AutoLinkedProse paragraphs={report.sections.flatMap(section => [{ heading: section.heading, id: section.id }, ...section.paragraphs])} /></article>
        {observed && <><ResearchArchiveSummary /><NewsletterDelivery kind="report" /><nav aria-label="Observed report downloads" className="flex flex-wrap gap-5 text-sm font-semibold text-highlight"><a className="inline-flex min-h-11 items-center underline" href={researchBase + '/report'}>Open printable report</a><a className="inline-flex min-h-11 items-center underline" href={researchBase + '/dataset?format=json'}>Download observed JSON</a><a className="inline-flex min-h-11 items-center underline" href={researchBase + '/source'}>Inspect exact source capture</a></nav></>}
        <section aria-labelledby="report-next-title" className="mt-9 rounded-panel border border-brand/25 bg-brand/5 p-5 sm:p-6"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-highlight">Apply the criteria</p><h2 id="report-next-title" className="mt-3 text-xl font-bold tracking-tight">Put the error calculation into numbers.</h2><p className="mt-3 text-sm leading-relaxed text-subtle">Work through five synthetic pairs, reproduce each absolute error and their mean, and download the CSV to check the arithmetic yourself.</p><Link href="/v3/research/evaluating-a-forecast" className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-lg bg-brand px-4 text-xs font-bold text-white hover:bg-brandDeep">Calculate forecast error <Arrow className="h-4 w-4" /></Link></section>
        <nav aria-label="Further evaluation resources" className="mt-7 border-t border-white/10 pt-5"><ul className="space-y-2"><li><Link href="/v3/methodology/difficulty-index" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight hover:underline">Inspect the forecast methodology <Arrow className="h-4 w-4" /></Link></li><li><Link href="/v3/data/scoreboard" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight hover:underline">Read accuracy metrics <Arrow className="h-4 w-4" /></Link></li></ul></nav>
      </div>
    </div>
  </Container>
}

import { notFound } from 'next/navigation'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { allV3Reports, getV3Report } from '@/content'
import { seo, jsonLd, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContentLinks, ContentPage } from './ContentPage'
import { SampleEvidence } from './SampleEvidence'

export const generateStaticParams = () => allV3Reports().map(report => ({ slug: report.slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const report = getV3Report((await params).slug)
  return report ? seo({ title: report.title, description: report.summary, path: '/v3/research/' + report.slug, type: 'article', publishedTime: report.publishedAt }) : {}
}

export default async function V3ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const report = getV3Report((await params).slug)
  if (!report) notFound()
  return <ContentPage title={report.title} summary={report.summary} eyebrow="Worked research example" crumbs={[{ name: 'Research', href: '/v3/research' }, { name: report.title, href: '/v3/research/' + report.slug }]}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: report.title, description: report.summary, datePublished: report.publishedAt, publisher: publisherRef, mainEntityOfPage: `${site.url}/v3/research/${report.slug}` })} />
    <p className="mb-8 text-sm font-semibold text-caution">Synthetic example · <time dateTime={report.publishedAt}>19 October 2026</time></p>
    <AutoLinkedProse paragraphs={report.sections.flatMap(section => [{ heading: section.heading }, ...section.paragraphs])} />
    <SampleEvidence />
    <ContentLinks links={[{ href: '/v3/methodology/difficulty-index', label: 'How to evaluate a forecasting method' }, { href: '/v3/data/scoreboard', label: 'Understand the sample accuracy comparison' }, { href: '/v3/research/evaluating-a-forecast', label: 'Follow the full calculation walkthrough' }]} />
  </ContentPage>
}

import { notFound } from 'next/navigation'
import { SourceList } from '@/components/content/SourceList'
import { Container } from '@/components/layout/Container'
import { Callout, Tag } from '@/components/ui'
import { Subscribe } from '@/components/content/Subscribe'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { OnThisPage } from '@/components/content/OnThisPage'
import { Masthead } from '@/components/content/Masthead'
import { KeyFigures } from '@/components/content/KeyFigures'
import { nextLinksFor, refFor } from '@/content/graph'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allReports, getReport, getAuthor } from '@/content'
import { dateLong } from '@/lib/format'
import { jsonLd, seo, publisherRef, authorNode } from '@/lib/seo'
import { site } from '@/lib/site'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return allReports().map((r) => ({ slug: r.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const r = getReport(slug)
  if (!r) return {}
  return seo({
    title: r.seoTitle ?? r.title,
    description: r.summary,
    path: `/research/${r.slug}`,
    type: 'article',
    publishedTime: r.publishedAt,
  })
}

export default async function ReportPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const report = getReport(slug)
  if (!report) notFound()
  const nextLinks = nextLinksFor(refFor(`/research/${report.slug}`))

  return (
    <Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: report.title,
          description: report.summary,
          datePublished: report.publishedAt,
          author: authorNode(getAuthor(report.author)),
          publisher: publisherRef,
        })}
      />
      <Breadcrumbs items={[{ name: 'Research', href: '/research' }, { name: report.title, href: `/research/${report.slug}` }]} />
      <article className="mt-6">
        <Tag>{report.reportId}</Tag>
        <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {report.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{report.summary}</p>
        <Masthead
          eyebrow={report.reportId}
          author={report.author}
          publishedAt={report.publishedAt}
          sources={report.sources}
          body={report.body}
        />

        <KeyFigures figures={report.keyFigures} />

        {/* Findings sit in the first third of the document, deliberately. */}
        <section className="mt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            What we found
          </h2>
          <ul className="mt-4 space-y-3">
            {report.findings.map((f, i) => (
              <li key={i} className="flex gap-3 text-[17px] leading-relaxed text-body">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10">
          <OnThisPage body={report.body} />
          <AutoLinkedProse paragraphs={report.body} />
        </div>

      <NextLinks items={nextLinks} />

        <div className="mt-12">
          <Subscribe
            title="Get the formatted report and the dataset"
            blurb="The findings above are complete and free. The formatted PDF and the underlying data are sent by email."
            compact
          />
        </div>

        <SourceList sources={report.sources} />
      </article>

      <Reviewed />
    </Container>
  )
}

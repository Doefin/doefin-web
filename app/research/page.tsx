import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader, Panel, Tag } from '@/components/ui'
import { allReports } from '@/content'
import { dateShort } from '@/lib/format'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Research',
  description:
    'Original research on Bitcoin mining difficulty, hashrate economics and hedging. Findings published in full and free.',
  path: '/research',
})

export default function ResearchIndex() {
  const reports = allReports()
  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Doefin research',
          itemListElement: reports.map((r, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site.url}/research/${r.slug}`,
            name: r.title,
          })),
        })}
      />
      <Breadcrumbs items={[{ name: 'Research', href: '/research' }]} />

      <PageHeader
        eyebrow="Research"
        title="Published in full, free"
        lede="Findings are never gated. The formatted report and the underlying dataset arrive by email — the gate sits on the convenience, never the substance."
      />
      <div className="mt-12 space-y-4">
        {reports.map((r) => (
          <Link key={r.slug} href={`/research/${r.slug}`} className="group block">
            <Panel as="article" className="transition-colors group-hover:border-brand/40">
              <div className="flex flex-wrap items-center gap-3">
                <Tag>{r.reportId}</Tag>
                <span className="text-xs text-muted/70">{dateShort(r.publishedAt)}</span>
              </div>
              <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-snug tracking-[-0.02em]">
                {r.title}
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">{r.summary}</p>
              <span className="mt-5 inline-block text-sm font-semibold text-brand">
                Read the findings →
              </span>
            </Panel>
          </Link>
        ))}
      </div>

      <NextLinks
        items={[
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe />
      </div>

      <Reviewed />
    </Container>
  )
}

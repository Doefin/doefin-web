import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader, Panel, Tag } from '@/components/ui'
import { allPosts } from '@/content'
import { dateShort } from '@/lib/format'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Articles',
  description: 'Commentary on Bitcoin mining difficulty, hashrate economics and hedging.',
  path: '/blog',
})

export default function BlogIndex() {
  const posts = allPosts()
  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Doefin articles',
          itemListElement: posts.map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${site.url}/blog/${p.slug}`,
            name: p.title,
          })),
        })}
      />
      <Breadcrumbs items={[{ name: 'Blog', href: '/blog' }]} />

      <PageHeader
        eyebrow="Articles"
        title="Commentary"
        lede="Shorter pieces between research reports — what just moved, what it means, and where our own model was wrong."
      />
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {posts.map((p) => (
          <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
            <Panel as="article" className="h-full transition-colors group-hover:border-brand/40">
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <h2 className="mt-4 text-xl font-bold leading-snug tracking-[-0.015em]">{p.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
              <p className="mt-4 text-xs text-muted/70">
                {dateShort(p.publishedAt)} · {p.readingMinutes} min read
              </p>
            </Panel>
          </Link>
        ))}
      </div>

      <NextLinks
        items={[
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe />
      </div>

      <Reviewed />
    </Container>
  )
}

import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { GuideArticle } from '@/components/tools/GuideArticle'
import { allGuides, guideFor, TOOLS } from '@/content'
import { dateLong } from '@/lib/format'
import { jsonLd, seo, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return allGuides().map(({ slug }) => ({ slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = guideFor(slug)
  if (!g) return {}
  return seo({
    title: g.article.seoTitle,
    description: g.article.summary,
    path: `/academy/guides/${slug}`,
    type: 'article',
  })
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = guideFor(slug)
  const tool = TOOLS.find((t) => t.slug === slug)
  if (!g || !tool) notFound()

  return (
    <Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: g.article.title,
          description: g.article.summary,
          datePublished: g.article.publishedAt,
          author: { '@type': 'Organization', name: 'Doefin Research' },
          publisher: publisherRef,
          about: { '@type': 'Thing', name: tool.title },
          mainEntityOfPage: `${site.url}/academy/guides/${slug}`,
        })}
      />
      <Breadcrumbs
        items={[
          { name: 'Learn', href: '/academy' },
          { name: 'Tool guides', href: '/academy#guides' },
          { name: g.article.title, href: `/academy/guides/${slug}` },
        ]}
      />

      <article className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">Tool guide</p>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {g.article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{g.article.summary}</p>
        <p className="mt-5 border-b border-white/[0.07] pb-6 text-sm text-muted/80">
          Doefin Research · {dateLong(g.article.publishedAt)}
        </p>

        <GuideArticle g={g} slug={slug} toolTitle={tool.title} />
      </article>

      <NextLinks
        items={[
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/for/miners', label: 'For miners', note: 'What difficulty risk looks like on a real site.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

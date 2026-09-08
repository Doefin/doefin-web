import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Tag } from '@/components/ui'
import { Subscribe } from '@/components/content/Subscribe'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { OnThisPage } from '@/components/content/OnThisPage'
import { nextLinksFor, refFor } from '@/content/graph'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { SourceList } from '@/components/content/SourceList'
import { allPosts, getPost, getAuthor } from '@/content'
import { dateLong, readingMinutes } from '@/lib/format'
import { jsonLd, seo, publisherRef, authorNode } from '@/lib/seo'
import { site } from '@/lib/site'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return seo({
    title: post.title,
    description: post.summary,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const nextLinks = nextLinksFor(refFor(`/blog/${post.slug}`))

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: authorNode(getAuthor(post.author)),
    publisher: publisherRef,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  }

  return (
    <Container size="narrow" className="py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(article)} />
      <Breadcrumbs items={[{ name: 'Articles', href: '/blog' }, { name: post.title, href: `/blog/${post.slug}` }]} />
      <article className="mt-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <h1 className="mt-5 text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        <p className="mt-5 border-b border-white/[0.07] pb-6 text-sm text-muted/80">
          {getAuthor(post.author).name} · {dateLong(post.publishedAt)} · {readingMinutes(post.body)} min read
        </p>
        <div className="mt-8">
          <OnThisPage body={post.body} />
          <AutoLinkedProse paragraphs={post.body} />
        </div>
        <SourceList sources={post.sources} />
      <NextLinks items={nextLinks} />

        <div className="mt-12">
          <Subscribe compact />
        </div>
      </article>

      <Reviewed />
    </Container>
  )
}

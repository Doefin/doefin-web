import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { OnThisPage } from '@/components/content/OnThisPage'
import { Masthead } from '@/components/content/Masthead'
import { KeyFigures } from '@/components/content/KeyFigures'
import { FAQ } from '@/components/content/FAQ'
import { nextLinksFor, refFor } from '@/content/graph'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allAcademy, getAcademy, getGlossary, getAuthor } from '@/content'
import { dateLong } from '@/lib/format'
import { jsonLd, seo, publisherRef, authorNode } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return allAcademy().map((p) => ({ slug: p.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getAcademy(slug)
  if (!p) return {}
  return seo({ title: p.seoTitle ?? p.title, description: p.summary, path: `/academy/${p.slug}`, type: 'article' })
}

export default async function AcademyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getAcademy(slug)
  if (!post) notFound()
  const nextLinks = nextLinksFor(refFor(`/academy/${post.slug}`))

  const related = (post.glossaryTerms ?? []).map(getGlossary).filter(Boolean)

  return (
    <Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.summary,
          datePublished: post.publishedAt,
          author: authorNode(getAuthor(post.author)),
          publisher: publisherRef,
        })}
      />
      <Breadcrumbs items={[{ name: 'Learn', href: '/academy' }, { name: post.title, href: `/academy/${post.slug}` }]} />
      <article className="mt-6">
        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {post.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{post.summary}</p>
        <Masthead
          eyebrow={post.level}
          author={post.author}
          publishedAt={post.publishedAt}
          sources={post.sources}
          body={post.body}
        />

        <KeyFigures figures={post.keyFigures} />
        <div className="mt-8">
          <OnThisPage body={post.body} />
          <AutoLinkedProse paragraphs={post.body} />
        </div>
      </article>

      {related.length ? (
        <aside className="mt-12 border-t border-white/[0.07] pt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Terms used here
          </h2>
          <dl className="mt-4 space-y-4">
            {related.map((t) => (
              <div key={t!.slug}>
                <dt>
                  <Link href={`/glossary/${t!.slug}`} className="font-semibold text-brand hover:underline">
                    {t!.term}
                  </Link>
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{t!.shortDef}</dd>
              </div>
            ))}
          </dl>
        </aside>
      ) : null}


      <FAQ items={post.faq} />

      <NextLinks items={nextLinks} />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

import { notFound } from 'next/navigation'
import Link from '@/components/routing/SiteLink'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { allGuides, allV3Editorial, getV3Editorial, getV3Topic, type V3EditorialArticle } from '@/content'
import { authorNode, seo, jsonLd, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { dateLong } from '@/lib/format'
import { ContentLinks, ContentPage } from './ContentPage'
import { V3BlogIndex } from './V3BlogIndex'
import { V3BlogPost } from './V3BlogPost'
import { V3AcademyIndex } from './V3AcademyIndex'

type Kind = V3EditorialArticle['kind']
const label = (kind: Kind) => kind === 'academy' ? 'Academy' : 'Articles'
const path = (kind: Kind, slug = '') => `/${kind}${slug ? '/' + slug : ''}`

function ArticleList({ articles }: { articles: V3EditorialArticle[] }) {
  return <div className="divide-y divide-white/10 border-y border-white/10">{articles.map(article => <Link key={article.slug} href={path(article.kind, article.slug)} className="group block py-6"><h2 className="text-xl font-bold group-hover:text-highlight">{article.title} →</h2><p className="mt-3 text-sm leading-relaxed text-subtle">{article.summary}</p></Link>)}</div>
}

function collection(kind: Kind) {
  return {
    metadata: seo({ title: kind === 'academy' ? 'Bitcoin mining fundamentals' : 'Mining assumptions and interpretation', description: kind === 'academy' ? 'Understand difficulty, hashprice and forecast uncertainty before working through the tools.' : 'Practical explanations of mining assumptions, hashrate estimates and their limits.', path: path(kind) }),
    default: async function Collection() {
      return <ContentPage title={kind === 'academy' ? 'Understand Bitcoin mining.' : 'Understand mining data and assumptions.'} summary={kind === 'academy' ? 'Learn how difficulty, hashprice and uncertainty affect mining calculations, then work through a calculator guide.' : 'Read how mining assumptions affect calculations and how to interpret hashrate estimates.'} eyebrow={label(kind)} crumbs={[{ name: label(kind), href: path(kind) }]}>
        <ArticleList articles={await allV3Editorial(kind)} />
        {kind === 'academy' && <section id="guides" className="mt-10 scroll-mt-28"><h2 className="text-2xl font-bold">Calculator guides</h2><ul className="mt-5 space-y-4">{(await allGuides()).map(({ slug, guide }) => <li key={slug}><Link href={'/academy/guides/' + slug} className="text-sm font-semibold text-highlight hover:underline">{guide.article.title} →</Link></li>)}</ul></section>}
        <ContentLinks links={[{ href: '/tools', label: 'Compare your mining assumptions' }, { href: '/research', label: 'Read a worked research example' }, { href: '/glossary', label: 'Look up a term' }]} />
      </ContentPage>
    },
  }
}

function article(kind: Kind) {
  return {
    generateMetadata: async ({ params }: { params: Promise<{ slug: string }> }) => {
      const item = await getV3Editorial(kind, (await params).slug)
      if (!item) notFound()
      return seo({ title: item.title, description: item.summary, path: path(kind, item.slug), type: 'article', publishedTime: item.publishedAt })
    },
    default: async function Article({ params }: { params: Promise<{ slug: string }> }) {
      const item = await getV3Editorial(kind, (await params).slug)
      if (!item) notFound()
      if (kind === 'blog') return <V3BlogPost article={item} />
      return <div className="[overflow-wrap:anywhere]"><ContentPage title={item.title} summary={item.summary} eyebrow="Educational guide" crumbs={[{ name: label(kind), href: path(kind) }, { name: item.title, href: path(kind, item.slug) }]}>
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: item.title, description: item.summary, publisher: publisherRef, mainEntityOfPage: site.url + path(kind, item.slug), datePublished: item.publishedAt, author: item.author && authorNode(item.author) })} />
        {(item.author || item.reviewedAt) && <p className="mb-8 flex flex-wrap gap-x-4 gap-y-2 text-xs text-subtle">
          {item.author && <span>By {item.author.name}</span>}
          {item.reviewedAt && <span>Guide reviewed <time dateTime={item.reviewedAt}>{dateLong(item.reviewedAt)}</time></span>}
        </p>}
        <AutoLinkedProse paragraphs={item.sections.flatMap(section => [{ heading: section.heading, id: section.id }, ...section.paragraphs])} />
        <ContentLinks links={[{ href: '/methodology/difficulty-index', label: 'Read how the forecast is calculated' }, { href: '/tools/difficulty-exposure', label: 'Compare your production scenarios' }, { href: '/data', label: 'Read the data examples' }]} />
      </ContentPage></div>
    },
  }
}

export const V3Blog = { ...collection('blog'), default: V3BlogIndex }
export const V3Academy = { ...collection('academy'), default: V3AcademyIndex }
export const V3Post = article('blog')
export const V3Lesson = article('academy')
export const V3Tag = {
  generateMetadata: async ({ params }: { params: Promise<{ tag: string }> }) => {
    const topic = await getV3Topic((await params).tag)
    if (!topic) notFound()
    return seo({ title: `${topic.label}: educational articles`, description: `Read educational articles on ${topic.label} and the assumptions behind mining data.`, path: '/blog/tag/' + topic.slug })
  },
  default: async function TaggedArticles({ params }: { params: Promise<{ tag: string }> }) {
    const topic = await getV3Topic((await params).tag)
    if (!topic) notFound()
    return <V3BlogIndex topic={topic} />
  },
}

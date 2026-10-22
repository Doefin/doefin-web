import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allV3Editorial, allV3EditorialTags, v3EditorialReviewedAt, type V3EditorialArticle } from '@/content'
import { readingMinutes, dateShort } from '@/lib/format'
import { jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import { ArticleLibrary } from './ArticleLibrary'
import { editorialCoverFor } from '@/lib/article-library'

const tagPath = (tag: string) => '/v3/blog/tag/' + tag.replace(/\s+/g, '-')
const topicLabel = (tag: string) => tag[0].toUpperCase() + tag.slice(1)
const minutes = (article: V3EditorialArticle) => readingMinutes(article.sections.flatMap(section => [{ heading: section.heading }, ...section.paragraphs]))

export function V3BlogIndex({ topic }: { topic?: string } = {}) {
  const all = allV3Editorial('blog')
  const articles = topic ? all.filter(article => article.tags.includes(topic)) : all
  return <Container className="pb-14 pt-7 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      '@context': 'https://schema.org', '@type': 'ItemList', name: topic ? `${topic}: Doefin articles` : 'Doefin articles',
      itemListElement: articles.map((article, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/v3/blog/${article.slug}`, name: article.title })),
    }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Articles', href: '/v3/blog' }, ...(topic ? [{ name: topicLabel(topic), href: tagPath(topic) }] : [])]} /></div>
    <header className="mb-6 mt-2 sm:mb-8 sm:mt-8">
      {topic ? <Link href="/v3/blog" className="mb-4 inline-flex min-h-9 items-center gap-2 text-xs font-semibold text-highlight hover:underline"><span aria-hidden>←</span> All articles</Link> : null}
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-highlight">Doefin / Articles</p>
      <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">{topic ? topicLabel(topic) : 'Notes on mining.'}</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-subtle">Mining assumptions, economics and data, explained.</p>
    </header>

    <ArticleLibrary key={topic ?? 'all'} topic={topic} total={all.length} topics={allV3EditorialTags()} entries={articles.map(article => ({
      slug: article.slug, title: article.title, summary: article.summary, tags: article.tags,
      minutes: minutes(article), reviewedAt: article.reviewedAt ?? null, reviewedLabel: article.reviewedAt ? dateShort(article.reviewedAt) : null, cover: editorialCoverFor(article.slug),
    }))} />
    <p className="mt-5 text-xs leading-relaxed text-subtle">Educational articles. These explain assumptions and interpretation; they do not report measured market performance.</p>
    <section aria-labelledby="reading-next" className="mt-10 border-t border-white/10 pt-7 sm:mt-12">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3"><h2 id="reading-next" className="text-xl font-bold tracking-tight">Take the next step.</h2><Link href="/v3/resources" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight hover:underline">All resources <Arrow className="h-4 w-4" /></Link></div>
      <div className="grid gap-4 sm:grid-cols-3">{[
        { label: 'Apply', title: 'Test your assumptions', text: 'Compare production, hosting costs and fleet payback.', href: '/v3/tools' },
        { label: 'Understand', title: 'Build the foundations', text: 'Learn how difficulty, hashprice and uncertainty connect.', href: '/v3/academy' },
        { label: 'Look up', title: 'Find a definition', text: 'Plain explanations of the terms used in these articles.', href: '/v3/glossary' },
      ].map(item => <Link key={item.href} href={item.href} className="group rounded-xl border border-white/[0.07] bg-surface/30 p-5 hover:border-brand/40"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">{item.label}</p><h3 className="mt-3 flex items-center justify-between gap-3 text-sm font-bold group-hover:text-highlight">{item.title}<Arrow className="h-4 w-4 text-highlight" /></h3><p className="mt-2 text-xs leading-relaxed text-subtle">{item.text}</p></Link>)}</div>
    </section>
  </Container>
}

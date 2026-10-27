import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { allV3Editorial, type V3EditorialArticle } from '@/content'
import { blockId } from '@/content/types'
import { readingMinutes, dateLong } from '@/lib/format'
import { articleTopicLabel, articleTopicPath, editorialCoverFor } from '@/lib/article-library'
import { jsonLd, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { EditorialCover } from './EditorialCover'
import { Arrow } from './Arrow'
import styles from './article-reading.module.css'

export async function V3BlogPost({ article }: { article: V3EditorialArticle }) {
  const paragraphs = article.sections.flatMap(section => [{ heading: section.heading, id: section.id }, ...section.paragraphs])
  const candidates = (await allV3Editorial('blog')).filter(item => item.slug !== article.slug)
  const related = candidates.find(item => item.topics.some(topic => article.topics.some(t => t.slug === topic.slug))) ?? candidates[0]
  const nextStep = article.slug === 'what-a-static-growth-assumption-costs-you'
    ? { href: '/v3/tools/fleet-payback', label: 'Apply the idea', title: 'Test your payback assumptions', description: 'Compare the effect of different growth paths on capital recovery.' }
    : article.slug === 'reading-a-hashrate-chart-honestly'
      ? { href: '/v3/methodology/difficulty-index', label: 'Check the method', title: 'Read the difficulty methodology', description: 'Inspect the calculation and limitations of the sample index.' }
      : { href: '/v3/tools', label: 'Apply the idea', title: 'Explore the mining tools', description: 'Work through a production, hosting or payback scenario.' }
  const contents = <nav aria-label="In this article"><ol className="space-y-1">{article.sections.map((section, index) => <li key={section.id}><a href={'#' + blockId({ heading: section.heading, id: section.id })} className="flex min-h-11 items-start gap-3 rounded py-2.5 text-xs leading-relaxed text-subtle hover:text-highlight"><span className="tabular text-[10px] text-highlight">{String(index + 1).padStart(2, '0')}</span>{section.heading}</a></li>)}</ol></nav>
  return <Container className="pb-14 pt-6 sm:pt-9 [overflow-wrap:anywhere]">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({ '@context': 'https://schema.org', '@type': 'Article', headline: article.title, description: article.summary, publisher: publisherRef, mainEntityOfPage: site.url + '/v3/blog/' + article.slug, datePublished: article.publishedAt }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Articles', href: '/v3/blog' }, { name: article.title, href: '/v3/blog/' + article.slug }]} /></div>
    <header className="mt-2 border-b border-white/10 pb-7 sm:mt-7 sm:pb-9">
      <Link href="/v3/blog" className="mb-4 inline-flex min-h-9 items-center gap-2 rounded text-xs font-semibold text-highlight hover:underline"><span aria-hidden>←</span> All articles</Link>
      <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
        <div><div className="flex flex-wrap items-center gap-x-4 gap-y-2">{article.topics.map(tag => <Link key={tag.slug} href={articleTopicPath(tag)} className="text-[11px] font-semibold text-highlight hover:underline">{articleTopicLabel(tag.label)}</Link>)}</div>
          <h1 className="mt-4 text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-[42px]">{article.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-[1.75] text-subtle">{article.summary}</p>
          <p className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-subtle"><span>Educational article</span><span className="tabular">{readingMinutes(paragraphs)} min read</span>{article.reviewedAt ? <span>Reviewed <time dateTime={article.reviewedAt}>{dateLong(article.reviewedAt)}</time></span> : null}</p>
        </div>
        <div className="h-[120px] overflow-hidden rounded-xl border border-white/[0.07] sm:h-[170px] lg:h-[240px]"><EditorialCover kind={editorialCoverFor(article.slug)} compact /></div>
      </div>
    </header>
    <div id="article-body" className="mt-6 grid items-start gap-7 scroll-mt-28 lg:mt-9 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
      <aside className="hidden lg:sticky lg:top-28 lg:block"><h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">In this article</h2>{contents}<Link href="/v3/glossary" className="mt-5 inline-flex min-h-11 items-center gap-2 border-t border-white/10 pt-4 text-xs font-semibold text-highlight hover:underline">Mining glossary <Arrow className="h-4 w-4" /></Link></aside>
      <div className="min-w-0 max-w-[44rem]">
        <details className="mb-7 rounded-xl border border-white/10 bg-surface/30 px-4 py-3 lg:hidden"><summary className="cursor-pointer text-sm font-semibold">In this article <span className="ml-2 text-xs font-normal text-subtle">{article.sections.length} sections</span></summary><div className="mt-3 border-t border-white/10 pt-2">{contents}</div></details>
        <article aria-label={article.title} className={styles.reading}><AutoLinkedProse paragraphs={paragraphs} /></article>
        <p className="mt-8 border-l-2 border-brand/40 pl-4 text-xs leading-relaxed text-subtle">Educational context for evaluating assumptions. This article does not report measured market performance.</p>
        <section aria-labelledby="article-next" className="mt-9 border-t border-white/10 pt-7"><h2 id="article-next" className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">Continue from here</h2>
          <Link href={nextStep.href} className="mt-4 flex items-start justify-between gap-4 rounded-xl border border-brand/25 bg-brand/5 p-5 hover:border-brand/50"><div><p className="text-xs font-semibold text-highlight">{nextStep.label}</p><h3 className="mt-2 text-lg font-bold">{nextStep.title}</h3><p className="mt-2 text-sm leading-relaxed text-subtle">{nextStep.description}</p></div><Arrow className="mt-1 text-highlight" /></Link>
          {related ? <Link href={'/v3/blog/' + related.slug} className="mt-4 flex items-start justify-between gap-4 border-b border-white/10 py-5 hover:text-highlight"><div><p className="text-[11px] text-subtle">Related reading</p><h3 className="mt-2 text-lg font-bold">{related.title}</h3><p className="mt-2 text-sm leading-relaxed text-subtle">{related.summary}</p></div><Arrow className="mt-1 text-highlight" /></Link> : null}
          <Link href="/v3/blog" className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline"><span aria-hidden>←</span> All articles</Link>
        </section>
      </div>
    </div>
  </Container>
}

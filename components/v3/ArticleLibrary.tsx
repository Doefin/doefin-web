'use client'

import type { EditorialTopic } from '@/content/editorial-types'
import { useRef, useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { articleTopicLabel, articleTopicPath, filterArticleLibrary, type ArticleLibraryEntry } from '@/lib/article-library'
import { Arrow } from './Arrow'
import { EditorialCover } from './EditorialCover'

export function ArticleLibrary({ entries, topics, topic, total }: {
  entries: ArticleLibraryEntry[]; topics: EditorialTopic[]; topic?: EditorialTopic; total: number
}) {
  const [query, setQuery] = useState('')
  const search = useRef<HTMLInputElement>(null)
  const filtered = filterArticleLibrary(entries, query)
  const large = total > 2
  const clear = () => { setQuery(''); search.current?.focus() }
  const topicLinks = <nav aria-label="Article topics" className={'flex flex-wrap items-center gap-2 ' + (large ? 'mb-6' : 'mt-7 border-t border-white/10 pt-6')}>
    <span className="mr-2 text-xs font-semibold text-subtle">Browse topics</span>
    {[{ label: 'All articles', href: '/v3/blog', selected: !topic }, ...topics.map(tag => ({ label: articleTopicLabel(tag.label), href: articleTopicPath(tag), selected: topic?.slug === tag.slug }))].map(item => <Link key={item.href} href={item.href} aria-current={item.selected ? 'page' : undefined} className={'inline-flex min-h-10 items-center rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ' + (item.selected ? 'border-brand/50 bg-brand/10 text-highlight' : 'border-white/10 text-subtle hover:border-brand/40 hover:text-body')}>{item.label}</Link>)}
  </nav>
  return <div data-article-library>
    <div className="sticky top-[5.5rem] z-20 mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-ink/95 py-2 backdrop-blur-lg">
      <div role="search" aria-label="Article search" className="flex min-w-0 flex-[1_1_16rem] items-center gap-3 rounded-xl border border-white/15 bg-surface/50 px-3 py-1.5 focus-within:border-brand/60 sm:max-w-xl">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-highlight"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5" /></svg>
        <label htmlFor="article-search" className="sr-only">Search article titles, topics or summaries</label>
        <input ref={search} id="article-search" type="search" placeholder={topic ? `Search ${articleTopicLabel(topic.label).toLowerCase()}` : 'Find an article'} value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') clear() }} autoComplete="off" spellCheck={false} aria-controls="article-results" className="min-h-10 min-w-0 flex-1 rounded bg-transparent px-1 text-sm text-body placeholder:text-subtle [&::-webkit-search-cancel-button]:appearance-none" />
        {query ? <button type="button" onClick={clear} aria-label="Clear article search" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-lg text-subtle hover:bg-white/5">×</button> : null}
      </div>
      <p role="status" aria-live="polite" className="tabular text-xs text-subtle">{query ? `${filtered.length} of ${entries.length}` : entries.length} {entries.length === 1 ? 'article' : 'articles'}</p>
    </div>
    {large ? topicLinks : null}
    <div id="article-results" className={'grid gap-5 ' + (large ? 'md:grid-cols-2 xl:grid-cols-3' : filtered.length > 1 ? 'lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]' : 'max-w-4xl')}>
      {filtered.map((article, index) => <article key={article.slug} data-blog-article={article.slug} className="group flex min-w-0 flex-col overflow-hidden rounded-panel border border-white/10 bg-surface/50 transition-colors hover:border-brand/40">
        <div className={'flex flex-1 flex-col p-5 ' + (large ? 'sm:p-6' : 'sm:p-7')}>
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold text-subtle"><span className="text-highlight">{!large && !topic && index === 0 && !query ? 'Start here' : 'Perspective'}</span><span className="tabular">{article.minutes} min read</span></div>
          <h2 className={'mt-4 text-balance font-bold leading-[1.2] tracking-[-0.025em] ' + (large ? 'text-xl' : index === 0 ? 'text-2xl sm:text-[28px]' : 'text-2xl')}><Link href={'/v3/blog/' + article.slug} className="rounded group-hover:text-highlight">{article.title}</Link></h2>
          <p className="mb-5 mt-3 text-sm leading-[1.75] text-subtle">{article.summary}</p>
          <div className="mt-auto flex flex-wrap gap-x-4 gap-y-2 border-t border-white/[0.07] pt-4 text-[11px] text-subtle">{article.topics.map(tag => <Link key={tag.slug} href={articleTopicPath(tag)} className="inline-flex min-h-8 items-center hover:text-highlight hover:underline">{articleTopicLabel(tag.label)}</Link>)}</div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1"><Link href={'/v3/blog/' + article.slug} aria-label={'Read article: ' + article.title} className="inline-flex min-h-11 items-center gap-2 rounded text-sm font-semibold text-highlight hover:underline">Read article <Arrow className="h-4 w-4" /></Link><span className="text-[10px] text-subtle">{article.reviewedAt ? <>Reviewed <time dateTime={article.reviewedAt}>{article.reviewedLabel}</time></> : 'Educational article'}</span></div>
        </div>
        <div className={'shrink-0 border-t border-white/[0.07] ' + (large ? 'h-[150px]' : 'h-[160px] sm:h-[210px] lg:h-[230px]')}><EditorialCover kind={article.cover} compact={large} /></div>
      </article>)}
    </div>
    {!filtered.length ? <div className="rounded-panel border border-white/10 bg-surface/40 px-5 py-10 text-center"><h2 className="text-lg font-bold">No articles found</h2><p className="mt-3 text-sm text-subtle">Try another word{topic ? ' or browse all topics' : ''}.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><button type="button" onClick={clear} className="min-h-11 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-highlight">Clear search</button>{topic ? <Link href="/v3/blog" className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-highlight">All articles →</Link> : null}</div></div> : null}
    {!large ? topicLinks : null}
  </div>
}

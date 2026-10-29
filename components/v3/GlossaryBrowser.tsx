'use client'

import { useMemo, useRef, useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'

export const glossaryTopics = [
  { id: 'all', label: 'All terms' },
  { id: 'network', label: 'Network & difficulty' },
  { id: 'revenue', label: 'Revenue & pools' },
  { id: 'operations', label: 'Operations' },
  { id: 'uncertainty', label: 'Forecast uncertainty' },
] as const

type Topic = typeof glossaryTopics[number]['id']
export type GlossaryEntry = { slug: string; term: string; shortDef: string; aliases: string[]; topic: Exclude<Topic, 'all'> }
const bands = [{ id: 'bc', label: 'B–C', from: 'A', to: 'C' }, { id: 'dh', label: 'D–H', from: 'D', to: 'H' }, { id: 'mp', label: 'M–P', from: 'I', to: 'P' }, { id: 'tu', label: 'T–U', from: 'Q', to: 'Z' }]
const normalize = (s: string) => s.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()

export function GlossaryBrowser({ entries, academyHref = '/academy' }: { entries: GlossaryEntry[]; academyHref?: string }) {
  const [query, setQuery] = useState('')
  const [topic, setTopic] = useState<Topic>('all')
  const search = useRef<HTMLInputElement>(null)
  const normalizedQuery = normalize(query)
  const filtered = entries.filter(t => (topic === 'all' || t.topic === topic) && normalize([t.term, ...t.aliases, t.shortDef].join(' ')).includes(normalizedQuery))
  const groups = bands.flatMap(band => {
    const terms = filtered.filter(t => t.term[0].toUpperCase() >= band.from && t.term[0].toUpperCase() <= band.to)
    if (!terms.length) return []
    const first = terms[0].term[0].toUpperCase(), last = terms[terms.length - 1].term[0].toUpperCase()
    return [{ ...band, label: first === last ? first : `${first}–${last}`, entries: terms }]
  })
  const counts = useMemo(() => Object.fromEntries(glossaryTopics.map(t => [t.id, t.id === 'all' ? entries.length : entries.filter(entry => entry.topic === t.id).length])), [entries])
  const hasFilter = query !== '' || topic !== 'all'
  const reset = () => { setQuery(''); setTopic('all'); search.current?.focus() }

  return <div>
    <div role="search" aria-label="Glossary search" className="sticky top-[5.5rem] z-20 mb-5 flex sm:mb-8 items-center gap-3 rounded-xl border border-brand/35 bg-ink/95 px-4 py-2 shadow-lg shadow-ink/20 backdrop-blur-lg sm:gap-4 sm:px-5">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0 text-highlight"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="m16 16 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
      <label htmlFor="glossary-search" className="sr-only">Search terms, abbreviations or definitions</label>
      <input ref={search} id="glossary-search" type="search" value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQuery('') }} placeholder="Try difficulty or EH/s" autoComplete="off" spellCheck={false} aria-controls="glossary-results" className="min-h-11 min-w-0 flex-1 rounded bg-transparent px-1 text-base text-body placeholder:text-subtle [&::-webkit-search-cancel-button]:appearance-none" />
      {query ? <button type="button" onClick={() => { setQuery(''); search.current?.focus() }} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-xl text-subtle hover:bg-white/5 hover:text-body" aria-label="Clear search">×</button> : <span className="hidden text-xs text-subtle sm:block">Terms, aliases & definitions</span>}
    </div>

    <div className="grid items-start gap-5 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10">
      <aside className="min-w-0 lg:sticky lg:top-[11rem]">
        <div className="flex items-center gap-3 lg:hidden"><label htmlFor="glossary-topic" className="shrink-0 text-xs font-semibold text-subtle">Topic</label><select id="glossary-topic" value={topic} onChange={e => setTopic(e.target.value as Topic)} className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/15 bg-surface px-3 py-2 text-sm text-body">{glossaryTopics.map(t => <option key={t.id} value={t.id}>{t.label} ({counts[t.id]})</option>)}</select></div>
        <h2 className="mb-3 hidden text-[11px] font-bold uppercase tracking-[0.12em] text-subtle lg:block">Browse by topic</h2>
        <nav aria-label="Glossary topics" className="hidden flex-col gap-1 lg:flex">
          {glossaryTopics.map(t => <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)} className={'flex min-h-11 items-center justify-between gap-3 rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors lg:w-full lg:text-[13px] ' + (topic === t.id ? 'border-brand/40 bg-brand/10 text-highlight' : 'border-white/[0.07] text-subtle hover:border-white/20 hover:bg-white/[0.03]')}>
            <span>{t.label}</span><span className="tabular text-[11px] text-subtle">{counts[t.id]}</span>
          </button>)}
        </nav>
        <div className="mt-7 hidden border-t border-white/10 pt-5 lg:block"><p className="text-sm font-bold">New to mining?</p><p className="mt-2 text-xs leading-relaxed text-subtle">Build the foundations with a short explanation of how difficulty works.</p><Link href={academyHref} className="mt-3 inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-highlight hover:underline">Start with the Academy <Arrow className="h-4 w-4" /></Link></div>
      </aside>

      <div id="glossary-results" className="min-w-0 scroll-mt-48">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-3 border-b border-white/10 pb-4">
          <p role="status" aria-live="polite" className="text-sm font-semibold"><span className="tabular">{filtered.length}</span> {filtered.length === 1 ? 'definition' : 'definitions'}<span className="ml-2 hidden text-xs font-normal text-subtle sm:inline">{topic === 'all' ? 'All topics' : glossaryTopics.find(t => t.id === topic)!.label}</span></p>
          <div className="flex flex-wrap items-center gap-3">
            {groups.length ? <nav aria-label="Jump to definitions" className="flex items-center gap-1">{groups.map(group => <a key={group.id} href={'#glossary-' + group.id} className="tabular inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-surface/40 px-2 text-xs font-bold text-subtle hover:border-brand/50 hover:text-highlight">{group.label}</a>)}</nav> : null}
            {hasFilter ? <button type="button" onClick={reset} className="min-h-9 rounded-lg px-2 text-xs font-semibold text-highlight hover:bg-white/5">Reset filters ↺</button> : null}
          </div>
        </div>
        {groups.length ? <>
          {groups.map(group => <section key={group.id} id={'glossary-' + group.id} aria-labelledby={'glossary-heading-' + group.id} className="mt-7 scroll-mt-48">
            <div className="mb-3 flex items-baseline gap-3"><h2 id={'glossary-heading-' + group.id} className="tabular text-xl font-extrabold tracking-tight text-highlight">{group.label}</h2><span className="tabular text-[11px] text-subtle">{group.entries.length} {group.entries.length === 1 ? 'term' : 'terms'}</span></div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {group.entries.map(t => <div key={t.slug} data-glossary-term={t.slug} className="group relative flex min-w-0 flex-col rounded-xl border border-white/[0.08] bg-surface/50 p-5 transition-colors focus-within:border-brand/50 hover:border-brand/40 hover:bg-surface">
                <dt><Link href={'/glossary/' + t.slug} className="flex min-h-9 items-start justify-between gap-3 text-base font-bold tracking-tight text-body group-hover:text-highlight"><span>{t.term}</span><Arrow diagonal className="mt-0.5 h-4 w-4 text-subtle group-hover:text-highlight" /></Link></dt>
                <dd className="mt-3 flex flex-1 flex-col"><p className="text-sm leading-[1.75] text-subtle">{t.shortDef}</p>{t.aliases.length ? <p className="mt-3 text-[11px] leading-relaxed text-subtle"><span className="font-semibold text-body/70">Also </span>{t.aliases.join(' · ')}</p> : null}<p className="mt-4 pt-1 text-[10px] font-medium text-subtle">{glossaryTopics.find(topic => topic.id === t.topic)!.label}</p></dd>
              </div>)}
            </dl>
          </section>)}
        </> : <div className="my-7 rounded-panel border border-white/10 bg-surface/40 px-5 py-12 text-center"><h2 className="text-lg font-bold">No matching definitions</h2><p className="mx-auto mt-3 max-w-sm break-words text-sm leading-relaxed text-subtle">Try a shorter phrase or another topic. You can also search abbreviations such as EH/s or FPPS.</p><button type="button" onClick={() => { reset(); search.current?.focus() }} className="mt-5 min-h-11 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-semibold text-highlight hover:bg-brand/20">Show all terms</button></div>}
        <noscript><p className="mt-5 text-sm text-subtle">All definitions are listed here. Enable JavaScript to search or filter by topic.</p></noscript>
      </div>
    </div>

    <section aria-labelledby="glossary-next" className="mt-12 flex flex-col items-start justify-between gap-5 rounded-panel border border-white/10 bg-gradient-to-br from-surface to-surfaceAlt/40 p-6 sm:flex-row sm:items-center sm:p-7"><div><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight">From definition to application</p><h2 id="glossary-next" className="mt-2 text-xl font-bold tracking-tight">Put the terms to work.</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-subtle">Explore difficulty exposure, hosting costs and fleet payback with your own assumptions.</p></div><Link href="/tools" className="inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg border border-brand/30 bg-brand/10 px-4 py-3 text-sm font-semibold text-highlight hover:border-brand/60 hover:bg-brand/20">Explore calculators <Arrow /></Link></section>
  </div>
}

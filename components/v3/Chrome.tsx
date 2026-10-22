'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'

const navigation = [
  { label: 'How it works', href: '/v3#how-it-works' },
  { label: 'Tools', href: '/v3/tools' },
  { label: 'Docs', href: '/v3/docs' },
]

const audienceLinks = [
  { label: 'For miners', href: '/v3/for/miners', description: 'Plan production exposure and review a market.' },
  { label: 'For funds & desks', href: '/v3/for/institutions', description: 'Compare contracts and inspect settlement terms.' },
]

const learningLinks = [
  { label: 'Academy', href: '/v3/academy', description: 'Understand difficulty, hashprice and uncertainty.' },
  { label: 'Articles', href: '/v3/blog', description: 'Read about mining assumptions and data.' },
  { label: 'Mining glossary', href: '/v3/glossary', description: 'Look up network and operating terms.' },
  { label: 'Research examples', href: '/v3/research', description: 'Inspect synthetic datasets and calculations.' },
]

export function V3Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/v3'
  const previewVersion = 'V3'
  const [menuOpen, setMenuOpen] = useState(false)
  const [learnOpen, setLearnOpen] = useState(false)
  const [audienceOpen, setAudienceOpen] = useState(false)
  const audienceButton = useRef<HTMLButtonElement>(null)
  const audiencePanel = useRef<HTMLDivElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const learnButton = useRef<HTMLButtonElement>(null)
  const learnPanel = useRef<HTMLDivElement>(null)
  const closeNavigation = () => { setMenuOpen(false); setLearnOpen(false); setAudienceOpen(false) }
  useEffect(() => { setMenuOpen(false); setLearnOpen(false); setAudienceOpen(false) }, [pathname])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const dismiss = () => { setMenuOpen(false); setLearnOpen(false); setAudienceOpen(false) }
    desktop.addEventListener('change', dismiss)
    return () => desktop.removeEventListener('change', dismiss)
  }, [])
  useEffect(() => {
    if (!learnOpen) return
    const dismiss = (event: PointerEvent) => {
      if (!learnPanel.current?.contains(event.target as Node)) setLearnOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [learnOpen])
  useEffect(() => {
    if (!audienceOpen) return
    const dismiss = (event: PointerEvent) => {
      if (!audiencePanel.current?.contains(event.target as Node)) setAudienceOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [audienceOpen])
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const learningActive = /^\/v3\/(?:resources|learn|academy|blog|glossary|research|data|methodology)(?:\/|$)/.test(pathname)
  const navLink = (item: typeof navigation[number]) => <Link key={item.href} href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className={'inline-flex min-h-11 items-center py-3 text-sm font-medium transition-colors hover:text-body ' + (active(item.href) ? 'text-body' : 'text-subtle')}>{item.label}</Link>
  return <>
    <header onKeyDown={event => {
      if (event.key !== 'Escape') return
      if (audienceOpen) { setAudienceOpen(false); audienceButton.current?.focus() }
      else if (learnOpen) { setLearnOpen(false); learnButton.current?.focus() }
      else if (menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }} className={'sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur-lg' + (isLanding ? ' v37-chrome' : '')}>
      <Container>
        <div className="flex h-[76px] items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-12"><Logo href="/v3" className="w-[88px] min-[375px]:w-[104px]" /><nav aria-label="Main" className="hidden items-center gap-5 xl:gap-7 lg:flex">
            <div ref={audiencePanel} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setAudienceOpen(false) }}>
              <button ref={audienceButton} type="button" aria-expanded={audienceOpen} aria-controls="v3-audience-links" onClick={() => { setAudienceOpen(!audienceOpen); setLearnOpen(false) }} className={'inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-body ' + (pathname.startsWith('/v3/for/') || audienceOpen ? 'text-body' : 'text-subtle')}>
                For you <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className={audienceOpen ? 'rotate-180' : ''}><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div id="v3-audience-links" hidden={!audienceOpen} className="absolute left-0 top-full mt-2 w-[320px] overflow-hidden rounded-panel border border-white/15 bg-ink p-2 shadow-2xl">
                <ul>{audienceLinks.map(item => <li key={item.href}><Link href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className={'block rounded-lg px-4 py-3 hover:bg-white/5 ' + (active(item.href) ? 'bg-brand/10' : '')}><span className="block text-sm font-semibold text-body">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-subtle">{item.description}</span></Link></li>)}</ul>
              </div>
            </div>
            {navigation.slice(0, 2).map(navLink)}
            <div ref={learnPanel} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setLearnOpen(false) }}>
              <button ref={learnButton} type="button" aria-expanded={learnOpen} aria-controls="v3-learning-links" onClick={() => { setLearnOpen(!learnOpen); setAudienceOpen(false) }} className={'inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:text-body ' + (learningActive || learnOpen ? 'text-body' : 'text-subtle')}>
                Learn <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className={learnOpen ? 'rotate-180' : ''}><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <div id="v3-learning-links" hidden={!learnOpen} className="absolute left-1/2 top-full mt-2 w-[340px] -translate-x-1/2 overflow-hidden rounded-panel border border-white/15 bg-ink shadow-2xl">
                <ul className="p-2">{learningLinks.map(item => <li key={item.href}><Link href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className={'block rounded-lg px-4 py-3 hover:bg-white/5 ' + (active(item.href) ? 'bg-brand/10' : '')}><span className="block text-sm font-semibold text-body">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-subtle">{item.description}</span></Link></li>)}</ul>
                <Link href="/v3/resources" onClick={closeNavigation} className="flex min-h-12 items-center justify-between gap-3 border-t border-white/10 px-6 py-3 text-sm font-semibold text-highlight hover:bg-white/5">All resources <Arrow /></Link>
              </div>
            </div>
            {navigation.slice(2).map(navLink)}
          </nav></div>
          <div className="flex items-center gap-2">
            <a href={site.appUrl} className="v37-nav-app inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition-colors hover:border-brand hover:bg-brand/10 sm:px-4">Open app <Arrow diagonal className="!h-4 !w-4" /></a>
            <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="v3-mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 lg:hidden">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={menuOpen ? 'm5 5 10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <nav id="v3-mobile-menu" aria-label="Mobile main" hidden={!menuOpen} className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/10 pb-4 pt-2 lg:!hidden">
          <div className="mb-2 border-b border-white/10 pb-3 pt-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.1em] text-subtle">For you</p>
            <ul className="mt-2">{audienceLinks.map(item => <li key={item.href}><Link href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className="flex min-h-12 items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-semibold hover:bg-white/5">{item.label}<Arrow /></Link></li>)}</ul>
          </div>
          {navigation.slice(0, 2).map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={closeNavigation} className={'block rounded-lg px-3 py-3 text-sm hover:bg-white/5 ' + (active(item.href) ? 'font-semibold text-highlight' : 'text-subtle')}>{item.label}</Link>)}
          <div className="my-2 border-y border-white/10 py-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.1em] text-subtle">Learn</p>
            <ul className="mt-2 grid min-[420px]:grid-cols-2">{learningLinks.map(item => <li key={item.href}><Link href={item.href} onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className="block rounded-lg px-3 py-2.5 hover:bg-white/5"><span className="block text-sm font-semibold text-body">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-subtle">{item.description}</span></Link></li>)}</ul>
            <Link href="/v3/resources" onClick={closeNavigation} className="mt-1 inline-flex min-h-11 items-center gap-2 px-3 text-sm font-semibold text-highlight">All resources <Arrow /></Link>
          </div>
          {navigation.slice(2).map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={closeNavigation} className={'block rounded-lg px-3 py-3 text-sm hover:bg-white/5 ' + (active(item.href) ? 'font-semibold text-highlight' : 'text-subtle')}>{item.label}</Link>)}
          <a href={'mailto:' + site.contactEmail} className="block px-3 py-3 text-sm text-highlight">Talk to the team ↗</a>
        </nav>
      </Container>
    </header>
    <main id="main" className="flex-1">
      {pathname !== '/v3' && <div className="border-b border-white/[0.07] bg-surface/20"><Container className="py-2.5"><p className="text-xs leading-relaxed text-subtle"><span className="font-semibold text-caution">{previewVersion} preview</span><span className="mx-2" aria-hidden="true">·</span>{pathname.startsWith('/v3/for/') ? 'Read-only market data. Review execution and terms in the app.' : 'Examples are illustrative. Confirm current market terms in the app.'}</p></Container></div>}
      {children}
    </main>
    <footer className={'border-t border-white/10 bg-surface/20' + (isLanding ? ' v37-chrome' : '')}>
      <Container className="py-7 sm:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1"><Logo href="/v3" className="w-24" /><p className="mt-3 text-sm leading-relaxed text-subtle lg:max-w-[240px]">Markets for Bitcoin mining difficulty.</p></div>
          {[
            { title: 'For you', links: audienceLinks.map(item => [item.label, item.href]) },
            { title: 'Documentation', links: [['Start here', '/v3/docs'], ['Contract mechanics', '/v3/docs/what-doefin-settles-on'], ['Risks & limitations', '/v3/docs/risks-and-limitations'], ['Key terms', '/v3/docs/key-terms']] },
            { title: 'Resources', links: [['Resource library', '/v3/resources'], ['Calculators', '/v3/tools'], ['Academy & guides', '/v3/academy'], ['Articles', '/v3/blog'], ['Research examples', '/v3/research'], ['Mining glossary', '/v3/glossary']] },
            { title: 'Connect', links: [['About Doefin', '/v3/about'], ['Talk to the team', 'mailto:' + site.contactEmail], ['Open app ↗', site.appUrl]] },
          ].map(group => <div key={group.title}><h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">{group.title}</h2><ul className="mt-2 sm:mt-4">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center text-sm text-subtle hover:text-body">{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle sm:mt-9 sm:gap-5 sm:pt-6">
          <p className="max-w-xl">For professional investors. Positions involve risk. Nothing here is investment advice. This prototype contains illustrative content.</p>
          <div className="flex gap-5"><Link href="/v3/terms" className="inline-flex min-h-11 items-center hover:text-body">Terms</Link><Link href="/v3/privacy" className="inline-flex min-h-11 items-center hover:text-body">Privacy</Link></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4 text-xs text-subtle sm:mt-7 sm:pt-5">
          <p>Preview <span className="mx-2 text-muted" aria-hidden="true">/</span> {previewVersion}</p>
          <nav aria-label="Website version" className="flex items-center gap-2"><span className="mr-2">Compare</span>{['v1', 'v2', 'v3', 'v4'].map(v => <Link key={v} href={'/' + v} aria-current={v === 'v3' ? 'page' : undefined} className={'rounded-md border px-3 py-2 uppercase ' + (v === 'v3' ? 'border-brand/40 bg-brand/10 text-highlight' : 'border-white/10 hover:border-white/30')}>{v}</Link>)}</nav>
        </div>
      </Container>
    </footer>
  </>
}

'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import { site } from '@/lib/site'
import { commentaryPromotionFor, isCommentaryPath, navigationForPath, publicationUi } from '@/lib/v3-publication'
import { CommentaryPromotion } from './CommentaryPromotion'
import { Arrow } from './Arrow'

export function V3Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/'
  const commentary = isCommentaryPath(pathname)
  const groups = navigationForPath(pathname)
  const publication = publicationUi()
  const [menuOpen, setMenuOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const desktopNavigation = useRef<HTMLElement>(null)
  const groupButtons = useRef<Record<string, HTMLButtonElement | null>>({})
  const closeNavigation = () => { setMenuOpen(false); setOpenGroup(null) }
  useEffect(() => { setMenuOpen(false); setOpenGroup(null) }, [pathname])
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const dismiss = () => { setMenuOpen(false); setOpenGroup(null) }
    desktop.addEventListener('change', dismiss)
    return () => desktop.removeEventListener('change', dismiss)
  }, [])
  useEffect(() => {
    if (!openGroup) return
    const dismiss = (event: PointerEvent) => {
      if (!desktopNavigation.current?.contains(event.target as Node)) setOpenGroup(null)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [openGroup])
  const navigationCta = (href: string) => href.endsWith('/for/miners') ? 'planner' : href.endsWith('/for/institutions') ? 'institutions' : href.endsWith('/smart-contracts') ? 'evidence' : href.endsWith('/resources') ? 'resources' : href.includes('/learn/') ? 'tutorial' : href === '/tools' ? 'calculator' : undefined
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/')
  const footerGroups = commentary ? [
    { title: 'Learn', links: [['Academy & guides', '/academy'], ['Articles', '/blog'], ['Mining glossary', '/glossary'], ['Worked example', '/learn/difficulty-exposure']] },
    { title: 'Data & Research', links: [['Research', '/research'], ['Data', '/data'], ['Forecast evaluation', '/data/scoreboard'], ['Methodology', '/methodology/difficulty-index']] },
    { title: 'Tools & references', links: [['Calculators', '/tools'], ['Resource library', '/resources'], ['Documentation', '/docs'], ['Risks & limitations', '/docs/risks-and-limitations']] },
    { title: 'About', links: [['About Doefin', '/about'], ['Research updates', '/resources#updates']] },
  ] : [
    { title: 'Product', links: [['How it works', '/product'], ['For miners', '/for/miners'], ['For finance teams, funds & desks', '/for/institutions']] },
    { title: 'Documentation', links: [['Start here', '/docs'], ['Contract mechanics', '/docs/what-doefin-settles-on'], ['Risks & limitations', '/docs/risks-and-limitations'], ['Technical review', '/docs/smart-contracts'], ['Key terms', '/docs/key-terms']] },
    { title: 'Resources', links: [['Resource library', '/resources'], ['Calculators', '/tools'], ['Academy & guides', '/academy'], ['Articles', '/blog'], ['Research', '/research'], ['Mining glossary', '/glossary']] },
    { title: 'Connect', links: [['About Doefin', '/about'], ['Talk to the team', 'mailto:' + site.contactEmail], ['Open app ↗', site.appUrl]] },
  ]
  return <>
    <header data-publication-surface={commentary ? 'commentary' : 'product'} onKeyDown={event => {
      if (event.key !== 'Escape') return
      if (openGroup) { setOpenGroup(null); groupButtons.current[openGroup]?.focus() }
      else if (menuOpen) { setMenuOpen(false); menuButton.current?.focus() }
    }} className={'sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur-lg' + (isLanding ? ' v37-chrome' : '')}>
      <Container>
        <div className="flex h-[76px] items-center justify-between gap-4">
          <div className="flex items-center gap-6 lg:gap-10"><Logo href="/" className="w-[88px] min-[375px]:w-[104px]" /><nav ref={desktopNavigation} aria-label="Main" className="hidden items-center gap-5 xl:gap-7 lg:flex">
            {groups.map((group, index) => {
              const id = `v3-navigation-${index}`
              const isOpen = openGroup === group.label
              return <div key={group.label} className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpenGroup(current => current === group.label ? null : current) }}>
                <button ref={element => { groupButtons.current[group.label] = element }} type="button" aria-expanded={isOpen} aria-controls={id} onClick={() => setOpenGroup(isOpen ? null : group.label)} className={'inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm font-medium hover:text-body ' + (group.items.some(item => active(item.href)) || isOpen ? 'text-body' : 'text-subtle')}>
                  {group.label}<svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" className={isOpen ? 'rotate-180' : ''}><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <div id={id} hidden={!isOpen} className="absolute left-0 top-full mt-2 w-[320px] overflow-hidden rounded-panel border border-white/15 bg-ink p-2 shadow-2xl">
                  <ul>{group.items.map(item => <li key={item.href}><Link href={item.href} data-v3-cta={navigationCta(item.href)} data-v3-placement="header" onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className={'block rounded-lg px-4 py-3 hover:bg-white/5 ' + (active(item.href) ? 'bg-brand/10' : '')}><span className="block text-sm font-semibold text-body">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-subtle">{item.description}</span></Link></li>)}</ul>
                </div>
              </div>
            })}
          </nav></div>
          <div className="flex items-center gap-2">
            {!commentary && <a href={site.appUrl} data-v3-cta="app" data-v3-placement="header" className="v37-nav-app inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition-colors hover:border-brand hover:bg-brand/10 sm:px-4">Open app <Arrow diagonal className="!h-4 !w-4" /></a>}
            <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="v3-mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 lg:hidden">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={menuOpen ? 'm5 5 10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <nav id="v3-mobile-menu" aria-label="Mobile main" hidden={!menuOpen} className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/10 pb-4 pt-2 lg:!hidden">
          {groups.map(group => <div key={group.label} className="border-b border-white/10 py-3">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.1em] text-subtle">{group.label}</p>
            <ul className="mt-2 grid min-[420px]:grid-cols-2">{group.items.map(item => <li key={item.href}><Link href={item.href} data-v3-cta={navigationCta(item.href)} data-v3-placement="header" onClick={closeNavigation} aria-current={pathname === item.href ? 'page' : undefined} className="block rounded-lg px-3 py-2.5 hover:bg-white/5"><span className="block text-sm font-semibold text-body">{item.label}</span><span className="mt-1 block text-xs leading-relaxed text-subtle">{item.description}</span></Link></li>)}</ul>
          </div>)}
          {!commentary && <a href={'mailto:' + site.contactEmail} className="block px-3 py-3 text-sm text-highlight">Talk to the team ↗</a>}
        </nav>
      </Container>
    </header>
    <main id="main" className="flex-1">
      {pathname !== '/' && publication.showPreviewLabel && <div className="border-b border-white/[0.07] bg-surface/20"><Container className="py-2.5"><p className="text-xs leading-relaxed text-subtle"><span className="font-semibold text-caution">V3 preview</span><span className="mx-2" aria-hidden="true">·</span>{commentary ? 'Educational and research material. Check the sources and evidence status on each page.' : pathname.startsWith('/for/') ? 'Read-only market data. Review execution and terms in the app.' : 'Examples are illustrative. Confirm current market terms in the app.'}</p></Container></div>}
      {children}
    </main>
    {commentary && <CommentaryPromotion promotion={commentaryPromotionFor(pathname)} />}
    <footer className={'border-t border-white/10 bg-surface/20' + (isLanding ? ' v37-chrome' : '')}>
      <Container className="py-7 sm:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1"><Logo href="/" className="w-24" /><p className="mt-3 text-sm leading-relaxed text-subtle lg:max-w-[240px]">{commentary ? 'Mining data, methods and reference material.' : 'Markets for Bitcoin mining difficulty.'}</p></div>
          {footerGroups.map(group => <div key={group.title}><h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">{group.title}</h2><ul className="mt-2 sm:mt-4">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center text-sm text-subtle hover:text-body">{label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle sm:mt-9 sm:gap-5 sm:pt-6">
          <p className="max-w-xl">For professional investors. Positions involve risk. Nothing here is investment advice. This prototype contains illustrative content.</p>
          <div className="flex gap-5"><Link href="/terms" className="inline-flex min-h-11 items-center hover:text-body">Terms</Link><Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-body">Privacy</Link></div>
        </div>

      </Container>
    </footer>
  </>
}

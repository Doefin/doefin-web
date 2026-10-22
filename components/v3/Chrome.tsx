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
  { label: 'Docs', href: '/v3/docs' },
  { label: 'About', href: '/v3/about' },
]

export function V3Chrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLanding = pathname === '/v3'
  const previewVersion = isLanding ? 'V3.22' : pathname === '/v3/for/miners' ? 'V3.6' : 'V3.3'
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  useEffect(() => setMenuOpen(false), [pathname])
  const active = (href: string) => pathname === href || pathname.startsWith(href + '/')
  return <>
    <header onKeyDown={event => { if (event.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus() } }} className={'sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur-lg' + (isLanding ? ' v37-chrome' : '')}>
      <Container>
        <div className="flex h-[76px] items-center justify-between gap-4">
          <div className="flex items-center gap-12"><Logo href="/v3" className="w-[88px] min-[375px]:w-[104px]" /><nav aria-label="Main" className="hidden items-center gap-7 md:flex">
            {navigation.map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} className={'py-3 text-sm font-medium transition-colors hover:text-body ' + (active(item.href) ? 'text-body' : 'text-subtle')}>{item.label}</Link>)}
          </nav></div>
          <div className="flex items-center gap-2">
            <a href={site.appUrl} className="v37-nav-app inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-white/20 px-3 py-2 text-sm font-semibold transition-colors hover:border-brand hover:bg-brand/10 sm:px-4">Open app <Arrow diagonal className="!h-4 !w-4" /></a>
            <button ref={menuButton} type="button" aria-expanded={menuOpen} aria-controls="v3-mobile-menu" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} onClick={() => setMenuOpen(!menuOpen)} className="grid h-11 w-11 place-items-center rounded-lg border border-white/15 md:hidden">
              <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={menuOpen ? 'm5 5 10 10M15 5 5 15' : 'M3 6h14M3 10h14M3 14h14'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
        <nav id="v3-mobile-menu" aria-label="Mobile main" hidden={!menuOpen} className="border-t border-white/10 pb-4 pt-2 md:!hidden">
          {navigation.map(item => <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm hover:bg-white/5">{item.label}</Link>)}
          <a href={'mailto:' + site.contactEmail} className="block px-3 py-3 text-sm text-highlight">Talk to the team ↗</a>
        </nav>
      </Container>
    </header>
    <main id="main" className="flex-1">
      {pathname !== '/v3' && <div className="border-b border-white/[0.07] bg-surface/20"><Container className="py-2.5"><p className="text-xs leading-relaxed text-subtle"><span className="font-semibold text-caution">{previewVersion} preview</span><span className="mx-2" aria-hidden="true">·</span>Examples are illustrative. Confirm current market terms in the app.</p></Container></div>}
      {children}
    </main>
    <footer className={'border-t border-white/10 bg-surface/20' + (isLanding ? ' v37-chrome' : '')}>
      <Container className="py-7 sm:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1"><Logo href="/v3" className="w-24" /><p className="mt-3 text-sm leading-relaxed text-subtle lg:max-w-[240px]">Markets for Bitcoin mining difficulty.</p></div>
          {[
            { title: 'Documentation', links: [['Start here', '/v3/docs'], ['Contract mechanics', '/v3/docs/what-doefin-settles-on'], ['Risks & limitations', '/v3/docs/risks-and-limitations'], ['Key terms', '/v3/docs/key-terms']] },
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

'use client'

import type { ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { usePathname } from 'next/navigation'
import { Container } from './Container'
import { Logo } from './Logo'
import { preview, previewNav, originalForPreview, previewForOriginal } from '@/lib/preview'
import { site } from '@/lib/site'

/** Route-aware chrome only. Page content and the original chrome are server-rendered slots. */
export function SiteChrome({ children, header, footer }: {
  children: ReactNode; header: ReactNode; footer: ReactNode
}) {
  const pathname = usePathname().replace(/\/+$/, '') || '/'
  const isPreview = pathname === preview.home || pathname.startsWith(preview.home + '/')
  const versionBar = <div className="border-b border-white/[0.07] bg-surface/40">
    <Container className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs">
      <p className="text-subtle"><span className="font-bold text-body">{isPreview ? 'Version 2' : 'Version 1'}</span><span className="mx-2" aria-hidden="true">/</span>{isPreview ? 'Product acquisition' : 'Research-led website'}</p>
      <nav aria-label="Website version" className="flex items-center gap-2">
        {[
          { label: 'V1', href: isPreview ? originalForPreview(pathname) : pathname, active: !isPreview },
          { label: 'V2', href: isPreview ? pathname : previewForOriginal(pathname), active: isPreview },
        ].map(version => <Link key={version.label} href={version.href} aria-current={version.active ? 'page' : undefined}
          className={'rounded-lg border px-3 py-1.5 font-bold ' + (version.active ? 'border-brand/40 bg-brand/15 text-highlight' : 'border-white/10 text-subtle hover:text-body')}>{version.label}</Link>)}
      </nav>
    </Container>
  </div>
  if (!isPreview) return <>{header}<main id="main" className="flex-1">{versionBar}{children}</main>{footer}</>

  const nav = (mobile = false) => (
    <nav aria-label={mobile ? 'Sections' : 'Main'} className={mobile
      ? '-mx-5 flex gap-1 overflow-x-auto px-5 pb-3 md:hidden'
      : 'hidden items-center gap-1 md:flex'}>
      {previewNav.map(item => {
        const active = pathname.startsWith(item.href) ||
          (item.href === preview.product && pathname.startsWith(preview.home + '/for/'))
        return <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}
          className={'whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-white/[0.06] hover:text-body ' +
            (active ? 'bg-brand/10 text-highlight' : 'text-subtle')}>
          {item.label}
        </Link>
      })}
    </nav>
  )
  return <>
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink/95 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8"><Logo href={preview.home} />{nav()}</div>
          <a href={site.appUrl} className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:brightness-110">Open app</a>
        </div>
        {nav(true)}
      </Container>
    </header>
    <main id="main" className="flex-1">
      {versionBar}
      {children}
    </main>
    <footer className="mt-20 border-t border-white/[0.07] bg-surface/40">
      <Container className="py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div><Logo href={preview.home} /><p className="mt-4 max-w-xs text-sm leading-relaxed text-subtle">Understand mining economics.<br />Make the next step an informed one.</p></div>
          {[
            { title: 'Product', links: [{ label: 'For miners', href: preview.miners }, { label: 'For funds & desks', href: preview.institutions }, { label: 'Settlement mechanics', href: preview.settlement }] },
            { title: 'Explore', links: [{ label: 'Tools', href: preview.tools }, { label: 'Data & Research', href: preview.research }, { label: 'Learn', href: preview.learn }] },
            { title: 'Get started', links: [{ label: 'Calculate exposure', href: preview.exposure }, { label: 'Follow the tutorial', href: preview.tutorial }, { label: 'Contact Doefin', href: 'mailto:' + site.contactEmail }] },
          ].map(group => <div key={group.title}><h2 className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">{group.title}</h2><ul className="mt-4 space-y-3">{group.links.map(link => <li key={link.href}><Link href={link.href} className="text-sm text-subtle hover:text-body">{link.label}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-10 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-xs leading-relaxed text-subtle">
          <p className="max-w-2xl">Doefin is for professional investors. Positions involve risk. Nothing here is investment advice. This preview uses illustrative content.</p>
          <p className="flex gap-4"><Link href="/terms" target="_blank" rel="noopener noreferrer">Terms ↗</Link><Link href="/privacy" target="_blank" rel="noopener noreferrer">Privacy ↗</Link></p>
        </div>
      </Container>
    </footer>
  </>
}

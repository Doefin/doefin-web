'use client'

import type { ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import { site } from '@/lib/site'
import { commentaryPromotionFor, isCommentaryPath } from '@/lib/v3-publication'
import { CommentaryPromotion } from './CommentaryPromotion'
import { SiteHeader } from './SiteHeader'
import { languages, type Language } from '@/lib/languages'
import type { NavigationCopy } from '@/dictionaries'

export type ChromeLabels = {
  language: string
  main: string
  closeNavigation: string
  openNavigation: string
  browseDoefin: string
  contact: string
  enterApp: string
  tagline: string
  risk: string
  terms: string
  privacy: string
}

export function V3Chrome({ children, labels, language, navigation }: { children: ReactNode; labels: ChromeLabels; language: Language; navigation: NavigationCopy }) {
  const pathname = usePathname()
  const untrailed = pathname.replace(/\/$/, '')
  const isLanding = untrailed === '' || Object.values(languages).some(option => option.path === untrailed)
  const translate = (text: string) => navigation[text] ?? text
  const commentary = isCommentaryPath(pathname)
  const footerGroups = commentary ? [
    { title: 'Learn', links: [['Academy & guides', '/academy'], ['Articles', '/blog'], ['Mining glossary', '/glossary'], ['Worked example', '/learn/difficulty-exposure']] },
    { title: 'Data & Research', links: [['Research', '/research'], ['Data', '/data'], ['Forecast evaluation', '/data/scoreboard'], ['Methodology', '/methodology/difficulty-index']] },
    { title: 'Tools & references', links: [['Calculators', '/tools'], ['Resource library', '/resources'], ['Documentation', '/docs'], ['Risks & limitations', '/docs/risks-and-limitations']] },
    { title: 'About', links: [['About Doefin', '/about'], ['Research updates', '/resources#updates']] },
  ] : [
    { title: 'Product', links: [['How it works', '/product'], ['For miners', '/for/miners'], ['For finance teams, funds & desks', '/for/institutions']] },
    { title: 'Documentation', links: [['Start here', '/docs'], ['Contract mechanics', '/docs/what-doefin-settles-on'], ['Risks & limitations', '/docs/risks-and-limitations'], ['Technical review', '/docs/smart-contracts'], ['Key terms', '/docs/key-terms']] },
    { title: 'Resources', links: [['Resource library', '/resources'], ['Calculators', '/tools'], ['Academy & guides', '/academy'], ['Articles', '/blog'], ['Research', '/research'], ['Mining glossary', '/glossary']] },
    { title: 'Connect', links: [['About Doefin', '/about'], ['Contact the team', 'mailto:' + site.contactEmail], ['Enter app ↗', site.appUrl]] },
  ]
  return <>
    <SiteHeader pathname={pathname} commentary={commentary} isLanding={isLanding} language={language} labels={labels} translate={translate} />
    <main id="main" className="flex-1">
      {children}
    </main>
    {commentary && <CommentaryPromotion promotion={commentaryPromotionFor(pathname)} />}
    <footer className={'border-t border-white/10 bg-surface/20' + (isLanding ? ' v37-chrome' : '')}>
      <Container className="py-7 sm:py-10">
        <div className="grid grid-cols-2 gap-x-5 gap-y-6 sm:gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 lg:col-span-1"><Logo href={language === 'en' ? '/' : languages[language].path} className="w-24" /><p className="mt-3 text-sm leading-relaxed text-subtle lg:max-w-[240px]">{commentary ? 'Mining data, methods and reference material.' : labels.tagline}</p></div>
          {footerGroups.map(group => <div key={group.title}><h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">{translate(group.title)}</h2><ul className="mt-2 sm:mt-4">{group.links.map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center text-sm text-subtle hover:text-body">{translate(label)}</Link></li>)}</ul></div>)}
        </div>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-3 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle sm:mt-9 sm:gap-5 sm:pt-6">
          <p className="max-w-xl">{labels.risk}</p>
          <div className="flex gap-5"><Link href="/terms" className="inline-flex min-h-11 items-center hover:text-body">{labels.terms}</Link><Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-body">{labels.privacy}</Link></div>
        </div>

      </Container>
    </footer>
  </>
}

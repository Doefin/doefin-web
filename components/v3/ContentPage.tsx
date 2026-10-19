import type { ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/ui'

export function ContentPage({ title, summary, eyebrow, crumbs, children }: {
  title: string
  summary: string
  eyebrow: string
  crumbs: { name: string; href: string }[]
  children: ReactNode
}) {
  return <Container size="narrow" className="py-12 sm:py-16">
    <Breadcrumbs items={crumbs} />
    <div className="mt-7"><PageHeader eyebrow={eyebrow} title={title} lede={summary} /></div>
    <div className="mt-10">{children}</div>
  </Container>
}

export function ContentLinks({ links }: { links: { href: string; label: string }[] }) {
  return <nav aria-label="Related reading" className="mt-12 border-t border-white/10 pt-7">
    <h2 className="text-lg font-bold">Continue exploring</h2>
    <ul className="mt-4 space-y-3">{links.map(link => <li key={link.href}><Link href={link.href} className="inline-flex min-h-8 items-center text-sm font-semibold text-highlight underline-offset-4 hover:underline">{link.label} <span className="ml-2" aria-hidden="true">→</span></Link></li>)}</ul>
  </nav>
}

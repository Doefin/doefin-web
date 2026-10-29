import type { ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/ui'
import { allV3Docs, v3DocGroups, type V3Doc } from '@/content'
import { DocsPublicationProvider } from '@/components/routing/DocsPublicationContext'

function DocsNavigation({ activeSlug, docs }: { activeSlug?: string; docs: V3Doc[] }) {
  return <nav aria-label="Documentation sections">
    <Link href="/docs" aria-current={!activeSlug ? 'page' : undefined} className={'inline-flex min-h-10 items-center text-sm font-bold ' + (!activeSlug ? 'text-highlight' : 'text-body hover:text-highlight')}>Documentation home</Link>
    <div className="mt-5 space-y-6">{v3DocGroups.map(group => <div key={group}>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-subtle">{group}</p>
      <ul className="space-y-1">{docs.filter(doc => doc.group === group).map(doc => <li key={doc.slug}>
        <Link href={'/docs/' + doc.slug} aria-current={doc.slug === activeSlug ? 'page' : undefined}
          className={'block rounded-lg border-l-2 px-3 py-2 text-sm leading-snug ' + (doc.slug === activeSlug ? 'border-brand bg-brand/10 font-semibold text-highlight' : 'border-transparent text-subtle hover:bg-white/[0.04] hover:text-body')}>
          {doc.title}
        </Link>
      </li>)}</ul>
    </div>)}</div>
  </nav>
}

/** Server-rendered reading environment shared by the index and every docs page. */
export async function V3DocsLayout({ activeSlug, title, summary, eyebrow, children }: {
  activeSlug?: string
  title: string
  summary: string
  eyebrow: string
  children: ReactNode
}) {
  const docs = await allV3Docs()
  return <DocsPublicationProvider slugs={docs.map(doc => doc.slug)}><Container className="py-8 sm:py-12 [overflow-wrap:anywhere]">
    <div className="grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12">
      <aside className="sticky top-36 hidden max-h-[calc(100dvh-10rem)] overflow-y-auto border-r border-white/10 pr-5 pb-5 lg:block">
        <DocsNavigation activeSlug={activeSlug} docs={docs} />
      </aside>
      <div className="min-w-0">
        <details key={activeSlug ?? 'docs-home'} className="mb-7 rounded-lg border border-white/15 bg-surface/40 p-4 lg:hidden">
          <summary className="cursor-pointer text-sm font-semibold text-highlight">Browse documentation<span className="mt-1 block text-xs font-normal text-subtle">Current: {activeSlug ? title : 'Documentation home'}</span></summary>
          <div className="mt-4 border-t border-white/10 pt-3"><DocsNavigation activeSlug={activeSlug} docs={docs} /></div>
        </details>
        <article id="docs-content" className="max-w-prose scroll-mt-36">
          <Breadcrumbs items={[{ name: 'Documentation', href: '/docs' }, ...(activeSlug ? [{ name: title, href: '/docs/' + activeSlug }] : [])]} />
          <header className="mt-7"><PageHeader eyebrow={eyebrow} title={title} lede={summary} /></header>
          <div className="mt-8">{children}</div>
        </article>
      </div>
    </div>
  </Container></DocsPublicationProvider>
}

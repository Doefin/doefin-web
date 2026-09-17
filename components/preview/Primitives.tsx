import Link from '@/components/routing/SiteLink'
import type { ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui'
import { seo } from '@/lib/seo'
import { preview } from '@/lib/preview'

export const previewSeo = (title: string, description: string, path: string) => ({
  ...seo({ title, description, path }),
  robots: { index: false, follow: false },
})

export const panelClass = 'rounded-panel border border-white/10 bg-surface/60 p-6 sm:p-8'
export const headingClass = 'text-balance text-2xl font-extrabold tracking-[-0.03em] sm:text-3xl'

export function PageIntro({ section, title, description, children }: {
  section: string; title: string; description: string; children?: ReactNode
}) {
  return <header className="border-b border-white/10 bg-gradient-to-br from-ink to-surfaceAlt/30">
    <Container className="py-12 sm:py-16">
      <Link href={preview.home} className="mb-8 inline-block text-xs font-medium text-subtle hover:text-body">Doefin <span aria-hidden="true">/</span> {section}</Link>
      <Eyebrow>{section}</Eyebrow>
      <h1 className="max-w-4xl text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-[1.75] text-subtle">{description}</p>
      {children ? <div className="mt-7">{children}</div> : null}
    </Container>
  </header>
}

export type RelatedLink = { href: string; title: string; text: string }

export function LinkCards({ items }: { items: RelatedLink[] }) {
  return <div className="grid gap-4 md:grid-cols-3">{items.map((item, i) =>
    <Link key={item.href} href={item.href} className={panelClass + ' group flex flex-col transition-colors hover:border-brand/50'}>
      <span className="mb-7 flex items-center justify-between text-sm font-semibold text-highlight"><span className="tabular">0{i + 1}</span><span aria-hidden="true">↗</span></span>
      <h3 className="text-xl font-bold tracking-[-0.02em] group-hover:text-highlight">{item.title}</h3>
      <p className="mt-3 text-sm leading-[1.75] text-subtle">{item.text}</p>
    </Link>
  )}</div>
}

export function RelatedContent({ learning, action }: { learning: RelatedLink; action: RelatedLink }) {
  return <section aria-label="Continue your journey" className="mt-14 grid gap-5 border-t border-white/10 pt-10 md:grid-cols-2">
    {[{ ...learning, label: 'Keep learning' }, { ...action, label: 'Try with your numbers' }].map(item =>
      <Link key={item.label} href={item.href} className={panelClass + ' hover:border-brand/50'}>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-highlight">{item.label}</p>
        <h2 className="mt-4 text-xl font-bold">{item.title} <span aria-hidden="true">→</span></h2>
        <p className="mt-3 text-sm leading-relaxed text-subtle">{item.text}</p>
      </Link>
    )}
  </section>
}

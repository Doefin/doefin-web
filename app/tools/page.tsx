import { Container } from '@/components/layout/Container'
import { Callout, PageHeader, Panel, Tag } from '@/components/ui'
import { seo } from '@/lib/seo'
import { guideFor, TOOLS } from '@/content'
import Link from 'next/link'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Tools',
  description:
    'Calculators for the questions Bitcoin miners actually argue about — hosting cost, fleet payback, difficulty exposure.',
  path: '/tools',
})


export default function ToolsPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }]} />

      <PageHeader
        eyebrow="Tools"
        title="Free, no sign-up, built to be shared"
        lede="Stateless calculators with inputs encoded in the URL, so you can post your own scenario into a conversation."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {TOOLS.map((t) => (
          <Link key={t.slug} href={`/tools/${t.slug}`} className="group">
            <Panel className="h-full transition-colors group-hover:border-brand/40">
              <Tag>{t.status === 'live' ? 'Live' : 'Planned'}</Tag>
              <h2 className="mt-4 text-lg font-bold leading-snug tracking-[-0.015em]">{t.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{t.summary}</p>
            </Panel>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <Callout title="Every tool ships with a readable twin">
          <p>
            A calculator’s output only exists after someone types into it, and AI crawlers do not run
            JavaScript. So each tool is published alongside worked examples and a full written guide —
            the tool converts a visitor, the written page is what gets cited.
          </p>
        </Callout>
      </div>

      <section className="mt-14">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Guides</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          If you would rather read than drag sliders, each calculator has a written guide covering
          every setting and where to find your own figures.
        </p>
        <ul className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {TOOLS.map((t) => {
            const g = guideFor(t.slug)
            if (!g) return null
            return (
              <li key={t.slug}>
                <Link
                  href={`/academy/guides/${t.slug}`}
                  className="group flex items-center justify-between gap-6 py-5"
                >
                  <span>
                    <span className="block font-bold tracking-[-0.015em] group-hover:text-brand">
                      {g.article.title}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted">
                      {g.article.summary}
                    </span>
                  </span>
                  <span aria-hidden className="text-xl text-muted transition-transform group-hover:translate-x-1 group-hover:text-brand">
                    →
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <NextLinks
        items={[
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/for/miners', label: 'For miners', note: 'What difficulty risk looks like on a real site.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

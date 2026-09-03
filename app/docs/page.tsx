import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { Callout, PageHeader, Tag } from '@/components/ui'
import { docGroups, docs } from '@/content'
import { seo } from '@/lib/seo'
import { AppCTA } from '@/components/content/NextStep'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Documentation',
  description:
    'How to use Doefin — what markets settle on, how settlement works, placing and managing positions.',
  path: '/docs',
})

export default function DocsIndex() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Docs', href: '/docs' }]} />

      <PageHeader
        eyebrow="Documentation"
        title="How Doefin works"
        lede="Product documentation, published here rather than inside the application so it can be found by search."
      />

      <div className="mt-12 space-y-10">
        {docGroups.map((group) => {
          const items = docs.filter((d) => d.group === group)
          if (!items.length) return null
          return (
            <section key={group}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-muted">{group}</h2>
              <ul className="divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {items.map((d) => (
                  <li key={d.slug} className="py-4">
                    {d.status === 'published' ? (
                      <Link href={`/docs/${d.slug}`} className="group flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-bold text-body group-hover:text-brand">{d.title}</span>
                        <span className="text-[15px] text-muted">{d.summary}</span>
                      </Link>
                    ) : (
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                        <span className="font-bold text-muted">{d.title}</span>
                        <span className="text-[15px] text-muted/70">{d.summary}</span>
                        <Tag>Awaiting migration</Tag>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      <div className="mt-10">
        <Callout tone="caution" title="Migration pending">
          <p>
            Most of these pages exist today inside the trading application, where they return
            nothing to search engines. Moving them here is the largest single body of prose we
            already own and the fastest visibility win available.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
        ]}
      />

      <AppCTA
        title="Ready to trade it"
        blurb="The mechanics are above. The venue is where you act on them."
      />

      <Reviewed />
    </Container>
  )
}

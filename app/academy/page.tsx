import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader, Panel, Tag } from '@/components/ui'
import { allAcademy, allGuides } from '@/content'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Learn',
  description:
    'How Bitcoin mining difficulty works, what hashprice measures, and why a forecast without an error bar is not a forecast.',
  path: '/academy',
})

const LEVELS = ['intro', 'working', 'technical'] as const
const LABEL = { intro: 'Start here', working: 'Working knowledge', technical: 'Technical' }

export default function AcademyIndex() {
  const posts = allAcademy()
  const guides = allGuides()
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Learn', href: '/academy' }]} />

      <PageHeader
        eyebrow="Learn"
        title="Understand difficulty before you trade it"
        lede="Concept explanations, written for a first encounter and deliberately not about our product."
      />
      <div className="mt-12 space-y-12">
        {LEVELS.map((level) => {
          const group = posts.filter((p) => p.level === level)
          if (!group.length) return null
          return (
            <section key={level}>
              <h2 className="mb-5 text-xs font-bold uppercase tracking-[0.12em] text-muted">
                {LABEL[level]}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                {group.map((p) => (
                  <Link key={p.slug} href={`/academy/${p.slug}`} className="group">
                    <Panel as="article" className="h-full transition-colors group-hover:border-brand/40">
                      <Tag>{LABEL[p.level]}</Tag>
                      <h3 className="mt-4 text-lg font-bold leading-snug tracking-[-0.015em]">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted">{p.summary}</p>
                    </Panel>
                  </Link>
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <section id="guides" className="mt-16 scroll-mt-24 border-t border-white/[0.07] pt-12">
        <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Tool guides</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          The long version of each calculator: what every setting means, where to find your own
          number, and what the answer does not cover.
        </p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {guides.map(({ slug, guide }) => (
            <Link key={slug} href={`/academy/guides/${slug}`} className="group">
              <Panel as="article" className="h-full transition-colors group-hover:border-brand/40">
                <Tag>Guide</Tag>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-[-0.015em]">
                  {guide.article.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{guide.article.summary}</p>
              </Panel>
            </Link>
          ))}
        </div>
      </section>

      <NextLinks
        items={[
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

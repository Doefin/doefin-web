import { Subscribe } from '@/components/content/Subscribe'
import { Container } from '@/components/layout/Container'
import { Callout, PageHeader, Panel } from '@/components/ui'
import { seo } from '@/lib/seo'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'The Doefin newsletter',
  description:
    'Reports, insights and analysis on Bitcoin mining difficulty, sent to miners, funds and trading desks. Commentary, never a sales message.',
  path: '/newsletter',
})

export default function NewsletterPage() {
  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs items={[{ name: 'Newsletter', href: '/newsletter' }]} />

      <PageHeader
        eyebrow="Newsletter"
        title="Research, in your inbox"
        lede="Every difficulty adjustment, what our forecast said, and where it was wrong. Plus the research reports as they publish."
      />

      <div className="mt-10">
        <Subscribe title="Subscribe" blurb="Roughly two emails a month. No product pitches." />
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {[
          { h: 'Every epoch', b: 'What we forecast, the band around it, and what actually happened — including the times we were wrong.' },
          { h: 'Research first', b: 'Reports land in your inbox before they are promoted anywhere else.' },
          { h: 'Nothing else', b: 'No product announcements, no partner offers, no reselling your address.' },
        ].map((c) => (
          <Panel key={c.h}>
            <h2 className="text-base font-bold tracking-[-0.015em]">{c.h}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.b}</p>
          </Panel>
        ))}
      </div>

      <div className="mt-10">
        <Callout title="Articles live on this site">
          <p>
            The newsletter links to the research rather than reproducing it. The full piece always
            stays here, free and ungated, so it can be read, quoted and cited without an email
            address.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
        ]}
      />

      <Reviewed />
    </Container>
  )
}

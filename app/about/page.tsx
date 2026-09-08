import { Container } from '@/components/layout/Container'
import { Callout, PageHeader } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { getAuthor } from '@/content'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'About',
  description: `${site.entity} publishes open Bitcoin mining difficulty data and operates Doefin, a venue for difficulty derivatives.`,
  path: '/about',
})

export default function AboutPage() {
  const research = getAuthor('doefin-research')

  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs items={[{ name: 'About', href: '/about' }]} />

      <PageHeader
        eyebrow="About"
        title="Who we are"
        lede={`${site.entity} publishes open Bitcoin mining data and operates Doefin, a venue for difficulty derivatives.`}
      />

      <div className="mt-10 max-w-prose space-y-5 text-[17px] leading-[1.72] text-subtle">
        <p>
          We publish forward difficulty forecasts with fitted confidence intervals, and a public
          scoreboard scoring every estimator — including our own — on what actually happened.
        </p>
        <p>
          The method is published, versioned and reproducible from public chain data. Where a figure
          is a judgement rather than a measurement, we label it as one.
        </p>
      </div>

      {/* The target of every article's author node. An author url that 404s is
          worse than no author node, so this section and content/authors.ts have
          to move together. */}
      <section id="doefin-research" className="mt-14 scroll-mt-24 border-t border-white/[0.07] pt-10">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">{research.name}</h2>
        <p className="mt-4 max-w-prose text-[17px] leading-[1.72] text-subtle">
          {research.description}
        </p>
        <p className="mt-4 max-w-prose text-[17px] leading-[1.72] text-subtle">
          Everything published under this byline is the work of one research desk rather than a
          named individual. We would rather say that plainly than attach a person&rsquo;s name to a
          figure they did not personally compute.
        </p>
      </section>

      <FAQ
        items={[
          {
            q: 'Is Doefin regulated?',
            a: 'Doefin is registered in Port Louis, Mauritius and is available to professional investors only. Nothing published on this site is investment advice or a recommendation.',
          },
          {
            q: 'Who can use Doefin?',
            a: 'Professional investors only. The venue terms exclude retail participants, and the site is written for mining operators, funds and trading desks rather than a general audience.',
          },
          {
            q: 'Is the data free to use?',
            a: 'Yes. Forecasts, the accuracy scoreboard and the underlying datasets are published free and keyless, with an attribution request rather than a licence. We ask for a link back and that the metric is named as published.',
          },
        ]}
      />

      <div className="mt-10 space-y-4">
        <Callout tone="caution" title="Regulatory position">
          <p>
            {site.entity} is registered in {site.registeredIn} and is available
            to professional investors only. Nothing published here is investment advice or an
            invitation to engage in investment activity.
          </p>
        </Callout>
        <Callout title="Conflict of interest">
          <p>
            We publish forecasts on a variable our own market settles against. Every forecast is
            written to a dated, immutable public archive at the moment it is made, so it can be
            scored later by anyone — including against us.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

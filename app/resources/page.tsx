import { Container } from '@/components/layout/Container'
import { Callout, DataTable, PageHeader } from '@/components/ui'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Resources',
  description:
    'Open data, client libraries and datasets for Bitcoin mining difficulty and hashrate. Free with attribution.',
  path: '/resources',
})

export default function ResourcesPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Resources', href: '/resources' }]} />

      <PageHeader
        eyebrow="Resources"
        title="Open data and libraries"
        lede="Our numbers are published free and keyless, with an attribution request rather than a licence."
      />

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.02em]">Planned endpoints</h2>
        <DataTable
          head={['Path', 'Returns', 'Format']}
          rows={[
            ['/api/v1/difficulty/latest', 'Current forecast, interval and block height', 'JSON'],
            ['/api/v1/difficulty/history', 'Every epoch, forecast and realised', 'JSON · CSV'],
            ['/api/v1/difficulty/epoch/{height}', 'One epoch, permanently addressable', 'JSON'],
            ['/api/v1/scoreboard/latest', 'Estimator accuracy and calibration', 'JSON · CSV'],
            ['/api/v1/hashrate/history', 'Hashrate with error bands', 'JSON · CSV'],
          ]}
        />
      </section>

      <div className="mt-10">
        <Callout title="Attribution, not a licence">
          <p>
            Use the data in your product, your notebook or your paper. We ask for a link back and
            that you name the metric as published, so unlinked mentions stay attributable.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

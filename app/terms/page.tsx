import { Container } from '@/components/layout/Container'
import { Callout, PageHeader, Prose } from '@/components/ui'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'

export const metadata = seo({
  title: 'Terms of use',
  description: 'The terms on which Doefin is made available.',
  path: '/terms',
})

export default function Page() {
  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs items={[{ name: 'Terms', href: '/terms' }]} />

      <PageHeader title="Terms of use" lede="The terms on which Doefin is made available." />
      <div className="mt-8">
        <Prose
          paragraphs={[
            `${site.entity} is registered in ${site.registeredIn} and made available to professional investors only.`,
            'Nothing published on this site constitutes investment advice, an offer, or an invitation to engage in investment activity.',
          ]}
        />
      </div>
      <div className="mt-8">
        <Callout tone="caution" title="Awaiting legal drafting">
          <p>
            This page exists so the site has no broken links and the layout can be reviewed. The
            operative text must be drafted by counsel before launch.
          </p>
        </Callout>
      </div>
    </Container>
  )
}

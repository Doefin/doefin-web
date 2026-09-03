import Link from 'next/link'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/ui'
import { allGlossary } from '@/content'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Bitcoin mining glossary',
  description:
    'Every term in Bitcoin mining difficulty and hashrate economics, defined once, properly.',
  path: '/glossary',
})

export default function GlossaryIndex() {
  const terms = allGlossary()
  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'DefinedTermSet',
          name: 'Bitcoin mining glossary',
          url: `${site.url}/glossary`,
          hasDefinedTerm: terms.map((t) => ({
            '@type': 'DefinedTerm',
            name: t.term,
            description: t.shortDef,
            url: `${site.url}/glossary/${t.slug}`,
          })),
        })}
      />
      <Breadcrumbs items={[{ name: 'Glossary', href: '/glossary' }]} />

      <PageHeader
        eyebrow="Glossary"
        title="Bitcoin mining glossary"
        lede="Every term defined once, properly, on its own page. Short definitions first — they are what gets quoted."
      />
      <dl className="mt-12 divide-y divide-white/[0.07] border-y border-white/[0.07]">
        {terms.map((t) => (
          <div key={t.slug} className="grid gap-2 py-5 md:grid-cols-[15rem_1fr] md:gap-8">
            <dt>
              <Link href={`/glossary/${t.slug}`} className="font-bold text-body hover:text-brand">
                {t.term}
              </Link>
              {t.aliases?.length ? (
                <p className="mt-1 text-xs text-muted/70">also: {t.aliases.join(', ')}</p>
              ) : null}
            </dt>
            <dd className="text-[15px] leading-relaxed text-muted">{t.shortDef}</dd>
          </div>
        ))}
      </dl>

      <NextLinks
        items={[
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
        ]}
      />

      <Reviewed />
    </Container>
  )
}

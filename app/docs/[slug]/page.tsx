import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { Container } from '@/components/layout/Container'
import { Eyebrow } from '@/components/ui'
import { docs, publishedDocs } from '@/content'
import { seo } from '@/lib/seo'
import { AppCTA } from '@/components/content/NextStep'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return publishedDocs().map((d) => ({ slug: d.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const d = docs.find((x) => x.slug === slug)
  if (!d) return {}
  return seo({ title: d.title, description: d.summary, path: `/docs/${d.slug}` })
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const doc = docs.find((d) => d.slug === slug && d.status === 'published')
  if (!doc) notFound()

  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs items={[{ name: 'Docs', href: '/docs' }, { name: doc.title, href: `/docs/${doc.slug}` }]} />
      <div className="mt-6">
        <Eyebrow>{doc.group}</Eyebrow>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {doc.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{doc.summary}</p>
      </div>
      <div className="mt-8">
        <AutoLinkedProse paragraphs={doc.body} />
      </div>

      <NextLinks
        items={[
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
          { href: '/docs', label: 'Documentation', note: 'Contract specifications and settlement mechanics.' },
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

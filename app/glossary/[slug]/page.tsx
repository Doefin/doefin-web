import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Prose } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allGlossary, getGlossary } from '@/content'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return allGlossary().map((t) => ({ slug: t.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getGlossary(slug)
  if (!t) return {}
  return seo({
    title: `${t.term} — definition`,
    description: t.shortDef,
    path: `/glossary/${t.slug}`,
  })
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const term = getGlossary(slug)
  if (!term) notFound()
  const seeAlso = (term.seeAlso ?? []).map(getGlossary).filter(Boolean)

  return (
    <Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: term.term,
          description: term.shortDef,
          url: `${site.url}/glossary/${term.slug}`,
          inDefinedTermSet: `${site.url}/glossary`,
        })}
      />
      <Breadcrumbs items={[{ name: 'Glossary', href: '/glossary' }, { name: term.term, href: `/glossary/${term.slug}` }]} />
      <h1 className="mt-6 text-4xl font-extrabold tracking-[-0.03em]">{term.term}</h1>

      {/* The short definition is the product — front-loaded, quotable, complete.
          Presented under the question people actually ask, because that exact
          phrasing is what an assistant matches against. */}
      <h2 className="mt-8 text-sm font-bold uppercase tracking-[0.12em] text-muted">
        What is {term.term.toLowerCase()}?
      </h2>
      <p className="mt-3 border-l-[3px] border-brand pl-5 text-xl leading-relaxed text-body">
        {term.shortDef}
      </p>

      {term.aliases?.length ? (
        <p className="mt-4 text-sm text-muted">Also known as: {term.aliases.join(', ')}</p>
      ) : null}

      <div className="mt-8">
        <Prose paragraphs={term.body} />
      </div>

      {seeAlso.length ? (
        <aside className="mt-12 border-t border-white/[0.07] pt-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">See also</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {seeAlso.map((t) => (
              <li key={t!.slug}>
                <Link
                  href={`/glossary/${t!.slug}`}
                  className="inline-block rounded-lg border border-white/[0.1] px-3 py-1.5 text-sm text-subtle hover:border-brand/50 hover:text-body"
                >
                  {t!.term}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

      <FAQ
        title="Quick answers"
        items={[
          { q: `What is ${term.term.toLowerCase()}?`, a: term.shortDef },
          ...(term.aliases?.length
            ? [{
                q: `What else is ${term.term.toLowerCase()} called?`,
                a: `${term.term} is also referred to as ${term.aliases.join(', ')}.`,
              }]
            : []),
        ]}
      />

      <p className="mt-10 text-xs text-muted/70">Last reviewed {term.updatedAt}</p>

      <NextLinks
        items={[
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
        ]}
      />

      <Reviewed />
    </Container>
  )
}

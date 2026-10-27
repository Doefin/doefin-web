import { GlossaryPreviewNotice } from './GlossaryPreviewNotice'
import Link from '@/components/routing/SiteLink'
import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PageHeader } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'
import { Subscribe } from '@/components/content/Subscribe'
import { GuideArticle } from '@/components/tools/GuideArticle'
import { nextLinksForTerm, usedBy } from '@/content/graph'
import { allGlossary, getGlossary, guideFor, TOOLS, getAuthor } from '@/content'
import { dateLong } from '@/lib/format'
import { jsonLd, publisherRef, authorNode } from '@/lib/seo'
import { site } from '@/lib/site'
import type { SiteVersion } from '@/lib/versioning'

// Shared server renderers accept an explicit schema version. Next page wrappers
// keep their normal PageProps, and all retained content uses V3 URLs.
export async function ReferenceGlossaryIndex({ schemaVersion = 'v3' }: { schemaVersion?: SiteVersion }) {
  const terms = await allGlossary()
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
        }, schemaVersion)}
      />
      <Breadcrumbs schemaVersion={schemaVersion} items={[{ name: 'Glossary', href: '/glossary' }]} />

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


export async function ReferenceTermPage({ params, schemaVersion = 'v3' }: { params: Promise<{ slug: string }>; schemaVersion?: SiteVersion }) {
  const { slug } = await params
  const term = await getGlossary(slug)
  if (!term) notFound()
  const terms = await allGlossary()
  const seeAlso = (term.seeAlso ?? []).map(slug => terms.find(t => t.slug === slug)).filter(Boolean)
  // The return leg. Prose has always linked down into the glossary; nothing linked
  // back out. This also gives each of the 19 otherwise near-identical term pages a
  // block of content unique to it.
  const uses = await usedBy(term.slug, terms)

  return (
    <><GlossaryPreviewNotice /><Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'DefinedTerm',
          name: term.term,
          description: term.shortDef,
          url: `${site.url}/glossary/${term.slug}`,
          inDefinedTermSet: `${site.url}/glossary`,
        }, schemaVersion)}
      />
      <Breadcrumbs schemaVersion={schemaVersion} items={[{ name: 'Glossary', href: '/glossary' }, { name: term.term, href: `/glossary/${term.slug}` }]} />
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
        <AutoLinkedProse paragraphs={term.body} skip={[term.slug]} />
      </div>

      {uses.length ? (
        <aside className="mt-12 border-t border-white/[0.07] pt-8 [overflow-wrap:anywhere]">
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
            Where this term is used
          </h2>
          <ul className="mt-4 space-y-3">
            {uses.slice(0, 5).map((u) => (
              <li key={u.href}>
                <Link href={u.href} className="group block">
                  <span className="font-semibold leading-snug tracking-[-0.015em] group-hover:text-brand">
                    {u.title}
                  </span>
                  <span className="mt-0.5 block text-[14px] leading-relaxed text-muted">
                    {u.summary}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}

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

      {/* Authored questions, not a template. The two generated pairs this
          replaces restated the short definition rendered directly above and the
          aliases rendered directly above that — the same text three times, which
          is the shape a near-duplicate assessment picks up. */}
      <FAQ title="Quick answers" items={term.faq} />

      <p className="mt-10 text-xs text-muted/70">Last reviewed {term.updatedAt}</p>

      <NextLinks className="[overflow-wrap:anywhere]" items={await nextLinksForTerm(term.slug, terms)} />

      <Reviewed date={term.updatedAt} />
    </Container></>
  )
}


export async function ReferenceGuidePage({ params, schemaVersion = 'v3' }: { params: Promise<{ slug: string }>; schemaVersion?: SiteVersion }) {
  const { slug } = await params
  const g = guideFor(slug)
  const tool = TOOLS.find((t) => t.slug === slug)
  if (!g || !tool) notFound()

  return (
    <Container size="narrow" className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: g.article.title,
          description: g.article.summary,
          datePublished: g.article.publishedAt,
          author: authorNode(getAuthor('doefin-research')),
          publisher: publisherRef,
          about: { '@type': 'Thing', name: tool.title },
          mainEntityOfPage: `${site.url}/academy/guides/${slug}`,
        }, schemaVersion)}
      />
      <Breadcrumbs
        schemaVersion={schemaVersion}
        items={[
          { name: 'Learn', href: '/academy' },
          { name: 'Tool guides', href: '/academy#guides' },
          { name: g.article.title, href: `/academy/guides/${slug}` },
        ]}
      />

      <article className="mt-6">
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">Tool guide</p>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.08] tracking-[-0.03em]">
          {g.article.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted">{g.article.summary}</p>
        <p className="mt-5 border-b border-white/[0.07] pb-6 text-sm text-muted/80">
          Doefin Research · {dateLong(g.article.publishedAt)}
        </p>

        <GuideArticle g={g} slug={slug} toolTitle={tool.title} />
      </article>

      <NextLinks
        items={[
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          schemaVersion === 'v3'
            ? { href: '/tools', label: 'Mining calculators', note: 'Reproduce the method with your own assumptions.' }
            : { href: '/for/miners', label: 'For miners', note: 'What difficulty risk looks like on a real site.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

import { GlossaryPreviewNotice } from '@/components/content/GlossaryPreviewNotice'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allGlossary, getV3Editorial } from '@/content'
import { jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { GlossaryBrowser, type GlossaryEntry } from './GlossaryBrowser'

export async function V3GlossaryIndex() {
  const terms = await allGlossary()
  const startLesson = await getV3Editorial('academy', 'how-difficulty-adjustment-works')
  const entries: GlossaryEntry[] = terms.map(({ slug, term, shortDef, aliases, browseTopic }) =>
    ({ slug, term, shortDef, aliases: aliases ?? [], topic: browseTopic }))
  return <><GlossaryPreviewNotice /><Container className="pb-14 pt-8 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'Bitcoin mining glossary',
      url: `${site.url}/glossary`, hasDefinedTerm: terms.map(t => ({
        '@type': 'DefinedTerm', name: t.term, description: t.shortDef, url: `${site.url}/glossary/${t.slug}`,
      })),
    }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Glossary', href: '/glossary' }]} /></div>
    <header className="mb-6 mt-2 sm:mb-9 sm:mt-8">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span>Mining reference</span><span aria-hidden className="h-1 w-1 rounded-full bg-subtle/50" /><span className="tabular font-medium text-subtle">{terms.length} terms · {4} topics</span></div>
      <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-4xl">Bitcoin mining glossary</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-subtle">Definitions for mining difficulty, revenue and operations.</p>
    </header>
    {terms.length ? <GlossaryBrowser entries={entries} academyHref={startLesson ? '/v3/academy/' + startLesson.slug : '/v3/academy'} /> : <p role="status" className="py-8 text-subtle">No glossary terms have been published yet.</p>}
  </Container></>
}

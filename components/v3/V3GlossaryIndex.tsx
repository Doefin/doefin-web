import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allGlossary } from '@/content'
import { jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { GlossaryBrowser, type GlossaryEntry } from './GlossaryBrowser'

const topicSlugs: Record<Exclude<GlossaryEntry['topic'], 'all'>, readonly string[]> = {
  network: ['mining-difficulty', 'difficulty-adjustment', 'epoch', 'block-height', 'hashrate', 'exahash', 'terahash'],
  revenue: ['hashprice', 'block-subsidy', 'halving', 'transaction-fees', 'mining-pool', 'fpps', 'pool-luck'],
  operations: ['hosting', 'uptime', 'curtailment'],
  uncertainty: ['confidence-interval', 'calibration'],
}

export function V3GlossaryIndex() {
  const terms = allGlossary()
  const entries: GlossaryEntry[] = terms.map(({ slug, term, shortDef, aliases }) => {
    const topic = (Object.keys(topicSlugs) as (keyof typeof topicSlugs)[]).find(key => topicSlugs[key].includes(slug))
    if (!topic) throw new Error(`Glossary term ${slug} needs a browse topic`)
    return { slug, term, shortDef, aliases: aliases ?? [], topic }
  })
  return <Container className="pb-14 pt-8 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      '@context': 'https://schema.org', '@type': 'DefinedTermSet', name: 'Bitcoin mining glossary',
      url: `${site.url}/glossary`, hasDefinedTerm: terms.map(t => ({
        '@type': 'DefinedTerm', name: t.term, description: t.shortDef, url: `${site.url}/glossary/${t.slug}`,
      })),
    }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Glossary', href: '/glossary' }]} /></div>
    <header className="mb-6 mt-2 sm:mb-9 sm:mt-8">
      <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span>Mining reference</span><span aria-hidden className="h-1 w-1 rounded-full bg-subtle/50" /><span className="tabular font-medium text-subtle">{terms.length} terms · {Object.keys(topicSlugs).length} topics</span></div>
      <h1 className="max-w-3xl text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-4xl">Bitcoin mining glossary</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-subtle">Clear definitions for mining difficulty, revenue and operations.</p>
    </header>
    <GlossaryBrowser entries={entries} />
  </Container>
}

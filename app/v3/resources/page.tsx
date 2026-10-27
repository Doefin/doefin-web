import { GuidesPublicationProvider } from '@/components/routing/GuidesPublicationContext'
import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { BrandIcon } from '@/components/v3/BrandIcon'
import { allV3Editorial, allV3Reports, guideDiscovery } from '@/content'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  ...seo({ title: 'Resources: guides, tools and mining glossary', description: 'Understand Bitcoin difficulty, compare mining scenarios and explore guides, articles, definitions, captured retarget observations and clearly labelled synthetic exercises.', path: '/v3/resources' }),
  robots: { index: false, follow: false },
}

const calculators = [
  { slug: 'difficulty-exposure', title: 'Difficulty exposure', question: 'What could a difficulty change mean for production?', description: 'Compare BTC production across your own assumptions, then share or download a scenario brief.' },
  { slug: 'hosting-effective-rate', title: 'Hosting costs', question: 'What does the quote really cost?', description: 'Bring fees and lost hours into the effective rate. Save one quote for a comparison during this visit.' },
  { slug: 'fleet-payback', title: 'Fleet payback', question: 'Which assumptions change capital recovery?', description: 'Compare simplified cash flows across difficulty paths, power costs and fleet inputs.' },
]

export default async function Resources() {
  const lessons = await allV3Editorial('academy')
  const articles = await allV3Editorial('blog')
  const reports = await allV3Reports()
  const {guides,unavailable} = await guideDiscovery()

  return <GuidesPublicationProvider slugs={unavailable ? null : guides.map(row=>row.slug)}><Container className="py-12 sm:py-16 [overflow-wrap:anywhere]">
    <header className="max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-highlight">Resources</p>
      <h1 className="mt-4 text-balance text-4xl font-bold leading-[1.1] tracking-[-0.04em] sm:text-5xl">Understand difficulty.<br />Work with your own numbers.</h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-subtle">Start with a question. Find the market mechanics, explore a mining scenario or look up a term. The deeper reading is here whenever you need it.</p>
    </header>

    <nav aria-label="Resource sections" className="mt-7 flex flex-wrap gap-x-6 gap-y-1 border-b border-white/10 pb-5">
      {[
        ['Calculators', '#tools'], ['Guides & articles', '#learn'],
        ['Glossary', '#glossary'], ['Research & data', '#research'],
      ].map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center text-sm font-semibold text-highlight underline-offset-4 hover:underline">{label}</Link>)}
    </nav>

    <section id="docs" aria-label="Choose a starting point" className="mt-8 grid scroll-mt-28 gap-4 md:grid-cols-3">
      {[
        { icon: 'block' as const, title: 'Understand the market', description: 'Start with the contract’s underlying, observation block and binary outcome; use Docs for task-specific detail.', href: '/v3/product', action: 'Read the product introduction' },
        { icon: 'mining' as const, title: 'Explore your production', description: 'Connect difficulty to a fleet’s expected production, then try the calculation yourself.', href: '/v3/for/miners#planning-example', action: 'Follow the miner example' },
        { icon: 'market' as const, title: 'Prepare a market review', description: 'Work through execution, collateral, evidence and the questions to discuss with your team.', href: '/v3/for/institutions#review-checklist', action: 'Open the review checklist' },
      ].map((item, index) => <Link key={item.href} href={item.href} className={'group flex flex-col rounded-panel border p-6 transition-colors hover:border-brand/50 ' + (index === 0 ? 'border-brand/30 bg-gradient-to-br from-brand/10 to-surface/60' : 'border-white/10 bg-surface/40')}>
        <BrandIcon name={item.icon} className="h-7 w-7 text-highlight" />
        <h2 className="mt-6 text-xl font-bold tracking-tight group-hover:text-highlight">{item.title}</h2>
        <p className="mb-6 mt-3 text-sm leading-relaxed text-subtle">{item.description}</p>
        <span className="mt-auto inline-flex items-center justify-between gap-3 text-sm font-semibold text-highlight">{item.action}<Arrow /></span>
      </Link>)}
    </section>

    <section id="tools" aria-labelledby="resources-tools" className="mt-16 grid scroll-mt-28 gap-7 border-t border-white/10 pt-9 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">Calculators</p>
        <h2 id="resources-tools" className="mt-3 text-balance text-3xl font-bold leading-tight tracking-[-0.03em]">Compare your mining assumptions.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">Use your own inputs and keep a scenario in its URL. Each tool has a written guide so you can inspect what goes into the result.</p>
        <p className="mt-4 text-sm leading-relaxed text-subtle">These simplified models do not forecast difficulty or determine a suitable position. Defaults are illustrative, not live data.</p>
        <Link href="/v3/tools" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">All calculators <Arrow /></Link>
      </div>
      <div className="divide-y divide-white/10 border-y border-white/10">
        {calculators.map(tool => <article key={tool.slug} className="py-6 first:pt-5">
          <p className="text-xs font-semibold text-subtle">{tool.title}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug"><Link href={'/v3/tools/' + tool.slug} className="group inline-flex items-start justify-between gap-5 hover:text-highlight">{tool.question}<Arrow className="mt-1" /></Link></h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-subtle">{tool.description}</p>
          <Link href={'/v3/academy/guides/' + tool.slug} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">Guide: {guides.find(row => row.slug === tool.slug)?.guide.article.title ?? 'Browse calculator guides'} <span aria-hidden="true" className="ml-2">→</span></Link>
        </article>)}
      </div>
    </section>

    <section id="learn" aria-labelledby="resources-learn" className="mt-16 scroll-mt-28 border-t border-white/10 pt-9 [overflow-wrap:anywhere]">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">Guides &amp; articles</p>
      <h2 id="resources-learn" className="mt-3 text-3xl font-bold tracking-[-0.03em]">Build the context behind a decision.</h2>
      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">
        {[
          { title: 'Mining fundamentals', href: '/v3/academy', items: lessons, prefix: '/v3/academy/' },
          { title: 'Assumptions & interpretation', href: '/v3/blog', items: articles, prefix: '/v3/blog/' },
        ].map(group => <div key={group.href}>
          <h3 className="text-lg font-bold">{group.title}</h3>
          <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">{group.items.map(article => <li key={article.slug}>
            <Link href={group.prefix + article.slug} className="group block py-5">
              <p className="font-semibold leading-snug group-hover:text-highlight">{article.title} <span aria-hidden="true">→</span></p>
              <p className="mt-2 text-sm leading-relaxed text-subtle">{article.summary}</p>
            </Link>
          </li>)}</ul>
          <Link href={group.href} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">{group.href.endsWith('academy') ? 'Academy & written guides' : 'All articles'} <Arrow /></Link>
        </div>)}
      </div>
      <Link href="/v3/learn/difficulty-exposure" data-v3-cta="tutorial" data-v3-placement="resources" className="mt-7 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-white/10 bg-surface/40 px-6 py-5 hover:border-brand/40">
        <span><span className="block text-xs font-semibold text-subtle">Prefer a practical walkthrough?</span><span className="mt-2 block font-semibold">Measure your fleet’s difficulty exposure</span></span><span className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight">Follow the four steps <Arrow /></span>
      </Link>
    </section>

    <section id="glossary" aria-labelledby="resources-glossary" className="mt-16 grid scroll-mt-28 gap-8 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8 md:grid-cols-2 md:gap-12">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">Definitions</p>
        <h2 id="resources-glossary" className="mt-3 text-2xl font-bold tracking-tight">The right term, explained.</h2>
        <p className="mt-3 text-sm leading-relaxed text-subtle">Difficulty, hashprice, epochs, pools and operating terms each have a short definition and a fuller explanation.</p>
        <Link href="/v3/glossary" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Browse the mining glossary <Arrow /></Link>
      </div>
      <div className="border-t border-white/10 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <h3 className="text-lg font-bold">Looking up an app or market term?</h3>
        <p className="mt-3 text-sm leading-relaxed text-subtle">Find concise explanations of position tokens, collateral, orders, resolution and redemption in the Docs.</p>
        <Link href="/v3/docs/key-terms" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Read market key terms <Arrow /></Link>
      </div>
    </section>

    <section id="research" aria-labelledby="resources-research" className="mt-16 scroll-mt-28 border-t border-white/10 pt-9">
      <div className="max-w-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">Research &amp; data</p>
        <h2 id="resources-research" className="mt-3 text-3xl font-bold tracking-[-0.03em]">Inspect the observations. Understand the methods.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">Explore a frozen capture of observed difficulty retargets, inspect its provenance and reuse its dataset. Separate teaching exercises show how forecast-error arithmetic works.</p>
        <p className="mt-4 border-l-2 border-caution/60 pl-4 text-sm leading-relaxed text-subtle"><strong className="font-semibold text-caution">Different evidence, clearly labelled.</strong> The observed-retarget report uses captured network data. Forecast comparisons and error exercises use authored synthetic values. Neither establishes live forecasts, measured estimator performance or a verified prediction track record.</p>
      </div>
      {reports.length === 0 ? <p role="status" className="mt-7 border-y border-white/10 py-6 text-sm text-subtle">No published research reports are available yet.</p> : <ul className="mt-7 divide-y divide-white/10 border-y border-white/10">
        {[
          ...reports.map(report => ({ title: report.title, summary: report.summary, href: '/v3/research/' + report.slug, provenance: report.slug === 'observed-difficulty-adjustments' ? 'Observed network data · Frozen source capture' : 'Synthetic teaching exercise · Authored values' })),
          { title: 'Evaluate a difficulty forecast', summary: 'Inspect every sample observation, follow the error calculation and download the synthetic dataset.', href: '/v3/research/evaluating-a-forecast', provenance: 'Synthetic teaching exercise · Authored values' },
        ].map(report => <li key={report.href}><Link href={report.href} className="group flex items-start justify-between gap-5 py-6"><div><p className="mb-2 text-xs font-semibold text-subtle">{report.provenance}</p><h3 className="text-lg font-semibold group-hover:text-highlight">{report.title}</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed text-subtle">{report.summary}</p></div><Arrow className="mt-1" /></Link></li>)}
      </ul>}
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1">{[
        ['All research', '/v3/research'], ['Data & archive status', '/v3/data'], ['Methodology & assumptions', '/v3/methodology/difficulty-index'],
      ].map(([label, href]) => <Link key={href} href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">{label} <Arrow /></Link>)}</div>
    </section>

    <section id="updates" aria-labelledby="resources-contact" className="mt-14 flex scroll-mt-28 flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-7">
      <div className="max-w-2xl"><h2 id="resources-contact" className="text-xl font-bold">Need a detail you cannot find?</h2><p className="mt-3 text-sm leading-relaxed text-subtle">Ask the team about the product or the evidence your review needs.</p><p className="mt-2 text-xs leading-relaxed text-subtle">Preview research email preferences, publication alerts or a requested report email. This demo does not send emails or save personal details.</p></div>
      <div className="flex flex-wrap gap-x-6 gap-y-2"><a href={'mailto:' + site.contactEmail} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Ask the team <Arrow diagonal /></a><Link href="/v3/newsletter" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Explore research emails <Arrow /></Link></div>
    </section>
  </Container></GuidesPublicationProvider>
}

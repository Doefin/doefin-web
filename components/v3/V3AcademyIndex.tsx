import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { allGuides, allV3Editorial } from '@/content'
import { jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'

const lessonThemes: Record<string, { label: string }> = {
  'how-difficulty-adjustment-works': { label: 'The mechanism' },
  'what-hashprice-means': { label: 'The economics' },
  'why-forecasts-need-error-bars': { label: 'The uncertainty' },
}

const guideThemes: Record<string, { label: string; inputs: string; outcome: string }> = {
  'hosting-effective-rate': { label: 'Compare hosting', inputs: 'Power rate · fees · lost hours', outcome: 'Effective cost per kWh' },
  'difficulty-exposure': { label: 'Size production exposure', inputs: 'Hashrate · time window · difficulty', outcome: 'BTC across difficulty scenarios' },
  'fleet-payback': { label: 'Test fleet payback', inputs: 'Fleet cost · power · difficulty growth', outcome: 'Payback across assumptions' },
}

/** Suggested reading order only: no tracked progress, fabricated lessons or enrolment. */
export function V3AcademyIndex() {
  const lessons = allV3Editorial('academy')
  const guides = allGuides()
  const [first, ...following] = lessons

  return <Container className="pb-14 pt-7 sm:pt-10">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Doefin Academy',
      itemListElement: [
        ...lessons.map(lesson => ({ name: lesson.title, url: `${site.url}/v3/academy/${lesson.slug}` })),
        ...guides.map(({ slug, guide }) => ({ name: guide.article.title, url: `${site.url}/v3/academy/guides/${slug}` })),
      ].map((item, i) => ({ '@type': 'ListItem', position: i + 1, ...item })),
    }, 'v3')} />
    <div className="hidden sm:block"><Breadcrumbs schemaVersion="v3" items={[{ name: 'Academy', href: '/v3/academy' }]} /></div>

    <header className="mb-7 mt-2 sm:mb-9 sm:mt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-highlight">Doefin / Academy</p>
      <h1 className="mt-3 max-w-3xl text-balance text-3xl font-extrabold tracking-[-0.04em] sm:text-5xl">Make sense of mining.</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-subtle">Understand difficulty, mining revenue and uncertainty. Then put the concepts to work with a calculator guide.</p>
    </header>

    <section id="foundations" aria-labelledby="foundations-title" className="scroll-mt-28">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
        <h2 id="foundations-title" className="text-lg font-bold tracking-tight">Build the foundations</h2>
        <Link href="#guides" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight underline-offset-4 hover:underline">Here for the calculators? <span aria-hidden="true">↓</span></Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        {first && <Link href={`/v3/academy/${first.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-panel border border-brand/30 bg-gradient-to-br from-active/45 via-surfaceAlt/60 to-surface/60 p-5 transition-colors hover:border-brand/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight sm:p-7">
          <div className="flex items-center justify-between gap-4"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-highlight"><span className="tabular mr-3">01</span>Start here</p><span className="text-xs text-subtle">{lessonThemes[first.slug]?.label ?? 'Foundations'}</span></div>
          <h3 className="mt-5 max-w-lg text-balance text-[25px] font-extrabold leading-tight tracking-[-0.03em] group-hover:text-highlight sm:text-3xl">{first.title}</h3>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-subtle">{first.summary}</p>
          <span className="mt-5 inline-flex min-h-10 items-center gap-3 self-start rounded-lg bg-brand px-4 text-sm font-bold text-white group-hover:bg-brandDeep">Read the first lesson <Arrow className="h-4 w-4" /></span>

          <figure className="mt-7 border-t border-white/10 pt-5">
            <figcaption className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-subtle"><span>Hold hashrate and time constant</span><span className="font-normal normal-case tracking-normal">Concept</span></figcaption>
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div><span aria-hidden="true" className="mb-3 flex h-8 items-end gap-1.5"><span className="h-3 w-4 rounded-sm bg-chart/30" /><span className="h-5 w-4 rounded-sm bg-chart/60" /><span className="h-8 w-4 rounded-sm bg-chart" /></span><p className="text-xs font-semibold text-body">Higher difficulty</p></div>
              <Arrow className="h-5 w-5 text-subtle" />
              <div><span aria-hidden="true" className="mb-3 flex h-8 items-end gap-1.5"><span className="h-8 w-4 rounded-sm bg-highlight/30" /><span className="h-5 w-4 rounded-sm bg-highlight/60" /><span className="h-3 w-4 rounded-sm bg-highlight" /></span><p className="text-xs font-semibold text-body">Less expected BTC</p></div>
            </div>
          </figure>
        </Link>}
        <ol start={2} className="grid gap-4">
          {following.map((lesson, i) => <li key={lesson.slug} className="min-w-0"><Link href={`/v3/academy/${lesson.slug}`} className="group flex h-full gap-4 rounded-panel border border-white/[0.07] bg-surface/40 p-5 transition-colors hover:border-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-highlight sm:gap-5 sm:p-6">
            <span aria-hidden="true" className="tabular flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-ink/40 text-sm font-bold text-highlight">{String(i + 2).padStart(2, '0')}</span>
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">{lessonThemes[lesson.slug]?.label ?? 'Foundations'}</p><h3 className="mt-2 text-balance text-xl font-bold leading-snug tracking-tight group-hover:text-highlight">{lesson.title}</h3><p className="mt-2 text-[13px] leading-relaxed text-subtle">{lesson.summary}</p><span className="mt-3 inline-flex min-h-8 items-center gap-2 text-xs font-semibold text-highlight">Read lesson <Arrow className="h-4 w-4" /></span></div>
          </Link></li>)}
        </ol>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-subtle">Suggested reading order. Start with any lesson if you already know the basics.</p>
    </section>

    <section id="guides" aria-labelledby="guides-title" className="mt-10 scroll-mt-28 border-t border-white/10 pt-7 sm:mt-14 sm:pt-9">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-highlight">Put it into practice</p><h2 id="guides-title" className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">One question. A worked guide.</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">Find the inputs, follow a worked example and learn how to read the result.</p></div><Link href="/v3/tools" className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-highlight hover:underline">All calculators <Arrow className="h-4 w-4" /></Link></div>
      <div className="overflow-hidden rounded-panel border border-white/10 bg-surface/30">
        {guides.map(({ slug, guide }) => <article key={slug} className="grid gap-5 border-b border-white/10 p-5 last:border-b-0 sm:p-7 lg:grid-cols-[10rem_1fr_auto] lg:gap-8">
          <div><p className="text-[11px] font-bold uppercase leading-relaxed tracking-[0.1em] text-highlight">{guideThemes[slug]?.label ?? 'Calculator guide'}</p><p className="mt-2 text-xs leading-relaxed text-subtle">{guideThemes[slug]?.inputs}</p></div>
          <div className="min-w-0"><h3 className="text-balance text-lg font-bold leading-snug tracking-tight sm:text-xl"><Link href={`/v3/academy/guides/${slug}`} className="hover:text-highlight hover:underline">{guide.article.title}</Link></h3><p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-subtle">{guide.article.summary}</p>{guideThemes[slug] && <p className="mt-3 text-xs leading-relaxed text-subtle"><span className="font-semibold text-body">Read the result:</span> {guideThemes[slug].outcome}</p>}</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 lg:flex-col lg:items-start lg:justify-center lg:gap-2"><Link href={`/v3/academy/guides/${slug}`} className="inline-flex min-h-11 items-center justify-center gap-3 rounded-lg border border-white/15 bg-surfaceAlt px-4 text-xs font-bold text-highlight transition-colors hover:border-brand/50">Read guide <Arrow className="h-4 w-4" /></Link><Link href={`/v3/tools/${slug}`} className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-subtle hover:text-highlight lg:px-1">Open calculator <Arrow diagonal className="h-3.5 w-3.5" /></Link></div>
        </article>)}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-subtle">Educational examples. Calculator outputs depend on your assumptions and do not establish future performance.</p>
    </section>

    <aside aria-label="Learning resources" className="mt-10 grid gap-5 border-t border-white/10 pt-7 sm:mt-12 md:grid-cols-2 md:gap-10">
      <Link href="/v3/glossary" className="group flex items-start justify-between gap-5 py-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">Keep a reference nearby</p><h2 className="mt-2 text-lg font-bold group-hover:text-highlight">A term you haven't met?</h2><p className="mt-2 text-sm leading-relaxed text-subtle">Look up difficulty, hashprice and the language of mining.</p><span className="mt-3 inline-flex min-h-8 items-center text-xs font-semibold text-highlight">Browse the glossary</span></div><Arrow className="mt-7 h-5 w-5 text-highlight" /></Link>
      <Link href="/v3/research" className="group flex items-start justify-between gap-5 border-t border-white/10 py-2 pt-5 md:border-l md:border-t-0 md:pl-10 md:pt-2"><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-subtle">Follow the evidence</p><h2 className="mt-2 text-lg font-bold group-hover:text-highlight">See the method in practice.</h2><p className="mt-2 text-sm leading-relaxed text-subtle">Inspect a worked research example and its limitations.</p><span className="mt-3 inline-flex min-h-8 items-center text-xs font-semibold text-highlight">Explore research</span></div><Arrow className="mt-7 h-5 w-5 text-highlight" /></Link>
    </aside>
  </Container>
}

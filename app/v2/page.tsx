import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { ExposurePreview } from '@/components/home/ExposurePreview'
import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'

// An independently addressable concept for review. The original homepage and
// original navigation stay intact; this route is intentionally absent from sitemap.
export const metadata: Metadata = {
  ...seo({
    title: 'Understand your mining exposure — homepage concept',
    description:
      'Explore Bitcoin mining economics, calculate your difficulty exposure, and learn how Doefin markets work.',
    path: '/v2',
  }),
  robots: { index: false, follow: false },
}

function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={`h-5 w-5 shrink-0 ${className}`}>
      <path
        d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h16m-6-6 6 6-6 6'}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

function ToolIcon({ kind }: { kind: 'exposure' | 'hosting' | 'payback' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" className="h-10 w-10 text-highlight">
      {kind === 'exposure' ? (
        <>
          <path d="M8 38V12m12 26V20m12 18V8m9 30H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="m7 10 12 8L32 6l9 5" stroke="currentColor" strokeOpacity=".4" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : kind === 'hosting' ? (
        <>
          <rect x="8" y="7" width="32" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <rect x="8" y="27" width="32" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
          <path d="M14 14h10m-10 20h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="33" cy="14" r="2" fill="currentColor" /><circle cx="33" cy="34" r="2" fill="currentColor" />
        </>
      ) : (
        <>
          <path d="M7 7v34h35M8 34l10-5 9-11L40 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 23h33M8 34l12-2 9-4 11-3" stroke="currentColor" strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 4" />
          <circle cx="27" cy="18" r="3" fill="currentColor" />
        </>
      )}
    </svg>
  )
}

const tools = [
  {
    kind: 'exposure' as const,
    label: 'Understand your exposure',
    title: 'What could a difficulty change cost you?',
    text: 'Enter your fleet hashrate and compare production across difficulty scenarios.',
    href: '/v2/tools/difficulty-exposure',
    action: 'Calculate exposure',
  },
  {
    kind: 'hosting' as const,
    label: 'Compare your costs',
    title: 'What does your hosting contract really cost?',
    text: 'Bring power rates, fees and lost hours together before comparing two offers.',
    href: '/v2/tools/hosting-effective-rate',
    action: 'Compare hosting costs',
  },
  {
    kind: 'payback' as const,
    label: 'Test your assumptions',
    title: 'How sensitive is your fleet’s payback?',
    text: 'Explore how power costs and difficulty growth change a simplified payback scenario.',
    href: '/v2/tools/fleet-payback',
    action: 'Explore fleet payback',
  },
]

export default function ProductHomePage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-white/[0.07]">
        <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-64 -z-10 h-[48rem] w-[48rem] rounded-full bg-brand/[0.08] blur-[100px]" />
        <Container className="pb-14 pt-14 sm:pb-16 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.16fr_1fr] lg:gap-14">
            <div>
              <div className="mb-6 inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.13em] text-highlight">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand" />
                The Bitcoin difficulty market
              </div>
              <h1 className="max-w-[650px] text-balance text-[40px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[54px] lg:text-[58px]">
                Understand how Bitcoin difficulty changes <span className="text-highlight">your mining revenue.</span>
              </h1>
              <p className="mt-6 max-w-lg text-[17px] leading-[1.75] text-subtle">
                Test scenarios with your own numbers. Understand your exposure. Then explore
                Doefin’s markets on the difficulty that shapes your production.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="/v2/tools/difficulty-exposure">Calculate your exposure <Arrow /></Button>
                <Button href="#how-doefin-works" variant="secondary">How Doefin works</Button>
              </div>
              <p className="mt-5 text-xs leading-relaxed text-subtle">
                Explore the tools without an account. Trading is for professional investors.
              </p>
            </div>
            <ExposurePreview />
          </div>

          <div className="mt-12 grid divide-y divide-white/10 border-t border-white/10 md:grid-cols-2 md:divide-x md:divide-y-0">
            <Link href="/v2/for/miners" className="group flex items-center justify-between gap-5 py-7 md:pr-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">Mining operators</p>
                <p className="mt-2 text-[17px] font-semibold">Plan around your production risk.</p>
              </div>
              <Arrow diagonal className="text-muted transition-colors group-hover:text-highlight" />
            </Link>
            <Link href="/v2/for/institutions" className="group flex items-center justify-between gap-5 py-7 md:pl-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-subtle">Funds &amp; trading desks</p>
                <p className="mt-2 text-[17px] font-semibold">Explore a market on mining difficulty.</p>
              </div>
              <Arrow diagonal className="text-muted transition-colors group-hover:text-highlight" />
            </Link>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <section id="how-doefin-works" aria-labelledby="product-title" className="scroll-mt-36">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
            <div>
              <Eyebrow>Meet Doefin</Eyebrow>
              <h2 id="product-title" className="text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-4xl">
                A market for the variable behind your production.
              </h2>
              <p className="mt-5 max-w-prose text-[17px] leading-[1.75] text-subtle">
                Doefin lets professional investors take positions on Bitcoin mining difficulty.
                Each market has a defined level and an observation block. The network’s
                difficulty at that block determines the outcome.
              </p>
              <p className="mt-4 max-w-prose text-[15px] leading-[1.75] text-subtle">
                For miners, it is a way to explore managing one part of production risk.
                For funds and desks, it is a way to express a view on mining economics.
              </p>
              <Link href="/v2/product/settlement" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:underline">
                Understand what a contract settles on <Arrow />
              </Link>
            </div>

            <div className="rounded-header border border-white/10 bg-surface/60 p-6 sm:p-8">
              <div className="flex items-center gap-3 border-b border-white/10 pb-5">
                <span aria-hidden="true" className="grid h-10 w-10 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-brand">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
                </span>
                <div><p className="font-bold">One market. A defined outcome.</p><p className="mt-1 text-xs text-subtle">An overview of the contract mechanics</p></div>
              </div>
              <dl className="divide-y divide-white/[0.07] text-sm">
                {[
                  ['Underlying', 'Bitcoin mining difficulty'],
                  ['Observation', 'A specified block height'],
                  ['Outcome', 'At or above the level, or below it'],
                  ['Verification', 'Public Bitcoin network data'],
                ].map(([label, value]) => (
                  <div key={label} className="grid grid-cols-[6.5rem_1fr] gap-3 py-4 sm:grid-cols-[7rem_1fr]">
                    <dt className="text-subtle">{label}</dt><dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/v2/product/settlement" className="mt-3 flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-ink/40 px-4 py-3.5 text-sm font-semibold hover:border-brand/40">
                See how settlement works <Arrow />
              </Link>
              <p className="mt-4 text-xs leading-relaxed text-subtle">
                A difficulty position does not cover every mining risk. Power costs, downtime
                and Bitcoin price can still affect your returns.
              </p>
            </div>
          </div>
        </section>

        <section aria-labelledby="tools-title" className="mt-20 border-t border-white/10 pt-16 sm:pt-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <Eyebrow>Start with your numbers</Eyebrow>
              <h2 id="tools-title" className="text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Better questions. Clearer decisions.</h2>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-subtle">Free tools to make the assumptions behind your operation visible.</p>
            </div>
            <Link href="/v2/tools" className="inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:underline">Explore all tools <Arrow /></Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.kind} href={tool.href} className="group flex flex-col rounded-panel border border-white/10 bg-surface/50 p-6 transition-colors hover:border-brand/50 hover:bg-surface sm:p-7">
                <div className="mb-8 flex items-start justify-between gap-3"><ToolIcon kind={tool.kind} /><Arrow diagonal className="text-muted transition-colors group-hover:text-highlight" /></div>
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-subtle">{tool.label}</p>
                <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.02em]">{tool.title}</h3>
                <p className="mb-7 mt-3 text-sm leading-[1.75] text-subtle">{tool.text}</p>
                <span className="mt-auto text-sm font-semibold text-highlight">{tool.action} <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="journey-title" className="mt-20">
          <div className="rounded-header border border-white/10 bg-gradient-to-br from-surfaceAlt/60 to-surface/40 p-6 sm:p-10">
            <div className="max-w-xl">
              <Eyebrow>From understanding to action</Eyebrow>
              <h2 id="journey-title" className="text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Make the next step an informed one.</h2>
            </div>
            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {[
                { n: '01', title: 'Understand the moving parts', text: 'Learn how difficulty changes production, and where it fits alongside price and operating costs.', href: '/v2/learn/difficulty-exposure', action: 'Start with the fundamentals' },
                { n: '02', title: 'Put your own numbers in', text: 'Use your hashrate and assumptions to see the production range your operation could face.', href: '/v2/tools/difficulty-exposure', action: 'Measure your exposure' },
                { n: '03', title: 'Explore how the market works', text: 'Read the contract and settlement mechanics before deciding whether a position fits your needs.', href: '/v2/product', action: 'Explore Doefin’s mechanics' },
              ].map((step) => (
                <li key={step.n} className="flex flex-col border-t border-white/15 pt-5">
                  <span aria-hidden="true" className="tabular text-sm font-bold text-highlight">{step.n}</span>
                  <h3 className="mt-4 text-lg font-bold tracking-[-0.02em]">{step.title}</h3>
                  <p className="mb-5 mt-3 text-sm leading-[1.75] text-subtle">{step.text}</p>
                  <Link href={step.href} className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:underline">{step.action}<Arrow className="!h-4 !w-4" /></Link>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="learn-title" className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <Eyebrow>Build your understanding</Eyebrow>
            <h2 id="learn-title" className="text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-4xl">The context behind the calculation.</h2>
            <p className="mt-5 text-[16px] leading-[1.75] text-subtle">Tutorials to explain the concepts. Guides to help you use the tools. Research to examine the assumptions.</p>
            <Link href="/v2/learn" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-highlight hover:underline">Visit the learning hub <Arrow /></Link>
          </div>
          <div className="divide-y divide-white/10 border-y border-white/10">
            {[
              { type: 'Tutorial', title: 'Measure your fleet’s difficulty exposure', text: 'Follow an annotated example, then use your own numbers.', href: '/v2/learn/difficulty-exposure' },
              { type: 'Product guide', title: 'Understand what a position settles on', text: 'A worked binary outcome, with the limits beside it.', href: '/v2/product/settlement' },
              { type: 'Research', title: 'Look closer at difficulty forecasts', text: 'Explore the methods and assumptions behind a forecast.', href: '/v2/research' },
            ].map((item) => (
              <Link key={item.href} href={item.href} className="group flex items-center justify-between gap-5 py-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-subtle">{item.type}</span>
                  <h3 className="mt-2 text-lg font-bold tracking-[-0.02em] group-hover:text-highlight">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-subtle">{item.text}</p>
                </div>
                <Arrow diagonal className="text-muted transition-colors group-hover:text-highlight" />
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="next-move-title" className="relative mt-20 overflow-hidden rounded-header border border-brand/30 bg-gradient-to-br from-surfaceAlt to-ink p-7 sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border-[40px] border-brand/[0.07]" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Eyebrow>Your next move</Eyebrow>
              <h2 id="next-move-title" className="max-w-xl text-balance text-3xl font-extrabold leading-[1.15] tracking-[-0.035em] sm:text-4xl">Understand the exposure.<br />Then explore the market.</h2>
              <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-subtle">Take a closer look at Doefin, with the mechanics and your own assumptions in view.</p>
            </div>
            <div className="flex flex-wrap items-center gap-5 lg:flex-col lg:items-start">
              <Button href={site.appUrl} external>Open the trading app <Arrow diagonal /></Button>
              <Link href="/v2/product" className="inline-flex items-center gap-2 text-sm font-semibold text-subtle hover:text-body">Explore the product mechanics <Arrow className="!h-4 !w-4" /></Link>
            </div>
          </div>
          <p className="relative mt-8 border-t border-white/10 pt-5 text-xs leading-relaxed text-subtle">
            Doefin is for professional investors only. Positions involve risk. Nothing here is
            investment advice or a recommendation; anyone who is not a professional investor
            should not act on it.
          </p>
        </section>
      </Container>
    </div>
  )
}

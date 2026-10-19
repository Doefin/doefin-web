import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui'
import { Arrow } from '@/components/v3/Arrow'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  ...seo({ title: 'Further reading', description: 'Start with the Doefin Docs and Bitcoin mining definitions. Find optional calculators and clearly labelled educational research examples.', path: '/v3/resources' }),
  robots: { index: false, follow: false },
}

export default function Resources() {
  return <Container className="py-12 sm:py-16">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-subtle">Further reading</p>
    <h1 className="mt-4 max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-5xl">Understand the product in the Docs.</h1>
    <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-subtle">Start with the market mechanics. Use definitions when you need them, and optional calculations or examples to explore a specific question.</p>

    <section id="docs" aria-labelledby="resources-docs" className="mt-9 scroll-mt-28 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8">
      <h2 id="resources-docs" className="text-2xl font-bold tracking-tight">The main reading path.</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-subtle">The Docs explain what a difficulty market measures, how a position works, and the steps involved in funding, orders and settlement.</p>
      <div className="mt-5"><Button href="/v3/docs">Read the Docs <Arrow /></Button></div>
      <div className="mt-6 grid gap-5 border-t border-white/10 pt-5 sm:grid-cols-2">
        <Link href="/v3/docs/how-settlement-works" className="group block"><h3 className="font-semibold group-hover:text-highlight">How settlement works <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-relaxed text-subtle">From the observed difficulty to payout and redemption.</p></Link>
        <div id="learn" className="scroll-mt-28"><Link href="/v3/docs/key-terms" className="group block"><h3 className="font-semibold group-hover:text-highlight">Definitions <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-relaxed text-subtle">Look up the mining and market terms used in the Docs.</p></Link></div>
      </div>
    </section>

    <div className="mt-10 grid gap-8 md:grid-cols-2">
      <section id="tools" className="scroll-mt-28 border-t border-white/10 pt-6" aria-labelledby="resources-tools">
        <h2 id="resources-tools" className="text-xl font-bold">Optional calculators</h2>
        <p className="mt-3 text-sm leading-relaxed text-subtle">Explore simplified operating assumptions. These tools are separate from trading and do not determine a suitable position.</p>
        <ul className="mt-4 space-y-1">{[
          ['Production sensitivity', '/v3/tools/difficulty-exposure'],
          ['Hosting comparison', '/v3/tools/hosting-effective-rate'],
          ['Fleet payback', '/v3/tools/fleet-payback'],
        ].map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">{label} <Arrow /></Link></li>)}</ul>
      </section>
      <section id="research" className="scroll-mt-28 border-t border-white/10 pt-6" aria-labelledby="resources-research">
        <h2 id="resources-research" className="text-xl font-bold">Educational examples</h2>
        <p className="mt-3 text-sm leading-relaxed text-subtle">Research and data pages use illustrative examples. They do not establish a live forecast, measured performance or a verified historical record.</p>
        <ul className="mt-4 space-y-1">{[
          ['Research examples', '/v3/research'],
          ['Data presentation examples', '/v3/data'],
        ].map(([label, href]) => <li key={href}><Link href={href} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">{label} <Arrow /></Link></li>)}</ul>
      </section>
    </div>

    <section id="updates" className="mt-10 scroll-mt-28 border-t border-white/10 pt-6">
      <h2 className="text-xl font-bold">Need a detail the Docs do not cover?</h2>
      <a href={'mailto:' + site.contactEmail} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Contact the team <Arrow diagonal /></a>
      <p className="mt-2 text-xs leading-relaxed text-subtle">Newsletter delivery and automatic alerts are not connected in this prototype.</p>
    </section>
  </Container>
}

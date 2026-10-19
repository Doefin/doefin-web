import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui'
import { Arrow } from './Arrow'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = seo({ title: 'Doefin for funds and trading desks', description: 'Understand Bitcoin difficulty markets, binary payouts and execution risks before reviewing a position with your fund or trading desk.', path: '/v3/for/institutions' })

export default function InstitutionsPage() {
  return <Container className="py-10 sm:py-14">
    <Link href="/v3#who-its-for" className="text-sm text-subtle hover:text-body">For funds &amp; trading desks</Link>
    <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-5xl">Evaluate the instrument before the position.</h1>
    <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-subtle">Doefin markets express a view on Bitcoin mining difficulty at a specified block. Start with what determines the outcome, then assess whether the instrument fits your mandate.</p>
    <div className="mt-7 flex flex-wrap gap-3"><Button href="/v3/docs">Read the Docs <Arrow /></Button><Button href={site.appUrl} external variant="secondary">Open app <Arrow diagonal /></Button></div>

    <section className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2" aria-labelledby="institution-product">
      <div>
        <h2 id="institution-product" className="text-2xl font-bold tracking-tight">A specific underlying and outcome.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">The threshold and observation block define a binary payout. The contract references network difficulty, rather than Bitcoin’s price or a portfolio’s profit. A larger move past the threshold does not increase the payout per token.</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">The terms and execution still matter.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">Review entry cost, fees, collateral and available liquidity together. A public reference value does not remove contract, token or operational risk. Check the actual market and deployment evidence before committing funds.</p>
      </div>
    </section>

    <section className="mt-10" aria-labelledby="institution-reading">
      <h2 id="institution-reading" className="text-2xl font-bold tracking-tight">Read the mechanics in the Docs.</h2>
      <div className="mt-5 divide-y divide-white/10 border-y border-white/10">{[
        ['Settlement and payout', 'Understand observation, resolution, redemption and the difference between payout and profit.', '/v3/docs/how-settlement-works'],
        ['Orders and execution', 'Review market and limit orders, available depth and unfilled amounts.', '/v3/docs/market-vs-limit-orders'],
        ['Technical review', 'Identify the contracts and evidence relevant to the deployment you are assessing.', '/v3/docs/smart-contracts'],
      ].map(([title,body,href])=><Link key={href} href={href} className="group flex items-center justify-between gap-5 py-5"><div><h3 className="font-semibold group-hover:text-highlight">{title}</h3><p className="mt-2 text-sm leading-relaxed text-subtle">{body}</p></div><Arrow /></Link>)}</div>
    </section>

    <section className="mt-10 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8">
      <h2 className="text-xl font-bold">Continue the product discussion.</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-subtle">Contact the team with questions about the instrument, execution requirements or evidence your review needs.</p>
      <a href={`mailto:${site.contactEmail}?subject=Doefin%20product%20questions`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Contact the team <Arrow diagonal /></a>
    </section>
  </Container>
}

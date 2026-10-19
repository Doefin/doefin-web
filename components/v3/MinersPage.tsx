import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui'
import { Arrow } from './Arrow'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = seo({ title: 'Bitcoin difficulty markets for mining operators', description: 'Understand how a difficulty position relates to mining production, what its payout measures, and which risks to review.', path: '/v3/for/miners' })

export default function MinersPage() {
  return <Container className="py-10 sm:py-14">
    <Link href="/v3#who-its-for" className="text-sm text-subtle hover:text-body">For mining operators</Link>
    <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.12] tracking-[-0.035em] sm:text-5xl">Understand a market tied to mining difficulty.</h1>
    <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-subtle">Difficulty affects how much BTC a fixed fleet can produce. Doefin markets reference that network parameter: whether it is at or above a stated threshold at a specified Bitcoin block.</p>
    <div className="mt-7 flex flex-wrap gap-3"><Button href="/v3/docs">Read the Docs <Arrow /></Button><Button href={site.appUrl} external variant="secondary">Open app <Arrow diagonal /></Button></div>

    <section className="mt-12 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2" aria-labelledby="miner-relevance">
      <div>
        <h2 id="miner-relevance" className="text-2xl font-bold tracking-tight">Why it matters to a miner.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">With hashrate and uptime held constant, higher difficulty reduces expected BTC production. A difficulty market offers a way to express a view on that variable, separately from Bitcoin’s price.</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Where the fit has limits.</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-subtle">The contract has a binary payout at one observation block. Your production changes over time and depends on more than difficulty. A position does not automatically offset lost production; its price, size, timing, fees and execution affect the result.</p>
      </div>
    </section>

    <section id="planning-example" className="mt-10 scroll-mt-24 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8" aria-labelledby="miner-planning">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-highlight">Illustrative planning example</p>
      <h2 id="miner-planning" className="mt-3 text-2xl font-bold tracking-tight">Planning for a higher-difficulty month.</h2>
      <ol className="mt-5 grid gap-6 md:grid-cols-2">
        <li>
          <h3 className="font-semibold">1. Compare expected production</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-subtle">An operator compares next month’s production budget with a higher-difficulty scenario:</p>
          <dl className="mt-4 grid grid-cols-2 gap-4 border-y border-white/10 py-4">
            <div><dt className="text-xs leading-relaxed text-subtle">Difficulty vs. baseline</dt><dd className="tabular mt-1 text-xl font-semibold text-body">+10%</dd></div>
            <div><dt className="text-xs leading-relaxed text-subtle">Expected BTC production</dt><dd className="tabular mt-1 text-xl font-semibold text-body">~9.1% lower</dd></div>
          </dl>
          <p className="mt-3 text-sm leading-relaxed text-subtle">Illustration assumes difficulty stays 10% above baseline throughout the month, with hashrate, uptime and rewards held fixed.</p>
        </li>
        <li>
          <h3 className="font-semibold">2. Evaluate the market fit</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-subtle">The operator checks whether a YES market’s threshold and estimated observation date match that scenario. They compare entry cost, fees and available size with the production exposure before deciding whether to consider a position.</p>
        </li>
      </ol>
      <p className="mt-6 border-t border-white/10 pt-5 text-[15px] leading-relaxed text-subtle"><strong className="font-semibold text-body">When it may not fit:</strong> YES has no payout below the threshold, even if expected production falls. Its fixed payout per token does not track the loss continuously. Comparing these scenarios neither guarantees an offset nor determines a suitable position size.</p>
    </section>

    <section className="mt-10" aria-labelledby="miner-reading">
      <h2 id="miner-reading" className="text-2xl font-bold tracking-tight">Understand the position before taking one.</h2>
      <div className="mt-5 divide-y divide-white/10 border-y border-white/10">{[
        ['What determines the outcome', 'Read the threshold, observation block and meaning of each side.', '/v3/docs/what-doefin-settles-on'],
        ['How settlement works', 'Separate the contract payout from profit, redemption and withdrawal.', '/v3/docs/how-settlement-works'],
        ['Prices and implied probability', 'Understand what a quoted price can and cannot tell you.', '/v3/docs/prices-and-probability'],
      ].map(([title,body,href])=><Link key={href} href={href} className="group flex items-center justify-between gap-5 py-5"><div><h3 className="font-semibold group-hover:text-highlight">{title}</h3><p className="mt-2 text-sm leading-relaxed text-subtle">{body}</p></div><Arrow /></Link>)}</div>
    </section>

    <section className="mt-10 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8">
      <h2 className="text-xl font-bold">Questions about your operation?</h2>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-subtle">Ask the team about the market mechanics and the questions relevant to your fleet. Check the specific market and its current terms in the app.</p>
      <a href={`mailto:${site.contactEmail}?subject=Doefin%20for%20mining%20operators`} className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Contact the team <Arrow diagonal /></a>
    </section>

    <aside className="mt-10 border-t border-white/10 pt-6" aria-labelledby="miner-optional-calculation">
      <h2 id="miner-optional-calculation" className="text-sm font-bold">Optional calculation</h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-subtle">Explore estimated production under your own difficulty assumptions. This calculation does not determine a suitable position size.</p>
      <Link href="/v3/tools/difficulty-exposure" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Production sensitivity calculator <Arrow /></Link>
    </aside>
  </Container>
}

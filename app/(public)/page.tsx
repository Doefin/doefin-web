import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { HeroVisual } from '@/components/v3/HeroVisual'
import { LandingMotion } from '@/components/v3/LandingMotion'
import { MarketExample } from '@/components/v3/MarketExample'
import { ProductPreview } from '@/components/v3/ProductPreview'
import { HomeResources } from '@/components/v3/HomeResources'
import { HomeFaq } from '@/components/v3/HomeFaq'
import { ProductUpdates } from '@/components/v3/ProductUpdates'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import './home.css'

export const metadata: Metadata = {
  ...seo({ title: 'Trade and hedge Bitcoin hashrate exposure', description: 'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. See how markets work and what to check before trading. For professional investors.', path: '/' }),
  robots: { index: false, follow: false },
}

export default function V3Home() {
  return <LandingMotion>
    <section aria-labelledby="v3-title" className="v37-hero">
      <Container className="v37-hero-grid">
        <div className="v37-hero-copy">
          <h1 id="v3-title">Trade and hedge<br /><span>Bitcoin hashrate exposure.</span></h1>
          <p className="v37-lede">Miners can hedge the effect of rising <Link href="/glossary/mining-difficulty" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">difficulty</Link> on expected Bitcoin production. Investors can trade their views on network hashrate through markets on Bitcoin mining difficulty.</p>
          <div className="v37-actions"><Link href="/for/miners" data-v3-cta="planner" data-v3-placement="hero" className="v37-button">Plan difficulty exposure <Arrow /></Link><Link href="/learn/difficulty-exposure" data-v3-cta="tutorial" data-v3-placement="hero" className="v37-link">Follow a worked example <Arrow /></Link></div>
          <p className="v37-risk">A losing position pays zero. You can lose the full amount paid for a position, plus applicable costs.</p>
          <nav aria-label="Review before using Doefin" className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/docs/smart-contracts" data-v3-cta="evidence" data-v3-placement="hero" className="v37-link">Review technical evidence <Arrow /></Link>
            <Link href="/docs/risks-and-limitations" data-v3-cta="risk" data-v3-placement="hero" className="v37-link">Risks and limitations <Arrow /></Link>
          </nav>
        </div>
        <HeroVisual />
      </Container>
    </section>

    <section id="production-scenario" aria-labelledby="production-title" className="v37-audience v37-section">
      <Container>
        <div id="who-its-for" className="scroll-mt-28" data-reveal><p className="v37-eyebrow">Start with production</p><h2 id="production-title" className="v37-heading"><span id="audience-title" className="scroll-mt-28">Rising difficulty reduces expected production.</span></h2></div>
        <article className="v37-audience-card mt-7" data-reveal>
          <p className="v37-copy">Illustrative scenario: at unchanged difficulty, your fixed hashrate is expected to produce 1 BTC over a given period. With difficulty 10% higher throughout that period, expected production falls to 1 ÷ 1.10 ≈ 0.909 BTC. That is about 0.091 BTC (9.09%) less.</p>
          <p className="text-sm leading-relaxed text-subtle">Hashrate, uptime, block reward and other production assumptions stay the same in this example. It shows how difficulty affects expected production. It does not forecast production or tell you how large a position to buy. Pool results, fees, power costs and BTC price need separate assumptions.</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1"><Link href="/tools/difficulty-exposure" data-v3-cta="calculator" data-v3-placement="scenario" className="v37-link">Try your numbers <Arrow /></Link><Link href="/product/settlement" data-v3-cta="settlement" data-v3-placement="scenario" className="v37-link">Compare production and contract payout <Arrow /></Link></div>
        </article>
        <p className="v37-note">A Doefin position pays a fixed amount or nothing, depending on difficulty at its observation block. Its cost, size and timing determine how much of a production shortfall it may offset. It does not cover every mining risk.</p>
      </Container>
    </section>

    <section id="how-it-works" aria-labelledby="mechanics-title" className="v37-mechanics v37-section">
      <Container>
        <div className="v311-payout-heading" data-reveal><p className="v37-eyebrow">How it works</p><h2 id="mechanics-title" className="v37-heading"><span id="setup-title" className="scroll-mt-28">Choose a market. Fund your account. Place a trade.</span></h2><p className="v37-copy">All done in a few minutes.</p></div>
        <ol id="get-started" className="mt-7 grid scroll-mt-28 gap-4 md:grid-cols-3" data-reveal>
          {[
            { title: 'Choose a Bitcoin difficulty market', text: ['Check the difficulty threshold and the block at which difficulty will be observed. Yes wins if difficulty at that block is at or above the threshold; No wins below it. Buy shares on the side that matches your view. These tokens represent your position.', 'Prices change as traders buy and sell.'], guides: [{ href: '/docs/your-first-trade', label: 'Review price, amount and order execution' }] },
            { title: 'Fund your account and trade', text: ['Fund your account with the collateral token required by your market. For cbBTC markets, deposit cbBTC directly or convert native BTC using the integrated SwapKit service. Then choose your position and place your trade.', 'cbBTC is a wrapped Bitcoin asset; it is not native BTC.'], guides: [{ href: '/docs/connecting-a-wallet', label: 'Check sign-in and wallet signatures' }, { href: '/docs/getting-collateral', label: 'Check token, network, destination and costs' }] },
            { title: 'Sell or redeem', text: ['Place a sell order before settlement, or hold until the market resolves. A sale depends on available buyers and price.', 'Each winning share in a cbBTC market redeems for 1 cbBTC. Check the displayed payout and collateral token for other markets. Losing shares pay nothing. Your profit or loss also depends on what you paid and any fees.'], guides: [{ href: '/docs/managing-positions', label: 'Read about managing positions' }] },
          ].map((step, index) => <li key={step.title} className="rounded-panel border border-white/10 bg-surface/40 p-5"><p className="text-xs font-semibold text-subtle">Step {index + 1}</p><h3 className="mt-3 text-lg font-semibold text-body">{step.title}</h3>{step.text.map(line => <p key={line} className="mt-2 text-sm leading-relaxed text-subtle">{line}</p>)}<nav aria-label={step.title + ' guides'} className="mt-4 flex flex-col items-start gap-2">{step.guides.map(guide => <Link key={guide.href} href={guide.href} data-v3-cta="setup" data-v3-placement="setup" className="inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">{guide.label} <Arrow /></Link>)}</nav></li>)}
        </ol>
        <p className="v37-note">Ready to inspect a market? <a href={site.appUrl} data-v3-cta="app" data-v3-placement="setup" className="font-semibold text-highlight underline underline-offset-4">Enter app</a>.</p>
        <div className="mt-7" data-reveal><MarketExample /></div>
        <details id="inside-the-product" className="mt-7 rounded-panel border border-white/15 bg-surface/40 p-5 sm:p-6" data-reveal>
          <summary id="product-title" className="min-h-11 scroll-mt-28 cursor-pointer text-base font-semibold text-highlight">View the app screenshot: 19 October 2026 · not live</summary>
          <ProductPreview />
        </details>
      </Container>
    </section>

    <section id="tools-and-learning" aria-labelledby="learning-title" className="v320-updates v37-section">
      <Container>
        <HomeResources />
        <div id="review-evidence" className="mt-9 scroll-mt-28 border-t border-white/10 pt-6" data-reveal>
          <h3 id="evidence-title" className="text-lg font-semibold">Check the product and its risks.</h3>
          <nav aria-label="Evidence and risk review" className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/about" data-v3-cta="evidence" data-v3-placement="trust" className="v37-link">About Doefin and the team <Arrow /></Link>
            <Link href="/docs/smart-contracts" data-v3-cta="evidence" data-v3-placement="trust" className="v37-link">Review contract and audit evidence <Arrow /></Link>
            <Link href="/docs/risks-and-limitations" data-v3-cta="risk" data-v3-placement="trust" className="v37-link">Risks and limitations <Arrow /></Link>
          </nav>
          <p className="v37-note">Check contract details, deployment records and available audit evidence. You can lose the full amount paid for a position. Limited liquidity, collateral failures and technical faults also carry risks. The examples and research with made-up data do not show live forecasts, trading performance or audit certification.</p>
        </div>
      </Container>
    </section>

    <section id="faq" aria-labelledby="faq-title" className="v37-faq v37-section">
      <Container className="v37-faq-grid">
        <div data-reveal><p className="v37-eyebrow">Common questions</p><h2 id="faq-title" className="v37-heading">Questions about<br />using Doefin.</h2><p className="v37-copy v37-faq-intro">Short answers here. Step-by-step guides are in the docs.</p><Link href="/docs" className="v37-link">Browse the docs <Arrow /></Link><Link href="/resources" data-v3-cta="resources" data-v3-placement="faq" className="v37-link">Browse the learning resources <Arrow /></Link><Link href="/resources#updates" data-v3-cta="contact" data-v3-placement="faq" className="v37-link">Ask the team a question <Arrow /></Link></div>
        <div data-reveal><HomeFaq /></div>
      </Container>
    </section>

    <section id="product-updates" aria-labelledby="updates-title" className="v320-updates v37-section">
      <Container><ProductUpdates /></Container>
    </section>

  </LandingMotion>
}

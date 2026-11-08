import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { DifficultyHero } from '@/components/v3/DifficultyHero'
import { LandingMotion } from '@/components/v3/LandingMotion'
import { MarketExample } from '@/components/v3/MarketExample'
import { ProductionWalkthrough } from '@/components/v3/ProductionWalkthrough'
import productionStyles from '@/components/v3/ProductionWalkthrough.module.css'
import { ProductPreview } from '@/components/v3/ProductPreview'
import { HomeResources } from '@/components/v3/HomeResources'
import { HomeFaq } from '@/components/v3/HomeFaq'
import { ProductUpdates } from '@/components/v3/ProductUpdates'
import { seo } from '@/lib/seo'
import { TradeWalkthrough } from '@/components/v3/TradeWalkthrough'
import './home.css'

export const metadata: Metadata = {
  ...seo({ title: 'Trade and hedge Bitcoin hashrate exposure', description: 'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. See how markets work and what to check before trading. For professional investors.', path: '/' }),
  robots: { index: false, follow: false },
}

export default function V3Home() {
  return <LandingMotion>
    <DifficultyHero />

    <section id="production-scenario" aria-labelledby="production-title" className="v37-audience v37-section">
      <Container>
        <div id="who-its-for" className="scroll-mt-28" data-reveal><p className="v37-eyebrow">Start with production</p><h2 id="production-title" className="v37-heading"><span id="audience-title" className="scroll-mt-28">Rising difficulty reduces expected production.</span></h2></div>
        <p className="v37-copy mt-3">The fleet and the period stay the same. Only difficulty changes.</p>
        <ProductionWalkthrough />
        <details className={productionStyles.details}>
          <summary>See the assumptions and limits</summary>
          <p>At unchanged difficulty, a fixed hashrate is expected to produce 1 BTC over the period. If difficulty is 10% higher throughout, expected production falls to 1 ÷ 1.10 ≈ 0.909 BTC. That is about 0.091 BTC (9.09%) less. The walkthrough divides the baseline into 1,000 units of 0.001 BTC and shows about 909 expected units after rounding.</p>
          <p>Hashrate, uptime, block reward and other production assumptions stay the same in this example. It shows how difficulty affects expected production. It does not forecast production or tell you how large a position to buy. Pool results, fees, power costs and BTC price need separate assumptions.</p>
        </details>
        <details className={productionStyles.contract}>
          <summary>How the contract payout differs</summary>
          <p>A Doefin position pays a fixed amount or nothing, depending on difficulty at its observation block. Its cost, size and timing determine how much of a production shortfall it may offset. It does not cover every mining risk.</p>
        </details>
        <nav className={productionStyles.actions} aria-label="Production and settlement resources">
          <Link href="/tools/difficulty-exposure" data-v3-cta="calculator" data-v3-placement="scenario" className={productionStyles.calculator}>Try your numbers</Link>
          <Link href="/product/settlement" data-v3-cta="settlement" data-v3-placement="scenario" className="v37-link">Compare production and contract payout <Arrow /></Link>
        </nav>
      </Container>
    </section>

    <section id="how-it-works" aria-labelledby="mechanics-title" className="v37-mechanics v37-section">
      <Container>
        <TradeWalkthrough />
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

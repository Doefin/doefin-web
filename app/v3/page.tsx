import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { BrandIcon } from '@/components/v3/BrandIcon'
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
  ...seo({ title: 'Trade and hedge Bitcoin hashrate exposure', description: 'Doefin provides markets on Bitcoin mining difficulty for professional investors: who they serve, how contracts settle and what to review before you enter the app.', path: '/v3' }),
  robots: { index: false, follow: false },
}

export default function V3Home() {
  return <LandingMotion>
    <section aria-labelledby="v3-title" className="v37-hero">
      <Container className="v37-hero-grid">
        <div className="v37-hero-copy">
          <h1 id="v3-title">Trade and hedge<br /><span>Bitcoin hashrate exposure.</span></h1>
          <p className="v37-lede">Miners can hedge the effect of rising <Link href="/v3/glossary/mining-difficulty" className="underline decoration-white/30 underline-offset-4 hover:decoration-white">difficulty</Link> on expected Bitcoin production. Investors can trade their views on network hashrate through markets on Bitcoin mining difficulty.</p>
          <div className="v37-actions"><Link href="/v3/for/miners" data-v3-cta="planner" data-v3-placement="hero" className="v37-button">Plan difficulty exposure <Arrow /></Link><Link href="/v3/learn/difficulty-exposure" data-v3-cta="tutorial" data-v3-placement="hero" className="v37-link">Follow a worked example <Arrow /></Link></div>
          <p className="v37-risk">A losing position pays zero. You can lose the amount paid, plus applicable costs.</p>
          <nav aria-label="Review before using Doefin" className="mt-2 flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/v3/docs/smart-contracts" data-v3-cta="evidence" data-v3-placement="hero" className="v37-link">Review technical evidence <Arrow /></Link>
            <Link href="/v3/docs/risks-and-limitations" data-v3-cta="risk" data-v3-placement="hero" className="v37-link">Risks and limitations <Arrow /></Link>
          </nav>
        </div>
        <HeroVisual />
      </Container>
    </section>

    <section id="production-scenario" aria-labelledby="production-title" className="v37-audience v37-section">
      <Container>
        <div id="who-its-for" className="scroll-mt-28" data-reveal><p className="v37-eyebrow">Start with production</p><h2 id="production-title" className="v37-heading"><span id="audience-title" className="scroll-mt-28">What changes when difficulty rises?</span></h2></div>
        <article className="v37-audience-card mt-7" data-reveal>
          <p className="v37-copy">Illustrative scenario: if your fixed hashrate would produce 1 BTC over a period at unchanged difficulty, a 10% higher difficulty throughout that same period gives an expected 1 ÷ 1.10 ≈ 0.909 BTC. The difference is about 0.091 BTC, or 9.09%.</p>
          <p className="text-sm leading-relaxed text-subtle">This holds hashrate, uptime, block reward and other production assumptions constant. It is a sensitivity calculation, not a forecast or a suitable position size. Pool results, fees, power costs and BTC price require separate assumptions.</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1"><Link href="/v3/tools/difficulty-exposure" data-v3-cta="calculator" data-v3-placement="scenario" className="v37-link">Try your numbers <Arrow /></Link><Link href="/v3/product/settlement" data-v3-cta="settlement" data-v3-placement="scenario" className="v37-link">How this relates to a contract <Arrow /></Link></div>
        </article>
        <p className="v37-note">Expected production changes with difficulty. A YES/NO contract has a binary payout at its threshold; its cost, size and timing determine how it relates to a production shortfall. It does not cover every mining risk.</p>
      </Container>
    </section>

    <section id="how-it-works" aria-labelledby="mechanics-title" className="v37-mechanics v37-section">
      <Container>
        <div className="v311-payout-heading" data-reveal><p className="v37-eyebrow">How it works</p><h2 id="mechanics-title" className="v37-heading">Choose a market. Fund your account. Place a trade.</h2><p className="v37-copy">All done in a few minutes.</p></div>
        <ol className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
          {[
            { title: 'Choose a Bitcoin difficulty market', text: ['Review the difficulty threshold and settlement block. Buy Yes if you expect difficulty to be at or above the threshold, or No if you expect it to be below.', 'Prices change as traders buy and sell.'] },
            { title: 'Fund your account and trade', text: ['Deposit cbBTC directly or use the integrated SwapKit to convert native BTC. Then choose your position and place your trade.', 'cbBTC is a wrapped Bitcoin asset; it is not native BTC.'] },
            { title: 'Sell or redeem', text: ['Place a sell order before settlement, or hold until the market resolves. A sale depends on available buyers and price.', 'Each winning share redeems for 1 cbBTC; losing shares have no payout. Your profit or loss also depends on what you paid and any fees.'] },
          ].map((step, index) => <li key={step.title} className="rounded-panel border border-white/10 bg-surface/40 p-5"><p className="text-xs font-semibold text-subtle">Step {index + 1}</p><h3 className="mt-3 text-lg font-semibold text-body">{step.title}</h3>{step.text.map(line => <p key={line} className="mt-2 text-sm leading-relaxed text-subtle">{line}</p>)}</li>)}
        </ol>
        <div className="mt-7" data-reveal><MarketExample /></div>
        <details id="inside-the-product" className="mt-7 rounded-panel border border-white/15 bg-surface/40 p-5 sm:p-6" data-reveal>
          <summary id="product-title" className="min-h-11 scroll-mt-28 cursor-pointer text-base font-semibold text-highlight">Inspect the app capture: 19 October 2026 · not live</summary>
          <ProductPreview />
        </details>
      </Container>
    </section>

    <section id="get-started" aria-labelledby="setup-title" className="v37-audience v37-section">
      <Container>
        <div className="v37-section-top" data-reveal><div><p className="v37-eyebrow">Get started or resume</p><h2 id="setup-title" className="v37-heading">Find the step you need.</h2></div><a href={site.appUrl} data-v3-cta="app" data-v3-placement="setup" className="v37-link">Enter app <Arrow diagonal /></a></div>
        <nav aria-label="Account and first-order guides" className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
          {[
            { number: '1', title: 'Sign in', description: 'Review account access and wallet signing.', href: '/v3/docs/connecting-a-wallet' },
            { number: '2', title: 'Get collateral', description: 'Check the token, network, destination and funding costs.', href: '/v3/docs/getting-collateral' },
            { number: '3', title: 'Place your first order', description: 'Check the market terms, price, amount and execution.', href: '/v3/docs/your-first-trade' },
          ].map(item => <Link key={item.href} href={item.href} data-v3-cta="setup" data-v3-placement="setup" className="group rounded-panel border border-white/10 bg-surface/40 p-5 hover:border-brand/50"><p className="text-xs font-semibold text-subtle">Step {item.number}</p><h3 className="mt-3 text-lg font-semibold text-body group-hover:text-highlight">{item.title} <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-relaxed text-subtle">{item.description}</p></Link>)}
        </nav>
        <p className="v37-note">Returning to a position? Open the app directly or <Link href="/v3/docs/managing-positions" className="underline underline-offset-4">read about managing positions</Link>. You do not need to repeat the learning steps.</p>
      </Container>
    </section>

    <section id="review-evidence" aria-labelledby="evidence-title" className="v37-section">
      <Container>
        <div data-reveal><p className="v37-eyebrow">Review the evidence</p><h2 id="evidence-title" className="v37-heading">Know what to check.</h2></div>
        <nav aria-label="Evidence and risk review" className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
          {[
            { title: 'About Doefin', description: 'Find product context and a way to contact the team.', href: '/v3/about', cta: 'evidence' },
            { title: 'Technical review', description: 'Check what contract, deployment and audit evidence to request.', href: '/v3/docs/smart-contracts', cta: 'evidence' },
            { title: 'Risks and limitations', description: 'Review full loss, liquidity, collateral and technical dependencies.', href: '/v3/docs/risks-and-limitations', cta: 'risk' },
          ].map(item => <Link key={item.href} href={item.href} data-v3-cta={item.cta} data-v3-placement="trust" className="group rounded-panel border border-white/10 bg-surface/40 p-5 hover:border-brand/50"><h3 className="text-lg font-semibold text-body group-hover:text-highlight">{item.title} <span aria-hidden="true">→</span></h3><p className="mt-2 text-sm leading-relaxed text-subtle">{item.description}</p></Link>)}
        </nav>
        <p className="v37-note">Educational examples and synthetic research do not establish live forecasts, trading performance or an audit certification.</p>
      </Container>
    </section>

    <section id="tools-and-learning" aria-labelledby="learning-title" className="v320-updates v37-section">
      <Container>
        <HomeResources />
      </Container>
    </section>

    <section id="faq" aria-labelledby="faq-title" className="v37-faq v37-section">
      <Container className="v37-faq-grid">
        <div data-reveal><p className="v37-eyebrow">Common questions</p><h2 id="faq-title" className="v37-heading">Before you<br />get started.</h2><p className="v37-copy v37-faq-intro">The essentials here. Step-by-step explanations in Docs whenever you need them.</p><Link href="/v3/docs" className="v37-link">Explore the documentation <Arrow /></Link><Link href="/v3/resources" data-v3-cta="resources" data-v3-placement="faq" className="v37-link">Browse educational resources <Arrow /></Link><Link href="/v3/resources#updates" data-v3-cta="contact" data-v3-placement="faq" className="v37-link">Ask the team a question <Arrow /></Link></div>
        <div data-reveal><HomeFaq /></div>
      </Container>
    </section>

    <section id="product-updates" aria-labelledby="updates-title" className="v320-updates v37-section">
      <Container><ProductUpdates /></Container>
    </section>

    <section aria-labelledby="next-step-title" className="v37-next v37-section">
      <Container>
        <div className="v37-close-panel" data-reveal>
          <div className="v37-close-art" aria-hidden="true"><span /><span /><span /></div>
          <div className="v37-close-content"><p className="v37-eyebrow">Your next step</p><h2 id="next-step-title" className="v37-heading">Put your hashrate<br />view to work.</h2><p className="v37-copy">Explore the markets or talk to the team about hedging your exposure.</p><div className="v37-actions"><a href={site.appUrl} data-v3-cta="app" data-v3-placement="closing" className="v37-button">Enter app <Arrow diagonal /></a><a href={'mailto:' + site.contactEmail} data-v3-cta="contact" data-v3-placement="closing" className="v37-link">Contact the team <Arrow diagonal /></a></div></div>
        </div>
      </Container>
    </section>
  </LandingMotion>
}

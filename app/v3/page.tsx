import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { BrandIcon } from '@/components/v3/BrandIcon'
import { HeroVisual } from '@/components/v3/HeroVisual'
import { LandingMotion } from '@/components/v3/LandingMotion'
import { MarketExample } from '@/components/v3/MarketExample'
import { ProductPreview } from '@/components/v3/ProductPreview'
import { ProductUpdates } from '@/components/v3/ProductUpdates'
import { HomeFaq } from '@/components/v3/HomeFaq'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import './home.css'

export const metadata: Metadata = {
  ...seo({ title: 'Markets for Bitcoin mining difficulty', description: 'Understand Doefin’s markets on future Bitcoin mining difficulty, who they serve, how contracts settle and what to review before using the app.', path: '/v3' }),
  robots: { index: false, follow: false },
}

export default function V3Home() {
  return <LandingMotion>
    <section aria-labelledby="v3-title" className="v37-hero">
      <Container className="v37-hero-grid">
        <div className="v37-hero-copy">
          <p className="v37-eyebrow v37-hero-eyebrow"><span aria-hidden="true" />For mining operators, funds &amp; trading desks</p>
          <h1 id="v3-title">Trade Bitcoin<br /><span>mining difficulty.</span></h1>
          <p className="v37-lede">Buy <span className="whitespace-nowrap">YES or NO</span> position tokens on whether difficulty will be at or above a set level at a specified Bitcoin block.</p>
          <div className="v37-actions"><a href={site.appUrl} className="v37-button">Open app <Arrow diagonal /></a><Link href="/v3#how-it-works" className="v37-link">How it works <Arrow /></Link></div>
          <p className="v37-risk">Positions involve risk and can lose value.</p>
        </div>
        <HeroVisual />
      </Container>
    </section>

    <section id="inside-the-product" aria-labelledby="product-title" className="v37-product v37-section">
      <Container>
        <div className="v37-section-top" data-reveal><div><p className="v37-eyebrow">Inside the product</p><h2 id="product-title" className="v37-heading">See the market<br />before you enter.</h2></div><a href={site.appUrl} className="v37-link">Explore the app <Arrow diagonal /></a></div>
        <div className="v37-product-stage" data-reveal><ProductPreview /></div>
      </Container>
    </section>

    <section id="how-it-works" aria-labelledby="mechanics-title" className="v37-mechanics v37-section">
      <Container>
        <div className="v311-payout-heading" data-reveal><p className="v37-eyebrow">How it works</p><h2 id="mechanics-title" className="v37-heading">What determines the payout?</h2></div>
        <div data-reveal><MarketExample /></div>
      </Container>
    </section>

    <section id="who-its-for" aria-labelledby="audience-title" className="v37-audience v37-section">
      <Container>
        <div data-reveal><p className="v37-eyebrow">Who it’s for</p><h2 id="audience-title" className="v37-heading">One market. Different reasons to use it.</h2></div>
        <div className="v37-audience-grid" data-reveal>
          <article className="v37-audience-card">
            <div className="v37-audience-top"><span className="v37-icon-tile"><BrandIcon name="mining" /></span><p className="v37-eyebrow">Mining operators</p></div>
            <h3>Manage difficulty exposure.</h3>
            <p className="v37-copy">Higher difficulty reduces expected BTC production at a fixed hashrate. A winning YES payout may offset part of that loss, depending on the position’s cost, size and timing.</p>
            <Link href="/v3/for/miners#planning-example" className="v37-link">See a miner planning example <Arrow /></Link>
          </article>
          <article className="v37-audience-card v37-audience-trading">
            <div className="v37-audience-top"><span className="v37-icon-tile"><BrandIcon name="market" /></span><p className="v37-eyebrow">Funds &amp; trading desks</p></div>
            <h3>Trade your view on difficulty.</h3>
            <p className="v37-copy">Take a position on future network difficulty. Compare your view with market prices, timing and available liquidity.</p>
            <Link href="/v3/for/institutions" className="v37-link">Explore the trading use case <Arrow /></Link>
          </article>
        </div>
        <p className="v37-note">A difficulty position does not cover every mining risk. Bitcoin price, power costs and downtime remain separate considerations.</p>
      </Container>
    </section>

    <section id="product-updates" aria-labelledby="updates-title" className="v320-updates v37-section">
      <Container>
        <ProductUpdates />
      </Container>
    </section>

    <section id="faq" aria-labelledby="faq-title" className="v37-faq v37-section">
      <Container className="v37-faq-grid">
        <div data-reveal><p className="v37-eyebrow">Common questions</p><h2 id="faq-title" className="v37-heading">Before you<br />get started.</h2><p className="v37-copy v37-faq-intro">The essentials here. Step-by-step explanations in Docs whenever you need them.</p><Link href="/v3/docs" className="v37-link">Explore the documentation <Arrow /></Link></div>
        <div data-reveal><HomeFaq /></div>
      </Container>
    </section>

    <section aria-labelledby="next-step-title" className="v37-next v37-section">
      <Container>
        <div className="v37-close-panel" data-reveal>
          <div className="v37-close-art" aria-hidden="true"><span /><span /><span /></div>
          <div className="v37-close-content"><p className="v37-eyebrow">Your next step</p><h2 id="next-step-title" className="v37-heading">Take a closer look<br />at Doefin.</h2><p className="v37-copy">Explore the markets, or talk to our team.</p><div className="v37-actions"><a href={site.appUrl} className="v37-button">Open app <Arrow diagonal /></a><a href={'mailto:' + site.contactEmail} className="v37-link">Talk to the team <Arrow diagonal /></a></div></div>
        </div>
      </Container>
    </section>
  </LandingMotion>
}

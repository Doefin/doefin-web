import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from '@/components/v3/Arrow'
import { LandingMotion } from '@/components/v3/LandingMotion'
import { HomeFaq } from '@/components/v3/HomeFaq'
import { seo } from '@/lib/seo'
import { ApprovedLanding } from '@/components/v3/approved-landing/ApprovedLanding'
import '@/components/v3/approved-landing/approved-landing.css'
import '@/components/v3/approved-landing/difficulty-impact.css'
import './home.css'

export const metadata: Metadata = {
  ...seo({ title: 'Trade and hedge Bitcoin hashrate exposure', description: 'Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. See how markets work and what to check before trading. For professional investors.', path: '/' }),
  robots: { index: true, follow: true },
}

export default function V3Home() {
  return <LandingMotion>
    <ApprovedLanding />

    <section id="faq" aria-labelledby="faq-title" className="v37-faq v37-section">
      <Container className="v37-faq-grid">
        <div data-reveal><p className="v37-eyebrow">Common questions</p><h2 id="faq-title" className="v37-heading">Questions about<br />using Doefin.</h2><p className="v37-copy v37-faq-intro">Short answers here. Step-by-step guides are in the docs.</p><Link href="/docs" className="v37-link">Browse the docs <Arrow /></Link><Link href="/resources" data-v3-cta="resources" data-v3-placement="faq" className="v37-link">Browse the learning resources <Arrow /></Link><Link href="/resources#updates" data-v3-cta="contact" data-v3-placement="faq" className="v37-link">Ask the team a question <Arrow /></Link></div>
        <div data-reveal><HomeFaq /></div>
      </Container>
    </section>
  </LandingMotion>
}

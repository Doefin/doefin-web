'use client'

import { EnvelopeSimple } from '@phosphor-icons/react'
import Link from '@/components/routing/SiteLink'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import { NewsletterForm } from './NewsletterForm'
import styles from './HomeResearchEmail.module.css'

export function ProductUpdates() {
  return <div className={styles.measure} data-reveal>
    <p className={`v37-eyebrow ${styles.eyebrow}`}><EnvelopeSimple size={16} aria-hidden="true" />Your next step</p>
    <h2 id="updates-title" className="v37-heading"><span id="next-step-title" className="scroll-mt-28">Put your hashrate view to work.</span></h2>
    <p className={`v37-copy ${styles.lede}`}>Explore the markets or talk to the team about hedging your exposure.</p>
    <div className="v37-actions">
      <a href={site.appUrl} data-v3-cta="app" data-v3-placement="closing" className="v37-button">Enter app <Arrow diagonal /></a>
      <a href={'mailto:' + site.contactEmail} data-v3-cta="contact" data-v3-placement="closing" className="v37-link">Contact the team <Arrow diagonal /></a>
    </div>
    <section className={styles.demo} aria-labelledby="research-email-title">
      <h3 id="research-email-title" className="text-lg font-semibold leading-snug tracking-tight">Research email demo</h3>
      <p id="research-email-note" className={`v37-copy ${styles.intro}`}>Preview your preferences. No email is sent, no subscription is created and no personal details are saved.</p>
      <Link href="/newsletter#sample-issue" className="v37-link">Read the sample issue <Arrow diagonal /></Link>
      <NewsletterForm homepage describedBy="research-email-note" />
    </section>
  </div>
}

'use client'

import Image from 'next/image'
import { EnvelopeSimple } from '@phosphor-icons/react'
import Link from '@/components/routing/SiteLink'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import { NewsletterForm } from './NewsletterForm'
import styles from './ProductUpdates.module.css'

export function ProductUpdates() {
  return <div className={styles.layout} data-reveal>
    <div className={styles.copy}>
      <p className={`v37-eyebrow ${styles.eyebrow}`}><EnvelopeSimple size={16} aria-hidden="true" />Your next step</p>
      <h2 id="updates-title" className="v37-heading"><span id="next-step-title" className="scroll-mt-28">Put your hashrate<br /><span className={styles.accent}>view to work.</span></span></h2>
      <p className={`v37-copy ${styles.description}`}>Explore the markets or talk to the team about hedging your exposure.</p>
      <div className="v37-actions"><a href={site.appUrl} data-v3-cta="app" data-v3-placement="closing" className="v37-button">Enter app <Arrow diagonal /></a><a href={'mailto:' + site.contactEmail} data-v3-cta="contact" data-v3-placement="closing" className="v37-link">Contact the team <Arrow diagonal /></a></div>
      <div className="mt-7 border-t border-white/10 pt-5"><h3 className="text-base font-semibold">Research email demo</h3><p className="mt-2 text-sm leading-relaxed text-subtle"><Link href="/newsletter#sample-issue" className="text-highlight underline underline-offset-4">Read an example research email</Link>, then preview your email preferences below.</p></div>
      <NewsletterForm />
    </div>
    <figure className={styles.art} aria-hidden="true"><Image src="/images/v3/product-updates-envelope.png" width={1254} height={1254} alt="" sizes="(max-width: 639px) 240px, (max-width: 899px) 300px, (max-width: 1199px) 380px, 490px" /></figure>
  </div>
}

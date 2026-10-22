'use client'

import Image from 'next/image'
import { ChartLine, EnvelopeSimple, Lightning } from '@phosphor-icons/react'
import { NewsletterForm } from './NewsletterForm'
import styles from './ProductUpdates.module.css'

export function ProductUpdates() {
  return <div className={styles.layout} data-reveal>
    <div className={styles.copy}>
      <p className={`v37-eyebrow ${styles.eyebrow}`}><EnvelopeSimple size={16} aria-hidden="true" />Stay informed</p>
      <h2 id="updates-title" className="v37-heading">Follow the next<br /><span className={styles.accent}>difficulty retarget.</span></h2>
      <p className={`v37-copy ${styles.description}`}>Research you can inspect: observed retargets, methods and reusable datasets. Choose research emails, product updates or publication alerts.</p>
      <ul className={styles.topics} aria-label="What research emails cover"><li><ChartLine size={18} aria-hidden="true" />Retarget research</li><li><Lightning size={18} aria-hidden="true" />New publications</li></ul>
      <NewsletterForm />
    </div>
    <figure className={styles.art} aria-hidden="true"><Image src="/v4/assets/product-updates-envelope.png" width={1254} height={1254} alt="" sizes="(max-width: 639px) 240px, (max-width: 899px) 300px, (max-width: 1199px) 380px, 490px" /></figure>
  </div>
}

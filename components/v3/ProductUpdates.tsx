import { EnvelopeSimple } from '@phosphor-icons/react/dist/ssr'
import Link from '@/components/routing/SiteLink'
import { dateLong } from '@/lib/format'
import { researchCapture, researchSummary } from '@/lib/research-data'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import { NewsletterForm } from './NewsletterForm'
import styles from './HomeResearchEmail.module.css'

export function ProductUpdates() {
  return <div className={styles.layout} data-reveal>
    <div className={styles.measure}>
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
    <figure className={styles.art} aria-labelledby="sample-issue-preview-title">
      <figcaption className={styles.issue}>
        <p className="v37-eyebrow">From the sample issue</p>
        <p id="sample-issue-preview-title" className={styles.issueTitle}>Observed difficulty adjustments</p>
        <p className={styles.issueDates}>
          <time dateTime={researchSummary.firstDate}>{dateLong(researchSummary.firstDate)}</time> to{' '}
          <time dateTime={researchSummary.lastDate}>{dateLong(researchSummary.lastDate)}</time>
        </p>
        <div className={styles.issueBar} aria-hidden="true">
          <span style={{ flexGrow: researchSummary.increases }} />
          <span style={{ flexGrow: researchSummary.decreases }} />
        </div>
        <div className={styles.issueCounts}>
          <span><strong>{researchSummary.increases}</strong> increases</span>
          <span><strong>{researchSummary.decreases}</strong> decreases</span>
        </div>
        <p className={styles.issueSource}>{researchCapture.sourcePublisher}, captured <time dateTime={researchCapture.capturedAt}>{dateLong(researchCapture.capturedAt)}</time></p>
      </figcaption>
      <svg className={styles.envelope} viewBox="0 0 288 76" fill="none" aria-hidden="true">
        <path d="m1 1 127 38a55 55 0 0 0 32 0L287 1v61a13 13 0 0 1-13 13H14A13 13 0 0 1 1 62Z" fill="var(--df-surface)" stroke="var(--df-line-strong)" strokeLinejoin="round" />
        <path d="m6 71 100-39m176 39L182 32" stroke="var(--df-line-strong)" />
      </svg>
    </figure>
  </div>
}

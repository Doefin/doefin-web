import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { InstitutionsExplorer } from './InstitutionsExplorer'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import styles from './audience.module.css'

export const metadata = seo({ title: 'Doefin for funds and trading desks', description: 'Explore active Bitcoin difficulty contracts by collateral, observation block and threshold. Inspect outcomes and indicative prices before reviewing a market in the app.', path: '/v3/for/institutions' })

const reading = [
  ['01', 'Settlement & payout', 'What is observed, when it resolves and how winning tokens redeem.', '/v3/docs/how-settlement-works'],
  ['02', 'Execution & liquidity', 'Market and limit orders, available depth and unfilled amounts.', '/v3/docs/market-vs-limit-orders'],
  ['03', 'Contracts & operations', 'The deployment and technical evidence your review needs.', '/v3/docs/smart-contracts'],
]

export default function InstitutionsPage() {
  return <Container className="pb-14 pt-8 sm:pb-20 sm:pt-12">
    <div className={styles.deskIntro}>
      <div>
        <p className={styles.eyebrow}>For funds &amp; desks</p>
        <h1 className={styles.title}>A view on difficulty.<br /><span>A contract to inspect.</span></h1>
        <p className={styles.intro}>Find the observation block, threshold and collateral that fit your thesis. Compare both outcomes, then take the exact contract into the app for execution review.</p>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1"><a href="#market-explorer" className={styles.textLink}>Explore contracts <Arrow /></a><Link href="/v3/docs/what-doefin-settles-on" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-subtle hover:text-body">Understand the instrument <Arrow /></Link></div>
      </div>
      <aside className={styles.mandate} aria-label="Instrument at a glance">
        <span className={styles.eyebrow}>The instrument</span>
        <p>Bitcoin mining difficulty<br /><strong>Binary outcome. Defined block.</strong></p>
        <dl><div><dt>Reference</dt><dd>Network difficulty</dd></div><div><dt>Position</dt><dd>Buy YES or NO</dd></div><div><dt>Winning payout</dt><dd>Fixed per token</dd></div></dl>
        <Link href="/v3/docs/risks-and-limitations" className={styles.textLink}>Read the risk framework <Arrow /></Link>
      </aside>
    </div>

    <InstitutionsExplorer />

    <section id="review-checklist" className={styles.diligence} aria-labelledby="desk-diligence-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Before committing capital</p><h2 id="desk-diligence-title">Build your review.</h2></div><p>A public snapshot helps you identify an instrument. Your mandate, execution and operational checks remain essential.</p></div>
      <div className={styles.readingGrid}>{reading.map(([number, title, body, href]) => <Link key={href} href={href} className={styles.readingCard}><span className={styles.readingNumber}>{number}</span><h3>{title} <Arrow /></h3><p>{body}</p></Link>)}</div>
      <div className={styles.reviewStrip}><div><h3>Bring the specific contract to your team.</h3><p>Review size and fees, collateral and funding, exit constraints, settlement and redemption, and the approvals your mandate requires.</p></div><a href={`mailto:${site.contactEmail}?subject=Doefin%20desk%20review`} className={styles.textLink}>Talk to the team <Arrow diagonal /></a></div>
    </section>
  </Container>
}

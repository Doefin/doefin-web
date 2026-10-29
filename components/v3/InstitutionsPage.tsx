import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { InstitutionsExplorer } from './InstitutionsExplorer'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import styles from './audience.module.css'

export const metadata = seo({ title: 'Doefin for finance teams, funds and trading desks', description: 'Prepare a CFO or treasury review of mining difficulty exposure. Share production scenarios, check mandate and settlement questions, then inspect a contract with your team.', path: '/v3/for/institutions' })

const reading = [
  ['01', 'Settlement & payout', 'What is observed, when it resolves and how winning tokens redeem.', '/v3/docs/how-settlement-works'],
  ['02', 'Execution & liquidity', 'Market and limit orders, available depth and unfilled amounts.', '/v3/docs/market-vs-limit-orders'],
  ['03', 'Contracts & operations', 'The deployment and technical evidence your review needs.', '/v3/docs/smart-contracts'],
]

export default function InstitutionsPage() {
  return <Container className="pb-14 pt-8 sm:pb-20 sm:pt-12">
    <div className={styles.deskIntro}>
      <div>
        <p className={styles.eyebrow}>For finance teams, funds &amp; desks</p>
        <h1 className={styles.title}>Trade your view on<br /><span>Bitcoin network hashrate.</span></h1>
        <p className={styles.intro}>Take positions through markets on mining difficulty, with a defined threshold and settlement block. The contract outcome follows difficulty, giving your hashrate view a publicly verifiable reference. Trading involves the risk of loss.</p>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1"><a href="#market-explorer" className={styles.textLink}>Explore contracts <Arrow /></a><Link href="/v3/docs/what-doefin-settles-on" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-subtle hover:text-body">Understand the instrument <Arrow /></Link></div>
      </div>
      <aside className={styles.mandate} aria-label="Instrument at a glance">
        <span className={styles.eyebrow}>The instrument</span>
        <p>Bitcoin mining difficulty<br /><strong>Binary outcome. Defined block.</strong></p>
        <dl><div><dt>Reference</dt><dd>Network difficulty</dd></div><div><dt>Position</dt><dd>Buy YES or NO</dd></div><div><dt>Winning payout</dt><dd>Fixed per token</dd></div></dl>
        <Link href="/v3/docs/risks-and-limitations" className={styles.textLink}>Read the risk framework <Arrow /></Link>
      </aside>
    </div>

    <section id="finance-review" className={styles.diligence} aria-labelledby="finance-review-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>From analysis to an internal decision</p><h2 id="finance-review-title">Give each reviewer the evidence they need.</h2></div><p>A reader can explore the public material freely. A capital decision needs the organisation’s own exposure, constraints and approval process.</p></div>
      <div className={styles.readingGrid}>
        <div className={styles.readingCard}><span className={styles.readingNumber}>CFO &amp; treasury</span><h3>Define the business question.</h3><p>Which production period matters? What BTC production range changes your cash plan? Record your assumptions and compare scenarios before considering position size or funding.</p><Link href="/v3/tools/difficulty-exposure" className={styles.textLink}>Prepare a production scenario <Arrow /></Link></div>
        <div className={styles.readingCard}><span className={styles.readingNumber}>Funds, desks &amp; credit teams</span><h3>Check the mandate and the instrument.</h3><p>Identify the observation block, threshold, collateral and payout. Assess whether the instrument fits your thesis or borrower review. Production exposure and contract payout are separate calculations.</p><a href="#market-explorer" className={styles.textLink}>Inspect the contracts <Arrow /></a></div>
        <div className={styles.readingCard}><span className={styles.readingNumber}>Internal champion</span><h3>Make the review forwardable.</h3><p>Use the scenario brief to share your inputs, results and model limits. Add the intended decision and the open questions. Keep private discussion notes out of public links.</p><Link href="/v3/tools/difficulty-exposure#scenario-brief" className={styles.textLink}>Build a team brief <Arrow /></Link></div>
      </div>
      <div className="mt-7 rounded-panel border border-white/10 p-5 sm:p-7">
        <h3 className="text-lg font-semibold">Questions to resolve with your approvers</h3>
        <ol className="mt-4 grid list-decimal gap-x-10 gap-y-3 pl-5 text-sm leading-relaxed text-subtle sm:grid-cols-2">
          <li><strong className="text-body">Exposure owner:</strong> confirm fleet assumptions, horizon and the business decision. Compare the scenario with your operating forecast.</li>
          <li><strong className="text-body">Treasury and finance:</strong> review funding, collateral, fees, reporting and the effect on cash needs. Confirm who can approve the amount.</li>
          <li><strong className="text-body">Risk and operations:</strong> check depth, partial fills, exits, settlement, redemption and wallet or custody controls. Identify unresolved evidence.</li>
          <li><strong className="text-body">Your authorised reviewers:</strong> confirm mandate, eligibility and any legal or accounting questions for your organisation. A website example does not establish approval.</li>
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-subtle">There is no fleet-size or capital threshold implied by this walkthrough. Your own mandate and review determine suitability.</p>
        <div className="mt-4 flex flex-wrap gap-x-7"><Link href="/v3/docs/risks-and-limitations" className={styles.textLink}>Read the limitations <Arrow /></Link><a href={`mailto:${site.contactEmail}?subject=Doefin%20finance%20and%20mandate%20review`} className={styles.textLink}>Discuss unresolved questions <Arrow diagonal /></a></div>
      </div>
    </section>

    <InstitutionsExplorer />

    <section id="review-checklist" className={styles.diligence} aria-labelledby="desk-diligence-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Before committing capital</p><h2 id="desk-diligence-title">Build your review.</h2></div><p>A public snapshot helps you identify an instrument. Your mandate, execution and operational checks remain essential.</p></div>
      <div className={styles.readingGrid}>{reading.map(([number, title, body, href]) => <Link key={href} href={href} className={styles.readingCard}><span className={styles.readingNumber}>{number}</span><h3>{title} <Arrow /></h3><p>{body}</p></Link>)}</div>
      <div className={styles.reviewStrip}><div><h3>Bring the specific contract to your team.</h3><p>Review size and fees, collateral and funding, exit constraints, settlement and redemption, and the approvals your mandate requires.</p></div><a href={`mailto:${site.contactEmail}?subject=Doefin%20desk%20review`} className={styles.textLink}>Talk to the team <Arrow diagonal /></a></div>
    </section>
  </Container>
}

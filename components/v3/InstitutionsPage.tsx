import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { InstitutionsExplorer } from './InstitutionsExplorer'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import styles from './audience.module.css'

export const metadata = seo({ title: 'Doefin for finance teams, funds and trading desks', description: 'Trade your view on Bitcoin network hashrate through markets on mining difficulty. Inspect the contracts and prepare a review with your team.', path: '/for/institutions' })

const reading = [
  ['01', 'Settlement & payout', 'The observed value, when the market resolves and how to redeem winning shares.', '/docs/how-settlement-works'],
  ['02', 'Execution & liquidity', 'How market and limit orders work, including depth and unfilled amounts.', '/docs/market-vs-limit-orders'],
  ['03', 'Contracts & operations', 'Smart contract deployments and the technical evidence to check.', '/docs/smart-contracts'],
]

export default function InstitutionsPage() {
  return <Container className="pb-14 pt-8 sm:pb-20 sm:pt-12">
    <div className={styles.deskIntro}>
      <div>
        <p className={styles.eyebrow}>For finance teams, funds &amp; desks</p>
        <h1 className={styles.title}>Trade your view on<br /><span>Bitcoin network hashrate.</span></h1>
        <p className={styles.intro}>Take positions through markets on mining difficulty, with a defined threshold and observation block. The contract outcome follows difficulty, giving your hashrate view a publicly verifiable reference. Trading involves the risk of loss.</p>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1"><a href="#market-explorer" className={styles.textLink}>Explore contracts <Arrow /></a><Link href="/docs/what-doefin-settles-on" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-subtle hover:text-body">Understand the instrument <Arrow /></Link></div>
      </div>
      <aside className={styles.mandate} aria-label="Instrument at a glance">
        <span className={styles.eyebrow}>The instrument</span>
        <p>Bitcoin mining difficulty<br /><strong>Binary outcome. Defined block.</strong></p>
        <dl><div><dt>Reference</dt><dd>Network difficulty</dd></div><div><dt>Position</dt><dd>Buy Yes or No shares</dd></div><div><dt>Winning payout</dt><dd>Fixed per share</dd></div></dl>
        <Link href="/docs/risks-and-limitations" className={styles.textLink}>Read risks and limitations <Arrow /></Link>
      </aside>
    </div>

    <section id="finance-review" className={styles.diligence} aria-labelledby="finance-review-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Production, trading and credit analysis</p><h2 id="finance-review-title">How will your team use Doefin?</h2></div><p>Model expected BTC production for a cash plan or borrower assessment. Compare a difficulty market with your investment thesis. Public material is freely available; assess your organisation’s exposure and constraints and follow its approval process before committing capital.</p></div>
      <div className={styles.readingGrid}>
        <div className={styles.readingCard}><span className={styles.readingNumber}>CFO &amp; treasury</span><h3>Compare BTC production scenarios.</h3><p>Choose the production period relevant to your cash plan. Record your assumptions and compare expected BTC production under different difficulty scenarios before considering position size or funding.</p><Link href="/tools/difficulty-exposure" className={styles.textLink}>Prepare a production scenario <Arrow /></Link></div>
        <div className={styles.readingCard}><span className={styles.readingNumber}>Funds, desks &amp; credit teams</span><h3>Match a market to your analysis.</h3><p>Compare the observation block, threshold, collateral and payout with your investment thesis or borrower assessment. Model production exposure separately from the position’s payout.</p><a href="#market-explorer" className={styles.textLink}>Inspect the contracts <Arrow /></a></div>
        <div className={styles.readingCard}><span className={styles.readingNumber}>Review lead</span><h3>Prepare a scenario brief.</h3><p>Give your team the inputs, results and model limits behind the decision you are considering. Include open questions and keep private discussion notes out of public links.</p><Link href="/tools/difficulty-exposure#scenario-brief" className={styles.textLink}>Build a team brief <Arrow /></Link></div>
      </div>
      <div className="mt-7 rounded-panel border border-white/10 p-5 sm:p-7">
        <h3 className="text-lg font-semibold">Questions for your internal review</h3>
        <ol className="mt-4 grid list-decimal gap-x-10 gap-y-3 pl-5 text-sm leading-relaxed text-subtle sm:grid-cols-2">
          <li><strong className="text-body">Exposure owner:</strong> check the fleet assumptions and time period against your operating forecast. State the business decision the scenario will inform.</li>
          <li><strong className="text-body">Treasury and finance:</strong> check funding, collateral, fees and reporting, including the effect on cash needs. Confirm who can approve the amount.</li>
          <li><strong className="text-body">Risk and operations:</strong> check available depth, partial fills, exit options, settlement, redemption and wallet or custody controls. Note any missing information.</li>
          <li><strong className="text-body">Your authorised reviewers:</strong> confirm mandate and eligibility for your organisation. Resolve any legal or accounting questions. A website example does not establish approval.</li>
        </ol>
        <p className="mt-5 text-xs leading-relaxed text-subtle">This walkthrough does not set a minimum fleet size or capital amount. Assess suitability against your own mandate and review process.</p>
        <div className="mt-4 flex flex-wrap gap-x-7"><Link href="/docs/risks-and-limitations" className={styles.textLink}>Read the limitations <Arrow /></Link><a href={`mailto:${site.contactEmail}?subject=Doefin%20finance%20and%20mandate%20review`} className={styles.textLink}>Discuss unresolved questions <Arrow diagonal /></a></div>
      </div>
    </section>

    <InstitutionsExplorer />

    <section id="review-checklist" className={styles.diligence} aria-labelledby="desk-diligence-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Contract documentation</p><h2 id="desk-diligence-title">Read how trading and settlement work.</h2></div><p>Read how the selected market pays out, how orders execute and which smart contracts it uses. Check the market’s terms alongside these guides.</p></div>
      <div className={styles.readingGrid}>{reading.map(([number, title, body, href]) => <Link key={href} href={href} className={styles.readingCard}><span className={styles.readingNumber}>{number}</span><h3>{title} <Arrow /></h3><p>{body}</p></Link>)}</div>
      <div className={styles.reviewStrip}><div><h3>Ask the team about a market.</h3><p>Contact the team with questions about the selected market’s size, fees, collateral, funding, exits, settlement or redemption. Follow your organisation’s approval process before committing capital.</p></div><a href={`mailto:${site.contactEmail}?subject=Doefin%20desk%20review`} className={styles.textLink}>Contact the team <Arrow diagonal /></a></div>
    </section>
  </Container>
}

import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { InstitutionsExplorer } from './InstitutionsExplorer'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import styles from './audience.module.css'

export const metadata = seo({ title: 'Doefin for finance teams, funds and trading desks', description: 'Trade your view on Bitcoin network hashrate through markets on mining difficulty. Inspect the contracts and prepare a review with your team.', path: '/for/institutions' })

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
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Production and position outcomes</p><h2 id="finance-review-title">Could a position offset lower production?</h2></div></div>
      <div className="mt-6 grid gap-7 text-sm leading-relaxed text-subtle md:grid-cols-2">
        <div className="space-y-4">
          <p>A mining cash plan or borrower assessment depends on expected BTC production. Compare a production shortfall with a position’s cost and both possible payouts to assess what exposure would remain. Include fees, position size and timing in that comparison.</p>
          <p>Production depends on difficulty throughout the period. A position’s outcome depends on difficulty at one observation block. A winning share pays a fixed amount, however far difficulty moves beyond the threshold. A position can pay nothing while production is lower, or pay more or less than the production difference.</p>
          <p>A difficulty position may offset some mining losses, but does not cover every source of production or revenue risk. Uptime, energy costs and BTC price need separate analysis.</p>
          <Link href="/tools/difficulty-exposure" className={styles.textLink}>Compare production scenarios <Arrow /></Link>
        </div>
        <aside className="rounded-panel border border-white/10 p-5 sm:p-7" aria-label="Illustrative production example">
          <p className="text-xs font-semibold text-caution">Illustrative production example</p>
          <p className="mt-4">Suppose expected production is 1 BTC over a given period at unchanged difficulty. With difficulty 10% higher throughout that period, expected production falls to 1 ÷ 1.10 ≈ 0.909 BTC.</p>
          <p className="mt-4">Hashrate, uptime, block reward and other production assumptions stay the same. This is a production estimate, not a forecast or a position size.</p>
        </aside>
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-subtle">Funds and desks can assess a market against their view on network hashrate without modelling a mining fleet. The contract terms still need to match the view they want to trade.</p>
    </section>

    <InstitutionsExplorer />

    <section id="review-checklist" className={styles.diligence} aria-labelledby="desk-diligence-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Before committing capital</p><h2 id="desk-diligence-title">Check the market against your requirements.</h2></div><p>Use the selected market’s terms alongside the documentation. Public material is freely available; it does not establish suitability or approval for your organisation.</p></div>
      <ol className="mt-6 grid list-decimal gap-x-10 gap-y-7 pl-5 text-sm leading-relaxed text-subtle md:grid-cols-2">
        <li className="pl-1"><h3 className="font-semibold text-body">What decision are you making?</h3><p className="mt-2">Start with the decision your team needs to make. For a production comparison, check the fleet assumptions and period against your operating forecast. Record the model’s limits and the questions still open.</p><p className="mt-2">Share the inputs and results your team needs. Keep private discussion notes out of public links.</p><Link href="/tools/difficulty-exposure#scenario-brief" className={styles.textLink}>Prepare a scenario brief <Arrow /></Link></li>
        <li className="pl-1"><h3 className="font-semibold text-body">What are the costs and outcomes?</h3><p className="mt-2">Check the threshold and observation block against your analysis. Read the settlement block, payout and redemption rules separately. Confirm the collateral token, how you will fund the position and the fees. Check what your team needs to report and how the position affects cash needs.</p><p className="mt-2">You can lose the full amount paid for a position.</p><Link href="/docs/how-settlement-works" className={styles.textLink}>Read settlement and payout rules <Arrow /></Link></li>
        <li className="pl-1"><h3 className="font-semibold text-body">Could you exit the position?</h3><p className="mt-2">Check market depth, whether your order could fill only in part and how you could exit. Limited liquidity can prevent a full exit before settlement. Review your wallet or custody controls, the smart contract deployments and the technical evidence.</p><p className="mt-2">Funding and payouts depend on the collateral token, smart contracts, networks and the settlement process.</p><div className="mt-2 flex flex-wrap gap-x-6"><Link href="/docs/market-vs-limit-orders" className={styles.textLink}>Read how orders execute <Arrow /></Link><Link href="/docs/smart-contracts" className={styles.textLink}>Inspect smart contracts <Arrow /></Link></div></li>
        <li className="pl-1"><h3 className="font-semibold text-body">Who can approve the amount?</h3><p className="mt-2">Your authorised reviewers must confirm your organisation’s mandate and eligibility. They must resolve legal or accounting questions and approve the amount before you commit capital.</p><p className="mt-2">This walkthrough sets no minimum fleet size or capital amount. Assess suitability through your own review process.</p><div className="mt-2 flex flex-wrap gap-x-6"><Link href="/docs/risks-and-limitations" className={styles.textLink}>Read the limitations <Arrow /></Link><a href={`mailto:${site.contactEmail}?subject=Doefin%20finance%20and%20mandate%20review`} className={styles.textLink}>Discuss mandate questions <Arrow diagonal /></a></div></li>
      </ol>
      <div className={styles.reviewStrip}><div><h3>Have a question about a market?</h3><p>Contact the team with the market you are considering and the question you need answered.</p></div><a href={`mailto:${site.contactEmail}?subject=Doefin%20desk%20review`} className={styles.textLink}>Contact the team <Arrow diagonal /></a></div>
    </section>
  </Container>
}

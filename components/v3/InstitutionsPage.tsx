import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { InstitutionsExplorer } from './InstitutionsExplorer'
import { AudienceDisclosure } from './AudienceDisclosure'
import { institutionsReviewSnapshot } from '@/content'
import type { InstitutionsReviewLink } from '@/content'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import styles from './audience.module.css'

export const metadata = seo({ title: 'Doefin for finance teams, funds and trading desks', description: 'Trade your view on Bitcoin network hashrate through markets on mining difficulty. Inspect the contracts and prepare a review with your team.', path: '/for/institutions' })

function renderReviewLink(link: InstitutionsReviewLink) {
  return 'href' in link && link.href !== undefined
    ? <Link key={link.label} href={link.href} className={styles.textLink}>{link.label} <Arrow /></Link>
    : <a key={link.label} href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(link.contactSubject)}`} className={styles.textLink}>{link.label} <Arrow diagonal /></a>
}

export default async function InstitutionsPage() {
  const review = await institutionsReviewSnapshot()
  return <Container className="pb-14 pt-8 sm:pb-20 sm:pt-12">
    <div className={styles.deskIntro}>
      <div>
        <p className={styles.eyebrow}>For finance teams, funds &amp; desks</p>
        <h1 className={styles.title}>Trade your view on<br /><span>Bitcoin network hashrate.</span></h1>
        <p className={styles.intro}>Take positions through markets on mining difficulty, with a defined threshold and observation block. The contract outcome follows difficulty, giving your hashrate view a publicly verifiable reference.</p>
        <p className={styles.riskNote}>Trading involves the risk of loss.</p>
        <div className="mt-5 flex flex-wrap gap-x-7 gap-y-1"><a href="#market-explorer" className={styles.primaryLink}>Explore contracts <Arrow /></a><Link href="/docs/what-doefin-settles-on" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-subtle hover:text-body">Understand the instrument <Arrow /></Link></div>
      </div>
      <aside className={styles.mandate} aria-label="Instrument at a glance">
        <span className={styles.eyebrow}>The instrument</span>
        <p>Bitcoin mining difficulty<br /><strong>Binary outcome. Defined block.</strong></p>
        <dl><div><dt>Reference</dt><dd>Network difficulty</dd></div><div><dt>Position</dt><dd>Buy Yes or No shares</dd></div><div><dt>Winning payout</dt><dd>Fixed per share</dd></div></dl>
        <Link href="/docs/risks-and-limitations" className={styles.textLink}>Read risks and limitations <Arrow /></Link>
      </aside>
    </div>

    <InstitutionsExplorer />

    <section id="finance-review" className={styles.diligence} aria-labelledby="finance-review-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>Production and position outcomes</p><h2 id="finance-review-title">Could a position offset lower production?</h2></div></div>
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-subtle">A difficulty position may offset some mining losses, but does not cover every source of production or revenue risk. Uptime, energy costs and BTC price need separate analysis.</p>
      <Link href="/tools/difficulty-exposure" className={styles.textLink}>Compare production scenarios <Arrow /></Link>
      <AudienceDisclosure summary="Read the production comparison and example">
      <div className="mt-6 grid gap-7 text-sm leading-relaxed text-subtle md:grid-cols-2">
        <div className="space-y-4">
          <p>A mining cash plan or borrower assessment depends on expected BTC production. Compare a production shortfall with a position’s cost and both possible payouts to assess what exposure would remain. Include fees, position size and timing in that comparison.</p>
          <p>Production depends on difficulty throughout the period. A position’s outcome depends on difficulty at one observation block. A winning share pays a fixed amount, however far difficulty moves beyond the threshold. A position can pay nothing while production is lower, or pay more or less than the production difference.</p>
        </div>
        <aside className="rounded-panel border border-white/10 p-5 sm:p-7" aria-label="Illustrative production example">
          <p>Suppose expected production is 1 BTC over a given period at unchanged difficulty. With difficulty 10% higher throughout that period, expected production falls to 1 ÷ 1.10 ≈ 0.909 BTC.</p>
          <p className="mt-4">Hashrate, uptime, block reward and other production assumptions stay the same. This is a production estimate, not a forecast or a position size.</p>
        </aside>
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-subtle">Funds and desks can assess a market against their view on network hashrate without modelling a mining fleet. The contract terms still need to match the view they want to trade.</p>
      </AudienceDisclosure>
    </section>

    {review.visible && <section id="review-checklist" className={styles.diligence} aria-labelledby="desk-diligence-title">
      <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>{review.eyebrow}</p><h2 id="desk-diligence-title">{review.heading}</h2></div><p>{review.intro}</p></div>
      <p className="mt-4 text-sm leading-relaxed text-subtle">{review.riskNote}</p>
      <ol className={styles.reviewGrid} role="list">
        {review.cards.map((card, index) => <li className={styles.reviewCard} key={card.title}>
          <span className={styles.reviewNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <h3>{card.title}</h3>
          <p>{card.summary}</p>
          <AudienceDisclosure summary={card.disclosureSummary}>{card.disclosureParagraphs.map(paragraph => <p className="mt-2" key={paragraph}>{paragraph}</p>)}{card.links.length === 1 ? renderReviewLink(card.links[0]) : <div className="mt-2 flex flex-wrap gap-x-6">{card.links.map(renderReviewLink)}</div>}</AudienceDisclosure>
        </li>)}
      </ol>
      <div className={styles.reviewStrip}><div><h3>{review.stripHeading}</h3><p>{review.stripText}</p></div><a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(review.stripSubject)}`} className={styles.textLink}>{review.stripLabel} <Arrow diagonal /></a></div>
    </section>}
  </Container>
}

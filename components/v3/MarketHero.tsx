import { Container } from '@/components/layout/Container'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './MarketHero.module.css'

export function MarketHero() {
  return (
    <section aria-labelledby="v3-title" className={styles.hero}>
      <Container className={styles.content}>
        <p className={styles.eyebrow}>For professional investors only</p>
        <div className={styles.intro}>
          <h1 id="v3-title" className={styles.title}>Trade Bitcoin<br />mining difficulty<span>.</span></h1>
          <p className={styles.lede}>Hedge Bitcoin hashrate exposure or trade your view on future mining difficulty.</p>
          <Link href="/product" data-v3-cta="overview" data-v3-placement="hero" className={styles.primary}>
            See how the markets work <Arrow />
          </Link>
        </div>
        <figure className={styles.market} aria-labelledby="hero-market-caption">
          <figcaption id="hero-market-caption" className={styles.annotation}>
            <p>In this example, the difficulty reading at this Bitcoin block decides the market outcome.</p>
            <dl className={styles.terms}>
              <div><dt>Bitcoin block</dt><dd>979,776</dd></div>
              <div><dt>Difficulty threshold</dt><dd>137.2T</dd></div>
            </dl>
          </figcaption>
          <p className={styles.chainLabel}>Bitcoin blockchain</p>
          <div className={styles.chainViewport}>
            {/* The illustration is decorative; the complete market terms and outcomes remain HTML text. */}
            <img className={styles.chain} src="/images/v3/hero-block-chain.png" width="2172" height="724" alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
          </div>
          <div className={styles.outcomes}>
            <div><p className={styles.condition}>Below 137.2T</p><p className={styles.result}>No <span>wins</span></p><p className={styles.choice}>Buy No if you expect this.</p></div>
            <div><p className={styles.condition}>At or above 137.2T</p><p className={styles.result}>Yes <span>wins</span></p><p className={styles.choice}>Buy Yes if you expect this.</p></div>
          </div>
        </figure>
        <p className={styles.risk}>Trading involves the risk of loss. A losing position pays zero. You can lose the full amount paid for a position, plus applicable costs.</p>
      </Container>
    </section>
  )
}

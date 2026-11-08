import { Container } from '@/components/layout/Container'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './MarketHero.module.css'

export function MarketHero() {
  return (
    <section aria-labelledby="v3-title" className={styles.hero}>
      <Container className={styles.content}>
        <div className={styles.grid}>
          <div>
            <p className={styles.eyebrow}>For professional investors only</p>
            <h1 id="v3-title" className={styles.title}>Markets on Bitcoin mining difficulty.</h1>
            <p className={styles.lede}>Trade and hedge Bitcoin hashrate exposure.</p>
            <Link href="/product" data-v3-cta="overview" data-v3-placement="hero" className={styles.primary}>
              Explore difficulty markets <Arrow />
            </Link>
          </div>

          <div className={styles.panel}>
            <figure className={styles.reference}>
              <figcaption>
                <p className={styles.eyebrow}>What the market measures</p>
                <p className={styles.measure}>Difficulty at a specified Bitcoin block</p>
              </figcaption>
              <div className={styles.diagram}>
                <div className={styles.blocks} aria-hidden="true">
                  <span /><span />
                  <span className={styles.observed}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="6" />
                      <path d="M12 2v5m0 10v5M2 12h5m10 0h5" />
                    </svg>
                  </span>
                  <span /><span />
                </div>
                <p className={styles.blockLabel}>Block used to settle the market</p>
              </div>
            </figure>

            <div className={styles.path}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3l7 3v5c0 4-2 7-7 10-5-3-7-6-7-10V6l7-3zM9 12l2 2 4-4" />
              </svg>
              <div>
                <p className={styles.eyebrow}>Mining operators</p>
                <h2>Hedge against rising difficulty</h2>
                <p>A position may offset part of a production shortfall.</p>
              </div>
            </div>

            <div className={styles.path}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 9h14m-4-4 4 4-4 4M19 16H5m4-4-4 4 4 4" />
              </svg>
              <div>
                <p className={styles.eyebrow}>Funds and trading desks</p>
                <h2>Trade your view on future difficulty</h2>
                <p>Take a position on whether difficulty will meet the market threshold.</p>
              </div>
            </div>
          </div>
        </div>
        <p className={styles.risk}>
          Trading involves the risk of loss. A losing position pays zero. You can lose the full amount paid for a position, plus applicable costs.
        </p>
      </Container>
    </section>
  )
}

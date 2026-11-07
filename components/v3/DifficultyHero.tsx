import { Container } from '@/components/layout/Container'
import Link from '@/components/routing/SiteLink'
import { ProductionScenario } from './ProductionScenario'
import styles from './DifficultyHero.module.css'

export function DifficultyHero() {
  return (
    <section aria-labelledby="v3-title" className={styles.hero}>
      <Container>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className={styles.eyebrow}>Bitcoin mining difficulty</p>
            <h1 id="v3-title">See how difficulty <span>changes BTC production</span></h1>
            <p className={styles.lede}>At the same hashrate, higher difficulty can reduce expected BTC production.</p>
            <div className={styles.actions}>
              <Link href="/tools/difficulty-exposure" data-v3-cta="calculator" data-v3-placement="hero" className={styles.primary}>Estimate BTC production</Link>
              <Link href="/product" data-v3-cta="overview" data-v3-placement="hero" className={styles.markets}><span>Explore difficulty markets</span></Link>
            </div>
          </div>
          <ProductionScenario />
        </div>
        <p className={styles.risk}>Trading involves the risk of loss. For professional investors only. A losing position pays zero. You can lose the full amount paid for a position, plus applicable costs.</p>
      </Container>
    </section>
  )
}

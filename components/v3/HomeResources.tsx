import { getV3Editorial } from '@/content'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import { HomeResourceExamples } from './HomeResourceExamples'
import styles from './HomeResources.module.css'

/** Interactive examples and links to the mining tools and research. */
export async function HomeResources() {
  const featured = await getV3Editorial('blog', 'reading-a-hashrate-chart-honestly')

  return (
    <div className={styles.wrap}>
      <div className={styles.mast} data-reveal>
        <div>
          <div className={styles.introMeta}>
            <p className={styles.kicker}>Tools and learning</p>
            <span className={styles.illustrative}>Illustrative examples</span>
          </div>
          <h2 id="learning-title" className={styles.title}>Bitcoin mining data and calculators</h2>
          <p className={styles.intro}>Change one input and see what moves.</p>
        </div>
        <Link className={styles.all} href="/resources" data-v3-cta="resources" data-v3-placement="resources">Browse all resources <Arrow className={styles.arrow} /></Link>
      </div>

      <HomeResourceExamples hashrateHref={featured ? '/blog/' + featured.slug : '/blog'} />

      <details className={styles.limits}>
        <summary>Calculators compare assumptions. See what they leave out.</summary>
        <p>They do not forecast difficulty or size a position. Hosting costs and mining production exposure are separate. Your business may have both owned and hosted fleets.</p>
      </details>
      <div className={styles.related}>
        <div>
          <Link href="/research/observed-difficulty-adjustments">Review 25 observed difficulty adjustments <Arrow className={styles.arrow} /></Link>
          <span>Sources and CSV in the report</span>
        </div>
        <Link href="/for/institutions" data-v3-cta="institutions" data-v3-placement="resources">For funds and desks <Arrow className={styles.arrow} /></Link>
      </div>
    </div>
  )
}

import { getV3Editorial } from '@/content'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './HomeResources.module.css'

/** Three illustrated entry points to the mining tools and research. */
export async function HomeResources() {
  const featured = await getV3Editorial('blog', 'reading-a-hashrate-chart-honestly')

  return (
    <div className={styles.wrap}>
      <div className={styles.mast} data-reveal>
        <div>
          <p className={styles.kicker}>Tools and learning</p>
          <h2 id="learning-title" className={styles.title}>Read the data. <span>Test the assumptions.</span></h2>
        </div>
        <div className={styles.mastActions}>
          <span className={styles.illustrative}>Illustrative diagrams</span>
          <Link className={styles.all} href="/resources" data-v3-cta="resources" data-v3-placement="resources">Browse all resources <Arrow className={styles.arrow} /></Link>
        </div>
      </div>

      <div className={styles.field} data-reveal>
        <div className={styles.scenes}>
          <Link className={styles.scene} href={featured ? '/blog/' + featured.slug : '/blog'} data-v3-cta="resources" data-v3-placement="resources" aria-labelledby="home-resource-read-action">
            <div>
              <p className={styles.chapter}><span>01</span> Hashrate</p>
              <h3>Which blocks count?</h3>
            </div>
            <figure>
              <svg className={styles.diagram} viewBox="0 0 320 145" role="img" aria-labelledby="home-resource-window-diagram" aria-describedby="home-resource-window-caption">
                <title id="home-resource-window-diagram">Two windows over the same block arrivals</title>
                <desc id="home-resource-window-caption">Both windows end at the same time. The shorter one uses only the most recent blocks, so a cluster of fast blocks can affect its estimate more.</desc>
                <path className={styles.line} d="M17 39v-9h286v9"/>
                <text x="160" y="20" textAnchor="middle">Long window</text>
                <path className={styles.line} d="M17 67h286"/>
                <path className={styles.baseline} d="M303 26v87"/>
                <g className={styles.ink} opacity=".66">
                  <rect x="19" y="63" width="8" height="8" rx="1"/>
                  <rect x="51" y="63" width="8" height="8" rx="1"/>
                  <rect x="86" y="63" width="8" height="8" rx="1"/>
                  <rect x="125" y="63" width="8" height="8" rx="1"/>
                  <rect x="175" y="63" width="8" height="8" rx="1"/>
                </g>
                <g fill="var(--df-blue)" className={styles.attention}>
                  <rect x="231" y="62" width="10" height="10" rx="1"/>
                  <rect x="248" y="62" width="10" height="10" rx="1"/>
                  <rect x="263" y="62" width="10" height="10" rx="1"/>
                  <rect x="281" y="62" width="10" height="10" rx="1"/>
                </g>
                <path className={styles.accent} d="M223 86v10h80V86"/>
                <text className={styles.key} x="263" y="117" textAnchor="middle">Short window</text>
                <text className={styles.fine} x="17" y="137">Fast blocks move short estimates more.</text>
              </svg>
            </figure>
            <span className={styles.resource}><span id="home-resource-read-action">{featured ? 'Read a hashrate chart' : 'Browse mining articles'}</span><Arrow className={styles.arrow} /></span>
          </Link>

          <Link className={styles.scene} href="/tools/hosting-effective-rate" data-v3-cta="hosting" data-v3-placement="resources" aria-labelledby="home-resource-hosting-action">
            <div>
              <p className={styles.chapter}><span>02</span> Hosting</p>
              <h3>What do idle hours cost?</h3>
            </div>
            <figure>
              <svg className={styles.diagram} viewBox="0 0 320 145" role="img" aria-labelledby="home-resource-hours-diagram" aria-describedby="home-resource-hours-caption">
                <title id="home-resource-hours-diagram">The hosting rate rises when paid hours go unused</title>
                <desc id="home-resource-hours-caption">When lost hours remain payable, divide the billed rate by the operating share to get the effective rate before pool fees.</desc>
                <defs>
                  <pattern id="home-resource-idle-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
                    <path d="M0 0v6" stroke="var(--df-line-strong)" strokeWidth="2"/>
                  </pattern>
                </defs>
                <path className={styles.line} d="M17 39v-9h286v9"/>
                <text x="160" y="20" textAnchor="middle">Paid hours</text>
                <rect x="17" y="54" width="222" height="24" fill="var(--df-blue)" className={styles.attention}/>
                <rect x="239" y="54" width="64" height="24" fill="url(#home-resource-idle-hatch)" stroke="var(--df-line-strong)" strokeWidth="1"/>
                <text className={styles.key} x="17" y="98">Operating</text>
                <text x="303" y="98" textAnchor="end">Paid idle</text>
                <text className={styles.key} x="17" y="123">Billed rate ÷ operating share</text>
                <text className={styles.fine} x="17" y="141">Effective rate before pool fees</text>
              </svg>
            </figure>
            <span className={styles.resource}><span id="home-resource-hosting-action">Compare hosting costs</span><Arrow className={styles.arrow} /></span>
          </Link>

          <Link className={styles.scene} href="/tools/fleet-payback" data-v3-cta="payback" data-v3-placement="resources" aria-labelledby="home-resource-fleet-action">
            <div>
              <p className={styles.chapter}><span>03</span> Fleet payback</p>
              <h3>When is the outlay recovered?</h3>
            </div>
            <figure>
              <svg className={styles.diagram} viewBox="0 0 320 145" role="img" aria-labelledby="home-resource-payback-diagram" aria-describedby="home-resource-payback-caption">
                <title id="home-resource-payback-diagram">Modeled cash flow under two difficulty growth assumptions</title>
                <desc id="home-resource-payback-caption">Both paths start at the same upfront cost. The lower-growth path reaches zero, the payback point. The higher-growth path stays below zero over the period shown.</desc>
                <text x="17" y="20">Cumulative modeled cash flow</text>
                <path className={styles.baseline} d="M17 67h286"/>
                <text className={styles.key} x="17" y="60">$0</text>
                <path className={styles.line} d="M29 121C87 114 148 93 202 94C243 94 276 98 303 103"/>
                <path className={styles.trace} d="M29 121C78 109 110 88 160 67C209 47 263 43 303 41"/>
                <circle className={`${styles.dot} ${styles.attention}`} cx="160" cy="67" r="5" />
                <text className={styles.key} x="170" y="85">Payback</text>
                <text className={styles.fine} x="302" y="35" textAnchor="end">Lower difficulty growth</text>
                <text className={styles.fine} x="302" y="122" textAnchor="end">Higher difficulty growth</text>
                <text className={styles.fine} x="17" y="142">Upfront cost</text>
                <text className={styles.fine} x="303" y="142" textAnchor="end">Months →</text>
              </svg>
            </figure>
            <span className={styles.resource}><span id="home-resource-fleet-action">Compare fleet payback</span><Arrow className={styles.arrow} /></span>
          </Link>
        </div>
      </div>

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

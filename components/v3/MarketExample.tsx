import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './MarketExample.module.css'

/** Hypothetical whole-position amounts, not a quote or a per-token payout. */
export function MarketExample() {
  return <div className={styles.explainer}>
    <div className={styles.intro}>
      <p className={styles.kicker}>Illustrative purchase</p>
      <p>Assume your Yes shares have a combined winning payout of <strong>100 units</strong>: shares held × the stated payout per share. All amounts are in the payment token, before fees.</p>
    </div>
    <div className={styles.story}>
      <div className={styles.purchase}>
        <span className={styles.position}>Example position <strong>Yes</strong></span>
        <p className={styles.cost}><strong>60</strong><span>units paid</span></p>
        <p className={styles.purchaseNote}>Separate from the chart. Held through resolution.</p>
      </div>
      <svg className={styles.branch} viewBox="0 0 140 350" fill="none" aria-hidden="true">
        <path d="M0 175H42Q56 175 56 161V64Q56 50 70 50H138" />
        <path d="M0 175H42Q56 175 56 189V286Q56 300 70 300H138" />
        <circle cx="0" cy="175" r="4" />
      </svg>
      <div className={styles.endings}>
        <p className={styles.observation}>Difficulty at Bitcoin block <strong>979,776</strong> · T = trillion</p>
        <div className={styles.ending}>
          <div className={styles.condition}>
            <span className={styles.outcome}>Yes wins</span>
            <p>At or above <strong>137.2T</strong></p>
          </div>
          <div className={styles.money}>
            <p className={styles.payout}><strong>100</strong><span>Total payout</span></p>
            <p className={styles.result}><strong>+40 profit</strong><span>before fees</span></p>
          </div>
          <div className={styles.breakdown}>
            <span className={styles.costShare}>60 cost</span>
            <span className={styles.gainShare}>40 profit</span>
          </div>
        </div>
        <div className={`${styles.ending} ${styles.losing}`}>
          <div className={styles.condition}>
            <span className={styles.outcome}>Yes loses</span>
            <p>Below <strong>137.2T</strong></p>
          </div>
          <div className={styles.money}>
            <p className={styles.payout}><strong>0</strong><span>Total payout</span></p>
            <p className={styles.result}><strong>60 loss</strong><span>before fees</span></p>
          </div>
          <p className={styles.lossNote}>Your 60-unit cost is not refunded.</p>
        </div>
      </div>
    </div>
    <div className={styles.takeaway}>
      <p><strong>Bought No shares?</strong> They pay below 137.2T; at or above, they pay zero.</p>
    </div>
    <div className={styles.footer}>
      <p>Earlier crossings do not count. Redeem winning shares after the market resolves. Check actual amounts and fees in the app.</p>
      <Link href="/v3/docs/how-settlement-works" className="v37-link">Settlement guide <Arrow /></Link>
    </div>
  </div>
}

import Link from '@/components/routing/SiteLink'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import { TradeWalkthroughMotion } from './TradeWalkthroughMotion'
import styles from './TradeWalkthrough.module.css'

export function TradeWalkthrough() {
  return (
    <TradeWalkthroughMotion
      heading={
        <div>
          <p className={styles.kicker}>How it works</p>
          <h2 id="mechanics-title" className={styles.title}>
            <span id="setup-title" className="scroll-mt-28">A difficulty trade in three steps</span>
          </h2>
        </div>
      }
    >
      <ol className={`${styles.steps} scroll-mt-28`} id="get-started" role="list">
        <li className={styles.step}>
          <div className={styles.index} aria-hidden="true"><span>01</span></div>
          <div className={styles.copy}>
            <h3>Choose a market</h3>
            <p>Check the difficulty threshold and the Bitcoin observation block.</p>
          </div>
          <figure>
            <svg className={styles.diagram} viewBox="0 0 320 90" data-walkthrough-diagram role="img" aria-label="The market rule compares the difficulty at the observation block with the threshold.">
              <text className={styles.key} x="4" y="29" data-beat="input">Difficulty threshold</text>
              <text className={styles.key} x="4" y="66" data-beat="input">Observation block</text>
              <path className={styles.line} data-trace="0" d="M159 24h11q9 0 9 9v12"/>
              <path className={styles.line} data-trace="0" d="M159 61h11q9 0 9-9v-7"/>
              <path className={styles.route} data-trace="1" d="M179 45h28"/>
              <path className={styles.route} data-trace="2" d="M202 40l5 5-5 5"/>
              <text className={styles.key} x="218" y="50" data-beat="result">Market rule</text>
            </svg>
          </figure>
          <details className={styles.details}>
            <summary>How the market decides Yes or No</summary>
            <div className={styles.detailsBody}>
              <p>Yes wins if difficulty at the observation block is at or above the threshold. No wins below it. Buy shares on the side that matches your view. These shares represent your position.</p>
              <p>Prices change as traders buy and sell.</p>
              <nav aria-label="Market and order guides">
                <Link href="/docs/your-first-trade" data-v3-cta="setup" data-v3-placement="setup">Review price, amount and order execution</Link>
              </nav>
            </div>
          </details>
        </li>

        <li className={styles.step}>
          <div className={styles.index} aria-hidden="true"><span>02</span></div>
          <div className={styles.copy}>
            <h3>Fund and trade</h3>
            <p>Use the market’s required collateral token. Review the side, size, price and fees before submitting.</p>
          </div>
          <figure>
            <svg className={styles.diagram} viewBox="0 0 320 90" data-walkthrough-diagram role="img" aria-label="Deposit the required token, then place an order.">
              <path className={styles.route} data-trace="1" d="M30 30h259"/>
              <path className={styles.route} data-trace="2" d="M283 25l6 5-6 5"/>
              <circle className={styles.dot} cx="30" cy="30" data-beat="input" r="5"/>
              <text className={styles.key} x="30" y="59" data-beat="input">Deposit collateral</text>
              <text className={styles.key} x="289" y="59" data-beat="result" textAnchor="end">Place order</text>
            </svg>
          </figure>
          <details className={styles.details}>
            <summary>Funding options and wallet guides</summary>
            <div className={styles.detailsBody}>
              <p>For a cbBTC market, deposit cbBTC directly or convert native BTC through SwapKit where available. cbBTC is a wrapped Bitcoin asset. Check the market’s required token and network before sending funds.</p>
              <p>Choose Yes or No and review the order terms before submitting. An order may fill in part or remain unfilled. Check how much filled in Portfolio.</p>
              <nav aria-label="Funding and wallet guides">
                <Link href="/docs/connecting-a-wallet" data-v3-cta="setup" data-v3-placement="setup">Check sign-in and wallet signatures</Link>
                <Link href="/docs/getting-collateral" data-v3-cta="setup" data-v3-placement="setup">Check token, network, destination and costs</Link>
              </nav>
            </div>
          </details>
        </li>

        <li className={styles.step}>
          <div className={styles.index} aria-hidden="true"><span>03</span></div>
          <div className={styles.copy}>
            <h3>Sell or redeem</h3>
            <p>A sale depends on buyers and price. Losing shares pay nothing.</p>
          </div>
          <figure>
            <svg className={styles.diagram} viewBox="0 0 320 100" data-walkthrough-diagram role="img" aria-label="Place a sell order while trading is open, or hold and redeem winning shares after the market resolves.">
              <text className={styles.key} x="4" y="53" data-beat="input">Your shares</text>
              <path className={styles.line} data-trace="0" d="M102 48h15"/>
              <path className={styles.route} data-trace="1" d="M117 48h8q8 0 8-8V24q0-8 8-8h5"/>
              <path className={styles.route} data-trace="1" d="M117 48h8q8 0 8 8v16q0 8 8 8h5"/>
              <circle className={styles.joint} cx="117" cy="48" r="2.6"/>
              <text className={styles.key} x="156" y="20" data-beat="result">Sell order</text>
              <text x="156" y="39">While trading is open</text>
              <text className={styles.key} x="156" y="72" data-beat="result">Redeem</text>
              <text x="156" y="91">Winners after resolution</text>
            </svg>
          </figure>
          <details className={styles.details}>
            <summary>Payouts, costs and position guide</summary>
            <div className={styles.detailsBody}>
              <p>Place a sell order while trading is open, or hold until the market resolves. Redeem winning shares after resolution.</p>
              <p>Each winning share in a cbBTC market redeems for 1 cbBTC. Check the displayed payout and collateral token for other markets. Your profit or loss depends on what you paid and any fees.</p>
              <nav aria-label="Position management guide">
                <Link href="/docs/managing-positions" data-v3-cta="setup" data-v3-placement="setup">Read about managing positions</Link>
              </nav>
            </div>
          </details>
        </li>
      </ol>

      <div className={styles.footer}>
        <p>Ready to inspect a market?</p>
        <a className={styles.app} href={site.appUrl} data-v3-cta="app" data-v3-placement="setup">Enter app <Arrow diagonal className={styles.appArrow} /></a>
      </div>
    </TradeWalkthroughMotion>
  )
}

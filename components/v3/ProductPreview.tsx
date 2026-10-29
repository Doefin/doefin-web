import Image from 'next/image'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './ProductPreview.module.css'

const capture = '/images/v3/market-detail-2026-10-19.jpg'

/** CSS frames the question and chart at x14/y175/w918/h512 in the original 1440×756 capture. */
export function ProductPreview() {
  return <figure className="mt-7 sm:mt-9">
    <div className="overflow-hidden rounded-panel border border-white/15 bg-surface/40">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-white/10 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold text-body">YES price history</p>
        <span className="text-xs text-subtle"><span className={styles.desktopOnly}>Cropped app screenshot</span><span className={styles.mobileOnly}>App capture summary</span></span>
      </div>
      <div className={`relative aspect-[918/512] overflow-hidden ${styles.desktopOnly}`}>
        <Image src={capture} width={1440} height={756} unoptimized
          alt="Doefin market for Bitcoin difficulty at or above 137.2 T at block 979,776, with an hourly order-book midpoint chart labeled Chance of YES over time."
          className="absolute left-[-1.5251%] top-[-34.1797%] h-auto w-[156.8628%] max-w-none" />
      </div>
      <div className={`${styles.mobileOnly} ${styles.mobileCapture}`}>
        <p className={styles.question}>Will Bitcoin difficulty be at or above <strong>137.2 T</strong> at block <strong>979,776</strong>?</p>
        <div className={styles.snapshot}>
          <p>Market-implied chance of YES<span>In this capture</span></p>
          <strong>68<span>%</span></strong>
        </div>
        <p className={styles.chartLabel}>October detail</p>
        <div className={styles.chart}>
          <div className={styles.yAxis} aria-hidden="true"><span>100%</span><span>50%</span><span>0%</span></div>
          <div>
            {/* Original pixels: x624/y438/w288/h204. No chart values are generated. */}
            <div className={styles.plot}>
              <Image src={capture} width={1440} height={756} unoptimized
                alt="October detail of the captured hourly YES order-book midpoint chart. The vertical scale runs from 0 to 100 percent."
                className={styles.plotImage} />
            </div>
            <div className={styles.xAxis} aria-hidden="true"><span>6 Oct</span><span>11 Oct</span><span>16 Oct</span></div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 sm:px-6">
        <div className={styles.desktopOnly}>
          <p className="text-sm font-semibold text-body">What the chart shows</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-subtle">The chart shows hourly order-book midpoints as an implied chance of YES. This is market pricing, not a Doefin forecast, trade quote or Bitcoin difficulty.</p>
        </div>
        <p className={`${styles.mobileOnly} text-sm leading-relaxed text-subtle`}>Market pricing, not a Doefin forecast or trade quote. The line shows hourly order-book midpoints—not Bitcoin difficulty.</p>
        <Link href="/docs/prices-and-probability" className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-highlight hover:underline">Understand market prices and probability <Arrow /></Link>
      </div>
    </div>
    <figcaption className="mt-4 flex flex-wrap items-start justify-between gap-x-6 gap-y-2 text-xs leading-relaxed text-subtle">
      <div className="max-w-2xl">
        <p>Captured <time dateTime="2026-10-19">19 October 2026</time>. Not live.</p>
      </div>
      <a href={capture} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-highlight hover:underline underline-offset-4">View full screenshot <Arrow diagonal className="!h-4 !w-4" /><span className="sr-only"> (opens in a new tab)</span></a>
    </figcaption>
  </figure>
}

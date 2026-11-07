'use client'

import { useEffect, useId, useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './MarketExample.module.css'

// Use tenths of a trillion so the illustrative equality case compares exactly.
const threshold = 1372
const readings = [1371, threshold, 1373]
const formatDifficulty = (value: number) => `${(value / 10).toFixed(1)}T`

export function MarketExample() {
  const id = useId()
  const [ready, setReady] = useState(false)
  const [reading, setReading] = useState<number | null>(null)
  const relation = reading === null ? undefined : reading < threshold ? 'below' : reading > threshold ? 'above' : 'equal'
  const winner = relation === undefined ? undefined : relation === 'below' ? 'no' : 'yes'
  const thresholdLabel = formatDifficulty(threshold)
  const explanation = relation === 'equal' ? 'equals' : `is ${relation}`

  useEffect(() => {
    setReady(true)
  }, [])

  return (
    <section className={styles.example} aria-labelledby={`${id}-title`}>
      <div>
        <p className={styles.eyebrow}>Settlement</p>
        <h3 id={`${id}-title`} className={styles.title}>One block decides the winner</h3>
        <p className={styles.intro}>Compare Bitcoin mining difficulty at the specified block with the market’s threshold.</p>
      </div>

      <figure className={styles.rule} aria-labelledby={`${id}-block`}>
        <figcaption className={styles.observation}>
          <span id={`${id}-block`}>At Bitcoin block <strong>979,776</strong></span>
          <span className={styles.tag}>Illustrative market</span>
        </figcaption>
        <div className={styles.comparison} data-relation={relation} data-winner={winner}>
          <div className={styles.threshold}>
            <span className={styles.label}>Difficulty threshold</span>
            <strong>{thresholdLabel}</strong>
            <p>T = trillion</p>
          </div>
          <div className={styles.scale} aria-hidden="true">
            <span className={styles.tick} />
            <span className={styles.marker} />
          </div>
          <div className={styles.outcomes}>
            <div className={styles.outcome} data-side="no">
              <p className={styles.condition}>Below {thresholdLabel}</p>
              <h4>“No” wins</h4>
            </div>
            <div className={styles.outcome} data-side="yes">
              <p className={styles.condition}>At or above {thresholdLabel}</p>
              <h4>“Yes” wins</h4>
            </div>
          </div>
        </div>
      </figure>

      <div className={styles.tryReading} hidden={!ready}>
        <fieldset className={styles.readings}>
          <legend>Try a difficulty reading</legend>
          <div className={styles.choices}>
            {readings.map(value => (
              <div key={value} className={styles.choice}>
                <input
                  className="sr-only"
                  id={`${id}-reading-${value}`}
                  name={`${id}-reading`}
                  type="radio"
                  value={value}
                  checked={reading === value}
                  onChange={() => setReading(value)}
                />
                <label htmlFor={`${id}-reading-${value}`}>{formatDifficulty(value)}</label>
              </div>
            ))}
          </div>
        </fieldset>
        <p className={styles.result} role="status" aria-atomic="true">
          {reading === null
            ? 'Pick a sample reading to see which side wins.'
            : `${formatDifficulty(reading)} ${explanation} the threshold. The ${winner === 'yes' ? 'Yes' : 'No'} side wins.`}
        </p>
      </div>

      <details className={styles.workedExample}>
        <summary>See what a 60-unit Yes position pays</summary>
        <div className={styles.exampleBody}>
          <p>A trader pays 60 units for Yes shares and holds them through resolution. The amounts below are illustrative, in the same collateral token and before fees.</p>
          <ul>
            <li><strong>Yes wins:</strong> 100 units paid out. Subtract the 60-unit cost for a profit of 40 units.</li>
            <li><strong>Yes loses:</strong> 0 units paid out. The loss is the full 60-unit cost.</li>
          </ul>
          <p>The winning payout is the number of shares held times the payout per share. Redeem winning shares after the market resolves. Check actual amounts and fees in the app.</p>
        </div>
      </details>
      <div className={styles.footer}>
        <p>Only the reading at the specified block counts. Earlier crossings do not count.</p>
        <Link href="/docs/how-settlement-works">Settlement guide <Arrow className={styles.arrow} /></Link>
      </div>
    </section>
  )
}

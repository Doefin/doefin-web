'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { site } from '@/lib/site'
import { Arrow } from './Arrow'
import styles from './TradeWalkthrough.module.css'

const steps = ['Market', 'Order', 'Outcome']
const observationBlock = '979,776'
// Compare tenths of a trillion as integers so the equality case is exact.
const threshold = 1372
const readings = [1371, threshold, 1373]
const cost = 60
const winningPayout = 100
const difficulty = (reading: number) => `${(reading / 10).toFixed(1)}T`
const signedUnits = (amount: number) => `${amount < 0 ? '−' : '+'}${Math.abs(amount)} units`

export function TradeWalkthrough() {
  const [ready, setReady] = useState(false)
  const [selectedStep, setStep] = useState<number | null>(null)
  const step = selectedStep ?? 0
  const [reading, setReading] = useState(threshold)
  const [exit, setExit] = useState<'sell' | 'hold'>('hold')
  const stages = useRef<HTMLDivElement>(null)
  const moveFocus = useRef(false)

  useEffect(() => setReady(true), [])

  useEffect(() => {
    if (!moveFocus.current) return
    moveFocus.current = false
    const heading = stages.current?.querySelector<HTMLElement>('[data-current="true"] h3')
    if (!heading) return
    heading.focus({ preventScroll: true })
    const bounds = heading.getBoundingClientRect()
    if (bounds.top < 90 || bounds.bottom > window.innerHeight) {
      heading.scrollIntoView({ block: 'start' })
    }
  }, [step])

  function goTo(next: number) {
    if (step === next) return
    moveFocus.current = true
    setStep(next)
  }

  const yesWins = reading >= threshold
  const payout = yesWins ? winningPayout : 0
  const net = payout - cost

  return (
    <div className={styles.journey}>
      <div className={styles.mast}>
        <div className={styles.mastMeta}>
          <p className={styles.kicker}>How it works</p>
          <span className={styles.badge}>Illustrative trade</span>
        </div>
        <h2 id="mechanics-title" className={styles.title}>
          <span id="setup-title" className="scroll-mt-28">A difficulty trade in three steps</span>
        </h2>
        <p className={styles.intro}>Follow one Yes position. See what changes as you choose the market, place the order and decide how to exit.</p>
      </div>

      <dl className={styles.ticket} aria-label="Illustrative market">
        <div><dt>Difficulty threshold</dt><dd>{difficulty(threshold)}</dd></div>
        <div><dt>Bitcoin block</dt><dd>{observationBlock}</dd></div>
        <div><dt>Side in this example</dt><dd>Yes shares</dd></div>
      </dl>

      <div id="get-started" className={`${styles.guide} scroll-mt-28`}>
        <nav className={styles.progress} aria-label="Walkthrough steps" hidden={!ready}>
          {steps.map((label, index) => (
            <button type="button" key={label} aria-current={step === index ? 'step' : undefined}
              aria-controls={`trade-walkthrough-step-${index + 1}`} onClick={() => goTo(index)}>
              <b aria-hidden="true">0{index + 1}</b> {label}
            </button>
          ))}
        </nav>

        <div ref={stages}>
          <Stage index={0} step={step} ready={ready} animate={selectedStep !== null} title="Choose the market"
            description={`This market asks if Bitcoin difficulty will be at least ${difficulty(threshold)} at block ${observationBlock}. Only that block’s reading decides the winner.`}
            visual={
              <>
                <p className={styles.label}>Read difficulty at block {observationBlock}</p>
                <div className={styles.rule}>
                  <div><strong>No wins</strong><span>Below {difficulty(threshold)}</span></div>
                  <div><strong>Yes wins</strong><span>{difficulty(threshold)} or higher</span></div>
                </div>
              </>
            }
            details={
              <GuideDetails title="Market and order guide">
                <p>Buy shares on the side that matches your view. These shares represent your position. Prices change as traders buy and sell.</p>
                <Link href="/docs/your-first-trade" data-v3-cta="setup" data-v3-placement="setup">Review price, amount and order execution</Link>
              </GuideDetails>
            }>
            <button type="button" className={styles.primary} onClick={() => goTo(1)}>Review the order</button>
          </Stage>

          <Stage index={1} step={step} ready={ready} animate={selectedStep !== null} title="Fund and place the order"
            description={`Deposit the market’s required collateral. The trader picks Yes, reviews the ${cost}-unit cost and fees, and submits. Assume the order fills in full.`}
            visual={
              <dl className={styles.receipt}>
                <div><dt>Side</dt><dd>Yes</dd></div>
                <div><dt>Position cost before fees</dt><dd>{cost} units</dd></div>
                <div><dt>After the order fills</dt><dd>Hold Yes shares</dd></div>
              </dl>
            }
            details={
              <GuideDetails title="Funding options and wallet guides">
                <p>For a cbBTC market, deposit cbBTC directly or convert native BTC through SwapKit where available. cbBTC is a wrapped Bitcoin asset. Check the market’s required token and network before sending funds.</p>
                <p>Choose Yes or No and review the order terms before submitting. An order may fill in part or remain unfilled. Check how much filled in Portfolio.</p>
                <Link href="/docs/connecting-a-wallet" data-v3-cta="setup" data-v3-placement="setup">Check sign-in and wallet signatures</Link>
                <Link href="/docs/getting-collateral" data-v3-cta="setup" data-v3-placement="setup">Check token, network, destination and costs</Link>
              </GuideDetails>
            }>
            <button type="button" onClick={() => goTo(0)}>Back</button>
            <button type="button" className={styles.primary} onClick={() => goTo(2)}>Continue with filled order</button>
          </Stage>

          <Stage index={2} step={step} ready={ready} animate={selectedStep !== null} title="Sell or hold"
            description="The trader now holds those Yes shares. They can place a sell order while trading is open or hold the shares until the market resolves. A sale depends on available buyers and price."
            visual={
              <>
                <p className={styles.position}>Filled position · Yes shares · {cost} units paid</p>
                <fieldset className={styles.control} hidden={!ready}>
                  <legend>What happens to the filled Yes shares?</legend>
                  <div className={styles.options}>
                    <label><input type="radio" name="walkthrough-exit" checked={exit === 'sell'} onChange={() => setExit('sell')} /><span>Place a sell order</span></label>
                    <label><input type="radio" name="walkthrough-exit" checked={exit === 'hold'} onChange={() => setExit('hold')} /><span>Hold to resolution</span></label>
                  </div>
                </fieldset>
                <fieldset className={styles.control} hidden={!ready || exit !== 'hold'}>
                  <legend>Difficulty at Bitcoin block {observationBlock}</legend>
                  <div className={styles.options}>
                    {readings.map(value => (
                      <label key={value}>
                        <input type="radio" name="walkthrough-reading" checked={reading === value} onChange={() => setReading(value)} />
                        <span>{difficulty(value)}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
                <div className={styles.result} role="status" aria-atomic="true">
                  {exit === 'hold' ? (
                    <>
                      <p className={styles.label}>{yesWins ? 'Yes wins' : 'No wins'} · Payout on Yes shares</p>
                      <strong>{payout} units</strong>
                      <p data-net data-direction={net > 0 ? 'gain' : 'loss'}>{signedUnits(net)} after cost, before fees</p>
                      <p>{difficulty(reading)} {yesWins ? 'meets' : 'is below'} the threshold. {yesWins ? `The payout includes the ${cost}-unit cost.` : `The ${cost}-unit cost is lost in full.`}</p>
                    </>
                  ) : (
                    <>
                      <p className={styles.label}>Before trading closes</p>
                      <strong>Sell order submitted</strong>
                      <p>A buyer must fill the order. Any unfilled shares stay in the position. Sale proceeds depend on the fill price and fees.</p>
                    </>
                  )}
                </div>
                <div hidden={exit !== 'hold'}>
                  <p className={styles.outcomeNote}>If held until resolution · Before fees</p>
                  <div className={styles.outcomes}>
                    <div data-active={yesWins}><span>Yes wins</span><strong>{winningPayout} units paid</strong><span>{signedUnits(winningPayout - cost)} after cost</span></div>
                    <div data-active={!yesWins}><span>Yes loses</span><strong>0 units paid</strong><span>{signedUnits(-cost)} after cost</span></div>
                  </div>
                  <p className={styles.outcomeNote}>After the market resolves, redeem winning shares.</p>
                </div>
              </>
            }
            details={
              <GuideDetails title="Payouts, costs and position guide">
                <p>Each winning share in a cbBTC market redeems for 1 cbBTC. Check the displayed payout and collateral token for other markets. Your profit or loss depends on what you paid and any fees.</p>
                <Link href="/docs/managing-positions" data-v3-cta="setup" data-v3-placement="setup">Read about managing positions</Link>
              </GuideDetails>
            }>
            <button type="button" onClick={() => goTo(1)}>Back</button>
          </Stage>
        </div>
      </div>

      <div className={styles.footer}>
        <p>All amounts are illustrative, in units of the same collateral token and before fees. T means trillion. An order may fill in part or remain unfilled. You can lose the full position cost.</p>
        <nav aria-label="Trade walkthrough resources">
          <Link href="/docs/how-settlement-works">Settlement guide <Arrow className={styles.arrow} /></Link>
          <a className={styles.app} href={site.appUrl} data-v3-cta="app" data-v3-placement="setup">Enter app <Arrow diagonal className={styles.arrow} /></a>
        </nav>
      </div>
    </div>
  )
}

function Stage({ index, step, ready, animate, title, description, visual, details, children }: {
  index: number; step: number; ready: boolean; animate: boolean; title: string; description: string
  visual: ReactNode; details: ReactNode; children: ReactNode
}) {
  const current = index === step
  return (
    <article id={`trade-walkthrough-step-${index + 1}`} className={styles.stage}
      data-current={current} data-enter={ready && current && animate ? '' : undefined} hidden={ready && !current}>
      <div className={styles.stageGrid}>
        <div className={styles.copy}>
          <p className={styles.label}>Step {index + 1} of {steps.length}</p>
          <h3 className="scroll-mt-28" tabIndex={-1}>{title}</h3>
          <p>{description}</p>
        </div>
        <div className={styles.visual}>{visual}</div>
      </div>
      <div className={styles.stageFoot} hidden={!ready}>{children}</div>
      {details}
    </article>
  )
}

function GuideDetails({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className={styles.details}>
      <summary>{title}</summary>
      <div className={styles.detailsBody}>{children}</div>
    </details>
  )
}

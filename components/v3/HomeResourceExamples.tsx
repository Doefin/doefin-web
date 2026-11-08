'use client'

import { useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { fleetPaybackAssumptions, fleetPaybackDefaults, simulateFleetPayback } from '@/lib/fleet-payback'
import { Arrow } from './Arrow'
import styles from './HomeResources.module.css'

const topics = ['Hashrate', 'Hosting', 'Fleet payback']
const easing = 'cubic-bezier(.2,.7,.3,1)'
const growthRates = [0, 1.5, 3]
const blockArrivals = [-56, -46, -22, -13, -8, -2]
const billedRate = 0.08
const defaultIdle = 20
const subscribeToHydration = () => () => {}
const clientSnapshot = () => true
const serverSnapshot = () => false

function useInteractive() {
  return useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot)
}

function hostingHref(idle: number) {
  return `/tools/hosting-effective-rate?rate=${billedRate}&mgmt=0&pf=0&down=${idle}&curt=0&pool=0`
}

function allowsMotion() {
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function HomeResourceExamples({ hashrateHref }: { hashrateHref: string }) {
  const interactive = useInteractive()
  const [selected, setSelected] = useState(0)
  const [idle, setIdle] = useState(defaultIdle)
  const stage = useRef<HTMLDivElement>(null)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const resize = useRef<Animation | null>(null)
  const previousHeight = useRef(0)

  function selectTopic(index: number) {
    if (index === selected) return
    previousHeight.current = stage.current?.getBoundingClientRect().height ?? 0
    resize.current?.cancel()
    setSelected(index)
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    switch (event.key) {
      case 'ArrowLeft': next = (index + topics.length - 1) % topics.length; break
      case 'ArrowRight': next = (index + 1) % topics.length; break
      case 'Home': next = 0; break
      case 'End': next = topics.length - 1; break
      default: return
    }
    event.preventDefault()
    selectTopic(next)
    tabs.current[next]?.focus()
  }

  useLayoutEffect(() => {
    const currentStage = stage.current
    const startHeight = previousHeight.current
    previousHeight.current = 0
    if (!currentStage || !startHeight || !allowsMotion()) return

    const endHeight = currentStage.getBoundingClientRect().height
    if (startHeight !== endHeight) {
      resize.current = currentStage.animate([
        { height: startHeight + 'px', overflow: 'clip' },
        { height: endHeight + 'px', overflow: 'clip' },
      ], { duration: 260, easing })
    }
    const panel = currentStage.querySelector('[role="tabpanel"]:not([hidden])')
    panel?.getAnimations().forEach(animation => animation.cancel())
    panel?.animate([
      { opacity: .65, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 210, easing })
  }, [selected])

  return (
    <div className={styles.examples}>
      <div className={styles.tabs} role="tablist" aria-label="Choose a mining example">
        {topics.map((topic, index) => (
          <button key={topic} type="button" disabled={!interactive} ref={element => { tabs.current[index] = element }}
            id={`resource-topic-${index}`} role="tab" aria-controls={`resource-example-${index}`}
            aria-selected={index === selected} tabIndex={index === selected ? 0 : -1}
            onClick={() => selectTopic(index)} onKeyDown={event => handleTabKey(event, index)}>
            {topic}
          </button>
        ))}
      </div>
      <div ref={stage}>
        <ExamplePanel index={0} selected={selected} title="See why hashrate estimates differ"
          href={hashrateHref} action={hashrateHref === '/blog' ? 'Browse mining articles' : 'Read a hashrate chart'} cta="resources">
          <HashrateExample />
        </ExamplePanel>
        <ExamplePanel index={1} selected={selected} title="See what paid idle time costs"
          href={hostingHref(idle)}
          action="Compare hosting costs" cta="hosting">
          <HostingExample idle={idle} onSelect={setIdle} />
        </ExamplePanel>
        <ExamplePanel index={2} selected={selected} title="See how difficulty changes fleet payback"
          href="/tools/fleet-payback" action="Compare fleet payback" cta="payback">
          <FleetExample />
        </ExamplePanel>
      </div>
      <noscript>
        <div className={styles.fallback}>
          <Link href={hostingHref(defaultIdle)}>Compare hosting costs</Link>
          <Link href="/tools/fleet-payback">Compare fleet payback</Link>
        </div>
      </noscript>
    </div>
  )
}

function ExamplePanel({ index, selected, title, href, action, cta, children }: {
  index: number; selected: number; title: string; href: string; action: string; cta: string; children: ReactNode
}) {
  return (
    <article className={styles.panel} id={`resource-example-${index}`} role="tabpanel"
      aria-labelledby={`resource-topic-${index}`} hidden={index !== selected}>
      <h3>{title}</h3>
      <div className={styles.experiment}>{children}</div>
      <Link className={styles.resource} href={href} data-v3-cta={cta} data-v3-placement="resources">
        {action} <Arrow className={styles.arrow} />
      </Link>
    </article>
  )
}

function Choices({ name, label, values, unit, selected, onSelect }: {
  name: string; label: string; values: number[]; unit: string; selected: number; onSelect: (value: number) => void
}) {
  const interactive = useInteractive()
  return (
    <fieldset className={styles.choices} disabled={!interactive}>
      <legend>{label}</legend>
      <div className={styles.pills}>
        {values.map(value => (
          <label key={value}>
            <input type="radio" name={name} value={value} checked={value === selected} onChange={() => onSelect(value)} />
            <span>{value}{unit}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function Result({ label, value, detail }: { label: string; value: string; detail: string }) {
  const figure = useRef<HTMLParagraphElement>(null)
  const previous = useRef(value)
  useLayoutEffect(() => {
    if (previous.current === value) return
    previous.current = value
    if (!allowsMotion()) return
    figure.current?.getAnimations().forEach(animation => animation.cancel())
    figure.current?.animate([{ opacity: .7 }, { opacity: 1 }], { duration: 180, easing })
  }, [value])

  return (
    <div className={styles.result} role="status" aria-atomic="true">
      <p className={styles.resultLabel}>{label}</p>
      <p ref={figure} className={styles.resultValue}>{value}</p>
      <p className={styles.resultDetail}>{detail}</p>
    </div>
  )
}

function HashrateExample() {
  const [minutes, setMinutes] = useState(15)
  const observed = blockArrivals.filter(time => time >= -minutes).length
  const pace = observed * 60 / minutes
  return (
    <>
      <div>
        <Choices name="resource-window" label="How far back to count blocks" values={[15, 30, 60]} unit=" min" selected={minutes} onSelect={setMinutes} />
        <Result label="Equivalent block pace" value={`${pace} blocks/hour`} detail={`${observed} blocks arrived in ${minutes} minutes.`} />
      </div>
      <figure className={styles.plot}>
        <p className={styles.graphHeading}>Block arrivals in the same hour</p>
        <div className={styles.timeline} aria-hidden="true">
          <span className={styles.window} style={{ width: `${minutes / 60 * 100}%` }} />
          <span className={styles.track} />
          {blockArrivals.map(time => (
            <span key={time} className={styles.block} data-in-window={time >= -minutes}
              style={{ left: `${(60 + time) / 60 * 100}%` }} />
          ))}
          <div className={styles.axisLabels}><span>60 min ago</span><span>Now</span></div>
        </div>
        <figcaption>The full hour had {blockArrivals.length} blocks. At the same difficulty, a faster block pace implies a higher hashrate estimate.</figcaption>
      </figure>
    </>
  )
}

function HostingExample({ idle, onSelect }: { idle: number; onSelect: (value: number) => void }) {
  const operating = 100 - idle
  const cost = (billedRate / (operating / 100)).toFixed(3)
  return (
    <>
      <div>
        <Choices name="resource-idle" label="Paid time spent idle" values={[0, 10, 20, 30]} unit="%" selected={idle} onSelect={onSelect} />
        <Result label="Cost per operating kWh" value={`$${cost}`} detail={`${operating}% of paid hours are used.`} />
      </div>
      <figure className={styles.plot}>
        <p className={styles.graphHeading}>All contracted hours are paid</p>
        <div className={styles.energy} aria-hidden="true"><span style={{ width: `${operating}%` }} /></div>
        <div className={styles.axisLabels}><span>{operating}% operating</span><span>{idle}% paid idle</span></div>
        <figcaption>The billed rate is ${billedRate}/kWh. The same bill is spread over fewer operating hours when machines sit idle. Fees are excluded.</figcaption>
      </figure>
    </>
  )
}

const { capex, months, th, jPerTh, power, price, diffT } = fleetPaybackDefaults
const { blockSubsidyBtc, blocksPerDay, daysPerMonth } = fleetPaybackAssumptions
const integer = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 })
const usd = (value: number) => `${value < 0 ? '−' : ''}$${integer.format(Math.abs(value))}`
const fleetRuns = growthRates.map(growth => simulateFleetPayback(fleetPaybackDefaults, growth))
const fleetValues = fleetRuns.flatMap(run => run.series.map(point => point.cum))
const minCash = Math.min(-capex, ...fleetValues, 0)
const maxCash = Math.max(...fleetValues, 0)
const chartX = (month: number) => 46 + 420 * month / months
const chartY = (cash: number) => 20 + 130 * (maxCash - cash) / (maxCash - minCash)
const breakEvenY = chartY(0)
const fleetLines = fleetRuns.map(run => [
  { m: 0, cum: -capex }, ...run.series,
].map(point => `${chartX(point.m).toFixed(2)},${chartY(point.cum).toFixed(2)}`).join(' '))

function FleetExample() {
  const [scenario, setScenario] = useState(1)
  const payback = fleetRuns[scenario].paybackMonth
  const baseline = fleetRuns[0].paybackMonth
  const growth = growthRates[scenario]
  const detail = payback === null ? `Upfront cost stays unrecovered through month ${months}.`
    : scenario === 0 ? 'Difficulty stays flat in this scenario.'
    : baseline === null ? 'Compare this result with flat difficulty.' : `${payback - baseline} months later than with flat difficulty.`

  return (
    <>
      <div>
        <Choices name="resource-growth" label="Monthly difficulty growth" values={growthRates} unit="%" selected={growth}
          onSelect={value => setScenario(growthRates.indexOf(value))} />
        <Result label="Estimated payback" value={payback === null ? `No payback in ${months} months` : `Month ${payback}`} detail={detail} />
      </div>
      <div className={styles.plot}>
        <figure>
          <p className={styles.graphHeading}>Cumulative cash flow after upfront cost</p>
          <FleetChart scenario={scenario} />
          <div className={styles.legend}>
            {scenario !== 0 && <span><i />{growth}% growth per month</span>}
            <span><i className={styles.dashed} />Flat difficulty</span>
          </div>
          <figcaption>
            Cash flow starts at {usd(-capex)}. After {months} months, it is {usd(fleetRuns[0].final)} with flat difficulty
            {scenario !== 0 && ` and ${usd(fleetRuns[scenario].final)} at ${growth}% monthly difficulty growth`}.
            {baseline !== null && ` Flat difficulty reaches payback in month ${baseline}.`}
          </figcaption>
        </figure>
        <details className={styles.model}>
          <summary>See the fleet model inputs</summary>
          <p>Illustrative calculator inputs. {usd(capex)} upfront, {integer.format(th)} TH/s, {jPerTh} J/TH, ${power}/kWh power, {usd(price)}/BTC and {diffT}T starting difficulty. The model assumes {blocksPerDay} blocks per day, {blockSubsidyBtc} BTC per block and {daysPerMonth} days per month. It counts the block subsidy and power cost. Other costs and transaction fees are excluded.</p>
        </details>
      </div>
    </>
  )
}

function FleetChart({ scenario }: { scenario: number }) {
  const comparison = useRef<SVGPolylineElement>(null)
  useLayoutEffect(() => {
    const line = comparison.current
    const points = fleetLines[scenario]
    if (!line || (line.getAttribute('points') === points && !line.querySelector('animate'))) return

    const shown = Array.from(line.animatedPoints, point => `${point.x},${point.y}`).join(' ')
    line.querySelector('animate')?.remove()
    line.setAttribute('points', points)
    if (!allowsMotion()) return

    const motion = document.createElementNS('http://www.w3.org/2000/svg', 'animate')
    motion.setAttribute('attributeName', 'points')
    motion.setAttribute('from', shown)
    motion.setAttribute('to', points)
    motion.setAttribute('dur', '260ms')
    motion.setAttribute('begin', 'indefinite')
    motion.setAttribute('calcMode', 'spline')
    motion.setAttribute('keySplines', '.2 .7 .3 1')
    motion.addEventListener('endEvent', () => motion.remove(), { once: true })
    line.append(motion)
    motion.beginElement()
  }, [scenario])

  const baseline = fleetRuns[0].paybackMonth
  const payback = fleetRuns[scenario].paybackMonth
  return (
    <svg className={styles.chart} viewBox="0 0 486 186" aria-hidden="true">
      <line x1={chartX(0)} x2={chartX(months)} y1={breakEvenY} y2={breakEvenY} className={styles.zero} />
      <text x="36" y={breakEvenY + 5} textAnchor="end">$0</text>
      <text x={chartX(0)} y="176">Start</text>
      <text x={chartX(months)} y="176" textAnchor="end">{months} months</text>
      <polyline className={styles.baseline} points={fleetLines[0]} />
      <polyline ref={comparison} className={styles.comparison} points={fleetLines[1]} data-visible={scenario !== 0} />
      {baseline !== null && (
        <g className={styles.baselineMarker}>
          <circle cx={chartX(baseline)} cy={breakEvenY} r="4" />
          <text x={chartX(baseline) - 9} y={breakEvenY - 10} textAnchor="end">{baseline} mo</text>
        </g>
      )}
      {scenario !== 0 && payback !== null && (
        <g className={styles.paybackMarker}>
          <circle cx={chartX(payback)} cy={breakEvenY} r="5" />
          <text x={chartX(payback) + 9} y={breakEvenY + 20}>{payback} mo</text>
        </g>
      )}
    </svg>
  )
}

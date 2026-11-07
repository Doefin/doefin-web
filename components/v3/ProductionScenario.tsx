'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './DifficultyHero.module.css'

const budget = 25
const difficultyIncrease = 0.25
const finalProduction = budget / (1 + difficultyIncrease)
const finalShortfall = budget - finalProduction
const finalPercent = difficultyIncrease * 100

type Endpoint = 0 | 1
type Frame = { progress: number; target: Endpoint; moving: boolean; settled: Endpoint | null }
const baseline: Frame = { progress: 0, target: 0, moving: false, settled: null }

function easeBetween(value: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)))
  return t * t * (3 - 2 * t)
}

export function ProductionScenario() {
  const [ready, setReady] = useState(false)
  const [frame, setFrame] = useState(baseline)
  const current = useRef(baseline)
  const raf = useRef(0)
  const reducedMotion = useRef<MediaQueryList | null>(null)

  function show(next: Frame) {
    current.current = next
    setFrame(next)
  }

  function settle(target: Endpoint) {
    raf.current = 0
    show({ progress: target, target, moving: false, settled: target })
  }

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    reducedMotion.current = preference
    function onPreferenceChange(event: MediaQueryListEvent) {
      if (!event.matches || !raf.current) return
      cancelAnimationFrame(raf.current)
      settle(current.current.target)
    }
    preference.addEventListener('change', onPreferenceChange)
    setReady(true)
    return () => {
      preference.removeEventListener('change', onPreferenceChange)
      cancelAnimationFrame(raf.current)
      raf.current = 0
    }
  }, [])

  function toggleExample() {
    cancelAnimationFrame(raf.current)
    const { progress: from, target: previousTarget } = current.current
    const target = previousTarget ? 0 : 1
    const duration = (target ? 1120 : 860) * Math.abs(target - from)
    if (reducedMotion.current?.matches || !duration) {
      settle(target)
      return
    }

    show({ progress: from, target, moving: true, settled: null })
    const started = performance.now()
    function tick(now: number) {
      const elapsed = Math.max(0, now - started)
      if (elapsed >= duration) {
        settle(target)
        return
      }
      show({ progress: from + (target - from) * elapsed / duration, target, moving: true, settled: null })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  // Cue the cut, recalculate expected production, then reveal the gap.
  const { progress, moving, target, settled } = frame
  const increase = difficultyIncrease * easeBetween(progress, 0.14, 0.82)
  const outputShare = 1 / (1 + increase)
  const expected = Math.round(budget * outputShare)
  const percent = Math.round(increase * 100)
  const reveal = easeBetween(progress, 0.51, 0.94)
  const edgeLight = easeBetween(progress, 0, 0.19) * (1 - easeBetween(progress, 0.7, 0.96))
  const art = {
    '--output': `${outputShare * 100}%`,
    '--reveal': reveal,
    '--edge-light': edgeLight,
    '--label-offset': `${-3 * edgeLight}px`,
  } as CSSProperties

  return (
    <div className={styles.scenario} style={art} data-moving={moving || undefined} data-shortfall={reveal > 0 || undefined}>
      <div className={styles.scenarioHeading}>
        <h2 id="production-example-title">Production scenario</h2>
        <span className={styles.tag}>Illustrative</span>
      </div>
      <figure aria-labelledby="production-example-title">
        <div className={styles.plotLabels}>
          <span className={styles.budget}>{budget} BTC budget</span>
          <span className={styles.difficulty}>{percent ? `Difficulty +${percent}% throughout` : 'Difficulty unchanged'}</span>
        </div>
        <div className={styles.plot} aria-hidden="true">
          <span className={styles.outline} />
          <span className={styles.productionFill} />
          <span className={styles.cutEdge} />
          <span className={styles.bracket} />
        </div>
        <div className={styles.metrics}>
          <div className={styles.expected}>
            <p className={styles.metricValue}>{expected} <span className={styles.unit}>BTC</span></p>
            <p className={styles.metricLabel}>Expected production</p>
          </div>
          <div className={styles.shortfall}>
            <p className={styles.shortfallValue}>{budget - expected} BTC</p>
            <p className={styles.metricLabel}>Expected shortfall</p>
          </div>
        </div>
        <figcaption className={styles.assumptions}>
          Same period, miner hashrate and reward per block.
          <span className="sr-only"> At unchanged difficulty, expected production is {budget} BTC. With difficulty {finalPercent}% higher throughout the period, expected production is {finalProduction} BTC, a shortfall of {finalShortfall} BTC.</span>
        </figcaption>
      </figure>
      <div className={styles.controls}>
        {ready ? (
          <button type="button" className={styles.play} onClick={toggleExample}>{target ? 'Reset example' : 'Play example'}</button>
        ) : (
          <p className={styles.staticResult}>With difficulty {finalPercent}% higher throughout the period: {finalProduction} BTC expected, {finalShortfall} BTC short.</p>
        )}
      </div>
      <p className="sr-only" role="status" aria-atomic="true">
        {settled === 1
          ? `Expected production is ${finalProduction} BTC, a shortfall of ${finalShortfall} BTC, with difficulty ${finalPercent}% higher throughout the period.`
          : settled === 0 ? `Example reset. Expected production is ${budget} BTC at unchanged difficulty.` : null}
      </p>
    </div>
  )
}

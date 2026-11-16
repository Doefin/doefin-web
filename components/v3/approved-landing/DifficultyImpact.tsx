'use client'

import { ArrowRight, ArrowsClockwise, Calculator, CaretDown, ClockCounterClockwise, Pulse, SlidersHorizontal, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
  calculateDifficultyImpact,
  DIFFICULTY_IMPACT_HASHRATE_PH,
  DIFFICULTY_IMPACT_MAX_CHANGE,
  DIFFICULTY_IMPACT_MIN_CHANGE,
  DIFFICULTY_IMPACT_PERIOD_HOURS,
  DIFFICULTY_IMPACT_REFRESH_MS,
  isDifficultyImpactStale,
  parseDifficultyImpactResult,
  type DifficultyImpactResult,
  type DifficultyImpactSnapshot,
} from '@/lib/difficulty-impact'
import { directionOf } from './direction'

const REFRESH_TIMEOUT_MS = 15_000

type BaselineState = {
  snapshot: DifficultyImpactSnapshot | null
  problem: 'region-restricted' | 'unavailable' | 'invalid' | null
}

function adjustmentLabel(value: number) {
  return (value < 0 ? '−' : value > 0 ? '+' : '') + Math.abs(value) + '%'
}

function retrievedLabel(value: string) {
  const date = new Date(value)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const time = [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()]
    .map(part => String(part).padStart(2, '0')).join(':')
  return date.getUTCDate() + ' ' + months[date.getUTCMonth()] + ' ' + date.getUTCFullYear() + ', ' + time + ' UTC'
}

function ImpactLayout({ children }: { children: ReactNode }) {
  return (
    <section className="landing-impact" id="difficulty-impact" aria-labelledby="impact-title">
      <div className="landing-impact-copy">
        <p className="landing-impact-eyebrow">Difficulty &amp; production</p>
        <h2 id="impact-title">How difficulty changes BTC production</h2>
        <p className="landing-impact-intro">
          At the same miner hashrate, higher difficulty means less expected BTC
          production, all else equal. Move the slider to see the effect.
        </p>
        <a className="landing-impact-link" href="/tools/difficulty-exposure">
          Open the full difficulty calculator
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
      <div className="landing-impact-panel">{children}</div>
    </section>
  )
}

export function DifficultyImpactLoading() {
  return (
    <ImpactLayout>
      <div className="landing-impact-empty" role="status" aria-busy="true">
        <p className="landing-impact-empty-title">Loading the network baseline</p>
        <p>Retrieving mining difficulty from the Doefin API.</p>
      </div>
    </ImpactLayout>
  )
}

export function DifficultyImpact({ initialResult, initialNow }: {
  initialResult: DifficultyImpactResult
  initialNow: number
}) {
  const [change, setChange] = useState(0)
  const [baseline, setBaseline] = useState<BaselineState>(() => initialResult.status === 'available'
    ? { snapshot: initialResult.snapshot, problem: null }
    : { snapshot: null, problem: initialResult.status })
  const [now, setNow] = useState(initialNow)
  const [refreshing, setRefreshing] = useState(false)
  const request = useRef<AbortController | null>(null)

  const refresh = useCallback(async () => {
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setRefreshing(true)
    const timeout = window.setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS)

    try {
      const response = await fetch('/api/v3/difficulty-impact', { cache: 'no-store', signal: controller.signal })
      if (request.current !== controller) return
      if (response.status === 451) {
        setBaseline({ snapshot: null, problem: 'region-restricted' })
        return
      }
      const result = parseDifficultyImpactResult(await response.json())
      if (request.current !== controller) return
      if (result?.status === 'region-restricted') {
        setBaseline({ snapshot: null, problem: 'region-restricted' })
      } else if (response.ok && result?.status === 'available') {
        setBaseline({ snapshot: result.snapshot, problem: null })
      } else {
        setBaseline(previous => ({ ...previous, problem: result?.status === 'invalid' ? 'invalid' : 'unavailable' }))
      }
    } catch {
      if (request.current === controller) {
        setBaseline(previous => ({ ...previous, problem: 'unavailable' }))
      }
    } finally {
      window.clearTimeout(timeout)
      if (request.current === controller) {
        request.current = null
        setRefreshing(false)
        setNow(Date.now())
      }
    }
  }, [])

  useEffect(() => {
    setNow(Date.now())
    const refreshTimer = window.setInterval(() => { void refresh() }, DIFFICULTY_IMPACT_REFRESH_MS)
    const ageTimer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => {
      window.clearInterval(refreshTimer)
      window.clearInterval(ageTimer)
      const current = request.current
      request.current = null
      current?.abort()
    }
  }, [refresh])

  const snapshot = baseline.snapshot
  const scenario = snapshot ? calculateDifficultyImpact(snapshot, change) : null
  const stale = snapshot ? Boolean(baseline.problem) || isDifficultyImpactStale(snapshot, now) : false

  if (!snapshot || !scenario) {
    const restricted = baseline.problem === 'region-restricted'
    return (
      <ImpactLayout>
        <div className="landing-impact-empty">
          <div role="status" aria-live="polite">
            <p className="landing-impact-empty-title">
              <WarningCircle className="landing-impact-icon" aria-hidden="true" />
              {restricted ? 'Network data is unavailable here' : 'The network baseline is unavailable'}
            </p>
            <p>{restricted
              ? 'The Doefin API does not provide this data in your region. Production estimates are unavailable.'
              : 'The Doefin API could not provide a valid difficulty reading. Retry to calculate expected production.'}</p>
          </div>
          <button className="landing-impact-refresh" type="button" onClick={() => { void refresh() }} disabled={refreshing}>
            <ArrowsClockwise className="landing-impact-icon" aria-hidden="true" />
            {refreshing ? 'Retrying…' : 'Retry network data'}
          </button>
          <p className="landing-impact-note">Source: Doefin API. No production estimate is shown without a network baseline.</p>
        </div>
      </ImpactLayout>
    )
  }

  return (
    <ImpactLayout>
      <div className="landing-impact-network" data-state={stale ? 'stale' : 'available'}>
        <div role="status" aria-live="polite">
          <p className="landing-impact-network-title">
            {stale ? <ClockCounterClockwise className="landing-impact-icon" aria-hidden="true" /> : <Pulse className="landing-impact-icon" aria-hidden="true" />}
            {stale ? 'Last available baseline' : 'Network baseline'}
          </p>
          <p>{(snapshot.difficulty / 1_000_000_000_000).toFixed(2)}T difficulty</p>
          {stale && <p>{baseline.problem
            ? 'Refresh unavailable. The figures below use the last available reading.'
            : 'Refresh to check the latest network baseline.'}</p>}
        </div>
        <button className="landing-impact-refresh" type="button" onClick={() => { void refresh() }} disabled={refreshing}>
          <ArrowsClockwise className="landing-impact-icon" aria-hidden="true" />
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      <div className="landing-impact-controls">
        <div className="landing-impact-slider-head">
          <label htmlFor="landing-difficulty-slider">
            <SlidersHorizontal className="landing-impact-icon" aria-hidden="true" />
            Difficulty adjustment
          </label>
          <output className="landing-signed-value" data-direction={directionOf(change)} htmlFor="landing-difficulty-slider" aria-live="off">
            {adjustmentLabel(change)}
          </output>
        </div>
        <div className="landing-impact-slider">
          <div className="landing-impact-track" aria-hidden="true">
            <span style={{
              left: (50 + Math.min(change, 0) / (DIFFICULTY_IMPACT_MAX_CHANGE - DIFFICULTY_IMPACT_MIN_CHANGE) * 100) + '%',
              width: (Math.abs(change) / (DIFFICULTY_IMPACT_MAX_CHANGE - DIFFICULTY_IMPACT_MIN_CHANGE) * 100) + '%',
            }} />
          </div>
          <input
            id="landing-difficulty-slider"
            type="range"
            min={DIFFICULTY_IMPACT_MIN_CHANGE}
            max={DIFFICULTY_IMPACT_MAX_CHANGE}
            step="1"
            value={change}
            aria-valuetext={change === 0 ? 'No change from baseline' : Math.abs(change) + ' percent ' + (change > 0 ? 'increase' : 'decrease') + ' from baseline'}
            onChange={event => setChange(Number(event.target.value))}
          />
        </div>
        <div className="landing-impact-range" aria-hidden="true">
          <span>−30%</span><span>0%</span><span>+30%</span>
        </div>
      </div>

      <div className="landing-impact-result">
        <div className="landing-impact-result-heading">
          <p>Expected BTC production</p>
          <p className="landing-impact-status"><span>Estimate</span></p>
        </div>
        <div className="landing-impact-reading" aria-live="polite" aria-atomic="true">
          <p className="landing-impact-amount">{scenario.production.toFixed(6)} <span>BTC</span></p>
          <p className="landing-impact-change">
            <strong className="landing-signed-value" data-direction={directionOf(scenario.productionChange)}>
              {scenario.productionChange === 0
                ? 'Same as baseline'
                : `About ${Math.abs(scenario.productionChange).toFixed(1)}% ${scenario.productionChange > 0 ? 'more' : 'less'}`}
            </strong>
            {scenario.productionChange !== 0 && <span>than baseline</span>}
          </p>
        </div>
        <div className="landing-impact-comparison" role="group" aria-label="Expected BTC production comparison">
          <div className="landing-impact-comparison-row">
            <div><span>Baseline</span><span>{scenario.baselineProduction.toFixed(6)} BTC</span></div>
            <div className="landing-impact-bar" aria-hidden="true"><span style={{ transform: `scaleX(${scenario.maxProduction > 0 ? scenario.baselineProduction / scenario.maxProduction : 0})` }} /></div>
          </div>
          <div className="landing-impact-comparison-row landing-impact-comparison-selected">
            <div><span>Selected scenario</span><span>{scenario.production.toFixed(6)} BTC</span></div>
            <div className="landing-impact-bar" aria-hidden="true"><span style={{ transform: `scaleX(${scenario.maxProduction > 0 ? scenario.production / scenario.maxProduction : 0})` }} /></div>
          </div>
        </div>
        <p className="landing-impact-assumption">
          Example miner: {DIFFICULTY_IMPACT_HASHRATE_PH} PH/s for {DIFFICULTY_IMPACT_PERIOD_HOURS} hours at 100% uptime.
          Block subsidy only; transaction fees and pool fees excluded. Difficulty and subsidy stay fixed during each scenario.
        </p>
        <dl className="landing-impact-stats">
          <div><dt>Scenario difficulty</dt><dd>{scenario.difficultyTrillions.toFixed(2)}T</dd></div>
          <div><dt>Implied network hashrate</dt><dd>{scenario.impliedHashrateEh.toFixed(0)} <span>EH/s</span></dd></div>
        </dl>
      </div>

      <div className="landing-impact-footer">
        <div className="landing-impact-source">
          <p>Source: <a href="https://api.doefin.com/v1/block/analytics" target="_blank" rel="noreferrer">Doefin API</a> · Block {snapshot.blockHeight.toLocaleString('en-GB')}</p>
          <p>Retrieved <time dateTime={snapshot.receivedAt}>{retrievedLabel(snapshot.receivedAt)}</time></p>
        </div>
        <details className="landing-impact-details">
          <summary>
            <span><Calculator className="landing-impact-icon" aria-hidden="true" /> Assumptions and calculation</span>
            <CaretDown className="landing-impact-caret" aria-hidden="true" />
          </summary>
          <div>
            <p>Network baseline: {(snapshot.difficulty / 1_000_000_000_000).toFixed(2)}T difficulty at block {snapshot.blockHeight.toLocaleString('en-GB')}. The block subsidy is {snapshot.subsidyBtc} BTC per block, derived from this block height.</p>
            <p>Expected BTC production = miner hashrate in hashes per second × period in seconds × block subsidy ÷ (difficulty × 2³²).</p>
            <p>Implied network hashrate uses difficulty × 2³² ÷ 600 seconds. It is not a direct network measurement. Actual production varies.</p>
          </div>
        </details>
        <p className="landing-impact-note">This is not a forecast of trading returns.</p>
      </div>
    </ImpactLayout>
  )
}

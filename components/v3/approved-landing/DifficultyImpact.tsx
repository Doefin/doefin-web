'use client'

import type { LandingCopy } from '@/dictionaries'
import { formatMessage, languages, type Language } from '@/lib/languages'
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

function retrievedLabel(value: string, locale: string) {
  const date = new Date(value)
  const day = new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(date)
  return day + ', ' + value.slice(11, 19) + ' UTC'
}

function ImpactLayout({ children, copy }: { children: ReactNode; copy: LandingCopy }) {
  return (
    <section className="landing-impact" id="difficulty-impact" aria-labelledby="impact-title">
      <div className="landing-impact-copy">
        <p className="landing-impact-eyebrow">{copy.difficultyProduction}</p>
        <h2 id="impact-title">{copy.howDifficultyChangesBtcProduction}</h2>
        <p className="landing-impact-intro">
          {copy.atTheSameMinerHashrate}
        </p>
        <a className="landing-impact-link" href="/tools/difficulty-exposure">
          {copy.openTheFullDifficultyCalculator}
          <ArrowRight aria-hidden="true" />
        </a>
      </div>
      <div className="landing-impact-panel">{children}</div>
    </section>
  )
}

export function DifficultyImpactLoading({ copy }: { copy: LandingCopy }) {
  return (
    <ImpactLayout copy={copy}>
      <div className="landing-impact-empty" role="status" aria-busy="true">
        <p className="landing-impact-empty-title">{copy.loadingTheNetworkBaseline}</p>
        <p>{copy.retrievingMiningDifficultyFromThe}</p>
      </div>
    </ImpactLayout>
  )
}

export function DifficultyImpact({ initialResult, initialNow, copy, language }: {
  copy: LandingCopy
  language: Language
  initialResult: DifficultyImpactResult
  initialNow: number
}) {
  const locale = languages[language].tag
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
      <ImpactLayout copy={copy}>
        <div className="landing-impact-empty">
          <div role="status" aria-live="polite">
            <p className="landing-impact-empty-title">
              <WarningCircle className="landing-impact-icon" aria-hidden="true" />
              {restricted ? copy.networkDataIsUnavailableHere : copy.theNetworkBaselineIsUnavailable}
            </p>
            <p>{restricted
              ? copy.theDoefinApiDoesNot
              : copy.theDoefinApiCouldNot}</p>
          </div>
          <button className="landing-impact-refresh" type="button" onClick={() => { void refresh() }} disabled={refreshing}>
            <ArrowsClockwise className="landing-impact-icon" aria-hidden="true" />
            {refreshing ? copy.retrying : copy.retryNetworkData}
          </button>
          <p className="landing-impact-note">{copy.sourceDoefinApiNoProduction}</p>
        </div>
      </ImpactLayout>
    )
  }

  return (
    <ImpactLayout copy={copy}>
      <div className="landing-impact-network" data-state={stale ? 'stale' : 'available'}>
        <div role="status" aria-live="polite">
          <p className="landing-impact-network-title">
            {stale ? <ClockCounterClockwise className="landing-impact-icon" aria-hidden="true" /> : <Pulse className="landing-impact-icon" aria-hidden="true" />}
            {stale ? copy.lastAvailableBaseline : copy.networkBaseline}
          </p>
          <p>{formatMessage(copy.tDifficulty, { value: (snapshot.difficulty / 1_000_000_000_000).toFixed(2) })}</p>
          {stale && <p>{baseline.problem
            ? copy.refreshUnavailableTheFiguresBelow
            : copy.refreshToCheckTheLatest}</p>}
        </div>
        <button className="landing-impact-refresh" type="button" onClick={() => { void refresh() }} disabled={refreshing}>
          <ArrowsClockwise className="landing-impact-icon" aria-hidden="true" />
          {refreshing ? copy.refreshing : copy.refresh}
        </button>
      </div>

      <div className="landing-impact-controls">
        <div className="landing-impact-slider-head">
          <label htmlFor="landing-difficulty-slider">
            <SlidersHorizontal className="landing-impact-icon" aria-hidden="true" />
            {copy.difficultyAdjustment}
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
            aria-valuetext={change === 0 ? copy.noChangeFromBaseline : formatMessage(change > 0 ? copy.percentIncreaseFromBaseline : copy.percentDecreaseFromBaseline, { value: Math.abs(change) })}
            onChange={event => setChange(Number(event.target.value))}
          />
        </div>
        <div className="landing-impact-range" aria-hidden="true">
          <span>−30%</span><span>0%</span><span>+30%</span>
        </div>
      </div>

      <div className="landing-impact-result">
        <div className="landing-impact-result-heading">
          <p>{copy.expectedBtcProduction}</p>
          <p className="landing-impact-status"><span>{copy.estimate}</span></p>
        </div>
        <div className="landing-impact-reading" aria-live="polite" aria-atomic="true">
          <p className="landing-impact-amount">{scenario.production.toFixed(6)} <span>BTC</span></p>
          <p className="landing-impact-change">
            <strong className="landing-signed-value" data-direction={directionOf(scenario.productionChange)}>
              {scenario.productionChange === 0
                ? copy.sameAsBaseline
                : formatMessage(scenario.productionChange > 0 ? copy.aboutMore : copy.aboutLess, { value: Math.abs(scenario.productionChange).toFixed(1) })}
            </strong>
            {scenario.productionChange !== 0 && <span>{copy.thanBaseline}</span>}
          </p>
        </div>
        <div className="landing-impact-comparison" role="group" aria-label={copy.expectedBtcProductionComparison}>
          <div className="landing-impact-comparison-row">
            <div><span>{copy.baseline}</span><span>{scenario.baselineProduction.toFixed(6)} BTC</span></div>
            <div className="landing-impact-bar" aria-hidden="true"><span style={{ transform: `scaleX(${scenario.maxProduction > 0 ? scenario.baselineProduction / scenario.maxProduction : 0})` }} /></div>
          </div>
          <div className="landing-impact-comparison-row landing-impact-comparison-selected">
            <div><span>{copy.selectedScenario}</span><span>{scenario.production.toFixed(6)} BTC</span></div>
            <div className="landing-impact-bar" aria-hidden="true"><span style={{ transform: `scaleX(${scenario.maxProduction > 0 ? scenario.production / scenario.maxProduction : 0})` }} /></div>
          </div>
        </div>
        <p className="landing-impact-assumption">
          {formatMessage(copy.exampleMinerPhSFor, { hashrate: DIFFICULTY_IMPACT_HASHRATE_PH, hours: DIFFICULTY_IMPACT_PERIOD_HOURS })}
        </p>
        <dl className="landing-impact-stats">
          <div><dt>{copy.scenarioDifficulty}</dt><dd>{scenario.difficultyTrillions.toFixed(2)}T</dd></div>
          <div><dt>{copy.impliedNetworkHashrate}</dt><dd>{scenario.impliedHashrateEh.toFixed(0)} <span>EH/s</span></dd></div>
        </dl>
      </div>

      <div className="landing-impact-footer">
        <div className="landing-impact-source">
          <p>{copy.source}{' '}<a href="https://api.doefin.com/v1/block/analytics" target="_blank" rel="noreferrer">{copy.doefinApi}</a>{' '}{copy.block2}{' '}{snapshot.blockHeight.toLocaleString(locale)}</p>
          <p>{copy.retrieved}{' '}<time dateTime={snapshot.receivedAt}>{retrievedLabel(snapshot.receivedAt, locale)}</time></p>
        </div>
        <details className="landing-impact-details">
          <summary>
            <span><Calculator className="landing-impact-icon" aria-hidden="true" />{' '}{copy.assumptionsAndCalculation}</span>
            <CaretDown className="landing-impact-caret" aria-hidden="true" />
          </summary>
          <div>
            <p>{formatMessage(copy.networkBaselineTDifficultyAt, {
              difficulty: (snapshot.difficulty / 1_000_000_000_000).toFixed(2),
              height: snapshot.blockHeight.toLocaleString(locale),
              subsidy: snapshot.subsidyBtc,
            })}</p>
            <p>{copy.expectedBtcProductionMinerHashrate}</p>
            <p>{copy.impliedNetworkHashrateUsesDifficulty}</p>
          </div>
        </details>
        <p className="landing-impact-note">{copy.thisIsNotAForecast}</p>
      </div>
    </ImpactLayout>
  )
}

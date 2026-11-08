'use client'

import { useEffect, useId, useRef, type CSSProperties } from 'react'
import styles from './ProductionWalkthrough.module.css'

type Scene = {
  title: string
  heading: string
  note: string
  context: string
  duration?: number
  motion: number
  description?: string
}

const scenes: readonly Scene[] = [
  {
    title: 'Scenario',
    heading: 'Difficulty rises 10%',
    note: '1 BTC at unchanged difficulty',
    context: 'Same fleet and period',
    duration: 6205,
    motion: 2355,
    description: 'The fleet expects 1 BTC at unchanged difficulty. If difficulty is 10% higher throughout the same period, each block takes 1.10 times as much expected work.',
  },
  {
    title: 'Split',
    heading: 'Break the estimate into units',
    note: '1 BTC = 1,000 units',
    context: '1 unit = 0.001 BTC',
    duration: 4675,
    motion: 3000,
  },
  {
    title: 'Divide',
    heading: 'More work per block, fewer BTC',
    note: 'Divide by the difficulty factor',
    context: 'Units rounded to the nearest whole unit',
    duration: 5865,
    motion: 3420,
    description: '1,000 baseline units divided by the 1.10 difficulty factor gives about 909 units of expected production. The grid highlights those 909 units.',
  },
  {
    title: 'Result',
    heading: '9.09% less expected BTC',
    note: 'From 1 BTC to about 0.909 BTC over the same period',
    context: '',
    motion: 2051,
    description: 'At unchanged difficulty the fleet expects 1 BTC. With difficulty 10% higher, it expects about 0.909 BTC, a shortfall of about 0.091 BTC over the same period.',
  },
]

const betweenWalkthroughs = 3000
const minimumVisibility = 0.55
const lastStep = scenes.length - 1
const result = scenes[lastStep]
const chapterNumber = (index: number) => String(index + 1).padStart(2, '0')

export function ProductionWalkthrough() {
  const root = useRef<HTMLElement>(null)
  const id = useId()
  const titleId = `${id}-title`
  const diagramId = `${id}-diagram`
  const descriptionId = `${id}-description`
  const unitId = `${id}-unit`
  const hatchId = `${id}-hatch`
  const workId = `${id}-work`
  const panelId = `${id}-panel`
  const coinId = `${id}-coin`

  useEffect(() => {
    if (root.current) return setupPlayback(root.current, descriptionId)
  }, [descriptionId])

  return (
    <article ref={root} className={styles.story} data-stage={lastStep} aria-label="From 1 BTC to about 0.909 BTC">
      <div className={styles['story-head']}>
        <strong>What happens to the 1 BTC estimate?</strong>
        <button type="button" className={styles.playback} data-production-play aria-label="Pause animation" hidden>
          <svg aria-hidden="true" viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path data-pause-icon d="M7 4v12m6-12v12" />
            <path data-resume-icon d="m7 4 9 6-9 6Z" />
          </svg>
        </button>
      </div>
      <nav className={styles.steps} data-production-steps aria-label="Production story steps" hidden>
        {scenes.map((scene, index) => (
          <button type="button" data-step={index} aria-current={index === lastStep ? 'step' : undefined} key={scene.title}>
            <span aria-hidden="true">{chapterNumber(index)}</span>{scene.title}
          </button>
        ))}
      </nav>
      <figure data-production-canvas className={styles.art} aria-labelledby={titleId}>
        <div data-production-caption className={styles['art-top']}>
          <div>
            <span className={styles.chapter} data-chapter>{chapterNumber(lastStep)} / {result.title}</span>
            <h3 id={titleId} data-heading>{result.heading}</h3>
          </div>
          <span className={styles['split-count']} data-split-count hidden>1,000 units</span>
        </div>
        <svg viewBox="0 0 516 204" role="img" aria-labelledby={diagramId} aria-describedby={descriptionId}>
          <title id={diagramId}>Expected Bitcoin production by difficulty</title>
          <desc id={descriptionId}>{result.description}</desc>
          <defs>
            <pattern id={unitId} width="10" height="10" patternUnits="userSpaceOnUse"><rect className={styles['unit-on']} x="1.3" y="1.3" width="7.4" height="7.4" rx="1.25"/></pattern>
            <pattern id={hatchId} width="8" height="8" patternUnits="userSpaceOnUse">
              <path className={styles['hatch-line']} d="M-2 2 2-2M0 8 8 0M6 10 10 6"/>
            </pattern>
            <rect id={workId} className={styles['work-slot']} width="38" height="22" rx="4"/>
            <symbol id={panelId} viewBox="0 0 100 100"><rect width="100" height="100" fill={`url(#${unitId})`}/></symbol>
            <g id={coinId}>
            <rect className={styles['coin-outline']} x="158" y="22" width="200" height="160" rx="21"/>
            <rect className={styles['coin-plate']} x="169" y="32" width="178" height="140" rx="17"/>
            <text className={styles['coin-number']} x="258" y="125" textAnchor="middle">1 BTC</text>
            </g>
          </defs>
          <g className={styles.coin} data-production-coin aria-hidden="true"><use href={`#${coinId}`}/></g>
          <g className={styles['difficulty-diagram']} aria-hidden="true">
            <text x="22" y="130">Expected work per block</text>
            <text className={styles.ratio} x="494" y="130" textAnchor="end">1.10×</text>
            {Array.from({ length: 10 }, (_, index) => (
              <use key={index} href={`#${workId}`} x={22 + 43 * index} y="142"/>
            ))}
            <rect className={styles['extra-outline']} x="452" y="142" width="38" height="22" rx="4"/>
            <rect className={`${styles['extra-work']} ${styles['extra-slot']}`} x="452" y="142" width="38" height="22" rx="4"/>
            <path className={styles['work-bracket']} d="M22 168v7h425v-7M452 168v7h38v-7"/>
            <text x="234.5" y="196" textAnchor="middle">Baseline · 1.00×</text>
            <text className={styles['work-extra-label']} x="471" y="196" textAnchor="middle">+10%</text>
          </g>
          <g className={styles['unit-groups']} aria-hidden="true">
            {Array.from({ length: 10 }, (_, index) => {
              const column = index % 5
              const row = Math.floor(index / 5)
              const x = column * 104
              const y = row * 104
              const offset = {
                '--from-x': `${169 - .356 * column * 4}px`,
                '--from-y': `${32 - .7 * row * 4}px`,
              } as CSSProperties
              return (
                <g key={index}>
                  <rect className={styles['panel-body']} x={x} y={y} width="100" height="100" rx="3" style={offset}/>
                  <use className={styles['panel-grid']} data-production-panel href={`#${panelId}`} x={x} y={y} width="100" height="100"/>
                </g>
              )
            })}
            <path className={styles['excluded-units']} data-production-excluded d="M506 104H516V204H416V114H506Z"/>
          </g>
          <g className={styles['division-diagram']} aria-hidden="true" textAnchor="middle">
            <g className={styles['math-part']} style={{ '--enter': '1564ms' } as CSSProperties}>
              <text className={styles.operand} x="84" y="143">1,000</text>
              <text x="84" y="178">Baseline units</text>
            </g>
            <g className={styles['math-part']} style={{ '--enter': '2108ms' } as CSSProperties}>
              <text className={styles.operator} x="170" y="141">÷</text>
              <text className={styles.operand} x="258" y="143">1.10</text>
              <text x="258" y="178">Difficulty factor</text>
            </g>
            <g className={styles['math-part']} style={{ '--enter': '3060ms' } as CSSProperties}>
              <text className={styles.operator} x="340" y="141">≈</text>
              <rect className={styles['answer-frame']} x="355" y="99" width="154" height="92" rx="9"/>
              <text className={`${styles.operand} ${styles.answer}`} x="432" y="143">909</text>
              <text className={styles['answer-caption']} x="432" y="176">Expected units</text>
            </g>
          </g>
          <g className={styles['result-diagram']} aria-hidden="true">
            <text x="12" y="32">Unchanged difficulty</text>
            <text className={styles['result-value']} x="504" y="32" textAnchor="end">1 BTC</text>
            <rect className={styles['result-baseline']} x="12" y="44" width="492" height="24" rx="3"/>
            <text x="12" y="103">10% higher difficulty</text>
            <text className={styles['result-value']} x="504" y="103" textAnchor="end">≈0.909 BTC</text>
            <rect fill={`url(#${hatchId})`} className={styles['result-gap']} x="459.273" y="115" width="44.727" height="24" rx="2"/>
            <rect className={styles['result-fill']} x="12" y="115" width="447.273" height="24" rx="3"/>
            <g className={styles['gap-label']}>
              <path className={styles['result-measure']} d="M459.273 147v9H504v-9M481.636 156v10"/>
              <text className={styles['result-value']} x="504" y="191" textAnchor="end">≈0.091 BTC less</text>
            </g>
          </g>
        </svg>
        <figcaption data-production-caption className={styles['art-note']}>
          <span data-art-note>{result.note}</span>
          <span data-art-context></span>
        </figcaption>
      </figure>
    </article>
  )
}

function setupPlayback(story: HTMLElement, descriptionId: string) {
  const play = story.querySelector<HTMLButtonElement>('[data-production-play]')!
  const steps = story.querySelector<HTMLElement>('[data-production-steps]')!
  const buttons = [...steps.querySelectorAll('button')]
  const captions = story.querySelectorAll<HTMLElement>('[data-production-caption]')
  const chapter = story.querySelector('[data-chapter]')!
  const heading = story.querySelector('[data-heading]')!
  const coin = story.querySelector('[data-production-coin]')!
  const firstGridPanel = story.querySelector('[data-production-panel]')!
  const excludedUnits = story.querySelector('[data-production-excluded]')!
  const splitCount = story.querySelector<HTMLElement>('[data-split-count]')!
  const artNote = story.querySelector('[data-art-note]')!
  const artContext = story.querySelector('[data-art-context]')!
  const description = document.getElementById(descriptionId)!
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const events = new AbortController()
  const { signal } = events
  const canvas = story.querySelector('[data-production-canvas]')!
  const supportsPlayback = 'IntersectionObserver' in window && typeof story.getAnimations === 'function'

  let current = lastStep
  let timer: number | undefined
  let visible = false
  let userPaused = false
  let due = 0
  let remaining = 425
  let frozen: Animation[] = []

  function show(index: number, useMotion: boolean) {
    if (index === 1) {
      const previousCoin = getComputedStyle(coin)
      story.style.setProperty('--coin-start', previousCoin.opacity)
      story.style.setProperty('--coin-pose', previousCoin.transform)
    }
    if (index === 2) {
      story.style.setProperty('--grid-start', current === 1 ? getComputedStyle(firstGridPanel).opacity : '0')
    }

    story.toggleAttribute('data-result-handoff',
      useMotion && index === lastStep && current === 2 &&
      getComputedStyle(excludedUnits).fillOpacity === '0.84')

    if (index === current && useMotion) {
      story.removeAttribute('data-animate')
      void story.offsetWidth
    }

    current = index
    const scene = scenes[index]
    story.dataset.stage = String(index)
    story.toggleAttribute('data-animate', useMotion)
    chapter.textContent = `${chapterNumber(index)} / ${scene.title}`
    heading.textContent = scene.heading
    splitCount.hidden = index !== 1
    artNote.textContent = scene.note
    artContext.textContent = scene.context
    description.textContent = scene.description ?? `${scene.note}. ${scene.context}.`
    if (useMotion) {
      for (const caption of captions) caption.classList.remove(styles['caption-enter'])
      void story.offsetWidth
      for (const caption of captions) caption.classList.add(styles['caption-enter'])
    }
    buttons.forEach((button, step) => {
      if (step === index) button.setAttribute('aria-current', 'step')
      else button.removeAttribute('aria-current')
    })
  }

  function clearTimer() {
    window.clearTimeout(timer)
    timer = undefined
  }

  function canPlay() {
    return supportsPlayback && visible && !userPaused && !reducedMotion.matches && !document.hidden
  }

  function syncPlayback() {
    if (!canPlay()) {
      if (timer === undefined) return
      remaining = Math.max(0, due - performance.now())
      clearTimer()
      frozen = story.getAnimations({ subtree: true }).filter(animation => animation.playState === 'running')
      for (const animation of frozen) animation.pause()
      return
    }

    if (timer !== undefined) return
    for (const animation of frozen) animation.play()
    frozen = []
    due = performance.now() + remaining
    timer = window.setTimeout(() => {
      timer = undefined
      advance((current + 1) % scenes.length)
    }, remaining)
  }

  function advance(index: number) {
    clearTimer()
    for (const animation of frozen) animation.cancel()
    frozen = []
    show(index, canPlay())
    const scene = scenes[index]
    remaining = scene.duration ?? scene.motion + betweenWalkthroughs
    syncPlayback()
  }

  play.addEventListener('click', () => {
    userPaused = !userPaused
    play.toggleAttribute('data-paused', userPaused)
    play.setAttribute('aria-label', userPaused ? 'Resume animation' : 'Pause animation')
    syncPlayback()
  }, { signal })

  buttons.forEach((button, index) => button.addEventListener('click', () => advance(index), { signal }))

  function updatePreference() {
    play.hidden = !supportsPlayback || reducedMotion.matches
    if (reducedMotion.matches) {
      syncPlayback()
      for (const animation of frozen) animation.cancel()
      frozen = []
      story.removeAttribute('data-animate')
    } else {
      syncPlayback()
    }
  }

  const observer = supportsPlayback ? new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= minimumVisibility
    syncPlayback()
  }, { threshold: minimumVisibility }) : null

  reducedMotion.addEventListener('change', updatePreference, { signal })
  document.addEventListener('visibilitychange', syncPlayback, { signal })
  steps.hidden = false
  updatePreference()
  observer?.observe(canvas)

  return () => {
    observer?.disconnect()
    events.abort()
    clearTimer()
    for (const animation of frozen) animation.cancel()
  }
}

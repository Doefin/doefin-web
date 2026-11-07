'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import styles from './TradeWalkthrough.module.css'

const betweenSteps = 380
const betweenWalkthroughs = 3000
const minimumVisibility = 0.55

const choreography = [
  { traces: [[170, 310], [470, 290], [745, 115]], result: 740, finish: 1390 },
  { traces: [[], [270, 530], [780, 130]], result: 810, finish: 1490 },
  { traces: [[180, 225], [395, 475]], result: 800, finish: 1550 },
] as const

function traceDiagram(diagram: SVGSVGElement, timing: typeof choreography[number]) {
  const { traces, result, finish } = timing
  const animations: Animation[] = []
  const overlays: SVGPathElement[] = []
  diagram.setAttribute('data-playing', '')

  for (const original of diagram.querySelectorAll<SVGPathElement>('[data-trace]')) {
    const [delay, duration] = traces[Number(original.dataset.trace)]
    const overlay = original.cloneNode(false) as SVGPathElement
    overlay.setAttribute('class', styles.traceOverlay)
    overlay.removeAttribute('data-trace')
    overlay.setAttribute('pathLength', '1')
    overlay.setAttribute('aria-hidden', 'true')
    diagram.append(overlay)
    overlays.push(overlay)

    animations.push(overlay.animate(
      [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }],
      { delay, duration, easing: 'cubic-bezier(.35,0,.3,1)', fill: 'forwards' },
    ))
    animations.push(overlay.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { delay: finish - 190, duration: 190, fill: 'forwards' },
    ))
  }

  for (const label of diagram.querySelectorAll<SVGElement>('[data-beat]')) {
    const color = getComputedStyle(label).fill
    const isInput = label.dataset.beat === 'input'
    animations.push(label.animate(
      [
        { fill: color },
        { fill: 'var(--df-link)', offset: .30 },
        { fill: 'var(--df-link)', offset: .68 },
        { fill: color },
      ],
      { delay: isInput ? 0 : result, duration: isInput ? 430 : finish - result, easing: 'ease-in-out' },
    ))
  }

  return {
    diagram,
    finished: Promise.allSettled(animations.map(animation => animation.finished)),
    cancel() {
      diagram.removeAttribute('data-playing')
      for (const animation of animations) animation.cancel()
      for (const overlay of overlays) overlay.remove()
    },
  }
}

export function TradeWalkthroughMotion({ heading, children }: { heading: ReactNode; children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  const button = useRef<HTMLButtonElement>(null)
  const [available, setAvailable] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (!root.current || !button.current || !('IntersectionObserver' in window) || typeof Element.prototype.animate !== 'function') return

    const toggle = button.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const diagrams = [...root.current.querySelectorAll<SVGSVGElement>('[data-walkthrough-diagram]')]
    const visible = new Set<SVGSVGElement>()
    const played = new Set<SVGSVGElement>()
    let userPaused = false
    let timer: number | undefined
    let resting = false
    let active: ReturnType<typeof traceDiagram> | null = null

    function allowed() {
      return !userPaused && !reducedMotion.matches && !document.hidden
    }

    function clearTimer() {
      window.clearTimeout(timer)
      timer = undefined
      resting = false
    }

    function stopActive() {
      if (!active) return
      const run = active
      active = null
      played.delete(run.diagram)
      run.cancel()
    }

    function nextVisible() {
      return diagrams.find(diagram => visible.has(diagram) && !played.has(diagram))
    }

    function playNext() {
      clearTimer()
      const diagram = nextVisible()
      if (!diagram || !allowed()) {
        schedule()
        return
      }

      played.add(diagram)
      const run = traceDiagram(diagram, choreography[diagrams.indexOf(diagram)])
      active = run
      void run.finished.then(() => {
        if (active !== run) return
        active = null
        run.cancel()
        schedule()
      })
    }

    function schedule() {
      if (!allowed() || !visible.size) {
        clearTimer()
        stopActive()
        played.clear()
        return
      }

      if (active && !visible.has(active.diagram)) stopActive()
      if (active) return

      if (nextVisible()) {
        if (resting) clearTimer()
        if (timer === undefined) timer = window.setTimeout(playNext, betweenSteps)
      } else if (!resting) {
        clearTimer()
        resting = true
        timer = window.setTimeout(() => {
          played.clear()
          playNext()
        }, betweenWalkthroughs)
      }
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const diagram = entry.target as SVGSVGElement
        if (entry.isIntersecting && entry.intersectionRatio >= minimumVisibility) visible.add(diagram)
        else visible.delete(diagram)
      }
      schedule()
    }, { threshold: minimumVisibility })

    function updatePreference() {
      setAvailable(!reducedMotion.matches)
      schedule()
    }

    function togglePlayback() {
      userPaused = !userPaused
      setPaused(userPaused)
      schedule()
    }

    toggle.addEventListener('click', togglePlayback)
    reducedMotion.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', schedule)
    for (const diagram of diagrams) observer.observe(diagram)
    updatePreference()

    return () => {
      observer.disconnect()
      toggle.removeEventListener('click', togglePlayback)
      reducedMotion.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', schedule)
      clearTimer()
      stopActive()
    }
  }, [])

  return (
    <div ref={root} className={styles.journey}>
      <div className={styles.mast}>
        {heading}
        <button ref={button} type="button" className={styles.motionToggle} hidden={!available}>
          {paused ? 'Resume diagrams' : 'Pause diagrams'}
        </button>
      </div>
      {children}
    </div>
  )
}

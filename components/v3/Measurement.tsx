'use client'

import { useEffect, useRef, useState, type RefObject } from 'react'
import { usePathname } from 'next/navigation'
import { activateMeasurement, emitV3Measurement, V3_MEASUREMENT_CHANNEL, type MeasurementEventName, type MeasurementPayloads } from '@/lib/v3-measurement'
import { appendPrototypeEvent, measurementSection, prototypeReviewEnabled, REVIEW_CHANGE } from '@/lib/v3-prototype-review'

/** Explicit QA build opt-in only. This component supplies no collector. */
export function MeasurementBoundary() {
  const pathname = usePathname()
  const [reviewEnabled, setReviewEnabled] = useState(false)
  useEffect(() => {
    const update = () => setReviewEnabled(prototypeReviewEnabled())
    update()
    window.addEventListener(REVIEW_CHANGE, update)
    return () => window.removeEventListener(REVIEW_CHANGE, update)
  }, [])
  useEffect(() => {
    if ((process.env.NEXT_PUBLIC_V3_MEASUREMENT_QA !== 'enabled' && !reviewEnabled) || !pathname || !/^\/v3(?:\/|$)/.test(pathname)) return
    const deactivate = activateMeasurement(event => {
      window.dispatchEvent(new CustomEvent(V3_MEASUREMENT_CHANNEL, { detail: event }))
      appendPrototypeEvent(event)
    }, true)
    if (pathname !== '/v3/prototype-review') emitV3Measurement('page_view', { section: measurementSection(pathname), signal: 'route-render' })
    function click(event: MouseEvent) {
      if (!event.isTrusted || event.defaultPrevented || event.button !== 0 || !(event.target instanceof Element)) return
      const target = event.target.closest<HTMLElement>('[data-v3-cta][data-v3-placement]')
      if (!target || target.getAttribute('aria-disabled') === 'true' || (target instanceof HTMLButtonElement && target.disabled)) return
      emitV3Measurement('homepage_cta_click', {
        cta: target.dataset.v3Cta as MeasurementPayloads['homepage_cta_click']['cta'],
        placement: target.dataset.v3Placement as MeasurementPayloads['homepage_cta_click']['placement'],
        entry: pathname === '/v3' || pathname === '/v3/' ? 'homepage' : 'other-v3',
      })
    }
    // Capture precedes Next Link's deliberate preventDefault for client-side routing.
    // This records click intent, never successful destination navigation.
    document.addEventListener('click', click, true)
    const tutorialObserver = pathname === '/v3/learn/difficulty-exposure' && typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting && entry.intersectionRatio >= 0.25 && entry.target instanceof HTMLElement) {
          const step = entry.target.dataset.v3TutorialStep as MeasurementPayloads['tutorial_step_visit']['step']
          emitV3Measurement('tutorial_step_visit', { step, signal: 'visible-proxy' }, `tutorial:${step}`)
        }
      }, { threshold: 0.25 }) : null
    if (tutorialObserver) document.querySelectorAll('[data-v3-tutorial-step]').forEach(element => tutorialObserver.observe(element))
    return () => { document.removeEventListener('click', click, true); tutorialObserver?.disconnect(); deactivate() }
  }, [pathname, reviewEnabled])
  return null
}

/** A visibility proxy, never a claim that the user read or understood the content. */
export function useV3MeasurementView<K extends MeasurementEventName>(ref: RefObject<HTMLElement | null>, name: K, payload: MeasurementPayloads[K], dedupeKey: string, eligible = true) {
  const stablePayload = JSON.stringify(payload)
  useEffect(() => {
    if ((process.env.NEXT_PUBLIC_V3_MEASUREMENT_QA !== 'enabled' && !prototypeReviewEnabled()) || !eligible || !ref.current || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.25)) {
        if (emitV3Measurement(name, JSON.parse(stablePayload) as MeasurementPayloads[K], dedupeKey)) observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, name, stablePayload, dedupeKey, eligible])
}

/** Call markInputChange only from a changed input handler, never a render/URL effect. */
export function useCalculatorMeasurement(tool: MeasurementPayloads['calculator_invalid']['tool'], resultValid: boolean, enabled: boolean) {
  const resultRef = useRef<HTMLParagraphElement | null>(null)
  const [activity, setActivity] = useState<{ source: 'user' | 'sample' | 'example'; revision: number }>({ source: 'sample', revision: 0 })
  const key = `${tool}:${activity.source}:${activity.revision}`
  useV3MeasurementView(resultRef, 'calculator_meaningful_use', { tool, source: 'user', inputChanged: true, resultValid: true, resultVisible: true }, key, enabled && resultValid && activity.source === 'user')
  useV3MeasurementView(resultRef, 'calculator_sample_view', { tool, source: activity.source === 'example' ? 'example' : 'sample', resultValid: true, resultVisible: true }, key, enabled && resultValid && activity.source !== 'user')
  useEffect(() => {
    if (enabled && !resultValid) emitV3Measurement('calculator_invalid', { tool, source: activity.source }, key)
  }, [enabled, resultValid, tool, activity.source, key])
  return {
    resultRef,
    markInputChange: () => setActivity(previous => ({ source: 'user', revision: previous.revision + 1 })),
    markSample: (source: 'sample' | 'example' = 'sample') => setActivity(previous => ({ source, revision: previous.revision + 1 })),
  }
}

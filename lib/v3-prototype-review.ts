import { sanitizeMeasurement, type MeasurementEvent, type MeasurementPayloads } from './v3-measurement'

const modeKey = 'doefin:v3:review-enabled'
const logKey = 'doefin:v3:review-events'
export const REVIEW_CHANGE = 'doefin:v3:review-change'
export const REVIEW_LIMIT = 100

/** Explicit reviewer opt-in only; this tab stores enum events, never form data. */
export function prototypeReviewEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try { return window.sessionStorage.getItem(modeKey) === 'yes' } catch { return false }
}

export function readPrototypeEvents(): MeasurementEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw: unknown = JSON.parse(window.sessionStorage.getItem(logKey) || '[]')
    if (!Array.isArray(raw)) return []
    return raw.slice(-REVIEW_LIMIT).flatMap(value => {
      if (!value || typeof value !== 'object') return []
      const clean = sanitizeMeasurement(value.name, value.payload)
      return clean ? [clean] : []
    })
  } catch { return [] }
}

export function setPrototypeReview(enabled: boolean) {
  try {
    if (enabled) window.sessionStorage.setItem(modeKey, 'yes')
    else { window.sessionStorage.removeItem(modeKey); window.sessionStorage.removeItem(logKey) }
  } catch { /* Restricted storage leaves review disabled. */ }
  window.dispatchEvent(new Event(REVIEW_CHANGE))
}

export function clearPrototypeEvents() {
  try { window.sessionStorage.removeItem(logKey) } catch { /* No persistent fallback. */ }
  window.dispatchEvent(new Event(REVIEW_CHANGE))
}

export function appendPrototypeEvent(event: MeasurementEvent) {
  if (!prototypeReviewEnabled()) return
  const clean = sanitizeMeasurement(event.name, event.payload)
  if (!clean) return
  try { window.sessionStorage.setItem(logKey, JSON.stringify([...readPrototypeEvents(), clean].slice(-REVIEW_LIMIT))) } catch { return }
  window.dispatchEvent(new Event(REVIEW_CHANGE))
}

/** Coarse page category only: query strings, scenario URLs and free text stay out. */
export function measurementSection(pathname: string): MeasurementPayloads['page_view']['section'] {
  if (/^\/v3\/?$/.test(pathname)) return 'home'
  if (/^\/v3\/for\/institutions(?:\/|$)/.test(pathname)) return 'institutions'
  if (/^\/v3\/(?:product|for)(?:\/|$)/.test(pathname)) return 'product'
  if (/^\/v3\/tools(?:\/|$)/.test(pathname)) return 'tools'
  if (/^\/v3\/(?:learn|academy|glossary|blog)(?:\/|$)/.test(pathname)) return 'learn'
  if (/^\/v3\/(?:research|methodology)(?:\/|$)/.test(pathname)) return 'research'
  if (/^\/v3\/data(?:\/|$)/.test(pathname)) return 'data'
  if (/^\/v3\/newsletter(?:\/|$)/.test(pathname)) return 'newsletter'
  return 'other'
}

/** Local QA only. No identity, storage, transport, timestamps or free-text fields. */
export const V3_MEASUREMENT_CHANNEL = 'doefin:v3:measurement'
export const V3_JOURNEY_VERSION = 'miner-first-content-v1'
export const ctas = ['planner', 'tutorial', 'calculator', 'app', 'risk', 'evidence', 'resources', 'contact', 'settlement', 'setup', 'institutions', 'hosting', 'payback', 'overview'] as const
export const placements = ['hero', 'header', 'scenario', 'product', 'setup', 'trust', 'resources', 'faq', 'closing', 'footer', 'contextual'] as const
export const tools = ['difficulty-exposure', 'hosting-effective-rate', 'fleet-payback'] as const
export type MeasurementPayloads = {
  page_view: { section: 'home' | 'product' | 'tools' | 'learn' | 'research' | 'data' | 'newsletter' | 'institutions' | 'other'; signal: 'route-render' }
  identification_request: { kind: 'newsletter' | 'report' | 'scenario' | 'alerts'; result: 'demo-preview' }
  homepage_cta_click: { cta: typeof ctas[number]; placement: typeof placements[number]; entry: 'homepage' | 'other-v3' }
  tutorial_step_visit: { step: '1' | '2' | '3' | '4'; signal: 'visible-proxy' }
  tutorial_completion: { step: '4'; signal: 'final-step-action' }
  calculator_meaningful_use: { tool: typeof tools[number]; source: 'user'; inputChanged: true; resultValid: true; resultVisible: true }
  calculator_sample_view: { tool: typeof tools[number]; source: 'sample' | 'example'; resultValid: true; resultVisible: true }
  calculator_invalid: { tool: typeof tools[number]; source: 'user' | 'sample' | 'example' }
  planner_progress: { stage: 'estimate' | 'selection' | 'both-outcomes-visible' | 'app-handoff'; state: 'ready'; signal: 'action' | 'visible-proxy' }
  planner_state: { state: 'loading' | 'unavailable' | 'stale' | 'empty' | 'selection-removed' | 'invalid' | 'error' | 'ready'; signal: 'state-change' }
  planner_handoff_result: { state: 'navigation-requested' | 'recheck-failed' | 'unavailable'; signal: 'action' }
}
export type MeasurementEventName = keyof MeasurementPayloads
export type MeasurementEvent = { [K in MeasurementEventName]: { name: K; payload: MeasurementPayloads[K]; journeyVersion: typeof V3_JOURNEY_VERSION } }[MeasurementEventName]

const schemas: Record<MeasurementEventName, Record<string, readonly unknown[]>> = {
  page_view: { section: ['home', 'product', 'tools', 'learn', 'research', 'data', 'newsletter', 'institutions', 'other'], signal: ['route-render'] },
  identification_request: { kind: ['newsletter', 'report', 'scenario', 'alerts'], result: ['demo-preview'] },
  homepage_cta_click: { cta: ctas, placement: placements, entry: ['homepage', 'other-v3'] },
  tutorial_step_visit: { step: ['1', '2', '3', '4'], signal: ['visible-proxy'] },
  tutorial_completion: { step: ['4'], signal: ['final-step-action'] },
  calculator_meaningful_use: { tool: tools, source: ['user'], inputChanged: [true], resultValid: [true], resultVisible: [true] },
  calculator_sample_view: { tool: tools, source: ['sample', 'example'], resultValid: [true], resultVisible: [true] },
  calculator_invalid: { tool: tools, source: ['user', 'sample', 'example'] },
  planner_progress: { stage: ['estimate', 'selection', 'both-outcomes-visible', 'app-handoff'], state: ['ready'], signal: ['action', 'visible-proxy'] },
  planner_state: { state: ['loading', 'unavailable', 'stale', 'empty', 'selection-removed', 'invalid', 'error', 'ready'], signal: ['state-change'] },
  planner_handoff_result: { state: ['navigation-requested', 'recheck-failed', 'unavailable'], signal: ['action'] },
}

/** Reject unknown keys rather than allowing URLs, input values, wallets or arbitrary text. */
export function sanitizeMeasurement(name: unknown, payload: unknown): MeasurementEvent | null {
  if (typeof name !== 'string' || !Object.hasOwn(schemas, name) || !payload || typeof payload !== 'object' || Array.isArray(payload)) return null
  const schema = schemas[name as MeasurementEventName]
  const values = payload as Record<string, unknown>
  if (Object.keys(values).length !== Object.keys(schema).length || Object.keys(values).some(key => !Object.hasOwn(schema, key))) return null
  for (const [key, allowed] of Object.entries(schema)) if (!allowed.includes(values[key])) return null
  if (name === 'planner_progress') {
    const visible = values.stage === 'both-outcomes-visible'
    if ((values.signal === 'visible-proxy') !== visible) return null
  }
  return { name, payload: { ...values }, journeyVersion: V3_JOURNEY_VERSION } as MeasurementEvent
}

/** Bounded in-memory dedup is for duplicate renders/actions, never a visitor identifier. */
export function createMeasurementSession(sink: (event: MeasurementEvent) => void, enabled = false) {
  const seen = new Set<string>()
  return {
    emit(name: unknown, payload: unknown, dedupeKey?: string): boolean {
      if (!enabled) return false
      const event = sanitizeMeasurement(name, payload)
      if (!event || (dedupeKey !== undefined && (typeof dedupeKey !== 'string' || dedupeKey.length > 256))) return false
      const key = dedupeKey === undefined ? null : `${event.name}:${dedupeKey}`
      if (key && seen.has(key)) return false
      try { sink(event) } catch { return false }
      if (key) {
        seen.add(key)
        if (seen.size > 256) seen.delete(seen.values().next().value!)
      }
      return true
    },
    clear() { seen.clear() },
  }
}

let activeSession: ReturnType<typeof createMeasurementSession> | null = null
/** Boundary owns activation. An absent boundary always fails closed. */
export function activateMeasurement(sink: (event: MeasurementEvent) => void, qaEnabled = false) {
  const session = createMeasurementSession(sink, qaEnabled)
  activeSession = session
  return () => { session.clear(); if (activeSession === session) activeSession = null }
}
export function emitV3Measurement<K extends MeasurementEventName>(name: K, payload: MeasurementPayloads[K], dedupeKey?: string): boolean {
  return activeSession?.emit(name, payload, dedupeKey) ?? false
}
export const tradeMeasurementAvailability = 'unavailable: no authorized executed-fill integration' as const

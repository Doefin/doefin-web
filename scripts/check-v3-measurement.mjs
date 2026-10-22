import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { activateMeasurement, createMeasurementSession, emitV3Measurement, sanitizeMeasurement, tradeMeasurementAvailability } from '../lib/v3-measurement.ts'

const recorded = []
const valid = { cta: 'planner', placement: 'hero', entry: 'homepage' }
const disabled = createMeasurementSession(event => recorded.push(event))
assert.equal(disabled.emit('homepage_cta_click', valid), false)
assert.equal(emitV3Measurement('homepage_cta_click', valid), false)
assert.equal(recorded.length, 0)
const session = createMeasurementSession(event => recorded.push(event), true)
assert.equal(session.emit('homepage_cta_click', valid, 'hero-action'), true)
assert.equal(session.emit('homepage_cta_click', valid, 'hero-action'), false)
assert.equal(session.emit('homepage_cta_click', valid), true, 'Separate real clicks need not be deduplicated')
for (const bad of [null, [], {}, { ...valid, url: 'https://example.com/private' }, { ...valid, cta: 'wallet123' }, { ...valid, placement: undefined }, { ...valid, entry: 'new-person' }]) {
  assert.equal(session.emit('homepage_cta_click', bad), false)
}
assert.equal(sanitizeMeasurement('__proto__', valid), null)
assert.equal(session.emit('first_or_repeat_trade', { state: 'executed' }), false)
assert.match(tradeMeasurementAvailability, /unavailable/)
assert.equal(session.emit('planner_progress', { stage: 'both-outcomes-visible', state: 'ready', signal: 'action' }), false)
assert.equal(session.emit('planner_progress', { stage: 'selection', state: 'stale', signal: 'action' }), false)
assert.equal(session.emit('planner_progress', { stage: 'estimate', state: 'ready', signal: 'visible-proxy' }), false)
assert.equal(session.emit('planner_state', { state: 'unavailable', signal: 'state-change' }), true)
assert.equal(session.emit('planner_state', { state: 'stale', signal: 'state-change' }), true)
assert.equal(session.emit('planner_handoff_result', { state: 'recheck-failed', signal: 'action' }), true)
const use = { tool: 'difficulty-exposure', source: 'user', inputChanged: true, resultValid: true, resultVisible: true }
for (const key of ['inputChanged', 'resultValid', 'resultVisible']) assert.equal(session.emit('calculator_meaningful_use', { ...use, [key]: false }), false)
assert.equal(session.emit('calculator_meaningful_use', { ...use, source: 'sample' }), false)
assert.equal(session.emit('calculator_meaningful_use', use, 'changed-case'), true)
assert.equal(session.emit('calculator_meaningful_use', use, 'changed-case'), false)
assert.equal(session.emit('calculator_sample_view', { tool: 'difficulty-exposure', source: 'sample', resultValid: true, resultVisible: true }), true)
assert.equal(session.emit('tutorial_completion', { step: '4', signal: 'visible-proxy' }), false)
assert.equal(session.emit('tutorial_step_visit', { step: '4', signal: 'visible-proxy' }), true)
assert.equal(session.emit('tutorial_completion', { step: '4', signal: 'final-step-action' }), true)
const deactivate = activateMeasurement(event => recorded.push(event), true)
assert.equal(emitV3Measurement('homepage_cta_click', valid), true)
deactivate()
assert.equal(emitV3Measurement('homepage_cta_click', valid), false)
assert.equal(createMeasurementSession(() => { throw new Error('Disconnected sink') }, true).emit('homepage_cta_click', valid), false)
const bounded = createMeasurementSession(() => {}, true)
for (let index = 0; index < 257; index++) assert.equal(bounded.emit('homepage_cta_click', valid, String(index)), true)
assert.equal(bounded.emit('homepage_cta_click', valid, '0'), true, 'Old dedup entries evicted after bounded capacity')
assert.equal(session.emit('homepage_cta_click', valid, 'x'.repeat(257)), false)
for (const file of ['lib/v3-measurement.ts', 'components/v3/Measurement.tsx']) {
  const source = readFileSync(new URL('../' + file, import.meta.url), 'utf8')
  assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB)\b|document\.cookie/, file + ' must have no transport or persistence')
}
assert.ok(recorded.every(event => event.journeyVersion === 'miner-first-content-v1'))
console.log('V3 measurement: default-off, strict payloads, distinct outcomes, duplicate/error/unavailable cases and transport/persistence source guards pass.')

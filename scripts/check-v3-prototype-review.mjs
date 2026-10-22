import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'

const moduleUrl = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64')
const measurement = moduleUrl(readFileSync(new URL('../lib/v3-measurement.ts', import.meta.url), 'utf8'))
const source = readFileSync(new URL('../lib/v3-prototype-review.ts', import.meta.url), 'utf8').replace("'./v3-measurement'", JSON.stringify(measurement))
const { sanitizeMeasurement } = await import(measurement)
const review = await import(moduleUrl(source))
const storage = new Map()
globalThis.window = { sessionStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key) }, dispatchEvent: () => true }
const event = sanitizeMeasurement('identification_request', { kind: 'newsletter', result: 'demo-preview' })
assert.ok(event)
assert.equal(review.prototypeReviewEnabled(), false)
review.appendPrototypeEvent(event)
assert.deepEqual(review.readPrototypeEvents(), [])
review.setPrototypeReview(true)
assert.equal(review.prototypeReviewEnabled(), true)
for (let n = 0; n < 105; n++) review.appendPrototypeEvent(event)
assert.equal(review.readPrototypeEvents().length, 100)
review.appendPrototypeEvent({ ...event, payload: { ...event.payload, email: 'private@example.invalid' } })
assert.equal(review.readPrototypeEvents().length, 100)
assert.doesNotMatch(JSON.stringify([...storage.values()]), /private@|example\.invalid/)
for (const section of ['home', 'tools', 'research', 'institutions', 'newsletter']) {
  const path = { home: '/v3', tools: '/v3/tools/difficulty-exposure', research: '/v3/research/example', institutions: '/v3/for/institutions', newsletter: '/v3/newsletter' }[section]
  assert.equal(review.measurementSection(path), section)
}
assert.equal(sanitizeMeasurement('identification_request', { kind: 'newsletter', result: 'subscribed' }), null)
assert.equal(sanitizeMeasurement('page_view', { section: '/v3/private?email=private', signal: 'route-render' }), null)
review.clearPrototypeEvents()
assert.equal(review.readPrototypeEvents().length, 0)
review.appendPrototypeEvent(event)
review.setPrototypeReview(false)
assert.equal(review.readPrototypeEvents().length, 0)
assert.equal(storage.size, 0)
window.sessionStorage.getItem = () => { throw new Error('Storage blocked') }
assert.equal(review.prototypeReviewEnabled(), false)
assert.deepEqual(review.readPrototypeEvents(), [])
assert.doesNotMatch(source, /\b(?:fetch|XMLHttpRequest|sendBeacon|localStorage|indexedDB)\b|document\.cookie/)
console.log('Prototype review: default off, strict enum-only bounded log, explicit reset/stop, blocked storage and no transport pass.')

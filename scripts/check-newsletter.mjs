/** Pure prototype contract checks. No network, email provider or browser storage. */
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'
const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const dataUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const exposureUrl = dataUrl(compile(await readFile(new URL('../lib/exposure.ts', import.meta.url), 'utf8')))
const source = compile(await readFile(new URL('../lib/newsletter-contract.ts', import.meta.url), 'utf8')).replace("'./exposure'", JSON.stringify(exposureUrl))
const { validateEngagement, newsletterRoles } = await import(dataUrl(source))
let checks = 0
const ok = (test) => { test(); checks++ }
const base = { kind: 'newsletter', email: ' Person@Example.com ', role: 'miner', company: '', domain: '', research: true, product: false, alerts: false, consent: true, token: '' }
for (const [role] of newsletterRoles) ok(() => assert.equal(validateEngagement({ ...base, role }).role, role))
ok(() => assert.equal(validateEngagement(base).email, 'person@example.com'))
for (const email of ['', 'invalid', 'one@two', 'person@example.com\r\nBcc:other@example.com', `${'x'.repeat(255)}@example.com`]) ok(() => assert.throws(() => validateEngagement({ ...base, email })))
for (const patch of [{ role: 'CEO' }, { consent: false }, { research: false }, { research: 'yes' }, { company: 'x'.repeat(121) }, { domain: 'https://example.com/path' }]) ok(() => assert.throws(() => validateEngagement({ ...base, ...patch })))
ok(() => assert.equal(validateEngagement({ ...base, company: '<script>test</script>', domain: 'EXAMPLE.COM' }).domain, 'example.com'))
ok(() => assert.equal(validateEngagement({ ...base, research: false, product: true }).product, true))
ok(() => assert.equal(validateEngagement({ ...base, research: false, alerts: true }).alerts, true))
ok(() => assert.equal(validateEngagement({ ...base, hiddenDomainGuess: 'private.invalid' }).hiddenDomainGuess, undefined))
ok(() => assert.equal(validateEngagement({ kind: 'report', email: base.email, consent: true }).kind, 'report'))
const inputs = { eh: 1, epochs: 4, diffT: 127.48, low: -2.4, high: 7, fees: .05, price: 64000 }
ok(() => assert.deepEqual(validateEngagement({ kind: 'scenario', email: base.email, consent: true, inputs }).inputs, inputs))
for (const patch of [{ eh: 0 }, { epochs: 1.5 }, { high: Infinity }, { low: NaN }, { price: '64000' }]) ok(() => assert.throws(() => validateEngagement({ kind: 'scenario', email: base.email, consent: true, inputs: { ...inputs, ...patch } })))
ok(() => assert.throws(() => validateEngagement({ kind: 'scenario', email: base.email, consent: true })))
ok(() => assert.throws(() => validateEngagement({ ...base, kind: 'unknown' })))
console.log(`${checks} newsletter / delivery validation checks passed. No messages sent.`)
const toolsUrl = dataUrl(compile(await readFile(new URL('../lib/tool-url-state.ts', import.meta.url), 'utf8')))
const briefSource = compile(await readFile(new URL('../lib/scenario-brief.ts', import.meta.url), 'utf8')).replace("'./exposure'", JSON.stringify(exposureUrl)).replace("'./tool-url-state'", JSON.stringify(toolsUrl))
const { createScenarioBrief, scenarioBriefConciseHtml, scenarioUrl } = await import(dataUrl(briefSource))
const standard = createScenarioBrief(inputs, '2026-10-22T00:00:00.000Z', scenarioUrl(inputs, 'http://127.0.0.1:3046'))
const maximal = createScenarioBrief(inputs, '2026-10-22T00:00:00.000Z', scenarioUrl(inputs, 'http://127.0.0.1:3046'), { preparedFor: 'Operator team '.repeat(10), decision: 'Validate assumptions and seek finance approval. '.repeat(10), questions: '<script>alert("test")</script> Funding and settlement review? '.repeat(15) })
for (const brief of [standard, maximal]) {
  const html = scenarioBriefConciseHtml(brief)
  ok(() => assert(!html.includes('<script>')))
  ok(() => assert(html.includes('Decision &amp; approval questions')))
  for (const [label] of brief.inputRows) ok(() => assert(html.includes(label)))
  ok(() => assert(html.includes('not hedge sizes, contract payouts or trading profits')))
}
const fixturePath = process.argv.find(arg => arg.startsWith('--fixtures='))?.slice('--fixtures='.length)
if (fixturePath) {
  const { mkdir, writeFile } = await import('node:fs/promises')
  await mkdir(fixturePath, { recursive: true })
  await writeFile(`${fixturePath}/concise-default.html`, scenarioBriefConciseHtml(standard))
  await writeFile(`${fixturePath}/concise-max-context.html`, scenarioBriefConciseHtml(maximal))
  console.log(`Print fixtures written to ${fixturePath}`)
}
console.log(`${checks} total checks passed including condensed HTML escaping/completeness. Printed page count requires browser/PDF verification.`)

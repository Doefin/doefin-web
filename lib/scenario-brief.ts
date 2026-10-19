import { calculateExposure, exposureBounds, exposureDefaults, type ExposureInputs } from './exposure'
import { readToolQuery, toolQuery } from './tool-url-state'

export const scenarioAssumptions = [
  'Fixed duration: 2,016 target block intervals (about two weeks) per epoch. Each scenario holds difficulty constant for that duration.',
  'Fleet hashrate, BTC price and expected fees stay constant. Block subsidy is 3.125 BTC; network hashrate is inferred from starting difficulty and the 10-minute target.',
] as const

export const scenarioLimitations = [
  'Illustrative sensitivity calculation, not live data or a difficulty forecast. Selected cases have no assigned probability.',
  'Excludes uptime, pool fees, operating costs, changes in fleet capacity and subsidy changes. USD figures use the chosen BTC price.',
  'Production differences are not a hedge size, contract payout, trading profit or recommendation. Contract terms and settlement need a separate assessment.',
] as const

export const scenarioContextFields = [
  { key: 'preparedFor', label: 'Prepared for', maxLength: 80, multiline: false },
  { key: 'decision', label: 'Decision to discuss', maxLength: 240, multiline: true },
  { key: 'questions', label: 'Questions requiring review', maxLength: 360, multiline: true },
] as const

export type ScenarioContext = Record<typeof scenarioContextFields[number]['key'], string>

/** Context is document content only. It never participates in numeric URL state. */
export function normalizeScenarioContext(context: Partial<ScenarioContext> = {}): ScenarioContext {
  return Object.fromEntries(scenarioContextFields.map(({ key, maxLength, multiline }) => {
    const raw = typeof context[key] === 'string' ? context[key] : ''
    const cleaned = raw.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    const value = (multiline ? cleaned : cleaned.replace(/\n+/g, ' ')).trim()
      .slice(0, maxLength).replace(/[\uD800-\uDBFF]$/, '').trimEnd()
    return [key, value]
  })) as ScenarioContext
}

export function restoreExposureScenario(query: URLSearchParams): ExposureInputs {
  return readToolQuery(exposureDefaults, query, exposureBounds).values
}

function checkedInputs(inputs: ExposureInputs): ExposureInputs {
  const copy = { ...inputs }
  for (const key of Object.keys(exposureDefaults) as (keyof ExposureInputs)[]) {
    const [min, max] = exposureBounds[key]
    if (!Number.isFinite(copy[key]) || copy[key] < min || copy[key] > max) {
      throw new Error(`Scenario input ${key} is outside the calculator range`)
    }
  }
  return copy
}

function safeWebUrl(value: string): string {
  const url = new URL(value)
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Scenario links must use HTTP or HTTPS')
  return url.href
}

export const localScenarioNotice = 'This preview link works on this computer. Forward the downloaded brief to share the results.'
const localScenarioExportNotice = 'The scenario link points to a local preview on the originating computer. Forward the downloaded brief to share the results.'

/** Local preview links retain their actual origin; explain their sharing limit. */
export function isLocalScenarioUrl(value: string | null): boolean {
  if (!value) return false
  try {
    const hostname = new URL(value).hostname.toLowerCase().replace(/\.$/, '')
    return hostname === 'localhost' || hostname.endsWith('.localhost') ||
      /^127(?:\.\d{1,3}){3}$/.test(hostname) || hostname === '[::1]'
  } catch {
    return false
  }
}

/** Encode every input explicitly so a saved link survives future default changes. */
export function scenarioUrl(inputs: ExposureInputs, origin: string): string {
  const values = checkedInputs(inputs)
  const url = new URL('/v3/tools/difficulty-exposure', safeWebUrl(origin))
  const query = new URLSearchParams()
  for (const key of Object.keys(exposureDefaults) as (keyof ExposureInputs)[]) query.set(key, String(values[key]))
  url.search = query.toString()
  return url.href
}

export const formatScenarioBtc = (value: number) => `${value.toFixed(3)} BTC`
export const formatScenarioUsd = (value: number) => `$${Math.round(value).toLocaleString('en-US')}`
const signedBtc = (value: number) => `${value > 0 ? '+' : ''}${formatScenarioBtc(value)}`

/** Uses the calculator's arithmetic directly, before any display rounding. */
export function createScenarioBrief(inputs: ExposureInputs, preparedAt: string | null, url: string | null, context: Partial<ScenarioContext> = {}) {
  const values = checkedInputs(inputs)
  const results = calculateExposure(values)
  if (!Object.values(results).every(Number.isFinite)) throw new Error('Scenario results must be finite')
  if (preparedAt !== null && !Number.isFinite(Date.parse(preparedAt))) throw new Error('Invalid preparation date')
  const preparedDate = preparedAt === null ? null : new Date(preparedAt).toISOString().slice(0, 10)
  const normalizedContext = normalizeScenarioContext(context)
  const inputKey = toolQuery(exposureDefaults, values)
  return {
    inputs: values,
    results,
    preparedDate,
    scenarioUrl: url === null ? null : safeWebUrl(url),
    // Useful to reset action feedback only when the actual inputs change.
    inputKey,
    briefKey: JSON.stringify([inputKey, normalizedContext]),
    context: normalizedContext,
    contextRows: scenarioContextFields.flatMap(({ key, label }) => normalizedContext[key] ? [[label, normalizedContext[key]]] : []),
    inputRows: [
      ['Fleet hashrate', `${values.eh} EH/s`],
      ['Time horizon', `${values.epochs} epochs · approximately ${results.weeks} weeks`],
      ['Starting difficulty', `${values.diffT} T`],
      ['Lower difficulty case', `${values.low}%`],
      ['Higher difficulty case', `+${values.high}%`],
      ['Expected fees', `${values.fees} BTC / block`],
      ['Bitcoin price', `$${values.price.toLocaleString('en-US', { maximumFractionDigits: 20 })} / BTC`],
    ],
    scenarios: [
      { label: `${values.low}% difficulty`, production: formatScenarioBtc(results.atLow), difference: signedBtc(results.gainLow) },
      { label: 'Unchanged difficulty', production: formatScenarioBtc(results.base), difference: formatScenarioBtc(0) },
      { label: `+${values.high}% difficulty`, production: formatScenarioBtc(results.atHigh), difference: signedBtc(-results.lossHigh) },
    ],
    assumptions: scenarioAssumptions,
    limitations: scenarioLimitations,
  }
}

export type ScenarioBriefModel = ReturnType<typeof createScenarioBrief>

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[character]!))

/** Standalone printable HTML: no scripts, remote styles, fonts or tracking. */
export function scenarioBriefHtml(brief: ScenarioBriefModel): string {
  if (!brief.preparedDate || !brief.scenarioUrl) throw new Error('A dated scenario link is required for download')
  const link = escapeHtml(safeWebUrl(brief.scenarioUrl))
  const e = escapeHtml
  const contextHtml = brief.contextRows.length
    ? `<section class="context"><h2>Discussion context</h2><dl class="context-notes">${brief.contextRows.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>`
    : ''
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Doefin difficulty scenario brief</title>
<style>
@page{size:A4;margin:12mm}*{box-sizing:border-box}body{max-width:760px;margin:28px auto;padding:0 20px;color:black;background:white;font:13px/1.4 Arial,sans-serif;font-variant-numeric:tabular-nums}header{border-bottom:2px solid black;padding-bottom:12px}h1{font-size:25px;line-height:1.15;margin:6px 0}h2{font-size:14px;margin:16px 0 7px}p{margin:6px 0}.eyebrow{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.inputs{display:grid;grid-template-columns:1fr 1fr;gap:7px 22px;margin:0}.inputs div{break-inside:avoid}.inputs dt{font-size:11px}.inputs dd{margin:0;font-weight:bold}.context-notes{margin:0}.context-notes div+div{margin-top:7px}.context-notes dt{font-size:11px;font-weight:bold}.context-notes dd{margin:2px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}table{width:100%;border-collapse:collapse}th,td{text-align:left;padding:7px 6px;border-bottom:1px solid silver}th{font-size:11px}.result{padding:10px;border:1px solid black;margin-top:12px}.result strong{font-size:18px}ul{margin:6px 0;padding-left:18px}li{margin:4px 0}footer{font-size:11px;border-top:1px solid silver;padding-top:10px;margin-top:14px}a{color:inherit;overflow-wrap:anywhere}section,table,.result{break-inside:avoid}section.context{break-inside:auto}@media print{body{max-width:none;margin:0;padding:0;font-size:11px}h1{font-size:22px}h2{margin-top:12px}th,td{padding:6px}.inputs{gap:5px 20px}footer{font-size:10px}}@media(max-width:520px){.inputs{grid-template-columns:1fr}body{padding:0 14px}}
</style></head><body>
<header><p class="eyebrow">Doefin · Scenario brief</p><h1>Bitcoin difficulty and fleet production</h1><p>Prepared ${e(brief.preparedDate)} UTC · Illustrative — not live data</p></header>
${contextHtml}
<section><h2>Inputs used</h2><dl class="inputs">${brief.inputRows.map(([label, value]) => `<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl></section>
<section><h2>Production over the selected horizon</h2><table><thead><tr><th>Difficulty scenario</th><th>Production</th><th>Versus unchanged</th></tr></thead><tbody>${brief.scenarios.map(row => `<tr><td>${e(row.label)}</td><td>${e(row.production)}</td><td>${e(row.difference)}</td></tr>`).join('')}</tbody></table>
<div class="result"><strong>${e(formatScenarioBtc(brief.results.spreadBtc))}</strong> between the two selected cases<br>${e(formatScenarioUsd(brief.results.spreadUsd))} at the chosen BTC price. This is a production difference, not a contract payout.</div></section>
<section><h2>Assumptions</h2><ul>${brief.assumptions.map(item => `<li>${e(item)}</li>`).join('')}</ul><h2>Limitations</h2><ul>${brief.limitations.map(item => `<li>${e(item)}</li>`).join('')}</ul></section>
<footer><p><strong>Reopen these inputs:</strong> <a href="${link}">${link}</a></p>${isLocalScenarioUrl(brief.scenarioUrl) ? `<p>${e(localScenarioExportNotice)}</p>` : ''}<p>HTML brief · Open in a browser, then print or save as PDF. Values shown to three decimal places in BTC; calculations use unrounded inputs.</p></footer>
</body></html>`
}

export function scenarioDiscussionHref(brief: ScenarioBriefModel, recipient: string): string {
  const body = [
    'I would like to discuss this Bitcoin difficulty production scenario.',
    `Prepared: ${brief.preparedDate ?? 'today'} UTC`,
    '',
    ...(brief.contextRows.length ? ['Discussion context', ...brief.contextRows.flatMap(([label, value]) => [label + ':', value, ''])] : []),
    ...brief.inputRows.map(([label, value]) => `${label}: ${value}`),
    '',
    ...brief.scenarios.map(row => `${row.label}: ${row.production}; versus unchanged: ${row.difference}`),
    `Difference between selected cases: ${formatScenarioBtc(brief.results.spreadBtc)} (${formatScenarioUsd(brief.results.spreadUsd)} at the chosen BTC price).`,
    '',
    'This is an illustrative production scenario, not a hedge size or contract payout.',
    brief.scenarioUrl ?? '',
    ...(isLocalScenarioUrl(brief.scenarioUrl) ? ['', localScenarioExportNotice] : []),
  ].join('\n')
  return `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent('Discuss a Doefin difficulty scenario')}&body=${encodeURIComponent(body)}`
}

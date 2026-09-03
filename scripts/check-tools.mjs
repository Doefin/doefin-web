/**
 * Guards the tool pages against the two ways this design decays.
 *
 * 1. Drift. A hint is keyed to a slider label. Rename the slider and the hint silently
 *    renders nowhere — no error, no crash, just help that vanished.
 * 2. Creep. The whole point of the redesign was that 5,000 words of help on a
 *    calculator page is 5,000 words nobody reads. Without a gate, the copy grows back
 *    a sentence at a time and nobody notices until it is long again.
 *
 * Also checks that every preset value can actually be reached by its slider — a value
 * outside min/max or off-step is clamped by the browser, so the scenario the button
 * loads is not the scenario its label describes.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const read = (p) => readFileSync(join(ROOT, p), 'utf8')

const TOOLS = {
  'hosting-effective-rate': 'components/tools/HostingCalculator.tsx',
  'difficulty-exposure': 'components/tools/ExposureSizer.tsx',
  'fleet-payback': 'components/tools/PaybackModel.tsx',
}

/** Word caps, by dotted path. Over the cap warns; 25% over fails. */
const CAPS = {
  blurb: 30,
  useIf: 16,
  notFor: 16,
  'steps[]': 12,
  'inputHints[].means': 20,
  'inputHints[].whereToFind': 22,
  'inputHints[].typical': 10,
  'resultHints[].hint': 24,
  'presets[].name': 4,
  'presets[].note': 14,
  'watchOut[]': 24,
}

const words = (s) => s.trim().split(/\s+/).filter(Boolean).length

/** Slider ranges, straight out of the component source. */
function slidersOf(src) {
  const out = new Map()
  // <Slider id="x" label="…" … min={a} max={b} step={c}
  const jsx =
    /<Slider\s+id="([^"]+)"\s+label="([^"]+)"[\s\S]{0,240}?min=\{(-?[\d.]+)\}\s+max=\{(-?[\d.]+)\}\s+step=\{([\d.]+)\}/g
  for (const m of src.matchAll(jsx)) {
    out.set(m[2], { key: m[1], min: +m[3], max: +m[4], step: +m[5] })
  }
  // The hosting tool drives its sliders from a FIELDS table instead.
  const table = /\{ key: '([^']+)', label: '([^']+)', unit: '[^']*', step: ([\d.]+), max: ([\d.]+)/g
  for (const m of src.matchAll(table)) {
    out.set(m[2], { key: m[1], min: 0, max: +m[4], step: +m[3] })
  }
  return out
}

const micro = read('content/tool-micro.ts')
const registryIsEmpty = /export const TOOL_MICRO: Record<string, ToolMicro> = \{\}/.test(micro)
if (registryIsEmpty) {
  console.error('✗ content/tool-micro.ts has no entries — the tool pages will render without help.')
  process.exit(1)
}

// Run under --experimental-strip-types; see the npm script.
const { TOOL_MICRO } = await import('../content/tool-micro.ts')

const errors = []
const warnings = []

for (const [slug, componentPath] of Object.entries(TOOLS)) {
  const m = TOOL_MICRO[slug]
  if (!m) {
    errors.push(`${slug}: no entry in TOOL_MICRO`)
    continue
  }
  const src = read(componentPath)
  const sliders = slidersOf(src)

  // ── 1. Every hint is attached to a slider that exists ────────────────────
  for (const h of m.inputHints) {
    if (!sliders.has(h.label)) {
      errors.push(
        `${slug}: inputHints label ${JSON.stringify(h.label)} matches no Slider in ${componentPath}`,
      )
    }
  }
  // ── 2. Every slider that asks for a hint gets one ────────────────────────
  for (const [label] of sliders) {
    const asks = src.includes(`hintFor(SLUG, '${label}')`) || src.includes('hintFor(SLUG, f.label)')
    const has = m.inputHints.some((h) => h.label === label)
    if (asks && !has) errors.push(`${slug}: slider ${JSON.stringify(label)} has no inputHint`)
  }
  // ── 3. Every result hint is actually rendered ────────────────────────────
  for (const r of m.resultHints) {
    if (!src.includes(`resultHintFor(SLUG, '${r.figure}')`)) {
      errors.push(
        `${slug}: resultHints figure ${JSON.stringify(r.figure)} is never read by ${componentPath}`,
      )
    }
  }

  // ── 4. Presets land on reachable slider values ───────────────────────────
  const byKey = new Map([...sliders.values()].map((s) => [s.key, s]))
  // State keys include inputs with no slider, which are settable by URL only.
  const defaultsBlock =
    src.match(/const DEFAULTS = \{[\s\S]*?\n\}/)?.[0] ??
    src.match(/const DEFAULTS = [^\n]*\}/)?.[0] ??
    ''
  const stateKeys = new Set([
    ...byKey.keys(),
    ...[...defaultsBlock.matchAll(/(\w+):\s*-?[\d.]/g)].map((x) => x[1]),
  ])

  for (const p of m.presets) {
    for (const [k, val] of Object.entries(p.values)) {
      if (!stateKeys.has(k)) {
        errors.push(`${slug}: preset "${p.name}" sets unknown key "${k}"`)
        continue
      }
      const s = byKey.get(k)
      if (!s) continue // URL-only input, no slider to clamp it
      if (val < s.min || val > s.max) {
        errors.push(
          `${slug}: preset "${p.name}" sets ${k}=${val}, outside the slider range ${s.min}–${s.max}`,
        )
      }
      const steps = (val - s.min) / s.step
      if (Math.abs(steps - Math.round(steps)) > 1e-6) {
        errors.push(
          `${slug}: preset "${p.name}" sets ${k}=${val}, which is off the ${s.step} step — the browser will move it`,
        )
      }
    }
  }

  // ── 5. Length ────────────────────────────────────────────────────────────
  const checks = [
    ['blurb', m.blurb],
    ['useIf', m.useIf],
    ['notFor', m.notFor],
    ...m.steps.map((s) => ['steps[]', s]),
    ...m.inputHints.flatMap((h) => [
      ['inputHints[].means', h.means],
      ['inputHints[].whereToFind', h.whereToFind],
      ['inputHints[].typical', h.typical],
    ]),
    ...m.resultHints.map((r) => ['resultHints[].hint', r.hint]),
    ...m.presets.flatMap((p) => [
      ['presets[].name', p.name],
      ['presets[].note', p.note],
    ]),
    ...m.watchOut.map((w) => ['watchOut[]', w]),
  ]
  for (const [path, text] of checks) {
    if (!text) continue
    const cap = CAPS[path]
    const n = words(text)
    if (n > cap * 1.25) {
      errors.push(`${slug}: ${path} is ${n} words, cap ${cap} — "${text.slice(0, 60)}…"`)
    } else if (n > cap) {
      warnings.push(`${slug}: ${path} is ${n} words, cap ${cap}`)
    }
  }
}

for (const w of warnings) console.warn(`warn  ${w}`)
if (errors.length) {
  for (const e of errors) console.error(`✗ ${e}`)
  console.error(`\n${errors.length} problem(s) in the tool microcopy.`)
  process.exit(1)
}
console.log(
  `\nTool microcopy: hints match every slider, presets land on reachable values, nothing is over length.`,
)

# V3 tools index

## Task and boundaries

Help a mining operator choose the calculator that answers their current question. Before opening a tool, they should recognise the relevant inputs and the form of its output. Every calculator and guide destination already exists. Use the three tools returned by `previewTools()`; no additional calculators, usage claims, live network data, predicted savings or returns. Preserve V1/V2 and all calculator detail pages and formulas.

## Visual direction

The user-rejected baseline is the current `/v3/tools`: a large generic introduction, three identical text link cards and a prose explanation. Baseline captures are in the calling chat's `outputs/v3-tools-index/before-{desktop,mobile}.png`. Its equal cards do little to explain what makes the calculations different.

Proposed direction: an operator's decision desk, within the established dark Manrope brand. Compact opening choices offer immediate routes to cost, production and recovery. The broad hosting panel pairs an operational question with a clearly labelled quote-to-effective-rate specimen. Two complementary panels below show a numerical production comparison and a conceptual capital-recovery ledger. Their different visual forms explain their different jobs. Cost → production → recovery is an explanatory sequence, not a claim that every visitor must start with hosting.

Keep the main action before each specimen on mobile. Display input requirements, expected output and a practical guide beside the corresponding tool. Use real links, server-rendered content, visible focus, readable units, tabular numbers and content-driven stacking. No filters, imitation form fields, decorative financial charts or fake switches.

## Evidence and scope

Hosting specimen reproduces the default source arithmetic: `0.065 × (1 + .05 + .03) ÷ (1 − .04 − .06) ÷ (1 − .02)`, rounded to four decimals. Show its assumptions beside the result and identify the pool adjustment as a comparison equivalent, not an invoice. Production specimen uses `getExposureTutorial()` and its actual derived results, with the sample inputs shown. Recovery is a static explanation of the existing model's cash-flow logic, without a fabricated projection. The three existing guide article titles come from `allGuides()`.

Implementation owns only `components/v3/V3ToolsIndex.tsx` and this document. Parent integrates the V3 route and performs production build, rendered desktop/mobile inspection, no-JS/keyboard/link checks and independent critique. Visual quality and user acceptance remain separate from those technical checks.

## Production verification

Production build passed. Parent inspected desktop composition, the narrow first viewport and all three 320px specimen panels. Independent rendered review found no consequential issue in calculator discovery, distinct input/output jobs or calculator/guide hierarchy; this is internal review, not user acceptance. Parent subsequently aligned the two hosting prices on narrow screens and added explicit rounding disclosure to the exposure example, then rerendered all six widths.

320/390/640/768/1024/1440px checks passed: one H1, no document/internal text clipping, no duplicate IDs and an initial calculator action. All three calculators and guides remain linked; actual keyboard calculator navigation and guide clicks reach the existing forms/titles. The hosting specimen matches the current source defaults and actual calculator result (0.0796). The exposure sample-load link restores all tutorial values and produces its displayed result. Native links remain available without JavaScript. Route/metadata checks and 162-page SEO validation passed. No browser page errors were observed. All 254 protected existing files outside the index/integration scope remained unchanged. Local preview only.

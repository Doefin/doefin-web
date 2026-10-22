# V3 data field guide

## Brief

- User task: understand what a Bitcoin difficulty level, projected change, range, hashrate estimate, and accuracy metric mean; open the corresponding explanations or inspect the authored records.
- Page role: Data is a field guide to reading metrics and their dataset structure. Research evaluates a comparison and reproduces calculations. Do not duplicate Research’s complete sample table or arithmetic here.
- Feedback: user rejected the former Data hub entirely. The rejected baseline was a narrow heading and list of links with no visible data or explanation at the point of entry. Existing dark palette and Manrope are established brand constraints, not approval of the new composition.
- Provisional visual target: an annotated mining-data reading desk. A dominant difficulty specimen juxtaposes a level and a projected change. A proportionally accurate range diagram crosses zero; a smaller hashrate specimen introduces the observation-window question. Quiet blue surfaces frame data, caution identifies synthetic status, and a full-width record table supports inspection.
- Alternatives considered: a dataset-first archive with a large record table versus a metric-first annotated specimen. Choose the specimen provisionally: only three authored records exist, and an archive-first composition could imply a measured historical feed. The visible record comparison remains useful below it.
- Content boundaries: all values come from the existing `@/content` barrel. Preserve authored dates, units, values and destinations. All examples are synthetic, including dated records; the range has no measured confidence level. Reference dates do not make the data current. No provider rankings, live state, inferred observation window, filters, fake controls, or invented history.

## Implementation

- Main task links appear before the specimens, including on mobile. Every link works without JavaScript. No new interactive control needs state.
- The range’s endpoints, zero and projection are derived from existing difficulty values. The same numbers and interpretive limits appear as text. The diagram is a range, not a trend or probability density.
- Each record displays its target, forecast reference date, forecast, authored outcome and outcome date. Missing outcomes say “Not included,” not “pending.” The records are independent of the headline specimen; no date reconciliation or source rewrite is attempted.
- The five-column record table reflows to labeled pairs on narrow screens. Numeric content uses tabular figures. Existing global focus and reduced-motion behavior apply; no new animation is introduced.
- The accuracy route explains units and interpretation, then sends users to Research for evaluation criteria or reproducible arithmetic. It does not reproduce the sample table.

## Verification boundaries

- Baseline inspected at desktop and mobile from `outputs/v3-data/before-{desktop,mobile}.png`.
- Local typecheck and diff whitespace checks run before parent integration. The parent owns production build, rendered critique, navigation, no-JS, keyboard, reduced-motion and responsive validation. Passing source checks alone is not rendered or user acceptance.

## Production critique follow-up

- The first production render exposed clipped difficulty figures at 320px and illegibly scaled SVG labels. Reduced mobile stat type and spacing, keeping complete values and units on one line. Replaced SVG text with fixed-pixel HTML keys for zero and the projection.
- The opening delayed the useful figures. Hid the breadcrumb on narrow screens and shortened the intro/disclosure while preserving synthetic provenance and early detail links. Parent owns the next production re-render.

## Final combined verification

Parent inspected final production desktop/mobile Research hub, comparison guide, calculation walkthrough, Data hub and accuracy guide. Independent reviewer found the roles distinct and no consequential remaining visual/UX issue. This is internal review, not user acceptance.

Production build, V3 route/metadata checks and 162-page SEO validation passed. Ten Research/Data pages were exercised at 320, 390, 640, 768 and 1440px: one H1, no document overflow, duplicate IDs or browser page errors. All internal V3 destinations responded successfully; anchor targets cleared the fixed header. Report sections and paragraphs appear once, with one source sentence corrected to reference the now-linked calculation. The separate walkthrough’s five rows/errors/MAE match source, and its actual CSV download passed. Difficulty/hashrate/record figures and missing-outcome state match authored source. Native links render without JavaScript, keyboard report navigation works, and V1/V2 Research plus prior Academy/blog/glossary remain reachable.

Data-specific probes verified no internal numeric/table clipping at all five widths and source figures visible in the initial narrow viewport after fixes. SVG labels were replaced with fixed-size HTML legend text. All 67 protected files remained unchanged except the single documented research sentence. Local preview only; no deployment.

## Detail-page completeness revision

User feedback: the Data details were plain and incomplete. Preserve the current hub composition; restore useful depth on the destination pages through source comparison, not by carrying forward unsupported legacy claims.

### Reference map

| Route | V1 reference | Previous V3 gap | Revised V3 representation |
| --- | --- | --- | --- |
| `/data/difficulty` | `app/v1/data/difficulty/page.tsx`; `EpochProgress`; `NetworkChart` and `SeriesTable` | Four-field table, brief range paragraph and record links | Annotated level/change/range; derived projected level and endpoint levels; supplied input fields; observation/method interpretation; separate 26-point difficulty step chart and complete HTML table; record cards |
| `/data/hashrate` | `app/v1/data/hashrate/page.tsx`; shared network chart/table | One estimate and generic uncertainty paragraphs | Snapshot with units and absent timestamp/window; how a rate is inferred; arithmetic-only one-day/seven-day spreads with rounded endpoints; separate 26-point implied-hashrate chart/table; fleet vs network distinction |
| `/data/difficulty/epoch/[height]` | `app/v1/data/difficulty/epoch/[height]/page.tsx` for all three fixtures | Omitted before/after levels, interval membership and sibling navigation | Dated forecast/outcome comparison; signed interpretation and absolute error; range markers; before, implied and after levels; arithmetic; complete dates/provenance; sibling cards |
| `/data/scoreboard` | `app/v1/data/scoreboard/page.tsx`; empty provider table with zero measured epochs | Definitions without a tangible score or error profile | Five synthetic absolute-error bars and derived MAE; source-based measured count remains zero; error/coverage/width/count interpretation; one authored interval-membership example; fair-comparison criteria; Research links for full pairs, arithmetic and CSV |

V2 has **no** independent `app/v2/data` route modules. Browser navigation to `/v2/data/difficulty` returns a 404. `app/v2/research/page.tsx` sends its “View original data pages” link to `/data`, reusing the original library. V2 therefore supplies research presentation context, not another set of Data detail content. No new V2 routes are introduced.

### Evidence retained and claims not represented

- `@/content` remains the server-side content boundary. Source modules and all V1/V2 files remain untouched.
- Difficulty: `127.48 T`, `+2.31%`, authored endpoints `−2.4%…+7.0%`, target `913,248`, reference `912,904`, source timestamp `2026-08-24T14:00:00Z`, count `1,264`, stored interval count `2,015`, and the supplied fit-window label are visible. Projected level `130.42 T` and endpoint levels are explicitly derived arithmetic.
- Do not restore the legacy “95%” confidence claim, `18%` wrong-direction probability or the assertion that ranges were fitted to measured historical errors. The source names `band95` and `probSignWrong` do not provide that evidence.
- Do not restore a countdown or verified progress meter. Target minus reference is `344`; stored interval count minus observations is `751`. A native provenance disclosure explains the mismatch after the primary content.
- Hashrate: snapshot `912 EH/s` at `912,904`; no timestamp or observed window is supplied in that object. The previous shared date was actually in the separate difficulty fixture. The spreads `16.3%` and `6.2%` are now arithmetic-only authored examples around 912, producing nearest-integer endpoints `763–1,061` and `855–969 EH/s`. No calibrated confidence or claim about whether real short-term moves are signal/noise is asserted.
- The 26-point series has its own authored dates, heights and values. Each detail plots only its own unit, with zero baseline, HTML labels and every source row in a native disclosure. No Bitcoin-price overlay or cross-unit axis is needed for the reading task.
- The series ends at `913 EH/s` and block `913,248` on `17 August 2026`, distinct from the hashrate snapshot and epoch dates. Each relevant page explains the fixtures cannot be joined into a verified timeline. The target-time formula is the existing `networkEHFromDifficulty` helper, not a new forecast service.
- Epoch before/after levels and realised changes remain exactly authored. Completed record errors are `0.72 pp` and `1.32 pp`; their outcomes happen to lie inside the authored endpoints. This is membership arithmetic, not interval calibration. The forecast-only record has no outcome, error, after level or outcome date; it never says “pending.”
- Scoreboard source has zero measured epochs and no provider scores. The five synthetic Research pairs have MAE `1.00 pp`; the error-only profile illustrates that metric without repeating the Research forecast/outcome table. No provider ranking, service signup, performance advantage or immutable archive is promised.

### Detail visual and interaction contract

A shared wide detail shell provides a compact introduction, clear synthetic status, Data navigation and a primary focal example before method prose. Difficulty uses the established annotated specimen; Hashrate leads with its rate; dated records lead with forecast/outcome; Accuracy leads with the synthetic error profile beside measured-data availability. Existing dark tokens, Manrope, panel radii and tabular figures remain in use.

All charts and values render on the server. Plot labels remain HTML at readable CSS sizes, avoiding scaled SVG text. Native `<details>` reveal complete source rows and secondary provenance without JavaScript; narrow tables reflow into labeled pairs. Anchors use `scroll-mt-28` to clear the sticky header. The hub specimen’s default rendering is preserved; only its detail embedding changes the self-link into an input-section anchor.

Source comparison and baseline: V1 rendered difficulty, hashrate, scoreboard and all three record pages were inspected in the browser; V2 Research and Data-route absence were verified. Previous V3 details were inspected from saved desktop/mobile production captures. Parent owns final production re-render, viewport/no-JS/keyboard checks and independent critique. Typecheck and whitespace validation do not establish visual acceptance.

### Detail production verification

Final production build passes. Parent inspected desktop Difficulty/Accuracy and mobile Difficulty, Hashrate, completed record and missing-outcome views, plus native source table renders. Independent rendered review found no consequential remaining issue in restored completeness, source distinctions or mobile presentation; this is not user acceptance.

All seven Data pages passed 320/390/640/768/1024/1440px checks (42 states): single H1, no document/internal text clipping, no duplicate IDs, correct canonical/noindex metadata and source classification. Both chart pages retain every one of the 26 source rows and meaningful accessible charts. Snapshot values, window endpoints, before/after levels, record errors and all three record states match source. Every internal V3 destination responded successfully; anchors clear navigation; keyboard navigation and no-JavaScript rendering work. Native series disclosures open/close, with keyboard and JavaScript-disabled checks repeated after the final tabular-number styling correction at 320/390/640/1440px. No clipping remained in their numeric cells.

V3 route/metadata and 162-page SEO checks passed. All 245 protected files outside the Data scope remained unchanged, including source datasets, V1/V2 and previously revised Research/Academy/blog/glossary content. Local preview only.

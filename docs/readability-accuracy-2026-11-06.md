# Forecast accuracy readability pass, 6 Nov 2026

Scope: `/data/scoreboard`, implemented in `components/v3/V3Scoreboard.tsx` and `components/v3/IllustrativeComparison.tsx`. Branch: `codex/readable-content-refinements`. Codex editorial pass using the doefin-humanise procedure and pinned brand v0.2.0 (`936bc5c`). Ready for Fardin’s reading and independent evaluation; browser and integration verification belong to the parent task.

## Before and after

| Decision | Before | After | Reason |
| --- | --- | --- | --- |
| Change | Five-pair MAE exercise, then four definition cards, then a separate A/B/C comparison, then a third single-block range example | One model A row from the existing A/B/C dataset, its two scored errors, the same A/B/C summary, then the A/B trade-off | A reader follows one set of inputs through the whole explanation. Matteo habits 3 and 6: precision and saying it once. |
| Change | Metric definitions separated from the examples | Absolute error beside the selected row; average, coverage, width and count beside their summary | Explain each term when it is needed. |
| Cut from primary | Separate five-pair bar chart and separate range example | Five-pair exercise remains reachable through the labelled optional research link. The third example’s source data remains unchanged. | Remove competing examples without removing data or the arithmetic exercise. |
| Keep | Complete authored comparison inputs in native details | Every model’s forecasts, ranges, outcomes, missing status, target heights and input heights remain in native details | Readers can inspect the source rows; all content is server-renderable HTML. |
| Consolidate | Repeated measured-status inventory and scattered evidence limits | One measured-comparison section followed by the existing archive/download component | Keep distinct limits while avoiding repeated unavailable-status cards. |

The primary lesson remains visible. Optional source rows and the separate arithmetic exercise have explicit labels, applying [NN/G’s progressive disclosure guidance](https://www.nngroup.com/articles/progressive-disclosure/). Plain definitions and concrete verbs follow the requested [GOV.UK writing guidance](https://www.gov.uk/guidance/content-design/writing-for-gov-uk).

## Facts and qualifiers: final home

| Retained fact or limit | Final home |
| --- | --- |
| Values are synthetic; no actual provider performance is measured | Page notice and comparison label; fictional-model introduction |
| Three fictional models share two invented outcomes; third target has no outcome | Comparison introduction; summary count and optional full records |
| Common assumed lead time of 1,008 blocks | Comparison introduction and each optional source record |
| Absolute error ignores direction and uses percentage points | Selected model A row at block 911,232 |
| Mean error weights each scored pair equally and hides direction and individual misses | “Then average the scored rows” |
| Coverage means outcome inclusion; mean width means average range width | Summary introduction |
| Missing outcomes are excluded from all scores and counted separately | Table caption, scored/missing column and interpretation |
| Lower point error can accompany narrower ranges and lower coverage | “Compare the trade-off” |
| Wide ranges can tell less; narrow ranges need enough inclusion for stated confidence | Interpretation beside the comparison |
| Two invented outcomes do not establish a better model or calibration; calibration needs many comparable recorded forecasts | Interpretation beside the comparison |
| No captured forecasts or published record pages back the authored examples | Optional complete-records detail |
| Zero observed adjustment periods scored; measured provider errors and coverage unavailable | Measured-comparison section, using existing `scoreboard.epochsScored` |
| Network observations are not forecasts and do not supply forecast errors | Measured-comparison section with historical research link |
| Same targets/outcome definitions, comparable lead times, later information advantage | Measured-comparison section |
| Timestamps, source inputs, method versions, evaluated dates, scored and missing counts, exclusion rules including large misses | Measured-comparison section |
| Small/selected samples may not represent future conditions; measured errors cannot guarantee forecasts, trading or fleet production | Measured-comparison section |
| Five-pair exercise and CSV remain available; it has no forecast ranges | Optional next-step link to unchanged `/research/evaluating-a-forecast` |
| Observed dataset downloads, capture date and forecast archive link | Unchanged `ResearchArchiveSummary compact` child |
| Full-loss footer | Unchanged shared `components/v3/Chrome.tsx` |

## Numerical replay

All inputs and the existing summary helper in `content/v3-forecast-comparison.ts` are unchanged. Both components import comparison content through `@/content`. Added worked-row figures are direct arithmetic from these existing values, not new source data, forecasts or outcomes. No scoring formula or ranking was added.

| Fictional model | Scored / missing | Absolute errors (pp) | Mean absolute error (pp) | Coverage | Scored range widths (pp) | Mean width (pp) |
| --- | --- | --- | --- | --- | --- | --- |
| A | 2 / 1 | 1.32, 0.72 | 1.02 | 100% | 6.90, 6.00 | 6.45 |
| B | 2 / 1 | 0.44, 0.96 | 0.70 | 50% | 2.00, 1.00 | 1.50 |
| C | 2 / 1 | 2.06, 1.84 | 1.95 | 100% | 10.00, 10.00 | 10.00 |

The selected A row is block 911,232: forecast +1.12%, outcome +1.84%, absolute error 0.72 pp. The outcome lies inside −1.90% to +4.10%; width is 6.00 pp. The optional records preserve all nine original rows and the same input-height subtraction.

## Checks completed

- Focused numerical replay checked all three summaries, count/missing values and the selected row’s absolute error, width and inclusion. The data/helper file was compared byte-for-byte with `HEAD`.
- TypeScript transpilation reported no syntax diagnostics for the two changed TSX modules. A scoped React server-render smoke check used their actual components and data, with wrapper/link/archive stubs. It checked the retained anchor IDs, native details, complete optional-record label, research-exercise link and removal of the competing primary-data imports. This is not full application runtime or typecheck evidence.
- Final metadata and rendered owned prose, including closed-details content, were extracted and checked with `python3 vendor/doefin-brand/tools/check_copy.py /tmp/doefin-accuracy-prose.txt --channel=web`: **0 CUT, 0 STYLE, 1 CHECK**.
- `npm run check:brand`: vendor v0.2.0 intact; **0 CUT, 0 STYLE, 1 CHECK** on the shared working tree at check time.
- `git diff --check` passed for the two implementation files.
- `git diff --exit-code HEAD` passed for comparison data/helper, `content/sample-data.ts`, the five-pair exercise component, archive child, shared footer and layouts. No protected About/Block subsidy, seed, vendor, CMS or shared control edits were made by this package.

Exact CHECK retained: **“Return to the data field guide”**, `components/v3/V3Scoreboard.tsx`, next-step navigation. The checker flags **“Return”** as return/profit language. This existing label is a navigation action, not a financial claim. It is retained and listed for Matteo; no new financial or performance claim is asserted.

Meaningful anchors remain: `sample-error-title` now identifies the continuing worked row; `illustrative-comparison-title` identifies the full comparison; `prospective-archive` remains in the unchanged archive child. No chart was added; every displayed figure is HTML text/table content. Full build, global typecheck and browser verification were intentionally left to parent integration. No commit was made.

## Frozen implementation for independent evaluation

SHA-256 at handoff:

- `components/v3/V3Scoreboard.tsx`: `2a7663e2a97662d8bef957ec8c2dabc3a3f7ee667e278c01294c61b9f3a5494d`
- `components/v3/IllustrativeComparison.tsx`: `edb6aff776f5cd76be42125c018d66a46665f3e1591db36a765b51e283c5d119`
- Unchanged comparison data/helper: `eebcbcc14d8d18c8cc732169e15c87efdaf108c2d468cbff25dfd7664d78b83f`

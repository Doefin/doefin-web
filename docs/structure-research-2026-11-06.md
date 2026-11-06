# Research and data structure pass, 6 Nov 2026

Codex implementation and editorial proposal, ready for Fardin and independent review. No CMS write, publication, commit or push was performed. Source edits alone do not change the three published CMS documents.

The source was reviewed with the Doefin humanise skill and brand v0.2.0, commit `936bc5c25899ee237bb5a4ecaae54bc192038cf4`. The editorial decisions apply Matteo’s habits 3 (precision), 6 (say it once) and 7 (verifiable evidence), alongside his E24/E25 cuts of repeated explanation.

## Baseline and proposal

Current published baseline: `work/brand-copy-validation/structure-current-published-2026-11-06.json`, its `.result` array. These are the documents after the previous 31 corrections were published, not migration seeds or older rewrite files.

Proposal: `studio/rewrites/2026-11-06-structure-research.json`. It contains 19 exact before/after `Change` rows for three documents, with keyed section paths. Paragraph arrays are rebuilt where necessary. All remain nonempty. Document IDs/types, section keys/IDs, slugs, dates, titles, references and existing SEO summaries remain unchanged. The two report summaries change within the 160-character limit.

| Page | Before | After |
| --- | --- | --- |
| Research index | Intro warning, observed dataset with archive warning, report cards, locally labelled calculation, resource links | Cuts the repeated intro warning. The dataset explains the observed/forecast distinction; the calculation keeps its local synthetic labels. The method link names block timing. |
| Data index | Intro explains sources, historical archive, current readings, another empty-archive heading and status, examples | Current readings first, then sourced historical data, then synthetic dated rows. The status keeps the exact count of 0, while the heading teaches what the rows show. |
| Scoreboard | Full observed-data findings before the error example; four metric definitions each with another checklist; point/range explanations; four further comparison checks | Error example and unavailable measured evidence first; definitions once; unchanged fictional-model table; a numerical interpretation; one range-scoring example; one measured-evidence section; compact dataset download/citation panel. |
| Methodology | Heading promises calculation, but the first section mainly lists inputs and the remaining sections assess evidence | Heading honestly promises assessment. First section explains observed pace, estimated full-period duration and the adjustment rule. The remaining sections cover repeatability, range testing and available evidence. |
| Comparison guide | Repeated same-target/time guidance, error and range definitions, synthetic limits | One complete original-record section; point errors and ranges explain different results; one final section states what the example cannot establish. |
| Observed report | Findings followed immediately by caveats; arithmetic includes checksums; provenance includes versioning; final section repeats a full provider-evaluation checklist | Findings lead without an unrelated forecast checklist. Arithmetic stays concrete. Source, checksums, version and citation share one section. Final section consolidates inference limits and independent publication proof; the provider checklist lives in the linked comparison guide. |

The report template removes the extra hard-coded lead above the CMS summary. It retains the full summary and all section navigation. The observed report gains a link to the comparison guide so the relocated record requirements remain reachable.

## What the reader now learns

The methodology describes a simple pace-based forecast, without claiming to specify a Doefin algorithm. Bitcoin’s adjustment responds to measured block timing. Extending the pace observed so far estimates the full period’s duration; using that duration in the adjustment rule projects difficulty. Future blocks may arrive at another pace, so both the difficulty estimate and calendar date can change. Protocol limits are stated beside this simplified rule. The repeatability section requires the exact block intervals counted, capture time, formula, constraints, rounding and method version.

This mechanism is supported by the current published `glossary-mining-difficulty` and `glossary-difficulty-adjustment` body/FAQ fields. No glossary definition was edited. It is an explanation of the mechanism, not an exact production implementation. The protocol’s timestamp-interval nuance remains a requirement on a published method, with the detailed explanation in the existing difficulty-adjustment glossary FAQ.

The scoreboard interprets the unchanged synthetic table using the existing `summarizeIllustrativeProvider` helper. Model B has mean absolute error **0.70 pp**, versus **1.02 pp** for model A, while range inclusion is **50%** versus **100%**. Mean widths are **1.50 pp** versus **6.45 pp**. The point estimates can be closer while the narrower ranges miss more outcomes. The prose states that two invented outcomes cannot establish a better model. No models, inputs, scores, rankings or mathematics change.

## Remaining homes for facts and qualifications

| Unique fact or limit | Remaining home |
| --- | --- |
| Current difficulty and estimated network hashrate, timestamps, source status, freshness/failure handling | Existing current-reading panels; reordered on `/data`, with no fetching or status logic edits |
| Dated synthetic rows; dates/changes/target blocks; missing outcome means an incomplete example, not a pending live adjustment; rows have no individual pages | `/data#sample-records`, unchanged table bindings and local synthetic captions |
| No published history linking forecasts, ranges and outcomes; exact 0 published records | `/data#sample-records` explanatory paragraph/status; full archive disclosure and observed-report final section |
| 25 observations, 11 increases, 14 decreases, dates, 3.75% mean absolute change, −11.16% minimum and 14.73% maximum | Observed-report findings retain original strings, signs, units and dates; shared full archive panel retains its dynamic summary |
| Historical changes differ from forecast errors and synthetic values | Full archive panel; scoreboard evidence panel; observed-report scope section; local synthetic labels on all example figures |
| Fixed one-year snapshot, not live; mempool.space source and capture date; no independent Bitcoin-node check | Full archive panel and observed report’s method/provenance sections; compact panels keep source and capture date |
| 26 source boundaries, sorting, 2,016-block spacing, first boundary excluded, 25 computed changes | Observed-report arithmetic section, unchanged inclusion rules |
| Exact change formula; provider rounded-ratio exclusion; full difficulty precision; rounding only at display; equal weighting of absolute changes | Observed-report arithmetic section; unchanged implementation in `lib/research-data.ts` |
| Source response exactly as received; first/last retained block details checked against the same provider; internal consistency is not independent verification | Observed-report provenance section; original-source download link retained |
| Rolling API window selects observations; no selection of profitable periods | Observed-report provenance section |
| Open findings/downloads without email; version 1.0.0; stable identifier; citation manifest; new version for updates | Observed-report provenance/citation section and compact download panel |
| SHA-256 checksums for source and CSV/JSON detect changes; no proof of external publication time or immutable hosted files | Observed-report provenance/citation section; methodology evidence section keeps the archive-time/immutability distinction |
| No DOI registered or deposited; DOI is a persistent research identifier | Observed-report provenance/citation section |
| No captured provider predictions, independent proof of publication before an outcome or market listing; cannot create proof retrospectively | Full archive detail and observed-report final section; comparison-guide original-record section |
| Current difficulty, target block, observed block heights/timestamps, capture time, formula, constraints, exact counted intervals, rounding and version needed for repeatability | Methodology first and second sections |
| Irregular blocks; extrapolation assumes observed pace continues; projected difficulty/date may change; future value is not measured | Methodology first section |
| Projected percentage change, observed difficulty level and market-implied probability differ | Methodology second section, retained paragraph |
| Range calculation, fitting period, separate testing period, original publication times, width and inclusion | Methodology range section |
| Synthetic ranges are unfitted and untested against a stated confidence level; no demonstrated future inclusion rate or probability of direction change | Methodology range section |
| No verified Doefin forecasting algorithm/live service specification, measured accuracy results or immutable archive promise | Methodology evidence section |
| Original timestamped predictions, comparable lead times, outcomes and corrections needed for measured accuracy | Methodology evidence section |
| Same target block/change definition/time; later forecasts can use later information | Comparison-guide first section; one scoreboard measured-evidence section |
| Original forecast, stated range, input height, source, model version, outcome definition, publication time/independent capture; lead-time groups, failed/missing forecasts and exclusions | Comparison-guide first section, linked from observed report |
| Absolute error is the gap’s size; average gives equal weight; units pp; ignores direction; averages can hide maximum/individual misses | Scoreboard definitions and unchanged error chart/calculations; comparison-guide metric section |
| Coverage is outcome inclusion; width is high minus low, summarised over tested forecasts; read them together | Scoreboard definitions and worked numerical interpretation; comparison-guide metric section |
| Sample count excludes missing/unscored rows; small or selected samples may not represent future conditions | Scoreboard definitions, unchanged table counts and final measured-evidence section |
| Five synthetic pairs have no range limits and do not count as observed adjustment periods; no measured provider errors/coverage | Scoreboard evidence panel and existing sample data values |
| Fictional A/B/C, two invented scored outcomes, common 1,008-block lead, third missing outcome, no real estimator/ranking/source capture/calibrated confidence; full input rows | Unchanged `IllustrativeComparison` component/table/details |
| One synthetic block-911,232 outcome inside its existing bounds is one inclusion, not a reliable confidence level | Scoreboard range-scoring example; same existing bound/outcome bindings |
| Confidence testing needs enough independent observations in a defined period; measured sample does not establish another period’s performance | Comparison-guide metric section; methodology range section; scoreboard measured-evidence section |
| No measured ranking, forecasting advantage, volatility estimate or record of which forecasters publish ranges | Comparison-guide final section |
| Observations do not measure forecast error, range reliability, mining profit or trading return; no forecasting advantage | Observed-report final section |
| Measured errors do not guarantee the next forecast, a trading result or fleet production | Scoreboard final measured-evidence section |
| Position-loss, professional-investor and investment-advice disclosures | Existing shared footer, outside this edit set and untouched |

## Checks actually run

- `npm run typecheck`: passed.
- `npm run check:brand`: passed; vendored v0.2.0 intact; 0 CUT, 0 STYLE, 1 CHECK from the navigation word “Return”. This repository checker inspects added source lines, not remote CMS content.
- Python `check_copy.py --channel=web` on every proposed CMS after string: 0 CUT, 0 STYLE, 3 CHECK matches.
- Python checker on six source-rendered harness pages with proposed CMS text: 0 CUT, 0 STYLE, 4 CHECK matches. No STYLE exception needed.
- `planVoiceDrafts` against the fresh `.result` baseline: 3 documents, 19 rows, no conflicts. Actual `parseResearch` accepts the proposed complete documents. Keys/IDs, slugs, dates, titles and existing SEO summaries are equal before/after.
- Existing score helper independently checked: A = 1.02 pp / 100% / 6.45 pp; B = 0.70 pp / 50% / 1.50 pp; C = 1.95 pp / 100% / 10.00 pp. Each has 2 scored and 1 missing. The displayed interpretation binds to these results rather than duplicating numeric constants.
- Source-rendered before/after harness: every previous rendered ID and destination link remains on all six pages. It uses current published CMS text before, and proposed text after. It is a focused React render with layout/autolinking and unavailable API responses stubbed, not a Next server, browser layout test, deployment check or live CMS preview.
- Harness word counts, before → after: research 437 → 385; data 538 → 501; scoreboard 1,215 → 1,004; methodology 353 → 415; comparison guide 364 → 361; observed report 582 → 519. Counts include details/table text and are evidence of consolidation, not the acceptance criterion.
- `git diff --check`: passed. No shared Next build was run by this agent.
- `npm run check:voice-drafts -- studio/rewrites/2026-11-06-structure-research.json --snapshot=work/brand-copy-validation/structure-current-published-2026-11-06.json`: fails the script’s string-only `Change.after` assertion on the first paragraph array. This is a validator limitation, not a published-text conflict; the direct planner and research parser pass. The parent owns the integration normalisation.

The direct planner/parser checks above validate the requested array consolidation without this agent changing validation scripts. The parent owns integration validation and any validation-only normalisation.

## Exact retained CHECK passages

| Location | Passage | Why retain |
| --- | --- | --- |
| Scoreboard next-step link | “Return to the data field guide” | Navigation verb, not an investment return claim. |
| Observed-report scope | “They establish no forecasting advantage, mining profit or trading return.” | Necessary limit on what the observed study can establish. Two keyword matches: profit and return. |
| Observed-report provenance | “The API’s rolling window determines which adjustments are included; the study does not select profitable periods.” | Preserves the source-window selection qualification; no profit claim. |

No other CHECK passages or STYLE exceptions occur in the six-page final harness. The new model interpretation is illustrative explanatory text, not a measured performance claim, but Fardin and Matteo should read it before publication. The simplified forecast mechanism should also receive the independent reviewer’s technical reading.

## Integrated proposal validation

The parent normalised changed-length paragraph arrays into `Matteo` rows and equal-length arrays into changed string rows for the complete structure package. All 59 integrated rows across eight documents pass the scoped voice validator. This supersedes the worker-only raw `Change`-array limitation noted above.

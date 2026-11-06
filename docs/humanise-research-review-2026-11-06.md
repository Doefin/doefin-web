# Research and data: plain-language editorial pass

Codex editorial pass for Fardin’s reading, dated 6 November 2026. This is a wording review, not human approval or publication approval. The brand source is the pinned Doefin brand 0.2.0 at `936bc5c`. I used the `doefin-humanise` skill and the brand voice-editor procedure, especially Matteo’s habits 3 (precision), 6 (say it once), E29/E30 (explain estimates) and the research rule to separate observations, forecasts and examples.

## What changed

The research pages now explain their question or result before asking the reader to check evidence. Headings name the number, calculation or limitation. Definitions explain terms such as forecast range, absolute error, forecast lead time and calibration. Source data, synthetic values and future estimates remain distinct. The observed report now ends with a compact download-and-citation panel instead of repeating its own findings.

All visible blocks in the 14 owned components were read in their page order, including neighbouring headings, notices, captions, table labels, statuses, metadata, links and conditional content. The inventory below covers retained blocks as well as rewrites. Source text is implemented locally. CMS text is proposed separately in `studio/rewrites/2026-11-06-research-plain-language.json`; no CMS write or publication was made. Migration seeds, identifiers, section keys, anchors, dates, figures, formulas and bindings were preserved. A parent-approved compact variant removes repeated explanatory blocks and a self-link only on the observed report; the details control, status and every download remain. Other layout and controls stay unchanged.

## Page review and retained wording

| Location | Decision and reading order |
|---|---|
| ResearchIndex | Change the introduction, card labels and related-reading explanations. Keep the useful “Evaluate a difficulty forecast” heading, empty state, publication dates, report titles/summaries supplied by CMS, card structure and links. The reader moves from the question to sourced network data, comparison guides, arithmetic and related method/data pages. |
| ResearchArchiveSummary | Change the finding and source explanation. Keep all dynamic figures, source/date, fixed one-year scope and local archive disclosure in the default variant. The compact variant used only by the observed report keeps downloads, version/source date, archive status and anchors; duplicate findings and explanations remain in that report’s article. Historical observations remain separate from synthetic forecast examples and accuracy scores. |
| ResearchEvidencePreview | Change the explanation to averaging absolute distances; keep the displayed formula, sample date and local synthetic label. It shows the calculation, one pair, units and provenance in that order. |
| V3DataIndex | Change the opening and archive explanation. Keep current difficulty separate from estimated network hashrate. Keep dated-table warnings, all rows, missing-outcome explanation and navigation. The page separates the historical snapshot, current API readings and example records. |
| V3Difficulty | Change opening, range explanation and chart heading. Keep local source/synthetic notice, fixed-record limitation and links. Current difficulty stays observed; only the next adjustment is estimated. |
| V3Hashrate | Explain block windows before the example chart. Keep the “estimated, not counted” heading, all three windows and absence of forecast ranges. The example chart is derived from difficulty rather than independent hashrate observations. |
| V3Scoreboard | Change abstract headings and technical explanations. Keep metric names/units, synthetic scores, equal weighting, maximum-error interpretation, no-provider-ranking claim, and all local caveats. The four metrics lead into point-error versus range tests and fair-comparison requirements. |
| V3ForecastExample | Change jargon and generic section headings. Keep the three-step calculation, formula, every pair, download controls and interpretation loaded from the existing sample data. Preserve the absence of a live model, observation period, historical source, interval evaluation and cross-condition performance test. |
| V3EpochPage | Change headings, range and archive explanations. Keep missing-outcome branches, lack of confidence calibration, formulas, supplied levels, date fields and the explicit disagreement with the separate synthetic series. |
| V3ReportPage | Change the introductory explanation and worked-example invitation. Keep report CMS fields, source downloads and newsletter component. The observed report uses the compact archive-summary variant after the article, removing the repeated findings. The report has the neutral contents label “In this report”. |
| V3Methodology | Change the page question, opening and one link label. Keep the CMS reading structure and settlement link. The introduction distinguishes repeatable calculation from evidence for a forecast range. |
| DataDetail | Change example labels, chart explanations and source-row label. Keep chart axes, formulas, all values in HTML, tables, range markers and local synthetic warnings. |
| SampleEvidence | Change only the arithmetic instruction. Keep the mean, date, table, sample count, non-performance warning and CSV. |
| data-reading | Change service errors and dense source/precision language. Keep HTTP codes, empty-data behaviour, timestamps, stale/future conditions, threshold, all API fields and exact H/s-to-EH/s precision. The missing difficulty state now labels the estimated next adjustment correctly. |

## Fresh CMS baseline and proposals

Public origin API GET fetched all three complete documents with the published perspective. The exact response and capture time are saved in `work/brand-copy-validation/research-published-plain-language-2026-11-06.json`. Each proposal’s `before` value was checked against that current published document, rather than relying on migration seeds or the preflight file’s older published keys. All section paragraph counts, `_key` values and IDs stay unchanged.

| Document | Published revision read | Updated at |
|---|---|---|
| `research-methodology-difficulty-index` | `JYRqnCqPqeQAja5ejqW3WE` | 2026-11-06T09:40:18Z |
| `research-report-difficulty-forecast-accuracy-2026` | `Mac7TZNCor7fzOhjX9tFa5` | 2026-11-06T09:43:00Z |
| `research-report-observed-difficulty-adjustments` | `Mac7TZNCor7fzOhjX9tJjy` | 2026-11-06T09:43:12Z |

There are 25 Change rows across the three CMS documents. Each JSON row contains the exact current `before`, proposed `after`, keyed path, type and fact-preservation note. The observed report still gives 25 changes, 11 rises, 14 falls, 3.75% mean absolute change, -11.16% minimum, 14.73% maximum and the same dates. Its method keeps 26 source boundaries, 2,016-block spacing, earliest-boundary exclusion, the exact formula, original source precision and SHA-256 verification scope. Independent-node, DOI, timestamp, immutable-hosting, forecast-archive and pre-event publication-proof limits remain explicit.

## Fact-review corrections

The first draft of the preview said to “calculate the difference” and average the errors. That could imply averaging signed differences. It now says to find how far each forecast was from its outcome and average those distances. The report-page invitation received the same correction. The explicit absolute-value formulas were never changed.

The first data-index rewrite grouped current difficulty with hashrate estimates. It now names current difficulty and estimated network hashrate separately in the summary, notice and metadata. The unavailable difficulty-panel title now refers to the next adjustment estimate. The source timestamp warning still says the data’s age cannot be verified independently.

## Checks completed

- `npm run typecheck`: passed after the final wording corrections.
- `git diff --check`: passed.
- Before the approved compact-panel change, the TypeScript AST comparison of all 14 owned components against `origin/main` found every non-copy token and 531 protected string values unchanged. After that change, the same copy-only comparison still passes for the 12 unaffected components. The two structurally changed components are reviewed separately below; formulas and data bindings remain unchanged. The initial wording pass contained 145 changed literal/text tokens, with one additional heading in the compact variant.
- All 25 CMS `before` values match the fresh published baseline at their exact keyed paths. Paragraph counts are unchanged.
- Python brand checker on extracted final source prose plus every CMS proposal `after`, using the web channel: **0 CUT, 0 STYLE, 8 CHECK triggers**. No prose STYLE exceptions.
- `npm run check:brand`: passed, vendored brand intact. Its source-line scan has 0 CUT. It flags two `!` tokens on the edited V3EpochPage line 34; these are unchanged TypeScript non-null assertions, not prose. The full shared-worktree run also reports an unrelated `!` and profit CHECK in InstitutionsExplorer, outside this ownership. Those findings do not establish a problem in the extracted research prose.

The extraction included JSX text, natural-language string literals and template literal text. Code fragment IDs were excluded as controls, rather than treated as hashtags. No AI-detector score or numerical readability target was used.

These checks cover source wording and reviewable CMS proposals. No built-route, visual, accessibility or browser verification was performed by this subtask. The fresh public API read verifies the CMS baseline, not publication of the proposed text. Whole-site build/render checks remain with the parent task.

## Exact retained CHECK passages

| Location | Exact passage | Why retained |
|---|---|---|
| V3Scoreboard, next link | “Return to the data field guide” | Navigation verb, no investment return claim. |
| V3EpochPage, error explanation | “The error measures the gap between two percentage changes; it is not a percentage loss or trading return.” | Necessary limit on what error means; denies a trading-return interpretation. |
| V3EpochPage, next link | “Return to the difficulty example” | Navigation verb, no financial claim. |
| data-reading, conversion note | “The API returns a ratio. This page multiplies it by 100 to show a percentage.” | API behaviour, not an investment return. |
| Observed report proposal, section-0 paragraphs | “These figures describe network difficulty in this historical period. They do not measure forecast error, the reliability of forecast ranges, mining profit or a trading return. This small descriptive study does not show a forecasting advantage.” | Two triggers, profit and return. The passage preserves the limits on interpretation. |
| Observed report proposal, section-2 paragraphs | “The API’s rolling window determines which adjustments are included; the study does not select profitable periods.” | Preserves the inclusion-rule limitation; makes no profitability claim. |
| Observed report proposal, section-2 paragraphs | “Local file checksums do not prove an external publication time or guarantee that hosted files cannot change.” | Denies a permanence guarantee; necessary qualification of the checksums. |

No new product or performance claim, settlement/collateral change, financial position example or legal/access rule was introduced. Existing exclusions concerning trading return and profit remain for Matteo’s reading. This does not replace his review.

## Consecutive-section reread and remaining density

I reread each page from heading through notices, consecutive sections and final links, then reread each CMS proposal as a complete report. The research landing question leads into the observed dataset, comparison guide and calculation example. The accuracy page distinguishes the example score from observed data before explaining the metrics. Methodology moves from inputs to a repeatable calculation, range validation and the available evidence. The historical report leads with its findings, then gives the calculation and source limits.

Some density remains deliberately: the observed report’s method paragraph has the source endpoint, boundary rule and exact formula; splitting or weakening those would make reproduction harder. Its source section retains SHA-256, DOI and versioning terms because they define what the downloads can establish. SHA-256 is explained as a checksum and DOI as a persistent research identifier. Metric names such as “Mean absolute error” and “Interval coverage” remain because they are the standard quantities being taught, each with a definition. API precision and freshness notes stay technical because readers need them to interpret the values.

Some short labels are still generic: “The method”, “The context”, “The comparison”, “Teaching illustration”, and “Read the result” style navigation. Their neighbouring headings and descriptions supply the subject; none needs a new claim. Local notices still repeat that values are synthetic where a chart, table or score may be read independently. The observed report’s full archive summary was the one confirmed duplicate: its own article already contains the same 25-record findings, source limitations and empty-archive explanation. The approved compact variant removes that repeat. Local notices on other pages remain because charts, tables or scores may be read independently.

## Approved removal of repetition on the observed report

The parent explicitly authorised this small structural change after reviewing the wording diff. I read `vendor/doefin-brand/brand/visual.md` and `docs/brand.md` before applying it. No new visual treatment was introduced.

`V3ReportPage` now calls `<ResearchArchiveSummary compact />` only in its existing observed-report branch. The shared component defaults to the existing full summary for research, data and accuracy pages.

In the compact variant:

- **Cut:** the repeated paragraph giving the 25 changes, the dates, 11/14 counts, mean change and historical-versus-forecast distinction. The report’s first section retains those facts.
- **Cut:** the repeated fixed-one-year/no-live-feed/no-independent-node-check explanation. The article’s method and provenance sections retain these limits.
- **Cut:** the repeated paragraph explaining synthetic examples, missing provider predictions/publication receipts and why observations do not measure accuracy. The article’s final section retains these points.
- **Cut:** the “Read findings and method” link pointing to the report the reader is already on.
- **Keep:** version label, mempool.space source and capture date, CSV download, API/citation manifest, empty-forecast-archive status, the expandable archive control and archive-status link. The `observed-research-title` and `prospective-archive` anchors remain.
- **Keep outside the shared panel:** printable report, observed JSON and original source-record links, plus the newsletter component, all in the same observed-report branch as before.
- **Change heading:** “25 recorded difficulty adjustments.” becomes “Download and cite the dataset.” only in the compact variant. The complete article above already states the finding.

This change preserves every unique download, source limitation, evidence status and anchor. The final Python prose check remains 0 CUT and 0 STYLE with the same eight CHECK triggers; typecheck and diff whitespace checks pass after this change. Built-page rendering is left to the parent’s whole-site verification.

## Implemented source changes: exact before and after

This table records final differences from `origin/main`, not intermediate drafts. Facts preserved in a significant rewrite are stated in the note; the page-level inventory above covers unchanged blocks.

| File and final line | Verdict | Before | After | Reason and fact preservation |
|---|---|---|---|---|
| `components/v3/ResearchIndex.tsx:26` | Change | Check a forecast comparison. Reproduce the error calculation. | How close was a forecast to the outcome? Learn how to compare forecasts and calculate their errors. | Puts the research question before the task; adds no accuracy claim. |
| `components/v3/ResearchIndex.tsx:27` | Change | Educational research. | Research and worked examples. | Keeps the distinction between authored forecasts and observed data. |
| `components/v3/ResearchIndex.tsx:27` | Change | Forecast examples are synthetic. A separate sourced network dataset is available; it does not rank providers. | The forecast examples use made-up values. The separate historical network dataset contains sourced observations, not a provider ranking. | Keeps the distinction between authored forecasts and observed data. |
| `components/v3/ResearchIndex.tsx:34` | Change | Observed network analysis | Historical network data | Names the actual subject rather than an analytical process. |
| `components/v3/ResearchIndex.tsx:34` | Change | Comparison criteria | Forecast comparison guide | States what the report offers. |
| `components/v3/ResearchIndex.tsx:37` | Change | Read observed findings | Read the network findings | Keeps a clear reading action. |
| `components/v3/ResearchIndex.tsx:37` | Change | Read the comparison criteria | Read the comparison guide | Uses familiar language. |
| `components/v3/ResearchIndex.tsx:40` | Change | Use this to check | What the report covers | Replaces internal review instruction with contents. |
| `components/v3/ResearchIndex.tsx:41` | Change | The period being measured | The dates covered | Keeps time scope. |
| `components/v3/ResearchIndex.tsx:41` | Change | The same target and forecast timing | Matching targets and forecast times | Keeps comparability requirements. |
| `components/v3/ResearchIndex.tsx:41` | Change | Records you can use to check the result | Records needed to repeat the calculation | Gives the evidence a concrete purpose. |
| `components/v3/ResearchIndex.tsx:49` | Change | Check the supporting method and data. | Understand the method and data. | Connects related reading to comprehension. |
| `components/v3/ResearchIndex.tsx:51` | Change | Check the inputs, calculation and evidence needed to support an uncertainty range. | See how inputs become an estimate and what evidence a forecast range needs. | Preserves the need to support uncertainty. |
| `components/v3/ResearchIndex.tsx:52` | Change | Read the difficulty and hashrate examples alongside their dates and assumptions. | Find difficulty and hashrate readings, with their dates and assumptions. | Includes the current readings without mislabelling them examples. |
| `components/v3/ResearchIndex.tsx:53` | Change | Understand error, coverage, interval width and sample count before comparing forecasts. | Learn what forecast error, range coverage, range width and sample size tell you. | Uses range consistently while preserving all four measures. |
| `components/v3/ResearchArchiveSummary.tsx:8` | Change | difficulty adjustments you can inspect. | recorded difficulty adjustments. | Makes the heading about the dataset. |
| `components/v3/ResearchArchiveSummary.tsx:9` | Change | , the captured observations contain | , the dataset records | Concrete subject and verb; same observations. |
| `components/v3/ResearchArchiveSummary.tsx:9` | Change | %. This is historical network movement, separate from forecast error and the synthetic examples below. | %. These figures describe historical network changes. They do not measure forecast error or come from the made-up examples on this site. | Preserves historical versus synthetic and error distinctions. |
| `components/v3/ResearchArchiveSummary.tsx:10` | Change | . The source covers a fixed one-year period. It provides no live coverage or evidence of an independent check against a Bitcoin node. | . This is a fixed one-year snapshot, not a live feed. No independent check against a Bitcoin node is documented. | Keeps one-year fixed scope and absence of independent verification. |
| `components/v3/ResearchArchiveSummary.tsx:16` | Change | Prospective forecast archive: no published records | Forecast archive: no published predictions | Removes jargon while retaining zero published records. |
| `components/v3/ResearchArchiveSummary.tsx:16` | Change | The prototype’s dated forecasts and scoreboard are examples. There are no captured provider predictions or independently timestamped records of publication or market listings. Recorded adjustments alone cannot show how well a forecast performed. | The dated forecasts and accuracy scores on this site use made-up values. The archive contains no captured provider predictions or independent timestamps proving publication or market listing. Historical adjustments alone cannot show forecast accuracy. | Preserves every archive limitation in direct language. |
| `components/v3/ResearchEvidencePreview.tsx:16` | Change | Follow the arithmetic over | For each of the | Explains the calculation before naming the evidence task. |
| `components/v3/ResearchEvidencePreview.tsx:16` | Change | synthetic forecast/outcome pairs. Check each error, reproduce their mean and download the CSV. | made-up pairs, find how far the forecast was from the outcome. Average those distances, then download the CSV. | Explains the calculation before naming the evidence task. |
| `components/v3/ResearchEvidencePreview.tsx:22` | Change | Absolute difference between example outcome and forecast. pp = percentage points. | The error is the size of the gap between the forecast and example outcome. pp means percentage points. | Explains absolute error plainly without changing the formula. |
| `components/v3/ResearchEvidencePreview.tsx:23` | Change | . Made-up values, not recorded forecasts. | . These values were created for the example, not recorded from forecasts. | Retains local provenance warning. |
| `components/v3/V3DataIndex.tsx:13` | Change | Read current Bitcoin difficulty and hashrate estimates beside sourced historical observations and clearly labelled teaching examples. | Read current Bitcoin difficulty, estimated network hashrate, sourced historical observations and clearly labelled teaching examples. | Separates the observed protocol difficulty from estimated hashrate in metadata. |
| `components/v3/V3DataIndex.tsx:22` | Change | The data field guide | Bitcoin network data | Names the subject. |
| `components/v3/V3DataIndex.tsx:24` | Change | Read difficulty, hashrate and forecast accuracy in context. | Find current difficulty, estimated network hashrate, historical adjustments and examples of forecast error. | Explains the actual content and distinguishes categories. |
| `components/v3/V3DataIndex.tsx:27` | Change | Separate live readings from examples. | Current estimates and worked examples. | Keeps data origins and performance limit. |
| `components/v3/V3DataIndex.tsx:27` | Change | Current difficulty and hashrate come from the API. The forecast ranges and dated examples use made-up values for learning; they do not demonstrate forecasting performance. | The API supplies current difficulty and estimated network hashrate. The forecast ranges and dated examples use made-up values; they do not show forecasting performance. | Keeps data origins and performance limit. |
| `components/v3/V3DataIndex.tsx:44` | Change | Backend forecast archive | Forecast history | Removes internal system label. |
| `components/v3/V3DataIndex.tsx:44` | Change | No published forecast records for difficulty adjustments. | The forecast archive is empty. | Shortens heading without changing availability. |
| `components/v3/V3DataIndex.tsx:45` | Change | The API supplies a current estimate, but no published forecast records with their ranges and outcomes. We need those records before linking a page for each difficulty adjustment. | The API supplies a current estimate. It has no published records linking earlier forecasts to their ranges and outcomes, so there is no forecast history to follow for each adjustment. | Explains the missing history rather than internal page-production requirements. |
| `components/v3/V3DataIndex.tsx:69` | Change | The units, sample count and evaluation window matter. An average alone cannot tell you which forecast to trust. | An average error depends on its units, the number of forecasts and the dates tested. It cannot tell you on its own which forecast to trust. | Makes evaluation window and sample count understandable. |
| `components/v3/V3DataIndex.tsx:70` | Change | Want to check the workings? | How is forecast error calculated? | Names the reader question. |
| `components/v3/V3DataIndex.tsx:70` | Change | Inspect inputs and methodology | Read about inputs and methods | Replaces audit-style instruction. |
| `components/v3/V3Difficulty.tsx:11` | Change | Reading Bitcoin difficulty estimates. | What does the difficulty estimate mean? | Uses the reader question. |
| `components/v3/V3Difficulty.tsx:11` | Change | Check where the current estimate comes from and what it tells you. The teaching examples below are separate. | See the current difficulty and the estimated next adjustment, then learn what the API can and cannot tell you. | Rebuilds opening around the content and its limits. |
| `components/v3/V3Difficulty.tsx:11` | Change | Live backend reading. | Current API reading. | Keeps current versus authored distinction without implementation jargon. |
| `components/v3/V3Difficulty.tsx:11` | Change | The panel uses the current API response. The series below uses made-up values as a separate teaching example. | The panel uses the current response. The chart below is a separate example made with synthetic values. | Keeps current versus authored distinction without implementation jargon. |
| `components/v3/V3Difficulty.tsx:13` | Change | Check the estimate and its source. | An estimate without a forecast range. | Heads the explanation with its useful point. |
| `components/v3/V3Difficulty.tsx:13` | Change | These values come from the analytics API. It provides no forecast range or fixed record for each difficulty adjustment. | The analytics API supplies the values above. It does not publish a lower and upper forecast limit or a saved record for each adjustment. | Explains range and record in familiar words. |
| `components/v3/V3Difficulty.tsx:14` | Change | The panel shows current difficulty and the API’s estimate for the next adjustment. The relative change is converted to a percentage. No forecast range is shown because the API supplies no lower or upper limit. | The percentage change shows how far the estimated next difficulty is above or below the current level. It is converted from the ratio returned by the API. | Retains ratio conversion and explains the displayed percentage; range absence remains directly above. |
| `components/v3/V3Difficulty.tsx:16` | Change | A sequence of teaching examples. | How difficulty changes in steps. | Gives chart a purpose beyond being an example. |
| `components/v3/V3Difficulty.tsx:16` | Change | These values were created for the example. They are not current network history or a record of measured forecasts. | The chart illustrates step changes using made-up values. It is not current network history or a record of measured forecasts. | Keeps provenance and performance limits. |
| `components/v3/V3Difficulty.tsx:19` | Change | Published forecast records are unavailable. | Why there is no forecast history. | Explains the missing content. |
| `components/v3/V3Difficulty.tsx:19` | Change | There is no separate page for an adjustment without a source record. | A page for an individual adjustment needs its original forecast record. | Preserves existing page condition without an internal instruction. |
| `components/v3/V3Difficulty.tsx:20` | Change | The inputs, calculation and evidence a reproducible forecast needs. | The inputs and calculation needed to repeat a forecast and assess its range. | Explains reproducibility and uncertainty requirements. |
| `components/v3/V3Hashrate.tsx:11` | Change | Compare the rolling estimates and check their timestamp. The example series below is separate from the current data. | Compare estimates over different block windows and see when the source was updated. The example chart is separate from these readings. | Explains rolling windows and timestamp purpose. |
| `components/v3/V3Hashrate.tsx:11` | Change | Live backend reading. | Current API reading. | Retains local source distinction. |
| `components/v3/V3Hashrate.tsx:11` | Change | The panel uses the current API response. The series below uses made-up values as a separate teaching example. | The panel uses the current response. The chart below is a separate example made with synthetic values. | Retains local source distinction. |
| `components/v3/V3Hashrate.tsx:13` | Change | What a hashrate window means. | Why the averaging window matters. | Connects technical detail to interpretation. |
| `components/v3/V3Hashrate.tsx:13` | Change | The backend publishes rolling estimates in hashes per second. It does not publish forecast intervals or hashrate records for each difficulty adjustment. | The API estimates hashrate over recent blocks and reports it in hashes per second. It supplies no forecast ranges or hashrate records for each difficulty adjustment. | Defines rolling estimates without changing source behaviour. |
| `components/v3/V3Hashrate.tsx:14` | Change | A longer averaging window smooths short-term variation. The 120-, 144- and 2,016-block windows are separate source values; no range is inferred from them. | A longer window smooths short-term variation. Each of the 120-, 144- and 2,016-block estimates is a separate source value. The gap between them is not a forecast range. | Preserves windows and avoids unexplained inference wording. |
| `components/v3/V3Hashrate.tsx:16` | Change | A sequence of teaching examples. | Hashrate implied by example difficulty. | Accurately identifies the derived chart. |
| `components/v3/V3Hashrate.tsx:16` | Change | These example values show how a rate can move. They are not current network history or observations from the API. | The chart converts example difficulty into hashrate using the ten-minute block target. Its values are not current network history or API observations. | Explains why chart values move; preserves derivation and caveat. |
| `components/v3/V3Hashrate.tsx:19` | Change | Review the inputs and calculation context. | See which inputs a forecast uses and how it is calculated. | Concrete reason for related reading. |
| `components/v3/V3Scoreboard.tsx:12` | Change | Read alongside the forecast lead time and evaluation window. An average can hide individual large misses. | Check how far ahead the forecasts were made and which dates were tested. An average can hide individual large misses. | Explains lead time and evaluation window. |
| `components/v3/V3Scoreboard.tsx:13` | Change | Read alongside the stated confidence level and interval width. Wide ranges can cover more outcomes without being more useful. | Check the stated confidence level and the width of each range. Wide ranges can contain more outcomes without being more useful. | Keeps confidence, width and useful coverage distinction. |
| `components/v3/V3Scoreboard.tsx:14` | Change | The distance between a range’s lower and upper endpoints, summarised over the evaluated forecasts. | The gap between a forecast range’s lowest and highest values, summarised across the forecasts tested. | Explains endpoints and evaluation with familiar terms; no measure changes. |
| `components/v3/V3Scoreboard.tsx:15` | Change | Check the dates, exclusions and missing forecasts. A small or selected sample may not represent future conditions. | Check the dates, which forecasts were left out and which were missing. A small or selected sample may not represent future conditions. | Explains exclusions while retaining sample-bias limit. |
| `components/v3/V3Scoreboard.tsx:24` | Change | Read accuracy beyond the headline. | What does forecast accuracy tell you? | Uses the actual reader question. |
| `components/v3/V3Scoreboard.tsx:24` | Change | See what an average error tells you, what it hides and what to check before comparing forecasts. | An average error summarises a set of forecasts. The individual misses, forecast ranges and sample size help you judge what it means. | Provides the answer before the checking task. |
| `components/v3/V3Scoreboard.tsx:28` | Change | An example error profile | Average error in a worked example | Replaces vague profile with metric. |
| `components/v3/V3Scoreboard.tsx:33` | Change | The made-up errors show how the metric works. The site has no measured comparison between Doefin and other estimators, or evidence that one forecasts better. | These errors explain the calculation. The site has no measured comparison showing how Doefin and other estimators perform, or evidence that one forecasts better. | Keeps precise absence of comparative evidence. |
| `components/v3/V3Scoreboard.tsx:33` | Change | Measured epochs scored | Observed adjustment periods scored | Explains epochs as adjustment periods; count binding unchanged. |
| `components/v3/V3Scoreboard.tsx:33` | Change | The five-pair arithmetic sample does not publish interval endpoints. | The five-pair calculation does not include lower or upper forecast limits. | Makes reason coverage unavailable clear. |
| `components/v3/V3Scoreboard.tsx:33` | Change | Keep the count of measured observations separate from the example count. Five made-up rows are not five observed epochs. | The five example rows do not count as observed adjustment periods. | Keeps count limitation; epoch becomes familiar adjustment period. |
| `components/v3/V3Scoreboard.tsx:37` | Change | Four readings, one comparison. | Four measures of forecast accuracy. | Names section contents. |
| `components/v3/V3Scoreboard.tsx:38` | Change | Read it with context. | What to check. | Short label that fits technical guidance. |
| `components/v3/V3Scoreboard.tsx:41` | Change | A small error and a useful range are different tests. | Does the forecast range help? | Short heading names the second accuracy question. |
| `components/v3/V3Scoreboard.tsx:41` | Change | The forecast and outcome are percentage changes. Subtracting them gives percentage-point error. Absolute error discards the sign; it does not tell you whether a model consistently predicts too high or too low. | The forecast and outcome are percentage changes. Subtracting them gives percentage-point error. Absolute error measures the size of the gap and ignores its direction. It cannot show whether a model consistently predicts too high or too low. | Explains sign with its consequence. |
| `components/v3/V3Scoreboard.tsx:41` | Change | One outcome cannot show whether a stated confidence level is reliable. That needs a broad set of comparable, recorded forecasts, tested against the stated level with their range widths visible. | One outcome cannot show whether a confidence level is reliable. That needs many comparable, recorded forecasts. The test must show how often their ranges contain the outcome and how wide those ranges are. | Explains calibration using coverage and width; preserves evidence requirement. |
| `components/v3/V3Scoreboard.tsx:41` | Change | This is a synthetic example. There is no published record page for each difficulty adjustment. | The example uses made-up values. Published forecast records for individual adjustments are unavailable. | Keeps local synthetic warning and missing-record state. |
| `components/v3/V3Scoreboard.tsx:43` | Change | Check the comparison before the score. | What makes a comparison fair? | Question describes section purpose. |
| `components/v3/V3Scoreboard.tsx:43` | Change | The same error unit does not make two tests equivalent. These details should be visible beside any measured ranking. | Two scores can use the same units and still come from different tests. A measured ranking needs the following details beside it. | Preserves comparability limitation in familiar wording. |
| `components/v3/V3Scoreboard.tsx:45` | Change | Compare forecasts of the same adjustment, frozen at comparable times. A later forecast may use information unavailable to an earlier one. | Compare forecasts for the same adjustment, saved at comparable times. A later forecast may use information unavailable to an earlier one. | Clarifies frozen while preserving information timing requirement. |
| `components/v3/V3Scoreboard.tsx:47` | Change | Keep the evidence reproducible | Keep records of the original forecasts | Names evidence needed. |
| `components/v3/V3Scoreboard.tsx:47` | Change | Retain time-stamped forecast captures, source inputs, the method version and a verifiable outcome definition. | Keep timestamped copies of forecasts, their source inputs, the method version and a definition of the outcome that can be checked. | Retains every reproducibility requirement. |
| `components/v3/V3Scoreboard.tsx:48` | Change | Keep the claim within the test | Explain what the test can show | Clearer scope label. |
| `components/v3/V3Scoreboard.tsx:51` | Change | Look at input conventions, uncertainty and evaluation requirements. | See how to document inputs, forecast ranges and accuracy tests. | Removes abstract noun pile. |
| `components/v3/V3Scoreboard.tsx:51` | Change | Difficulty, hashrate and dated records, with their meanings and context. | Current estimates, historical network changes and dated examples, explained. | States actual destinations with distinctions. |
| `components/v3/V3ForecastExample.tsx:27` | Change | pairs were authored for this exercise. Sample prepared | pairs were made up for this exercise. Sample prepared | Uses familiar wording for the same subject; figures, qualifications and surrounding mechanics are retained. |
| `components/v3/V3ForecastExample.tsx:35` | Change | Take the absolute difference. | Find the gap, ignoring its sign. | Explains absolute value in the heading. |
| `components/v3/V3ForecastExample.tsx:36` | Change | The forecast and example outcome are difficulty changes in percent. Subtract the forecast from the example outcome and take the absolute value. The error is in percentage points (pp). | The forecast and example outcome are difficulty changes in percent. Subtract the forecast from the example outcome and take the absolute value. Ignore any minus sign. The error is in percentage points (pp). | Explains the technical operation once. |
| `components/v3/V3ForecastExample.tsx:40` | Change | Keep every pair in the calculation. | Calculate the error for every pair. | Focuses on next step while retaining all-pair instruction. |
| `components/v3/V3ForecastExample.tsx:45` | Change | pp = percentage points. This is a calculation on authored values, not a measured accuracy result for any forecaster. | pp = percentage points. The values were made up, so this result does not measure any forecaster’s accuracy. | Keeps local limitation in direct language. |
| `components/v3/V3ForecastExample.tsx:47` | Change | Read the result in context. | What the result can tell you. | Names interpretive purpose. |
| `components/v3/V3ForecastExample.tsx:47` | Change | All five pairs were authored for this website prototype. There is no live model, observation period or historical source behind them. | The five pairs do not come from a live model, an observation period or a historical source. | Synthetic provenance stated in header and result; retains unique absence of model, period and source. |
| `components/v3/V3ForecastExample.tsx:47` | Change | A real report would include forecast timestamps, observation heights, model version, an unedited evaluation window and a comparison baseline. This sample does not assess uncertainty intervals or performance across market conditions. | A measured report needs forecast timestamps, observation block heights, the model version, the full evaluation period and a baseline for comparison. This sample does not test forecast ranges or performance across market conditions. | Preserves reporting requirements, no selection, uncertainty and regime limits. |
| `components/v3/V3EpochPage.tsx:11` | Change | Inspect an authored difficulty forecast, before/after levels, a supplied outcome and error arithmetic. All values and dates are synthetic. | Follow an example difficulty forecast, the levels before and after, and the error calculation. All values and dates are synthetic. | Natural metadata with same synthetic warning. |
| `components/v3/V3EpochPage.tsx:23` | Change | A record at block | A forecast example at block | Makes provenance clear in title. |
| `components/v3/V3EpochPage.tsx:23` | Change | Trace the authored forecast, the supplied outcome and the difference between them. | Compare the example forecast with its outcome and work through the difference. | Plain reader task. |
| `components/v3/V3EpochPage.tsx:32` | Change | Outcome vs authored range | Outcome within example range | Removes editorial jargon. |
| `components/v3/V3EpochPage.tsx:32` | Change | This is interval membership, not calibration. | This shows whether the outcome is inside the range, not whether the range is reliable. | Explains technical distinction. |
| `components/v3/V3EpochPage.tsx:34` | Change | the authored endpoints. | the example range. | Uses term already explained. |
| `components/v3/V3EpochPage.tsx:34` | Change | The endpoints were authored with the record. They do not establish a confidence level or the probability of an outcome. | The range was made up for this example. Its endpoints do not establish a confidence level or an outcome’s probability. | Keeps confidence and probability caveats. |
| `components/v3/V3EpochPage.tsx:37` | Change | Follow the level, not just the percentage. | From a percentage change to a level. | Concrete heading describes calculation. |
| `components/v3/V3EpochPage.tsx:37` | Change | T means trillion. These are the difficulty levels supplied with this record, kept separate from the forecast change. | T means trillion. The values below show difficulty levels, rather than percentage changes. | Preserves level-versus-change distinction; source origin already retained locally. |
| `components/v3/V3EpochPage.tsx:42` | Change | An authored value, not a verified network observation. | A made-up value, not a verified network observation. | Plain provenance warning. |
| `components/v3/V3EpochPage.tsx:44` | Change | Without an after level and outcome, there is no realised change or error to reproduce. The forecast-level calculation remains a hypothetical projection. | Without the difficulty level after the adjustment and its outcome, there is no realised change or error to calculate. The projected difficulty level remains hypothetical. | Explains after level; retains missing outcome and hypothetical limits. |
| `components/v3/V3EpochPage.tsx:44` | Change | The before/after levels imply | The levels before and after imply | Uses natural phrase. |
| `components/v3/V3EpochPage.tsx:44` | Change | when rounded, matching the authored outcome. The error measures the gap between two percentage changes; it is not a percentage loss or trading return. | when rounded, matching the example outcome. The error measures the gap between two percentage changes; it is not a percentage loss or trading return. | Avoids internal editorial wording. |
| `components/v3/V3EpochPage.tsx:48` | Change | Read the dates as part of the record. | Dates and source records. | Concrete section heading. |
| `components/v3/V3EpochPage.tsx:54` | Change | What this record can establish | What this example can show | Plain evidence limit. |
| `components/v3/V3EpochPage.tsx:54` | Change | . A measured historical record would also need original input data, captured forecast timestamps, method version and a verifiable outcome. | . A measured historical record also needs original input data, saved forecast timestamps, the method version and an outcome that can be checked. | Preserves reproducibility requirements. |
| `components/v3/V3EpochPage.tsx:54` | Change | This is an editable example page, not an immutable archive. Corrections to a measured record should identify revisions and retain the evidence needed to reproduce the earlier result. | This example page can be edited. It is not a permanent, unchangeable archive. A corrected measured record should show what changed and keep the evidence needed to repeat the earlier result. | Explains archive permanence and correction policy. |
| `components/v3/V3EpochPage.tsx:54` | Change | . These authored examples do not form a verified shared timeline. | . These made-up examples do not share a verified timeline. | Keeps known inconsistency transparent. |
| `components/v3/V3EpochPage.tsx:56` | Change | Inspect another example record. | Compare another example. | Familiar wording. |
| `components/v3/V3EpochPage.tsx:57` | Change | Read the snapshot, level calculation and separate source series. | Read the current estimate and the separate example chart. | Keeps link description aligned with destination. |
| `components/v3/V3ReportPage.tsx:35` | Change | Use these criteria to check target, timing, error and evidence before comparing difficulty forecasts. | A fair forecast comparison uses the same target and timing, then tests error and uncertainty against recorded outcomes. | Explains central question rather than announcing criteria. |
| `components/v3/V3ReportPage.tsx:40` | Change | Check before comparing | In this report | Avoids imposing forecast comparison framing on network report. |
| `components/v3/V3ReportPage.tsx:44` | Change | Apply the criteria | Try the calculation | Task corresponds to actual linked example. |
| `components/v3/V3ReportPage.tsx:44` | Change | Run the error calculation on a sample. | Calculate error for five example forecasts. | Concrete heading. |
| `components/v3/V3ReportPage.tsx:44` | Change | Work through five synthetic pairs, reproduce each absolute error and their mean, and download the CSV to check the arithmetic yourself. | Find how far each forecast was from its outcome, then average those distances. The five pairs are synthetic, and the CSV contains every value. | Keeps synthetic, count, operation and downloadable evidence. |
| `components/v3/V3Methodology.tsx:16` | Change | Evaluate the method behind a forecast. | How is a difficulty forecast calculated? | Reader question first. |
| `components/v3/V3Methodology.tsx:16` | Change | A reproducible forecast needs identifiable inputs, an explicit calculation and evidence for its uncertainty claims. | To repeat a forecast calculation, you need its original inputs and method. Any range around the estimate needs evidence too. | Explains reproducible and uncertainty in plain terms. |
| `components/v3/V3Methodology.tsx:18` | Change | Reproduce the worked error calculation | Work through the error calculation | Natural reading action. |
| `components/v3/DataDetail.tsx:23` | Change | Synthetic learning dataset. | Synthetic examples. | Shorter label, same origin. |
| `components/v3/DataDetail.tsx:47` | Change | Authored range: | Example range: | Familiar wording. |
| `components/v3/DataDetail.tsx:48` | Change | No calibrated confidence level. | No tested confidence level. | Makes accessibility text clearer; retains lack of calibration. |
| `components/v3/DataDetail.tsx:75` | Change | Authored data · | Synthetic data · | Consistent origin terminology. |
| `components/v3/DataDetail.tsx:77` | Change | Difficulty changes in discrete steps; the line steps between the supplied example points. | Difficulty changes in steps. The line follows the supplied example points. | Explains chart behaviour plainly. |
| `components/v3/DataDetail.tsx:77` | Change | These values are derived from the series’ difficulty using the ten-minute target. They are not independent observations of hashrate. | These values convert the example difficulty into hashrate using the ten-minute target. They are not independent hashrate observations. | Keeps derivation and lack of separate measurement. |
| `components/v3/DataDetail.tsx:85` | Change | . This is a separate synthetic series, not a verified year of network history or a continuation of the snapshot above. | . This synthetic series is separate from the current reading above. It does not show a verified year of network history. | Clarifies data boundary. |
| `components/v3/DataDetail.tsx:87` | Change | Inspect all | Show all | Avoids source label suggesting externally sourced data. |
| `components/v3/DataDetail.tsx:87` | Change | source rows | example rows | Avoids source label suggesting externally sourced data. |
| `components/v3/SampleEvidence.tsx:12` | Change | Subtract the forecast from the example outcome, take the absolute value, then average those errors. No observations were collected from a network or forecaster for this dataset. | For each pair, subtract the forecast from the example outcome and ignore the minus sign, if any. Average those gaps. These values were not collected from the network or a forecaster. | Plain arithmetic instruction preserves all operations and origin. |
| `components/v3/data-reading.tsx:9` | Change | Live backend data is region-restricted. | The data service blocks requests from this region. | Clear failed state, retains region cause. |
| `components/v3/data-reading.tsx:10` | Change | No backend record is available. | The data service has no record for this request. | Names service rather than backend. |
| `components/v3/data-reading.tsx:11` | Change | Backend data could not be validated. | The data service returned a response this page could not read. | Explains unsupported response without claiming source values are wrong. |
| `components/v3/data-reading.tsx:12` | Change | Live backend data is unavailable. | The data service is unavailable. | Plain failed state. |
| `components/v3/data-reading.tsx:18` | Change | Current difficulty estimate | Next difficulty adjustment estimate | Aligns unavailable-state heading with the estimated future adjustment; current protocol difficulty is not itself an estimate. |
| `components/v3/data-reading.tsx:18` | Change | No sample estimate or authored range is substituted for live data. The endpoint does not publish a forecast interval. | This panel shows no substitute example values. The API does not publish a forecast range. | Keeps fail-closed behaviour and range absence. |
| `components/v3/data-reading.tsx:23` | Change | Live backend estimate | Current API estimate | Avoids implying verified freshness, which source cannot establish. |
| `components/v3/data-reading.tsx:24` | Change | Bitcoin difficulty scalar · source height | Bitcoin mining difficulty · source block | Explains subject; scalar detail remains below. |
| `components/v3/data-reading.tsx:25` | Change | Raw API value; unitless protocol difficulty. | Difficulty as returned by the API. It has no unit. | Explains unitless. |
| `components/v3/data-reading.tsx:25` | Change | Point estimate from the backend analytics response. | A single estimated value from the analytics API. | Explains point estimate. |
| `components/v3/data-reading.tsx:27` | Change | Backend returns a ratio; displayed as a percentage by multiplying by 100. | The API returns a ratio. This page multiplies it by 100 to show a percentage. | Preserves exact conversion. |
| `components/v3/data-reading.tsx:32` | Change | The backend endpoint publishes a point estimate only; no interval is returned. | The API supplies a single estimate, with no lower or upper forecast limit. | Explains absent interval. |
| `components/v3/data-reading.tsx:34` | Change | The response has no source timestamp for its current block. Its age cannot be independently verified; response received | The API does not say when its current block was recorded, so this page cannot verify the data’s age. Response received | Keeps freshness gap and received-time distinction. |
| `components/v3/data-reading.tsx:42` | Change | No synthetic centre or authored spread is substituted for backend data. | This panel shows no made-up estimate or range in place of source data. | Explains fail-closed behaviour. |
| `components/v3/data-reading.tsx:53` | Change | Observed rolling network hashrate | Network hashrate over recent blocks | Explains rolling without claiming direct measurement. |
| `components/v3/data-reading.tsx:53` | Change | Backend record | API record | Consistent source naming. |
| `components/v3/data-reading.tsx:57` | Change | These are rolling averages of network work, not machine counts or forecast intervals. API values are stored as H/s decimal strings and converted to EH/s without rounding. | These estimates average network work over recent blocks. They are not machine counts or forecast ranges. The API supplies decimal values in H/s as text; conversion to EH/s preserves their full precision. | Retains window interpretation, units, string storage and exact precision. |

## Owned source files

- `components/v3/ResearchIndex.tsx`
- `components/v3/ResearchArchiveSummary.tsx`
- `components/v3/ResearchEvidencePreview.tsx`
- `components/v3/V3DataIndex.tsx`
- `components/v3/V3Difficulty.tsx`
- `components/v3/V3Hashrate.tsx`
- `components/v3/V3Scoreboard.tsx`
- `components/v3/V3ForecastExample.tsx`
- `components/v3/V3EpochPage.tsx`
- `components/v3/V3ReportPage.tsx`
- `components/v3/V3Methodology.tsx`
- `components/v3/DataDetail.tsx`
- `components/v3/SampleEvidence.tsx`
- `components/v3/data-reading.tsx`

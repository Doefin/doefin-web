# Independent readability review, 6 Nov 2026

Scope: Numbers and Accuracy only, following the parent's narrowed assignment. This evaluator did not implement either package. Reviewed the actual working-tree diffs and complete components against `docs/readability-acceptance-2026-11-06.md`, `CLAUDE.md`, pinned brand v0.2.0 (`936bc5c`), and the doefin-humanise review procedure. Worker handoffs were supporting context, not the acceptance evidence. No source or CMS changes were made by this review.

## Numbers: Accept

No required revision found. Primary difficulty, hashrate and percentage figures are shorter without changing the supplied data or its interpretation. Both server and browser recovery displays call the same three formatters. Trillions, EH/s, signed percentage changes, approximation markers and zero are explained consistently.

- Independently compared **4,839 formatter results** against Python `Decimal`, using precision 2,500 and `ROUND_HALF_UP`, rather than the implementation's digit algorithm. Deterministic seed `6112026`; 1,600 generated decimal inputs across all three formatters plus 39 explicit boundaries. Covered signed and long coefficients, leading decimal points, positive/negative exponents, tiny nonzero values, rounding carries, half-way values, zero/negative zero and exponent boundaries. **Zero mismatches.** The oracle and runner are `/tmp/doefin-independent-numeric-review.py`.
- Ran `node scripts/check-readable-numbers.mjs`: **86 numeric cases passed**, with actual component static-render assertions for server panels and injected browser recovery state. Exact values, labels, source height/date context and native closed `details` are retained in HTML. Failed requests and empty windows have no substitute values or exact-value disclosures; current/stale/future freshness branches remain distinct.
- Read the complete server and browser components and their diffs. Endpoint selection, effect lifecycle, abort/timer handling, request/parser calls, source-status branches, freshness calculation and missing-window filtering are unchanged. `git diff --exit-code` confirmed no change to `lib/bitcoin-analytics-contract.ts` or `lib/browser-analytics.ts`.
- Ran `node scripts/check-bitcoin-analytics.mjs`: exact conversion, parser, 451/404/503, valid browser response and network/CORS-failure regressions passed.
- Hashrate strings remain exact in H/s and the unchanged exact EH/s converter. Difficulty values retain `String(sourceNumber)` and the original source ratio. The separately labelled ratio × 100 result retains its prior JavaScript arithmetic; this is not a claim to recover JSON precision or formatting already lost before the numeric value reached the component.
- Extracted all four rendered panel variants, including closed disclosures, and ran the Python web copy checker: **0 CUT, 0 STYLE, 1 CHECK**. Retained passage: “Forecast range: unavailable; this endpoint returns a point estimate only.” `returns` describes the API response, not an investment return.

The implementation preserves the distinction between response time and unavailable difficulty source age, and between rolling hashrate estimates and a forecast range. Synthetic server-render fixtures and injected hook state are focused evidence; they do not prove a live browser request, hydration or responsive layout.

## Accuracy: Accept

No required revision found. The primary lesson now follows one unchanged A/B/C dataset: model A's block 911,232 row, its two absolute errors and mean, the same models' coverage/width/missing summary, then the A/B trade-off. The five-pair exercise is a clearly labelled optional destination and is explicitly described as having no forecast ranges.

Independently recomputed the unchanged input rows with Python `Decimal`:

| Model | Individual absolute errors (pp) | Mean error (pp) | Coverage | Mean scored width (pp) | Scored / missing |
| --- | --- | --- | --- | --- | --- |
| A | 1.32, 0.72 | 1.02 | 100% | 6.45 | 2 / 1 |
| B | 0.44, 0.96 | 0.70 | 50% | 1.50 | 2 / 1 |
| C | 2.06, 1.84 | 1.95 | 100% | 10.00 | 2 / 1 |

The continuing A row has forecast +1.12%, outcome +1.84%, error 0.72 pp, range −1.90% to +4.10% and width 6.00 pp; the outcome is inside that range. Missing outcomes are excluded from every score, including width, as the unchanged helper specifies. The content/helper file is byte-for-byte unchanged from `HEAD`.

- Read the complete scoreboard, comparison, shared page wrapper and archive child, and compared the two changed modules with `HEAD`. The page keeps equal weighting, direction/individual-miss limits, widths beside coverage, the stated-confidence caveat and the need for many comparable forecasts before calibration claims.
- The synthetic models/outcomes, common assumed 1,008-block lead, missing third outcome, absence of actual provider performance/ranking and lack of captured forecasts or source record pages remain explicit. The measured section keeps zero observed periods scored, unavailable measured errors/coverage, historical observations versus predictions, comparable targets/lead times, timestamps/source inputs/method versions, dates/counts/exclusions including large misses, and the selected-sample/future/trading/fleet-production limits.
- Independently rendered the actual scoreboard component tree, including actual `DataDetail`, archive component and content, with link/SEO adapters only. Assertions verified continuing reading order, all nine complete source rows inside native HTML details, and `sample-error-title`, `illustrative-comparison-title` and `prospective-archive`. The runner and HTML are `/tmp/doefin-independent-render-review.cjs` and `/tmp/doefin-independent-scoreboard.html`.
- Public historical research, comparison guide, optional five-pair/CSV exercise, methodology, data library, dataset download, API/citation manifest and archive destinations remain available. The unrelated source records and exercise data are not removed.
- Extracted final metadata and complete rendered prose, excluding JSON-LD scripts, and ran the Python web copy checker: **0 CUT, 0 STYLE, 1 CHECK**. Retained passage: “Return to the data field guide”. `Return` is a navigation action, not a financial claim.

Editorial judgement: definitions now arrive beside the figures they explain, and each stage adds a distinct point. The lesson does not switch to another fictional dataset or present the observed research count as forecast evidence. The retained qualifications support the shorter page without requiring the reader to open the optional source rows to understand its central limits.

## Shared checks and limits

`npm run check:brand` passed: vendor intact, **0 CUT, 0 STYLE, 1 contextual CHECK** in Accuracy. `git diff --check` passed for the reviewed implementation files. This reviewer did not run a build or global typecheck, inspect a live deployment, operate the browser, change proposals, write CMS content or commit. Parent integration must still verify the complete reconstructed pages on desktop/mobile and run the required build, typecheck, rendered brand, crawler, SEO and regression checks.

Reviewed implementation SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `lib/readable-numbers.ts` | `c5bb50b5a3479c0b3168c007be6d360d0393c352dbcf0381eeb30dee1c876b09` |
| `components/v3/data-reading.tsx` | `0c2d3263cf919c66be6548e54c83d4e060e084035e22ca25fbe404bbe17a5aa9` |
| `components/v3/BrowserAnalyticsFallback.tsx` | `6ae18121305ff1e9c7e167727a038b484bac80fee6a528ed93469491c8005e4b` |
| `scripts/check-readable-numbers.mjs` | `d967bc91606dc31412bd84070a9e2ecb9616bd3ecab92291e7b9ae26d16531c7` |
| `components/v3/V3Scoreboard.tsx` | `2a7663e2a97662d8bef957ec8c2dabc3a3f7ee667e278c01294c61b9f3a5494d` |
| `components/v3/IllustrativeComparison.tsx` | `edb6aff776f5cd76be42125c018d66a46665f3e1591db36a765b51e283c5d119` |
| Unchanged `content/v3-forecast-comparison.ts` | `eebcbcc14d8d18c8cc732169e15c87efdaf108c2d468cbff25dfd7664d78b83f` |

## Incremental server/browser status recheck: Accept

The parent found a genuine clarity issue during browser verification: an unsuccessful server request left a global service-unavailable/no-values message above successful browser recovery. The revised `sourceStatus` headings/messages and both failure badges now explicitly describe the **server request or its response**. They remain truthful when HTTP 200 browser values appear below them. The unavailable-service case no longer claims the whole data service is unavailable; the region-restricted, missing-record and unsupported-response cases identify which request supplied that evidence. No required revision remains.

Independently rendered **10 combined states** using the actual server panels and browser recovery component, with successful browser hook state injected: both difficulty and hashrate after server 451, 404, invalid HTTP 200, HTTP 503 and network/no-status failure. All cases retain the server-specific failure message, distinct “Live API data from this browser · HTTP 200”, readable values and exact-source disclosure. The old unscoped assertions are absent. This test also uses the actual unchanged `describeServerOutcome` strings, so it checks the two messages together rather than testing isolated fragments. Runner: `/tmp/doefin-independent-server-recovery.cjs`.

Re-ran the 86-case number/component checks and the file whitespace check: passed. Extracted combined-state prose: **0 CUT, 0 STYLE**. The repeated contextual CHECKs concern the already documented point-estimate sentence and the unchanged passage “The server request did not return usable data; the browser request succeeded.” Both describe API responses, not financial returns. Request/status mapping, fetches, parsing, freshness and fallback behaviour are unchanged; this incremental acceptance concerns the corrected wording and combined rendering. Parent browser/build verification remains separate evidence.

Updated `components/v3/data-reading.tsx` SHA-256: `58fb2bc4cf08cd238406179b0e5f7bb53738182fcf970efc974795b5f6291d43`. This supersedes that file's hash in the original reviewed-state table above.

# Independent structure review, 6 Nov 2026

Codex independent review of the first three frozen packages. I did not implement their source or CMS proposals. This is acceptance of their editorial and source-level requirements, not human sign-off, publication approval or browser/runtime verification.

| Package | Initial finding | Final verdict |
| --- | --- | --- |
| Institutions | No required revision | **Accept** |
| Research and data | No required revision | **Accept** |
| Articles | Incorrect inference from negative final cash balance | **Accept after verified correction** |

## Basis and checks

Read the acceptance document, project rules, pinned brand 0.2.0 (`936bc5c`), Matteo’s thinking and edits, voice/compliance/channel/content-type/visual rules, voice-editor procedure, and the `doefin-humanise` skill. Inspected actual source diffs and complete pages, with adjacent components and applicable model code. The three worker reports were evidence inventories, not substitutes for reading the result.

CMS checks used the complete published `.result` in `work/brand-copy-validation/structure-current-published-2026-11-06.json`. I independently resolved and applied the keyed proposal paths locally: 19 research rows across three documents and 10 article rows across two documents have exact current-published before values. All section keys and IDs, other metadata, slugs, dates and references remain equal. The complete protected first section of the hashrate article, including all E30 paragraphs, remains exact. The corrected growth summary is 154 characters.

I inspected and reran the bounded research React source-render harness in separate `/tmp/independent-structure-review-*` outputs. It applies the proposals to that fresh snapshot and parses complete documents using the actual research parser. All six reconstructed pages retain every previous rendered ID and destination; no duplicate IDs occur. This harness stubs analytics as unavailable, omits delivery/layout components and simplifies autolinking. It is evidence of source reconstruction and reading order, not a Next server or visual browser test.

Separate checks recomputed the production arithmetic and exercised the actual `simulate` function extracted from `PaybackModel.tsx`, with the real `networkEHFromDifficulty` export. No calculator code was altered.

## Institutions: Accept

The page now has a distinct path: identify the instrument → explain production versus payout → inspect actual markets → follow one review sequence → ask a specific question. The removed role cards, checklist and detached documentation cards previously repeated preparation instructions; the revised steps attach each guide to the question it answers.

**Keep:** “Production depends on difficulty throughout the period” followed by the fixed winning payout at one observation block. This is the useful mechanism missing from the old instruction merely to model production separately. It explains why a position may pay nothing despite lower production, and why a payout can exceed or fall short of the production difference. It follows Matteo’s exposure-first and precise-qualification habits (1, 3 and 4).

**Keep:** the labelled production example. `1 ÷ 1.10 = 0.909090… BTC`, displayed as `0.909 BTC`. It holds difficulty 10% higher throughout the same period, with hashrate, uptime, block reward and other assumptions unchanged. It is explicitly illustrative, not a forecast or position size. It introduces no position price, payout amount or trade return.

**Keep:** the single review sequence. It retains the cash-plan/borrower purpose, fleet assumptions, period, business decision, inputs/results, model limits, open questions and private-note warning; thresholds, observation and settlement blocks, payout/redemption; funding, collateral, fees, reporting/cash needs; depth, partial fills, exit options, custody/deployments/technical evidence; mandate, eligibility, legal/accounting review and amount approval; no minimum fleet/capital amount and own suitability review. These are distinct requirements, not filler. Full-payment loss, partial hedge, liquidity and collateral/technical risks remain explicit. The unchanged explorer still distinguishes indicative prices from execution and app opening from placing an order.

The page’s four existing IDs remain unchanged, as does the child’s `market-explorer` anchor. All prior destination links remain, including the former array-defined documentation links, both contact subjects and the scenario brief. The hero remains exact. No required writing revision remains. Desktop/mobile spacing and the two-column example still require the parent’s rendered inspection. The rearranged settlement/collateral and mandate passages remain for Matteo’s reading under the brand rules.

## Research and data: Accept

The methodology now honestly promises assessment, then teaches a simple mechanism: observed block pace → estimated full-period duration → projected difficulty. It distinguishes this explanatory extrapolation from a verified Doefin algorithm. Protocol limits, the exact counted intervals and rounding/version details are required in the reproducibility section; irregular timing and the continuation assumption sit beside the mechanism. Neither the projected difficulty nor calendar date is described as a measured future value. This resolves the heading/promise mismatch without inventing a service specification.

The scoreboard now earns its comparison. Independently reading the unchanged authored inputs gives:

| Fictional model | Absolute errors | Mean error | Inclusions | Mean width |
| --- | --- | --- | --- | --- |
| A | 1.32 pp, 0.72 pp | 1.02 pp | 2/2 = 100% | (6.90 + 6.00)/2 = 6.45 pp |
| B | 0.44 pp, 0.96 pp | 0.70 pp | 1/2 = 50% | (2.00 + 1.00)/2 = 1.50 pp |
| C | 2.06 pp, 1.84 pp | 1.95 pp | 2/2 = 100% | 10.00 pp |

Each model still has two scored and one missing outcome. The new interpretation correctly says B’s point estimates are closer on average while A’s wider ranges include more outcomes. It expressly denies that two invented outcomes establish a better model. The separate five-pair illustration remains a 1.00 pp arithmetic example with no interval limits; it is not confused with observed adjustment periods or the A/B comparison. The one synthetic range inclusion is not sold as a confidence test.

The observed report keeps its findings first, followed by reproducible arithmetic, provenance/citation and evidence limits. Consolidation retains every material distinction: fixed one-year source capture; 26-to-25 inclusion; 2,016-block spacing; full-precision ratio calculation; equal weighting; same-provider consistency versus independent node verification; rolling source window versus selected profitable periods; open downloads; stable ID/version and new-version updates; checksums versus publication-time or immutability proof; no deposited DOI; zero forecast archive records; no retrospective proof of publication before an outcome or listing. Forecast comparison still requires original predictions/ranges, input/source/version/outcome definitions, comparable lead times, original publication/capture, failed/missing records and exclusions. No ranking, forecasting advantage, calibrated confidence, volatility estimate, mining profit or trading return is asserted.

Reading the reconstructed pages in order, current readings now precede historical data on `/data`, and synthetic rows stay locally labelled inside details. The research index’s removed generic notice is replaced by labels next to the actual observation and example blocks. Optional technical details remain in HTML. No required writing revision remains; live API behaviour and browser layout remain with the parent.

## Articles: Accept after correction

The growth article now explains the missing causal chain: higher difficulty at fixed fleet hashrate → less expected BTC production → less expected revenue at fixed BTC price → less cash after power costs to recover the same initial outlay. The illustrative 1 BTC month at a difficulty level 10% higher is correctly separate from monthly compounding. `1/1.10 = 0.909090…`; the reduction is `9.090909…%`, so `0.909 BTC` and `9.1%` are correct. The simulation applies the growth factor before each month’s production, starts at negative capital cost, adds mining revenue less power cost, and records the first non-negative balance. The text matches those mechanics.

**Required correction found and verified:** the first proposal said: “If the model ends with a negative cash balance, the initial outlay has not been recovered within that period.” That inference was false because first payback can precede subsequent operating losses. With supported inputs of 1,000 TH/s, 15 J/TH, $0.045/kWh, $5,000 capital cost, $90,000/BTC, 127.48T, 3% monthly growth and 120 months, the actual function records payback in month 8 (balance about $531.16) but ends at about −$20,419.76. At 8% growth with the same other inputs it records no payback and ends at about −$47,234.18. These are evaluator test cases, not proposed public financial examples.

I re-read the corrected exact proposal. It now says no month reaching zero means no payback in the selected period; a negative ending balance can follow earlier recovery when later power cost exceeds revenue; read the first payback month and full cash path together. This resolves the finding without a model change. The worker’s handoff records the correction. All original suitability, timing, transaction-cost, liquidity, operational and no-measured-hedge-threshold limits remain.

The chart article preserves E30 exactly, then explains a hypothetical fast-block run affecting a short window more than a long one with the same end time. It retains irregular arrivals, different timestamps/difficulty inputs, 144 blocks not always meaning 24 hours, and the inability to infer actual machine additions from the gap alone. The band section explains the centre line versus uncertainty and distinguishes timing variation from correct inputs. It retains the exact lack of measured widths or identified recent noise. No real event or measured confidence number is invented. The generic market-performance shell sentence was unrelated to these articles and its removal loses no specific risk or evidence qualification. The shared footer remains intact.

## Final phrasing checks and limits

Independent extracted-prose checks: Institutions 0 CUT / 0 STYLE / 0 CHECK; corrected complete articles 0 / 0 / 0; six research harness pages 0 CUT / 0 STYLE / 4 CHECK matches. The research CHECK passages are “Return to the data field guide” (navigation), “the study does not select profitable periods” (source-window limit), and “They establish no forecasting advantage, mining profit or trading return” (two matches, a necessary evidence limit). Keep all three.

`npm run check:brand` passed: vendor intact, 0 CUT and 0 STYLE. Its shared-diff CHECKs also include homepage and settlement passages owned by the later package, plus scoreboard navigation; this run does not constitute review of those later packages.

No build, global typecheck, browser interaction, CMS write, network mutation, commit or push was performed by this evaluator. Parent build/crawler/SEO/focused regression and desktop/mobile reconstruction, followed by draft conflict/application checks, remain required before the complete task is accepted. No required source or CMS-proposal revision remains in these three packages.

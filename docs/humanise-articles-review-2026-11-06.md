# Articles and Academy editorial pass, 6 Nov 2026

Codex editorial pass for Fardin to read. Source-shell changes are implemented locally. The 33 CMS rows in `studio/rewrites/2026-11-06-articles-plain-language.json` are proposals only. No CMS write or publication was performed.

## Source and scope

Read all six owned component files and all five complete published articles in context, including summaries, headings, adjacent paragraphs, onward links and evidence limits. `V3BlogIndex.tsx` and `EditorialCover.tsx` are Keep. They already explain their purpose in natural language and distinguish illustrations from data. No About or Block subsidy content, migration seeds, schema or vendor files were edited.

Authoritative brand: vendored Doefin brand 0.2.0, commit `936bc5c`. Read Matteo’s thinking first, then edits E28–E31 and the relevant definition/precision examples, voice, compliance, website, research, tool and educational guidance, visual guidance and the voice-editor procedure. Read the installed Next.js layouts/pages guidance before source edits. Method: put the reader’s concrete question first; explain the reason and limit in plain, active English. Do not use an AI-detector score or an arbitrary readability target.

A fresh origin API read with `perspective=published` returned all five full keyed articles. Local evidence is saved at `work/brand-copy-validation/articles-published-plain-language-2026-11-06.json` (ignored, not a deployable content source). No seed was used as a current baseline. The earlier HTTP snapshot was used to understand the rendered reading path.

| Published document | Baseline revision |
| --- | --- |
| `editorial-academy-how-difficulty-adjustment-works` | `Mac7TZNCor7fzOhjX9rXjl` |
| `editorial-academy-what-hashprice-means` | `Mac7TZNCor7fzOhjX9rgYw` |
| `editorial-academy-why-forecasts-need-error-bars` | `Xd6iQy1NoBvyei09Kq5IgV` |
| `editorial-blog-reading-a-hashrate-chart-honestly` | `JYRqnCqPqeQAja5ejqVoIy` |
| `editorial-blog-what-a-static-growth-assumption-costs-you` | `Xd6iQy1NoBvyei09KqKRLb` |

Every proposal has the exact fresh published `before` value and a keyed path. These are expected-source checks, not permission to overwrite a later edit or an existing Studio draft. Recheck the live document and any draft before applying proposals.

## Substantial changes and fact preservation

The JSON contains every complete before/after passage and a reason for each Change. These examples show the editorial decisions; unchanged definitions and material qualifications are part of the review too.

| Article/block | Before | After | Facts and limits retained |
| --- | --- | --- | --- |
| Static growth, first heading | State the assumption | An assumption is not a forecast | Scenario input, stated time period, historical-data distinction and dated-forecast distinction. |
| Static growth, comparison | Run the same fleet assumptions with different difficulty paths. | Changing the difficulty path changes the production and payback estimates for a fleet. | Compare paths for the same fleet; hold power cost, uptime, capital cost and Bitcoin price constant to isolate the changed input. No result is presented as measured. |
| Static growth, limits heading | Keep the decision proportional to the evidence | What a calculator cannot decide | Sensitivity does not establish suitability or economics. Timing, transaction costs, liquidity, operational constraints and objectives all survive. The no-measured-hedging-threshold sentence is verbatim. |
| Hashrate chart, heading | An estimate from observable inputs | How network hashrate is estimated | All three E30 paragraphs remain byte-for-byte unchanged, including the ten-minute and 144-block facts and the difficulty contract distinction. |
| Hashrate chart, comparison | Compare like with like | Why two charts can differ | Irregular blocks, differing windows, matching timestamps/difficulty inputs and the inability to infer capacity changes from a chart alone. |
| Hashrate chart, uncertainty | Ask how uncertainty was estimated | What an error band can tell you | Method and assumptions determine interpretation. No measured band widths and no attribution of a recent movement to noise. |
| Difficulty adjustment, rule paragraph | Each adjustment uses the elapsed time of the preceding period: faster block production raises difficulty and slower production lowers it, within the protocol’s limits. | The adjustment uses the time taken by the preceding period. Faster block production raises difficulty and slower production lowers it, within the protocol’s limits. | Every 2,016 blocks, average about ten minutes, preceding-period timing, both directions and protocol limits. The BTC-production formula and all production/revenue qualifications elsewhere remain verbatim. |
| Hashprice, inputs heading | Check the inputs | Why published hashprices can differ | Difficulty, block rewards, transaction fees, Bitcoin price source, observation window, averaging method and price timestamp. No attributed publisher discrepancy. |
| Hashprice, economics heading | Keep revenue distinct from profit | Hashprice does not measure profit | Revenue versus margin, power/hosting/maintenance/other costs, compatible units, efficiency and uptime. No profit figure or investment outcome. |
| Hashprice, fees heading | Do not assume a constant fee share | The fee share changes over time | Variable fee revenue, period and source requirement. Exact current-share and publisher-cause evidence limit retained. |
| Forecasts, title | Why difficulty forecasts need uncertainty | Why difficulty forecasts need a range | The article still separates point forecasts, uncertainty ranges and evidence of accuracy. No validated range or coverage claim. Slug and dates unchanged. |
| Forecasts, accuracy heading | Evaluate accuracy and calibration | Accuracy and coverage measure different things | Point-error definition, coverage frequency, width, lead time, missing observations and method changes. Unfamiliar terms are explained instead of left as a checklist. |
| Forecasts, evidence heading | Look for a reproducible record | What evidence of accuracy requires | Original forecasts, source outcomes, evaluation period and reproducibility. Both sample-data limit sentences remain verbatim: no calibration, ranking or general competing-forecaster claim. |

## Source-shell decisions

| Location | Decision and before/after |
| --- | --- |
| `V3Editorial.tsx` collection headings | Change “Understand the moving parts.” to “Understand Bitcoin mining.” and “Read the assumptions behind the number.” to “Understand mining data and assumptions.” The Academy summary now explains what the concepts affect. |
| `V3Editorial.tsx` links | Change “Work with your own assumptions” to “Compare your mining assumptions”; “Inspect a worked research example” to “Read a worked research example”; “Evaluate a forecast’s method” to “Read how the forecast is calculated”. Targets remain identical. |
| `V3BlogPost.tsx` method link | Change “Inspect the calculation and limitations of the sample index.” to “See how the sample index is calculated and what it cannot tell you.” |
| `V3BlogPost.tsx` article boundary | Cut the generic fragment “Educational context for evaluating assumptions.” Keep “This article does not report measured market performance.” verbatim. |
| `V3AcademyIndex.tsx` guide explanations | Change “Size production exposure” to “Estimate production changes”; “Payback across assumptions” to “Payback under different assumptions”; “Each guide answers one question.” to “Work through a mining calculation.” Explain that each guide covers inputs, an example and the meaning of the result. “Read the result:” becomes “Calculator estimate:”. |
| `V3AcademyIndex.tsx` references | “Keep a reference nearby” becomes “Mining terms”; “A term you have not met?” becomes “Find a definition.”; “Follow the evidence” becomes “Research methods”. Research description now says “Read a worked research example, including its method and limitations.” |
| `ArticleLibrary.tsx` card label | Change “Perspective” to “Educational article”, consistent with the existing article classification. |
| `V3BlogIndex.tsx`, `EditorialCover.tsx` | Keep all wording. The index already describes mining assumptions and evidence limits plainly. Covers already say “Concept illustration” and avoid presenting sketches as plotted data. |

## Checks and remaining review

- Proposal validation: 33 unique paths across five documents; all exact `before` values resolve against the fresh keyed published snapshot. Whole paragraph arrays retain their lengths. `_key`, section `id`, document metadata, slugs, topic references and all Arabic numeric tokens are unchanged. The production formula, ten-minute and 144-block facts remain intact by direct reading as well.
- Source validation: TypeScript syntax-tree comparison across all six owned components found identical syntax structure after masking text values. Protected properties and non-prose attributes, including paths, hrefs, IDs, keys and classes, are unchanged. This verifies copy-only scope.
- Python web-channel prose scan of the complete five proposed articles: **0 CUT, 0 STYLE, 2 CHECK**. Python scan of extracted prose from all six owned source components: **0 CUT, 0 STYLE, 0 CHECK**.
- `npm run typecheck`: passed. `npm run check:brand`: passed; vendor intact, 0 CUT. Its CHECK/STYLE findings belonged to concurrently edited files outside this assignment, not the four changed article components.
- No build, rendered proposal preview or browser QA was performed in this subtask. The proposed CMS wording is not current runtime content until an editor applies it. Parent validation covers the integrated branch.

Exact remaining CHECK passages, both in `editorial-academy-what-hashprice-means`:

1. `sections[_key=="section-2"].heading`: “Hashprice does not measure profit”. This states the necessary revenue/profit distinction; it makes no return claim.
2. `sections[_key=="section-2"].paragraphs`: “Hashprice describes revenue, not an operation’s margin. Profit also depends on power, hosting, maintenance and other costs, as well as fleet efficiency and uptime. Revenue and costs need to be expressed in compatible units for the comparison to be meaningful.” The cost and operational qualifications must remain.

Matteo review: the static-growth suitability/economics paragraph is reworded around a position’s limitations. It retains the original meaning and introduces no product claim, but should be read before publication. Settlement/collateral wording and all E30 contract wording are unchanged. No new financial example or performance figure was added.

Final consecutive reading: each article moves from mechanism or definition to the reason comparisons can differ, then to the limit of the evidence. The remaining “Check the method, time window and units” instruction in the hashrate article is Matteo’s exact approved E30 wording and stays. Evidence-limit sentences still use a more formal register than the teaching paragraphs because their scope must stay precise. The articles remain short conceptual introductions: there is no validated numerical uncertainty band or measured hedging threshold to add, and inventing one would weaken them. No repetitive conclusion or anecdote was added.

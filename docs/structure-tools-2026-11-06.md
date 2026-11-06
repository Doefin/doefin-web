# Calculator labels and guide structure, 6 Nov 2026

Codex pass on the difficulty calculator’s result labels, the shared guide input heading and the three current published calculator guides. This is a frozen local package for independent review. It makes no CMS changes and is not publication approval.

Source edits are limited to `components/tools/ExposureSizer.tsx` and `components/tools/GuideArticle.tsx`. No edit to `V3ToolPage.tsx` was necessary. The guide proposals are in `studio/rewrites/2026-11-06-structure-tools.json`: 24 exact before/after rows across three documents. Every `before` comes from `work/brand-copy-validation/structure-current-published-2026-11-06.json`, not the migration seeds or earlier draft packages. The three baseline guide records were updated at `2026-11-06T11:09:46Z`.

Baseline SHA-256: `9f58854fcf56c718319dd20afae0b0572018e7869c536025164d1bcbfa379789`.
Proposal SHA-256: `a404ce327d385f8443e95fb1d1baa9a4bfd57585d9eb616fb07be7a96a412c34`.

Read the project instructions and used the doefin-humanise procedure with vendored brand v0.2.0 (`936bc5c`): Matteo’s thinking first, relevant edits including E24/E25/E28, voice, compliance, website, content types, visual rules and site tokens. The purpose is to name actual quantities and explain the calculation, rather than make a series of synonym changes.

## Before and after structure

| Surface | Before | After |
| --- | --- | --- |
| Difficulty calculator main result | “Your exposure” above easier-case production minus harder-case production | “Production difference”, with “between the easier and harder cases” in the amount/time caption |
| Difficulty calculator compact result | BTC value labelled only “spread” | “production difference” plus “Easier case minus harder case”; the duration remains visible |
| Difficulty guide result explanation | “Your exposure” | “Production difference”, with the subtraction and unchanged-baseline distinction stated directly |
| Every guide input | “Typical range”, even when the text describes a hard limit or a made-up sample | “Input limits and sample”; each entry names actual bounds, units and the illustrative default |
| Payback settings | Seven explanations, although the current calculator also exposes Model horizon | Existing seven keyed entries retained, plus `input-7` for the existing horizon control |
| Hosting introduction | Repeats the full arithmetic that appears again in the worked example | Brief account of what is calculated; exact numerical arithmetic stays in the worked example |
| Hosting instructions and result notes | Repeats the percentage-versus-final-rate caveat and adds detours about provider honesty, quality, rankings or recommendations | Instructions explain entering/comparing the same billing assumptions. The percentage result explains why final $/kWh also matters. Provider judgements are removed. |
| Guide navigation and sections | Six anchored sections | Same six anchored sections; no structural churn where the issue is a label or a repeated explanation |

The hosting flow is: what the cost represents and who its billing assumption fits; how to enter the terms; each input’s meaning and limits; what the results mean; worked arithmetic; concrete mistakes; model limits. Each part has a different job. The worked example is still the place to reproduce the figures.

## Key before and after passages

Quotations below document the change; they are not extra page copy.

- Calculator: “Your exposure” → “Production difference”. Compact “spread · [weeks] weeks” → “production difference · [weeks] weeks” and “Easier case minus harder case”. Numeric bindings remain `out.spreadBtc` and `out.spreadUsd`.
- Shared heading: “Typical range:” → “Input limits and sample:”. The CMS field key remains `typical`; no schema or runtime lookup key is renamed.
- Difficulty result: “The BTC difference between production in the easier and harder scenarios…” → “Expected production in the easier case minus expected production in the harder case. With the sample inputs, the difference is about 2.525 BTC.” The next sentence retains that it is not the shortfall against unchanged difficulty.
- Hosting introduction: “It adds management and power-factor percentages to the advertised rate, then divides by the share of hours when machines run. It then divides by one minus the pool-fee fraction…” → “This calculator converts a hosting rate into an equivalent cost per productive kWh. It adds separately billed fees to the rate. When stopped hours remain payable, the same cost is spread over fewer productive hours. The pool’s revenue deduction is then expressed as a cost adjustment.” The exact operations remain in the settings and worked example.
- Hosting percentage result: “This shows how your inputs change the starting rate. It does not rate the provider’s honesty or quality.” → “Compare the final $/kWh rates as well as the percentage increases. A lower percentage increase can still leave a higher final cost.”
- Intermediate hosting result: “Use the working to check the arithmetic and compare assumptions. The model does not recommend a provider.” → “The change at each step shows how much that adjustment adds to the starting rate.”
- Hosting mistake: “Treating the percentage uplift as a provider rating or comparing uplift percentages without comparing the absolute final rates.” → “Comparing percentage increases without comparing the final rates in $/kWh.”
- Hosting final limit: “The defaults and presets are illustrative. No market rates, provider ranking or safe decision threshold are established here.” → “The defaults and presets are illustrative, not observed market rates. This comparison does not establish a decision threshold.”

## Input bounds, defaults and units

Every value below was checked against the actual controls/defaults. These are supported input bounds and illustrative defaults, not observed normal values or eligibility rules.

| Guide / input | Supported bounds | Illustrative default |
| --- | --- | --- |
| Difficulty: hashrate | 0.01–30 EH/s | 1 EH/s |
| Difficulty: horizon | 1–13 modelled epochs, about 2–26 weeks | 4 epochs, about 8 weeks |
| Difficulty: transaction fees | 0–0.5 BTC per block | 0.05 BTC per block |
| Difficulty: BTC price | $20,000–$200,000 per BTC | $64,000 per BTC |
| Difficulty: easier case | 0–15% lower difficulty | 2.4% lower |
| Difficulty: harder case | 0–15% higher difficulty | 7% higher |
| Difficulty: starting difficulty | 1T–1,000T | 127.48T |
| Payback: fleet hashrate | 100–20,000 TH/s | 1,000 TH/s |
| Payback: efficiency | 12–40 J/TH | 15 J/TH |
| Payback: power | $0.02–$0.15/kWh | $0.045/kWh |
| Payback: initial outlay | $5,000–$2,000,000 | $20,000 |
| Payback: BTC price | $20,000–$200,000 per BTC | $90,000 per BTC |
| Payback: central difficulty growth | 0–8% per month | 1.5% per month |
| Payback: starting difficulty | 1T–1,000T | 127.48T |
| Payback: model horizon | 2–120 months | 48 months |
| Hosting: advertised rate | $0–$0.20/kWh | $0.065/kWh |
| Hosting: management fee | 0–30% of advertised power rate | 5% |
| Hosting: power-factor adjustment | 0–30% of advertised power rate | 3% |
| Hosting: downtime | 0–30% of hours | 4% |
| Hosting: curtailment | 0–30% of hours | 6% |
| Hosting: pool fee | 0–30% of revenue | 2% |

The difficulty price slider uses $1,000 steps. The payback central-growth limit does not limit its derived comparison rows: lower subtracts two percentage points with a zero floor; higher adds three points. Those distinctions remain in the guide. Difficulty periods use 2,016 target block intervals per epoch; payback uses 30.4 days per month. Neither is a promise about calendar timing or production.

The new payback `inputs` proposal is an array of objects, not a paragraph array. It preserves the seven existing `_key` and `_type` values and appends `{_key: "input-7", _type: "inputsEntry"}`. The item has nonempty `label`, `means`, `whereToFind` and `typical` fields. Its explanation covers the finite horizon and says a negative final balance does not establish what happens later. It adds no control. The whole array is one exact-before proposal to avoid overlapping scalar patches. All array-valued proposal rows use verdict `Matteo`, as required by the checker/planner contract.

## Numerical explanations and necessary qualifications

| Fact or limit | Location after the change |
| --- | --- |
| Easier-minus-harder production difference versus starting-case shortfall | Calculator main/compact result and difficulty guide reading results; harder-case row remains separate |
| Actual defaults, limits, units and sample status | Each guide’s input rows under the revised shared heading |
| Same hashrate, constant-difficulty period, fixed reward assumptions; no forecast, payout or position size | Existing difficulty introduction, instructions, example and limits retained |
| Booked capacity payable while machines stop | Hosting audience condition, downtime/curtailment inputs and first model limit |
| Additive management and power-factor percentages, not compounding | Existing hosting settings, fourth limit and worked example retained |
| Distinct stopped hours counted once | Existing hosting instructions and mistakes retained |
| Pool fee is a revenue deduction expressed as an equivalent cost, not an electricity invoice | Existing hosting pool input/instruction, result explanation and second limit retained |
| Costs increase because fewer productive hours carry the paid amount | Brief hosting introduction; productive-hours step and exact worked example |
| Final rate matters as well as percentage increase | Hosting percentage-result explanation; concrete comparison mistake |
| Excluded costs, other billing models, no profitability calculation | Existing hosting audience/model limits and effective-rate explanation retained |
| Illustrative defaults, no observed market rate or decision threshold | Each input and final hosting limit |
| URLs reveal entered assumptions | Existing final instruction of all three guides, retained |
| Full-payment loss, collateral currency, binary observation and no hedge economics | Existing difficulty and payback limits retained |

The hosting numerical walkthrough is unchanged: `$0.065 × 1.08 = $0.0702/kWh`, divided by `0.90`, then `0.98`, gives `$0.0795918/kWh`, shown as `$0.0796/kWh`; uplift is about `22.449%`, shown as `22%`. The pool adjustment is still an equivalent comparison, and mining revenue remains absent from the model. No performance, customer, suitable-position or provider claim was introduced.

## Checks actually run

- `npm run check:tools`: passed. Existing hint bindings, result lookups, preset reachability and microcopy length caps pass.
- `node scripts/check-scenario-brief.mjs`: passed 19 checks, including all 128 input-boundary combinations.
- `node scripts/check-p0-corrections.mjs`: passed all 6 checks. This verifies the actual helpers/calculator arithmetic and existing example fixtures. It does not establish that these CMS proposals are published.
- `node --experimental-strip-types --no-warnings scripts/check-voice-drafts.mjs studio/rewrites/2026-11-06-structure-tools.json --snapshot=work/brand-copy-validation/structure-current-published-2026-11-06.json`: passed. Three documents, 24 exact-before changes, 2 CHECK, 0 STYLE, no CUT or stale-before conflicts.
- Final-prose extraction over all three guides after locally overlaying the proposals, plus the two owned source components: `/tmp/doefin-tools-final-prose.txt`, 259 blocks, SHA-256 `037554ba040f5ececd1ae1c8e94129782fb48ec64cd66a725d04b1a33f8e095f`. Dynamic source values use `[value]` placeholders; complete published guide prose is included. Documentation quotations and proposal notes are excluded.
- `python3 vendor/doefin-brand/tools/check_copy.py /tmp/doefin-tools-final-prose.txt --channel=web`: **0 CUT, 6 CHECK, 0 STYLE**. No STYLE exceptions.
- Changed scalar proposal prose separately: **0 CUT, 0 CHECK, 0 STYLE**. This smaller result does not replace the complete final-prose scan above.
- `npm run check:brand`: passed, vendored brand intact, 0 CUT and 0 STYLE. Two CHECK items arose in other workers’ shared changes (`profit` on the homepage and `Return` in the scoreboard), outside this package.
- AST comparison with `origin/main`: every Slider node, hint/result lookup, URL-state call, explicit ID and guide section definition in the two owned source files is exact. No formula, data, control, hint lookup key, URL or anchor changed.
- Independent arithmetic replay of the hosting calculation: `0.065 × 1.08 ÷ 0.90 ÷ 0.98 = 0.07959183673469389`.
- `git diff --check`: passed.

One attempted `check-voice-drafts.mjs --help` invocation ran that script’s historical default package audit because the script has no help handler. Its read-only live comparison failed on already-changed historical before-values. The correctly scoped snapshot command above passed; the historical failure is not concealed or treated as a failure of this new package.

No shared build, typecheck, browser run, CMS write, commit or push was performed for this package. The parent owns full guide-parser validation, rendered desktop/mobile inspection and independent review. In particular, the expanded compact-result label needs checking at narrow widths. Current published guides remain unchanged until a separately authorised application step.

## Exact retained CHECK passages

All six full-prose CHECK passages are unchanged warnings or model boundaries. They remain because removing them would weaken the explanation. The scoped changed-proposal validator sees two of them because whole preserved arrays are included in those proposal rows.

| Location | Exact passage | Reason retained |
| --- | --- | --- |
| Difficulty, easier-input source | “Choose a change to test. Historical data or a separately sourced forecast can help you choose, but neither guarantees what will happen.” | Denies a guarantee; distinguishes choosing an assumption from knowing the outcome. |
| Difficulty, mistakes | “Treating sample inputs as a forecast or the harder slider as a guaranteed worst possible outcome. The supported slider range is finite.” | Warns against interpreting a finite bound as protection against every outcome. |
| Difficulty, limits | “The calculator models expected BTC production, not profit or cash flow. It excludes power, hosting, hardware, financing, tax and pool fees.” | Keeps production apart from cash flow and profit. |
| Payback, growth-input source | “Choose a sensitivity assumption. Historical observations are not a guarantee of a future growth rate.” | Explicitly denies a forecast guarantee. |
| Hosting, effective-rate interpretation | “Compare final costs using the same billing assumptions. The result is an equivalent cost, not an invoice, revenue or profit.” | Defines the equivalent comparison quantity. |
| Hosting, model limits | “The model does not include BTC price, difficulty, machine efficiency, hardware cost, repairs, financing, tax, deposits or resale value. It cannot determine profitability.” | Preserves the exact excluded inputs and profitability limit. |

For Matteo and the independent reviewer, read the new result labels together with the easier/harder sliders, the shared limits/sample heading with all three guides’ input entries, the added payback horizon entry and the complete revised hosting guide. The main question is whether the reader understands the quantity and calculation without the removed provider detours. A checker pass does not answer that reading question or approve publication.

## Parent full-page correction

The guide/glossary related-data link in `ReferencePages.tsx` previously promised the current epoch with a confidence interval. The final source labels it “Difficulty data” and invites readers to distinguish the current estimate from synthetic examples. This matches the destination and does not imply a calibrated interval. The URL is unchanged.

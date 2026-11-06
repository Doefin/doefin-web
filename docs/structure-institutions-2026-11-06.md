# Institutions page structure, 6 Nov 2026

Codex structural and editorial pass on `components/v3/InstitutionsPage.tsx`, based on `origin/main` at `b9f6e1c`. This records source changes and focused checks. It is ready for Fardin and the independent reviewer to read. It is not publication approval or evidence of browser validation.

The source page, not the older live snapshot, was the starting point. Brand source: vendored Doefin brand v0.2.0, commit `936bc5c25899ee237bb5a4ecaae54bc192038cf4`. Read Matteo’s thinking first, then E14, E17, E22, E24 and E25, voice, compliance, website, content types, voice editor, visual rules and the site token mapping. The installed Next.js layouts/pages guide was also consulted. The doefin-humanise procedure informed the continuous reading pass; the user’s explicit structural scope permitted changing layout.

## Before and after structure

| Before | After | Distinct purpose |
| --- | --- | --- |
| Approved hero and instrument aside | Exact original hero and instrument aside | What the instrument is, its public reference and trading risk |
| `#finance-review`: audience introduction, three role cards, separate four-item internal review panel | `#finance-review`: production versus position explanation with the existing production-only example | Why a mining finance/credit team would compare them; why their outcomes differ; separate use by funds and desks |
| Market explorer | Same `InstitutionsExplorer` component, unedited | Inspect an actual market, its outcomes, current snapshot and app handoff |
| `#review-checklist`: introduction and three documentation cards | `#review-checklist`: one four-step review, with each document linked next to its relevant question | Inputs; outcome/funding; execution/technical risks; mandate/approval |
| Closing repeats size, fees, collateral, funding, exits, settlement, redemption and approval | One short contact action | Ask a remaining question about a specific market |

The three role cards and three separate documentation cards have been removed. There is one internal review sequence instead of role instructions, a second checklist and closing instructions. Documentation is part of that sequence. This follows E24/E25’s instruction to remove repeated explanation rather than rename it.

All original IDs remain exact: `finance-review`, `finance-review-title`, `review-checklist` and `desk-diligence-title`. `#finance-review` still leads to finance/production analysis. `#review-checklist` now leads to the consolidated review and its documentation. `#market-explorer` remains owned by the unchanged child component. All 10 unique existing link destinations survive, including both contact subjects and the scenario-brief anchor. Repeated links to the same destination were consolidated where appropriate.

## Unique questions and qualifications

| Question or qualification from the original | Single appropriate location in the revised explanatory flow |
| --- | --- |
| Production for a cash plan or borrower assessment | Production/position explanation |
| Funds and desks matching a market to their hashrate view | Final paragraph of the production/position section |
| Production is separate from the position’s payout | Production/position explanation, with a labelled example |
| Fleet assumptions, production period and operating forecast | Review step 1 |
| Business decision, inputs, results, model limits and missing information | Review step 1, including open questions |
| Scenario brief and private discussion notes kept out of public links | Review step 1 and its brief link |
| Threshold and observation block matching the analysis | Review step 2 |
| Settlement block, payout and redemption rules | Review step 2 and settlement guide |
| Funding, collateral token, fees, reporting and cash needs | Review step 2 |
| Available depth, partial fills, exit options and unfilled amounts | Review step 3 and order guide |
| Wallet/custody controls, deployments and technical evidence | Review step 3 and smart-contract guide |
| Mandate, eligibility, legal/accounting questions and approval of the amount | Review step 4 |
| No minimum fleet size or capital amount; own suitability review | Review step 4 |
| Public material freely available; examples are not suitability or approval | Review introduction |
| Mandate-specific questions | Existing mandate contact destination in step 4 |
| Remaining market-specific questions | Closing contact action |

The unchanged explorer continues to repeat the precise selected-market facts beside its controls. That is necessary context at a decision point, not another generic review sequence. It still distinguishes observation and settlement blocks, indicative prices and executable orders, and opening the app from placing a trade. The hero’s risk sentence remains exact. The production section retains the hedge limitation. Review steps 2 and 3 now state full-payment loss, limited exit liquidity and collateral/technical dependencies directly. The shared professional-only footer and disclaimer were not edited.

## Key passage changes

These quotations are evidence of the edit, not additional page copy.

| Decision | Before | After | Reason |
| --- | --- | --- | --- |
| Change | “Model expected BTC production for a cash plan or borrower assessment. Compare a difficulty market with your investment thesis.” | “A mining cash plan or borrower assessment depends on expected BTC production. Compare a production shortfall with a position’s cost and both possible payouts to assess what exposure would remain. Include fees, position size and timing in that comparison.” | Explains the useful question behind the comparison instead of just asking for a model. |
| Change | “Model production exposure separately from the position’s payout.” | “Production depends on difficulty throughout the period. A winning share pays a fixed amount based on difficulty at one observation block, however far it moves beyond the threshold. A position can pay nothing while production is lower, or pay more or less than the production difference.” | Explains why the two results differ, using existing market mechanics and guide limits. |
| Add existing example in context | No worked production example on this page | “Suppose expected production is 1 BTC over a given period at unchanged difficulty. With difficulty 10% higher throughout that period, expected production falls to 1 ÷ 1.10 ≈ 0.909 BTC.” Followed by unchanged hashrate, uptime, block reward and other production assumptions, and no forecast/position-size qualification. | Reuses the site’s labelled production-only example; invents no position price, payout, suitability or customer outcome. |
| Consolidate | “Choose the production period relevant to your cash plan. Record your assumptions…” plus “Exposure owner: check the fleet assumptions and time period…” plus the brief role card | “For a production comparison, check the fleet assumptions and period against your operating forecast. State the business decision the results will inform and record the model’s limits and open questions.” Followed by inputs/results, the privacy qualification and one brief link. | Moves repeated preparation instructions into review step 1. |
| Consolidate | Three independent documentation cards | Settlement link in step 2; order and contract links in step 3 | Each guide now answers a question where it arises. |
| Cut repeated instructions | “Contact the team with questions about the selected market’s size, fees, collateral, funding, exits, settlement or redemption. Follow your organisation’s approval process before committing capital.” | “Contact the team with the market you are considering and the question you need answered.” | The closing no longer repeats the entire review. |

## Mechanism and arithmetic boundaries

The production example is already published on the site and present in the supplied live snapshot. `1 / 1.10 = 0.909090909...`, rounded to `0.909 BTC`. Difficulty is 10% higher for the entire same period, with hashrate, uptime, block reward and the other production assumptions held constant. It is labelled illustrative and states that it is neither a forecast nor a position size. A production estimate in BTC is not a worked position-cost/payout example under the brand rules.

The explanation also follows the existing difficulty guide’s limits: a binary observation can produce no payout while production falls, or a payout larger/smaller than the production difference. No customer story, suitable position, trade price, position payout amount, profit or performance claim was added. No formula, data input, explorer logic, market control or app handoff was changed.

## Checks completed

- TypeScript AST extraction of final metadata and JSX prose, including paragraphs, headings, labels and links: 50 blocks, 590 words. The temporary extraction was `/tmp/doefin-institutions-final-prose.txt`, SHA-256 `25f3caf9a9eda56f1aec36a8b2bcdd4564adbf6abf9e0a18c3c2100824d0d833`.
- `python3 vendor/doefin-brand/tools/check_copy.py /tmp/doefin-institutions-final-prose.txt --channel=web`: **0 CUT, 0 CHECK, 0 STYLE**. This checks the page’s final prose, not quotations in this change record. There are no STYLE exceptions or exact CHECK passages to list for this extraction.
- `npm run check:brand`: passed; vendored brand intact, **0 CUT, 0 CHECK, 0 STYLE** at the time of the run. The command scans the current shared diff, not just this page.
- `npm run typecheck`: passed (`tsc --noEmit`, exit 0).
- `git diff --check`: passed.
- Source comparison against `origin/main`: hero exact, all four page IDs exact, all 10 unique existing link destinations preserved.
- Arithmetic verified independently using JavaScript division and rounding.
- Continuous final read: instrument, purpose of comparison, explanation/example/limits, actual market explorer, one review sequence with attached guides, then a contact action. Each remaining explanatory section adds a distinct idea.

The full `InstitutionsExplorer` prose and runtime output were outside this worker’s edit and extracted-prose scope. No build, browser run, CMS write, publish, commit or push was performed. The parent owns global build/render checks and the independent review of the reading experience. In particular, mobile wrapping, the side-by-side production example and vertical rhythm still require rendered inspection.

For Matteo’s reading, the materially rearranged passages are the production-versus-binary explanation, the preserved-source illustrative production example, the combined funding/settlement checks, and the consolidated mandate/approval wording. The checker did not flag them; its result does not replace that reading or approve publication.

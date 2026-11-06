# Independent review: tools and connected home flows, 6 November 2026

Evaluator did not implement these packages. Read the actual diffs, complete scoped source files and three final guides reconstructed with `planVoiceDrafts` over `work/brand-copy-validation/structure-current-published-2026-11-06.json`. Also read both source settlement documents from that snapshot. Worker handoffs were supplementary evidence. Applied CLAUDE, the pinned brand, Matteo's thinking and E24/E25/E28, voice/compliance/website/content-type/visual guidance, site token guidance, the doefin-humanise review procedure and the task acceptance document.

Baseline SHA-256: `9f58854fcf56c718319dd20afae0b0572018e7869c536025164d1bcbfa379789`. Tools proposal SHA-256: `a404ce327d385f8443e95fb1d1baa9a4bfd57585d9eb616fb07be7a96a412c34`.

## Tools and guides: Accept

No required correction remains in this package. The result is an editorial improvement beyond sentence polishing:

- “Production difference” names what `spreadBtc` contains. The compact result states “Easier case minus harder case”; the main caption names the easier/harder cases, and its existing hint explains that the difference includes upside and downside. The separate harder-versus-starting result remains. The reconstructed guide explicitly defines the subtraction and says that it is not the shortfall against unchanged difficulty.
- “Input limits and sample” fixes a misleading promise made by “Typical range”. I checked all **21** final guide inputs against the actual Slider/FIELDS declarations, defaults and bounds: seven difficulty inputs, eight payback inputs and six hosting inputs. This includes 1T–1,000T starting difficulty in both tools; 1–13 epochs; 2–120 months; both Bitcoin-price ranges; the signed easier/harder bounds; payback's 0–8% central monthly input and derived comparison rules; and the hosting percentage bases. All match. The new payback horizon is an explanation of an existing control, not a new model feature.
- The atomic payback array preserves all seven previous `_key`/`_type` pairs and appends `input-7`/`inputsEntry`. The 24 proposal rows match the complete published baseline without conflicts. Scalar field keys and existing guide anchors remain intact.
- The hosting opening now teaches the mechanism: separately billed fees raise the paid rate; paid stopped hours spread that amount over fewer productive hours; the pool's revenue deduction becomes an equivalent comparison adjustment. The settings and worked example retain the exact additive-fee and division rules. The result remains an equivalent cost rather than an invoice, revenue or profit calculation. Provider honesty/quality/ranking detours are actually removed.
- The full guides still explain what to enter, where to find it, what the outputs mean, the numerical working and mistakes/limits. URL privacy warnings, ownership/billing assumptions, excluded business models/costs, fixed subsidy and timing, full-loss/collateral/binary-position and no-position-size boundaries survive. The source diff changes labels/captions only; formulas, controls and lookup keys remain unchanged.

The hosting introduction's repeated short sentences are justified by the successive operations, rather than a generic slogan pattern. The settings are long because they explain actual inputs; the tool page retains its shorter help. The result now has a clear quantity and the guide gives the reader enough information to reproduce it.

Independent Decimal arithmetic, calculated directly rather than copied from the handoff:

| Example | Recomputed result | Assessment |
| --- | --- | --- |
| Difficulty default, 1 EH/s | Network 912.537384823 EH/s; baseline 28.057151878 BTC; easier 28.747081842; harder 26.221637269 | Matches the guide's rounded values |
| Difference versus shortfall | Easier minus harder 2.525444573 BTC; baseline minus harder 1.835514609 BTC | Distinct quantities correctly explained |
| Existing 0.80 EH/s example | Spread 2.020355658 BTC / $129,302.762; harder shortfall 1.468411687 BTC / $93,978.348 | Matches 2.020 BTC, $129,303, 1.468 BTC and approximately $94,000 |
| Payback 0%, 1.5%, 4.5% monthly growth | First crossings 24, 38, none within 48 months; final balances +$21,122.800, +$2,291.344, −$17,281.502 | Matches all existing walkthrough values |
| Hosting default | 0.065 × 1.08 ÷ 0.90 ÷ 0.98 = $0.0795918367/kWh; uplift 22.44897959% | Matches the retained working |

I also tested the important payback distinction: the default central model over **120 months first crosses zero in month 38 but ends at approximately −$4,218.81**. A negative final balance does not mean that payback never occurred. The actual final guide says it is a deficit at that date and separately defines payback as the first crossing; the new horizon explanation does not make the false inference. No correction is needed there.

The parent change to `check-voice-drafts.mjs` correctly recurses into arrays and objects while excluding CMS identity fields. Its new keyed-object regression exercises accepted nested prose, contextual CHECK and nested CUT rejection through the real checker entrypoint. I reran that regression and the scoped proposal checker: both pass. Reconstructed complete guide prose checked independently through the Python web checker: **0 CUT, 6 CHECK, 0 STYLE**. The six retained passages are the exact contextual warning/limit passages recorded in the tools handoff: the two explicit denials of guaranteed outcomes in difficulty, its production-not-profit limit, the payback historical-growth denial, and the hosting invoice/profit and excluded-profitability limits. Their contexts support keeping them.

## Homepage, settlement and newsletter: Accept

No required correction remains after the parent moved the newsletter sample before its preference form in DOM order. I inspected the resulting source: `article#sample-issue` precedes `section#signup`. This makes “Read findings … then try” true in the mobile and source reading order. The final build/browser confirmation of that reorder belongs to the parent; the HTTP preview I read preceded that small reorder.

Actual structural result:

| Page | Before | Final result and retained meaning |
| --- | --- | --- |
| Home | Nine top-level sections; a mechanics sequence followed by another setup sequence; separate evidence cards; newsletter followed by another closing | Six sections. The sole three-step sequence now contains its wallet/funding/order/position guide links. Evidence becomes one compact resources block. App/contact actions and the existing preference demo share one closing. |
| Settlement | Threshold table followed by three cards repeating period, payout and costs; embedded copies of source-document bodies | Threshold example, then a connected explanation of variable production over a period versus one difficulty observation/fixed payout; timing/costs/residual risks; collateral and source-document links; app action. |
| Newsletter | A sample asks what changed and only tells the reader to check sources | The sample answers its scoped question with 25 observations, directions and mean absolute size, explains the statistic, gives provenance/limits and links to the report/data/archive. It now comes before the unchanged preference controls. |

Programmatic comparison against HEAD verifies that the **entire home hero and production-example sections are byte-for-byte unchanged**. Their approved copy, example arithmetic and risk context survive. The original 20 explicit IDs across home/resources/updates remain and are unique. Setup and evidence fragments reach the consolidated blocks; `next-step-title` reaches the combined closing. Useful setup, technical, risks, institutional, article, calculator, report and contact destinations survive. The learning card now gives a distinct chart-reading route instead of duplicating the hero walkthrough.

Settlement now explains the economic mismatch rather than merely requesting a comparison: production depends on difficulty/hashrate/uptime through the chosen period; the position observes difficulty once and its fixed payout may offset more or less than the shortfall. The threshold equality and non-scaling payout remain in the illustrative 129T/130T/135T table and caption. Observation versus resolved/redeemable stages and estimated dates match `docs-what-doefin-settles-on` section 1 and `docs-how-settlement-works` section 0 in the current snapshot. Position price, fees, size, separate power/downtime/Bitcoin-price risks, full payment loss, market-specific collateral, public verification and technical/token/execution risks remain local. Detailed settlement/redemption material remains accessible through the same two named source documents. This is consolidation, not a new settlement or service claim.

The newsletter now earns its heading. Independent Decimal calculations from each captured `difficulty`/`previousDifficulty` produce **25 changes, 11 increases, 14 decreases and 3.752962631785468900329703796% mean absolute change**, displayed as 3.75%. The first and last row dates are **12 November 2025** and **16 October 2026**; capture is **22 October 2026**. These agree with the page's existing data helpers. The text clearly distinguishes observed changes from forecast accuracy, the next result and a live feed; its lack of independent node verification is explicit. No publishing cadence, live trading activity, current market forecast or subscription capability has been added.

`NewsletterForm.tsx` and `NewsletterDelivery.tsx` are byte-for-byte unchanged against HEAD. Controls, validation, privacy, consent, personal-detail clearing, no-email/no-subscription demo behaviour and public direct access remain. The reorganised final home section still makes the demo status visible rather than presenting the form as an active service.

Native clarity: each revised page now progresses through a different point instead of sending the reader through several equivalent checklists. The newsletter's absolute-change explanation is concrete and answers a likely question about the average. Its forecast paragraph correctly limits the finding without substituting a vague instruction to “check”. The home evidence paragraph is dense but each retained sentence carries a separate material risk or evidence limit. It is acceptable as the compact replacement for the removed cards.

## Independent verification and boundaries

- Scoped proposal planner/checker: **3 documents, 24 matching changes, no conflicts, 2 contextual CHECK, 0 STYLE**.
- Actual voice-draft regressions: **passed**, including nested keyed prose/CUT detection and existing draft/race-contract safeguards. No CMS request/write was performed by this review.
- Full reconstructed guide-prose Python check: **0 CUT, 6 CHECK, 0 STYLE**.
- HTML body-text scan of home, newsletter and settlement: **0 CUT, 7 contextual CHECK, 0 STYLE** after preserving block boundaries in extraction. The extra complete-page CHECK context includes unchanged MarketExample/FAQ profit qualifications and the navigation word “Return”; this is broader than the worker's changed-source extraction, not a contradictory changed-copy count. No warning was deleted to obtain the result.
- Read-only HTTP checks on parent preview `http://127.0.0.1:3051`: home, newsletter, settlement, difficulty calculator and all three guide routes returned **200**; final result/input labels and newsletter findings were in main HTML; no duplicate main IDs. This preview includes proposed CMS text and is frozen local evidence, not live publication. The source reorder was independently inspected after these requests; its rebuilt browser evidence remains with the parent.
- This evaluator did not run a build, global typecheck, CMS write, commit, push or UI automation, and changed only this report. Parent integration checks and desktop/mobile reading remain separate acceptance evidence. The source meaning and editorial structure of both packages are accepted. Settlement/collateral wording remains for Matteo's review under the existing brand gate; this is not publication sign-off.

## Follow-up: related difficulty-data links: Accept

Independently reviewed the parent's exact two-line correction in `components/content/ReferencePages.tsx`, at the glossary index and guide-page related links. Both now use label “Difficulty data” and note “Read the current estimate and distinguish it from the synthetic examples.” Both retain `/data/difficulty`; the old promise of a current epoch confidence interval is absent. No other part of that file changes.

The destination's complete `V3Difficulty.tsx` explains a current API reading separately from the synthetic step-change chart and explicitly says there is no published lower/upper forecast limit. `DifficultyReadingPanel` labels its available reading a single estimate, marks the forecast range unavailable, and handles missing source data without substituting example values. The new link therefore describes the destination and removes a false range promise; it makes no new forecast or service claim. The exact new label/note pass the Python web checker with **0 CUT, 0 CHECK, 0 STYLE**. No required correction remains. This follow-up is source/destination verification; parent owns the rebuild and final rendered checks.

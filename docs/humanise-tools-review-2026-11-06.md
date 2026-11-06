# Tools and email demo editorial pass, 6 Nov 2026

Codex copy pass for Fardin’s reading. This is not human approval or permission to publish. Brand source: vendored v0.2.0, commit `936bc5c25899ee237bb5a4ecaae54bc192038cf4`. Read Matteo’s thinking, actual edits including E28 and E37, voice, compliance, website, tool guidance and voice-editor procedure before editing.

## Reviewed scope

Read the complete input-to-result flows in ExposureSizer (the actual difficulty calculator filename), HostingCalculator, PaybackModel, toolkit, PublicMinersPlanner, ScenarioBrief, V3ToolPage, V3ToolsIndex, NewsletterDelivery, NewsletterForm, newsletter page, tool-micro and scenario-brief. Changed visible prose only. All three published CMS tool guides were read in full; 45 proposed field changes are in `studio/rewrites/2026-11-06-tools-plain-language.json`, with exact before/after values and field-specific reasons. Other guide fields are Keep.

The baseline was fetched directly from Sanity’s published perspective for the three exact IDs. It matches the supplied complete published snapshot:

| Document | Published revision | Updated |
|---|---|---|
| tool-guide-difficulty-exposure | k8hlzjuhoL42eLegpQK2Du | 6 Nov 2026, 09:43:36 UTC |
| tool-guide-fleet-payback | k8hlzjuhoL42eLegpQKMpQ | 6 Nov 2026, 09:43:49 UTC |
| tool-guide-hosting-effective-rate | k8hlzjuhoL42eLegpQKiTJ | 6 Nov 2026, 09:44:02 UTC |

The raw fresh read is saved under ignored `work/brand-copy-validation/tools-plain-language-baseline-2026-11-06.json`. Every proposed before-value was resolved against that document by exact path/key. No CMS writes, draft changes, publication, commits or pushes were made. Parent must inspect existing drafts before applying any proposal.

## Editorial decisions

| Location | Decision | Before → after | Reason |
|---|---|---|---|
| Hosting inputs and readout | Change | “charges on top of power” → “fees charged separately”; “becomes … after … the pool fee” → “becomes … /kWh … pool-fee adjustment … equivalent cost, not an invoice or profit” | Names the inputs and the meaning of the result. Keeps the booked-capacity assumption next to it (habits 3–5). |
| Payback readout, all branches | Change | “beyond … months”, “you never get it back”, “the only fix” → “not reached in … months”, no recovery within the selected horizon and conditional model results | Fixes pre-existing overclaims about later recovery and available responses. Arithmetic and branching are unchanged. |
| Exposure readout | Change | “model estimates … of expected production” → “expected BTC production …”; USD difference explicitly uses the chosen price | Removes awkward duplication, retains expected production, same hashrate, fixed target time and before-cost limits (E28). |
| Shared hint heading | Change | “Typical” → “Sample and range” | These are supported inputs and illustrative defaults, not typical market rates. Property keys and hint bindings stay unchanged. |
| Public planner | Change | “Your active fleet’s combined hashrate” → fleet specifications or pool records, with full uptime at that rate; result explains expected production before costs and that a winning payout is not all profit | Gives an input source and explains the displayed production/payout numbers. Existing detailed formula stays collapsed. |
| Tool index and page | Change | “Follow the capital”, “sensitivity” and “wider payback picture” → plain descriptions of how payback is calculated and which comparison to make | Keeps useful existing examples, figures and links; removes indirect phrasing. |
| Scenario brief | Keep/Change | Kept the downloads, privacy disclosure, figures, local-preview sharing notice and optional assumptions. “Illustrative sensitivity” → “Illustrative production comparison” | The existing brief is useful. Simplifies its status without removing forecast, recommendation or payout limits. |
| Email delivery demo | Change | “Email this scenario to yourself” / “Get … by email” → “Preview a scenario email” / “Preview a report and dataset email” | The heading now describes the available action. No delivery or subscription promise. |
| Newsletter page and form | Change | “Get market updates” → “See an example … email”; “no mailing service is configured” → sends no email or subscription | Puts the reader’s action and the demo boundary first. Keeps decision-point privacy, confirmation and unsubscribe context. |
| Published guide instructions | Change | “normalised”, “denominator”, “conditional results”, “capital recovery under explicit assumptions” → what to enter, where it comes from and what the result says | Rewrites connected explanations, preserving the conditions rather than shortening them away. |
| Published guide control/result names | Change | “Current difficulty”, “Assumed difficulty growth”, legacy easier/harder names and “Worst case vs today” → current visible labels | Corrects pre-existing label mismatches. No control itself was renamed. |
| Guide worked examples, dates and financial/risk qualifications | Keep | Exact example arithmetic, dates, limits, risk, observation and collateral wording remain | These are useful factual boundaries. No new example was invented. |

## Meaning and fact preservation

| Model/flow | Preserved facts, qualifications and boundaries |
|---|---|
| Difficulty exposure | Expected BTC production at the same hashrate, all else equal; starting, easier and harder constant-difficulty scenarios; the spread includes upside and downside and is not the loss against unchanged difficulty. EH/s conversion remains 1,000,000 TH/s. Each epoch represents 2,016 target intervals, about two weeks; supported 1–13 epochs remains about 2–26 weeks. Subsidy remains 3.125 BTC with assumed average fees; no halving, changing difficulty path, pool fees or operating-cost model was added. BTC price converts USD differences only. |
| Difficulty examples | 127.48T; 0.05 BTC/block; −2.4%, +7.0%; $64,000 conversion; 1 EH/s results 28.057 / 28.747 / 26.222 BTC, spread about 2.525 BTC, downside about −1.836 BTC. The 0.80 EH/s walkthrough stays 22.446 / 22.998 / 20.977 BTC, spread 2.020 BTC (~$129,303), downside 1.468 BTC (~$94,000). Network formula remains difficulty × 2³² ÷ 600 hashes/s, about 912.54 EH/s at the sample baseline, not live measurement. |
| Payback | Initial outlay is independent of hashrate. Monthly revenue less power costs is accumulated from a negative initial balance; payback is the first non-negative month. BTC price, hashrate, efficiency, power rate and 3.125 BTC subsidy stay fixed. Monthly growth compounds, first applied before month-one production; 30.4 days/month. Lower path is input minus two percentage points, floored at zero; higher is plus three points. No declining-difficulty path or confidence bound was added. Transaction/pool fees, downtime, repairs, tax, finance, resale value and non-mining income remain excluded or subject to the stated power-rate approximation. No recovery inside the horizon says nothing about later recovery. |
| Payback examples | 1,000 TH/s, 15 J/TH, $0.045/kWh, $20,000 outlay, $90,000/BTC, 127.48T, 1.5%, 48 months. 15 kW, 360 kWh/day, $16.20/day. 0% path: month 24 and ~$21,123; 1.5%: month 38 and ~$2,291; 4.5%: no payback within 48 months and ~−$17,282. All figures unchanged. |
| Hosting | Booked capacity remains payable during lost hours. Management and power-factor percentages add once to the rate, not compound. Distinct downtime and curtailment use the same period and cannot overlap. Divide by productive-hours share, then by one minus pool-fee fraction. Pool fee remains an equivalent comparison adjustment, not a power invoice charge. Result remains neither revenue nor profit. Energy-only, credit/payment, revenue-share and other income cases remain outside the model. Hardware, efficiency, repairs, financing, tax, deposits, resale, BTC price and difficulty exclusions remain. |
| Hosting example | $0.065/kWh, 5% + 3% fees, 4% + 6% lost hours, 2% pool fee. $0.0702/kWh after fees; 90% uptime; $0.0780/productive kWh; $0.0795918 → $0.0796/kWh; 22.449% → 22% uplift. No threshold, benchmark, provider quality rating or recommendation was added. |
| Public market planner | Production period stays separate from observation block. Only eligible cbBTC markets; missing/conflicting/reached-observation exclusions remain. Prices remain indicative, with fresh executable quotes, fees and liquidity checked in the app. Yes pays at/above threshold; No below; losing payout is zero. Both outcomes remain visible, with cost and net before fees. Full position loss and partial-offset limits remain. Formulas and app rounding to 0.01 are unchanged. cbBTC conversion, custody and redemption risks remain. |
| Scenario exports | All seven numeric inputs and three production cases remain; preparation date in UTC, chosen-price USD conversion, no assigned probabilities, no live data/forecast, fixed assumptions and exclusions remain. Production difference is not loss, hedge size, contract payout, trading profit or recommendation. Notes remain optional/session-only and excluded from copied URLs and demo email previews, included in downloads and user-created email drafts. Local URLs retain their actual origin and sharing notice. |
| Email demos | No email, transport request, subscription, scheduled alert or persisted personal details. Address-clearing and page-leave/reload limits remain explicit. Company fields stay optional; no inference from email. Public reports/data remain directly accessible. Observed history remains separate from a forecast recorded before the outcome. |
| Technical preservation | All 13 source files have identical AST structure after ignoring prose text nodes/string/template chunks: expressions, identifiers, numeric literals, tags and prop structure match base `10c516b`. No layout, behaviour, IDs, URLs, anchors, controls, field keys or tool caps changed. All numeric tokens in changed CMS fields are retained. Array counts, keys, slugs, source links and dates are unchanged. |

Pre-existing wording corrections requiring separate review: the payback readout previously inferred permanent non-recovery and “only” two fixes from a finite simulation; hosting readouts could be read as an actual invoice after a pool fee; delivery headings promised an action the demo cannot perform; several guide labels did not match the current tool. These corrections change wording only and are evidenced by the existing code paths. New payout explanation and financial/access wording still need Matteo’s reading.

## Checks run

- `npm run check:tools`: pass, no length warnings, hint drift or unreachable presets.
- `node scripts/check-scenario-brief.mjs`: 19 checks pass, including all 128 boundary combinations.
- `node scripts/check-newsletter.mjs`: 49 total checks pass, including 29 contract validations and condensed HTML escaping/completeness. No messages sent.
- `node scripts/check-p0-corrections.mjs`: all 6 checks pass, including independent exposure/hosting/payback arithmetic and planner failure/recovery behaviour.
- `npm run typecheck`: pass.
- `npm run check:brand -- --since=10c516b`: pass, vendored brand intact, 0 CUT. The shared tree also reports other agents’ CHECK/STYLE entries. Its planner STYLE `!` is source syntax (`!inputErrors`), not visible punctuation; no prose exception is needed.
- Python brand scan of extracted owned source prose: 0 CUT, 14 CHECK, 0 STYLE. Includes templates, JSX copy and microcopy. Python scan of reconstructed complete proposed guides: 0 CUT, 7 CHECK, 0 STYLE. No quotation exception.
- Fresh published before-value verification: all 45 rows match exact keyed paths; no numeric token was lost from changed fields. No shared-tree build, browser run, CMS mutation or printed-page-count claim.

## Exact CHECK passages retained

Source passages below are limits or necessary explanations, not promises. The complete extracted text and location index are in ignored `work/brand-copy-validation/tools-source-prose-2026-11-06.txt` and its index JSON. `guaranteed return` produces two findings on one passage.

- HostingCalculator, short readout: “This equivalent cost is close to the quote; it is not an invoice or profit.”
- HostingCalculator, longer readout: “This is an equivalent cost, not an invoice or profit.”
- PublicMinersPlanner, production comparison: “Expected BTC production, assuming constant difficulty in each scenario. This is before costs, not revenue or profit.”
- PublicMinersPlanner, outcomes: “A winning payout includes the amount paid for the position; it is not all profit. You can lose the full amount paid for a position.”
- V3ToolsIndex, payback limits: “Compare lower, central and higher difficulty growth. BTC price and subsidy stay fixed; future halvings, downtime, tax and resale value are excluded. Simplified scenarios, not a return forecast.”
- V3ToolsIndex, saved inputs: “Each calculator starts with example inputs, not live data. Enter your own numbers. The page URL saves the scenario so you can return to it or share it.” (`return` is navigation.)
- tool-micro, hosting blurb: “Compare an advertised hosting rate with separate fees and hours you pay for while machines are stopped. The result is an equivalent cost, not profit.”
- tool-micro, hosting notFor: “energy-only billing, hosting fee income or a complete profitability model”
- tool-micro, hosting watchOut: “This is not profit. Hardware, repairs, tax, deposits, BTC price and difficulty are excluded.”
- tool-micro, difficulty notFor: “fee-only hosting income or a complete cost, profit or contract model”
- tool-micro, payback blurb: “Estimate when a fleet could recover its initial cost under three monthly difficulty-growth assumptions. Results depend on your inputs, with no guaranteed return.”
- scenario-brief, limitations: “A production difference is not a hedge size, contract payout, trading profit or recommendation. Assess the contract terms and settlement separately.”
- scenario-brief, concise export: “Production differences are not hedge sizes, contract payouts or trading profits.”

Complete proposed guide CHECK passages:

- difficulty-exposure, input-4.whereToFind: “Choose a change to test. Historical data or a separately sourced forecast can help you choose, but neither guarantees what will happen.”
- difficulty-exposure, limits[0]: “The calculator models expected BTC production, not profit or cash flow. It excludes power, hosting, hardware, financing, tax and pool fees.”
- difficulty-exposure, mistakes[1]: “Treating sample inputs as a forecast or the harder slider as a guaranteed worst possible outcome. The supported slider range is finite.”
- fleet-payback, input-5.whereToFind: “Choose a sensitivity assumption. Historical observations are not a guarantee of a future growth rate.”
- hosting-effective-rate, limits[2]: “The model does not include BTC price, difficulty, machine efficiency, hardware cost, repairs, financing, tax, deposits or resale value. It cannot determine profitability.”
- hosting-effective-rate, result-0.soWhat: “Compare final costs using the same billing assumptions. The result is an equivalent cost, not an invoice, revenue or profit.”
- hosting-effective-rate, whatItIs: “This calculator compares hosting costs per productive kWh. It adds management and power-factor percentages to the advertised rate, then divides by the share of hours when machines run. It then divides by one minus the pool-fee fraction. The result is an equivalent cost for comparison, not an actual invoice or profit calculation.”

## Remaining density and review boundaries

Reread the revised flows from input source to result to optional detail. Main explanations now say what changes and what the number means. The dense parts retained are the optional planner payout formula/rounding and collateral risks, the compact printable assumptions, and guide contract-versus-production exclusions. These carry material qualifications and should remain beside the relevant result or in expanded detail. No new product claim, scenario probability, forecast, current market rate or actual return was introduced.

Matteo should read the payout-includes-cost clarification, financial example context, existing settlement/collateral limits and demo privacy/access language before publication. Fardin and the independent reviewer may still reject this editorial pass. No browser or CMS draft review was performed by this worker.

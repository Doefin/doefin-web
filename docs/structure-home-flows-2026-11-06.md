# Home, settlement and newsletter structure, 6 Nov 2026

Local Codex editorial pass ready for Fardin and the independent evaluator. Five source files changed; NewsletterForm and NewsletterDelivery are byte-for-byte unchanged against HEAD. No CMS write, browser write, build, global typecheck, commit, push or publication was performed.

## Before and after

| Page | Before | After |
| --- | --- | --- |
| Home | Hero → production → three mechanics steps/example → another three setup cards → three evidence cards → resources → FAQ → newsletter → separate closing | Hero → production → one set of three mechanics steps with their setup guides/example → resources with a compact evidence block → FAQ → one closing section containing app/contact actions and the existing research-email demo |
| Settlement | Threshold table → three numbered cards restating threshold/period/cost mechanics → collateral → embedded duplicate source-document bodies → app | Threshold table → connected explanation of why variable production and a fixed payout can differ, timing and costs → collateral and links to source docs → app |
| Newsletter | A sample asks what changed but only tells the reader to check a report and archive; generic service wording | Sample names its actual 25-adjustment scope, gives observed findings and explains the average, with source/date and limits; page title identifies a sample research email |

Home has **six top-level sections instead of nine**. The three distinct mechanics cards remain the only numbered process. Account/funding/order documentation is attached directly to the relevant step. The separate setup and evidence grids are removed. Product updates and the closing share one final section with the existing form. No form control, state, validator, network behaviour, analytics event or consent text changed.

The first resource card now leads to the chart-reading article instead of repeating the walkthrough already linked in the hero. Hosting, payback, observed research, institutional and complete-library destinations remain. The article fallback still leads to the article library if the featured CMS article is absent. No ResearchArchiveSummary edits were made.

## Protected content, anchors and destinations

| Item | Treatment |
| --- | --- |
| Approved home hero | Entire section byte-for-byte identical to the task baseline, including risk/actions and HeroVisual. Asserted programmatically. |
| Approved production example | Entire section byte-for-byte identical, including 1 BTC, +10% difficulty level, 0.909 BTC, 0.091 BTC/9.09%, assumptions, no-size/no-forecast limits and fixed-payout caveat. Asserted programmatically. |
| Mechanics | Existing three-step explanatory text remains exact. Wallet-signature guidance, token/network/destination/funding-cost checks and price/amount/execution guidance survive as contextual guide links. cbBTC/native BTC distinction, losing-share zero payout, fee/cost and available-buyer/price limits remain. |
| Home FAQ | HomeFaq component and CMS content untouched. Its existing docs/resource/team destinations remain. Only the surrounding repeated “get started” heading changes. |
| `#get-started`, `#setup-title` | Now point to the original mechanics list and its heading, where the setup links live. |
| `#review-evidence`, `#evidence-title` | Now identify the compact evidence block within resources, with About, contract/audit and risks links. Full-loss, liquidity, collateral, technical and illustrative-research limits remain local. |
| `#product-updates`, `#updates-title`, `#next-step-title` | The final section and combined heading retain all three targets. App/contact actions move here; the newsletter form remains here. |
| Other home anchors | All original named home IDs remain across home and its components, including production-scenario, who-its-for, audience-title, production-title, how-it-works, mechanics-title, inside-the-product, product-title, tools-and-learning, learning-title, faq and faq-title. Programmatic comparison passed. |
| Setup destinations | `/docs/connecting-a-wallet`, `/docs/getting-collateral`, `/docs/your-first-trade`, `/docs/managing-positions` preserved. Existing app URL and contact email remain from `site`. |
| Evidence/resources | `/about`, `/docs/smart-contracts`, `/docs/risks-and-limitations`, `/resources`, hosting/payback calculators, observed research, institutional and article destinations preserved. Walkthrough remains in hero; production calculator remains beside its example. |
| Newsletter anchors/links | `#signup`, `#preferences-title`, `#sample-issue`, report/CSV/archive links, report-email demo, no-email direct downloads and privacy/consent controls preserved. Source publisher now links to the actual captured public endpoint. |
| Settlement docs | The same two published-document identities now link to `/docs/what-doefin-settles-on` and `/docs/how-settlement-works`, instead of repeating their bodies. Threshold table values, source date, illustrative status, collateral verification, app and related destinations preserved. |

## Settlement facts and limits

The existing 130T threshold table, including equality and the 129T/130T/135T outcomes, remains exact. The paragraph immediately below still explains that a larger move does not increase the binary payout.

The next section explains why that table is not a production calculation: expected BTC production covers a period; actual production depends on difficulty, hashrate and uptime; the contract observes difficulty once. Its fixed payout may offset more or less than an actual shortfall. This distinguishes actual production variability from the calculator’s fixed assumptions.

The observation block chooses the difficulty value. Reaching it and having a resolved, redeemable position are separate stages. Calendar dates remain estimates; redemption follows resolution under the market’s settlement rules. Source: current published `docs-what-doefin-settles-on` and `docs-how-settlement-works` in `structure-current-published-2026-11-06.json`, not an invented timing rule. Position price, fees, size, power costs, downtime, Bitcoin price, collateral token/terms, public verification and smart-contract/token/execution risks remain. The exact full-loss sentence is also stated locally.

## Newsletter finding and evidence

The old question, “What changed at the difficulty adjustment?”, did not have an answer in its sample. The new question is “What changed across 25 difficulty adjustments?” and the next paragraphs answer it:

- 11 increases and 14 decreases, from 12 November 2025 to 16 October 2026.
- Mean absolute difficulty change: 3.75% per adjustment. The copy explains that absolute sizes stop positive and negative changes cancelling each other out.
- Source: mempool.space, captured 22 October 2026. This is a fixed historical window, not a live feed; no independent Bitcoin-node check is documented.

The rendered values come from the existing `researchSummary` and `researchCapture` in `lib/research-data.ts`, which also power the authoritative public report. No copied numerical constant was introduced. Independent Python Decimal arithmetic recomputed every row from its `difficulty`/`previousDifficulty`: count 25; 11 positive; 14 negative; mean absolute change 3.752962631785468900329703796%, rounding to 3.75%. The existing research-archive check also reproduces every captured adjacent change and verifies provenance.

The sample states that these changes measure neither forecast accuracy nor the next adjustment. The current archive has no published predictions. No cadence, current market activity, future service or new feature is promised. The example remains labelled “Not sent or scheduled”; the inactive unsubscribe link and hypothetical live-service explanation remain explicit. No email or subscription is created; personal-detail clearing, privacy and consent remain in the unchanged form and delivery components. Public report/data access remains available without an email address.

## Checks and exact CHECK passages

- Python web-channel checker on extracted prose from all seven scoped components/pages: **0 CUT, 0 STYLE, 4 CHECK**. No STYLE exception. These four passages remain for their actual meaning:
  1. Home mechanics, unchanged: “Each winning share in a cbBTC market redeems for 1 cbBTC. Check the displayed payout and collateral token for other markets. Losing shares pay nothing. Your profit or loss also depends on what you paid and any fees.” Necessary payout/cost/loss distinction; market-specific wording retained.
  2. Settlement introduction, unchanged: “These values explain the rule. They are not an available market or a quote. ‘Full payout’ means the amount specified by the contract. To work out profit or loss, you also need what you paid and any fees.” Necessary illustration/cost qualification.
  3. Settlement cost/risk paragraph: “Position price, fees and size affect your profit or loss. Power costs, downtime and Bitcoin price remain separate risks. You can lose the full amount paid for a position.” First two sentences preserve prior wording; full-loss sentence is exact agreed wording.
  4. Settlement related link, unchanged: “Return to the exposure calculator”. “Return” is navigation, not investment performance.
- `npm run check:brand`: passed; vendor intact, 0 CUT, 0 STYLE. Its three CHECK hits at that point were the unchanged home profit qualification, the settlement cost paragraph and another worker’s scoreboard return link. Scope prose was scanned separately as above.
- `node scripts/check-newsletter.mjs`: **49 checks passed**, including validation, local demo and brief completeness/escaping. No message sent.
- `node scripts/check-p1-journey.mjs --source-only`: passed, including incoming fragments and eight distinct literal doc destinations. Source-only evidence does not prove live HTTP navigation.
- `node --experimental-strip-types --no-warnings scripts/check-research-archive.mjs`: passed for all 25 observed changes and archive/provenance checks.
- Focused TypeScript syntax/transpile checks passed for all seven scoped TSX files. No global typecheck was run, as instructed.
- Protected-section equality, every original named home anchor, six-versus-nine section count, unchanged NewsletterForm/NewsletterDelivery and scoped diff whitespace checks passed.

Sensitive wording for Matteo’s reading: the consolidated settlement passage about observation versus resolved/redeemable positions uses the current published documentation’s meaning. The source-document bodies are replaced with links, preserving access to the detailed terms. No new financial example, return figure, collateral asset, settlement threshold rule or access language was created. The newsletter figures describe observed network changes, not Doefin trading performance.

Continuous final reading: the homepage now explains a market once, puts the setup help beside that explanation and reaches one final action/demo section. Settlement adds production mismatch and timing after the table rather than teaching the same threshold again. The newsletter now gives a finding before asking anyone to inspect its evidence. The remaining long form is the existing explicit preference demo; its local disclosures remain because they affect the decision to enter personal details. Layout and browser interaction still require the integrated evaluator; this source pass is not rendered acceptance or publication approval.

## Parent rendered-review correction

The historical sample now precedes the preference form in DOM order. This matches “read the findings, then try the demo”, places the useful explanation first on mobile and keeps visual and assistive reading order aligned. NewsletterForm and NewsletterDelivery remain unchanged.

# Documentation plain-language review, 6 Nov 2026

Codex editorial pass for Fardin to read. No CMS changes, publication, commits or pushes were made.

Brand: v0.2.0, commit `936bc5c25899ee237bb5a4ecaae54bc192038cf4`. Applied Matteo’s action-first help-doc style (E15), execution limits (E16), concrete risks (E17/E27), concise settlement rule (E25) and payout/profit distinction (E26). Already-clear text stays.

## Scope and exact baseline

All 18 published `docPage` documents were read in full, including summaries, headings, steps, paragraph arrays and definitions. A fresh unauthenticated public Sanity published query returned all 18 exactly equal to the supplied full published snapshot. The fresh full response is saved in `work/brand-copy-validation/plain-language-docs-fresh-baseline-2026-11-06.json` (SHA-256 `d6410f286c09899d8748bbfe49633b4d169d87846584ad9e78adba1cec50dbae`). This is published CMS evidence, not a migration seed.

All 26 proposal before-values match that fresh baseline at their exact keyed paths. Each proposed path was resolved and applied to an in-memory copy. Numeric tokens, metadata, document IDs, slugs, section IDs, stable keys, dates, links, references and paragraph/step/definition counts are unchanged. No glossary definitions were edited.

## Page inventory

| Page | Decision | Reason |
| --- | --- | --- |
| `/docs/overview` | Change | Clarify the order-to-holding relationship for buys and sells, shorten the heading and name what the linked guides cover. |
| `/docs/bitcoin-mining-difficulty` | Change | Explain elapsed time in ordinary words and name the production/revenue subjects directly. Preserve the technical definition and all qualifications. |
| `/docs/what-doefin-settles-on` | Change | Only the abstract final heading benefits from a change. The equality rule, T definition and observation/resolution distinction already work. |
| `/docs/prices-and-probability` | Change | Replace three long abstract headings and explain the practical limit of a probability displayed against a thin book. |
| `/docs/how-settlement-works` | Keep | The rule and illustrative payout example are Matteo’s E25/E26 wording. Redemption and withdrawal are already distinguished clearly. All figures, fees and losing-outcome wording stay exact. |
| `/docs/risks-and-limitations` | Change | Keep E27 risk wording; rewrite the final permission-and-questions paragraph so the funding checkpoint and organisational action are direct. |
| `/docs/connecting-a-wallet` | Keep | The steps already explain email, Google and wallet sign-in, account selection and missing requests directly. The sign-in/transaction distinction and recovery warning remain intact. |
| `/docs/getting-collateral` | Keep | The existing steps give the two conditional deposit routes, exact labels, token/network/address checks and confirmation warning. The route-specific fees, expiry and native-BTC warning are useful. |
| `/docs/your-first-trade` | Change | Explain setup versus a filled order naturally, then give concrete checks of the fill and amount left open before replacement. |
| `/docs/market-vs-limit-orders` | Change | Keep market/limit mechanics and whole-order comparison; simplify the current-quote and refresh warning. |
| `/docs/order-management` | Change | Clarify separate cancellation/replacement failures and the reason to check reserved funds. |
| `/docs/managing-positions` | Keep | Already explains holdings versus orders, non-executable valuation, Split/Merge pairing and separate redemption/withdrawal clearly. Each section serves a distinct task. |
| `/docs/redeeming-positions` | Change | Replace “proceeds are gross” with the same calculation in ordinary language; all task steps and retry safeguards stay. |
| `/docs/withdrawing-funds` | Change | Put the submitted-versus-received warning before the wait. Keep the recipient checks, available-funds warning and possible order cancellation. |
| `/docs/key-terms` | Keep | These concise definitions already serve the reference task. Protected definitions are unchanged, including technical vocabulary the checker flags. |
| `/docs/collateral-tokens` | Change | Give the collateral task a direct heading and explain what to read in an approval confirmation. |
| `/docs/smart-contracts` | Change | Name signatures versus contract transactions directly and unpack audit/remediation and interruption-review jargon. |
| `/docs/methodology-and-evidence` | Change | Explain range construction, interval coverage and width without requiring those technical labels. |

Each page retains its own purpose. Introductory pages explain the subject and rules; task pages explain the action and its result; reference pages define terms or specify what technical information to request. Nothing was cut merely to make the pages uniformly short.

## Source wording

Only two visible descriptions in `components/v3/V3DocsIndex.tsx` change. `V3DocPage.tsx` and `V3DocsLayout.tsx` are Keep: their navigation labels and shared reading controls already work.

| Location | Before | After |
| --- | --- | --- |
| Understand Doefin | Read about the underlying, market mechanics, settlement and risks. | Read about mining difficulty, market mechanics, settlement and risks. |
| Reference | Look up a term, check collateral details or review the evidence behind a technical claim. | Look up a term, check collateral details or assess contract audits and forecasts. |

## CMS before/after ledger

The machine-readable ledger is `studio/rewrites/2026-11-06-docs-plain-language.json`. Every row contains the exact document ID/type, keyed path, published before-value, proposed after-value, Change verdict and fact-preservation note. These are proposals for reviewed drafts; they are not CMS writes.

| Document and keyed path | Before | After | Why facts are preserved |
| --- | --- | --- | --- |
| `docs-overview` / `sections[_key=="section-1"].title` | An order, a position and a payout are different | Orders, positions and payouts | Shortens the heading while keeping the three distinct stages. |
| `docs-overview` / `sections[_key=="section-1"].paragraphs[0]` | An order is an instruction to buy or sell. If it fills, you hold shares: the position tokens for one side of the market. Execution depends on available liquidity, so a market or limit order may not fill in full. | An order is an instruction to buy or sell. A filled buy adds shares to your holding; a filled sell reduces it. Shares are the position tokens for one side of the market. Execution depends on available liquidity, so a market or limit order may not fill in full. | Explains the order-to-holding relationship for both buys and sells. Retains the definition of shares and incomplete-execution warning; Managing positions already specifies that filled sells reduce shares. |
| `docs-overview` / `sections[_key=="section-2"].paragraphs[0]` | Start with mining difficulty and market mechanics if the underlying is new to you. Read settlement and the risks before moving to the app guides. | If mining difficulty is new to you, start with the mining difficulty and market mechanics guides. Read about settlement and risks before moving to the app guides. | Replaces “the underlying” with the subject the reader needs to understand; retains the reading order and warning before app use. |
| `docs-overview` / `sections[_key=="section-2"].paragraphs[1]` | The app guides cover signing in, funding, orders and account actions. Reference pages explain the terms and the evidence to check. Use the optional calculators to explore your own assumptions. | The app guides cover signing in, funding, orders and account actions. Reference pages explain terms, collateral, contract audits and forecasting methods. Use the optional calculators to explore your own assumptions. | Names the subjects covered by the reference pages instead of asking readers to “check evidence”. Retains the app-guide categories and assumption-based optional calculators. |
| `docs-bitcoin-mining-difficulty` / `sections[_key=="section-0"].paragraphs[1]` | Bitcoin periodically adjusts difficulty using elapsed time in the preceding adjustment period. Faster block production generally leads to higher difficulty, and slower production generally leads to lower difficulty, subject to the protocol’s rules. | Bitcoin adjusts difficulty based on how long the preceding adjustment period took. Faster block production generally leads to higher difficulty, and slower production generally leads to lower difficulty, subject to the protocol’s rules. | Explains elapsed time in familiar words. Retains both directions and the protocol qualification. |
| `docs-bitcoin-mining-difficulty` / `sections[_key=="section-2"].title` | Production and revenue are broader questions | Difficulty, production and revenue | Names the section’s subjects directly; the production and revenue qualifications stay intact. |
| `docs-what-doefin-settles-on` / `sections[_key=="section-2"].title` | Separate the market outcome from your operation | The limits of a difficulty position | Replaces an abstract instruction with the limit the section explains. |
| `docs-prices-and-probability` / `sections[_key=="section-0"].title` | Read price relative to the full payout | How price implies a probability | Names the calculation explained immediately below. |
| `docs-prices-and-probability` / `sections[_key=="section-1"].title` | Separate the display from an executable quote | Displayed prices and available trades | Distinguishes price displays from executable trades without the long noun phrase. |
| `docs-prices-and-probability` / `sections[_key=="section-1"].paragraphs[1]` | Review the available depth and your order preview. A wide spread or thin order book can make the displayed probability a weak summary of what participants would actually trade. | Check the available depth and your order preview. When the spread is wide or the order book is thin, the displayed probability may tell you little about the prices and quantities participants will trade. | Explains why depth matters in terms of actual prices and quantities; retains the wide-spread and thin-book qualifications. |
| `docs-prices-and-probability` / `sections[_key=="section-2"].title` | Keep the outcome and cost basis separate | Payout and profit | Names the distinction already explained by the existing paragraph; adds no payout claim or example. |
| `docs-risks-and-limitations` / `sections[_key=="section-3"].paragraphs[0]` | Check the current market specification, transaction confirmation, applicable terms and access requirements. An organisation should also resolve its internal permissions and review requirements. Contact the team for current information when the documents or app do not answer a material question. | Before funding, read the current market specification, transaction confirmation, applicable terms and access requirements. If you act for an organisation, confirm its internal permissions and review requirements too. Ask the team about any material question the documents or app leave unanswered. | Keeps the funding checkpoint, all four external checks, organisational permissions and review, and the escalation route. Makes the instruction personal and direct. |
| `docs-your-first-trade` / `sections[_key=="section-1"].paragraphs[0]` | If account setup is required, the app presents it before the order. Read that confirmation and any signing request. Then review the order confirmation itself; setup completion is not an order fill. | If account setup is required, the app presents it before the order. Read that confirmation and any signing request, then review the order confirmation. Completing setup does not mean the order has filled. | Replaces “setup completion is not an order fill” with a natural sentence. Retains conditional setup, signing request and separate order confirmation. |
| `docs-your-first-trade` / `sections[_key=="section-2"].paragraphs[0]` | After submission, inspect the order status and filled amount in Portfolio. An accepted or open order is not the same as a completed trade. Reconcile any remaining open amount before placing a replacement, and use the resulting position balance to confirm the exposure you hold. | After submitting, open Portfolio and check the order status and filled amount. An accepted or open order is not the same as a completed trade. Check how much remains open before placing a replacement, then use your position balance to see the exposure you hold. | Turns “reconcile” and “resulting position balance” into concrete checks. Keeps accepted/open versus completed, remaining amount before replacement and the actual holding. |
| `docs-market-vs-limit-orders` / `sections[_key=="section-0"].paragraphs[1]` | Review the actual quote, available amount and any partial-fill warning. An empty or changing book can prevent execution. Refresh the quote when the app requires it rather than treating an earlier preview as a guarantee. | Review the current quote, available amount and any partial-fill warning. An empty or changing book can prevent execution. Refresh the quote when the app requires it; an earlier preview does not guarantee execution. | States what to do and why without the “rather than treating” construction. Keeps amount, partial fills, changing liquidity and required refresh. |
| `docs-order-management` / `sections[_key=="section-1"].paragraphs[1]` | Cancellation and replacement can fail separately. If cancellation succeeded but the replacement was not signed or accepted, the old order is cancelled and there may be no replacement. Check Orders before submitting again. | Cancellation and replacement are separate steps and either can fail. If cancellation succeeds but the replacement is not signed or accepted, the old order is cancelled and there may be no replacement. Check Orders before submitting again. | Explains the two possible failures in a connected sequence. Retains unsigned/unaccepted replacement and the check before retrying. |
| `docs-order-management` / `sections[_key=="section-2"].title` | Reconcile reserved funds | Check reserved funds | Uses the action the reader can take instead of “reconcile”. |
| `docs-order-management` / `sections[_key=="section-2"].paragraphs[0]` | After a change, check Total, Locked and Available balances. A pending action or an old balance does not confirm that funds have been released. If you ask the team to investigate, include the latest order status and any transaction or request reference. | After a change, check Total, Locked and Available balances. Funds may still be reserved while an action is pending or the displayed balance is out of date. If you ask the team to investigate, include the latest order status and any transaction or request reference. | Explains why a pending action or old balance cannot confirm released funds. Keeps all balance labels and the support references. |
| `docs-redeeming-positions` / `sections[_key=="section-2"].paragraphs[1]` | Losing shares have no payout. Redemption proceeds are gross: your result is the amount redeemed minus what you paid and any costs. | Losing shares have no payout. To work out your profit or loss, subtract what you paid and any costs from the amount redeemed. | Explains gross proceeds with the calculation itself. Retains zero payout for losing shares and the same amount-redeemed minus cost calculation; no figures or returns added. |
| `docs-withdrawing-funds` / `sections[_key=="section-2"].steps[2]` | Wait for the confirmed result. A transaction reference or “submitted” message does not yet establish that the recipient has received the funds. | A transaction reference or a “submitted” message does not confirm that the recipient has received the funds. Wait for the confirmed result. | Puts the warning before the wait and replaces “establish” with “confirm”. Keeps the submitted-versus-received distinction. |
| `docs-collateral-tokens` / `sections[_key=="section-0"].title` | The token is part of the market specification | Check the market’s collateral token | Gives the task directly; the section retains market-specific funding and payout, token list and token risks. |
| `docs-collateral-tokens` / `sections[_key=="section-2"].paragraphs[0]` | The app may ask you to set up your account or approve a token before continuing. Read what the current confirmation allows. An earlier approval for one token does not establish support for another token or contract. | The app may ask you to set up your account or approve a token before continuing. Read the confirmation to see what you are authorising. An earlier approval for one token does not establish support for another token or contract. | Makes the purpose of reading a confirmation explicit. Retains conditional setup/approval and the limit on what an earlier approval establishes. |
| `docs-smart-contracts` / `sections[_key=="section-0"].title` | Separate account, order and token operations | Signatures and contract transactions | Names the distinction explained below, without an abstract imperative. |
| `docs-smart-contracts` / `sections[_key=="section-1"].steps[2]` | Request the audit reports, commit or version reviewed, scope, outstanding findings and remediation evidence. | Ask for audit reports, including the commit or version reviewed, the scope, unresolved findings and evidence of fixes. | Replaces compressed review jargon with a concrete request. Keeps version, scope, outstanding findings and remediation evidence. |
| `docs-smart-contracts` / `sections[_key=="section-1"].steps[3]` | Review account permissions, token approvals, resolution dependencies and the operational process for interruptions. | Check account permissions, token approvals, dependencies involved in resolution and the process for handling interruptions. | Unpacks “resolution dependencies” and “operational process” while preserving all four review areas. |
| `docs-methodology-and-evidence` / `sections[_key=="section-1"].paragraphs[1]` | Any uncertainty range needs a construction method and evaluation against outcomes. Compare interval coverage and width across a stated evaluation window; a range alone does not establish calibration. | To judge an uncertainty range, you need to know how it was calculated and how it performed against actual outcomes. Over a stated evaluation window, compare how often outcomes fell within the range and how wide it was. A range alone does not show that it is calibrated. | Explains construction method, interval coverage and width in ordinary language. Keeps the evaluation window and the warning that a range alone does not establish calibration. |

## Material meaning checks

Orders remain instructions and holdings remain shares actually held. Partial fills, remaining open quantities, conditional limit-order editing and separate cancellation/replacement failures are retained. Portfolio valuations remain estimates, with no executable-price promise. Losing shares still pay nothing; full position loss, fees, gross payout versus result, and limited liquidity remain explicit.

Observation blocks remain separate from recorded resolution and redemption availability. The exact equality rule and approved illustrative numbers stay. Split/Merge still require matching sides for the same market and collateral, with equal quantities on Merge. Redemption remains internal collateral credit; withdrawal remains a separate external transfer. Sign-in, setup, signed orders, token approval and contract transactions remain separate. Funding/withdrawal labels, conditional routes, supported-token boundaries, market-specific collateral, custody and technical risks are retained.

## Checks actually run

- Python brand checker, changed prose: 0 CUT, 2 CHECK, 1 STYLE. The one STYLE hit is the recorded explanatory “position tokens” quotation below.
- Python brand checker, full final docs: 0 CUT, 7 CHECK, 5 STYLE. All five STYLE hits are recorded technical-definition quotations below; no other STYLE remains.
- Exact-key before-value validation: 26/26 pass. In-memory proposal application and structural/numeric preservation assertions: pass.
- `npm run check:brand -- --since=10c516b`: pass, vendor intact, 0 CUT. Shared-tree output includes 14 CHECK and 4 STYLE in other agents’ files; no index change is flagged.
- `npm run typecheck`: pass (exit 0).
- No shared build or browser run was started. This pass does not establish rendered deployment or draft-preview behaviour.

## Exact CHECK passages for Matteo

These remain because they explain profit/loss or explicitly deny execution guarantees, not because the checker is an approval mechanism. E26’s existing illustrative example remains exact. The revised payout/profit heading and redemption calculation, approval authorisation sentence, organisational access paragraph and technical review wording should be read by Matteo before publication.

- `docs-overview.section-1.paragraphs[1]`: “The payout is not all profit: your result depends on the price you paid and any costs.”
- `docs-prices-and-probability.section-2.title`: “Payout and profit”
- `docs-how-settlement-works.section-1.paragraphs[1]`: “If Yes wins, you redeem 0.01 cbBTC: a profit of 0.006 cbBTC before fees.”
- `docs-how-settlement-works.section-1.paragraphs[2]`: “A payout includes the amount you originally paid; it is not all profit.”
- `docs-market-vs-limit-orders.summary`: “Neither guarantees a complete fill.”
- `docs-managing-positions.section-1.paragraphs[1]`: “It does not choose a direction or create a profit.”
- `docs-redeeming-positions.section-2.paragraphs[1]`: “To work out your profit or loss, subtract what you paid and any costs from the amount redeemed.”

## Recorded STYLE quotations

The sole STYLE trigger is the words “position tokens”. The brand explicitly allows explaining once that shares are position tokens. These quotes explain that term for independently readable pages; they are not customer-facing replacements for “shares”. The Key terms definition is protected. No wording was made less precise merely to silence this lexical rule.

- `docs-overview.section-1.paragraphs[0]`: “Shares are the position tokens for one side of the market.”
- `docs-your-first-trade.section-0.steps[2]`: “To sell, you need available shares (position tokens) on that side.”
- `docs-managing-positions.section-0.paragraphs[0]`: “In Portfolio, identify the market’s observation block, threshold, collateral token, side and number of shares (position tokens).”
- `docs-key-terms.section-1.definition-1.definition`: “Shares are the position tokens for one side, Yes or No.”
- `docs-smart-contracts.section-0.paragraphs[1]`: “Shares are the position tokens; each represents one outcome for a particular market and collateral.”

## Full-page reread and remaining density

All 18 pages were reread consecutively after applying proposals in memory. No sentence was kept merely because it passed the checker. The shortest useful action stays next to its qualification. The funding routes, sign-in troubleshooting, market/limit rules, holdings and redemption procedures already read naturally and were largely kept.

The smart-contract checklist remains technical because reviewers need implementation, upgrade authority, version/scope and unresolved findings. The reproducibility paragraph still names source blocks, timestamps, target adjustment, constraints and rounding; those inputs cannot be replaced with “check the method” without losing meaning. The glossary retains dimensionless/difficulty-one terminology because it defines the measure. These are deliberate remaining dense passages, not a claim of universally simple prose.

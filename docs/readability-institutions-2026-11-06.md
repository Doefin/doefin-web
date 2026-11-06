# Institutions readability refinement, 6 Nov 2026

Frozen for independent review. The change is limited to visible prose in `components/v3/InstitutionsPage.tsx`. No layout, component wiring, data, controls, fetches, metadata or CMS content changed. Build, global typecheck, aggregate brand and browser review belong to the parent task.

The four checklist headings now ask the reader's decision, cost/outcome, exit and approval questions. Their paragraphs use named subjects and direct verbs while retaining the review requirements. The production explanation names the whole-period and single-block measures in successive sentences so the difference is easier to follow.

## Before and after

| Before | After |
| --- | --- |
| Production depends on difficulty throughout the period. A winning share pays a fixed amount based on difficulty at one observation block, however far it moves beyond the threshold. A position can pay nothing while production is lower, or pay more or less than the production difference. | Production depends on difficulty throughout the period. A position’s outcome depends on difficulty at one observation block. A winning share pays a fixed amount, however far difficulty moves beyond the threshold. A position can pay nothing while production is lower, or pay more or less than the production difference. |
| Define the decision and its inputs. | What decision are you making? |
| For a production comparison, check the fleet assumptions and period against your operating forecast. State the business decision the results will inform and record the model’s limits and open questions. | Start with the decision your team needs to make. For a production comparison, check the fleet assumptions and period against your operating forecast. Record the model’s limits and the questions still open. |
| Share the inputs and results your team needs, but keep private discussion notes out of public links. | Share the inputs and results your team needs. Keep private discussion notes out of public links. |
| Check the outcome and funding. | What are the costs and outcomes? |
| Compare the threshold and observation block with your analysis. Check the settlement block, payout and redemption rules separately. Confirm the collateral token, funding, fees, reporting and effect on cash needs. | Check the threshold and observation block against your analysis. Read the settlement block, payout and redemption rules separately. Confirm the collateral token, how you will fund the position and the fees. Check what your team needs to report and how the position affects cash needs. |
| Check execution and technical risks. | Could you exit the position? |
| Check available depth, partial fills and exit options. Limited liquidity can prevent a full exit before settlement. Review wallet or custody controls, smart contract deployments and the technical evidence. | Check market depth, whether your order could fill only in part and how you could exit. Limited liquidity can prevent a full exit before settlement. Review your wallet or custody controls, the smart contract deployments and the technical evidence. |
| Confirm mandate and approval. | Who can approve the amount? |
| Your authorised reviewers must confirm your organisation’s mandate and eligibility, resolve legal or accounting questions and approve the amount before capital is committed. | Your authorised reviewers must confirm your organisation’s mandate and eligibility. They must resolve legal or accounting questions and approve the amount before you commit capital. |

## Facts and qualifications retained

| Requirement | Home in the final page |
| --- | --- |
| Approved trading/view hero, public difficulty reference and trading risk | Opening hero, byte for byte unchanged |
| Expected production for mining cash plans or borrower assessment; shortfall compared with cost and both payouts, including fees, position size and timing | Finance review opening paragraph, unchanged |
| Difficulty across the whole production period versus difficulty at one observation block; fixed winning payout beyond threshold; no payout despite lower production, or a payout above/below the production difference | Finance review explanation, clarified without adding a claim |
| Partial hedge; separate uptime, energy-cost and BTC-price risks | Finance review risk paragraph, unchanged |
| Existing 1 BTC, +10% difficulty, approximately 0.909 BTC illustration and every assumption; estimate, not forecast or position size | Full illustrative aside, byte for byte unchanged |
| Funds/desks may assess their view without modelling a fleet; market terms must match their view | Finance review closing paragraph, unchanged |
| Fleet assumptions and period compared with operating forecast; business decision; model limits and open questions | Checklist 1 |
| Shared inputs/results; no private discussion notes in public links | Checklist 1 |
| Threshold/observation analysis separate from settlement block, payout and redemption rules | Checklist 2 |
| Collateral token, funding, fees, reporting and cash needs; full loss of amount paid | Checklist 2 |
| Market depth, partial fills, exit options and liquidity preventing a full exit before settlement | Checklist 3 |
| Wallet/custody controls, smart contract deployments and technical evidence; token/network/contracts/settlement dependencies | Checklist 3 |
| Authorised reviewers; organisation's mandate/eligibility, legal/accounting questions and amount approved before committing capital | Checklist 4 |
| No minimum fleet size or capital amount set by this walkthrough; suitability through own review | Checklist 4, unchanged |
| Free public material does not establish suitability or approval | Checklist introduction, unchanged |

All IDs, fragment targets, destinations, mailto subjects and link labels are preserved. `InstitutionsExplorer` is unchanged and remains in the same place. No new number, financial example, position outcome, suitability criterion or service promise was added.

## Evidence and editorial review

- Focused TypeScript AST comparison confirmed that removing JSX text leaves identical source. Only visible prose changes; attributes, expressions, element/component structure, metadata, class names and behaviour remain identical.
- Explicit comparisons confirmed protected hero and full illustrative aside equality, all numeric literals, IDs, hrefs (including dynamic mailto subjects), `aria-labelledby` attributes and one unchanged `InstitutionsExplorer` invocation. Final edits were included in these comparisons.
- TypeScript transpilation reported no syntax errors. No build or global typecheck was run by this package.
- Extracted final page prose, checked with the Doefin Python checker in the web channel: 0 CUT, 0 CHECK and 0 STYLE. No contextual CHECK match needs escalation. Existing risk wording was retained irrespective of checker status.
- `git diff --check` passed. No commit or remote write was made.

The Doefin humanise skill and vendored voice-editor procedure informed the pass. Brand source: v0.2.0, `936bc5c`. The editing follows Matteo's plain register, habit 10, and his instruction to state the rule clearly, E25. A useful question heads each review step; it is not a teaser with an invented answer.

Fardin should read the whole flow before sending it to Matteo. Although no underlying claim changes, Matteo should read the finance paragraph about a position's outcome and the rewritten checklist 2 and 4 wording: those passages describe contract/funding mechanics and organisational approval. Their exact before/after text appears above. The existing illustration remains a production estimate rather than a financial example. This is a Codex editorial pass and automated source verification, not human approval or browser validation.

# Glossary plain-language review, 6 Nov 2026

Codex editorial pass ready for Fardin's reading. The glossary remains one of the clearest categories. Four body/FAQ passages merit small, specific revisions; all 19 short definitions remain byte-for-byte unchanged. Block subsidy is reserved for Matteo and receives no proposal or edit.

## Source and boundaries

Read `AGENTS.md`, `CLAUDE.md`, the doefin-humanise skill, the vendored voice editor, Matteo's thinking and E29/E30, and the voice, compliance, website, content-type and visual rules. Brand: v0.2.0, commit `936bc5c25899ee237bb5a4ecaae54bc192038cf4`. Read the installed Next.js client-component guide before inspecting the source.

Reviewed the full published documents, including body paragraphs and FAQs, in `work/brand-copy-validation/plain-language-raw-published-2026-11-06.json`, with the published query fixture for page context. An unauthenticated Sanity request using the `published` perspective returned 19 glossary terms identical to that baseline. The ignored refresh is `work/brand-copy-validation/glossary-plain-language-baseline-2026-11-06.json`. Migration seeds were not treated as current content.

Source edits are limited to two visible strings in `components/v3/GlossaryBrowser.tsx`. Reviewed and kept the remaining wording in that component and in `V3GlossaryIndex.tsx`, `pages/GlossaryPage.tsx` and `pages/GlossaryTermPage.tsx`. Structure, behaviour, IDs, props, URLs, data bindings and classes are unchanged. No vendor, seed or CMS writes were made.

## Term decisions

“Change” below concerns only the named body/FAQ passage. Every other passage in that term is Keep, including every short definition. The reserved entry is accounted for without reopening it.

| Term | Decision | Reason |
| --- | --- | --- |
| Block height | Keep | Clear explanation of exact heights and estimated dates. |
| Block subsidy | Keep, reserved | Entire document left untouched for Matteo. |
| Calibration | Keep | The distinction between central accuracy and repeated interval coverage is already concrete. |
| Confidence interval | Keep | Plain explanation; preserve coverage and uncertainty. Method and evidence questions below remain open. |
| Curtailment | Keep | States both lower power cost and lower revenue. |
| Difficulty adjustment | Keep | Exact formula, fourfold limit, 2,015/2,016 distinction and 0.05 percentage points retained. |
| Epoch | Keep | Definition precedes the explanation of boundaries and dates. |
| Exahash | Keep | Approved short definition preserved exactly; unit conversion and examples need no wording change. |
| FPPS | Keep | “Variance” is immediately explained through pool luck and who bears the cost. |
| Halving | Change FAQ 1 answer | Explain “fit window” as the period used to fit the model. |
| Hashprice | Change FAQ 1 answer | Explain “price leg” and exchange “basket” directly. Approved short definition preserved exactly. |
| Hashrate | Keep | Preserves estimated versus measured, observation windows and both uncertainty figures. |
| Hosting | Keep | Concrete list of charges and terms is useful despite its density. |
| Mining difficulty | Keep | Preserve the E29 definition and explanation, expected production qualifiers, formula and worked percentage. |
| Mining pool | Keep | Technical wording is short and the linked FPPS and pool-luck entries explain it. |
| Pool luck | Change body paragraph | Explain “variance maths” as the amount payouts can vary by chance; keep the comparison warning. |
| Terahash | Change FAQ 0 answer | Replace the passive “most easily reasoned about” construction with working out revenue. |
| Transaction fees | Keep | Short and direct; fee and settlement meaning left intact. |
| Uptime | Keep | Retains advertised versus realised uptime and the independent-verification limitation. |

## Exact proposed changes

The four CMS proposals are in `studio/rewrites/2026-11-06-glossary-plain-language.json`. Each row has the exact published `before`, proposed `after`, a keyed FAQ path where applicable and a specific editorial reason. All four `before` values match the refreshed published baseline. No row touches a short definition, key, slug, reference, metadata or date.

| Location | Before | After | Reason |
| --- | --- | --- | --- |
| Hashprice, FAQ 1 answer | Because publishers compute it differently. The differences sit almost entirely in the price leg: which exchanges are in the basket, how they are weighted and when the snapshot is taken. Few publishers disclose the basket. | Because publishers calculate it differently. Most differences come from the Bitcoin price used: which exchanges are included, how they are weighted and when the price is recorded. Few publishers disclose which exchanges they use. | Names the calculation rather than relying on “leg” and “basket”; retains selection, weights, timing and disclosure. E30. |
| Halving, FAQ 1 answer | Because behaviour before and after a halving differs so much that models spanning the boundary tend to mislead. A fit window should state which side of a halving it sits on. | Because behaviour before and after a halving differs so much that models spanning the boundary tend to mislead. A model should state whether the period used to fit it is before or after a halving. | Clarifies the period without changing the model-boundary warning. Thinking habit 3. |
| Pool luck, body 0 | Luck dominates short-run pool comparisons. A payout comparison between pools needs the variance maths shown alongside it; without it, a difference that is pure chance reads as a better pool. | Luck dominates short-run pool comparisons. A comparison of pool payouts needs to show how much they can vary by chance. Without that, a difference caused purely by luck can make one pool look better. | Explains the statistical qualification and fixes an awkward final clause. E30. |
| Terahash, FAQ 0 answer | Because terahash is the unit in which a fleet's revenue is most easily reasoned about. It is also the scale of an individual machine. | Because it is the easiest unit to use when working out a fleet's revenue. It is also the scale of an individual machine. | Uses a direct explanation while retaining both stated uses. Thinking habit 10. |
| Search helper | Terms, aliases & definitions | Terms, abbreviations & definitions | Replaces a less familiar label with the wording already used in the search field's accessible label. |
| Calculator eyebrow | From definition to application | Mining calculators | Names the destination rather than repeating the following “Put the terms to work” heading. Thinking habit 6. |

## Final reading and remaining density

Read the terms consecutively with their definitions, body paragraphs, questions and answers, then the browser's search, topic, empty-state and calculator copy. The revised passages remain definitions and explanations, without chatty introductions or added product claims. The calculator heading and its specific explanation work once the eyebrow names the destination, so they remain unchanged.

Difficulty formulas, interval coverage, hashrate windows and pool variance still require attention from the reader. Those are material distinctions, not filler to flatten. Retained all figures, units, dates and conditions; expected BTC production remains distinct from actual production and mining revenue remains distinct from profit. Pool luck still explains chance rather than skill. No payout or financial example was added.

This is an editorial pass, not independent verification of the existing technical claims. Before a separate fact review, retain these questions rather than guessing corrections:

- Confidence interval: the aliases and coverage language combine confidence and prediction intervals; the claim that theoretical bands are typically two to three times too narrow needs its method and evidence identified.
- Hashrate: the ±16% one-day and ±6% seven-day uncertainty figures do not identify a confidence level in the entry.
- Difficulty adjustment: the simplified “last 2,016 blocks” explanation sits beside the explicit 2,015-interval caveat. Preserve the caveat; do not silently rewrite protocol mechanics during a wording pass.
- Hashprice: the body mentions BTC price without the short definition's explicit USD qualification. Preserved rather than making an unverified factual edit.
- Halving: the historical offline-capacity claim and the broad warning about models spanning a halving need evidence if reopened.

No protected wording was silently corrected. No changed line adds a new product, settlement, collateral, legal, access or performance claim. The CMS proposals remain proposals for review and were not saved to Sanity or published.

## Verification

- Exact-row validation: all four `before` values match the refreshed published documents; keyed FAQ paths and text-only scope validated. No short-definition or reserved-document changes.
- Python web-channel checker on changed prose: 0 CUT, 0 CHECK, 0 STYLE.
- Python web-channel checker on the final retained/proposed prose for the 18 unreserved terms: 0 CUT, 0 CHECK, 0 STYLE. No quotation exceptions. Block subsidy remains outside the editing pass.
- `npm run check:glossary`: passed the existing migration/parser/published-draft isolation and audit regressions. This tests source safeguards, not these proposals in a deployed page.
- `npm run typecheck`: passed.
- `npm run check:brand`: passed; vendored brand intact, 0 CUT. Its scan of the shared branch reported 14 CHECK and 4 STYLE findings in other agents' files, none in the glossary source changes. These must be accounted for in the combined review.
- No build or rendered browser run performed in this subtask. No runtime, draft-editor-state or publication claim is made. Readability and AI-detector scores were not used as acceptance tests.

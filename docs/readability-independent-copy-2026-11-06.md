# Independent readability review, 6 Nov 2026

Independent evaluator; no implementation or proposal edits. Reviewed the complete current sources against HEAD, the actual three-row FAQ proposal against `work/brand-copy-validation/readability-current-published-2026-11-06.json`, and the acceptance document. Worker handoffs were supplementary evidence, not the basis of these verdicts.

Applied the Doefin humanise skill and vendored voice-editor procedure after reading CLAUDE, brand AGENTS, Matteo's thinking and relevant edits, voice, compliance, website/content-type and visual guidance. Brand v0.2.0, `936bc5c`, is verified locally. Plain language and progressive disclosure are implementation judgements here; no keyword score or user-testing claim establishes acceptance.

| Package | Verdict | Required revisions |
| --- | --- | --- |
| Newsletter | Accept | None |
| Hashprice FAQ | Accept | None |
| Institutions | Accept | None |

These are independent source/editorial verdicts. Integrated build, typecheck, served HTML and desktop/mobile interaction evidence belong to the parent review. No browser run, CMS draft inspection, remote write, publication or commit was performed by this evaluator.

## Newsletter: Accept

Read `app/(public)/newsletter/page.tsx` in full, its HEAD version, and both shared form implementations. The reader first encounters “Read findings from … recorded difficulty adjustments” and the sample's findings, source and limits. This is a concrete research task. The sentence “The report and dataset are public, with no email address required” explains access before any interaction.

The page-level disclosure is closed by default and says “Try the email preferences demo (optional)”. `#signup` is on its always-visible native summary; `#preferences-title` is the summary's visible heading. The actual form is inside the disclosure. The report, CSV and archive links are outside it and follow it, so closing the form does not hide or gate research access. Reading order is sample, optional demo, public destinations; the optional demo does not compete with the sample in a second column.

Opening the disclosure reveals the unchanged local notice before the fields: no subscription, email or saved personal details; entries clear on leaving or reloading. Consent, privacy, optional company fields, validation/focus handling, preview confirmation and the no-JavaScript explanation remain in the same shared form. A successful preview still clears the email and says no request was sent or alert scheduled. The company-context disclosure inside the shared form is retained; there is only one page-level preference form and no second delivery form. This is a full source-flow reading of closed/open/error/preview states, not a claim of browser interaction validation.

Independent comparisons and assertions confirmed:

- `NewsletterForm.tsx` and `NewsletterDelivery.tsx` are byte-for-byte equal to HEAD. The page mounts one `NewsletterForm` and no `NewsletterDelivery`.
- Sample identity, not-sent/not-scheduled qualification, 25 adjustments, 11 increases, 14 decreases, 3.75% mean absolute change, 12 Nov 2025–16 Oct 2026 and capture 22 Oct 2026 are preserved. Values were resolved from the actual unchanged capture, not copied from a handoff.
- The fixed historical window, non-live status and absence of a documented independent-node check remain next to the source. The forecast paragraph preserves the difference between observations and forecast evaluation, the need for a prior forecast record and the archive's lack of published predictions.
- Sample unsubscribe/manage-preferences wording remains explicitly hypothetical. The distinct research-commentary limitation remains. No cadence, working subscription or delivery service was invented.
- Public report `/api/v3/research/v1/report`, CSV `/api/v3/research/v1/dataset?format=csv` and archive `/data#prospective-archive` destinations remain reachable in source outside the disclosure. Shared `/privacy` and return-to-sample links remain unchanged.

Keep the historical findings, provenance and forecast limits. Change the formerly competing layout to this sequential flow; cut the duplicate email form and invitation. This follows Matteo's “say it once” habit without cutting distinct qualifications. No required revision.

## Hashprice FAQ: Accept

Reviewed the complete `glossary-hashprice` document in the supplied current published snapshot, all three questions with their proposed answers, and the actual rewrite JSON. Independently reopened the three primary Luxor pages linked below. This is a local proposal: it has not changed published content or proved that no private draft exists.

| Question | Actual revised passage and judgement |
| --- | --- |
| What does hashprice tell a miner? | “Expected mining revenue per unit of hashrate per day” answers the metric question directly. “Before electricity and other operating costs” prevents revenue being read as operating margin. The remaining sentences preserve machine efficiency, electricity price, other applicable costs, actual power/pool terms and a comparison using the same currency, hashrate basis and time period. This fixes the original categorical running decision without giving a new one. |
| Why do published hashprice figures disagree? | The answer names transaction-fee averaging, USD-conversion prices and observation times, then asks for method, units, timestamp and pool-fee treatment. These are concrete comparison inputs, without ranking what explains “most” differences or making claims about how many publishers disclose their methods. |
| Where does the term hashprice come from? | “Luxor says it coined the term in 2019” attributes the history. The next sentence calls hashprice a revenue metric and gives its denomination and daily basis. The unsupported adoption claim and the confusion between a metric and an industry-standard unit are removed. |

[Luxor's hashprice definition and calculation](https://docs.luxor.tech/hashrateindex/hashprice) supports expected revenue, daily hashrate basis, BTC/USD denominations, attributed history and the calculation inputs. [Intelligent Miner](https://docs.luxor.tech/platform/commander/intelligent-miner) demonstrates why machine power/hashrate profiles, electricity charges, operating constraints and transition costs affect an operating decision. [Revenue & Payments](https://docs.luxor.tech/platform/mining/revenue-payments) distinguishes pool fees from spot FPPS. Possible differences among publishers are an inference from these calculation inputs, not a publisher survey.

Independent planner/reconstruction assertions confirmed exactly three rows, all for `glossary-hashprice`, type `glossaryTerm`, and only `faq[_key=="faq-0"].a`, `faq[_key=="faq-1"].a`, `faq[_key=="faq-2"].a`. Every `before` string matches the supplied current snapshot. Applying the pure planner produces one `faq` field patch. Restoring the three old answers makes the complete reconstructed document identical to its baseline: questions, keys, order, body, short definition, identity, slug and every other field are preserved. The input snapshot is not mutated. A simulated existing draft blocks planning. About, Block subsidy and their drafts are not targeted.

Keep the questions and approved short definition; change only the three overconfident answers. The revised answers give the metric and its limits in Matteo's precise register. No required revision.

## Institutions: Accept

Reviewed all of `components/v3/InstitutionsPage.tsx`, the complete HEAD version and the unchanged `InstitutionsExplorer.tsx`. The four actual headings now ask recognisable reader questions: “What decision are you making?”, “What are the costs and outcomes?”, “Could you exit the position?” and “Who can approve the amount?”. Their paragraphs answer those questions without exposing internal editorial process.

“Start with the decision your team needs to make” gives the first checklist item a concrete subject. “Check what your team needs to report and how the position affects cash needs” explains the former reporting/cash-needs noun list. “Your authorised reviewers … They must …” makes responsibility and the pre-capital approval condition explicit. These are useful changes to the thought and reading flow, not merely banned-word substitutions.

The finance explanation now separates “Production depends on difficulty throughout the period” from “A position’s outcome depends on difficulty at one observation block”. It then states the fixed winning payout and the mismatch with production losses. The full paragraph still distinguishes a production measure from a threshold-based position, rather than equating a block observation with settlement or a hedge with complete cover.

| Requirement | Verified in the actual final page |
| --- | --- |
| Protected hero and trading risk | Entire opening hero/instrument block is byte-for-byte equal to HEAD. |
| Production comparison | Mining cash plan/borrower assessment; expected BTC production; shortfall versus position cost and both payouts; fees, position size and timing remain. |
| Partial hedge and full loss | The partial-offset qualification and separate uptime, energy-cost and BTC-price analysis remain. Checklist 2 retains “You can lose the full amount paid for a position.” |
| Production illustration | Entire 1 BTC / 10% / approximately 0.909 BTC aside is byte-for-byte equal to HEAD, including assumptions and estimate/not-forecast/not-position-size limits. |
| Business analysis and privacy | Decision, fleet assumptions, period, operating forecast, model limits/open questions, shared inputs/results and private notes excluded from public links remain. |
| Outcome, settlement and funding | Threshold/observation checked against the analysis; settlement block, payout and redemption read separately; collateral, funding, fees, reporting and cash needs remain. |
| Execution and technical requirements | Depth, partial fills, exit options, limited liquidity preventing a full exit, wallet/custody controls, smart-contract deployments and technical evidence remain. Token, contract, network and settlement dependencies remain. |
| Mandate and approval | Authorised reviewers, organisational mandate/eligibility, legal/accounting questions, approved amount before committing capital, own suitability review and no minimum fleet/capital set by the walkthrough remain. Free public material still establishes neither suitability nor approval. |
| Funds/desks and navigation | No fleet model required for a view assessment; terms must match the view. All IDs, hrefs, mailto subjects, labels, attributes and the explorer invocation remain identical. |

Independent TypeScript AST comparison found that removing JSX text makes the before/after sources identical: only visible prose changes. The complete explorer source is byte-for-byte equal to HEAD. Keep the protected explanation, example and risks; change the checklist's procedural headings and compressed phrases as implemented. No required revision.

## Checks and remaining review boundary

- Independent focused assertions passed for all invariants described above.
- `check-voice-drafts.mjs` against the supplied current published snapshot passed: one document, exactly three changed strings, no conflicts, no CHECK or STYLE findings.
- Independently extracted final prose for Newsletter, FAQ and Institutions passed the vendored Python web-channel checker: each had 0 CUT, 0 CHECK and 0 STYLE. Source extraction does not replace the parent's whole rendered-page review.
- `npm run check:brand` passed with the vendor intact and 0 CUT / 0 STYLE. Its only aggregate CHECK is outside these packages, `components/v3/V3Scoreboard.tsx:22`, the “Return” label, handled by the separate Numbers/Accuracy review.

No contextual checker CHECK passage exists in these three extracts. Matteo should still read FAQ 0's operating-decision correction and FAQ 1's methodology correction, together with Institutions' revised outcome paragraph and checklist 2/4 wording about funding, mechanics and approval. The checker does not approve factual changes, product wording or publication. A later CMS application requires a fresh published comparison and actual existing-draft/editor-state checks. These verdicts create no additional publication permission or requirement beyond the existing task boundary.

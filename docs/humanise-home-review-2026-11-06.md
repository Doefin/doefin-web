# Homepage, resources and product copy review

Codex editorial pass for Fardin to read before Matteo reviews sensitive wording. No publication approval is implied.

Source: current main base `10c516b`; published-page text in `work/brand-copy-validation/live-humanise-review-2026-11-06.json`. Brand v0.2.0, commit `936bc5c`. Read Matteo’s thinking, actual edits, voice, compliance, website and content-type rules, voice-editor procedure, visual rules and site mapping. Read the installed Next.js layouts/pages guide before editing.

## Coverage and decisions

Read the homepage from hero to closing, including its market diagram, purchase example, screenshot, FAQ and updates in the published snapshot. Read resources, the miner introduction and cautions, product introduction and settlement example, plus every navigation description. Reviewed both responsive screenshot explanations. `IntroSections.tsx` contains no visible prose and is unchanged.

| Where | Decision | Before → after | Reason |
|---|---|---|---|
| Home hero, production heading, how-it-works heading/timing, closing | Keep | Existing wording retained | Agreed copy already identifies the readers, action and limit (E13–E15, E19). |
| Home production example | Change | “suppose your fixed hashrate would produce 1 BTC” → “your fixed hashrate is expected to produce 1 BTC” | State the expected baseline directly before applying the higher difficulty. Same calculation and assumptions (E06). |
| Home example limits | Change | “not a forecast or a suitable position size” → “It does not forecast production or tell you how large a position to buy.” | Name the two things the example cannot tell the reader. Keep the separate pool, fee, power and price assumptions. |
| Home production-to-contract link | Change | “See how this relates to a contract” → “Compare production and contract payout” | Say what the destination explains. |
| Home hedge note | Change | “Whether it offsets a production shortfall, and by how much, depends on…” → “Its cost, size and timing determine how much of a production shortfall it may offset.” | Put the determining factors first, retaining “may” and the mining-risk limit (E17). |
| Home market choice | Change | “Review the difficulty threshold and observation block” → “Check the difficulty threshold and the block at which difficulty will be observed.” | Explain the unfamiliar block label at first use. Explain shares as tokens representing the position. Preserve the inclusive Yes threshold. |
| Home funding | Change | “Check which collateral token your selected market requires and fund your account with that token” → “Fund your account with the collateral token required by your market.” | Start with the task; retain market-specific tokens, direct cbBTC funding, native BTC conversion through SwapKit and the wrapped-asset warning. |
| Home redemption | Change | “For cbBTC markets, each winning share redeems…” → “Each winning share in a cbBTC market redeems…”; “Losing shares have no payout” → “Losing shares pay nothing.” | Keep the market condition attached to the 1 cbBTC amount and make the losing result direct. Preserve the existing profit/loss sentence. |
| Home setup and evidence | Change/cut | “You do not need to repeat the learning steps” removed; “Know what to check” → “Check the product and its risks.” | The returning-position link already provides the action. Evidence cards now name their purpose. No section or responsive variant removed. |
| Home learning cards | Change | “Tools and reading you can use” → “Try a calculation. Read the explanation.” | Give the section a task; describe hosting fees/downtime/curtailment and simplified payback cash flows concretely. Distinct desktop action labels remain. |
| Home research link | Change | “Sourced historical findings, public CSV and citation metadata” → “Check the historical findings and their sources, download the CSV or cite the report.” | Replace a list of artefacts with the things a reader can do. Retain 25 observations and their distinction from made-up forecast examples. |
| Resources calculator cards | Change | “Bring fees and lost hours into the effective rate” → “See the hosting rate after fees and lost operating hours”; “Which assumptions change capital recovery?” → “How long could the fleet take to pay back?” | Use the reader’s cost and payback questions. Retain session-only saved-quote comparison and simplified cash-flow assumptions. |
| Resources section headings | Change | “Build the context behind a decision” → “Learn how mining works”; “The right term, explained” → “Look up a mining term”; “Inspect the observations. Understand the methods” → “Check the data and the calculations.” | Distinguish reading, lookup and data verification. |
| Resources evidence and email labels | Change | “Synthetic teaching exercise · Authored values” → “Teaching exercise · Made-up values”; “Explore research emails” → “Try the research email demo” | State that the values are made up and the email interface is a demo. Keep no-send/no-save limits. |
| Screenshot explanation, desktop and mobile | Change | “hourly order-book midpoints” → “the midpoint between the best buy and sell prices each hour” | Explain the term rather than making readers infer it. Both variants retain market pricing versus forecast, quote and network difficulty. |
| Miner introduction | Keep | Existing intro and metadata retained | Agreed production and partial-offset explanation already works (E20). The planner is separately owned. |
| Miner caution | Change | “A contract, not a production guarantee” → “A position does not guarantee production”; “Position cost…” → “What you pay…” | Direct subject and verb; all risks remain. |
| Product hero and audience cards | Keep | Existing text retained | Agreed distinction between hashrate exposure and difficulty outcome remains explicit (E23). |
| Product labels and pre-trade checks | Change | “Underlying” → “What it tracks”; one long pre-trade list → two sentences beginning “Check the threshold and observation block…” | Explain the label and group checks without dropping price, fees, payout token, collateral, liquidity or full-loss risk. |
| Settlement heading and comparison cards | Change | “Production changes continuously. A contract settles at a threshold” → “Production varies. Payouts are all or nothing”; “Match the horizon” → “Compare the time periods”; “residual risk” → “other risks” | Keep the production/contract distinction concrete. Production differences can be positive or negative; they have not been narrowed to shortfalls. |
| Settlement payout explanation | Change | “before considering what you paid and any fees” → “To work out profit or loss, you also need what you paid and any fees.” | Explain why full payout is not the net result (E26). Preserve the illustrative/no-quote boundary. |
| Navigation descriptions | Change | “instrument”, “exact inputs”, “evidence status”, “constructed”, “operating definitions” → descriptions of difficulty markets, assumptions, example figures, calculation and mining terms | Familiar words say what is at each destination. Labels, destinations and navigation behaviour remain. |

## Separate factual-clarity item: collateral wording

Implemented the parent’s requested qualification for acceptance and Matteo’s review. This is a scope correction rather than a style-only synonym change.

- Product before: “Fully collateralised positions in a BTC-denominated token, as described in the current documentation.”
- Product after: “Positions are fully collateralised. Check your market’s collateral token and payout terms in the app.”
- Settlement before: “The current product documentation describes fully collateralised positions settling in a BTC-denominated token. Verify the specific token and contract terms in the app. Network difficulty is publicly observable; checking that value yourself does not remove smart-contract, token or execution risks.”
- Settlement after: “Positions are fully collateralised. Check your market’s collateral token, payout terms and contract terms in the app. You can check network difficulty yourself. This does not remove smart-contract, token or execution risks.”

The full-collateralisation claim stays. The universal BTC-denominated-token claim is replaced by a market-specific check; no active-token list was invented. Public difficulty observability and smart-contract, token and execution risks stay.

A remaining inherited claim is outside this agent’s ownership: `content/docs.ts:38` says “All positions are fully collateralised and settle in a BTC-denominated token, so payouts stay denominated in BTC.” This is exported by `content/index.ts:52` through `publishedDocs()` and rendered inside SettlementPage’s source-document disclosure. Flagged to the parent; not edited here. It is retained local content, distinct from the Sanity V3 docs reader also exported by the barrel.

## Preserved facts and structure

- Production remains expected BTC production, with fixed hashrate and unchanged uptime, block reward and other assumptions. No revenue or profit promise was introduced.
- All prose numbers and numeric code literals in the owned files match the base, including 1 BTC, 10%, 1 ÷ 1.10 ≈ 0.909 BTC, 0.091 BTC (9.09%), 1 cbBTC, 25 observations, 130T/129T/135T, screenshot values, block heights, dates, scales and table outcomes.
- Observation at a specified block remains distinct from redemption after resolution. Calendar dates remain estimates. Yes includes equality; No is below the threshold.
- cbBTC-specific funding and payout remain conditional on the selected market. cbBTC remains a wrapped asset, distinct from native BTC. The separate scope correction is recorded above.
- Market prices remain distinct from executable quotes, forecasts and Bitcoin difficulty. The screenshot remains dated and not live. Example data remain illustrative and separate from observed network data.
- Partial hedging, full-loss risk, costs, liquidity, uptime, energy, BTC-price and collateral/technical risks remain. The purchase example and approved risk wording were not changed.
- AST structure, identifiers, numeric literals, non-copy JSX attributes, URLs and anchors are unchanged. Visible text inside existing copy props changed, but prop names, expressions, data bindings, formulas, layout and responsive branches did not. No vendor, seed, CMS, article, About or protected glossary text was changed.

## Checks and remaining review

- Focused TypeScript parse and AST/source checks passed on all nine owned source files. Also compared every prose number and every URL/anchor string with `HEAD`. Temporary script: `/tmp/doefin-home-source-check.cjs`.
- Extracted all 76 changed string/JSX prose fragments, including metadata and array-held text; Python brand scan with `--channel=web`: **0 CUT, 0 STYLE, 3 CHECK**. Temporary extraction: `/tmp/doefin-home-changed-prose.txt` and matching location JSON.
- `npm run check:brand` passed; vendored v0.2.0/936bc5c intact. Its shared-tree output included unowned style notes on TypeScript non-null assertions; none were in the owned final prose scan.
- `git diff --check` passed. Full typecheck, build, rendered brand/crawlability and desktop/mobile browser review belong to the parent’s final verification. They were not run by this agent.

Exact changed-prose CHECK passages retained for Matteo:

1. `app/(public)/page.tsx:59`: “Each winning share in a cbBTC market redeems for 1 cbBTC. Check the displayed payout and collateral token for other markets. Losing shares pay nothing. Your profit or loss also depends on what you paid and any fees.” Retain because payout, loss, cost and fees must remain distinct. No amount changed.
2. `components/v3/pages/SettlementPage.tsx:19`: “These values explain the rule. They are not an available market or a quote. ‘Full payout’ means the amount specified by the contract. To work out profit or loss, you also need what you paid and any fees.” Retain because this qualifies the illustrative payout table.
3. `components/v3/pages/SettlementPage.tsx:32`: “Position price, fees and size affect your profit or loss. Power costs, downtime and Bitcoin price remain separate risks.” Retain because it explains both the position result and the mining risks a position does not cover.

There are no changed-prose STYLE exceptions. The collateral scope correction and the reworded settlement/payout explanations require Matteo’s reading before publication. No financial example values, performance claims or access rules were added.

Final consecutive reading completed across home, resources, miner wrapper, product, settlement and navigation. Remaining dense passages are the unchanged technical difficulty definition under the settlement table and the inherited source-document disclosure. The definition is short, factual and useful here; the disclosure’s universal-token claim needs the parent’s source correction. Some repeated pre-trade and risk checks remain because each page can be an entry point. No structural cut is proposed. Mobile/desktop explanation variants remain intact.

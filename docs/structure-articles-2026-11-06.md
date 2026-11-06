# Article explanations and reading structure, 6 Nov 2026

Codex editorial pass for Fardin to read. The source-shell changes are local. The 10 rows in `studio/rewrites/2026-11-06-structure-articles.json` are concrete CMS proposals, not published text. No CMS write, browser write, commit, push or publication was performed.

## Current source and boundaries

The baseline is the complete published `.result` in `work/brand-copy-validation/structure-current-published-2026-11-06.json`, fetched after the previous publication. Both scoped documents have revision `k8hlzjuhoL42eLegpVdC8V`, updated 6 Nov 2026 at 11:09:46 UTC. The ten exact `before` values resolve against that snapshot. A later edit or draft still requires a fresh conflict check before application.

Only these CMS documents are proposed for change:

- `editorial-blog-what-a-static-growth-assumption-costs-you`
- `editorial-blog-reading-a-hashrate-chart-honestly`

Academy was read for context and is unchanged: no specific gap there was necessary to resolve these two article explanations. The three E30 paragraphs and their entire first section remain exact. No short definition, About, Block subsidy, migration seed, schema, vendor file or financial/position example was changed.

Brand source: Doefin brand 0.2.0, commit `936bc5c`. Read Matteo’s thinking first, relevant edits including E06/E24/E25/E28/E30, voice, compliance, website and research/tool guidance, the voice-editor procedure, visual rules and `docs/brand.md`. Read installed Next.js server/client-component guidance before source edits. The pass applies the doefin-humanise skill by explaining each thought from its meaning, then checking facts against the baseline. A checker pass is not a human sign-off.

## Before and after structure

| Article | Before | After |
| --- | --- | --- |
| Difficulty growth | Assumption/forecast distinction → circular statement that changing a path changes results → suitability limit | Same-fleet causal mechanism and existing one-period production example → separate monthly compounding, cash balance and interpretation of payback differences → finite-horizon and suitability limits |
| Hashrate chart | Approved E30 explanation → one paragraph saying windows differ → generic band-method requirement | Exact E30 explanation → hypothetical comparison showing why the same blocks move short and long windows differently → centre line/band interpretation and a concrete distinction between timing uncertainty and input correctness |

All three section keys and anchors in each article stay stable. Paragraph arrays expand to teach distinct points, rather than preserving an inadequate one-paragraph template.

## Key passages

| Location | Before | After and reason |
| --- | --- | --- |
| Growth, comparison | “Changing the difficulty path changes the production and payback estimates for a fleet.” | “At the same fleet hashrate, higher difficulty means more work is needed to find a block. With uptime and block rewards unchanged, expected BTC production falls over the same period.” Supplies the missing causal mechanism (E06). |
| Growth, example | No production example | Reuses the existing illustrative 1 BTC month and a difficulty level held 10% higher throughout that same month: `1 ÷ 1.10 ≈ 0.909 BTC`, about 9.1% less. Fixed hashrate, uptime and block rewards are explicit. This is separately identified as a level comparison, not monthly growth. |
| Growth, payback | Reader told to compare paths while holding inputs fixed | Explains that unchanged BTC price converts lower expected production into lower expected mining revenue. The model starts below zero by the initial outlay, adds revenue after power costs each month and reaches payback at its first non-negative balance. |
| Growth, interpretation | “Otherwise, a difference in the result may come from another input.” | “A later payback date under faster growth shows that lower production leaves less cash to recover the same initial cost.” The gap measures sensitivity to an assumption; it does not identify the future path. |
| Growth, limit | Calculator cannot decide suitability/economics; timing/cost/liquidity/constraints/objectives and no measured threshold | Keeps every one of those limits and adds what a negative final balance actually means: initial cost was not recovered within that modelled period; recovery after it remains unknown. |
| Hashrate, windows | “Blocks arrive irregularly, so estimates over short and long windows can differ.” | Explains a hypothetical run of faster blocks observed over two windows with the same end time. It has more influence on the shorter window; the longer window includes more earlier blocks. This explains a visible disagreement without inventing an actual network event. |
| Hashrate, interpretation | Chart change alone does not establish changed capacity | Keeps that qualification and adds the longer window’s trade-off: it smooths recent variation but responds less quickly to change. Distinct timestamps, difficulty inputs and units remain relevant. E29’s approved explanation that 144 blocks are not always 24 hours gives a concrete time-window limit. |
| Hashrate, band | “An error band shows uncertainty under a set of assumptions.” | Explains that the centre line is one estimate, and a visually precise line can still sit inside a wide uncertainty band. A conditional example distinguishes uncertainty from irregular block timing from correct difficulty/time inputs. Width alone does not establish accuracy. |

The JSON contains every full before/after paragraph, not only these excerpts.

## Source-shell changes

`V3BlogPost.tsx` removes the repeated generic sentence “This article does not report measured market performance.” That sentence describes an unrelated class of evidence on a chart-reading article and adds no production, execution, settlement or loss qualification. Each article retains its specific local evidence limits. The site footer’s professional-investor, full-loss and investment-advice wording remains unchanged in `Chrome.tsx`.

The payback next-reading card now asks readers to change growth assumptions and inspect cash balances. The hashrate card identifies its existing destination as forecast methodology, matching that page’s subject. URLs, section IDs, contents controls, related-article selection, article data, SEO, dates and reading-time calculation remain unchanged. `V3Editorial.tsx` removes the same generic market-performance explanation from its collection summary. That generic collection renderer is currently overridden by `V3BlogIndex`; this is source consistency, not a claim of an additional runtime change. No visual redesign was made.

## Fact-preservation map

| Fact or boundary | Evidence and final treatment |
| --- | --- |
| Expected production falls inversely with difficulty | Matteo E06/E29/E35 and existing production illustration documented in `docs/v3-content-provenance.md` and `docs/v3-content-navigation.md`. Existing example only, explicitly illustrative and conditional. |
| Level versus growth | Example holds the difficulty level 10% higher for the whole same month. Monthly growth is explained separately as repeated application to the preceding month’s difficulty. No 10% monthly path or measured result is implied. |
| Production arithmetic | Independent Python Decimal calculation: `1/1.10 = 0.909090909… BTC`; shortfall `9.090909…%`. Rounds to 0.909 BTC and 9.1%. No money, position price, payout, profit or suitable order size is calculated. |
| Payback mechanics | `components/tools/PaybackModel.tsx`, `simulate`: starts at negative capex, applies monthly compounded difficulty before production, adds revenue less power costs, records first cumulative balance ≥ 0. No model code or figures changed. |
| Fixed comparison inputs | Same hashrate, power cost, uptime, capital cost and BTC price remain explicit. Mention of constant uptime is a comparison assumption, not a claim of a new uptime control; the simplified payback implementation does not model downtime. |
| Model uncertainty | Scenario has a stated period; distinct from measured historical data and a dated forecast. Simplified estimates may differ from actual production/costs. No recovery within the horizon does not settle later recovery. |
| Position decisions | Objectives, timing, transaction costs, liquidity and operational constraints retained. Exact no-measured-hedge-threshold sentence retained. No recommendation or guaranteed recovery added. |
| Hashrate definition and contract distinction | All E30 paragraphs unchanged: difficulty/block timing estimate, no direct machine count, ten-minute implied series, sharper 144-block estimate, neither live, method/window/units, and difficulty at specified block determines the contract. |
| Window interpretation | Current article’s irregular blocks and differing windows plus E29/E30. A hypothetical sequence explains the same source-backed mechanism; no current event or uncertainty number added. |
| Band limits | Retains assumptions/method and exact no-measured-width/no-recent-noise sentence. The conditional input-correctness example is an explanation of the limit of a stated band, not an asserted measured result or claim about a named estimator. |
| Content identity | `_id`, `_type`, slugs, canonical identity, section `_key`/`id`, topics/references, sort order and every date are untouched. No publication date is invented. |

## Validation and remaining limits

- All 10 rows have unique keyed paths and exact current-published `before` values. Scope is exactly two allowed documents. All other snapshot documents are unchanged after local application. Nonempty paragraph arrays, stable section metadata and exact E30 were asserted.
- Independent Decimal arithmetic passed for both displayed production figures.
- Python checker over the two complete final articles: **0 CUT, 0 STYLE, 0 CHECK**. Exact CHECK list: none. STYLE exceptions: none.
- Python checker over extracted prose from both source components: **0 CUT, 0 STYLE, 0 CHECK**.
- `npm run check:brand`: passed; vendor intact, 0 CUT, 0 CHECK, 0 STYLE at the time of the run.
- `npm run typecheck`: passed.
- `node scripts/check-editorial.mjs` and `node scripts/check-editorial-schema-import.mjs`: passed. These validate existing parser/schema/import behaviour; exact proposal values and identity preservation were checked separately against the published snapshot.
- No shared build, deployment, browser verification or CMS application was performed in this subtask. Local prose artifacts are in `work/brand-copy-validation/structure-articles-{final-prose.txt,source-prose.txt,applied.json}`. Parent validation covers the integrated branch.

Continuous final reading: the growth article now earns the comparison by explaining the physical mechanism, one conditional production illustration and how expected revenue changes cash recovery. Its longer second section is necessary to explain monthly growth separately from the one-period illustration. The chart article now shows how the same observations can produce different curves, then explains why the line and band need separate attention. Each article ends with its own evidence limit rather than a repeated market-performance warning. No measured uncertainty width, actual recent capacity event or economically justified hedging threshold is available in this scope; none is invented.

Ready for Fardin’s reading. The payback discussion is source-confirmed explanation, not a new financial example or outcome. Any later settlement/collateral/product/access edits would require Matteo’s review under the brand rules; none is introduced here. This pass is neither publication approval nor human sign-off.

## Independent review correction

The independent evaluator reproduced a case with first payback in month 8 and a negative balance at month 120. The final article now distinguishes no zero crossing from a negative ending balance after earlier recovery. Readers are told to read the first payback month and full cash-balance path together. The model and its inputs are unchanged. The summary was also shortened to 154 characters to meet the metadata limit.

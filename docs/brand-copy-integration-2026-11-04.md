# Brand copy integration, 4 Nov 2026

The prepared copy on `copy/matteo-v3-review` is reconciled with current `main`.
The wording comes from the existing review and rewrite, rather than a new rewrite.
The guide is [Doefin brand and voice: how to use it](https://claude.ai/artifact/FuYM8YKchEqBNoT1fzUjCo#91003157-ee4a).

## Scope

- Resolve the 25 merge conflicts caused by the root-route migration.
- Keep public pages and links at `/`, including canonicals and Open Graph URLs.
- Keep `/api/v3/` versioning, query-preserving legacy redirects and `/studio`.
- Apply the prepared title default to `app/(public)/layout.tsx`. Keep the root
  layout and the Studio separation from current `main`.
- Update the journey check's source paths to the public route group.
- Keep the pinned brand v0.2.0 intact. No brand sync is needed: all 82 files match
  the current brand release.
- Keep the visual-token migration separate, as the guide requires. Existing
  colours, effects, logos and styling are not migrated by this change.

The live frontend repository is outside this change.

## Validation

Run with Node 22.22.3:

- Pass: production build, typecheck, `check:brand` and `git diff --check`.
- Pass: 34 source routing cases.
- Pass: tools, links, P0 corrections, publication and metadata checks; newsletter,
  scenario brief, public markets, market review and Bitcoin analytics checks;
  FAQ, About/authors, tool guides, research archive/methodology, docs, editorial
  and glossary source checks. The link check retains ten existing warnings.
- Pass against a built server with isolated CMS fixtures: 86 preserved routes,
  84 root pages, SEO on all 84 pages, crawlability on 12 selected pages, and the
  main journey with 39 linked destinations. Query-shaped fixtures use the
  migration seeds and do not establish current published CMS content.
- Pass in Chrome with those fixtures: homepage at 1440px and 390px has no
  horizontal overflow; mobile navigation opens, reaches `/product` and closes.
  The longer heading and nearby risk copy render at both widths.
- Brand guard: zero CUT, 12 CHECK and four STYLE alerts on added source lines.
  The STYLE matches are an explanation of position tokens, the existing
  screenshot's uppercase YES label and two code exclamation marks. Keep them.
- Rendered brand report with unchanged CMS seed fixtures: one CUT, 51 CHECK and
  109 STYLE alerts. The CUT is the existing wallet-doc wording covered by the
  prepared Sanity rewrite. Repeated shared text and text-boundary matches need
  triage; these counts are alerts, not distinct unreviewed claims.

## Sanity status

The read-only `npm --prefix studio run plan:voice-drafts` could not complete:
the Sanity query endpoint returned HTTP 403. Anonymous published reads also
returned HTTP 403. A normal local server consequently returned HTTP 500 for CMS
pages. The report-only brand crawler skips failed responses, so its zero-alert
result in that environment is not a successful page validation.

The logged-in Fardin Chrome profile provided working Studio access. The browser
pass accounted for all 49 planned documents. The initial pass saved 42 drafts;
the authorized follow-up brought the total to **47 unpublished drafts, covering
182 changed strings**. Before each change, the current document and its
planned before-values were checked in the Raw JSON inspector. Each completed
draft was compared with the expected complete document, excluding CMS system
metadata. Unrelated content, slugs, stable keys, anchors, references and editorial
dates were preserved.

The follow-up resolved five of the seven initially preserved documents:

| Document | Reason |
|---|---|
| `faq-fees-and-costs` | Original planned change saved and verified as a draft |
| `glossary-uptime` | Original planned change saved and verified as a draft |
| `glossary-pool-luck` | Both original planned changes saved and verified as a draft |
| `glossary-exahash` | Three changes saved and verified, including the user-approved merged definition |
| `glossary-hashprice` | Five changes saved and verified, including the user-approved merged definition and the planned paragraph cut |
| `about-doefin` | Still untouched, explicitly left for Matteo; Studio showed an active editor |
| `glossary-block-subsidy` | Existing draft still untouched, explicitly left for Matteo |

**Audit correction:** the initial conflict flags for the fees FAQ, Uptime and
Pool luck were incorrect. Fresh reads that checked document identity showed
their current text matched the original before-values. The real text conflicts
were the newer Exahash and Hashprice short definitions. The user approved exact
merged definitions that preserve those newer clarifications; both are under the
160-character limit (124 and 142 characters respectively).

The 12-row follow-up input is
[`2026-11-04-preserved-voice.json`](../studio/rewrites/2026-11-04-preserved-voice.json).
It records the current before-values and the approved after-values without
rewriting the historical 29 October plan. Its after-text passes the web checker
with zero CUT, one CHECK and zero STYLE findings. The CHECK is the fees FAQ's
profit-or-loss risk context; keep it and include it in Matteo's review.

Only About (six planned changes) and block subsidy (four) remain for Matteo.
A read-only comparison found the existing block-subsidy draft content matches
its published version, but it was preserved as instructed. No document was
published and no Sanity access setting or credential was changed.
The terminal API restriction remains separate from the successful Studio workflow.
The per-document record is
[`brand-copy-draft-audit-2026-11-04.json`](brand-copy-draft-audit-2026-11-04.json).

Next:

1. Review the 47 saved drafts in `/studio`; the existing writer will now skip
   these documents because drafts exist. Do not overwrite them with a bulk rerun.
2. Leave About and the existing block-subsidy draft to Matteo. Keep existing
   drafts and active editing work intact.
3. Matteo reviews the five sensitive categories before publication. An editor
   then publishes or discards each approved draft.
4. After publication, update migration seeds to match and rerun source parity,
   runtime, crawlability, SEO and rendered brand checks against the actual site.

## Matteo's review before publication

Review in [Sanity Studio](https://doefin-web.vercel.app/studio/structure) and
[PR #8](https://github.com/Doefin/doefin-web/pull/8/files). In Studio, open each
saved draft and use **Review changes**. Keep About and Block subsidy for Matteo;
the other 47 documents have verified drafts. Do not publish during this review.

The 4 November PR follow-up corrects four website explanations. These are proposed
factual corrections to the prepared copy, rather than a new sign-off from Matteo:

| Location | Before | Proposed correction | Reason |
|---|---|---|---|
| Homepage, Choose a market | Review the settlement block | Compare difficulty at the observation block; Yes includes equality | Market data has separate observation and settlement blocks. E25 explains that the specified observation determines the outcome. |
| Homepage, Sell or redeem | Every winning share redeems for 1 cbBTC | Limit that amount to cbBTC markets; direct other markets to their displayed payout and collateral | The explorer supports multiple collateral currencies. Keep the loss, fees and profit-or-loss wording (E15, E17). |
| Product introduction | Above or below a specified level | Yes wins at or above the threshold; No wins below it | Match the existing outcome table and E25; keep the exposure distinction (E23). |
| Miners planner, assumptions | Production-based payout formula in both modes | Show the production formula with 0.01 rounding in protection mode; risk budget divided by No price in premium mode | Match `estimateProtection` and `estimatePremium`; show the assumptions and keep the cbBTC risk sentence (E28). |

The follow-up also fixes the offline draft tooling: a failed edit blocks its whole
document, keyed list cuts are supported, both Change and Matteo text are scanned,
and writing requires an approved `--only` list. A single action request submits
the planned drafts. No CMS draft was written and no publication command was run
for this follow-up; the unscoped-write regression exits before client access.

The default source brand guard still reports 12 CHECK matches for Matteo:
homepage and explorer profit-or-loss wording; the miners page's warning that
estimates do not guarantee a suitable position or profit; epoch and tool return
wording; the production tool's warning that a return is not guaranteed; worked
example profitability/profit text; and the scenario brief's profit wording.
Retain risk statements while reviewing their context. The four STYLE alerts are
the explanation of position tokens, the screenshot's quoted YES label and two
code exclamation marks. They are not new prose-style violations.

Follow-up validation (Node 22.22.3 for build and typecheck):

- Production build, typecheck, source brand guard and diff whitespace checks pass.
- Offline voice regressions pass, including rejection of partial documents,
  keyed cuts, protected existing drafts, changed source, Matteo paragraph arrays,
  CUT detection and rejection of unscoped writes. No CMS requests are made.
- The full 607-row historical rewrite passes against a snapshot reconstructed
  from its prepared before-values: 49 documents, 192 changes, zero CUT, seven
  CHECK and five STYLE matches. This checks internal plan consistency, not live
  CMS parity. The STYLE matches explain position tokens in docs.
- Public-market/planner arithmetic (17 cases), routing (34 cases), tool microcopy,
  P0 corrections and publication contracts pass.
- Against a production build using isolated CMS fixtures, all 12 crawler checks
  and SEO checks on all 84 pages pass. The main journey reaches all 39 linked
  destination pages successfully.
- Browser checks confirm the homepage corrections and product equality wording,
  and exercise both planner modes using isolated market fixtures. Protection
  shows the production formula with 0.01 rounding; premium shows risk budget
  divided by No price. Both keep the cbBTC risk sentence. There is no horizontal
  overflow on the homepage at 1440px/390px, product at 390px or planner at
  1280px/390px. Fixtures are confined to ignored local validation files.

The deployed preview and current published CMS content are separate evidence;
these local checks do not establish either. Publishing remains on hold.

The full review list and factual questions remain in
[`copy-rewrite-2026-10-29.md`](copy-rewrite-2026-10-29.md). In particular:

| Location | Prepared wording or example | Review needed |
|---|---|---|
| Homepage, How it works | "All done in a few minutes." | Timing claim against current funding flows |
| Homepage, Sell or redeem | "For cbBTC markets, each winning share redeems for 1 cbBTC." | Review the collateral qualification and direction to other markets' displayed payout |
| Product introduction | "Yes wins at or above the difficulty threshold; No wins below it." | Review the equality clarification against the existing outcome description |
| Product and settlement pages | "Fully collateralised positions in a BTC-denominated token" | Collateral description |
| Homepage, production note | "A Doefin position pays a fixed amount or nothing, depending on difficulty at its observation block." | Settlement wording; observation versus settlement terminology |
| Navigation, For miners | "Estimate the effect of rising difficulty on expected BTC production, and hedge part of it." | Product claim |
| Homepage market example | 60 paid, 100 payout, 40 profit or 60 loss, before fees | Financial example; retain both outcomes and the illustrative label |
| Miners planner | Dynamic cost, payout and net-result wording | Financial examples; retain the loss and collateral limits |
| Research archive | "The prototype’s dated forecasts and scoreboard are illustrative" | Performance and evidence status |
| Homepage fees FAQ | "Your profit or loss depends on what you paid and on any fees and costs, even when your position wins." | Fee and result wording; this is risk context, not a promise |

The one-liner, Enter app labels and footer risk sentence use the agreed wording.
The footer retains Matteo's shorter professional-investor wording. No open brand
decision is treated as newly settled by this reconciliation.

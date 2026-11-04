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
pass accounted for all 49 planned documents and saved **42 unpublished drafts,
covering 170 changed strings**. Before each change, the current document and its
planned before-values were checked in the Raw JSON inspector. Each completed
draft was compared with the expected complete document, excluding CMS system
metadata. Unrelated content, slugs, stable keys, anchors, references and editorial
dates were preserved.

Seven documents were left untouched:

| Document | Reason |
|---|---|
| `faq-fees-and-costs` | Current `answer` differs from the prepared before-text |
| `about-doefin` | An active editor was observed in Studio |
| `glossary-uptime` | Current FAQ answer differs |
| `glossary-pool-luck` | Current first body paragraph and FAQ answer differ |
| `glossary-exahash` | Current short definition differs |
| `glossary-block-subsidy` | An existing draft was preserved |
| `glossary-hashprice` | Current short definition differs |

The remaining 22 planned string changes belong to these seven documents. No
document was published and no Sanity access setting or credential was changed.
The terminal API restriction remains separate from the successful Studio workflow.
The per-document record is
[`brand-copy-draft-audit-2026-11-04.json`](brand-copy-draft-audit-2026-11-04.json).

Next:

1. Review the 42 saved drafts in `/studio`; the existing writer will now skip
   these documents because drafts exist. Do not overwrite them with a bulk rerun.
2. Rebase the seven preserved items on their current text with the editor. Keep
   existing drafts and active editing work intact.
3. Matteo reviews the five sensitive categories before publication. An editor
   then publishes or discards each approved draft.
4. After publication, update migration seeds to match and rerun source parity,
   runtime, crawlability, SEO and rendered brand checks against the actual site.

## Matteo's review before publication

The full review list and factual questions remain in
[`copy-rewrite-2026-10-29.md`](copy-rewrite-2026-10-29.md). In particular:

| Location | Prepared wording or example | Review needed |
|---|---|---|
| Homepage, How it works | "All done in a few minutes." | Timing claim against current funding flows |
| Homepage, Sell or redeem | "Each winning share redeems for 1 cbBTC; losing shares have no payout." | Settlement/collateral wording; the explorer also supports USDC markets |
| Product introduction | "above or below a specified level" | Reconcile the intended meaning with "at or above" in the outcome description |
| Product and settlement pages | "Fully collateralised positions in a BTC-denominated token" | Collateral description |
| Homepage, production note | "A Doefin position pays a fixed amount or nothing, depending on difficulty at its observation block." | Settlement wording; observation versus settlement terminology |
| Navigation, For miners | "Estimate the effect of rising difficulty on expected BTC production, and hedge part of it." | Product claim |
| Homepage market example | 60 paid, 100 payout, 40 profit or 60 loss, before fees | Financial example; retain both outcomes and the illustrative label |
| Miners planner | Dynamic cost, payout and net-result wording | Financial examples; retain the loss and collateral limits |
| Research archive | "The prototype’s dated forecasts and scoreboard are illustrative" | Performance and evidence status |

The one-liner, Enter app labels and footer risk sentence use the agreed wording.
The footer retains Matteo's shorter professional-investor wording. No open brand
decision is treated as newly settled by this reconciliation.

# Website editorial pass, 5 Nov 2026

The `doefin-humanise` skill was applied to the current PR #8 branch using the pinned
Doefin brand v0.2.0 (`936bc5c`). This is a Codex editorial pass for Fardin to read,
not a human sign-off or publication approval.

## Applied to website source

124 passages across 28 files were revised. The pass covers homepage and resource
explanations, institutional review, market/planner guidance, research and data
pages, calculator instructions, scenario briefs, newsletter notices, privacy
explanations and the Terms placeholder. It replaces indirect instructions and
internal terminology with concrete explanations. For example:

| Location | Before | After |
|---|---|---|
| Institutions | Make the review easy to forward. | Share the assumptions with your team. |
| Difficulty data | Inspect the backend point estimate and its source context, then distinguish it from the authored teaching examples. | Check where the current estimate comes from and what it tells you. The teaching examples below are separate. |
| Payback instructions | Enter consistent fleet, efficiency, power and outlay assumptions. | Enter fleet, efficiency, power and outlay figures for the same scenario. |
| Newsletter report link | Inspect provenance & publication status | Check sources & publication status |

The complete before/after record, with locations and editorial reasons, is in
[`humanise-source-audit-2026-11-05.json`](humanise-source-audit-2026-11-05.json).

The agreed one-liner, hero copy, app label, footer, risk statements and financial
examples remain. About, Block subsidy and the approved Exahash/Hashprice
definitions are untouched. No migration seeds or vendor files were edited. The
operative Terms text is unchanged; only its placeholder explanation was revised.

An AST comparison confirmed unchanged code structure, identifiers and numeric
literals in all 28 edited source files. A separate comparison confirmed unchanged
numeric text in every before/after pair. Routes, links, formulas and layout were
preserved. Copy length changes were checked in the rendered page.

## CMS: proposed, not applied

The read-only CLI request returned HTTP 403. Fardin's signed-in Chrome Studio
session reported that it could not reach Sanity servers, including after one
retry. No draft was written, discarded or published, and no access setting was
changed.

18 further edits are prepared in
[`humanise-cms-proposals-2026-11-05.json`](humanise-cms-proposals-2026-11-05.json).
These include the duplicated "The Use the app guides" phrase in the prepared
overview, dense explanation in the probability and collateral docs, and research
and calculator-guide wording. Their before-text comes from the prepared rewrite
plan, not a fresh read of current drafts. The recorded paths are hints: prior cuts
may have shifted array positions.

Once Studio access works, read each current draft by document ID, locate the
expected text and apply only matching changes. Preserve editor work, all unrelated
fields and the reserved documents. Do not use the published-document draft writer
to overwrite existing drafts. Do not publish.

## Checks and evidence limits

- Pass: production build and typecheck with Node 22.22.3.
- Pass: calculator microcopy, with no length warnings; public market/planner
  arithmetic (17 cases), P0 corrections (six cases), publication contracts and
  voice-draft regressions.
- Pass: scenario briefs (18 checks, including all 128 input-boundary combinations)
  and newsletter/delivery checks (29), plus the combined 49 checks including
  condensed-brief HTML handling. Bitcoin analytics checks pass.
- Pass: routing (34 cases), 86 preserved routes, SEO on 84 rendered pages,
  crawlability on 12 selected pages and the 39-destination main journey.
- Link check: no failures; ten existing glossary-link warnings remain.
- Browser: revised text was read on the homepage and institutional page at
  1440px. Resources, difficulty data, scoreboard, exposure calculator and miners
  planner have no horizontal overflow at 1440px or 390px.
- These runtime and browser checks use isolated CMS and market fixtures in ignored
  local validation files. They do not verify current Sanity drafts, live data or
  a deployed preview.

The brand's Python checker on the 124 revised source passages and 18 CMS proposals
reports **zero CUT, zero STYLE and three CHECK matches**. The CHECK passages are:

| Location | Exact text or context | Decision |
|---|---|---|
| `lib/scenario-brief.ts`, assumptions | A production difference is not a hedge size, contract payout, trading profit or recommendation. Assess the contract terms and settlement separately. | Keep the risk distinction; send to Matteo. |
| `components/v3/V3ToolsIndex.tsx`, closing note | Each calculator starts with example inputs, not live data. Enter your own numbers. The page URL saves the scenario so you can return to it or share it. | Keep. "Return" means reopening a page, not an investment return. |
| CMS proposal, managing positions | Splitting creates both sides together. It does not choose a direction or create a profit. | Keep the warning; confirm against the current draft before editing and send to Matteo. |

The repository brand guard, covering the entire PR since `origin/main`, passes
with **zero CUT, 13 CHECK and five STYLE matches**. The other CHECK matches remain
in homepage/explorer profit-versus-payout wording, miners' guarantee/profit
warnings, epoch and tools navigation, the payback return warning, worked-example
profitability limits and scenario-brief risk text. They are retained for context
review. The STYLE matches are an explanation of position tokens, the screenshot's
quoted YES label and three code exclamation marks.

A rendered scan across all 84 pages with unchanged CMS seed fixtures reports
**one CUT, 53 CHECK and 109 STYLE matches**. The CUT is the existing "unlock"
wording in the wallet-doc seed, already covered by the unpublished CMS rewrite.
Shared copy and text-boundary matches inflate these counts. This is not a clean
CMS validation and does not justify publishing or changing seeds prematurely.

## Before team review

Fardin should read the revised copy in context. Keep the distinction between that
human reading and this Codex pass. Matteo still reviews the sensitive categories:
product/hedging claims, settlement and collateral explanations, financial examples,
research/performance claims and legal/access/privacy wording. The prior factual
questions and publication hold remain in
[`brand-copy-integration-2026-11-04.md`](brand-copy-integration-2026-11-04.md).

The remaining CMS work is blocked on current Studio access. The source changes
and proposals are ready for Fardin's review; the whole website/CMS pass is not
fully applied. Nothing is merged or published by this task.

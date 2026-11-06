# Clearer website copy, 6 Nov 2026

The website now explains the subject more directly, with simpler headings,
shorter instructions and less repeated process language. The source changes are
ready for review. The corresponding CMS revisions are saved as **31 unpublished
drafts containing 167 text edits**. No new wording was published or PR merged.

## Delegation and acceptance

Seven workers reviewed separate content categories against the
[exact definition of done](humanise-acceptance-2026-11-06.md). Each read the
authoritative brand and used the `doefin-humanise` skill. A separate reviewer
challenged the source diffs and reconstructed CMS documents. The parent inspected
the work, required corrections, then checked the rendered result.

| Category | Result | Detailed record |
|---|---|---|
| Research and data | Explain the numbers and evaluation method directly. The observed report now has a compact download panel instead of repeating its own findings. | [Research review](humanise-research-review-2026-11-06.md) |
| Institutions | Separate team uses, internal questions, market selection, documentation and contact. Preserve the agreed hero and every distinct caveat. | [Institutions review](humanise-institutions-review-2026-11-06.md) |
| Articles and Academy | Replace internal-review headings with explanations of the subject. Preserve the approved hashrate explanation. | [Articles review](humanise-articles-review-2026-11-06.md) |
| Homepage and resources | Simplify the reader journey, funding/payout explanations and resource descriptions. | [Homepage review](humanise-home-review-2026-11-06.md) |
| Calculators | Explain inputs and results in plain language. Keep equivalent hosting cost separate from an invoice, and finite-horizon payback separate from “never”. Demo forms describe previews. | [Tools review](humanise-tools-review-2026-11-06.md) |
| Task documentation | Review all 18 pages; revise 13 and keep five. Preserve the practical steps, financial examples and risk statements that already work. | [Docs review](humanise-docs-review-2026-11-06.md) |
| Glossary | Keep approved short definitions. Simplify selected explanations and make six inherited factual qualifications explicit. | [Glossary review](humanise-glossary-review-2026-11-06.md) |

The [independent review](humanise-independent-review-2026-11-06.md) accepted the
final wording with no required correction left open. Its editorial scores are
judgements, not human sign-off or proof of user comprehension.

## Corrections required during evaluation

- Restore the absolute-error meaning where an early rewrite could have implied
  averaging signed differences. Distinguish observed current difficulty from
  estimated network hashrate.
- Describe glossary aliases as “other names”, since they include full-word
  alternatives as well as abbreviations. Update both visible and accessible
  search descriptions.
- Tighten three article/research summaries and the hosting-guide summary. The
  final hosting summary is below the existing draft checker's strict limit.
- Qualify the product's inherited universal BTC-token claim. Full
  collateralisation remains; the selected market supplies collateral and payout
  terms. The source disclosure in `content/docs.ts` is corrected too. This is a
  retained local runtime module, not a CMS migration seed.
- Stage six explicit glossary corrections separately from stylistic changes:
  each market specifies its observation block; neither a theoretical nor a
  fitted forecast range is validated by its label; ranges need outcome checks;
  remove context-free hashrate error percentages and the generalisation that a
  daily move is usually noise; qualify BTC-price effects on hashprice to its USD
  denomination. No replacement quantitative claims were invented.

The glossary corrections leave all `shortDef` values unchanged. The protected
confidence-interval short definition and aliases still warrant a separate
technical terminology review; this pass does not claim to settle that taxonomy.
About and Block subsidy are excluded from the CMS plan.

## CMS evidence

The category proposals contain **139 field-level decisions**. Whole paragraph
arrays were normalised into **167 individual text edits** for the existing
checker and writer; the final wording is identical. The executable reviewed plan
is [2026-11-06-plain-language.json](../studio/rewrites/2026-11-06-plain-language.json).

The normal authenticated Sanity CLI fetched current published text and draft IDs.
Its plan contained 31 documents and zero conflicts. The writer created absent
drafts from revision-checked server documents and applied the reviewed changes
in one atomic action batch. It did not copy a fetched full document into a
replacement or overwrite an existing editor draft.

A fresh authenticated raw read then checked every complete saved draft against
the published document plus only its intended edits. All 31 matched. Every
published revision and complete content value still matched the captured
baseline. The [revision and content-hash audit](humanise-cms-draft-audit-2026-11-06.json)
records the result. There were zero publication actions and zero changed short
definitions. Migration seeds and the pinned brand vendor are untouched.

## Validation

- Production build and typecheck passed with Node 22.22.3.
- Tool copy limits, 19 scenario checks including all 128 input-boundary
  combinations, 49 newsletter/delivery checks, 17 market/planner checks, six P0
  checks, publication contracts and voice-draft regressions passed.
- All 167 CMS before-values matched the captured published source. The checker
  passed with zero CUT, 11 contextual CHECK matches and one permitted STYLE
  match explaining shares as position tokens. Exact CHECK passages and reasons
  are recorded in the category reports. Financial and access wording still goes
  to Matteo for reading.
- The source brand guard passed with zero CUT, 14 contextual CHECK matches and
  four STYLE matches caused by unchanged TypeScript `!` operators on lines with
  copy edits. Worker prose extractions found no unqualified generated-copy or
  style violations. Vendor v0.2.0 (`936bc5c`) remains intact.
- The built preview uses frozen, freshly published CMS query results with the
  reviewed proposals overlaid, plus deterministic market fixtures. All 12
  crawler routes, SEO on 84 pages, 39 linked journey destinations, 34 route cases
  and 86 preserved routes passed. Links retain ten existing warnings and zero
  failures.
- Chrome reading checks covered nine representative pages at 1440px and 390px,
  including every category. All 18 checks had no horizontal overflow. The parent
  read the reconstructed article and report in their rendered context. These
  are preview checks, not claims that the new copy is deployed or published.
- The journey assertion now accepts the plain-language screenshot action while
  still requiring the capture date and non-live warning in its visible summary.
  No calculator formula, numeric input or route behaviour changed.

The initial preview adapter mistakenly replaced dereferenced objects with raw
references. That local-only adapter was corrected before the successful render
checks. A first checker run also caught a 160-character hosting summary at the
strict limit; it was shortened and the check passed. These were validation
findings, not production changes.

## Review and publication

Read source changes through the draft PR. In Sanity Studio, choose **Draft** and
**Review changes** for the 31 recorded documents. Read the sensitive settlement,
collateral, financial, evidence and access wording with Matteo. The source PR
and CMS publication are separate actions; neither has been merged or published
by this pass.

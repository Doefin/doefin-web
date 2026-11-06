# Readability refinements: integrated verification, 6 Nov 2026

Five work packages resolve the remaining findings from the live clarity review. This is a Codex editorial/implementation pass ready for Fardin and Matteo, not human sign-off or a claim of user testing. The definitions of done and primary research are in `readability-acceptance-2026-11-06.md`.

## Result and independent review

| Package | Concrete result | Independent verdict |
| --- | --- | --- |
| Numbers | Rounded, grouped primary T/EH/s/% readings; exact source values remain in native details in HTML; server and browser recovery use the same decimal-safe policy. | Accept |
| Accuracy | One existing fictional A/B/C dataset teaches row error, average error, range coverage/width, missing counts and the trade-off; separate exercises are optional links. | Accept |
| Newsletter | Historical sample first; one optional native-disclosure preference form; public downloads remain outside it. | Accept |
| Hashprice FAQ | Three answers distinguish expected revenue from an operating decision, qualify publisher comparisons and attribute the term without an unsupported adoption claim. | Accept |
| Institutions | Direct decision/cost/outcome/exit/approval questions replace stiff procedural wording while all real requirements remain. | Accept |

The two independent evaluators did not implement the packages. Their actual-result reports are `readability-independent-review-2026-11-06.md` and `readability-independent-copy-2026-11-06.md`. They inspected full source/proposals and retained facts/anchors, not only worker reports. Parent read every diff, the complete revised passages and the built pages.

Independent numeric validation used a separate Python Decimal oracle: **4,839 comparisons with zero mismatches**. Direct arithmetic confirms the unchanged A/B/C scores and range trade-off. The focused application suite covers **86 cases**, plus actual server and browser-component renders, source preservation, missing/failure/freshness branches and rounding boundaries. No API, parser, arithmetic model or source input changed.

## Browser finding resolved

A forced server-failure preview recovered real values through Chrome’s public API request, HTTP 200. The old global service-unavailable/no-values text remained above those values. Parent explicitly scoped failure badges/headings/messages to the server request. The evaluator accepted the correction after independently rendering ten combinations: difficulty/hashrate across regional, not-found, malformed, HTTP and network failures followed by browser success. No request/status logic changed. The final build and focused tests include this correction.

## CMS and protected content

The canonical `studio/rewrites/2026-11-06-readability.json` contains exactly three keyed Hashprice FAQ answer rows. A fresh published snapshot, planner and complete reconstructed glossary parsing validate the proposal. The approved short definition, body, question text, keys/order, identity, slug and every other field are unchanged.

Normal authenticated Sanity CLI access saved one guarded draft after confirming no existing editor draft or source conflict. A direct authenticated reread verified the entire draft against published content plus only the three proposed answers; the published revision/content remained unchanged. About and Block subsidy, including their published/draft slots, matched exact raw before/after reads. Evidence: `readability-cms-draft-audit-2026-11-06.json`. No publish action was sent.

## Integration checks

- Final production build and typecheck passed.
- Source brand guard: vendor intact; 0 CUT, 0 STYLE, one contextual CHECK: “Return to the data field guide” is navigation, not a financial return. Full package prose checks and additional API “returns a point estimate” context are recorded in the worker/evaluator reports. Necessary limits remain.
- Scoped CMS checker: one document, three exact-before rows, zero CUT/CHECK/STYLE; voice-draft conflict/race regressions passed.
- Readable-number tests, existing Bitcoin analytics conversion/status/browser-fallback checks, 49 newsletter checks, research contracts and calculator microcopy checks passed.
- 34 route cases, 86 preserved routes and 84 root pages passed. Rendered SEO on 84 pages and journey links to 39 destinations passed. Final-build crawler checks passed on all 12 designated pages.
- Link checks: zero failures, ten existing migration-seed/link-density warnings. Diff whitespace passed.
- Protected hero and production illustration remain exact. Shared form/delivery components, data/helpers, approved glossary definitions, About, Block subsidy, vendor and migration seeds were not edited.

## Browser evidence

The local production preview is http://127.0.0.1:3053. It uses a fresh published CMS fixture overlaid with the one proposed FAQ draft, a captured public analytics response and deterministic market fixtures. It is not a live deployment or a claim that all displayed market inputs are live. The ignored preload/captures are never deployed.

Chrome checks covered `/data`, `/data/difficulty`, `/data/hashrate`, `/data/scoreboard`, `/newsletter`, `/for/institutions` and `/glossary/hashprice` at actual 1440 × 900 and 390 × 844 viewports. All 14 checks had no document-level horizontal overflow or duplicate main IDs. Parent read the revised explanations and inspected screenshots for flow/wrapping. Exact-value disclosures were opened and original digits confirmed; mobile still had no document overflow. The newsletter `#signup` target lands on its visible summary; pointer and Enter toggles work, one email input remains, and public report/CSV/archive links stay reachable.

A separate local server forced the server-side analytics request to fail; the browser then recovered real public API values with the new readable formatting. Final server-specific failure wording remained accurate beside that success. This verifies that path in Chrome, not all production network/region conditions.

Ignored evidence: `work/brand-copy-validation/readability-browser-matrix-2026-11-06.json`, `readability-final-desktop.png` and `readability-final-preview.png`. Full 84-page rendered brand scan: 0 CUT, 42 CHECK and 47 STYLE notes. The broader notes include existing risk statements, glossary aliases/protected copy, legacy example-unit formatting and missing-value dashes; they are not silently edited or claimed as zero. Changed prose has zero CUT/STYLE.

## Review boundary

The source is prepared for a draft PR. The corrected Hashprice FAQ remains a Sanity draft. No merge or CMS publication is included in this task. Fardin and Matteo should read the revised operating-decision explanation, reworded institutional requirements and factual comparison together. An ordinary deployed PR preview reads published CMS, so the local proposed-text preview and exact FAQ proposal are the complete review surface until publication is separately authorised.

# Page structure and explanations: acceptance criteria

This pass starts from merged PR #9 (`b9f6e1c`) and the current published CMS
content. The previous improvements are retained. The task is to resolve the
remaining structural and explanatory weaknesses, not repeat a sentence-polishing
exercise.

## Work packages and required outcomes

| Area | Required result |
|---|---|
| Institutions | Replace overlapping role cards, review checklist and closing instructions with a distinct explanation, a useful production/contract comparison and one appropriate review path. |
| Research and data | Resolve the methodology heading/promise mismatch, teach the forecast mechanism or evaluation question honestly, explain a real takeaway from the existing fictional comparison, and consolidate repeated evidence-status prose. |
| Articles | Replace the circular growth explanation with a causal mechanism and a verified existing example. Explain how chart windows and uncertainty affect interpretation. Remove unrelated generic shell commentary. |
| Tools and guides | Name the actual quantities and supported input bounds. Remove misleading “typical” labels and defensive provider-rating detours. Preserve all input, billing, privacy and model limits. |
| Homepage and connected flows | Reduce repeated starting points and duplicated settlement explanations. Make the newsletter sample answer its own question using existing observed findings, with clear demo status. |

Each package has a separate worker, an explicit file boundary and the same
meaning-preservation requirements. Every package receives an independent review
of the actual result. The parent inspects each diff and proposal, resolves
required findings and verifies the rendered site.

## Editorial gates

- Read the full page in order. A reader should be able to say what the page
  explains, what the useful result is and what to do next.
- Each section must contribute a distinct point. A changed heading must match
  what follows. A section that promises a calculation must provide one or be
  renamed honestly.
- Explain why an input changes a result. Instructions to “compare”, “review” or
  “check” do not substitute for the explanation.
- Use familiar words, concrete subjects and verbs, and connected paragraphs.
  Keep plain wording that already works. Do not simulate humanity with slang,
  contractions, slogans or invented anecdotes.
- Consolidate true duplication. Preserve every distinct qualification and
  decision-point risk. Responsive variants and optional technical detail are
  not automatically duplicate content.
- Use only verified existing examples. A hypothetical constant difficulty level
  is not a monthly compounding growth path. An illustrative production result
  is not a forecast, suitable position size or financial return.

## Factual and implementation gates

- Preserve hashrate exposure versus difficulty outcome; observation versus
  settlement; payout versus profit; expected production versus actual production;
  observed data versus forecasts and synthetic examples.
- Retain applicable costs, fees, liquidity, full-loss, collateral, technical and
  limited-hedge warnings. Do not create an eligibility, custody, performance or
  accounting claim.
- Keep formulas, data values, dates, sources, controls, routes, slugs, stable
  keys and references unchanged. Existing fragment links must still reach a
  meaningful destination, with no duplicate IDs.
- Use the pinned brand, the `doefin-humanise` skill and existing design tokens.
  Read the visual guidance before moving or consolidating UI blocks. This is
  an editorial structure change, not a visual redesign.
- Do not edit migration seeds or the brand vendor. About, Block subsidy and
  approved glossary definitions stay outside this scope.
- CMS proposals must match a fresh complete published baseline by document ID
  and keyed path. Preserve editor drafts and verify complete saved drafts.
  Changing source files does not change CMS content.

## Evidence required before acceptance

1. A before/after structure map and a location for every distinct retained fact
   or qualification. Identify removed duplication explicitly.
2. Exact before/after CMS rows and the reason for each substantial rewrite.
3. Extracted prose checks: zero CUT and STYLE findings, apart from an explicitly
   justified quotation; exact contextual CHECK passages recorded.
4. Independent findings for each package: accept or revise, concrete examples,
   unresolved questions, and verification of required corrections. A checker
   pass or a high editorial score alone is insufficient.
5. Parent build, typecheck, focused regression, route, crawler and SEO checks,
   plus desktop/mobile reading of the final reconstructed pages. Label frozen
   CMS preview evidence separately from live publication.

The source change will be reviewable in a draft PR. New CMS text is staged as
drafts. This task does not merge a PR or automatically publish new wording.

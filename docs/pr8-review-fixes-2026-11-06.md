# PR #8 review fixes, 6 Nov 2026

The six open CodeRabbit threads and the additional institutions finding outside
the diff were verified against `baceba7`. All seven findings were valid and are
addressed in this follow-up. The previously corrected token-approval proposal
remains unchanged.

## Draft integrity

The writer previously read draft IDs and later sent unconditional edit actions.
A draft created between those operations could receive the planned field values.
The writer now submits a single action batch, with a conditional version-create
action before each edit:

- `baseId` identifies the published document on the server.
- `ifBaseRevisionId` checks the revision captured during planning.
- `versionId` identifies the absent `drafts.<id>` document to create.
- The following edit applies the reviewed fields to that newly created draft.

An existing draft or a changed/missing published revision rejects the batch.
All draft creations and edits share the same transaction; a later conflict rolls
back earlier actions. No full document snapshot is sent for creation, no existing
draft is overwritten, and a failed request is not retried by the writer.
Missing revision evidence fails before submission. Empty plans make no request.

This uses the documented [server-side version creation](https://www.sanity.io/docs/content-lake/dispatch-actions)
and [action preconditions and transaction rollback](https://www.sanity.io/docs/http-reference/actions).
The installed `@sanity/client` supports the version-create fields on the existing
`2025-02-19` API version.

The planner also enforces the existing cut-path allowlist, including for a
`Matteo` row with empty replacement text. A field such as
`sections[_key=="s0"].paragraphs` cannot remove its whole section. A rejected cut
blocks that document. Whole keyed/indexed list items and the approved
definition/FAQ field cuts retain their existing behaviour. Both the checker and
the direct Studio writer use this planner.

## Copy corrections

All four blocks are Change decisions. The smallest correction preserves the
existing numbers, calculations, links and risk disclosures.

| Location | Before | After | Editorial reason |
|---|---|---|---|
| Homepage, funding step | Every reader was directed to deposit cbBTC. | Check and fund the selected market's collateral; cbBTC funding instructions apply to cbBTC markets. | E05: collateral must be accurate; E07: name the actual steps. |
| Hosting calculator, both readout branches | The high-uplift explanation attributed the result to the pool fee and lost hours; the low-uplift explanation omitted fees. | Both branches name management fees, power-factor charges and the pool fee alongside the paid lost hours. | Thinking habit 2: explain the mechanism and its assumptions. |
| Institutions hero | Defined threshold and settlement block. | Defined threshold and observation block. | E09: a precise public reference for the outcome. |
| Newsletter navigation | Newsletter; get market updates. | Newsletter demo; preview preferences, with no saved subscription. | E19 and E31: describe what the destination actually does. |

Settlement and collateral wording still require Matteo's review before
publication, even though the new lines have no lexical brand-check flags.

## Discussion-note privacy

`ScenarioBrief` registers a `pageshow` listener. A restored page (`persisted: true`)
clears all three discussion-note fields. Ordinary page-show events preserve the
current notes. Unmount removes the listener. This covers browser back/forward
cache restoration in addition to the existing reload and component-unmount
behaviour, keeping the existing privacy notice accurate.

## Validation

- Production build and typecheck passed with Node 22.22.3.
- Voice-draft regressions passed: both cut verdicts, the allowed cut paths,
  whole-document blocking, existing drafts, changed source, checker entrypoint,
  scope guard, missing revision and empty-plan handling.
- Offline action-contract simulations passed for concurrent draft creation,
  changed draft state, changed/missing published source, rollback when the
  second document conflicts, one batch on success, and unchanged published data.
  These simulations exercise the production submission helper. They are not
  live Sanity concurrency tests. The writer was not run against Sanity.
- Scenario-brief checks passed: 19 checks plus all 128 input-boundary
  combinations. The actual component's effect was exercised with an event
  target for restored/ordinary `pageshow` and listener cleanup. This was an
  automated component check, not a browser-cache restoration test.
- All six P0 checks, hosting arithmetic, tool microcopy and publication contracts
  passed. No calculator formula changed.
- New lines since `baceba7`: zero CUT, CHECK or STYLE findings. Full-PR brand
  guard: zero CUT, 13 CHECK and five STYLE matches, unchanged from the
  [editorial review](humanise-review-2026-11-05.md). Those contextual CHECK items
  remain for Matteo; the STYLE matches are the explained token terminology,
  screenshot label and three code operators. The vendor integrity check passed.
- After build/start with the existing isolated CMS/market fixtures, all 12
  crawler checks and SEO checks on 84 rendered pages passed. These results do
  not establish live CMS content or deployed-browser behaviour.
- Whitespace checks passed. CodeRabbit's generic docstring-coverage advisory is
  separate from the seven findings; the new write helpers are documented.

## Publication hold

No CMS writes, publishing, draft discards, access changes or merge were performed
for this follow-up. About, Block subsidy, the approved Exahash/Hashprice
definitions, migration seeds and the brand vendor are untouched. The 18 saved
CMS edits retain their existing draft status. Fardin and Matteo still need to
review the wording before publication.

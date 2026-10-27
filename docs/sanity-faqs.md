# Homepage FAQs in Sanity

The homepage reads published `homeFaqPlacement` document `home-faq-homepage`; its ordered weak references point to reusable `faqItem` documents. Answers and labels live once on each item. The homepage preserves the existing native `<details>/<summary>` markup and SSR text. `SiteLink` continues to route unavailable Docs links to the documentation hub. A failed FAQ query leaves the rest of the homepage available and shows a local status message. No FAQ JSON-LD is emitted.

Initial seed contains five items and one placement. Preview tooling must keep read and editing paths published by default. Removed or unpublished weak references are omitted from rendering.

Read-only preparation and validation:

```sh
npm run check:home-faq
npm run typecheck
npm --prefix studio run typecheck
npm --prefix studio run build
npm run build
npm --prefix studio run reconcile:faqs
```

## Live import and lifecycle evidence

On 2026-10-27, after independent source audit and a fresh exclusive editing window, the authenticated raw preflight created five FAQ items and one placement; repeat reconciliation created zero. The 61 pre-existing records and revisions remained unchanged. Final state is 67 published documents total, five FAQ items plus one placement, zero drafts/versions or temporary markers.

The controlled CLI/API lifecycle checked a real item: published perspective excluded its draft; a revision-guarded publish changed the live homepage without rebuilding; exact copy was restored; unpublish left a retained draft and four visible disclosures; republish restored all five. Existing-document deletion was guarded in the same atomic Sanity transaction by a `patch.ifRevisionId(expectedRevision)` plus delete. Republish used collision-failing `create` and a revision-guarded draft patch/delete in the same transaction. A stale-revision patch/delete transaction was rejected and left the document intact. The prior attempt to pass `ifRevisionID` directly to `client.delete` did not guard deletion and is superseded by this transaction evidence.

All lifecycle assertions and final-count checks passed. The CLI process then hit a JavaScript variable-shadowing error during post-capture bookkeeping; its `finally` path re-read the exact original answer and confirmed no FAQ draft before writing the `restored-after-error` evidence. Do not describe that process as a clean exit. The sanitized transition evidence is `/Users/fardinvahdat/Documents/Codex/2026-10-27/fi/outputs/sanity-faqs/lifecycle-evidence.json`; raw revision snapshots stay in ignored `work/sanity-faqs/`.

The editing window used for this import is closed. Any future live mutation requires a new exclusive editing window and guarded preflight. The create-only command remains `npm --prefix studio run import:faqs -- --editors-paused`; it refuses canonical-ID/type conflicts, draft/version families and seed changes.

# Topics and V3 editorial CMS milestone

Scope: four reusable topics and the five existing V3 educational pieces (two Blog articles, three Academy lessons). Based on local glossary milestone commit `6a9f5a4e0628880fd84b7d55daaaaa0697b64583`, itself based on `final` at `a875c56d1a29f9a9e6739f429125999583cc3eac`. Existing glossary integration, project `yzvr33lo`, public `production` dataset and existing editor roles remain in place. No other CMS category, calculator behavior, data service or email integration is migrated.

## Consumers and source boundaries

| Source / consumer | Behavior in this milestone |
| --- | --- |
| `content/v3-editorial.ts` | Original five-piece migration seed only. The original text, headings, paragraphs, order, tags and real review metadata are preserved. No seed is used as a runtime fallback. |
| `content/index.ts` → `content/sanity/editorial.ts` | One published origin-API query snapshot contains topics and their referenced articles. React memoization deduplicates within a render; `no-store` prevents cross-request content snapshots. Public queries never request drafts or send a token. |
| `V3BlogIndex`, `ArticleLibrary`, `lib/article-library.ts` | Blog cards, existing covers, reading minutes, topic chips/filter navigation, search and review labels use CMS data. Topic paths use the stored topic slug; editable labels are display/search values. |
| `V3BlogPost` | Article title, summary, sections, stable heading anchors, topic references, review metadata and related reading use the same CMS source. Two existing covers and next-step links are retained; new articles use the existing general cover. |
| `V3AcademyIndex`, `V3Editorial` | Lessons and their order/content use CMS. Calculator guides remain on their existing local source, with the same routes and rendering. |
| `app/v3/resources/page.tsx` | Both editorial lists read CMS; tool guides and research retain their existing sources. |
| `HomeResources`, `V3GlossaryIndex` → client `GlossaryBrowser` | Existing featured article and Academy sidebar links are kept while published. If unpublished, these curated CTAs point to the corresponding collection rather than leaving a dead detail link. This adds an explicit editorial dependency to those server renderers. |
| `content/graph.ts`, `ReferenceTermPage` | Reciprocal glossary usage/next links now await current published V3 editorial sections. Research stays on its existing active local V3 source. No graph snapshot is built from legacy editorial arrays. |
| `lib/v3-routes.ts` and dedicated `app/v3/{blog,academy}` routes | CMS collections/detail/topic routes are removed from the frozen catch-all manifest. New article and topic slugs resolve without rebuilding. Retained `/v3/academy/guides/*` still resolves through the existing catch-all. |
| `/feed.xml` | Blog entries now use CMS rather than older local posts that happened to share the same URLs. Research entries deliberately retain the existing `allReports()` feed source; this is an unmigrated legacy boundary, not a research migration. Unsupported Blog publication dates are omitted. Review dates never become RSS publication dates. |
| `/llms.txt` | Published Blog and Academy discovery entries use CMS titles/summaries/paths, alongside the existing glossary definitions. |
| `/sitemap.xml`, robots / metadata | The intentional empty sitemap and V3 noindex preview policy are unchanged. Metadata and JSON-LD describe published records; unknown/unpublished details and topics return 404. |

The older `posts.ts`, `academy.ts` and research collections remain intact. Their filenames do not prove duplication or justify deletion. The screenshot's missing “duplicate 1/2” explanations remain unresolved. No authors or bylines are invented; author modeling remains a separate follow-up.

## Content contract

Four initial topic labels are exactly `difficulty`, `mining economics`, `hashrate`, `methodology`; corresponding stable slugs are `difficulty`, `mining-economics`, `hashrate`, `methodology`. Documents use public IDs `topic-<slug>`. The Blog topic navigation lists topics used by published Blog articles. Any published topic has a stable topic route, even if its current Blog result is empty. Unpublished/unknown topic documents return 404.

Article IDs are `editorial-<kind>-<slug>`, with `kind` Blog/Academy as part of the URL identity. Strong topic references preserve the original label order. `sortOrder` 0–4 preserves the five-piece source order; new Studio entries default to 1000. Ordered sections store an explicit `id` derived from each existing heading anchor, plus original heading/paragraph copy. Editing a heading does not automatically change its deep link. The shared anchor contract rejects shell/template IDs (`main`, `v3-mobile-menu`, the `v3-navigation-` prefix, `article-body`, `article-next`) in Studio, runtime parsing and seed validation; these must never collide with CMS section IDs. Intentional nonreserved anchor-ID changes still require editorial care; the ID is not an immutable historical record.

The current Academy renderer already displayed the shared review date `2026-10-19`. Migration preserves that effective date and records hidden `reviewDateSource=legacy-shared-review-date` for those three pieces; the two Blog records already declared that date. This is not inferred publication history. `publishedAt` is optional and unset for all five seeds. Visible review dates use CMS review metadata. Article JSON-LD does not mislabel review dates as publication/modification dates; supported future `publishedAt` values can supply publication metadata.

The normal Studio Publish action stamps permanent slug and kind identity for arbitrary-ID documents before delegating to Sanity's own publication checks. Imported IDs independently encode the expected route. Unpublish retains permanent identity; attempts to rename or move an article between Blog and Academy are rejected. Topic labels remain editable while their slug stays permanent. Duplicate/history-restore/release/scheduled-draft paths remain disabled for managed types, preventing bypasses of the audited publication flow. Direct API writers still bypass Studio validation and must enforce these contracts themselves.

## Read, failure and preview behavior

Published updates/additions/removals appear on the next request after Sanity query-index propagation. Existing browser tabs require reload. No webhooks, paid features or new credentials are needed. Empty published collections render explicit empty states; missing detail routes return 404. Transport or malformed-collection failures throw rather than silently rendering the old seed. Glossary back-links and curated CTAs depend on the validated editorial source, so that dependency is explicit rather than silently stale.

Editorial reads remain published-only even when the optional glossary preview cookie is active. Existing optional website draft preview remains glossary-only and disabled without separately authorized server credentials; this milestone creates no preview token and adds no speculative preview product flow.

## Safe import and live gate

Use Node >=22.12; this Mac has Node24 at:

```
export PATH="/Users/fardinvahdat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
```

Read-only/local preparation:

```
npm run editorial:migrate
npm --prefix studio run reconcile:editorial
npm run editorial:migrate -- --reconcile --write
```

No live import is authorized during implementation. After independent source audit passes, the parent must obtain a **fresh exclusive editorial editing window**. The earlier glossary window is expired. Only then:

```
npm --prefix studio run import:editorial -- --editors-paused
npm run editorial:migrate -- --reconcile --verify
npm --prefix studio run import:editorial -- --editors-paused
```

The official CLI uses the existing authenticated user's session through `--with-user-token`; do not extract or print it. Preflight uses authenticated raw documents including drafts/versions and all relevant ID/slug/label collisions. It fails on draft-only counterparts, occupied reserved IDs, ambiguous topic identities, conflicting canonical records or unsafe references. Topic documents precede article documents in one createIfNotExists transaction; existing glossary, internal and editor-created records are neither replaced nor deleted. The initial import should create four topics and five articles; repeat should create zero. Exact seed parity is checked separately.

Preflight is not an atomic cross-document uniqueness lock. Another writer or query-index lag can hide a just-created alternate-ID conflict between preflight and mutation. Pause editing, allow earlier writes to settle, run fresh preflight immediately before import and reconcile afterward. A five-second snapshot-age guard is additional protection, not a concurrency guarantee.

Studio already runs on the allowed `http://localhost:3333`; do not switch to a new origin or broaden CORS/security. Local website processes must be restarted on the reviewed build at the live gate. No public deployment, push, PR, merge or Notion update belongs to this implementation task.

## Validation and exact live acceptance DoD

```
npm run check:editorial
npm run check:editorial:schema
npm run check:glossary
npm run typecheck
npm --prefix studio run typecheck
npm --prefix studio run build
npm run build
npm run check:editorial:runtime
npm run check:glossary:runtime
```

Runtime scripts spawn isolated fixture processes and intercept only this project's local test HTTP calls; they never mutate Sanity. Their results prove source/route behavior, not a live import or editor workflow. Existing crawl/SEO/route/metadata checks should use `--base=<fixture URL>` before import and the actual-CMS local URL afterward, so dynamic pages are fetched rather than skipped.

After code audit and the fresh exclusive-window gate, live executor DoD:

1. Fetch authenticated raw state and record the existing 19 glossary terms, internal records and any editor work before mutation. Confirm seed plans/collisions and project/dataset; preserve unrelated records.
2. Create only four topic and five editorial seeds, verify exact content/identity/reference/order/date parity and rerun created=0. Reverify original glossary parity. Record final raw counts; do not assume there are no new editor drafts.
3. In normal Studio, temporarily change one existing article summary/review date. Public index/detail/topic page/related reading/Resources/feed/llms must keep published content while it is a draft. Publish, reload without rebuilding, verify propagation, restore the exact original fields and republish; reconcile parity.
4. Temporarily edit an existing topic label. Confirm its original slug/URL stays stable and all display/search/filter/chip consumers update after publication. Restore and republish the original label; verify article reference identities are unchanged.
5. Review an existing Academy lesson, original heading anchors and review date. Confirm normal Publish cannot change imported kind or slug, including after unpublish; any lifecycle test that unpublishes a seed must restore it immediately and reverify exact parity. Avoid permanent deletion. New arbitrary-ID lifecycle remains separately labeled if not actually exercised live.
6. Verify real CMS desktop/mobile index→Blog detail→topic and Academy detail, alias/topic search, original covers, sections/anchor navigation, related reading, glossary reciprocity, canonicals/noindex, structured data, feed/llms, unknown404 and no browser errors/overflow. Recheck retained calculator guide routes and existing glossary behavior.
7. Report precise live mutations/restoration, final record counts, independent audit results and any remaining preview/new-document/deployment limits. No code commit until source and live gates pass; no public deployment is implied.

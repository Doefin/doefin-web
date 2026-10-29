# V3 Docs CMS milestone

Scope: exactly18 existing V3 Docs pages, building on local commit `48e9390fc9849d9168285b09c94fde0281e2ce4f`. Project `yzvr33lo`, public dataset `production`. Glossary and topics/V3 editorial integration remain in place. No guides, research, About/authors, FAQ, backend, email, calculator execution or public deployment is migrated. No live writes occur during implementation.

## Source and active consumer map

| Boundary / consumer | Current ownership and preservation |
| --- | --- |
| `content/v3-docs.ts` | Retained18-page migration seed only; its sorted reading order is the original global previous/next sequence. Older `content/docs.ts` remains separate; filenames do not justify deleting or merging it. |
| `content/index.ts` → `content/sanity/docs.ts` / `docs-parse.ts` | Published origin API, no token, `no-store`,10-second timeout, React per-render memoization. Full Docs collection validates prose, ordered steps, definitions, optional links, group/order, stable anchors, dates and references. No seed fallback. |
| Dedicated `app/v3/docs/{page,[slug]/page,error}` | New slugs resolve without rebuilding; unknown/unpublished detail404; transport/malformed collection500 with explicit unavailable UI. Docs entries leave the frozen catch-all manifest; retained guides/research routes stay intact. |
| `V3DocsIndex`, `V3DocsLayout`, `V3DocPage` | Three fixed navigation groups; desktop sidebar and native mobile disclosure; index cards, detail TOC/section targets, ordered lists/definition lists, optional-tool links, related Docs, breadcrumbs and previous/next all read current published Docs. No existing Docs search exists. No tables or rich HTML were present, so no unused rich-text model is added. |
| `app/layout.tsx`, `DocsPublicationContext`, `SiteLink`, `lib/docs-links.ts` | Server root stays a server component. It reads only a lightweight published ID/type/slug manifest, passing slugs (not bodies) to shared client links. Root-relative and absolute URLs on the configured canonical site origin share this policy (including supported URL objects); external origins retain their destinations. Published URLs keep their query/hash intact. Missing guides route to `/v3/docs` with visible “Browse documentation” and an unavailable label/status. Unknown manifest state uses the same safe hub fallback; unrelated pages still render if Docs fails. When the full Docs reader succeeds, its already validated snapshot supplies a nested publication provider inside the Docs layout; cards/sidebar/related/previous-next keep known real targets even if the shell manifest failed. Both navigation renderers receive that same snapshot, with no additional body query. Full Docs errors are not hidden. On reload both readers refresh; the two queries are not an atomic snapshot. |
| Curated product/home links | Shared link policy covers home hero/task cards/FAQ, `HomeFaq`, `MarketExample`, `ProductPreview`, product/settlement `LinkCards`, `TutorialRelatedContent`, `MinersPage`, `PublicMinersPlanner`, `InstitutionsPage`/`InstitutionsExplorer`, `V3About`, `V3Methodology`, Resources and shell/header/footer `Chrome`/`lib/v3-publication` entries. Existing live targets retain approved labels/design. A removed/unknown target gets the clear hub fallback in SSR and client rendering. Collection links remain stable. |
| Metadata and structured data | Existing title/summary/canonical/noindex and BreadcrumbList use published content; shared safe JSON-LD serializer escapes script-breakout text. Visible review dates use the record only; no future fallback date or invented author/publication metadata. Existing Docs had no Article/date schema, so none is invented. |
| `app/llms.txt/route.ts` / `lib/llms.ts` | Adds all published Docs titles/summaries/URLs; editable text is escaped for Markdown and line breaks cannot inject new sections. Unpublished records disappear. Full Docs failure is an explicit failed discovery request. |
| Glossary/graph, RSS, sitemap, resources | Docs previously had no glossary auto-linking or graph/backlink participation; that boundary is preserved. Existing glossary/editorial graph remains unchanged. Resources' curated key-terms link uses shared publication availability. RSS retains CMS Blog plus the pre-existing research source; Docs are not RSS articles. Empty sitemap/noindex policy remains intentional. |
| Checks | Dynamic Docs are HTTP-fetched through existing route/SEO checks, not skipped; crawlability explicitly includes Docs index/definitions. Existing glossary/editorial runtime fixtures include the new Docs query shape. |

A lightweight memory-registry search found only older unrelated repository/deployment notes; no memory facts were used for the implementation. Fresh checkout/source and current-session evidence are authoritative.

## 18-page contract

Public IDs `docs-<slug>`, `_type=docPage`; permanent slug, title, summary, enum group, nonnegative integer `sortOrder`, optional `reviewedAt`, ordered sections `{id,title,paragraphs?,steps?,definitions?:{term,definition}[]}`, optional `{href,label}` links and ordered related-reference IDs. A section needs at least one content array. New pages default to order1000; ties sort by slug. Groups are stable navigation concepts, so enum values avoid an unnecessary taxonomy subsystem. Editing group/order is allowed without changing page identity.

| Order | Slug | Group | Effective review date |
| --- | --- | --- | --- |
| 0 | `overview` | Understand Doefin | 2026-10-19 |
| 1 | `bitcoin-mining-difficulty` | Understand Doefin | 2026-10-19 |
| 2 | `what-doefin-settles-on` | Understand Doefin | 2026-10-19 |
| 3 | `prices-and-probability` | Understand Doefin | 2026-10-19 |
| 4 | `how-settlement-works` | Understand Doefin | 2026-10-19 |
| 5 | `risks-and-limitations` | Understand Doefin | 2026-10-19 |
| 6 | `connecting-a-wallet` | Use the app | 2026-10-19 |
| 7 | `getting-collateral` | Use the app | 2026-10-19 |
| 8 | `your-first-trade` | Use the app | 2026-10-19 |
| 9 | `market-vs-limit-orders` | Use the app | 2026-10-19 |
| 10 | `order-management` | Use the app | 2026-10-19 |
| 11 | `managing-positions` | Use the app | 2026-10-19 |
| 12 | `redeeming-positions` | Use the app | 2026-10-19 |
| 13 | `withdrawing-funds` | Use the app | 2026-10-19 |
| 14 | `key-terms` | Reference | 2026-10-19 |
| 15 | `collateral-tokens` | Reference | 2026-10-19 |
| 16 | `smart-contracts` | Reference | 2026-10-19 |
| 17 | `methodology-and-evidence` | Reference | 2026-10-27 |

The13 originally undated records already rendered the shared review date2026-10-19; import preserves that effective date and hidden `reviewDateSource=legacy-shared-review-date`. Four other explicitOct19dates remain unchanged. Future records may omit review date and then render no review label/time or inferred JSON-LD/OG date.

Every section ID preserves the old `title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')` result, now stored independently from the editable heading. Runtime, actual Studio validation and seed validation share the safe-anchor contract, rejecting duplicate IDs and shell/template IDs including `main`, `v3-mobile-menu`, `v3-navigation-*`, `article-body`, `article-next`, `docs-content`, `docs-resources`. Explicit nonreserved ID edits remain an editorial responsibility; a title edit does not regenerate them.

Related Docs are **optional weak references** to canonical IDs, preserving source order and identity. This deliberately permits normal independent unpublish in the cyclic related graph. Published dereference returns null for an unavailable target, and runtime filters that recommendation; wrong-type/inconsistent references fail validation. Sanity documents [weak-reference behavior](https://www.sanity.io/docs/studio/reference-type) and [strong-reference restrictions on unpublish](https://www.sanity.io/docs/studio/archive-documents). Empty/absent related recommendations are valid. Optional links allow site-root or HTTPS URLs only; executable/protocol-relative URLs, controls, backslashes, credentials and ambiguous encoding, abbreviated HTTPS syntax and literal/encoded dot path segments are rejected. Internal Docs optional links also use shared availability fallback. Normal seed layout stays unchanged; scoped Docs wrapping handles long unbroken editable content.

Normal Studio Publish stamps arbitrary-ID permanent slug identity before delegating, retaining revision/fetch failure guards. Imported IDs independently enforce their slug after unpublish. Existing glossary/topic/editorial permanent identities and article kind protection remain. Duplicate/restore/release/scheduled-draft bypasses remain disabled for managed types. Direct API writers can bypass Studio validation and must enforce the same contracts.

## Narrow factual correction and provenance

Only `methodology-and-evidence`, section `read-the-limits-of-the-website-examples`, first paragraph changes. Before:

> The website’s research datasets and displayed ranges are authored examples. They demonstrate calculations and reporting structure, not measured accuracy, a forecaster ranking or a verified running data service.

After:

> The observed-adjustment research report uses a frozen capture of 25 observed difficulty changes. The website’s forecast examples and displayed example ranges remain authored illustrations. Neither establishes measured forecast accuracy, a forecaster ranking or a verified running forecast service.

Provenance: `content/v3-research.ts` observed-adjustment report and difficulty methodology distinguish captured observations from synthetic forecast examples; `lib/research-data.ts` exports the frozen capture/manifest; `content/research-archive/v1.json` has25 retained observed changes and zero prospective forecasts. The corrected page's review date is explicitly2026-10-27, the actual source review/correction date. The other17 effective review dates remainOct19. This does not migrate research, assert provider accuracy or claim a live forecast service. Regression verifies the distinction against the actual25-row/zero-forecast archive.

## Safe preparation and live gate

Node>=22.12; bundled Node24 on this Mac:

```sh
export PATH="/Users/fardinvahdat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
npm run docs:migrate
npm --prefix studio run reconcile:docs
npm run docs:migrate -- --reconcile --write
```

These are local plan/read-only commands. `--write` creates only local `work/docs.ndjson`; it is not remote import authorization. Official CLI uses the existing normal user session via `--with-user-token`; never extract/log it. No new token, CORS/security or paid-feature configuration is required. Use existing allowed Studio origin `http://localhost:3333`, not127.0.0.1.

Import uses fresh authenticated raw all-type IDs/drafts/versions, includes full Docs fields for parity and creates only missing seeds with one `createIfNotExists` transaction. Alternate Docs IDs sharing a Docs slug, draft/version-only families, occupied canonical IDs of any type and changed seeds block apply. Cross-namespace identical slugs (glossary/topic/Blog/Academy) are valid; all-type ID protections remain. Existing40 records/editor work are not replaced/deleted. A five-second snapshot guard is additional protection, not an atomic cross-document uniqueness lock. Concurrent writes and query-index lag remain limits: pause editing, let prior changes settle and reconcile afterward.

**No live writes during implementation.** After independent source audit and a NEW user-confirmed exclusive Docs editing window only:

```sh
npm --prefix studio run import:docs -- --editors-paused
npm run docs:migrate -- --reconcile --verify
npm --prefix studio run import:docs -- --editors-paused
npm run glossary:migrate -- --reconcile --verify
npm run editorial:migrate -- --reconcile --verify
```

Do not reuse previous glossary/editorial import-window authorization. Optional website draft preview remains disabled and glossary-only; Docs always read published content. No public Studio/website deployment, code push, PR, merge or Notion update belongs to implementation.

## Validation and live executor Definition of Done

```sh
npm run check:docs
npm run check:docs:schema
npm run check:glossary
npm run check:editorial
npm run check:editorial:schema
npm run typecheck
npm --prefix studio run typecheck
npm --prefix studio run build
npm run build
npm run check:docs:runtime
npm run check:editorial:runtime
npm run check:glossary:runtime
npm run check:crawlable -- --base=http://127.0.0.1:3060
npm run check:seo -- --base=http://127.0.0.1:3060
node scripts/check-v3-routes.mjs --built --base=http://127.0.0.1:3060
node scripts/check-v3-metadata.mjs --base=http://127.0.0.1:3060
npm run check:links
```

Runtime/browser checks before import use explicit local fixtures, not live CMS publication evidence. Fixtures intercept only this project's API reads and perform no remote mutations. Actual DOM/browser evidence must check normal18-page content, deep-link uniqueness/targets, dates, native mobile navigation, previous/next/related, current curated links, long hostile editable text at390px and no script execution/page errors. Representative current seed geometry is compared before/after at390/1440. The existing `check:links`10 legacy-corpus warnings remain separate from active Docs HTTP/browser link evidence.

After source audit and fresh exclusive window, live executor must:

1. Capture authenticated raw40-record `_id/_type/_rev` preservation baseline (or reconcile any newly authored records honestly), project/dataset and a fresh conflict-free plan; do not expose auth/session data. Confirm no unexpected drafts/versions before mutation.
2. Create only18 Docs, exact content/section/anchor/group/order/reference/date parity, rerun created0; both previous glossary/editorial verification commands must still pass. All40 pre-existing IDs/types/revisions must remain unchanged.
3. In normal Studio temporarily edit an existing Doc summary, one heading and review date. Public index/detail/nav/related/llms/curated labels retain published values during draft. Publish→reload without rebuild→verify updates; heading target remains the stored ID. Restore exact original fields and republish.
4. Temporarily change that Doc's group/order in Studio; verify sidebar/index and previous/next reflect the same published order after publish. Restore exact group/order. Curated CTA wording remains the preserved application wording, not a copy of the Doc title.
5. Reversibly unpublish a well-linked Doc (e.g.smart-contracts):404 detail; absent index/nav/related/llms, labeled hub fallback for shell/home/product/institutions/Resources targets. While unpublished, changing slug must disable Publish. Restore original slug, republish immediately and reconcile exact parity. No permanent deletion/dummy records. Arbitrary-ID first publication remains separately labeled if not live-exercised.
6. Actual CMS desktop1440/mobile390 journey: Docs index→detail→TOC/section→related→previous/next; mobile native Browse documentation disclosure; steps and definitions; exact original content/dates; all18 metadata/canonicals/noindex and discovery; glossary/editorial/calculator-guide smoke checks. Verify no overflow, script execution or browser page errors. Future arbitrary Doc creation remains fixture evidence unless separately authorized/tested live.
7. Final expected count58 published =19 glossary+4 topics+5 articles+18 Docs+12 internal, zero residual drafts/versions when no concurrent editor records exist. Preserve all40 original revisions; report actual numbers rather than assuming them. Restore every temporary field exactly and record source/fixture/live boundaries and any timeout/recovery. Independent live audit precedes local commit; packaging audit precedes Notion update/documentation audit. No public deployment is implied.

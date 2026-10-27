# Sanity glossary milestone

Scope: glossary only, based on `origin/final` at `a875c56d1a29f9a9e6739f429125999583cc3eac`.
Project: **Doefin Marketing Site**, `yzvr33lo`, public dataset `production`.

## Source and consumer inventory

- `content/glossary.ts` is retained solely as the immutable initial migration seed (19 terms). Runtime reads go through `content/index.ts` → `content/sanity/glossary.ts`; there is no seed fallback.
- `components/v3/V3GlossaryIndex.tsx` supplies the existing client search/filter browser. `browseTopic` replaces the component's slug assignments with the same 7 network / 7 revenue / 3 operations / 2 uncertainty assignments. New terms choose one of those topics in Studio; no component edits.
- Dedicated `app/v3/glossary/page.tsx` and `[slug]/page.tsx` override the static catch-all. Detail metadata and renderer read the same published snapshot; new slugs resolve after publication without a build. Unknown slugs return 404.
- `components/content/AutoLinkedProse.tsx` reads CMS labels/aliases/definitions for articles, research, About, methodology and glossary explanations. `lib/terms.ts` takes the same explicit term snapshot for matching; `content/graph.ts` derives back-links from the actual V3 article/research sections, rather than the older duplicate collections.
- `ReferenceTermPage` uses CMS FAQs, review dates and related references; JSON-LD comes from those same values. Existing text, aliases, slugs, references, FAQs and review dates are preserved by migration.
- `/llms.txt` reads current published terms through the same boundary. `lib/llms.ts` holds only the rendering template. `/sitemap.xml` intentionally stays empty while the whole site remains a noindex preview. The existing editorial feed has no glossary entries and needs no change.
- No current client component imports the server-only CMS adapter. Calculator content remains untouched.

## Publication and failure behavior

All website glossary reads explicitly use `perspective=published` at the Sanity **origin API**, `cache: no-store`. React `cache` deduplicates reads within one server render; no glossary snapshot is stored across requests. Published additions/changes/unpublishing appear on the next reload after Sanity's query index reflects them. No webhook is required. Existing browser tabs need a reload. This deliberately makes glossary-dependent pages server rendered; at greater traffic, consider tagged caching plus a validated webhook as a separate change.

Empty dataset: index says no terms have been published, missing details return 404. Transport failures and malformed documents throw; the glossary route error boundary says temporarily unavailable. We never silently show old local content as current CMS content. Article pages also fail if their glossary dependency cannot be loaded, rather than publishing stale links.

Drafts are excluded from public reads explicitly. Optional website draft preview is implemented but disabled by default. It requires **server-only** `SANITY_API_READ_TOKEN` (read permission only) and `SANITY_PREVIEW_SECRET`; no token is created by this implementation. Never use `NEXT_PUBLIC_` variables for either. When separately configured, open `/api/sanity/preview?secret=<secret>&slug=<slug>` to set the HTTP-only Next draft-mode cookie; draft queries bypass all caching. A visible preview notice and `/api/sanity/exit-preview` exit link are present on glossary pages. Do not send preview URLs to untrusted recipients or put them in public documents. No deployed preview credentials or Studio preview button is configured in this milestone.

## Studio and safe import

Studio is a separate package under `studio/`, so editor dependencies never enter the website bundle. It uses existing project roles. No dataset, security setting, API token, CORS origin, hosted Studio or production website is created/deployed by these files.

The Studio package requires Node >=22.12. Available runtime:

```
export PATH="/Users/fardinvahdat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
npm ci
npm --prefix studio ci
npm --prefix studio run login
npm run glossary:migrate -- --reconcile --write
npm --prefix studio run import:glossary -- --editors-paused
npm run glossary:migrate -- --reconcile --verify
npm --prefix studio run dev -- --host 127.0.0.1 --port 3333
```

Run from the repository root with the bundled Node directory on PATH. The installed Sanity CLI retrieves the current user's normal login session using `sanity exec --with-user-token`; no new API token is generated or printed. `npm --prefix studio run reconcile:glossary` is the supported read-only authentication/access check. It validates an authenticated user identity and the configured project/dataset, then queries `perspective=raw`, including drafts and release versions. Anonymous published-only reads cannot authorize import and fail closed.

`npm run glossary:migrate -- --write` can generate a local NDJSON plan without authentication, but this is **not** an import preflight. Authenticated `--reconcile --write` also writes the local file after checking access/conflicts. Remote import never trusts that file or a prior snapshot: the official CLI script regenerates the seed and repeats a fresh raw preflight immediately before a single `createIfNotExists` transaction. This has the non-overwrite behavior of `--missing`, with additional draft-aware gating. The earlier bare `datasets import --missing` command is superseded and must not be used for this migration.

Preflight rejects occupied deterministic IDs of another type, draft/version-only families without a published counterpart, and matching glossary slugs under other `glossaryTerm` IDs (including draft/version IDs). Topics, editorial articles and other content types have separate route namespaces and may share a glossary slug. All types are still inspected for occupied canonical glossary ID families; that protection is not filtered away. Existing published+draft families are preserved without any write to those IDs. Additional editor documents remain untouched. Seed IDs use `glossary-<slug>` with no dots, because dotted IDs are private even in a public dataset. No delete or replace mutation is issued.

Before applying, pause glossary editing and run the explicit `--editors-paused` command. The runner refuses apply without that flag and aborts if its raw query took over five seconds. **The preflight and mutation are not one transactional uniqueness lock**: another editor/API writer could create an alternate-ID conflicting draft after preflight. Raw queries use the query index, so very recent writes may also take time to become visible. Run this initial migration during an exclusive editing window, allow earlier edits to settle, and reconcile again afterward. `createIfNotExists` only protects canonical IDs; it cannot guarantee cross-document slug uniqueness under concurrent external writes.

`--verify` requires all 19 seeds to match exactly and is for initial migration acceptance. Later intentional editorial edits are reported as CHANGED and preserved; do not rerun a replacing import to erase them. Additional glossary documents are left untouched. Optional `domain` (network/product) is intentionally unset: it is separate from the four browse topics, and its semantics still need an editorial decision.

Schema validation preserves permanent slugs, including after unpublish. Imported IDs independently enforce their original slug. For new arbitrary-ID terms, the wrapped normal Studio Publish action persists a hidden `canonicalSlug` stamp with a draft revision guard before delegating to the built-in action. Unpublish retains that stamp, and the actual slug validator checks it. Duplicate, history-restore, release and scheduled-draft publication flows are disabled in this glossary-only Studio so they cannot bypass the normal first-publish stamp. API mutations still bypass Studio validation; any future alternative publisher must enforce the same identity contract. Schema validation requires a browse topic, limits short definitions to 159 characters, requires explanatory copy and review date, uses strong glossary references, rejects self-references and supports authored FAQs. Sanity validation happens in Studio only; the website validates the query response as a second boundary.

If normal CLI login requests a new access grant or project security change, stop and inspect the exact request with the parent. Do not create tokens or change CORS to bypass an access failure. A localhost Studio can require an allowed CORS origin; existing project access must be checked before proposing any security change.

## Validation and live acceptance

```
npm run typecheck
npm run check:glossary
npm run check:glossary:runtime
npm run check:links
npm --prefix studio run typecheck
npm --prefix studio run build
npm run build
npm run start -- --port 3039
npm run check:crawlable -- --base=http://127.0.0.1:3039
npm run check:seo -- --base=http://127.0.0.1:3039
node scripts/check-v3-routes.mjs --built --base=http://127.0.0.1:3039
node scripts/check-v3-metadata.mjs --built --base=http://127.0.0.1:3039
npm run check:links -- --live
```

Runtime checks intentionally fetch CMS-dependent pages; a static build alone cannot verify them. Before live import, empty-dataset behavior is valid but the 19-term crawl checks must fail. A fixture-backed local server may validate rendering/routing only and must never be described as an actual Sanity import or editor workflow.

Live executor Definition of Done (after independent code audit):

1. Sign into the existing project with `npm --prefix studio run login`, inspect access prompts, and leave security settings unchanged. Run `npm --prefix studio run reconcile:glossary` to verify authenticated raw access. Website port: 3039; Studio port: 3333. No persistent project API token is required for either public website reads or CLI import. The read-only auth check was exercised locally and currently fails closed with “no auth token could be found”; official CLI login remains required.
2. Pause glossary editing. Apply with `npm --prefix studio run import:glossary -- --editors-paused`; this repeats raw preflight and creates missing seeds only. Verify exact parity with `npm run glossary:migrate -- --reconcile --verify`. Repeat import during the same editing window and prove created=0; confirm published+draft editor documents were preserved and no delete/replace operations occurred.
3. Open the authenticated Studio. Confirm schema fields, validation, browse topics, related terms, dates and FAQs. If localhost CORS is missing, report the exact access prerequisite; do not silently widen it.
4. Edit an existing term in Studio as a draft. Public site must retain published text. Publish the change and reload: detail, index/search, tooltip and metadata must update. Restore and republish the original text, then reconcile exact parity.
5. Create a clearly marked test term with a browse topic, publish it, verify its previously unknown URL/index/search/metadata/llms output without rebuilding, then unpublish the probe through Studio and confirm its public URL returns 404. Keep the probe as an explicitly labelled unpublished draft; do not permanently delete documents. Verify a rename is rejected after unpublish, then retain its original slug. The published glossary returns to exactly 19 terms.
6. Verify desktop/mobile index and detail, server-rendered copy, existing links, noindex/canonicals, unknown-term 404, relevant runtime checks. State separately whether optional draft website preview was enabled/verified; it is disabled without credentials.
7. Report content mutations and cleanup evidence, runtime result URLs/commands and remaining gaps. No website deploy, hosted Studio deploy, push, merge or production-domain changes.

## Narrow inherited defect corrected

Input: `The difficulty adjustment changes mining difficulty. Hashrate follows.` Previously `matchTerms` returned difficulty-adjustment and hashrate, dropping mining-difficulty. After the first match it compared a relative candidate index with an absolute previous-best index. It could skip an earlier mention in favor of a later one. The renderer used relative positions correctly, so its forward links and graph back-links diverged. The fix adds the current offset to the comparison; regression coverage checks ordering, longest-match behavior, aliases and heading exclusion. This is required for coherent migrated auto-linking/back-links.

## Audit corrections and evidence

- Shared `jsonLd()` now escapes every `<` as a literal JSON `\u003c` sequence before HTML insertion. The JSON roundtrip retains exact editorial text. Regression tests send hostile `</script><script>` text through actual built glossary index, detail and FAQ JSON-LD using an isolated local fixture process; no live dataset mutation is involved.
- Migration preflight now uses authenticated raw documents rather than anonymous published-only results. Tests reproduce draft-only same-ID, alternate-ID slug, version and wrong-type collisions, no-write failures, preserved published/draft pairs, authentication checks and snapshot age limits.
- Actual Studio validator/action regressions cover imported IDs and newly created arbitrary-ID terms across first publish, unpublish, attempted rename and same-slug republish.
- `check:links` currently reports **legacy-corpus diagnostics** from the retained older article collections. Its ten warnings do not describe active V3 back-link coverage. Active V3 graph reciprocity is checked by the fixture browser test (new alias in current article ↔ new term back-link), and live publication checks remain separate.

Official references checked: [query perspectives](https://www.sanity.io/docs/http-reference/query), [draft/published perspectives](https://www.sanity.io/docs/content-lake/perspectives), [safe import flags and client-only schema validation](https://www.sanity.io/docs/content-lake/importing-data), [public versus dotted IDs](https://www.sanity.io/docs/content-lake/ids).

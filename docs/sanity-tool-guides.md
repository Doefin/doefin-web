# Calculator guides CMS milestone

Scope: exactly three text-only guides from `content/tool-guides.ts`, building on `9de85f45a89939808f45464fd227da48f93d6d72`, project `yzvr33lo`, dataset `production`. Calculator formulas, bounds, presets, microcopy, tutorial/executable examples and all other content categories remain in code. No deployment, push, PR, credentials, security/CORS changes or paid feature is included.

## Source and active consumers

| Source / consumer | Behavior |
| --- | --- |
| `content/tool-guides.ts` | Original seed retained byte-for-byte. Three complete structured guides: article metadata, introductory prose, ordered instructions, input explanations, result explanations, worked example, mistakes and limits. Runtime never imports it. |
| `content/index.ts` → `content/sanity/tool-guides.ts` | Async published-only origin requests, `no-store`, ten-second timeout and React per-render memoization. Full collection validation; no local-content fallback. Malformed/failed detail reads fail explicitly. Empty collection has no detail URLs. |
| Dedicated `/v3/academy/guides/[slug]` → `GuidePage`, `ReferenceGuidePage`, `GuideArticle` | Dynamic routes accept future guides without rebuild; absent guide404. Guide-specific error boundary shows unavailable state. Existing layout, text, dates, author, calculator links, breadcrumbs and JSON-LD preserved. Six anchors remain application-owned: `how-to-use`, `settings`, `reading`, `walkthrough`, `mistakes`, `limits`; heading edits cannot change these anchors or introduce shell-ID collisions. No rich HTML/Markdown links or editable anchors existed, so none is invented. |
| `V3AcademyIndex`, `V3ToolsIndex`, `V3ToolPage`, `WorkedExamplePage`, Resources | Read published guide titles/collections. Existing calculator↔guide mappings use **exact canonical guide slug**, never first matching tool/order. If the canonical guide disappears, calculator recommendations omit it or show an explicitly labeled Academy-hub fallback. A future guide may reference any existing calculator using its independent `toolSlug`; Academy and detail calculator links use that field, so no invented calculator URL is generated. Sorting uses explicit order then slug. Calculator/Resources optional recommendations tolerate guide outages and retain functional calculator content. Academy collection is explicit about empty state and fails on unavailable full content. |
| Root layout, `GuidesPublicationContext`, shared `SiteLink` | Parallel lightweight Docs/guide manifests, independently caught. Curated individual guide URLs use `/v3/academy#guides` and visible “Browse calculator guides” plus unavailable accessibility text when missing/unknown. Published targets preserve query/hash; external destinations remain intact. Scoped full-read providers in Academy, tools, tool details, worked examples and Resources override a failed shell manifest when validated content exists. This shared policy covers current and future curated `SiteLink` uses, including tutorial-related components. Root remains a Server Component. |
| `V3Editorial` / legacy routes | Retained collection module now awaits guides; active Academy index uses its dedicated component. The guide entries leave the frozen V3 catch-all manifest. Unversioned routes normalize into V3 through the existing routing policy; no V1/V2 surfaces are revived. |
| `llms.txt` / metadata / discovery | Published guides added as escaped Markdown titles/summaries with current URLs; removal disappears on reload. Publication/review dates are optional; no fallback date is invented for future records. Existing three publication and shared footer-review dates both remain31 August2026. Article attribution remains the existing Doefin Research source. Safe JSON-LD serialization and React text escaping handle hostile editable prose. Guides are not RSS posts and the existing intentional noindex/empty-sitemap policy remains. No guide glossary autolinking/backlinks existed; no new graph behavior is invented. |
| Existing checks and fixtures | Existing combined fixture now supplies guide queries; actual Studio config mocks acknowledge the new type. Existing glossary/editorial/Docs verifier functions accept the combined61 fixture and unchanged guide seed. New guide detail explicitly joins crawlability inventory. |

A lightweight memory registry search returned older unrelated repository/deployment notes; no memory facts were used. Current source and current authenticated API reads are authoritative.

## Three-record contract

| Canonical public ID | Guide slug / permanent calculator identity | Order | Published / reviewed |
| --- | --- | --- | --- |
| `tool-guide-hosting-effective-rate` | `hosting-effective-rate` | 0 | 2026-08-31 / 2026-08-31 |
| `tool-guide-difficulty-exposure` | `difficulty-exposure` | 1 | 2026-08-31 / 2026-08-31 |
| `tool-guide-fleet-payback` | `fleet-payback` | 2 | 2026-08-31 / 2026-08-31 |

Schema `_type=toolGuide` preserves structured plain text and ordered arrays. `toolSlug` is an enum of the existing three calculator identities, independent of the guide slug. Imported IDs independently lock slug and calculator identity after unpublish. Arbitrary IDs stamp `canonicalSlug` and `canonicalToolSlug` before normal Studio publish delegation, retaining revision and fetch-error guards. Existing canonical calculator-guide slugs must map to their matching calculator. Multiple guides may point to one existing calculator; only its exact canonical guide slug is the tool recommendation. Duplicate/restore/release/scheduled-draft bypasses remain disabled for managed types. Direct API writers can bypass Studio validation and must enforce these same contracts.

No source optional/related-reference field exists. Calculator relationships use validated stable code identities, avoiding artificial document references or unpublish constraints. Links remain code-owned and/or subject to the existing shared destination policy. Editable prose is rendered as text. The actual shared review footer was2026-08-31, verified in `NextLinks.tsx`; it is preserved explicitly for these records, while future records can omit publication/review dates.

## Safe import and editing window

```sh
export PATH="/Users/fardinvahdat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"
npm run guides:migrate
npm --prefix studio run preflight:guides
npm --prefix studio run reconcile:guides
```

All above operations are local/read-only remotely. `guides:migrate -- --write` creates only local `work/tool-guides.ndjson`. Official CLI uses the existing authenticated user session via `--with-user-token`; never log/extract its token. Import requires an independently reviewed implementation and a **new user-confirmed exclusive editing window**; prior milestones' windows do not carry over.

```sh
npm --prefix studio run import:guides -- --editors-paused
npm run guides:migrate -- --reconcile --verify
npm --prefix studio run import:guides -- --editors-paused
npm run glossary:migrate -- --reconcile --verify
npm run editorial:migrate -- --reconcile --verify
npm run docs:migrate -- --reconcile --verify
```

The importer fetches authenticated raw all-type IDs/revisions/slugs including draft/version families. Wrong-type canonical IDs, alternate-ID same-namespace slugs, draft/version-only families or changed seed documents block creation. Cross-namespace matching slugs are allowed. One transaction uses only `createIfNotExists` for missing seeds; existing documents/editor drafts are never overwritten/deleted. Five-second preflight age is additional protection, not an atomic cross-document uniqueness lock. Concurrent edits/index lag remain limits: pause editing, let previous changes settle, then reconcile afterward.

`work/tool-guides-preflight.json` records the authenticated58-ID/type/revision baseline and exact conflict-free3-record plan. It is a point-in-time read and must be refreshed immediately before approved writes. Expected final61 published =19 glossary+4 topics+5 editorial+18 Docs+3 guides+12 internal, zero residual drafts/versions, old58 revisions unchanged.

## Focused evidence and boundaries

```sh
npm run check:guides
npm run check:guides:runtime -- --checks
npm run check:docs
npm run check:docs:schema
npm run check:editorial
npm run check:editorial:schema
npm run check:glossary
npm run check:tools
npm run check:links
npm run typecheck
npm --prefix studio run typecheck
npm --prefix studio run build
npm run build
```

New focused test executes the actual parser/reader/schema validators/publish-action wrapper/import runner, checks exact3-guide source parity, safe optional dates, hostile long text, immutable slug/tool identities and revision failure, raw draft/version/all-type collisions, namespace safety, old58 preservation, idempotence and all previous verifiers against61 documents. Runtime test uses built Next with explicit local query-shaped fixtures; it checks all text/examples, six unique deep links, metadata/JSON-LD/dates, future guide on an existing calculator and publication updates without rebuild, deterministic canonical recommendation, scoped manifest failure, removal404/discovery/curated fallback, empty state and isolated unavailable/malformed guide content. `--checks` runs existing crawlability/SEO/route/metadata commands once against the same restored combined fixture. `check:links` retains its separately labeled legacy-corpus warnings.

Fixture success is not live publication evidence or visual/Studio UI proof. Browser/native control was unreliable, so Studio authoring UI is explicitly unverified. Rendered desktop/mobile geometry, interaction and script-execution browser evidence must not be inferred from HTML/CSS/source tests. CLI/SDK live evidence is recorded below. Independent source and restored-live audits passed with no findings. No public deployment is implied.


## Authorized live result — 27 October 2026

User explicitly confirmed a fresh exclusive editing window: “Yes—nobody else is editing; proceed”. Immediate authenticated raw preflight found58records,0drafts/versions/conflicts/changed. The create-only transaction created exactly3guides; exact parity passed and a second import created0. All previous authenticated glossary/editorial/Docs verification commands subsequently passed against61records with no missing/changed seeds.

A fresh reviewed-build server ran at `http://127.0.0.1:3081`, with `NODE_OPTIONS` and the fixture environment variable explicitly removed. Before import the guide returned404 while Academy/calculator returned200. No rebuild occurred during the following checks. This is local HTTP evidence using actual published Sanity content, not deployed-site or Studio UI evidence.

The hosting guide's title/summary and walkthrough title/setup were temporarily edited with an explicit lifecycle-proof marker. Draft creation used an atomic revision-guarded no-op published patch plus create-only draft; it refused any pre-existing draft. Default public guide, Academy, tools, Resources, matching calculator and llms reads all excluded the draft marker. The official `sanity.action.document.publish` action guarded **both** published and draft revisions. All six consumers then reflected the published text on fresh HTTP reads, retaining the fixed `walkthrough` anchor and original publication/review dates. A guarded exact-original draft and the same publish action restored the fields; all six consumers reverted.

Unpublish used a documented atomic equivalent transaction because the installed standard unpublish action has no revision precondition: conditionally patch the expected published revision, create the exact original draft only if absent, then remove only its published copy. This retained the document/content and history; no purge or permanent document deletion occurred. The guide returned404; Academy/llms omitted it; Tools/Resources showed labeled Academy-hub fallbacks; the matching calculator remained200 and omitted its guide recommendation. Republish conditionally guarded the owned draft revision, created the original public identity only if absent, then removed the owned draft. All six HTTP checks passed after restoration. No invalid slug/tool identity or dummy record was published.

Fresh raw verification at2026-10-27T16:47:57Z proved **61published,0drafts,0versions**, all three guide source fields exact (including ordered arrays and object keys), no lifecycle markers and every original58ID/type/revision unchanged. Counts:19glossary,4topics,5editorial,18Docs,3guides,11internal groups and1retention record. Temporary guide revisions necessarily changed; old58revisions did not.

Evidence lives outside the repo at `/Users/fardinvahdat/Documents/Codex/2026-10-27/fi/outputs/sanity-tool-guides/`: `final-live-proof.json`, `api-{init,draft,publish,restore,unpublish,republish}.json`, `http-{imported,draft,published,restored,unpublished,republished}.json`, and `live-verifiers.json`. Raw baseline/lifecycle snapshots and guarded SDK scripts remain ignored under `work/`. Studio authoring UI, rendered desktop/mobile browser geometry/interactions and public deployment remain unverified. Independent source and restored-live audits passed with no findings. Local commit and minimal Notion handoff are recorded in the final packaging evidence.

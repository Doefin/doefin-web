# Institutions review section CMS milestone

Scope: the "Before committing capital" review section of `/for/institutions` (visibility, eyebrow, heading, intro, risk note, the four review cards with disclosures and links, and the contact strip). Existing project `yzvr33lo`, public `production` dataset and existing editor roles remain in place. The hero, instrument aside, market explorer and production-comparison sections of the page are unchanged and remain in code. No other CMS category is migrated.

## Consumers and source boundaries

| Source / consumer | Behavior in this milestone |
| --- | --- |
| `content/institutions-review.ts` | Migration seed only, copied verbatim from the pre-CMS `InstitutionsPage` markup. Never a runtime fallback. |
| `content/institutions-review-contract.ts` | Fixed document ID `page-for-institutions`, type `institutionsPage` and the four-card layout limit shared by Studio, the runtime parser and the migration. |
| `content/index.ts` → `content/sanity/institutions-review.ts` | One published origin-API query snapshot for the review document. React memoization deduplicates within a render; `no-store` prevents cross-request content snapshots. Public queries never request drafts or send a token. |
| `components/v3/InstitutionsPage.tsx` | The review section renders CMS data. The `visible` switch shows or hides the whole section without unpublishing or deleting content; hidden content leaves the served HTML entirely. Card numbers derive from array order. Internal links render through `SiteLink`; a link with `contactSubject` renders as a `mailto:` to the site contact address, so the address itself stays in `lib/site.ts`. |
| `studio/schemaTypes/institutionsPage.ts` | Singleton document with the `visible` switch (default on), required non-blank fields, exactly four cards and per-link validation: either a safe href (site path or HTTPS) or a contact subject, never both. |

## Content contract

One document: `_id` `page-for-institutions`, `_type` `institutionsPage`. The `visible` boolean is required and defaults to on. Exactly four cards; Studio validation, the migration and the runtime parser all enforce the count. Link hrefs pass the shared `isSafeDocsHref` contract (site-root paths or HTTPS, never executable schemes or protocol-relative URLs). The runtime reader rejects a wrong document ID, a missing or mistyped field, an unsafe href or a malformed card instead of rendering a partial section.

## Read, failure and preview behavior

Published updates appear on the next request after Sanity query-index propagation; no webhooks or new credentials are needed, matching the editorial milestone. Transport or malformed-content failures throw rather than silently rendering the seed. The page has no fallback: the document must exist and be published before the reviewed build serves traffic.

## Safe import and live gate

Read-only/local preparation:

```
npm run check:institutions
npm run institutions:migrate
npm --prefix studio run reconcile:institutions
```

No live import is authorized during implementation. After independent source audit passes, publish the initial document with:

```
npm --prefix studio run import:institutions
npm --prefix studio run reconcile:institutions
```

The official CLI uses the existing authenticated user's session through `--with-user-token`; do not extract or print it. Preflight uses an authenticated raw snapshot including drafts/versions, fails on draft-only counterparts, occupied reserved IDs or conflicting canonical records, and creates the document with `createIfNotExists`; a later seed change never overwrites editor work and instead blocks the import. The initial import should create one document; repeat should create zero. Exact seed parity is checked separately by `npm run check:institutions`.

Preflight is not an atomic cross-document uniqueness lock. Pause editing, allow earlier writes to settle, run fresh preflight immediately before import and reconcile afterward. A five-second snapshot-age guard is additional protection, not a concurrency guarantee.

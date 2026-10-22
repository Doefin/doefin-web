# Canonical migration proposal — inactive

V3 remains a local, `noindex,nofollow` preview. V1, V2 and V4 remain accessible. No domain, redirect, robots, canonical metadata or sitemap behaviour is changed by this proposal. The final consolidation in the reference deck is a proposal, so this is a concrete review artifact rather than a claim of launch completion.

## Reviewable route map

`v3-canonical-migration.json` lists every public-content V3 HTML page from the latest available production build, its proposed unversioned destination on `https://doefin.com`, and existing matching V1/V2 aliases. V4's homepage is a proposed alias of `/`; its assets are not page redirects. Unmatched older-version pages are explicitly listed for individual review rather than redirected blindly.

The current build contains **87 V3 HTML pages**: **86 public-content pages** receive proposed canonical mappings, while **1 internal page**, `/v3/prototype-review`, is recorded under `retainedInternalPreviews` with its exclusion reason. The internal QA page retains `noindex,nofollow` and its preview path; it must not receive an unversioned public route, redirect, sitemap entry or public navigation link. A complete 87-page HTML crawl therefore has a different scope from the 86-page proposed public migration.

Regenerate after the final build:

```sh
node scripts/prepare-v3-canonical-plan.mjs
```

The JSON is documentation, not Next.js configuration. Importing it into runtime redirects before canonical routes exist would create broken destinations or loops. CSV endpoints, API routes, static assets and image routes need their own preservation rules and are excluded from this HTML-page manifest. Query strings must survive redirects; fragments are browser-side and must be verified in navigation tests.

## Presentation capability

`lib/v3-publication.ts` defaults to `publicationMode = 'preview'`. `publicationUi('canonical')` describes the reviewed presentation change: hide the comparison selector and preview label. Its canonical path helper produces proposed destinations while leaving the current link adapter and actual paths untouched. Changing this mode alone is not sufficient to launch: unversioned hosting, links and metadata must be implemented together first.

The product front door and product/tool pages expose four navigation jobs: Product, Tools, Data & Research, and Learn. Commentary pages use the non-promotional Data & Research / Learn / Tools navigation and omit app and audience acquisition calls from shared header/footer. References and methods remain accessible. This is a template boundary, not a legal opinion or publication approval.

## Cutover sequence

1. Confirm the intended canonical content and publication conditions with the responsible reviewers. Record actual data, email and measurement readiness; a working local prototype is not evidence of an operational service.
2. Build and regenerate the route map. Review every unmatched legacy route. Agree a specific destination, retention, or meaningful 404 for each; do not send unrelated old articles to the homepage.
3. Serve the existing V3 page renderers at their planned unversioned routes in staging. Adapt internal links to those routes. Keep APIs and assets stable. Remove the current root-to-V1 redirect in the same reviewed change to avoid a loop.
4. Set canonical and Open Graph URLs to the unversioned destinations; update sitemap, feed, structured data and reference URLs. Apply indexability only to the approved canonical pages. Retained private previews must continue to be excluded from indexing until redirects replace them.
5. Add the agreed version-path redirects after canonical pages resolve. Preserve query parameters and verify every useful anchor, calculator-state URL, download and newsletter destination. Test path collisions and unknown routes.
6. Review desktop/mobile navigation, direct app access on product pages, commentary boundaries, retained professional-investor disclosure, and the empty optional promotion layer. Review the actual email/data/analytics flows separately.
7. Switch the presentation mode and release only after staging checks and responsible publication review. Verify the public domain after deployment before calling the migration complete.

## Rollback

Keep a deployable snapshot of the current route tree, metadata and link adapter. On failure, restore the previous deployment and preview UI; remove newly activated redirects before restoring root/version routing, then verify `/`, all retained `/v1`–`/v4` previews, calculator query state and downloads. A previous successful build alone does not prove the domain has rolled back.

## Required evidence before completion

A served canonical-route crawl with metadata and link checks; redirect-chain results for every alias and unmatched-path decision; desktop/mobile interaction evidence; indexing checks on canonical and retained preview routes; a dated publication review; and a documented rollback rehearsal. None of these external launch gates is implied by this inactive plan.

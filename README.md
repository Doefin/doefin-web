# Doefin website

The `final` branch contains the selected Version 3 website, extracted from
`main` at `2117d2374f425e78ae805e008c3e77cd03f3f59e`.

- All 84 HTML pages use root-level paths, with `/` as the homepage. Former `/v3/...` page URLs permanently redirect to their root-level equivalents.
- V1, V2 and V4 routes, their version switcher, unused components and V4 assets
  have been removed. Pages and artwork reused by V3 now live under V3.
- Product pages, calculators, learning resources, glossary, research, docs,
  newsletter prototype and `/api/v3/...` endpoints are retained. API routes are not redirected.
- V3 keeps its existing `noindex, nofollow` preview policy and illustrative-data
  labels. Email forms remain prototypes. The sitemap is empty while noindex is
  active. This branch does not activate a production domain or trading backend.

## Development

Use Node.js 22.6 or newer (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

## Verification

```sh
npm run build
npm run typecheck
npm run check:crawlable
npm run check:seo
npm run check:links
npm run check:tools
node scripts/check-v3-routes.mjs --built
node scripts/check-v3-metadata.mjs --built
node scripts/check-v3-publication.mjs
```

The routing check compares the build with the 86-route inventory recorded in
`scripts/fixtures/v3-routes.json` (84 HTML pages plus the CSV and social image),
checks legacy redirects and query preservation, and rejects retired version prefixes in links. Feature checks under `scripts/` cover the retained planners,
market handoff, research archive, measurement and newsletter prototype.

V3 design and operational notes are under `docs/v3-*`. Older documents describe
historical prototypes and do not define the `final` branch route configuration.

---
name: seo-technical
description: Technical SEO for doefin-web — rendering, crawlability, indexing, sitemaps, robots, canonicals, redirects and performance. Use when adding routes, changing rendering, debugging why a page is not indexed, or before a deploy.
---

# Technical SEO

Technical SEO is whether a search engine can reach, read and index the page at all.
None of the writing matters if this fails, and it fails silently.

## Rendering — the thing that breaks

Three ways a page can produce its content:

| | Content in the HTML? | Verdict |
|---|---|---|
| **Static / SSG** | Yes | Fine |
| **Server-rendered / ISR** | Yes | Fine |
| **Client-rendered** | **No** | **Invisible** |

**AI crawlers do not run JavaScript at all**, and search crawlers do it slowly and
incompletely. A number that arrives via `useEffect` and `fetch` does not exist.

**The specific failure to avoid:** `app/layout.tsx` must stay a server component. Add
`"use client"` there and every page beneath it renders an empty body to crawlers — and
`export const metadata` becomes impossible throughout. That is exactly what happened
to the trading app.

If a page needs interactivity, isolate it in a leaf component and mark only that.

## Indexing controls

- **Canonical on every page.** Always via `seo()` in `lib/seo.ts` — never hand-write a
  `Metadata` object, because that is how a canonical goes missing.
- **`robots.ts`** allows AI crawlers explicitly — GPTBot, OAI-SearchBot, ClaudeBot,
  PerplexityBot, Google-Extended, CCBot — rather than relying on a permissive default.
  A wildcard mistake or a default-deny CDN rule is the common way this breaks.
- **`noindex` only where it belongs:** the 404, preview deployments, any admin route.
  Never on a page you want found.

## Sitemap

`app/sitemap.ts`. Every route belongs in it. Collections map automatically; standalone
pages must be added by hand.

⚠️ **`lastmod` must be stable.** Emitting `new Date()` changes it on every deploy and
trains crawlers to ignore the signal. Static pages use a fixed `STATIC_LASTMOD`;
content pages use their real `updatedAt`.

## Read the build output

Every route should show **○ (Static)** or **● (SSG)**. A route marked **ƒ (Dynamic)**
means something pulled in a request-time API — usually `draftMode()`, `cookies()` or
`headers()`. Find it and remove it.

```
npm run build          # read the route table
npm run check:seo      # automated assertions
```

## Performance, in the order it matters

1. **Largest Contentful Paint** — how fast the main content appears. Static pages with
   `next/font` are already close to optimal; the usual regression is a large unoptimised
   image.
2. **Cumulative Layout Shift** — content jumping as things load. Always give images
   explicit dimensions via `next/image`.
3. **Interaction to Next Paint** — responsiveness. Barely applies here; the site is
   mostly documents.

## Deploy-time checks

- Non-production branches: password-protected **and** `X-Robots-Tag: noindex`.
  Otherwise draft research on a working branch is publicly fetchable.
- ⚠️ **Never set a custom `Cache-Control` header on Amplify** — it disables deploy-time
  cache invalidation, so releases silently stop taking effect.
- HTTPS everywhere, one canonical hostname, everything else redirecting to it.

## Verify like a crawler, not like a browser

```
curl -A GPTBot https://doefin.com/ | sed 's/<[^>]*>//g' | head -40
```

Real prose must come back. A browser will show you a page that a crawler cannot see.

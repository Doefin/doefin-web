---
name: new-page
description: Scaffold a new page in doefin-web correctly — server component, metadata through the seo() helper, structured data where it applies, numbers as HTML text, and registered in the sitemap. Use whenever adding any route to this site.
---

# Adding a page

Follow this exactly. Each step exists because skipping it has a specific consequence.

## 1 · Create the route

`app/<path>/page.tsx`. **A server component** — no `"use client"` at the top. If the
page needs interactivity, put that in a small child component and mark only that child.

## 2 · Export metadata through the helper

```ts
import { seo } from '@/lib/seo'

export const metadata = seo({
  title: '…',        // ≤ 60 characters
  description: '…',  // ≤ 155 characters
  path: '/your/path',
})
```

Never hand-write a `Metadata` object — the helper is what guarantees a canonical URL.

**For a data page, put the number and the block height in the title.** `Bitcoin
difficulty forecast — +2.31% at block 913,248` beats a generic title, and it is the
whole reason one competitor wins live-value queries while another with identical data
does not appear.

## 3 · Dynamic segments are statically generated

```ts
export function generateStaticParams() { … }
export const dynamicParams = false
```

`dynamicParams = false` makes an unknown slug a 404 rather than a rendered page.

## 4 · Answer first

The claim goes in the first sentence or two, before context. Roughly 44% of AI
citations come from the first third of a document.

## 5 · Numbers as text

Every figure appears as HTML text with its date and units. A chart is enhancement and
ships alongside a `<DataTable>`, never instead of one.

If the figure is a placeholder, render `<IllustrativeBadge>` beside it.

## 6 · Structured data where it applies

| Page type | Type |
|---|---|
| Article, academy piece, research report | `Article` |
| Glossary term | `DefinedTerm`, inside the set on the index |
| Data page | `Dataset` |

Use `jsonLd()` from `lib/seo.ts`. Do not add more types than this — the measured lift
beyond entity clarity is nil.

## 7 · Register it in the sitemap

Add the route to `app/sitemap.ts`. Collections map automatically; standalone pages do
not.

## 8 · Verify

```
npm run build && npm run check:crawlable
```

The guard fails if the page returns fewer than 120 words to a crawler, or is missing
an `<h1>`, `<title>` or canonical.

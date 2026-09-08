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

## 7 · Answer the questions the page is for

Every page that answers a typed question carries an `<FAQ>` block. This is the single
highest-value block on the site: a question with a self-contained answer is the unit a
retrieval system lifts, and it is the mechanism behind being cited at all.

```tsx
import { FAQ } from '@/components/content/FAQ'
<FAQ items={[{ q: '…', a: '…' }]} />
```

Never hand-write `FAQPage` schema. The component builds the visible list and the
structured data from one array, so the two cannot drift — and marking up questions a
visitor cannot see is a spam signal that can earn a manual penalty.

**Minimum questions by route type:**

| Route | Minimum |
|---|---|
| `/for/*` | 5 |
| `/data/*`, `/tools/[tool]` | 4 |
| `/glossary/[slug]`, `/academy/[slug]`, `/research/[slug]`, `/methodology/[metric]` | 3 |
| `/blog/[slug]`, `/tools/[tool]/example/[case]` | 2 |

**The rule that stops this becoming filler: a question ships only if its answer already
exists as a published claim on this site.** Three legal sources — a glossary
`shortDef` or body sentence, a `tool-guides.ts` `mistakes[]` or `limits[]` entry, or a
`research.ts` `findings[]` line. If you have to invent the answer to ask the question,
the question does not belong on this page yet.

**Answer shape:** the first sentence is a direct, complete answer — never "it depends"
or "there are several factors". Two to five sentences total. If a proper answer needs
more, give the direct two and link to the page where the full explanation lives. An FAQ
answer is an entry point, not the destination.

Phrase the question the way a reader would type it, not the way the org describes it.

## 8 · Register it in the sitemap

Add the route to `app/sitemap.ts`. Collections map automatically; standalone pages do
not.

## 9 · Verify

```
npm run build && npm run check:crawlable
```

The guard fails if the page returns fewer than 120 words to a crawler, or is missing
an `<h1>`, `<title>` or canonical.

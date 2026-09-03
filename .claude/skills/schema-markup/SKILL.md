---
name: schema-markup
description: Structured data (JSON-LD) reference for doefin-web — which schema types to use on which page, the exact shapes, and the rule about not adding more. Use when creating a page that needs structured data or when validating existing markup.
---

# Structured data

Structured data is machine-readable JSON embedded in a page describing what it is. It
does not directly improve ranking — the only controlled experiment found no lift — but
it establishes **entity clarity**: telling search engines and assistants that this
company, this article and this dataset are specific things with relationships.

**Cap the total effort at a day.** Five types, correctly applied, then stop.

## The five types this site uses

| Type | Where | Why |
|---|---|---|
| `Organization` | Root layout, once | Establishes the company as an entity |
| `WebSite` | Root layout, once | Establishes the site as one thing, not loose pages |
| `Article` | Blog, academy, research | Author, dates, publisher |
| `BreadcrumbList` | Every nested page | Path and hierarchy |
| `Dataset` | Data pages, epoch pages, API reference | Marks published data as data |
| `DefinedTerm` | Each glossary page | **Highest value here** — definitions get quoted disproportionately |
| `FAQPage` | Pages with a **visible** question-and-answer section | Directly retrievable as an answer |
| `ItemList` | Collection index pages | Lets assistants enumerate what a listing contains |

## How to add it

Always through the helper, never a raw string:

```tsx
import { jsonLd } from '@/lib/seo'

<script type="application/ld+json" dangerouslySetInnerHTML={jsonLd({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.summary,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt ?? post.publishedAt,
  author: { '@type': 'Organization', name: post.author },
  publisher: { '@type': 'Organization', name: site.name, url: site.url },
  mainEntityOfPage: `${site.url}/blog/${post.slug}`,
})} />
```

`BreadcrumbList` is emitted automatically by `<Breadcrumbs>`, so the visible trail and
the markup can never drift apart. Always use that component rather than hand-writing
either.

## Rules

**Only describe what is actually on the page.** Marking up content a visitor cannot
see is a spam signal and can earn a manual penalty.

**`FAQPage` requires questions that are visible on the page.** Always use the
`<FAQ>` component — it renders the visible section and emits the schema from the same
array, so they cannot drift. Never hand-write `FAQPage` markup: doing that once here
produced three questions in the schema that appeared nowhere on the page, which is
exactly the spam pattern the rule exists to prevent. `npm run check:seo` now fails the
build on it.

**Where FAQ sections earn their place.** Assistants answer questions, so a page that
states a question and answers it in one self-contained block is directly retrievable.
Currently on: the difficulty page, the scoreboard, both audience pages, About, and
every glossary term — where the question is literally *"What is hashprice?"*, the exact
string someone types.

Write answers that stand alone. An assistant lifts one paragraph out with no
surrounding context, so an answer beginning "As above, this means…" misrepresents you.

**`sameAs` needs the accounts to exist.** It sits in `lib/site.ts` and is currently
empty. Populate it the moment the company X and LinkedIn accounts are live — it is how
search engines confirm the company is real.

**Do not add types beyond the list above.** `Report` has near-zero consumer support.
Stacking `Person` and extra types per page is effort with no measured return.

## Validating

```
npm run check:seo
```

checks presence and JSON validity. For semantic validation paste a built page into
Google's Rich Results Test or the Schema.org validator — the built HTML is in
`.next/server/app/**.html`.

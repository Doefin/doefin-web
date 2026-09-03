---
name: new-term
description: Add a term to the Doefin glossary with a properly written short definition. Use when adding or editing any glossary entry, since the short definition is what AI assistants quote and has strict rules.
---

# Adding a glossary term

Edit `content/glossary.ts`. The page, sitemap entry and structured data follow
automatically.

## The short definition is the product

It is the sentence assistants quote when someone asks what a term means. Rules:

- **Under 160 characters.** Enforced by convention; keep it tight.
- **Self-contained.** It must make sense with no surrounding context, because it will
  be retrieved as a fragment.
- **Factual, never promotional.** Describe the concept, never our product.
- **No forward references.** Do not define a term using another term the reader has
  not met.

Good: *"A number expressing how hard it is to find a valid Bitcoin block. It rises when
more hashrate joins the network and falls when hashrate leaves."*

Bad: *"A key metric Doefin lets you hedge."* — promotional, and defines nothing.

## The fields

```ts
{
  slug: 'kebab-case',        // never changes once published
  term: 'Display Name',
  shortDef: '…',             // the quotable sentence
  aliases: ['…'],            // what else people call it
  body: ['…', '…'],          // 2–3 paragraphs of depth
  seeAlso: ['other-slug'],   // must be real slugs
  updatedAt: 'YYYY-MM-DD',
}
```

## The body

Two or three paragraphs going deeper than the definition. Lead with why it matters to
a miner or a trader rather than with etymology. Where a figure appears, give its units
and its basis.

## Rules

- **Slugs never change once published.** A renamed term keeps its slug.
- **`seeAlso` must reference slugs that exist** — the page maps over them and a bad
  slug silently disappears.
- Prefer adding a cross-reference over repeating an explanation.

## Verify

```
npm run build && npm run check:crawlable
```

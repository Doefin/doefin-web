---
name: seo-onpage
description: On-page SEO for doefin-web — titles, descriptions, heading structure, internal linking, images and content shape. Use when writing or reviewing any page's copy and markup, or when asked why a page is not ranking.
---

# On-page SEO

On-page means everything inside a single page that affects whether it ranks: what it
says, how it is structured, and what it links to. It is the half you fully control.

## Titles — the highest-leverage element on the page

The `<title>` is what appears in a search result and what an AI assistant reads first.

| Rule | Why |
|---|---|
| **Under 60 characters** | Longer gets truncated in results |
| **Front-load the distinctive part** | People scan the first few words |
| **One page, one primary idea** | Two ideas in a title ranks for neither |
| **Never duplicate a title across pages** | They compete with each other |

**On a data page, put the number and the block height in the title.**

```
Bitcoin difficulty forecast — +2.31% at block 913,248     ← wins the live-value query
Bitcoin Difficulty | Doefin                                ← does not appear at all
```

This is not a stylistic preference. A competitor with identical data ranks above
another purely on this, because someone searching for the current value sees the
current value in the result.

## Descriptions

Under 155 characters. It rarely affects ranking directly, but it is the sentence that
decides whether someone clicks. Write it as a promise the page keeps — never as
keyword filler.

## Heading structure

- **Exactly one `<h1>` per page**, and it should say the same thing as the title.
- `<h2>` for sections, `<h3>` beneath. **Never skip a level** for visual reasons —
  use CSS for size.
- A heading should describe the section, not tease it. *"Where it leaks"* beats
  *"The interesting part"*.

## Content shape

- **Answer first.** The claim in the opening sentence or two, before context. Roughly
  44% of AI citations come from the first third of a document.
- **Self-contained paragraphs.** Assistants retrieve fragments, not whole pages. A
  paragraph that only makes sense after the previous one gets quoted wrongly.
- **Every figure carries its date and units inline**, not in a caption elsewhere.
- **Tables in HTML** with a real `<thead>`. Never an image of a table.
- **Define a term on first use** and link it to the glossary.

## Internal linking

The single most under-used lever, and it is free.

- **Hub and spoke.** `/data` links to each metric, each metric links to its epoch
  pages, every epoch page links back up.
- **Every published number links to its methodology page.**
- **Glossary auto-linking is automatic** via `<AutoLinkedProse>` — first mention of a
  term becomes a link. Use it for all long-form body copy.
- **Link with descriptive text.** "the methodology" beats "click here"; the anchor
  text tells search engines what the target is about.

## Images

- `alt` describes the content, not the file. Decorative images get `alt=""`.
- Use `next/image` so dimensions are set and layout does not shift.
- A chart image is never the only source of a number.

## URLs

- Lowercase, hyphenated, short, readable.
- **Slugs never change once published.** A renamed page keeps its slug.
- One fact per URL: `/data/difficulty/epoch/913248` is one epoch, permanently.

## Things that do not work

- Keyword stuffing. Search engines have modelled meaning for a decade.
- Near-duplicate pages that differ only in who the reader is addressed as — that is
  doorway-page shaped and a named spam policy.
- Hundreds of generated pages from one template. The measured precedent in this niche
  is 12,604 pages earning roughly nineteen times less traffic per page than a rival's
  270, and declining.

## Check your work

```
npm run build && npm run check:seo
```

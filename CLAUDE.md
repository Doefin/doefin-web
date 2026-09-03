# doefin-web

The public site at **doefin.com** — research, open mining data, tools and documentation.
Separate from the trading application, which lives at `app.doefin.com` in
`../doefin-frontend`.

Currently a **static build with no backend**. Content is typed data in `content/`;
figures are illustrative placeholders in `content/sample-data.ts`.

```
npm run dev          # local
npm run build        # production build
npm run typecheck    # tsc --noEmit
npm run check:crawlable   # run AFTER build — fails if a page is empty to crawlers
npm run check:seo         # run AFTER build — titles, canonicals, h1s, schema validity
npm run check:tools       # tool microcopy: hints match sliders, presets reachable, length caps
```

## Search and AI visibility

This site exists to be cited, so those rules are not decoration. Four skills carry
them, in `.claude/skills/`:

| Skill | Covers |
|---|---|
| `seo-onpage` | Titles, descriptions, headings, internal linking, content shape |
| `seo-technical` | Rendering, crawlability, sitemap, canonicals, performance |
| `aeo-geo` | Getting cited by ChatGPT, Claude and Perplexity — and the off-domain half |
| `schema-markup` | Which structured data goes on which page, and why not more |

Run the `seo-audit` agent before a deploy, or after adding several pages.

External tools — which to set up, which to skip, and in what order:
[`docs/seo-tooling.md`](docs/seo-tooling.md).

---

## The rule everything else serves

**Every number a visitor can see must also be in the HTML as text, with its date and
units.** A figure that only appears after JavaScript runs is invisible to search
engines and AI assistants, which is the entire point of this site.

Charts are enhancement. A chart without an accompanying table or text figure is a bug.

## Three things that must never regress

1. **`app/layout.tsx` is a server component.** Never add `"use client"` to it. That is
   exactly what makes the trading app return an empty body to every crawler, and it
   also makes `export const metadata` impossible on every page beneath it.
2. **Every page exports metadata through `seo()` in `lib/seo.ts`**, so nothing ships
   without a canonical URL.
3. **`npm run check:crawlable` passes.** Run it after every build. It is the guard
   the trading app did not have.

## Tools and their guides

Each calculator is published twice, and the split is deliberate.

- **`/tools/<slug>`** — the calculator, plus only the help that fits around it:
  a short blurb, "use this if / not this if", three or four steps, a collapsed hint
  under each slider, a live sentence that reads the current numbers, and preset
  buttons that move every slider at once. That copy lives in `content/tool-micro.ts`
  and is **length-capped** — `npm run check:tools` fails the build when it creeps.
- **`/academy/guides/<slug>`** — the long version, as an article with real headings:
  every setting, where to find your own figure, a worked example, mistakes and limits.
  That content lives in `content/tool-guides.ts`.

The two link to each other in both directions. Put new explanation in the guide, not
on the tool page — the tool page lost 4,000 words for a reason, and `check:tools` is
what stops them coming back.

Hints render inside `<details>`, so the text is in the served HTML for crawlers while
staying collapsed for readers. Never swap that for conditional rendering on state.

## Content

All reads go through `content/index.ts`. **Nothing else touches the content files
directly** — that discipline is what makes swapping in a CMS later a one-file change
rather than a refactor.

Adding content means editing the typed arrays in `content/`. Types are in
`content/types.ts`.

**One exception, and only this one.** The three calculators in `components/tools/` are
client components. Importing the `@/content` barrel from a client component pulls every
article, report and glossary term — about 96 KB — into the browser bundle to reach one
16 KB module, so they import `@/content/tool-micro` directly. That data is statically
bundled either way, so it is not what a CMS swap touches. Server code has no such
excuse: read through `@/content`.

- **Glossary short definitions are the product.** Under 160 characters, factual, no
  product language. They are what assistants quote.
- **Sources carry a confidence label** — `measured`, `single-source` or `judgement` —
  and it renders on the page. Keep the distinction honest.

## Brand

Tokens live in `tailwind.config.ts`. **Never write an arbitrary hex value in a
component** — add a token instead. Full reference: `.claude/skills/brand/SKILL.md`.

- Typeface is **Manrope**, loaded via `next/font`.
- The wordmark is a **white lockup for dark grounds only**. Never place it on a light
  surface.
- Panels use `rounded-panel` (22px); headers use `rounded-header` (30px).

## Placeholder data

While there is no backend, every figure renders with an **"Illustrative — not live
data"** badge driven by the `isLive` flag in `content/sample-data.ts`. A
plausible-looking fake number without that badge is worse than no number. When the
backend arrives, replace that module with a fetch and set `isLive: true`.

## What this project deliberately does not have

No CMS, no database, no authentication, no email capture, no analytics section
backend. Those are specified but not built. Do not add them speculatively.

# Layout, banner and motion — what to take from deagentic.ai

Designed 2026-09-01. Three independent approaches were proposed and scored by four separate judges
on citability, credibility, cost and durability. "Refuse the whole premise" won 30/40, the
research-desk broadsheet took 29, data-native 27; no approach had a fatal flaw. The recommendation
below builds on the winner and grafts the strongest ideas from the other two.

Claims verified by hand against this repo afterwards:

| claim | verified |
|---|---|
| Articles have no headings to hang a TOC on | `AutoLinkedProse.tsx` emits **zero** `<h2>`; every `body` string renders as a `<p>`. |
| `readingMinutes` is hand-typed and wrong | `what-a-static-growth-assumption-costs-you` declares **6 min over 163 words** (0.7 min at 220wpm); `reading-a-hashrate-chart-honestly` declares 4 over 138. |
| Sample figures are not publishable | `content/sample-data.ts` header: "Nothing here is a real forecast and nothing should be published as one." `isLive: false` throughout. |
| A second sticky column would collide | `components/layout/Header.tsx:8` is `sticky top-0`. |
| The crawlability check cannot catch a CSS-hidden page | `scripts/check-crawlable.mjs` counts words against `MIN_WORDS = 120` over a hardcoded 5-page list; it never looks at CSS. |
| Every article shares one social card | `app/opengraph-image.tsx` is the only one — no per-route image exists. |

---

# doefin-web: what to build after looking at deagentic.ai

## Two corrections first, because they change what you'd build

**deagentic's sidebars carry no author.** I read the theme. `/Users/reza/workspace/deagentic-theme/DeAgenticAI/css/sections.css:4094,4421-4430` — the article rail is `15rem` on the *left*, `display:none` on mobile, and it holds exactly one thing: a scrollspy table of contents (`.blog-post-toc li.active`). The learn/pillar template (`template-parts/learn-single.php:311`) has a *right* rail with three cards: Publishing Details, Compared Entities, Related Entries. No byline, no photo, no author card anywhere in either. What you remembered as "author" was almost certainly the Publishing Details card — published date and modified date. That's provenance, not personality, and it's the part worth copying.

It matters because your byline is `'Doefin Research'` on every piece and your JSON-LD already emits `{'@type': 'Organization'}`. An author card would be a face you'd have to invent for an institution that deliberately doesn't have one.

**deagentic's "banner on every article" is not photography.** `.marketing-entry-hero` is two columns — copy left, visual right. If a featured image exists it renders at `aspect-ratio: 21/9`. If not — and this is the normal case — it falls back to `.marketing-visual-panel`: a glow div, a chip label, a bold line, a sentence. That's how they guarantee every article has *something* at the top. It's an honest engineering answer to "we have no illustrator," and it's the same answer you need. But note what it's made of: three more copy fields per article, restating the h1, that no assistant can quote.

You don't have an illustrator either. So the real question was never "images or no images" — it's "what generated thing goes in that slot." That's the decision this document makes.

---

## The three verdicts

### 1. Sidebar — **do it differently. No rail, on any route.**

Not a preference. Three mechanical reasons:

- **Your article column is 768px.** Every article route is `<Container size="narrow">` = `max-w-3xl`, and `.prose-doefin > p` is capped at `max-w-prose` (68ch). Bolt a 15rem rail onto that and you either squeeze the measure below comfortable reading width, or push the article out to `max-w-container` (1200px), at which point the prose cap does nothing and you get a narrow ribbon of text in a wide frame — the exact "unfinished" look you're escaping. deagentic's rail works because their article grid sits inside a page wider than your entire container.
- **The rail's only cargo can't be built yet.** It holds a scrollspy TOC. `content/types.ts` gives `Post`, `AcademyPost` and `Report` a `body: string[]` and nothing else — every string renders as a `<p>` via `AutoLinkedProse`. There are zero `<h2>` elements in any article. A TOC on `reading-a-hashrate-chart-honestly` would render an empty `<ul>`. You'd be building the container before the contents.
- **Two sticky contexts.** `components/layout/Header.tsx:8` is `sticky top-0` with `h-16`. deagentic's rail is `position:sticky; top:8rem`. A second sticky column on a four-paragraph article is a mobile bug report waiting to happen.

**What replaces it:** the same job — orientation, provenance, "can I trust this" — done as a vertical scaffold *inside* the existing column. Same order on mobile and desktop, nothing hidden, no breakpoint, no JS:

1. Breadcrumbs *(exists)*
2. Eyebrow / h1 / summary *(exists)*
3. **Provenance strip** *(new)* — `<dl>`, `border-y`, tabular-nums: Published · Sources (`2, both measured`) · Reading time (derived). Grafted from the broadsheet proposal's masthead.
4. **Key figures** *(new)* — 2–5 tiles, each value + unit + `asOf` + confidence, as HTML text
5. **On this page** *(new as shared component; already exists inline at `components/tools/GuideArticle.tsx:63-79`)* — in-flow, only when 4+ sections, no scrollspy, no JS
6. Prose, as `<h2 id>` sections
7. Findings *(research only, exists)* · Terms used here *(exists on academy, extend)* · Sources *(exists)* · Where to go next *(exists)* · Subscribe *(exists)* · Last reviewed *(exists)*

**Not on `/glossary/[slug]`** — the short definition is the product; a scaffold would bury it. **Not on `/docs/[slug]`** yet, and here's the honest reason: `content/docs.ts` defines `Doc` as `{slug, title, summary, group, body, status}` — no `publishedAt`, no `author`, no `sources`. Three of the four inputs to the provenance strip don't exist there. Either widen `Doc` first or leave docs alone. Don't ship a masthead of em-dashes.

### 2. Banner — **do it differently. Generated, typographic, and zero human minutes.**

Yes to "every article gets a banner." No to images, and no to the glow panel.

**On-page: a masthead plate**, at the full 48rem measure, on a `bg-surface/40` field between hairline rules:

```
RESEARCH NOTE · DR-2026-01                        MEASURED
How accurate are public Bitcoin difficulty forecasts?
4.67 pp            3.0 pp              0 of 4
ADJUSTMENT VOL     SPREAD ACROSS       PUBLISH AN
as of 21 Aug       SOURCES · 21 Aug    INTERVAL · 21 Aug
2 sources · both measured                  21 August 2026
```

Every field is a pure function of frontmatter `Base` already requires. The evidence grade is derived, not authored — weakest source wins:

```ts
// lib/masthead.ts — the ONLY place a grade is computed
const RANK: Record<Confidence, number> = { measured: 2, 'single-source': 1, judgement: 0 }
export const evidenceGrade = (s: Source[] = []): Confidence | null =>
  s.length ? s.reduce<Confidence>((w, x) => (RANK[x.confidence] < RANK[w] ? x.confidence : w), 'measured') : null
```

Human minutes to produce a banner: **zero.** No design tool, no crop, no alt text, no `public/` growth, no asset to re-cut when a brand token moves.

**Off-page: per-route OG cards.** `app/opengraph-image.tsx` already exists and is good, but it's site-wide — every article currently shares as "Every difficulty forecast is a bare number." Add `app/research/[slug]/opengraph-image.tsx` and `app/blog/[slug]/opengraph-image.tsx`, reading the same `masthead()` output. `next.config.mjs` has no `output: export`, so `next/og` works on dynamic segments. Next's file convention overrides the root card automatically; `lib/seo.ts` needs no change. This is where a banner actually earns its keep — Slack, LinkedIn, a Perplexity card — before the reader arrives, not six pixels above an h1 they're already looking at.

**Later, one real picture per article that has a subject to plot** — a server-rendered inline SVG of the 26-retarget difficulty line, or the epoch grid, from `content/sample-data.ts`. Grafted from the data-native proposal, with its best rule attached: every figure is a `<figure>` whose **visible** `<figcaption>` (not `sr-only`) carries every number in the drawing — *"Difficulty over 26 retargets, 92.30 T on 1 Sep 2025 to 127.48 T on 17 Aug 2026, +38.1%. Illustrative — not live data."* The drawing is enhancement; the caption is the record.

**Gate this on `isLive`.** Right now `content/sample-data.ts` says in its own header: *"Nothing here is a real forecast and nothing should be published as one,"* and `isLive: false` on all four blocks. Drawing a 21:6 chart of placeholder data above the fold of a report about *other people's forecast honesty* is the one move that could actually hurt you — a chart is the most screenshot-able object on a page, and the caption is the first thing lost when it travels. Build the component now, ship the figure the day the pipeline lands.

Same discipline on `keyFigures`: **do not copy-paste `band1dPct: 16.3` or `currentEH: 912` out of `sample-data.ts` and stamp them `confidence: 'measured'`.** Key figures come from the article's own `sources[]`. DR-2026-01's `4.67 pp` and `3.0 pp` come straight out of its `findings[]` — those are fine. A `KeyFigure` with `confidence: 'measured'` and no `href` to something checkable is the exact failure you built `IllustrativeBadge` to prevent.

### 3. Animations — **mostly don't.** One rule, three exceptions, and a bug to fix today.

**The rule to write into `.claude/skills/brand/SKILL.md`: motion may only be a response to something the visitor did, or the depiction of a value changing. It may never be an announcement that content has arrived.**

What already moves and correctly stays: hover/focus transitions in `components/ui/index.tsx`, `group-hover:translate-x-1` on `OpenTool`, `<details>` disclosure, `:focus-visible` rings. All input-triggered, all correct.

**Refused, in descending order of how tempting they are:**

- **Scroll reveal** (`.reveal-up` / `.in-view` / IntersectionObserver). Your longest article is 167 words. The whole body is above the fold. A scroll reveal has nothing to reveal — it can only delay the paint of content the reader can already see. Plus it carries the trap below.
- **Animated number counters.** This one is not taste. Your own research report argues that a bare confident number is a form of dishonesty. Counting `127.48 T` up from zero displays *deliberately wrong numbers for 600ms* on the one element that must read as sober — and a tweened value is not in the HTML at parse, which breaks your governing rule outright.
- **The dock-magnification and control-plane set pieces.** They're genuinely good on deagentic because they animate a *mechanism*. They're also gated on `(hover:hover) and (pointer:fine)` — an admission that they're for one class of visitor. Yours is scanning for a number.
- **A reading-progress bar.** Duplicates the scrollbar exactly, and moves without being asked.

**Permitted, later, and only under the contract in the next section:** the epoch bar filling from 0 to its true 62.7% once on paint, and the banner line drawing left-to-right — because a time series runs left to right and the draw *is* the traversal of the period. Both are values changing. Both must be correct with zero JS.

---

## The reduced-motion trap, and the exact fix

This is the one place a naive port causes real harm, so here it is precisely.

`app/globals.css:38-39` currently reads:

```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
}
```

deagentic's reveal pattern sets `opacity: 0` as the resting state and restores it with a transition when JS adds `.in-view`. Port that here and **`transition: none` deletes the mechanism of restoration.** For a reduced-motion user the element stays at `opacity: 0` forever. The HTML is perfect; the CSS hides it. `scripts/check-crawlable.mjs` cannot see this — I read it, it strips tags and counts words against `MIN_WORDS = 120` and never looks at CSS. The same failure fires for everyone if JS simply doesn't load.

**Fix Part A — harden the global rule so the failure mode becomes benign.** Replace those two lines:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    animation-delay: 0ms !important;
    transition-duration: 1ms !important;
    transition-delay: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

The difference is everything: a transition still *runs and lands on its final computed value*, instantly and imperceptibly. Any pattern that depends on a transition completing ends in the correct visible state instead of frozen at frame zero. Perceptually identical for the user. Strictly safer for you. **Ship this today regardless of anything else in this document.**

**Fix Part B — the motion contract, so nothing ever needs rescuing.** This is grafted from the data-native proposal and it is better than the alternatives, because it needs no JavaScript at all. The rule: *the element's declared resting style IS its finished appearance, and the animation runs backwards from it.* Motion is opt-**in**, and it uses `animation` (fires at paint) never `transition` (needs a state change, hence deagentic's JS):

```css
/* app/globals.css — RULE: never declare a resting style that needs a
   transition to undo. The static rules below are the FINISHED state. */
.dfn-draw { stroke-dasharray: var(--dfn-len); stroke-dashoffset: 0; }  /* fully drawn */
.dfn-fill { width: var(--dfn-pct); }                                   /* true value */

@media (prefers-reduced-motion: no-preference) {
  .dfn-draw { animation: dfn-draw 900ms cubic-bezier(.22,.61,.36,1) both; }
  .dfn-fill { animation: dfn-fill 700ms cubic-bezier(.22,.61,.36,1) both; }
}

@keyframes dfn-draw { from { stroke-dashoffset: var(--dfn-len) } to { stroke-dashoffset: 0 } }
@keyframes dfn-fill { from { width: 0 }                          to { width: var(--dfn-pct) } }
```

Four properties, each killing a different version of the trap: a reduced-motion cascade never *reaches* the animation block; `animation` fires on its own so no script is involved anywhere; `both` fill-mode with a `to` frame byte-identical to the static rule means "animation finished" and "animation absent" are the same pixels; and `opacity: 0` appears in no state on no element. Worst simultaneous case — reduced motion, no CSS animation support, JS disabled — renders a complete chart at the correct value.

**Fix Part C — write the ban down.** In `.claude/skills/brand/SKILL.md`: *no element may be given `opacity: 0` or a hiding transform by a stylesheet rule.* And add the guard to the script that walks every built HTML file — **not** `check-crawlable.mjs`, whose `PAGES` array is five hardcoded paths. Fail the build when a `<figure>` ships without a `<figcaption>` containing a digit.

---

## Type changes

Take the broadsheet's `Block` union over the winner's — it's a strictly cheaper migration, because `string` stays a member and every existing `body: [...]` compiles untouched:

```ts
export type Block = string | { heading: string; id?: string }  // id defaults to slugify(heading)

export type KeyFigure = {
  value: string        // '4.67 pp' — pre-formatted; the string IS the citation
  label: string        // under 60 chars, no product language
  asOf: string         // never optional: an undated number is a rumour
  confidence: Confidence
  href?: string        // required by review when confidence === 'measured'
}

type Base = { …, keyFigures?: KeyFigure[] }   // 2–5, capped at 5 by check:seo
export type Post = Base & { tags: string[]; body: Block[] }   // readingMinutes DELETED
```

**Delete authored `readingMinutes`.** `content/posts.ts:12` declares `6` over a 167-word body — a 45-second read overstated six-fold, in the masthead of a site whose thesis is that published numbers must be honest and dated. `:32` declares `4` over 140 words. Derive it in `lib/format.ts` at 220 wpm and expose it through the `@/content` barrel. It renders on three surfaces (`app/page.tsx:218`, `app/blog/page.tsx:55`, `app/blog/[slug]/page.tsx:66`), and afterwards your flagship post says "1 min read." That's uncomfortable and it's the point: it turns "the site feels thin" from a vague design complaint into a specific editorial backlog.

**Don't add a per-page `updatedAt` claim.** No article in the repo sets it, and `components/content/NextLinks.tsx:39` already made this call correctly with a comment you should keep honouring: *"a fabricated per-page date would be worse than an honest shared one."* Show the shared `REVIEWED`, not `updatedAt ?? publishedAt` dressed up as "last checked."

---

## Sequence

| # | Do | Effort | Why here |
|---|---|---|---|
| 0 | Reduced-motion Part A in `app/globals.css` | **30 min** | Six lines. Removes a live content-invisibility hazard from the repo before anyone else writes a transition. Do it today. |
| 1 | `Block` union + `<h2 id scroll-mt-24>` in `AutoLinkedProse.tsx`; add headings to the 6 existing articles | **4–5 h** | The single biggest citability win available. Today an assistant quoting DR-2026-01 can cite one anchor for the whole document. `GuideArticle.tsx:24` already proves the pattern works here. Also unblocks #4. |
| 2 | `lib/masthead.ts` + `components/content/Masthead.tsx` — provenance strip and evidence grade | **4 h** | Zero-input, applies to every article forever, and it's the thing that makes the top of the page look finished. |
| 3 | Delete `readingMinutes`, derive it in `lib/format.ts` | **1 h** | Cheap, and it removes the only hand-typed number on the page. |
| 4 | `keyFigures` type + `components/content/KeyFigures.tsx` over the existing `Stat`; author them for the report and the 3 academy pieces | **5–6 h** | Highest-value block on the site. Note `Stat` emits bare `<dt>/<dd>` — it needs a `<dl>` wrapper and an optional `href`. |
| 5 | `components/content/OnThisPage.tsx`, lifted out of `GuideArticle.tsx:63-79`; render at 4+ sections | **2 h** | Free once #1 exists. |
| 6 | Per-route `opengraph-image.tsx` for research + blog | **3–4 h** | The root card uses plain flex and `fontFamily: 'sans-serif'`, so no font-loading work. This is your real banner. |
| 7 | Index rows carry the leading key figure as text on `/blog`, `/research`, `/academy` | **2 h** | Closes most of the "three-second impression" gap using data already authored. |
| 8 | *After `isLive: true`* — `Banner.tsx` SVG figure + the two permitted animations under Part B | **1 day** | Do not do this before the pipeline lands. |
| — | Widen `Doc` with `publishedAt`/`author`/`sources`, or leave `/docs` alone | **defer** | 13 docs, 11 of them `to-migrate` stubs. Not worth it yet. |

**Roughly three focused days to step 7.** Zero new dependencies, zero client JS in the article path, no `"use client"` anywhere new, `app/layout.tsx` stays a server component.

---

## What not to build

- **A left rail.** Shifts the prose column on every already-indexed URL, and in a CSS grid it's placed *first in source* — which would put a stack of metadata ahead of your h1 in every crawler's extracted text.
- **A rail on every route.** If it appears everywhere it's furniture, and furniture is decoration with a job title.
- **`display:none` on any block at any breakpoint.** deagentic hides its TOC on mobile. That deletes navigation for most of your readers and leaves text in the DOM no human can reach.
- **`.marketing-visual-panel`.** Three copy fields per article — chip, bold line, sentence — that restate the h1 and, by construction, cannot be quoted. It works for a SaaS hero. To a professional investor, an abstract glowing panel above a difficulty forecast marks the forecast down.
- **Scroll reveal, in any form.** Not even a "safe" gated one. The careful version has to be re-reasoned by every person who touches the CSS afterwards, and one of them will get it wrong.
- **Animated counters.** See above; this one contradicts your product.
- **A reading-progress bar, an author card, an author photo.**
- **Real images anywhere in the article body.** You have no illustrator. A design that needs one stops being applied by article four.

---

## Aesthetic preference vs. functional argument

Be clear on which is which, because you should feel free to overrule the first column and not the second.

**Functional — I'd defend these against anyone:**
- The reduced-motion CSS. It's a live bug that hides content from a specific class of user.
- No animated counters. Breaks *"every number a visitor can see must also be in the HTML as text."*
- No images in the body. `scripts/audit.mjs` fetches with GPTBot's UA and no JS; a number inside a raster is invisible to the audience the site exists for.
- `<h2 id>` anchors. Section anchors are the unit an assistant cites.
- Mandatory `asOf` on `KeyFigure`, and gating figures on `isLive`.
- Deriving `readingMinutes`. Two out of two current values are wrong.
- No rail on a 768px column. That's arithmetic, not taste.

**Aesthetic — my judgement, argue with me:**
- The masthead as hairline rules and small caps rather than a tinted panel or a gradient. A different designer could make a tasteful tinted plate and I'd have no functional objection.
- The provenance strip *above* the prose rather than below it.
- Right-aligned evidence grade, the specific figure-strip layout, `border-y` versus a card.
- Whether the epoch bar should animate at all once `isLive` lands. It's permitted under the contract; it isn't required.

**And the honest weakness in all of this:** a visitor judges you in three seconds from an index page, before a word of this scaffold gets a hearing. `/blog` and `/research` are rows of text. With card images they'd read as a publication with a back catalogue; without them they read, correctly, as six articles. Step 7 helps — a row that says *"±16.3% — 95% band, 1-day hashrate estimate · 22 Aug 2026"* is more scannable than a card image, and it's free. But it doesn't close the gap, and I don't think anything closes it except a seventh article. The falsifiable test: if in three months `/data/difficulty` lists twenty settled epochs with forecasts scored against outcomes and the site still reads thin, the problem was presentational and I was wrong. That test runs on its own.
---
name: ux-layout
description: Page composition for doefin-web — the twelve-slot spine every route shares, container widths, spacing rhythm, heading and figure scale, density ceilings, responsive behaviour, and the band-by-band shape of each of the seven content types. Use when building, restyling or reviewing the layout of any page, when deciding where a call to action goes, or when a page type wants to look different from its siblings.
---

# Page composition — doefin.com

Every page repeats the same spine. One slot varies, and §6 says how much. A layout
decision not covered here is a bug, not a style.

| Question | File |
|---|---|
| Which bands, in what order, at what width, how far apart, how big | **this file** |
| Colour, radius, type token, the wordmark | `.claude/skills/brand/SKILL.md` |
| Titles, descriptions, anchor text, copy shape | `.claude/skills/seo-onpage/SKILL.md` |
| What makes a passage quotable by an assistant | `.claude/skills/aeo-geo/SKILL.md` |
| Which JSON-LD type goes where | `.claude/skills/schema-markup/SKILL.md` |
| **Which** ask a route gets, and how it is worded | `.claude/skills/conversion/SKILL.md`, `.claude/skills/funnel/SKILL.md` |
| Route map, nav slots, where cross-links point | `.claude/skills/information-architecture/SKILL.md` |
| Scaffolding a new route | `.claude/skills/new-page/SKILL.md` |

Layout serves one rule from `CLAUDE.md`: **every number a visitor can see is also in the
HTML as text, with its units and its date or block height.** A band that hides a figure
behind JavaScript, a chart with no table, or a figure with no date is a defect however
it looks.

---

## 1. The spine — twelve slots, one order

`○` = omittable, on the stated condition only. **S7 is the only slot where a type
diverges.**

| # | Slot | Contents |
|---|---|---|
| S1 | Frame | `<Container>` at the width §2 assigns, `className="py-16"` |
| S2 | Trail | `<Breadcrumbs>` — every route except `/` and `not-found`. Sole source of `BreadcrumbList`; never hand-written |
| S3 | Head | `<Eyebrow>` naming the kind of object → one `<h1>` carrying the page's distinctive fact → a lede of at most two sentences that is **the answer, not a tease** |
| S4 | Provenance strip ○ | `<IllustrativeBadge isLive>` + `<AsOf height builtAt>` wherever a figure comes from `content/sample-data.ts`. Omit only on a page with no figures |
| S5 | Eligibility line | One line of static HTML text, always served: who this is directed at, that others must not act on or rely on it, that Doefin is not FCA-authorised. `text-sm text-muted`; a `<Callout tone="caution">` on any page carrying an app link |
| S6 | Answer-first block ○ | 2–4 self-contained sentences, each with its own figure, units and date, in the brand-dot bullet idiom from `app/research/[slug]/page.tsx`. The heading varies by type ("What we found" / "In short" / "What this says"); the markup does not. Omit only where the page *is* the answer |
| S7 | The type's own middle | **§6.** All variation lives here |
| S8 | Common questions ○ | `<FAQ items>` — visible questions phrased as typed. Omit only when the page answers no question a reader types |
| S9 | Method & sources ○ | Descriptive link to `/methodology/<metric>` **above** the FAQ, plus `<SourceList>` with its measured / single-source / judgement label. Omit only where the page asserts no checkable claim |
| S10 | Where to go next | Descriptive internal links three ways — **down** (the definition), **across** (a sibling of the type), **forward** (the tool, dataset or doc). Never "learn more". Never an ask |
| S11 | The one ask | Exactly one, placed per §7, chosen per the `conversion` skill. May be `none` |
| S12 | Provenance footer ○ | What here is illustrative; `Last reviewed <time dateTime>`; a citation string on pages built to be quoted |

Wrong order and the page becomes a pitch with evidence attached — an ask standing above
the proof that justifies it, which this audience does not forgive and s21 does not permit.

---

## 2. Container width

> `size="narrow"` (`max-w-3xl`) is the default for any page whose content is one column.
> `Container` default (`max-w-container`, 1200px) is permitted **only** where the page
> renders a real second column — a rail, a two-up shell, or a full-bleed table or chart.

| Width | Routes |
|---|---|
| Default + second column | `/`, `/research/[slug]`, `/for/miners`, `/for/institutions`, `/tools/[tool]`, all of `/data/*` |
| `size="narrow"` | `/academy/[slug]`, `/academy/guides/[slug]`, `/blog/[slug]`, `/glossary/[slug]`, `/docs/[slug]`, `/methodology/[metric]`, `/tools/[tool]/example/[case]`, `/about`, `/newsletter`, `/terms`, `/privacy`, `not-found` |
| Default, card grid as the second axis | the index hubs — `/data`, `/academy`, `/tools`, `/research`, `/blog`, `/blog/tag/[tag]`, `/glossary`, `/docs`, `/resources`. A `sm:grid-cols-2` / `md:grid-cols-3` card grid is a real second column for the purposes of this rule; a hub rendering one `max-w-prose` list is not |

All 29 routes appear in one of the three rows. A route absent from this table has no
assigned width, which is itself the finding.

Two grid idioms, no third: prose + rail is `grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]`,
main column `max-w-prose`, rail `lg:sticky lg:top-24`; the tool shell is
`lg:grid-cols-[1fr_20rem]` (`components/tools/toolkit.tsx:9`). **Never import
`ToolShell` into a server page** — that file opens with `'use client'`.

Work around, never copy, the known breach: `app/page.tsx:24` renders a third idiom,
`lg:grid-cols-[1.15fr_1fr]`, for the hero split on `/`. It is the only sanctioned
instance; a fourth is a bug.

**A wide container with a `max-w-prose` body and nothing in the gutter is a bug, not a
style.** It reads as broken at every breakpoint above `lg`.

---

## 3. Spacing rhythm

| Gap | Class | Use |
|---|---|---|
| Band | `mt-12` | Between any two top-level `<section>` bands |
| Major band | `mt-20` | Between the page's phases — head → middle, middle → closing (S10–S12) |

Inside a band: `space-y-4` stacked, `gap-4` card grids, `gap-6` two-column shells. Page
padding is `py-16` on the `<Container>`.

`mt-8`, `mt-10`, `mt-14` and `mt-16` are all in the tree today as band gaps. **A third
value destroys the rhythm** — a reader can no longer tell which blocks belong together.
Work around, never copy, the known breach: `<FAQ>` hard-codes `mt-14` and `<SourceList>`
`mt-12` on their own `<section>`; do not stack a wrapper margin on either.

---

## 4. Heading and figure scale

| Element | Class | Rule |
|---|---|---|
| `h1` | `text-balance text-4xl font-extrabold tracking-[-0.03em]` (`sm:text-5xl` on `/` only) | Exactly one per page, carrying the distinctive fact |
| Band `h2` | `text-2xl font-extrabold tracking-[-0.02em]` | **Every top-level band carries one.** No unheaded bands |
| Secondary `h2` | `text-xl font-bold tracking-[-0.02em]` | Rails, card grids, closing bands |
| Label `h2` | the eyebrow/label token — `brand`, "Typography" | Provenance-weight bands only (Sources, Terms used here) |
| `h3` | `text-lg font-bold tracking-[-0.015em]` | Only **inside** an h2 band; `scroll-mt-24` on any heading with an id |
| Primary figure | `text-3xl` or larger | The one number the page exists for |
| Supporting figure | `<Stat>` (`text-2xl`), never larger | A stat that outsizes the h2 above it inverts the hierarchy |

- **Never skip a level for size.** Change the class, not the tag.
- **Headings are claims, not topics.** "The band narrows as the epoch fills" beats
  "Chart" — a topic heading gives an assistant nothing to retrieve.
- **Same band, same words across siblings of a type** — "The figures", "The record",
  "Common questions", "Where to go next". Renaming per page is how a template set drifts
  into 27 one-offs.
- Header and footer nav headings are `<p>`/`<span>` inside `<nav aria-label>`, never
  `<h2>`: the footer emits four `h2` per page today (`components/layout/Footer.tsx:22`),
  corrupting all 29 outlines.

---

## 5. Density, charts and responsive

| Ceiling | Value | What breaks if ignored |
|---|---|---|
| `<Stat>` cards in a key-figures rail | **4** | A fifth must displace one. Six tiles read as a dashboard and nothing is primary |
| Asks per page | **1** (§7) | Two asks compete and both lose |
| `<Subscribe>` per page | **1** | It hard-codes `id="subscribe-heading"` and `id="sub-email"`; a second emits duplicate ids and a `<label for>` pointing at the wrong input |
| Words per prose section | **120–400**, each opening with its claim | Longer has no chunk boundary; shorter has no substance |
| Supporting chart | **≤ 200px**, `h3`, figures printed adjacent | Anything taller stops being supporting |
| Contents list | 4+ `h2` sections or past ~1,200 words | There is no `OnThisPage` component; the only instance is the `<nav aria-label="On this page">` block at `components/tools/GuideArticle.tsx:64-78`. Derive its entries from the rendered sections, **never** a hard-coded array — that block's `SECTIONS` constant (`GuideArticle.tsx:13-20`) is the drift this prevents |
| Buttons in the head band | 1 primary + at most 1 secondary | Three buttons is no decision made |

- **Chart first, its table immediately beneath, inside the same `<section>`, under one
  `h2` stating the chart's message.** `CLAUDE.md` requires the table; this file requires
  the adjacency. A table three bands away breaks the rule as fully as no table at all.
- Use `<DataTable>` (`components/ui/index.tsx:117`), never a hand-rolled `<table>` — it
  carries `overflow-x-auto`, a real `<thead>` and a caption slot.
- **State the empty case.** Where n is too small for a statistic to mean anything, replace
  the chart with a sentence naming the date the first point arrives; the table still
  renders, with em-dashes and that same date.
- **Responsive:** nothing load-bearing in the rail, which reflows below the body under
  `lg`. Stat rails `sm:grid-cols-2 lg:grid-cols-4`; card grids `sm:grid-cols-2` or
  `md:grid-cols-3`, never five across. The text column stays `max-w-prose` (68ch) when the
  container widens; the body never scrolls horizontally. Both branches of a conditional
  band render server-side at the default state, so one is always in the HTML.

---

## 6. What varies, per type

Everything not listed here is spine. Do not reinvent it.

### 6.1 Data & analytics — `/data`, `/data/*`, `/data/difficulty/epoch/[height]`, `/methodology/[metric]`

S7 = key-figures rail → primary chart + table → supporting charts → the complete figures
table → "What this number does not say" → archive and neighbouring metrics.

| Diverges | Rule, and what breaks |
|---|---|
| Key-figures rail | Four `<Stat>` directly under the head, each with label, `tabular` value, units and a qualifying note. A fifth metric displaces one |
| Primary chart | Its `h2` is the chart's message, table beneath. Difficulty is a **step line, never smoothed** — interpolating between retargets misstates a step function |
| Freshness line | As-of block height, as-of UTC datetime in `<time dateTime>`, and the next update as a block height plus estimated datetime. Bitcoin makes the next release computable rather than promised; this is the type's trust device and belongs to no other type |
| `/methodology/[metric]` | Inverts S7 — version chip → parameters table → restatement log → fitted-error chart → "where this metric is used" — and takes **no ask at all** |

### 6.2 Interactive tools — `/tools`, `/tools/[tool]`, `/tools/[tool]/example/[case]`

S7 = brief → provenance line → two-column shell → "What would have to change" →
conditional next action → watch-out `<details>` → worked examples.

| Diverges | Rule, and what breaks |
|---|---|
| Inputs | A typed numeric field paired with its slider on the same row, same state, for every real contract term (rate, fee, capex, hashrate, efficiency, power cost). Sliders survive only for difficulty-scenario ranges: a `rate` slider stepping at 0.001 cannot express $0.0642/kWh, and this audience knows its number exactly |
| "What would have to change" | Directly under the shell: three single-sentence levers, each carrying the number that flips the answer, each marked controllable or not |
| Next action, after the answer | The app link with the indications in the same block, and the guide beside it. No size gate — `/for/miners` covers when hedging is not worth doing, and the reader decides |
| Order | **The action never sits after the FAQ** — the named failure mode for calculator pages |
| `/tools` hub | A static sample answer per card in text with units, plus the worked-example corpus as a linked `<DataTable>` |

### 6.3 Academy & guides — `/academy`, `/academy/[slug]`, `/academy/guides/[slug]`

S7 = (guide: `OpenTool` above the contents) → `<OnThisPage>` → sectioned body →
arithmetic table → terms used here.

| Diverges | Rule, and what breaks |
|---|---|
| The Diátaxis split | Structural, not stylistic. `/academy/[slug]` is explanation and never grows a step list; `/academy/guides/[slug]` is how-to and never grows a "how difficulty works" section — it links to the article. `check:tools` holds the third level on `/tools/<slug>` |
| Sectioned body | `{ id, heading, paragraphs[] }`, each section 120–400 words opening with its claim, each `h2` at `scroll-mt-24`. A flat `string[]` body has no anchor, no contents entry and no chunk boundary |
| Two-door fork on `/academy` | Concepts vs tool guides, at the top. A mixed hub's commonest failure is making the reader scroll past the wrong half |
| `OpenTool` twice | Above the contents list as well as at the foot — a how-to reader has a task, and the payoff must be reachable before 3,000 words |

### 6.4 Research reports — `/research`, `/research/[slug]`

S7 = masthead slab → report-card rail → findings → the figures → body → pack manifest.

| Diverges | Rule, and what breaks |
|---|---|
| Slab masthead | `rounded-header`, `bg-gradient-to-br from-surface to-surfaceAlt`, `p-8 sm:p-10`, holding the edition `<Tag>`, `<IllustrativeBadge>`, the byline with both dates, and two **anchor** buttons to `#get-the-pack` and `#method`. Anchors, not forms, so the offer sits at the top without displacing a finding |
| Report-card rail | **This is the second column §2 requires of `/research/[slug]`** — the prose + rail idiom, not a stacked block. A `<dl>` of report ID, published date, data window, observation count with units, method version + link, dataset shape, pack contents, licence, status. The only place these facts live — never duplicated into the masthead |
| Pack manifest | Above the one form: what actually arrives, itemised, plus the line saying the findings above are complete and free |

A blog post starts on the page ground; a report starts on a slab with an edition number on
it. Those three things are the whole difference — no new colour, no report theme.
**Nothing is gated, ever**: no blur, no truncation, no "read more" cut, no modal, no
exit-intent. The email buys the PDF, the CSV and the series, never a sentence.

### 6.5 Editorial & blog — `/blog`, `/blog/[slug]`

**This type does not vary.** Strip the spine and what remains is tag chips,
related-by-tag and a citation footer — none of them structural. `/blog/[slug]` and
`/academy/[slug]` share **one template parameterised by kind**
(`'commentary' | 'explainer'`), differing in eyebrow, breadcrumb parent, next-read rule
and whether the byline shows a reviewed date. **§6.3 still owns `/academy/[slug]`'s S7**
— sectioned body, arithmetic table, terms used here. What this section governs is the
shared chrome around that middle, nothing inside it. Two templates rendering the same bands in
the same order with different imports is the drift this standard exists to stop. The
blog-specific parts ship as parameters: tags linked everywhere they render through one
`tagSlug()` helper, and a citation footer with a dated correction line when `updatedAt`
is set.

### 6.6 Glossary & reference — `/glossary`, `/glossary/[slug]`, `/docs`, `/docs/[slug]`

S7 = expanded answer → "At a glance" facts → body prose → "Where this shows up".

| Diverges | Rule, and what breaks |
|---|---|
| The answer owns the first screen | `h1` = the bare term, never a question — the h1 is the entity a knowledge graph resolves; `h2` = the question as typed; then the sub-160-character `shortDef`; then a 40–60 word expanded answer in Definition → Context → Consequence order. **No panel, badge or link between the h1 and the end of that answer** |
| "At a glance" facts | 3–6 rows of unit, current value, date and block height as HTML text, with `<IllustrativeBadge>` and `<AsOf>`. Terms with no quantity get non-numeric rows. Omitted entirely when there are no facts, never rendered empty. **No chart on this type, ever** |
| The ask splits the two routes | Glossary takes none; docs take the app link. That split is the point of the type |
| Body and index | `<AutoLinkedProse ... skip={[term.slug]} />` so a term does not self-link; `/docs` lists only `status === 'published'` |

### 6.7 Landing & audience — `/`, `/for/miners`, `/for/institutions`, `/about`, `/resources`, `/newsletter`

S7 = claim-and-proof hero → the argument → the unique artefact → disqualifier.

| Diverges | Rule, and what breaks |
|---|---|
| Claim and proof in one band | One checkable figure in the first screenful as HTML text with units and a block height. Never make the claim bigger than the proof, never separate them by two screens |
| A unique artefact per route | A `<DataTable>` with a real `<thead>` that exists nowhere else on the site: the per-epoch worked example on `/for/miners`; the mechanics table with every row linking to what substantiates it on `/for/institutions`; a forecast-versus-realised table on `/`; the endpoint table with a per-row **Status** column on `/resources`. This band is what keeps an audience page outside Google's doorway definition |
| Disqualifier band | One specific, costed reason not to proceed, on every route. Publishing the case against yourself is the cheapest credibility instrument a firm with no logos and illustrative data has. Do not soften `/for/miners`' version |
| `/for/*` proof rail | Prose left at `max-w-prose`, sticky rail carrying the forecast `<Stat>`, the substantiation links and the terminal action. **Never multiply `/for/<segment>`** without an artefact of its own |

---

## 7. The ask, as a layout problem

`conversion` and `funnel` decide **which** ask a route gets, how many, and how it is
worded — including the definition of an ask, the one-`<Subscribe>` rule, the two-adjacent-
bands rule, the FPO adjacency limbs, gating and social proof. **None of that is restated
here.** This file decides only **where an ask sits and how much room it takes**:

- **The ask is S11** — after "Where to go next", before the provenance footer. `/tools/[tool]`
  and `/for/institutions` are the two sanctioned departures (§8).
- **Proof before ask.** Nothing that asks renders above S7, the band carrying the page's
  unique artefact. This is the one ordering rule the whole spine exists to protect: an ask
  standing above the proof that justifies it is what turns a page into a pitch with evidence
  attached.
- **Never in the first screen**, and never inside the rail as the only instance (§5).
- **Full-size `<Subscribe>` where subscription is the page's purpose, compact everywhere
  else** — a size decision, which is this file's; *which pages* is `conversion` §2's.
- **Two asks in adjacent bands, when permitted, are styled primary above and compact
  secondary beneath.** Never two of equal weight side by side.

## 8. When a type may break the spine

| Break | Who | Condition |
|---|---|---|
| Ask above the closing slot | `/tools/[tool]` | The action is adjacent to a computed result; the closing slot then carries **no** second ask |
| Two asks in adjacent bands | `/academy/guides/[slug]` | Different commitment levels, two separate bands, app link primary and newsletter compact beneath. Never two primaries |
| An offer above the findings | `/research/[slug]` | It is an anchor to `#get-the-pack`, not a form |
| The same ask in the rail and at the foot | `/for/institutions` | One ask shown twice at one commitment level, not two asks (`conversion` §3). The rail instance is decorative under `lg` — the foot instance is the one that must exist |
| S6 omitted | glossary terms, single-figure data pages | The page *is* the answer |
| S8 and S9 omitted | `/terms`, `/privacy` | No checkable claim, no question a reader types |
| Default container width | see §2 | A real second column exists |

Anything else is a bug. If a page seems to need a break not on this list, say so rather
than shipping it.

---

## 9. Before you call a page done

- One `h1`; every top-level band has an `h2`; no skipped levels; no `h3` outside a band.
- Container width matches §2, and a wide container has a real second column.
- Only `mt-12` and `mt-20` as top-level band gaps.
- Every figure is HTML text with units and a date or block height; every chart has its
  table in the same `<section>` beneath it, under one claim heading. (`tabular-nums` is
  `brand`'s rule and `brand-review`'s finding, not this file's.)
- `<Breadcrumbs>` present; exactly one `<Subscribe>`; exactly one ask, below the proof
  band, with any app link's indications in the same visual block (§7).
- No client directive on the page component (`CLAUDE.md`). `<Subscribe>` and the three
  calculators in `components/tools/` are the only client leaves on the site.

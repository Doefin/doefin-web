---
name: information-architecture
description: Site structure for doefin-web — the route map and its parents, what earns a nav slot and what does not, how content types link to each other (the guide/tool/example triangle, glossary to academy, research to data), how to add a route without orphaning it, and breadcrumb and URL-hierarchy rules. Use when adding, moving or deleting a route, editing header or footer nav, deciding where a page's links point, or when asked why a page gets no traffic.
---

# Information architecture — doefin.com

Structure, not styling. Where a page sits, how it is reached, and what it links to.
Cross-referenced, not repeated: `seo-onpage` (anchor text, slug casing), `aeo-geo`
(why permanent URLs accumulate citations), `schema-markup` (which JSON-LD types
exist), `new-page` (the scaffold), `audit-site` (the rendered crawl).

## 1 · The map

Every route has exactly **one parent**. The parent is the first breadcrumb, the hub
that must list it, and the route its URL nests under. There is no second home.

| Parent hub | Children | Nav home |
|---|---|---|
| `/data` | `/data/difficulty`, `/data/hashrate`, `/data/scoreboard` | header |
| `/data/difficulty` | `/data/difficulty/epoch/[height]` | archive band on the parent |
| `/methodology` *(missing)* | `/methodology/[metric]` | linked from every page publishing a number |
| `/research` | `/research/[slug]` | header |
| `/academy` | `/academy/[slug]`, `/academy/guides/[slug]` | header |
| `/tools` | `/tools/[tool]`, `/tools/[tool]/example/[case]` | header |
| `/glossary` | `/glossary/[slug]` | header |
| `/docs` | `/docs/[slug]` | header |
| `/blog` | `/blog/[slug]`, `/blog/tag/[tag]` | footer |
| `/for` *(missing)* | `/for/miners`, `/for/institutions` | header |
| `/` | `/about`, `/newsletter`, `/resources`, `/terms`, `/privacy`, `/blog/tag/[tag]` *(taxonomy, §6)* | footer |

**Three parents do not resolve**: `/for`, `/methodology`, `/data/difficulty/epoch`.
Build the index or do not name the segment in a crumb — a crumb pointing at a 404 is
worse than a shorter trail.

**`/contact` does not exist either**, and is not in this map. `conversion` §7 records
it as the open item behind rung 5's missing human route. Do not link it, crumb it, or
add it to `footerNav` until `lib/site.ts` carries an address.

## 2 · Nav

`lib/site.ts` holds both `nav` (header) and `footerNav`. They have different jobs.

**A route earns a header slot only if all four hold:**

| # | Test | Breaks if ignored |
|---|---|---|
| 1 | It is a hub with its own index route, never a leaf | A leaf in the nav means its siblings are unreachable |
| 2 | It has 3 or more published children | Two posts behind "Blog" spends a slot on a stub |
| 3 | It is not already a child of a hub in the nav | Two paths to one page splits the trail |
| 4 | Losing the slot would leave a whole content type footer-only | Footer-only is where traffic goes to die |

Six slots is the ceiling — the strip in `components/layout/Header.tsx` scrolls
horizontally below `md`, and a seventh pushes something off-screen on a phone.

Current `nav` (`lib/site.ts:17-24`): Data, Research, Learn, Tools, **Blog**, Docs —
six, the ceiling. Blog fails test 2 with two posts. **Glossary** — 19 entries, the
site's highest AI-citation entry surface — is in no header nav at all. **Swap them**;
that is the whole change, and it keeps the count at six.

`/for` cannot join without evicting a seventh, and it fails test 1 besides: there is no
`/for` index route (§1). Until one exists, both audience pages stay where they are —
`/for/miners` as the `lg:`-only link at `Header.tsx:28-32`, `/for/institutions` in the
footer's *For you* column (`lib/site.ts:51`). Neither is in the header `nav` array; both
are reachable.

**The footer is the completeness net, not a nav.** Every route in `app/sitemap.ts`
that no hub page lists must appear in `footerNav`; four columns, max five links each.
Column headings are `<p>`/`<span>` inside `<nav aria-label={col.title}>` — they are
`<h2>` today (`components/layout/Footer.tsx:22`), so all 29 pages carry four extra
`<h2>`s in their outline. A footer link is not an inbound link (§4): footer-only means
orphaned.

## 3 · Breadcrumbs

`components/content/Breadcrumbs.tsx` is the **only** sanctioned source of
`BreadcrumbList`. Never hand-write one.

| Rule | Breaks if ignored |
|---|---|
| Present on every route except `/` and `app/not-found.tsx` | The trail exists at depth 2 and vanishes at depth 1 — today's state |
| Never pass `Home` in `items` — the component prepends it | Two `position: 1` Home entries |
| The last crumb is the current page and still needs an `href` | The schema's final `item` URL is missing |
| Crumb count equals URL segment count | A 3-segment URL with a 1-crumb trail tells a crawler nothing |
| Crumb `name` matches the target's `<h1>` or its nav label | An invented short name is a third name for one page |
| Every crumb `href` resolves to a real route | See §1 — three do not |

Exact `items` per family:

```tsx
/data/difficulty            [{name:'Data', href:'/data'}, {name:'Difficulty forecast', href:'/data/difficulty'}]
/data/difficulty/epoch/N    [{name:'Data',…}, {name:'Difficulty forecast',…}, {name:`Epoch ${N}`, href:…}]
/methodology/difficulty-index  [{name:'Data',…}, {name:'Difficulty forecast',…}, {name:'Methodology', href:…}]
/academy/guides/<slug>      [{name:'Learn', href:'/academy'}, {name:'Tool guides', href:'/academy#guides'}, {name:title, href:…}]
/tools/<t>/example/<c>      [{name:'Tools',…}, {name:toolTitle, href:`/tools/${t}`}, {name:caseTitle, href:…}]
/for/miners                 [{name:'For mining operators', href:'/for/miners'}]
```

Missing today on: `/data`, `/data/difficulty`, `/data/scoreboard`,
`/methodology/[metric]`, `/for/miners`, `/for/institutions`, `/about`, `/research`,
`/blog`, `/academy`, `/glossary`, `/tools`, `/docs`, `/resources`, `/newsletter`,
`/terms`, `/privacy`.

## 4 · Orphans and dead ends

**Orphan** — a route whose only inbound links come from `Header.tsx`, `Footer.tsx`,
`lib/site.ts` or its own file. **Chrome is not an inbound link.**

> **Every route needs two inbound body links from two different pages.**

```bash
grep -rn 'href="/newsletter"' app components lib content \
  | grep -v 'layout/Footer\|layout/Header\|lib/site'
```

Orphaned today: `/blog/tag/*` (zero inbound anywhere, four pages in the sitemap),
`/feed.xml` (no `rel="alternate"`, no footer link). Footer-only: `/newsletter`,
`/resources`, `/about`, `/data/hashrate`, `/methodology/difficulty-index`.
`/data/page.tsx` prints the hashrate figure and does not link the hashrate page.

**Dead end** — a page whose only outbound links are chrome and `AutoLinkedProse`
glossary terms. Every page carries a *Where to go next* band with **three
directions**, and never an ask:

| Type | Down (the definition) | Across (a sibling) | Forward (act on it) |
|---|---|---|---|
| `/data/[metric]` | its glossary term | the other metric, `/data/scoreboard` | `/methodology/<metric>` + CSV/JSON |
| `/data/difficulty/epoch/N` | — | previous / next epoch | `/methodology/difficulty-index` |
| `/methodology/[metric]` | — | the other metric's method | "where this metric is used" — every page publishing it |
| `/glossary/[slug]` | `seeAlso` chips | previous / next term, alphabetical | the page where its figure lives — `/data/*`, `/tools/*`, `/academy/*` |
| `/academy/[slug]` | glossary terms | next article up the ladder | `/tools/<slug>`, `/data/difficulty` |
| `/academy/guides/[slug]` | the concept article | the other two guides | `/tools/<slug>`, its worked examples |
| `/tools/[tool]` | the concept article | the other two tools | `/academy/guides/<slug>`, its examples |
| `/tools/[tool]/example/[case]` | glossary terms | sibling examples | `/tools/<tool>` preloaded, the guide |
| `/research/[slug]` | glossary terms | previous / next edition | `/data/scoreboard`, `/data/difficulty`, `/methodology/*`, `/for/institutions` |
| `/blog/[slug]` | glossary terms | two posts sharing a tag | the report, dataset or tool the piece is about |
| `/docs/[slug]` | glossary terms | previous / next doc in group | `site.appUrl`, `/for/institutions` |
| `/for/miners` | `/academy/how-difficulty-adjustment-works` | `/for/institutions` | `/tools/difficulty-exposure` |
| `/for/institutions` | `/docs/*`, one per mechanics row | `/for/miners` | the app, `/methodology/difficulty-index` (**not** `/contact` — it does not exist, §1) |

Dead ends today: `/data/scoreboard`, `/data/hashrate`, `/academy/[slug]`,
`/glossary/[slug]`, `/docs/[slug]`, `/methodology/[metric]`, `/resources`, `/about`.
`/research/[slug]` has **zero** outbound internal links while its body says the report
"accompanies a public scoreboard".

## 5 · The wiring between types

**The guide/tool/example triangle.** Every calculator is three routes and **six
edges**. All six, both directions, or the corpus leaks.

```
/tools/<slug>  ⇄  /academy/guides/<slug>
      ⇅                    ⇅
      └──  /tools/<slug>/example/<case>  ──┘
```

| Edge | Where it lives | State |
|---|---|---|
| tool → guide | `ToolBrief` + a foot panel | present |
| guide → tool | `OpenTool`, above the contents list **and** at the foot | present |
| tool → examples | the "Worked examples" card row | present |
| example → tool | a Panel **under the working**, with the values preloaded into the query string `useUrlState` reads | present but buried in a foot Callout |
| guide → examples | `examplesFor(slug)` card row before the FAQ | **missing** — the link graph runs one way, away from the quotable page |
| example → guide | method-and-sources band | present |

Plus: **one example page per preset in `content/tool-micro.ts`, same title string,
same numbers.** Nine presets, five examples, no correspondence today — so a preset a
visitor clicks has no static twin to link, and `scripts/check-tools.mjs` should fail
on the mismatch.

**Glossary → academy, and back.** The corpus links *into* the glossary automatically
through `AutoLinkedProse`; the glossary must link back out or it is a closed loop.

- Every term page renders `<AutoLinkedProse paragraphs={term.body} skip={[term.slug]} />`.
  `app/glossary/[slug]/page.tsx:64` uses `<Prose>`, so the 19 densest pages on the
  site link to nothing but their own `seeAlso` chips.
- Every term carries at least one *Where this shows up on Doefin* link to a data,
  methodology, tool or academy page.
- `/glossary` surfaces `aliases` (so "EH/s" reaches Exahash) and links each entry to
  the page where its figure lives. A–Z letter anchors only past **24 terms** — at 19,
  a rail of dead letters scans worse than the flat list.

**Research → data.** A report is a credential, so §4's forward column is mandatory
here: the three targets linked from the *body copy*, not only a closing band.

**Hub ↔ child reciprocity.** A hub lists **every** published child, mapped from the
same `content/index.ts` accessor the route uses — never a hand-written list. That is
how `/data` lost `/data/hashrate` and `/methodology/difficulty-index` fell out of
`app/sitemap.ts`.

**In-page structure is IA too.** Section `id`s are permanent once published. Render a
contents list at 4 or more `<h2>`s or past ~1,200 words, **derived from the rendered
section list**. There is no `OnThisPage` component; the one instance is the
`<nav aria-label="On this page">` block at `components/tools/GuideArticle.tsx:64-78`,
and it reads a hard-coded `SECTIONS` constant (`:13-20`) that silently drops any
seventh section.

## 6 · URLs and hierarchy

`seo-onpage` owns casing, hyphens and permanence. These are the structural rules on
top:

- **Every typeable segment resolves.** If `/for/miners` exists, `/for` must too. (One
  parent per URL is §1's rule.)
- **Four segments is the ceiling.** `/tools/difficulty-exposure/example/tight-margin`
  is the deepest route and the limit.
- **One fact per dynamic URL, permanently** — `/data/difficulty/epoch/913248` is one
  epoch forever. A settled epoch page is never edited; a correction is a new entry.
- **The slug rule lives in one helper.** `tagSlug()` / `tagFromSlug()` in `lib/`,
  imported by the route, both card grids and `app/sitemap.ts`. It is written twice
  today — `app/blog/tag/[tag]/page.tsx:10` and `app/sitemap.ts:48` — and neither
  lowercases, so a tag "ASIC" yields `/blog/tag/ASIC`.
- **Taxonomy routes are gated, not free.** A `/blog/tag/[tag]` page is indexed and in
  the sitemap only at **3 or more posts plus a hand-written intro**; below that,
  `robots: { index: false, follow: true }`, out of the sitemap, and the tag chips are
  plain text rather than links. Four tag pages hold one post each and strip to 140–148
  words — above `MIN_WORDS = 120` in `scripts/check-seo.mjs:11`, so **the build will not
  catch them**. This gate is the only thing that does.

## 7 · Adding a route without orphaning it

`new-page` covers the scaffold. This is the reachability half, and it is not optional.

1. **Name its parent** (§1). No answer means no page.
2. The parent's index renders a card or row linking to it, **from a `content/`
   accessor**, not a hand-written list.
3. `<Breadcrumbs items={…}>` whose first crumb is that parent (§3).
4. **Two inbound body links from two different non-chrome pages** (§4).
5. Its own *Where to go next* band — down, across, forward (§4).
6. `app/sitemap.ts`, added by **mapping a content accessor**, so a second instance of
   the type cannot be added without appearing.
7. `public/llms.txt`, under an existing `##` heading or a new one. It has no
   `## Tools`, no `## Documentation`, no `/data/hashrate` and no `/academy/guides/*`.
8. `ship-check`, before the merge.

Deleting a route is the same list in reverse — sitemap, llms.txt, every inbound link,
every crumb that names it — plus a redirect if it was ever published.

## 8 · Never

- Ship a route whose only inbound link is chrome.
- Hand-write `BreadcrumbList`, or pass `Home` into `<Breadcrumbs items>`.
- Hand-write a hub's child list when a `content/` accessor exists.
- Link to a route that does not exist. `Footer.tsx:42` points at `/resources/api` — a
  404 on every template, inside the sentence asking people to attribute the data.
- Rename a published section `id`. A cited `#settings` that no longer resolves costs
  more than the tidier name is worth. (Published *slugs* are `seo-onpage`'s rule; the
  doorway rule for `/for/<segment>` is `seo-onpage`'s and `conversion` §6's. Neither is
  restated here.)
- Make a page's only exit a form.
- Give a nav slot to a leaf route, or a seventh slot to anything.

## 9 · Check the wiring

```bash
# routes the app defines
find app -name page.tsx | sed 's|^app||;s|/page.tsx$||;s|^$|/|' | sort

# every internal href, by how often it is linked — the tail is the orphan list
grep -rhoE 'href="/[^"#?]*"' app components lib | sed 's/href="//;s/"$//' | sort | uniq -c | sort -n

# routes in the sitemap that nothing links to
grep -rn 'blog/tag\|feed.xml' app components lib content
```

For the rendered crawl — broken links, link density, `few-internal-links` on any
>300-word non-index page with fewer than three internal links — use the `audit-site`
skill, which drives `scripts/audit.mjs`.

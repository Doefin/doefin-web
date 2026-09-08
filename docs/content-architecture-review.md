# Content architecture review — what to take from deagentic.ai

Reviewed 2026-09-01. Eight dimensions of deagentic.ai's content system were compared against this
codebase by independent readers, and every "doefin-web lacks X" claim was then put to a separate
agent instructed to refute it. All eight gaps survived that check.

Four load-bearing claims below were then verified by hand against this repo:

| claim | verified |
|---|---|
| Every `<NextLinks>` call site passes a hardcoded array | **27 of 27**, resolving to 10 hub URLs. Zero point at a specific article, report or term. |
| The publisher entity contradicts itself | `public/llms.txt:5` named a different legal publisher than `lib/site.ts:8`, and `sameAs` was empty. RESOLVED: one entity, Doefin, registered Port Louis, Mauritius, generated from `lib/site.ts`. |
| `seeAlso` is not reciprocal | 19 terms, 35 edges, **5 asymmetric**: mining-difficulty→epoch, hashprice→hashrate, hashprice→mining-difficulty, confidence-interval→difficulty-adjustment, terahash→hashprice. |
| The FAQ rule is written where nobody reads it | `.claude/skills/new-page`, `new-term` and `ship-check` contain **0** mentions of FAQ or question. |

Source material: `~/workspace/deagenticAi/Content-Intelligence-System-Architecture/` (architecture
doc plus 16 skills, 4,811 lines) and both copies of the WordPress theme.

---

# Adoption plan — doefin-web, against deagentic.ai

## 1. The one idea worth taking

**deagentic treats "what relates to what" as a field on the content item. doefin-web treats it as a literal typed into the template.**

That is the whole difference, and everything the founder noticed is a symptom of it.

doefin-web already ships a *better renderer* than deagentic on almost every axis. `components/content/FAQ.tsx` builds the visible `<dl>` and the FAQPage JSON-LD from one array, so they cannot drift — deagentic reads its FAQ rows twice, in `template-parts/` and again in `inc/schema.php`, with nothing binding them. `scripts/check-seo.mjs:83-88` fails the build if a schema question is not in the visible HTML; deagentic has no such gate. `components/content/AutoLinkedProse.tsx` auto-links the first mention of every glossary term, longest-label-first — deagentic has no entity auto-linker anywhere in either theme copy; its §2.4 first-mention rule is a prompt an editorial agent checks by hand. `app/robots.ts` allows ten AI agents correctly; deagentic ships `GoogleBot-Extended`, the exact wrong string its own architecture doc warns about twice.

And yet: **all 27 `<NextLinks>` call sites in `app/` pass a hardcoded JSX array.** I checked — `grep -rn -A3 "<NextLinks" app | grep -c "items={\["` returns 27 of 27. They resolve to about ten hub URLs. Every one of the 19 glossary pages ends with the same three links (`/academy`, `/tools`, `/data/difficulty`, at `app/glossary/[slug]/page.tsx:101-107`). Both blog posts end with the same three. No article on the site links to another article. `content/types.ts` gives `Post`, `Report` and `Doc` no field pointing at any other content item — the only relational fields in the entire model are `tags` on `Post`, `glossaryTerms?` on `AcademyPost`, and `seeAlso?` on `GlossaryTerm`.

So doefin is paying the full layout and visual cost of a related-content band on 27 routes and getting none of the benefit. The fix is not a new component. It is **one derived graph module, computed at build time from typed keys, that every existing band reads from.**

Two proofs the pattern already works in this repo and needs no invention: `examplesFor(toolSlug)` in `content/tools.ts:222`, and the `<nav aria-label="Other epochs">` at `app/data/difficulty/epoch/[height]/page.tsx:158-169`, which computes sibling epochs with `epochs.filter(...)`. Build-time derivation is precedent, twice. It simply never reached the editorial types.

One thing to be clear-eyed about: **copy deagentic's rule, not its enforcement.** Its 6-link contract (2 glossary, 1 parent pillar, 2 siblings, 1 downward) lives in a brief-writer prompt and an editorial-evaluator checklist. Its theme implements one relation function — `aura_get_related_posts()` at `functions.php:2897`, shared tags with a *newest-posts backfill*, called from exactly one place. Its "Related Entries" sidebar on every learn CPT (`template-parts/learn-single.php:36-44`) is `orderby => date DESC, limit 3` with no taxonomy query at all. doefin has no Notion, no editorial agents and one author. The rule goes in a build script, or it does not exist.

---

## 2. The founder's three complaints, answered honestly

**"I don't see the related topics, researches or articles."** — Correct, and precisely diagnosable. What exists: `AutoLinkedProse` on four routes (`blog/[slug]`, `academy/[slug]`, `research/[slug]`, `docs/[slug]`), `seeAlso` chips on all 19 glossary terms, `glossaryTerms` → "Terms used here" on the three academy posts, `examplesFor`, the epoch nav. What does not exist: any link from an article to another article, any link from a glossary term back to a page that uses it, and any computed "where to go next". The arrow runs one way — prose down into the glossary — and stops. Two of six long-form pieces carry a *single* in-body glossary link, and nothing reports it.

**"There isn't any author profile."** — Half wrong, and the real problem is worse than the one he named. Attribution *is* present: `content/types.ts:24` puts `author: string` on `Base`, all six content records set it, and four route templates render a visible byline plus an `author` node in Article JSON-LD. What is missing is an author *entity*. And what is actively broken:

- `public/llms.txt:5` named a different legal publisher from the one in `lib/site.ts`, which says `entity: 'Doefin'`, `registeredIn: 'Port Louis, Mauritius'`, and `app/layout.tsx:43` emits that as `legalName`. **The site tells search engines one legal publisher in JSON-LD and a different one in the file written for AI crawlers.** That is a stronger negative E-E-A-T signal than any missing bio.
- Because `author` is a free string set to `'Doefin Research'` while `site.entity` is `'Doefin'`, every article publishes **two unrelated, un-`@id`'d Organizations** — a publisher "Doefin" and a phantom author "Doefin Research" with no url, no sameAs and no stated relationship.
- `lib/site.ts` `sameAs` is an empty array. The organisation itself is unverifiable.
- `app/feed.xml/route.ts:25-31` emits no `<author>` or `dc:creator`, despite `author` being available on every item it maps.

**"The FAQ sections isn't as rich."** — Half wrong in doefin's favour, and the root cause is not where he thinks. The *answers* already meet deagentic's spec: 2-5 self-contained sentences, direct first sentence, searcher phrasing, question marks. The primitive is stricter than deagentic's. What is thin is **coverage**: 27 authored questions across 8 of 29 route files. Nine route types that plainly answer typed questions carry none — `app/research/[slug]`, `app/blog/[slug]`, `app/academy/[slug]`, `app/academy/guides/[slug]`, `app/docs/[slug]`, `app/methodology/[metric]`, `app/tools/[tool]/example/[case]`, the epoch pages, the homepage. The flagship report DR-2026-01 has zero FAQ.

And the 19 glossary pages don't have real FAQs at all — `app/glossary/[slug]/page.tsx:86-97` templates `{ q: \`What is ${term.term.toLowerCase()}?\`, a: term.shortDef }`, which restates verbatim the text already rendered 40px above it under a heading that is literally "What is {term}?".

**The cause, which nobody has written down:** `.claude/skills/new-page/SKILL.md`, `new-term/SKILL.md` and `ship-check/SKILL.md` contain **zero** occurrences of "FAQ" or "question" — I grepped all three. The S8 FAQ slot rule exists only in `ux-layout/SKILL.md:43`, a layout reference that sits outside the authoring path. The rule was written where nobody doing the work reads it. Fixing those three files is a 20-minute change and the single highest-leverage item in this entire plan.

---

## 3. Sequence

Ordering is load-bearing: steps 1-3 must precede everything, because the extracted matcher is the one function that makes forward links and back-links agree by construction rather than by discipline.

**Step 0 — Fix the publisher entity. Half a day. Do this before any schema work.**
RESOLVED: Doefin, registered Port Louis, Mauritius. Put the answer in `lib/site.ts` as `entity` + a new `legalName`/`parentOrganization`, and make `public/llms.txt` read from it (see step 6). Add `'@id': \`${site.url}/#organization\`` to the Organization node at `app/layout.tsx:37-45` and `'@id': \`${site.url}/#website\`` at `:48-56`. Replace the inline `publisher: { '@type': 'Organization', ... }` literals at `research/[slug]:48`, `blog/[slug]:47`, `academy/[slug]:43`, `guides/[slug]:45` with `{ '@id': ID.org }`. Populate `sameAs` the day the accounts exist — `.claude/skills/schema-markup/SKILL.md:72-74` already instructs this ("it is how search engines confirm the company is real"), so this is executing a written rule, not overriding one. Do it in one commit; a half-applied `@id` graph is worse than today's consistent duplication.

**Step 1 — Extract the matcher. Half a day.**
New `lib/terms.ts` exporting `matchTerms(paragraphs: string[], skip?: string[]): { slug: string; para: number; index: number }[]`, lifted verbatim out of `AutoLinkedProse.tsx` — same longest-label-first sort, same first-occurrence-per-page `used` Set. `AutoLinkedProse` becomes a thin renderer over its output. Needs a snapshot test on the two real posts: if "difficulty" ever beats "difficulty adjustment" the prose quietly degrades everywhere.

**Step 2 — The graph. One day.**
New `content/graph.ts`, derived at module load (therefore at `next build`; no runtime, no backend). Add `terms?: string[]` to `Base` in `content/types.ts` so `Post`, `Report` and `AcademyPost` all inherit it, and fold `AcademyPost.glossaryTerms` into it — one call site, `app/academy/[slug]/page.tsx:30`. Exports:

- `TERMS_OF: Map<href, slug[]>` = `matchTerms(body)` ∪ declared `terms`.
- `USED_BY: Map<slug, Ref[]>` — the inversion. This is the reciprocity, guaranteed by construction.
- `siblings(ref, n = 2)` — the rule that decides relatedness, stated so it can be tested: `score = 2·|sharedTerms| + 1·|sharedTags|`; **hard drop anything scoring 0** (render fewer, never pad); tie-break on smaller |publishedAt gap|, then slug ascending; at most one sibling of the same `kind`.
- `nextLinksFor(ref)` — one upward hub fixed per kind, plus `siblings(ref, 2)`, `note` from the target's `summary`.

Do **not** use shared tags as the primary signal: `content/posts.ts:11` and `:31` share zero tags, so a deagentic-style tag rule renders empty on 100% of posts today. Term overlap is the signal doefin already computes and throws away.

Set `linkable: false` on `/for/miners` and `/for/institutions` so the graph never surfaces a pain-led page from a research or glossary page. They stay in nav.

**Step 3 — Render. One day.**
Swap `items={[...]}` for `items={nextLinksFor(ref)}` across the 27 call sites. Add a **"Where this term is used"** list to `app/glossary/[slug]/page.tsx` from `USED_BY`, capped at 5, above See also — this is the missing return leg *and* it gives each of the 19 near-identical glossary pages content unique to it, which is the actual thin-content exposure today. Swap `<Prose>` for `<AutoLinkedProse paragraphs={term.body} skip={[term.slug]} />` at `app/glossary/[slug]/page.tsx:65` — the site's own IA skill flags that line by number. Extend AutoLinkedProse to `academy/guides/[slug]`, `methodology/[metric]`, `tools/[tool]/example/[case]` and `/resources`; keep `<Prose>` on `/terms` and `/privacy`.

**Step 4 — The gate. Half a day.**
`scripts/check-links.mjs`, wired as `check:links` beside `check:seo`. Fails on: a `seeAlso` pair that is not reciprocal (5 of 35 edges are asymmetric today); any `<NextLinks` in `app/` still passing a literal array. **Warns** (does not fail, at N=25) on: any long-form piece whose `TERMS_OF` has fewer than 2 slugs; any glossary term with an empty `USED_BY`. Promote the warnings to failures at ~15 long-form pieces. Note `scripts/audit.mjs:171` — the existing "3 internal links on pages over 300 words" check — is unreachable, because `lib/site.ts` `nav` + `footerNav` put 24 anchors on every page. Either count body links only or delete it.

**Step 5 — FAQ. 20 minutes of skill edits, then a writing pass.**
First, the cheap part: add the FAQ slot to `.claude/skills/new-page/SKILL.md` and `new-term/SKILL.md` with a per-type minimum, and a coverage line to `ship-check`. Then `content/faq.ts` — one registry, `QA` promoted from a component-local type in `FAQ.tsx:3` into `content/types.ts` and re-exported from `content/index.ts`, with a `home` field naming the one page that owns each question. Add `schema?: boolean` to `FAQ.tsx` so a borrowed question renders visibly without emitting a second Question entity at a second URL.

Minimums, mapped onto doefin's routes: `/for/*` 5 · `/data/*` and `/tools/[tool]` 4 · `/glossary/[slug]`, `/academy/[slug]`, `/research/[slug]`, `/methodology/[metric]` 3 · `/blog/[slug]`, `/tools/[tool]/example/[case]` 2.

The sourcing rule that stops this becoming spam: **a question ships only if its answer already exists as a published claim on doefin.** Three legal sources — a glossary `shortDef` or body sentence, a `tool-guides.ts` `mistakes[]`/`limits[]` entry, or a `research.ts` `findings[]` line. The best available example: `content/glossary.ts:31` already contains "the timespan spans 2,015 intervals between 2,016 blocks, not 2,016. Dividing by the wrong number biases every forecast by roughly 0.05 percentage points." That is a precise, checkable, differentiating claim buried in body prose with no question attached. Ask it: *"Does the difficulty timespan divide by 2,015 intervals or 2,016 blocks?"*

Replace the templated glossary pair with `faqFor('/glossary/' + slug)` and drop the "What else is X called?" question entirely — the aliases already render at `:61`. Three hand-written questions per term is 57 answers; if that cost is not paid, cut back to the single real question and sit below the minimum rather than pad.

**Step 6 — Authors and llms.txt. Half a day plus one decision.**
`content/authors.ts` with one record: `{ slug: 'doefin-research', kind: 'organization', name: 'Doefin Research', url: '/about#doefin-research' }`. `Base.author` becomes a slug; `getAuthor()` throws on an unknown slug so a typo fails `next build`. Fix the hardcoded `name: 'Doefin Research'` literal at `app/academy/guides/[slug]/page.tsx:45`. Emit the node **once**, on `/about` (which has no JSON-LD at all today), and reference it by `@id` everywhere else — this keeps `.claude/skills/schema-markup/SKILL.md:77-78` ("Do not add types beyond the list above… Stacking `Person` per page is effort with no measured return") satisfied: one node, not one per page. Add `<author>` to `app/feed.xml/route.ts` — the cheapest fix on this list.

Then generate `/llms.txt` from `content/index.ts` at build time via `app/llms.txt/route.ts` with `export const dynamic = 'force-static'`, keeping the four prose sections and the professional-investor note verbatim, and adding a `## Glossary` section of `- [Term](url): shortDef` for all 19. The file currently names 7 URLs against a sitemap of 60+, and `.claude/skills/information-architecture/SKILL.md:232-236` already names the exact missing sections. Generating it deletes step 7 of that checklist permanently.

**Step 7 — Topics. Defer.**
Do not build a pillar taxonomy now. Five hubs on a 29-route site with two blog posts is a 15% index expansion of pages that mostly restate their members. Revisit when the corpus passes ~15 long-form pieces and at least four topics can each field four members across two content types. When you do, the only rewrite is ~20 lines of `siblings()` scoring — that is an acceptable price for not shipping five thin pages now.

**Total for steps 0-6: roughly 4-5 engineering days, plus the writing.** The writing is the critical path, not the code.

---

## 4. What is evidence-backed and what is a bet

**Evidence-backed. Do these regardless.**
- Internal link topology and crawl paths (steps 1-4). Every contextual "where to go next" link on the site currently points at one of ten hub pages already in the nav; no article, report or worked example receives a contextual inbound link from anywhere. That is a real change in graph shape, on a mechanism search engines have behaved consistently around for twenty years.
- Unique content on the 19 glossary pages. Today each is a 160-char definition, two paragraphs, an identical chip row and an identical three-hub band. That is the shape a near-duplicate assessment picks up.
- Entity clarity: one publisher name, a stable `@id`, a populated `sameAs`. The site's own `aeo-geo` skill concedes schema gives "no citation lift beyond entity clarity" — entity clarity is exactly the thing currently broken.
- The AI crawler allowlist. Already correct and ahead of deagentic; no further work.

**Plausible, unmeasured. Worth the cost because the cost is small.**
- More question-shaped chunks on more routes. A question plus a self-contained answer is the unit a retrieval system lifts. Going from 27 to ~50 across 20 routes multiplies the typed queries the corpus has a matching chunk for. No controlled evidence; a reasonable inference from how chunk retrieval works.
- `about` / `mentions` pointing at `DefinedTerm` `@id`s, derived from what `AutoLinkedProse` actually linked. Cheap once `lib/terms.ts` exists.

**Speculative. Say so out loud.**
- That `Person` schema changes what ChatGPT, Claude or Perplexity choose to quote. No public evidence. They quote passages that are self-contained, dated and numeric.
- That a semantic-triple sentence repeated across hub pages moves anything. deagentic's own theme needed a `stripos()` dedupe guard because blind repetition was a problem in practice.
- llms.txt. The site's own skill quotes the number: **97% of published llms.txt files receive no requests at all.** Generate it because it stops being wrong, not because traffic arrives.

**No confirmed consumer. Do not build.**
- `ai.txt` — a 2023 proposal no major AI vendor has confirmed reading. deagentic *mandates it in its architecture doc and has not written one line of code for it in either theme copy.*
- `knowledge.json` — no crawler looks for that filename, no standard, no registry. deagentic never built it either; it shipped `/core-concepts.md` instead, which the architecture doc never mentions. Follow the implementation, not the spec.
- FAQPage rich results — restricted to government and health sites since August 2023. The eight FAQ blocks doefin ships earn no SERP feature. Their value is retrieval only.
- HowTo rich results — deprecated outright.

The larger honest point, from doefin's own `aeo-geo/SKILL.md:87`: between 41% and 71% of AI citation surface sits off-domain. `content/types.ts:51` has an unused `datasetDoi?: string`. Minting one DOI, or shipping a free keyless API with a PyPI client, would probably outperform this entire plan. Do the on-site work because it is cheap and finite; do not mistake it for the strategy.

---

## 5. What not to copy from deagentic

1. **Recency dressed as relatedness.** `template-parts/learn-single.php:36-44` labels "three newest of the same post type" as *Related Entries*, and `functions.php:2944-2957` backfills *Related Articles* with newest-of-anything when tags don't match. On a research site read by professional investors, a block that says "related" and means "newest" is a credibility cost for zero gain. Two honest slots beat three padded ones — hence the hard score-0 drop in step 2.
2. **The brief-and-evaluator enforcement pipeline.** Copy the 6-link *rule*; put it in `scripts/check-links.mjs`. A WordPress editor can publish a deagentic pillar page with zero internal links and nothing objects.
3. **Hierarchical pillar CPTs and URL nesting.** The architecture doc says clusters are child pages of their pillar; `inc/learn-content.php:34` registers `aura_pillar` with no `hierarchical` key, and the rules skill gives the cluster URL as flat `/learn/guides/[slug]/` in the same table row. Nesting would give `/tools/*` a second parent, breaking `information-architecture` §1's "exactly one parent", and would threaten the permanently-addressable epoch URLs that skill calls "the single most durable asset on the site."
4. **Default related-entity fallbacks.** `inc/marketing-pages.php:242-246` substitutes the same three glossary links on every unedited entry. That is how a corpus manufactures near-duplicates at scale.
5. **Boilerplate schema.** `dea_solution_schema()` falls back to four identical hardcoded `HowToStep`s on every solution page. The "4-6 steps" rule is satisfied by boilerplate.
6. **The 8-question FAQ minimum.** deagentic's own seeded topic page ships three. Applied to doefin's 19 two-paragraph glossary pages it produces exactly the template-generated thin pages the `seo-onpage` skill names as a spam pattern.
7. **ICP solution pages, pillar-carries-the-CTA, and author pages as authority marketing.** All of it assumes a self-serve SaaS funnel. doefin's Terms admit professional investors only, and `.claude/skills/conversion/SKILL.md:99` records that the operating entity is not FCA-authorised — s21 FSMA shapes every surface. Any new hub carries the eligibility line, no form, no lead capture, and never becomes the forward step from an introductory academy page.
8. **`GoogleBot-Extended`.** Their doc says twice it is wrong; their theme ships it anyway. doefin's `app/robots.ts` is already correct. (Also: delete the `disallow: ['/studio']` line — that route does not exist.)

---

## 6. On author personas: don't

**Inventing an author persona on this site would be dishonest, and materially more so than on a SaaS blog.**

deagentic's rule (`seo-geo-aeo-rules/SKILL.md:382`) is "require human authorship attribution, not 'DeAgenticAI team'". Taken literally on doefin, that instruction manufactures a person who does not exist. Attaching a fabricated "Senior Quantitative Analyst" to the sentence *"Empirical adjustment volatility in the current era is 4.67 percentage points"* — on a site whose Terms admit professional investors and whose numbers a fund might size a position against — is not an SEO tactic. It is a false statement about who produced a financial estimate. Do not do it. Not with a real-sounding name, not with "reviewed by", not with a stock photo.

The honest alternative, in three parts:

**(a) Keep `Doefin Research` as an `Organization` author — but make it a real entity.** Google accepts Organization authors. Six pieces authored by one research desk is an accurate description of a one-founder operation, and it stops being a weakness the moment the organisation behind it is verifiable. That means: one legal publisher name (step 0), a stable `@id`, a populated `sameAs`, and a real bio block at `/about#doefin-research` that the `url` actually resolves to. Never emit an author node whose `url` 404s.

**(b) Put the founder's real name on exactly two pages: `/methodology/difficulty-index` and `/data/scoreboard`.** Those are the artefacts where "who computed this, and will they admit being wrong" is the entire question. A name on `/blog/reading-a-hashrate-chart-honestly` changes nothing. The test for creating a `kind: 'person'` record is all three of: a real checkable name; at least one `sameAs` URL that resolves *today*; and that person being free to publish a result that makes Doefin look wrong. Fail any one and the record stays Organization.

Two constraints on that record. Restrict `credentials` to checkable, non-performance claims — what the person built, what they published, where the code is. No returns, no AUM, no titles implying a regulated permission. And get counsel's view before flipping the record to `kind: 'person'`: a Person node with `jobTitle` and `worksFor → Doefin`, attached to research about an instrument the company sells, makes a named individual the identifiable communicator under s21 — a real question the current "Doefin Research" byline quietly avoids. Never put a Person node on `/docs/*` or `/for/institutions`.

**(c) Do not build `/authors/[slug]` yet.** deagentic's `/authors/` index renders exactly one card, and its `page-author.php` "Published Content" list depends on a `_dea_author_user_id` meta key `functions.php` never seeds — so it renders its empty state ("No published content found for the mapped user yet") out of the box. A one-entry index with a one-paragraph profile is a thin page, and thin pages on a financial-claims site cost more than the entity gains. Promote to a route when there are two or more named humans, each with three or more bylined pieces and a live external profile. Below that, an `#anchor` section on `/about` carries the identical schema at zero thin-page risk.

**And leave `reviewedBy` undefined.** Adding the field invites populating it with the same slug as `author`, which asserts an editorial check that does not happen. The comment at `components/content/NextLinks.tsx:34-36` — "One shared date, not a per-page invention: nothing here has an editorial review cycle yet, and a fabricated per-page date would be worse than an honest shared one" — is a better epistemic standard than anything in deagentic's author system. Hold to it.
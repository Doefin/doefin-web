---
name: funnel
description: The conversion funnel for doefin-web — what a funnel is in plain terms, the eight stages as they apply to this site, which routes sit at which stage, and the single ask each stage is allowed to make. Use when deciding what a page's next action should be, when adding a call to action, when a page has no next step, or when reviewing whether an app link or newsletter form belongs where it is.
---

# The funnel

Nothing here is about persuasion. It is about **matching the size of what you ask for
to how far the reader has actually come**, on a site where asking too early is a
regulatory exposure and not merely a wasted click.

## The vocabulary, defined

Assume none of these words are familiar. Each one is used with exactly this meaning
for the rest of this file.

| Term | What it means here |
|---|---|
| **Funnel** | The ordered set of steps between "a stranger lands on a page" and "a professional counterparty trades". Called a funnel because each step holds fewer people than the one before it. It is a model, not a place — no page is "the funnel". |
| **Stage** | Where one *reader* is in that sequence, inferred from what they have done on *this page*. A stage is a property of the reader, never of the design. |
| **Intent** | How much the reader has demonstrated they want a commercial answer. Reading a definition is near-zero intent. Typing your own power cost into a calculator is high intent. Intent is only ever inferred from an action taken on the page, never assumed from the topic. |
| **Ask** | A request for something the reader gives up: their **email address**, or **entry into the trading venue** at `app.doefin.com`. Those two are the only asks that exist on this site. |
| **Call to action (CTA)** | The control that carries an ask — a form, a button, a link into the app. A link to another page on doefin.com is navigation, not a CTA. |
| **Navigation** | Any internal link, CSV/JSON download, or calculator link. Costs the reader nothing. **Uncapped** — a page may have twenty. |
| **Conversion** | The ask being completed. On this site, at rung 1–3 the useful conversion is usually *a second page read*, not an email. |
| **Dead end** | A route whose reader finishes it and is offered neither an ask nor a route onward. The site has **29** `page.tsx` routes; only four carry any ask today (`/`, `/blog/[slug]`, `/research/[slug]`, `/newsletter` — the four `<Subscribe>` instances). Every dead end is a reader lost at the exact moment they were most interested. |
| **High-intent moment** | The instant a reader produces or reads a number about their own operation. There are four on this site (§4). They are the scarcest thing the site has. |
| **Lead magnet** | Something offered in exchange for an email. Here it is only ever the *convenient form* of something already free on the page — a PDF, a CSV — never a withheld finding. |
| **Gating** | Hiding content behind a form. **Forbidden everywhere.** A gated finding has zero indexable surface, which destroys the reason the page exists (see `aeo-geo`). |
| **Attention ratio** | Number of things a page asks for, divided by one. `/newsletter` is the only route that should approach 1:1. |
| **In-market** | The ~5% of a professional audience with a live buying question this quarter. The other 95% are out-of-market — the sceptical operators this site is built to earn. Designing every page for the 5% reads as a pitch to the 19 in 20 who are not. |
| **Chrome** | The header and footer, present on every route. Chrome carries the global app route. Chrome asks are not page-level asks and are not counted. |

## The one rule

> **If the page's subject is the Bitcoin network, the ask is data or an email.
> If the page's subject is Doefin's own service — or the reader has just produced a
> number on the page — the ask may be the app.**

Everything below is that sentence applied route by route.

## The eight stages

Conventional funnel vocabulary (awareness → interest → consideration → decision →
retention) is too coarse for this site, because two pages at "consideration" here
differ by whether the reader typed their own numbers. Use these rungs instead.

| Rung | Stage | The reader has… | Routes | The one ask | What breaks if you ask bigger |
|---|---|---|---|---|---|
| 0 | **Chrome** | arrived | every route | restrained header link to the venue, reading its destination. **Not what ships today**: `components/layout/Header.tsx:33-38` renders `Open app` as a `bg-brand` button — `conversion` §7 tracks it | A brand-blue button on `/glossary/[slug]` is a styled financial promotion shown to undifferentiated search traffic. PERG 8.22.3(1) treats a plain name link differently from a banner |
| 1 | **First touch** | landed cold from search or an AI citation | `/`, `/glossary`, `/glossary/[slug]`, `/academy/[slug]`, `/blog/[slug]`, `/data`, `/data/hashrate`, `/blog/tag/[tag]` | **A second page.** Newsletter *only* where a recurring deliverable exists. Glossary: **nothing** | This traffic cannot be "directed only at" investment professionals under FPO art.19. An app link here is a compliance problem before it is a conversion problem |
| 2 | **Orientation** | chosen a section, not a product | `/academy`, `/tools`, `/research`, `/blog`, `/resources` | **Route correctly** — the cards *are* the ask — then one newsletter carrying a real promise | An index page that sells instead of routing loses the click it had already earned |
| 3 | **Evaluation** | worked through a number that grades us | `/data/difficulty`, `/data/scoreboard`, `/data/difficulty/epoch/[height]`, `/research/[slug]`, `/for/miners`, `/tools/[tool]/example/[case]` | **The free artefact** — CSV/JSON, the calculator, the scoreboard — then the newsletter. **No app link** | The reader is qualifying us. Handing over data has the highest completion rate available and builds the off-domain citation surface `aeo-geo` values most |
| 4 | **Quantified problem** | produced a figure in their own numbers | `/tools/[tool]`, below the readout | **App**, unconditional, with the FPO indications in the same block, and the guide beside it | The only place an app link is *earned*: the reader produced the figure themselves. **No size gate** — owner's decision, 2026-08-31. `/for/miners` still says when hedging is not worth doing; let the reader weigh that rather than hiding the link |
| 4 | **Quantified problem, unresolved** | read a worked example but produced nothing | `/academy/guides/[slug]`, at the foot | **`OpenTool` to the calculator** (navigation), then `<Subscribe compact>`. **No app link** — see the note under the test below | A static article yields no figure, so the reader has not done the thing that earns the link on the tool page |
| 5 | **Decision** | opened a page about Doefin's own mechanics | `/docs`, `/docs/[slug]`, `/for/institutions` | **App + one human route** (`mailto` on an address in `lib/site.ts`), indications adjacent, methodology as a tertiary text link. `lib/site.ts` holds **no** address today — until it does, ship the app link alone and open a task; never invent one | Nobody reads "How settlement works" idly. These pages already describe the firm's own service, so they are already inside the perimeter. Today they end mid-air on the highest-intent reader the site gets |
| 6 | **Trust infrastructure** | come to check arithmetic | `/methodology/[metric]`, `/about`, `/terms`, `/privacy` | **None** — except `/about`, one compact `<Subscribe>` in the closing ask slot, below *Where to go next* and above the provenance footer (`ux-layout` S11) | An ask interrupting a methodology page reads as evasion and costs more than a signup is worth |
| 7 | **Retention** | already decided to hear from us | `/newsletter` | **The form, and nothing else on the page that asks for anything** | The one route where the single-CTA benchmark applies literally |

`/tools/[tool]` holds rungs 2 and 4 **on one page**: navigational above the readout,
quantified below it. That is why it asks for nothing until the answer resolves.

## The four-part earned-context test for an app link

An `app.doefin.com` link may appear on a page only if **all four** hold. Three out of
four is a fail.

1. **Subject or state.** Either the page's subject is Doefin's own service, **or** the
   reader has produced a quantified position on that page.
2. **Adjacency.** The FPO art.19(4)(a)+(b) indications — directed at persons with
   professional experience in investments; others must not act on or rely on it — plus
   the not-FCA-authorised line, sit in the **same visual block** as the link. The
   footer alone does not satisfy "accompanied by".
3. **Order.** It sits below the page's proof band. Never in the first screen.
4. **Register.** No retail wording. "Get started free", "Sign up", "Start trading",
   "Join thousands of traders" are all prohibited — FCA PS20/10 bans marketing
   crypto-derivatives to UK retail consumers, so retail-shaped copy is an exposure,
   not an A/B test candidate.

**Admits:** `/docs`, `/docs/[slug]`, `/for/institutions`, and below the readout on
on `/tools/[tool]`.
**Excludes:** all of `/data/*`, `/blog/*`, `/academy`, `/academy/[slug]`,
`/academy/guides/[slug]`, `/glossary/*`, `/research/*`, `/resources`, `/about`,
`/newsletter`, `/tools/[tool]/example/[case]`, `/for/miners`.

`/academy/guides/[slug]` is excluded because it **fails test 1**: a guide's subject is
the calculator, not Doefin's service, and a static article produces no quantified
position. Any spec handing you an app link at the foot of a guide is asking you to ship
three parts out of four. Escalate it; do not resolve it in a layout pass.

None of the three indications required by test 2 exist in the repo. What ships today —
`app/terms/page.tsx:19`, `components/layout/Footer.tsx:15`,
`app/for/institutions/page.tsx:62` — is the *not-FCA-authorised* line and
*professional investors only*, which is limb (c) alone. Limbs (a) and (b) have to come
from counsel before any app link can pass.

## Counting asks

- **Exactly one ask per page.** Navigation is uncapped and is not counted.
- **Proof before ask.** No form, app link or contact route appears above the band
  carrying the page's unique artefact — the worked example, the mechanics table, the
  figures table, the findings.
- **Two asks in one band is forbidden. Two asks in adjacent bands at different
  commitment levels is permitted** — the app link as styled primary, the newsletter
  compact beneath it. Never two primaries.
- **Exactly one `<Subscribe>` instance per page.** Not a preference:
  `components/content/Subscribe.tsx` hard-codes `id="subscribe-heading"` and
  `id="sub-email"`, so a second instance emits duplicate DOM ids and a `<label for>`
  resolving to the wrong input.
- **Full `<Subscribe>` where subscription is the page's purpose** (`/newsletter`,
  `/blog`, `/research`, `/research/[slug]`); `compact` everywhere else.

## When a newsletter ask is honest

The discriminator is **whether the page has a recurring deliverable**, not whether the
audience is qualified.

| Page | Promise it can keep |
|---|---|
| `/data/difficulty`, `/data/scoreboard` | "One email per retarget — what we forecast, what happened, and the error" |
| `/research`, `/research/[slug]` | "Every report as it publishes" |
| `/tools`, `/tools/[tool]/example/[case]` | "When these assumptions change — the difficulty constant, the fee ranges" |
| `/resources` | "Tell me when the API ships" — honest only as a statement of intent; there is no list and no sender, so it is on the same footing as the `/research` promise below |
| `/glossary`, `/glossary/[slug]`, `/docs/[slug]` | **None.** A definition does not recur. There is nothing honest to promise |

A promise the site cannot fulfil is worse than no ask, for an audience that checks
arithmetic. `/research`'s lede currently promises a dataset by email with no
fulfilment path anywhere in the repo — soften the copy or build the path.

## Placement, in order

Every page closes in this order, and the ask is second-to-last:

> unique artefact → caveat `<Callout>` → `<FAQ>` → method & `<SourceList>` →
> "Where to go next" → **the one ask** → provenance footer

**One exception:** where the action is adjacent to a computed result
(`/tools/[tool]`), that action sits immediately under `<Readout>`, and the closing
slot carries no second ask. An action that sits after the FAQ on a calculator page is
the named failure mode: the reader got their answer at the top and never scrolled.

**In-body anchor links outperform end-of-page blocks by a wide margin** (`conversion`
§3 carries the measured figures; do not restate a different number here). Put the link
to the tool at the sentence where the concept first has a cost attached — not only in a
closing band. The top-of-page control on a long page is
an **anchor** to the ask (`#get-the-pack`), never a second form.

The tool page's ask and the guide link beside it **must
render server-side at the default input state**, so one of them is always in the
served HTML. A CTA that only exists after JavaScript runs does not exist.

## Never

- Never gate a finding, figure, chart, table, CSV, definition or doc.
- Never place an app link, "Start trading" or "See live pricing" control in the body,
  rail or index of any rung-1, 2, 3 or 6 page.
- Never add "book a demo" or "talk to sales" to academy, glossary or blog. No such
  route exists, and an inducement of that kind drags s21 obligations onto an
  educational page.
- Never manufacture social proof — no download counts, no "read by 2,000 miners", no
  logo strip, no counterparty list, while there is no backend to count with.
- Never add form fields beyond email and the audience-type selector.
- Never multiply `/for/<segment>` pages. An audience page with no artefact of its own
  is a doorway page and a named spam policy (`seo-onpage`).
- Never let `<Subscribe>`'s success state assert a fact that is untrue. It currently
  reads "We have sent a confirmation link" while the handler only calls
  `setDone(true)`.
- Never build the ask before the fulfilment. `CLAUDE.md` forbids speculative backend;
  that includes an `/eligibility` self-certification gate, which stores a declaration.

## Adjacent skills — do not restate them here

| For | Read |
|---|---|
| Colour, radii, button styling, interface writing | `.claude/skills/brand/SKILL.md` |
| Anchor text, headings, internal-linking structure | `.claude/skills/seo-onpage/SKILL.md` |
| Why gating and JS-only figures cost citations | `.claude/skills/aeo-geo/SKILL.md` |
| Which JSON-LD types a page may emit | `.claude/skills/schema-markup/SKILL.md` |

## Check your work

Ask these five questions of any page you touch. Any "no" is a finding.

1. Which rung is this route on, and does its ask match that rung's row?
2. Count the asks. Is it exactly one, or a deliberate zero?
3. If there is an app link — do all four parts of the earned-context test hold?
4. Does the reader who finishes this page have somewhere to go? Name the route.
5. Is the ask below the page's proof band, and is it in the served HTML with no
   JavaScript?

Then run the `funnel-audit` agent across the whole route table.

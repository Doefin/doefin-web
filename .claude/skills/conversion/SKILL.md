---
name: conversion
description: Calls to action on doefin.com — which ask belongs on which route, where it sits, how many are allowed, and how it is worded. Carries the conversion ladder for all 29 routes, the rule for choosing between an app link and the newsletter, and the UK s21 FSMA / professional-investor boundary that governs every ask. Load before writing, placing, moving or reviewing any CTA, subscribe form, app link or "next step" band.
---

# Conversion — the ask

This site publishes free evidence to operators who check arithmetic, for a venue whose own
Terms exclude retail. That makes an ask a **compliance object before it is a growth lever**:
a CTA that would sweep in retail traffic is not an experiment, it is an exposure under s21
FSMA and FCA PS20/10.

This skill decides four things — **which** ask, **where**, **how many**, **in what words**.
Layout, colour, headings, schema and internal-link mechanics live in `brand`, `seo-onpage`,
`aeo-geo` and `schema-markup`. Cross-reference them; do not restate them.

---

## 1 · The rule for choosing

> **If the page's subject is the Bitcoin network, the ask is data or an email.
> If the page's subject is Doefin's own service — or the reader has just produced a number
> on the page — the ask may be the app.**

**An ask is a request for something the reader gives up**: an email address, or entry into
the venue. An internal link, a CSV/JSON link and a calculator link are navigation and are
uncapped. That is what "one ask per page" counts.

**Proof before ask.** No form, app link or contact route renders above the band carrying the
page's own artefact — the worked example, the figures table, the mechanics table, the
findings. Roughly 44% of AI citations are drawn from the first third of a document
(`aeo-geo`); a form there trades the reason the page exists for a marginal signup.

**Newsletter only where a recurring deliverable exists.** A metric page is about a scheduled
recurring event, so "one email per retarget" is a promise the site can keep. A definition
does not recur, so there is nothing honest to promise — which is why the glossary takes no
ask at all. Never promise a deliverable with no fulfilment path in the repo (there is no
PDF or CSV fulfilment today; see §7).

---

## 2 · The ladder — the ask for every route

Slot **S11** is the closing ask, after "Where to go next" and before the provenance footer.
`none` is a valid, deliberate answer and appears on seven: `/glossary`,
`/glossary/[slug]`, `/blog/tag/[tag]`, `/methodology/[metric]`, `/terms`, `/privacy`
and `not-found`.

| Rung · stage | Routes | S11 ask | App link |
|---|---|---|---|
| 0 · chrome | every page | Restrained header link reading its destination + footer eligibility line. Not a page-level ask | site-wide, once |
| 1 · first touch, undifferentiated | `/glossary`, `/glossary/[slug]` | **none** — the two free links (`/data/difficulty`, `/methodology/…`) sit mid-page and are navigation | no |
| 1 | `/academy/[slug]`, `/blog/[slug]`, `/`, `/data`, `/data/hashrate` | `<Subscribe compact>` with the recurring promise | no |
| 1 | `/blog/tag/[tag]` | **none** — a one-post taxonomy listing has nothing to promise, and `information-architecture` §6 keeps it out of the index until it holds three posts | no |
| 2 · orientation | `/academy`, `/tools`, `/resources` | route first via the cards, then `<Subscribe compact>` with a real promise | no |
| 2 | `/blog`, `/research` | `<Subscribe>` **full** — subscription is the index's purpose | no |
| 3 · evaluation | `/data/difficulty`, `/data/scoreboard`, `/data/difficulty/epoch/[height]`, `/for/miners`, `/tools/[tool]/example/[case]` | the **free artefact** (CSV/JSON, the calculator, the scoreboard), then `<Subscribe compact>` | **no** |
| 3 | `/research/[slug]` | `<Subscribe>` **full**, in the pack band, with an itemised manifest | no |
| 4 · quantified problem | `/tools/[tool]` (under the readout) | **app** — the reader produced the figure, which is what earns it. The guide beside it, newsletter in the band beneath | unconditional |
| 4 | `/academy/guides/[slug]` (foot) | the `OpenTool` block to the calculator — navigation, not an ask — then `<Subscribe compact>` | **no** (see §4.1) |
| 5 · decision | `/docs`, `/docs/[slug]`, `/for/institutions` | **app + one human route** (`mailto`), methodology as a tertiary text link | yes |
| 6 · trust infrastructure | `/methodology/[metric]`, `/terms`, `/privacy`, 404 | **none** | no |
| 6 | `/about` | one `<Subscribe compact>` at **S11** — below *Where to go next*, above the provenance footer. "Last element" would displace S12 and break the spine | no |
| 7 · retention | `/newsletter` | the form, and nothing else on the page that asks for anything | no |

Three adjudications to know, because a spec you may be handed says otherwise:

- **`/` takes the compact form, not the full one.** Full form is reserved for the four routes
  where subscription is the page's purpose: `/newsletter`, `/blog`, `/research`,
  `/research/[slug]`.
- **`/data/difficulty` and `/data/scoreboard` carry no app sentence.** They are engineered to
  rank for undifferentiated public queries, so the subject is the network and the reader has
  produced nothing — test 1 in §4 fails.
- **`/academy/guides/[slug]` takes no app link either**, for the same reason: a static
  article's subject is the calculator, not Doefin's service, and it produces no figure.
  The reader who wants the app reaches it through the tool page, where the readout
  exists. Any spec putting an app link at the foot of a guide is asking for three parts
  out of four.

---

## 3 · Placement and frequency

| Rule | What breaks if ignored |
|---|---|
| **Exactly one `<Subscribe>` per page** | `components/content/Subscribe.tsx:42,68` hard-codes `id="subscribe-heading"` and `id="sub-email"`. A second instance emits duplicate DOM ids and a `<label for>` bound to the wrong input |
| **One ask per page**, at S11 | Single-ask pages convert at 13.5% against 10.5% for three or more; more importantly a second ask on an open page is a second promotion |
| **`/tools/[tool]` is the one exception**: the ask sits immediately under `<Readout>`, and the closing slot then carries **no** second ask | The named calculator failure mode — the visitor got the answer at the top and never scrolls past the FAQ to find an ask |
| **Two asks in one band is forbidden; two adjacent bands at different commitment levels is permitted** — app link as styled primary, `<Subscribe compact>` beneath. Never two primaries | Two equal buttons make the reader choose instead of act, and an app CTA competing with a form reads as a pitch |
| **Repeating the same ask once on a long page is repetition, not a second ask** | `/for/institutions` needs the rail ask and the foot ask; that is one ask shown twice, and `ux-layout` §8 lists it as the one sanctioned break of the one-ask-at-S11 rule. The rail instance reflows below the body under `lg`, so the foot instance is the one that must exist |
| **In-body anchor links to a free tool or dataset are uncapped and never styled as buttons** | In-body anchor text carried 47–93% of leads in HubSpot's study against ~6% for end-of-post banners — but a styled banner is a different regulatory object (§4) |
| **Both branches of a conditional ask render server-side at the default input state** | A branch that only exists after JavaScript runs is invisible to crawlers, and one of the two must always be in the HTML |
| **The app link never appears in the first screen** | Order is one of the four conditions in §4 |

---

## 4 · The compliance boundary

Predexyo UK Ltd is **not FCA-authorised** (`app/terms/page.tsx`). Under s21 FSMA an
invitation or inducement to engage in investment activity is restricted unless the
communicator is authorised, approved by an authorised person, or exempt. The exemption the
site relies on — FPO 2005 art.19 (investment professionals), art.49 (high-net-worth
companies) — works by **who the communication is directed at**, not by what a footer says.
FCA PS20/10 additionally bans marketing crypto-derivatives to UK retail consumers.

*Structural, not drafted. Counsel writes the sentences; this skill guarantees the slot exists
and names the limbs.*

### 4.1 The earned-context test — all four, or no app link

1. **Subject or state.** Either the page's subject is Doefin's own service, **or** the reader
   has produced a quantified position on that page.
2. **Adjacency.** Three limbs sit in the **same visual block** as the link, never the footer
   alone: (a) directed at persons with professional experience in investments; (b) persons
   without it must not act on or rely on it; (c) Predexyo UK Ltd is not authorised by the
   FCA. FPO art.19(4)(a)–(b) requires the indication to accompany the invitation.
3. **Order.** It sits below the page's proof band, never in the first screen.
4. **Register.** Non-retail wording only (§5).

**Admits:** `/docs`, `/docs/[slug]`, `/for/institutions`, and below the readout on
`/tools/[tool]`. Those are exactly the surfaces §4.3 gives a qualifying step to.
**Excludes:** everything else — all of `/data/*`, `/blog/*`, `/academy`, `/academy/[slug]`,
`/academy/guides/[slug]`, `/glossary/*`, `/research/*`, `/resources`, `/about`,
`/newsletter`, `/blog/tag/[tag]`, `/tools/[tool]/example/[case]`, `/for/miners`.

**None of the three limbs exists in the repo yet.** What ships today at
`app/terms/page.tsx:19`, `app/privacy/page.tsx:19`, `components/layout/Footer.tsx:15`,
`app/about/page.tsx:37` and `app/for/institutions/page.tsx:62` is one sentence —
*Predexyo UK Ltd is not authorised by the Financial Conduct Authority; Doefin is made
available to professional investors only.* That is limb (c). Limbs (a) and (b) — directed
at, and must not act or rely on — appear nowhere. Until counsel supplies them, **no app
link can pass test 2**, and the correct output is an open item, not drafted wording.

### 4.2 The shape of the link matters

PERG 8.22.3(1) distinguishes a hyperlink that is merely the name of its destination from
"more sophisticated links, such as banners or changeable text". A restrained text link
reading `app.doefin.com` is a materially different object from a brand-blue button.

- Content pages that admit an app link use the **restrained text link** or an informational
  sentence.
- The styled `<Button variant="primary" external>` is reserved for `/for/institutions`,
  `/docs`, `/docs/[slug]` and below the tool readout — and only with the three
  limbs in the same block.
- The **header** carries one global route, as a restrained link reading its destination. It
  renders on `/glossary/[slug]` and `/blog/[slug]` too, which is why every page carries the
  eligibility indication in spine slot S5 — that is where "accompanied by" is actually met.

### 4.3 Where a qualification step is required

There is no self-certification gate, and **do not build one** — it is authentication-shaped
and stores a declaration, which `CLAUDE.md` forbids building speculatively. `/eligibility` is
the target state once there is a backend; it is an open product decision, not a layout one.

Until then, the qualification step is one of exactly two things:

| Surface | The qualifying step |
|---|---|
| `/tools/[tool]` | The reader having produced a figure at all. The link sits below the readout, never above it. **No size gate** — owner's decision, 2026-08-31 |
| `/docs/*`, `/for/institutions` | The page's subject already is Doefin's own service, so it is inside the perimeter. The three limbs adjacent to the link are the whole of it |

Condition (c) of art.19(4) — systems preventing other recipients engaging — is enforced at
the app boundary, not by this site. **The site must never imply access is open.**

### 4.4 Consent, fields and the form

- **No form fields beyond email and the audience-type selector.** No company, job title,
  phone or "how did you hear about us".
- The audience taxonomy drops the catch-all. Keep classes that can qualify: mining operator /
  fund or trading desk / other professional counterparty. `Something else` maps to nobody the
  venue can transact with.
- The professional-investor line sits **above** the submit control, not below it.
- A privacy-notice link and a consent line ship before any provider is connected, and "we may
  show you other publications we recommend" moves behind its own optional, **unticked**
  preference — bundling third-party financial promotions into one consent is a problem under
  both PECR and s21.

---

## 5 · Wording

| Rule | Check |
|---|---|
| A button label names its destination and what arrives, in **six words or fewer**; a text link may be a full clause | "Open Doefin", "Send me the PDF and dataset", "Size your own exposure" |
| Sentence case, no exclamation marks, no superlatives | `brand` — "Writing in the interface" |
| The newsletter ask states **cadence and deliverable** | "One email per retarget — what we forecast, what happened, and the error" |
| The app ask is informational or names its destination | "Difficulty is not yours to control — price cover for it at app.doefin.com" |
| Never overstate certainty; a forecast in CTA copy carries its interval | `brand` |
| Never promise what the repo cannot deliver | §7 |

**Banned outright** — retail register, and PS20/10 makes them an exposure rather than a test
candidate: *Get started free · Sign up · Start trading · See live pricing · Join thousands of
traders · Unlock · Claim your · Book a demo · Talk to sales · Request access · Learn more ·
Click here*.

"Book a demo" and "talk to sales" are banned additionally because **no such route exists**,
and an inducement of that kind drags s21 obligations onto an educational page.

---

## 6 · Anti-patterns

**Manufactured urgency.** The next retarget is a computable public fact, not a deadline. No
countdown framed as an offer expiry, no "before block 913,248", no "closing soon", no
"limited places". There is no capacity constraint to be scarce about, and this audience
checks.

**Dark patterns.** No exit-intent modal, scroll-triggered overlay, sticky bottom bar or
interstitial — they are also client JavaScript on pages that must stay server-rendered. No
confirmshaming decline copy. No pre-ticked or bundled consent. No unsubscribe that takes
more than one click.

**An ask on a page whose reader has no intent yet.** A glossary lookup, the top of an academy
article, anything above a tool's readout, a methodology page. `none` is the correct answer
there, and refusing to invent an ask is what keeps those pages quotable. A reader on
`/methodology/[metric]` is checking arithmetic; an ask interrupting that reads as evasion.

**Gating.** Never gate, blur, truncate or paginate-behind-a-form a finding, figure, chart,
table, CSV, definition or doc. Zero indexable surface, always (`aeo-geo`). The email buys the
convenient form of an artefact that is described, never a withheld sentence.

**Manufactured social proof.** No download counts, no "read by 2,000 miners", no logo strip,
no counterparty list, no reader counter — there is no backend to count with, and naming
counterparties of a professional-only venue creates its own problems.

**Contradicting the site's own advice to catch a lead.** `/for/miners` tells sub-scale
operators not to hedge. An app CTA on a scenario that page disowns is a credibility problem
and a promotions problem at once.

**A doorway ask.** Never add `/for/<segment>` pages that differ only in who the reader is
addressed as. An audience page without an artefact of its own is a named spam policy.

---

## 7 · Known defects in the current CTA surface

Flag these when you touch a page that has one; do not paper over them with new copy.

| Defect | File |
|---|---|
| Success state asserts "We have sent a confirmation link" while the handler only calls `setDone(true)` — an untrue statement shipping on four templates | `components/content/Subscribe.tsx:51`, `:60` |
| `Something else` in the audience taxonomy; professional-investor line below the submit; bundled third-party-recommendations consent; no privacy link | `components/content/Subscribe.tsx` |
| `/research` lede and `/research/[slug]` form promise a PDF and dataset with no fulfilment path anywhere in the repo | `app/research/page.tsx`, `app/research/[slug]/page.tsx` |
| No contact route exists, so rung 5 has no human option. `/contact` with a `mailto` on an address in `lib/site.ts` is the fix — **do not invent an address**; if none exists, ship the app link alone and open a task | `lib/site.ts` |
| Header app link is a `bg-brand` button reading `Open app`, which is the object that carries promotion risk under PERG 8.22.3(1) | `components/layout/Header.tsx:33-38` |
| 25 of the 29 routes have no ask at all — the only four `<Subscribe>` instances are on `/`, `/blog/[slug]`, `/research/[slug]` and `/newsletter` | see the ladder, §2 |
| Limbs (a) and (b) of the FPO indication are not written anywhere in the repo, so §4.1 test 2 cannot currently be satisfied | counsel — §4.1 |

---

## 8 · Check your work

```bash
# more than one Subscribe on a page
grep -rc "<Subscribe" app --include=page.tsx | grep -v ":0$" | grep -v ":1$"

# every app link, and whether it is on a route the ladder admits
grep -rn "appUrl\|app\.doefin\.com" app components

# retail register and urgency — the canonical list; `cta-writer` runs this same line.
# Keep the word boundaries: without them "unlimited curtailment" in content/tools.ts
# fires. One known false positive survives — the word "signup" in a comment at
# components/content/Subscribe.tsx:6. That is not a finding.
grep -rniE "\b(get started|sign ?up|start trading|see live pricing|join thousands|unlock|claim your|book a demo|talk to sales|request access|learn more|click here|limited|hurry|act now|don.t miss|spots? left)\b" app components content

npm run build && npm run check:crawlable   # both branches of a conditional ask must be in the HTML
```

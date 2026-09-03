---
name: aeo-geo
description: Getting cited by AI assistants — answer engine and generative engine optimization for doefin-web. Covers what makes content quotable by ChatGPT, Claude, Perplexity and Google's AI answers, and the off-domain half that on-page work cannot reach. Use when writing content meant to be cited, or when asked how to appear in AI answers.
---

# Getting cited by AI assistants

Two terms for the same problem, used interchangeably in the industry:

- **AEO** — answer engine optimization. Being the source an assistant quotes when
  someone asks a question.
- **GEO** — generative engine optimization. The same thing, framed around generative
  models.

It overlaps with SEO but is not the same discipline, and this site is built for it
deliberately — because most competitors in Bitcoin mining data are invisible to
assistants, and that is an opening.

## Why competitors are invisible

Their numbers live inside interactive dashboards. **AI crawlers do not execute
JavaScript**, so a figure that appears after a chart library renders does not exist to
them. Across roughly 25,000 categorised AI citations, no analyst found tool pages
frequent enough to name as a category at all.

Meanwhile a plain page with the number written as text gets quoted.

## What makes a page quotable

**1 · The answer is in the first two sentences.**
Roughly 44% of AI citations come from the first third of a document. An assistant
retrieving a fragment takes what is near the top.

**2 · Paragraphs stand alone.**
Retrieval works on chunks, not documents. A paragraph beginning "This means that…"
gets quoted without the sentence it depends on, and misrepresents you.

**3 · Figures carry their date and units inline.**
`127.48 T at block 962,305, 14 August 2026` survives being lifted out of context.
`the current figure` does not.

**4 · Definitions are short, self-contained and factual.**
Glossary short definitions are the most-quoted content on a site like this. Under 160
characters, no product language, no forward references to undefined terms.

**5 · Tables are HTML.**
A `<table>` with a real header row is parseable. A screenshot of a table is not.

**6 · The page states its own method.**
Assistants and the people checking them prefer sources that say how a number was
produced. A linked, versioned methodology page raises the odds of being cited over a
bare figure.

**7 · Explicit question-and-answer sections.**
Assistants answer questions. A page that states the question a person actually types
— *"When is the next Bitcoin difficulty adjustment?"* — and answers it in one
self-contained paragraph is directly retrievable as an answer. Use the `<FAQ>`
component, which renders the visible section and the `FAQPage` schema together.

⚠️ The questions must be **visible on the page**. Schema describing content a visitor
cannot see is a spam signal and can earn a manual penalty. `npm run check:seo`
enforces this.

**8 · Dated, permanent URLs.**
One fact per URL that never changes. A self-overwriting page accumulates no citation
surface; 26 dated epoch pages a year accumulate a corpus. This is the single most
durable asset on the site.

## Structured data helps entity clarity, not ranking

Add `Organization`, `Article`, `BreadcrumbList`, `Dataset` and `DefinedTerm` — and
then stop. The only controlled experiment on schema (1,885 treated pages against 4,000
controls) found no citation lift beyond entity clarity. Cap the total effort at a day.

`DefinedTerm` on glossary pages is the highest-value of these, because definitions get
quoted disproportionately.

## llms.txt — thirty minutes, then stop

A plain-text summary at `/llms.txt` describing the site for language models. **97% of
published llms.txt files receive no requests at all.** Its one genuine audience is
coding agents that do fetch it. Write it once, keep it current, spend no more time.

## The off-domain half, which is larger

**Between 41% and 71% of AI citation surface sits off your own domain.** On-page work
has a ceiling. What actually moves it:

- **A free, keyless data API with reference client libraries** published to PyPI and
  npm. Every install is a durable public mention, and free APIs generate orders of
  magnitude more public code references than gated ones.
- **Other people's bylines.** Named analysts running your numbers and publishing under
  their own names. Only works if they are free to publish an unflattering result.
- **Forums.** Among the most-quoted sources on the internet. The way in is being the
  answer someone else gives in an existing thread — never posting about yourself.
- **A named metric used identically everywhere** — page, chart axis, API field,
  README. Otherwise unlinked mentions are unattributable.
- **A citable dataset with a DOI.** Days of work, compounding across academia,
  journalists and assistants at once.

## What does not work

- Writing for keywords. Assistants model meaning.
- Gating the findings. A gated finding produces zero indexable surface, destroying the
  reason the page exists to marginally improve a signup rate.
- Anything behind a login. Zero citation surface, always.
- Claiming certainty the data does not support. It gets checked.

## How to measure it

There is no console for this. Use:

- **Ask the assistants directly.** Query ChatGPT, Claude and Perplexity with the
  questions your audience asks, and see who gets cited. Do it monthly, same questions.
- **Bing Webmaster Tools** — Bing is the index under ChatGPT's web search.
- **Referrer traffic from assistant domains** in analytics.
- **GitHub code search** for your API endpoints.
- **Trade press quoting your named metric.**

Not pageviews. The measure is *who cites you*, by name.

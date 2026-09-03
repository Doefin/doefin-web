---
name: audit-site
description: Run the local GEO/AEO/SEO auditor against any URL — the dev server, a preview deploy, the live site, or a competitor. Fetches pages the way an AI crawler does, with no JavaScript, and reports what actually reaches them. Use to check work before shipping, to verify a deploy, or to benchmark a competitor.
---

# Auditing a site

```
npm run audit -- <url> [--sitemap] [--max N] [--json] [--agent NAME]
```

It fetches over plain HTTP and **never executes JavaScript**, which is the whole
point: what it measures is what GPTBot, ClaudeBot and PerplexityBot actually receive.

## Common uses

```bash
# One page of the dev server
npm run dev
npm run audit -- http://localhost:3000

# The whole site, from its sitemap. Production URLs are rewritten to the target
# origin, so this audits localhost rather than the live site.
npm run build && npx next start -p 3111 &
npm run audit -- http://localhost:3111 --sitemap --max 20

# The live site
npm run audit -- https://doefin.com --sitemap

# A competitor — the most valuable use
npm run audit -- https://a-competitor.com

# Machine-readable, for an agent to reason over
npm run audit -- https://doefin.com --sitemap --json > /tmp/audit.json

# As a different crawler
npm run audit -- https://doefin.com --agent ClaudeBot
```

Exit code is non-zero if anything is **blocking**, so it works in CI.

## Reading the output

**Site-level** findings come first: robots.txt, sitemap, llms.txt, and the
browser-versus-crawler word delta. A large delta is the clearest possible proof that
content is rendered client-side and invisible.

**Per page**: word count reaching a crawler, the schema types found, then findings by
severity.

| Level | Meaning |
|---|---|
| **BLOCKING** | The page cannot be found or cited at all. Fix before anything else. |
| **HIGH** | Real ranking or citation cost |
| **MEDIUM** | Worth fixing |
| **LOW** | Polish |

## The checks it runs

- Words of prose reaching a crawler — under 100 means client-rendered
- Browser-versus-crawler delta on the same URL
- Title present, length, duplicates across the crawl
- Meta description, canonical, single `<h1>`, heading levels not skipped
- Structured data: types present, JSON valid
- **FAQ questions in the markup that are not visible on the page** — a spam signal
- A figure in the opening fifth of the page
- Charts present with no HTML table beside them
- Image `alt` coverage, internal link count, HTML weight
- robots.txt naming each AI crawler, and not disallowing them
- sitemap present, and whether `lastmod` churns on every deploy

Listing pages are detected by link density rather than by URL, so a short index page
is not flagged as thin content.

## What it cannot tell you

It reads markup, not meaning. It cannot judge whether the writing is good, whether the
opening actually answers the question, or whether a paragraph survives being quoted
out of context. **Use the `geo-auditor` agent for that** — it runs this tool and then
reads the pages.

It also cannot tell you whether assistants actually cite you. That needs the monthly
manual check in `docs/seo-tooling.md`.

## Benchmarking a competitor

The most valuable use, and it takes seconds. Run it against a rival and compare word
counts reaching a crawler.

A dashboard-heavy site typically returns very little to a crawler — the numbers exist
only after JavaScript runs. That is the opening this site is built to exploit, and this
is how you verify it is still open.

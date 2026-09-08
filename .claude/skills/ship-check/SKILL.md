---
name: ship-check
description: Pre-merge verification for doefin-web — typecheck, build, crawlability guard, and the manual checks that automation cannot cover. Run before merging anything to main or before a deploy.
---

# Ship check

## Automated

```
npm run typecheck
npm run build
npm run check:crawlable
npm run check:seo
npm run check:tools
npm run check:links
```

All six must pass. The crawlability guard fails a page that returns fewer than 120
words to a crawler, or is missing an `<h1>`, `<title>` or canonical link.

## Read the build output

Every route should be marked **○ (Static)** or **● (SSG)**. If a route shows as
dynamic (`ƒ`), something pulled in a request-time API — usually `draftMode()`,
`cookies()` or `headers()`. Find it and remove it. Nothing on this site should render
per request.

## Manual, because automation cannot see it

- **Every page that answers a typed question has an FAQ block**, at or above the
  minimum in `new-page` step 7. A page that plainly answers a question and carries no
  FAQ is the most common gap on this site, and no script can judge whether a page is
  question-shaped.
- **Every FAQ answer traces to a published claim** — a glossary definition, a guide's
  mistakes or limits, or a report finding. An answer invented to fill the block is
  worse than a shorter block.
- **Placeholder figures carry the badge.** Any number sourced from
  `content/sample-data.ts` renders `<IllustrativeBadge>` beside it.
- **Every chart has its numbers as text nearby**, in a `<DataTable>` or in prose.
- **No arbitrary hex values** — `grep -rn "#[0-9a-fA-F]\{6\}" components app` should
  return nothing outside `tailwind.config.ts`.
- **The wordmark sits on a dark ground** wherever it appears.
- **Data page titles carry the number and block height.**
- **New routes are in `app/sitemap.ts`.**

## Before a production deploy

- `app/layout.tsx` is still a server component with no `"use client"`.
- `lib/site.ts` `sameAs` is populated if the X and LinkedIn accounts now exist —
  it is how search engines confirm the company is real.
- Non-production branches are password-protected and `noindex`.

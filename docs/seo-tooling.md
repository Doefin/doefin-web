# External tools for SEO, AEO and GEO

Checked August 2026. Pricing and products in the AI-visibility category change fast —
verify before paying for anything.

**The short version:** set up the four free accounts below now, install two browser
extensions, and buy nothing else until the site has been publishing for a few months.
Most paid tools measure traffic and citations you do not have yet.

---

## 1 · Free accounts — set these up now

These need **history** to be useful, so registering early matters even with no traffic.

| Tool | What it tells you | Cost |
|---|---|---|
| **Google Search Console** | Which queries you appear for, what ranks, indexing errors, which pages Google refuses to index and why. The single most useful tool in this list. | Free |
| **Bing Webmaster Tools** | Same for Bing — and **Bing is the index underneath ChatGPT's web search**, so it matters far more than its market share suggests. Also has a free site audit. | Free |
| **Google PageSpeed Insights** | Core Web Vitals and real-user performance data. | Free |
| **Cloudflare Radar / server logs** | Which AI crawlers actually visited. Amplify's CDN gives you no access logs, so if crawler visits matter later, that is a reason to front the site with something that does. | Free |

**Do this first:** verify both Search Console and Bing Webmaster Tools, and submit
`https://doefin.com/sitemap.xml` to each.

---

## 2 · Browser extensions — for spot-checking a page

Keep it to two or three. More than five active extensions noticeably slows the browser.

| Extension | Why |
|---|---|
| **Detailed SEO Extension** | The one genuinely must-have free extension. Shows title, description, canonical, headings and schema for the page you are on, with no account. |
| **SEO Pro Extension** | Broader: metadata, HTTP status, redirect chains, schema, internal and nofollow links in one panel. Good for checking a page before publishing. |
| **SEO Schema Visualizer** | Renders the page's JSON-LD as a readable graph rather than raw JSON. Useful when checking whether entities connect properly. |
| *Wappalyzer* | Shows what a site is built with. Not an SEO tool — useful for looking at competitors. |

---

## 3 · Schema validation

| Tool | Use |
|---|---|
| **Google Rich Results Test** | The authoritative check on whether Google can parse your structured data. Paste a URL or the raw HTML. |
| **Schema.org Validator** | Stricter and vendor-neutral. Catches structural problems Google's tool tolerates. |

⚠️ Paste **the built HTML** (`.next/server/app/**.html`), not the source — that is what
a crawler receives.

`npm run check:seo` already validates JSON syntax and that FAQ questions are visible on
the page. These tools validate the semantics on top of that.

---

## 4 · Crawlers — for whole-site audits

| Tool | Notes |
|---|---|
| **Screaming Frog SEO Spider** | The industry standard. **Free up to 500 URLs**, which covers this entire site with room to spare. Finds broken links, redirect chains, duplicate titles, orphan pages, missing metadata. Run it monthly. |
| **Sitebulb** | More opinionated than Screaming Frog — explains *why* something is a problem rather than listing it. Paid, worth it only once the site is much larger. |
| **Lighthouse CI** | Runs Lighthouse in your pipeline and fails the build on a regression. Worth adding once the site is live. |

**Screaming Frog free is the single best-value thing on this page.** Point it at the
preview URL and it will find things no per-page extension can.

---

## 5 · AI visibility tracking — the new category

These monitor whether ChatGPT, Claude, Perplexity, Gemini and Google's AI answers
mention or cite you, by running your target questions repeatedly and recording what
comes back.

| Tool | From | Notes |
|---|---|---|
| **Otterly.ai** | ~$29/month | Cheapest credible entry. Tracks the major AI search engines across many countries. |
| **Scrunch** | Mid-market | Tracks every major platform including Meta AI. |
| **Profound** | Enterprise, custom | Positions as a data layer rather than a dashboard. Overkill here. |
| **Ahrefs Brand Radar** | ~$828/month all-in | Only makes sense if you were buying Ahrefs anyway. |

⚠️ **This category is young and crowded.** Products appear and disappear. Do not sign
an annual contract.

### Do this manually first — it is free and it is what they automate

Once a month, ask each assistant the questions your audience asks, and record who gets
cited:

- *"What is the next Bitcoin difficulty adjustment?"*
- *"How accurate are Bitcoin difficulty forecasts?"*
- *"What is hashprice?"*
- *"How do Bitcoin miners hedge difficulty risk?"*
- *"How do I calculate my mining difficulty exposure?"*

Keep the same list and the same wording each time so the results are comparable. Log
the date, the assistant, and which sources it named.

**Buy a tool when this takes more than an hour a month, not before.** With nothing
published yet, a paid tracker would measure zero for months.

---

## 6 · What not to buy yet

- **Ahrefs, Semrush, Moz** — $100–200/month for keyword and backlink data. Genuinely
  good, and premature: they help you compete for traffic you are not yet competing
  for. Revisit once you are publishing weekly and ranking for something.
- **Any AI-visibility tool**, until the manual check above becomes tedious.
- **Rank trackers.** Search Console tells you your actual positions for free.

---

## 7 · What you already have — start here

**`npm run audit -- <url>`** is the first thing to reach for. It fetches pages the way
an AI crawler does, with no JavaScript, against the dev server, a preview, the live
site, or a competitor. It is faster than any extension and it answers the only question
that matters first: how much of this page actually reaches an assistant?

Two real results from it:

- **`www.doefin.com` returns 0 words to GPTBot**, with no title, no robots.txt and no
  sitemap — confirming the finding from the August research, live.
- **elektronics.dev returns 143 words** with no structured data, while **CoinWarz
  returns 3,046 words** server-rendered but publishes no schema at all. Two different
  openings, found in under a minute.

See `.claude/skills/audit-site/SKILL.md`, and the `geo-auditor` agent, which runs it
and then reads the pages to judge what markup checks cannot.

## Also already built

Do not overlook these before buying anything:

| | |
|---|---|
| `npm run check:seo` | Titles, descriptions, canonicals, single h1, prose volume, JSON-LD validity, and that FAQ questions appear on the page. Runs over every built page. |
| `npm run check:crawlable` | Fails if a page would return an empty body to a crawler. |
| **`seo-audit` agent** | Builds the site, runs the checks, then judges the things automation cannot — answer-first openings, orphan pages, schema honesty, title quality. |
| **The four skills** in `.claude/skills/` | `seo-onpage`, `seo-technical`, `aeo-geo`, `schema-markup`. |

You also have a set of `geo-*` skills available globally in Claude Code — `geo-audit`,
`geo-citability`, `geo-crawlers`, `geo-llmstxt`, `geo-brand-mentions` — which cover
much of what the paid AI-visibility tools sell.

---

## The order to actually do this in

1. **Now:** verify Search Console and Bing Webmaster Tools, submit the sitemap.
2. **Now:** install Detailed SEO Extension.
3. **Before launch:** run Screaming Frog (free tier) against the preview URL.
4. **Before launch:** paste two or three built pages into the Rich Results Test.
5. **Monthly from launch:** the manual assistant check in section 5, same questions
   each time.
6. **After three months of publishing:** reconsider a paid AI-visibility tool, and only
   then a keyword tool.

*Sources: [Otterly's comparison of AI search monitoring tools](https://otterly.ai/blog/best-ai-search-monitoring-and-llm-monitoring-solutions/) ·
[SE Ranking on AI visibility tools](https://visible.seranking.com/blog/best-ai-visibility-tools/) ·
[SEOTesting on free SEO extensions](https://seotesting.com/blog/seo-browser-extensions/)*

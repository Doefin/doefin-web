#!/usr/bin/env node
/**
 * GEO / AEO / SEO auditor.
 *
 * Fetches pages the way an AI crawler does — plain HTTP, no JavaScript execution —
 * and reports what actually reaches them. Works against a local dev/preview server
 * or any public site, so it doubles as a competitor benchmark.
 *
 *   node scripts/audit.mjs http://localhost:3000
 *   node scripts/audit.mjs https://doefin.com --sitemap
 *   node scripts/audit.mjs https://a-competitor.com --json > report.json
 *
 * Flags
 *   --sitemap        crawl every URL in /sitemap.xml (capped by --max)
 *   --max N          page cap when crawling      (default 25)
 *   --json           machine-readable output, for an agent to reason over
 *   --agent NAME     override the crawler user agent
 */

const UA = {
  GPTBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.1; +https://openai.com/gptbot',
  ClaudeBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com',
  PerplexityBot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot',
  Googlebot: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Googlebot/2.1; +http://www.google.com/bot.html',
  Browser: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36',
}

const args = process.argv.slice(2)
const base = args.find((a) => a.startsWith('http'))
if (!base) {
  console.error('usage: node scripts/audit.mjs <url> [--sitemap] [--max N] [--json]')
  process.exit(2)
}
const flag = (n) => args.includes(`--${n}`)
const val = (n, d) => { const i = args.indexOf(`--${n}`); return i > -1 ? args[i + 1] : d }
const AS_JSON = flag('json')
const MAX = Number(val('max', 25))
const AGENT = val('agent', 'GPTBot')

/* ── fetch helpers ─────────────────────────────────────────────────────── */

async function grab(url, agent = AGENT) {
  const t0 = Date.now()
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': UA[agent] ?? agent, accept: 'text/html,*/*' },
      redirect: 'follow',
    })
    const body = await res.text()
    return { ok: true, status: res.status, url: res.url, body, ms: Date.now() - t0, bytes: body.length }
  } catch (e) {
    return { ok: false, status: 0, url, body: '', ms: Date.now() - t0, bytes: 0, error: String(e.message ?? e) }
  }
}

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
   .replace(/<style[\s\S]*?<\/style>/gi, ' ')
   .replace(/<[^>]+>/g, ' ')
   .replace(/&nbsp;/g, ' ')
   .replace(/\s+/g, ' ')
   .trim()

const cap = (h, re) => (h.match(re) ?? [])[1]?.trim()
const all = (h, re) => [...h.matchAll(re)]

/* ── per-page analysis ─────────────────────────────────────────────────── */

function analyse(url, r) {
  const h = r.body
  const text = strip(h)
  const words = text ? text.split(' ').length : 0
  const findings = []
  const F = (level, code, msg, fix) => findings.push({ level, code, msg, fix })

  if (!r.ok || r.status >= 400) {
    F('blocking', 'http', `HTTP ${r.status || 'no response'}${r.error ? ` — ${r.error}` : ''}`, 'Page must be reachable.')
    return { url, status: r.status, ms: r.ms, bytes: r.bytes, words, schemaTypes: [], internalLinks: 0, findings }
  }

  const allLinks = all(h, /<a\b[^>]+href=["']([^"']+)["']/gi).map((m) => m[1])
  const internalLinks = allLinks.filter((l) => l.startsWith('/') || l.includes(new URL(url).host))

  /* A listing page is mostly navigation, so word count is the wrong measure for it.
     Detect one by link density rather than by URL, so it works on any site. */
  const isIndex = words > 0 && internalLinks.length / words > 0.045

  /* The core GEO check. We never execute JavaScript, so what we measured IS
     what an AI crawler sees. Little text here means the page is client-rendered. */
  if (words < 100) {
    F('blocking', 'empty-to-crawler',
      `Only ${words} words reach a crawler. The page is very likely client-rendered.`,
      'Render content on the server. AI crawlers do not run JavaScript.')
  } else if (words < 250 && !isIndex) {
    F('high', 'thin', `${words} words of prose — thin for a page meant to be cited.`,
      'Assistants prefer substantive sources. Aim for 400+ on a page you want quoted.')
  } else if (words < 180 && isIndex) {
    F('low', 'index-thin', `Listing page with only ${words} words of its own.`,
      'A sentence or two of context above the list gives assistants something to quote.')
  }

  const title = cap(h, /<title[^>]*>([^<]*)<\/title>/i)
  if (!title) F('blocking', 'no-title', 'No <title>.', 'Every page needs one, under 60 characters.')
  else if (title.length > 65) F('medium', 'title-long', `Title is ${title.length} characters and will be truncated.`, 'Trim toward 60, keeping the distinctive part first.')

  const desc = cap(h, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i)
  if (!desc) F('medium', 'no-desc', 'No meta description.', 'It decides whether a search result gets clicked.')
  else if (desc.length > 175) F('low', 'desc-long', `Description is ${desc.length} characters.`, 'Trim toward 155.')

  if (!/rel=["']canonical["']/i.test(h)) F('high', 'no-canonical', 'No canonical link.', 'Add one so duplicate URLs do not compete.')

  const h1s = all(h, /<h1[^>]*>([\s\S]*?)<\/h1>/gi)
  if (h1s.length === 0) F('high', 'no-h1', 'No <h1>.', 'One per page, saying what the title says.')
  else if (h1s.length > 1) F('medium', 'many-h1', `${h1s.length} <h1> elements.`, 'Exactly one; use h2/h3 beneath.')

  const levels = all(h, /<h([1-6])[^>]*>/gi).map((m) => Number(m[1]))
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      F('low', 'heading-skip', `Heading level jumps h${levels[i - 1]} to h${levels[i]}.`, 'Do not skip levels; use CSS for size.')
      break
    }
  }

  /* Structured data */
  const schema = []
  for (const m of all(h, /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const parsed = JSON.parse(m[1])
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node['@type']) schema.push(node)
      }
    } catch {
      F('medium', 'bad-jsonld', 'Malformed JSON-LD.', 'Invalid JSON is ignored entirely.')
    }
  }
  const types = schema.map((s) => s['@type']).filter(Boolean)
  if (!types.length) F('high', 'no-schema', 'No structured data.', 'Add Organization sitewide, then Article, BreadcrumbList, Dataset or DefinedTerm as the page warrants.')

  /* FAQ markup must describe visible content — otherwise it is a spam signal */
  for (const node of schema.filter((s) => s['@type'] === 'FAQPage')) {
    for (const q of node.mainEntity ?? []) {
      if (q.name && !text.includes(q.name)) {
        F('blocking', 'faq-invisible', `FAQ question is in the markup but not on the page: "${q.name}"`,
          'Schema must describe visible content. This can earn a manual penalty.')
      }
    }
  }

  /* Answer-first: is there substance in the opening, and does it carry a figure? */
  const opening = text.slice(0, Math.max(400, Math.floor(text.length * 0.2)))
  if (words > 250 && !isIndex && !/\d/.test(opening)) {
    F('low', 'no-figure-early', 'No number in the opening fifth of the page.',
      'Roughly 44% of AI citations come from the first third. Lead with the claim and its figure.')
  }

  /* Numbers as text vs charts */
  const tables = all(h, /<table[\s>]/gi).length
  const svgs = all(h, /<svg[\s>]/gi).length
  const canvases = all(h, /<canvas[\s>]/gi).length
  if ((svgs > 2 || canvases > 0) && tables === 0 && /\bchart\b/i.test(h)) {
    F('high', 'chart-without-table', 'Charts present but no HTML table.',
      'A figure that exists only inside a chart is invisible to assistants. Emit a <table> alongside.')
  }

  /* Images */
  const imgs = all(h, /<img\b[^>]*>/gi).map((m) => m[0])
  const noAlt = imgs.filter((i) => !/\salt=/i.test(i)).length
  if (noAlt) F('low', 'img-alt', `${noAlt} of ${imgs.length} images have no alt attribute.`, 'Describe the content; use alt="" for decorative images.')

  /* Internal linking */
  const internal = internalLinks
  if (words > 300 && !isIndex && internal.length < 3) {
    F('medium', 'few-internal-links', `Only ${internal.length} internal links.`,
      'Link to definitions and to the method behind any number. Orphan pages do not compound.')
  }

  if (r.bytes > 500_000) F('low', 'heavy', `${Math.round(r.bytes / 1024)} KB of HTML.`, 'Large documents get truncated during retrieval.')

  return { url, status: r.status, ms: r.ms, bytes: r.bytes, words, title, desc, schemaTypes: types, internalLinks: internal.length, findings }
}

/* ── site-level checks ─────────────────────────────────────────────────── */

async function siteChecks(origin) {
  const out = []
  const F = (level, code, msg, fix) => out.push({ level, code, msg, fix })

  const robots = await grab(new URL('/robots.txt', origin).href)
  if (!robots.ok || robots.status >= 400) {
    F('high', 'no-robots', 'No robots.txt.', 'Add one, allowing AI crawlers explicitly.')
  } else {
    const body = robots.body
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'OAI-SearchBot', 'Google-Extended']) {
      const block = body.split(/user-agent:/i).find((s) => s.trim().toLowerCase().startsWith(bot.toLowerCase()))
      if (block && /disallow:\s*\/\s*$/im.test(block)) {
        F('blocking', 'bot-blocked', `robots.txt blocks ${bot}.`, 'Remove the disallow — this makes citation impossible.')
      } else if (!block) {
        F('low', 'bot-implicit', `${bot} is not named in robots.txt.`, 'Allow it explicitly; a wildcard mistake otherwise blocks it silently.')
      }
    }
    if (!/sitemap:/i.test(body)) F('medium', 'robots-no-sitemap', 'robots.txt does not reference a sitemap.', 'Add a Sitemap: line.')
  }

  const sm = await grab(new URL('/sitemap.xml', origin).href)
  const urls = sm.ok && sm.status < 400 ? all(sm.body, /<loc>([^<]+)<\/loc>/gi).map((m) => m[1]) : []
  if (!urls.length) F('high', 'no-sitemap', 'No sitemap.xml, or it is empty.', 'Publish one and submit it to Search Console and Bing.')

  const dates = all(sm.body || '', /<lastmod>([^<]+)<\/lastmod>/gi).map((m) => m[1].slice(0, 10))
  if (dates.length > 3 && new Set(dates).size === 1 && dates[0] === new Date().toISOString().slice(0, 10)) {
    F('medium', 'lastmod-churn', 'Every lastmod is today — it likely regenerates on each deploy.',
      'Use real modification dates, or crawlers learn to ignore the signal.')
  }

  const llms = await grab(new URL('/llms.txt', origin).href)
  if (!llms.ok || llms.status >= 400) {
    F('low', 'no-llmstxt', 'No llms.txt.', 'Thirty minutes of work. Its real audience is coding agents; do not spend longer.')
  }

  return { checks: out, sitemapUrls: urls }
}

/* ── run ───────────────────────────────────────────────────────────────── */

const origin = new URL(base).origin
const site = await siteChecks(origin)

let targets = [base]
if (flag('sitemap') && site.sitemapUrls.length) {
  // A sitemap lists canonical production URLs. If we are pointed at localhost or a
  // preview host, rewrite them — otherwise we would quietly audit the live site.
  targets = site.sitemapUrls.slice(0, MAX).map((u) => {
    try {
      const p = new URL(u).pathname
      return new URL(p, origin).href
    } catch {
      return u
    }
  })
}

const pages = []
for (const t of targets) pages.push(analyse(t, await grab(t)))

/* Cross-page: duplicate titles compete with each other */
const byTitle = new Map()
for (const p of pages) {
  if (!p.title) continue
  const prev = byTitle.get(p.title)
  if (prev) p.findings.push({ level: 'medium', code: 'dup-title', msg: `Duplicate title, also on ${prev}`, fix: 'Every page needs a distinct title.' })
  else byTitle.set(p.title, p.url)
}

/* A browser-vs-crawler delta is the clearest proof of client-side rendering */
const browserView = await grab(base, 'Browser')
const crawlerView = await grab(base, AGENT)
const browserWords = strip(browserView.body).split(' ').filter(Boolean).length
const crawlerWords = strip(crawlerView.body).split(' ').filter(Boolean).length
const delta = browserWords - crawlerWords
const renderNote =
  delta > 200
    ? { level: 'blocking', code: 'js-dependent', msg: `A browser sees ${browserWords} words; a crawler sees ${crawlerWords}.`, fix: 'Content is rendered client-side and is invisible to AI assistants.' }
    : null

const report = {
  target: base,
  scannedAt: new Date().toISOString(),
  agent: AGENT,
  site: { findings: renderNote ? [renderNote, ...site.checks] : site.checks, sitemapUrls: site.sitemapUrls.length },
  pages,
}

if (AS_JSON) {
  console.log(JSON.stringify(report, null, 2))
  process.exit(0)
}

/* ── human report ──────────────────────────────────────────────────────── */

const ORDER = { blocking: 0, high: 1, medium: 2, low: 3 }
const MARK = { blocking: '■ BLOCKING', high: '▲ HIGH    ', medium: '● MEDIUM  ', low: '· LOW     ' }

console.log(`\nGEO / AEO audit — ${base}`)
console.log(`fetched as ${AGENT}, JavaScript not executed (this is what an AI crawler sees)\n`)

console.log('SITE')
const sf = report.site.findings.sort((a, b) => ORDER[a.level] - ORDER[b.level])
if (!sf.length) console.log('  no issues')
for (const f of sf) console.log(`  ${MARK[f.level]}  ${f.msg}\n${' '.repeat(14)}→ ${f.fix}`)

console.log(`\nPAGES (${pages.length})`)
let counts = { blocking: 0, high: 0, medium: 0, low: 0 }
for (const p of pages) {
  const fs = p.findings.sort((a, b) => ORDER[a.level] - ORDER[b.level])
  for (const f of fs) counts[f.level]++
  const path = new URL(p.url).pathname
  console.log(`\n  ${path}  —  ${p.words} words, ${p.schemaTypes.length ? p.schemaTypes.join(', ') : 'no schema'}`)
  if (!fs.length) console.log('     ok')
  for (const f of fs) console.log(`     ${MARK[f.level]}  ${f.msg}\n${' '.repeat(17)}→ ${f.fix}`)
}

const total = Object.values(counts).reduce((a, b) => a + b, 0) + sf.length
console.log(`\n${'─'.repeat(62)}`)
console.log(`${total} findings — ${counts.blocking + sf.filter(f => f.level === 'blocking').length} blocking, ${counts.high} high, ${counts.medium} medium, ${counts.low} low\n`)
process.exit(counts.blocking || sf.some((f) => f.level === 'blocking') ? 1 : 0)

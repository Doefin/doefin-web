import { site } from './site'
import type { V3EditorialArticle } from '@/content/editorial-types'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
type FeedReport = { slug: string; title: string; summary: string; publishedAt: string }
/** Blog and V3 research records come from their published CMS sources.
 * RSS pubDate is optional: review dates never substitute for publication dates. */
export function renderEditorialFeed(articles: V3EditorialArticle[], reports: FeedReport[]) {
  const items = [
    ...articles.map(article => ({ ...article, path: `/blog/${article.slug}` })),
    ...reports.map(report => ({ ...report, path: `/research/${report.slug}` })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${site.url}</link>
    <description>${esc(site.description)}</description>
    <language>en-GB</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items.map(item => `    <item>
      <title>${esc(item.title)}</title>
      <link>${site.url}${item.path}</link>
      <guid isPermaLink="true">${site.url}/v3${item.path}</guid>
      <description>${esc(item.summary)}</description>${item.publishedAt ? `
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`
}

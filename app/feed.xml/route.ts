import { allPosts, allReports } from '@/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function GET() {
  const items = [
    ...allPosts().map((p) => ({ ...p, path: `/blog/${p.slug}` })),
    ...allReports().map((r) => ({ ...r, path: `/research/${r.slug}` })),
  ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)}</title>
    <link>${site.url}</link>
    <description>${esc(site.description)}</description>
    <language>en-GB</language>
    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${esc(i.title)}</title>
      <link>${site.url}${i.path}</link>
      <guid isPermaLink="true">${site.url}${i.path}</guid>
      <description>${esc(i.summary)}</description>
      <pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>
    </item>`,
  )
  .join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  })
}

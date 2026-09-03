import type { MetadataRoute } from 'next'
import { allAcademy, allGlossary, allGuides, allPosts, allReports, allTags, epochs, EXAMPLES, publishedDocs, TOOLS } from '@/content'
import { site } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static pages carry a stable date. Using `new Date()` would change lastmod on
  // every deploy, which trains crawlers to ignore the signal entirely.
  const STATIC_LASTMOD = '2026-08-24'

  const at = (path: string, lastModified?: string, priority = 0.6) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(lastModified ?? STATIC_LASTMOD),
    priority,
  })

  return [
    at('/', undefined, 1),
    at('/data', undefined, 0.9),
    at('/data/difficulty', undefined, 0.9),
    at('/data/scoreboard', undefined, 0.9),
    at('/research', undefined, 0.8),
    at('/academy', undefined, 0.7),
    at('/glossary', undefined, 0.7),
    at('/blog', undefined, 0.7),
    at('/tools', undefined, 0.6),
    at('/resources', undefined, 0.6),
    at('/for/miners', undefined, 0.8),
    at('/for/institutions', undefined, 0.8),
    at('/about', undefined, 0.5),
    at('/newsletter', undefined, 0.7),
    at('/docs', undefined, 0.7),
    at('/data/hashrate', undefined, 0.8),
    at('/terms', undefined, 0.2),
    at('/privacy', undefined, 0.2),
    ...TOOLS.map((t) => at(`/tools/${t.slug}`, undefined, 0.6)),
    ...allGuides().map(({ slug, guide }) => at(`/academy/guides/${slug}`, guide.article.publishedAt, 0.7)),
    ...EXAMPLES.map((e) => at(`/tools/${e.toolSlug}/example/${e.slug}`, undefined, 0.6)),
    ...publishedDocs().map((d) => at(`/docs/${d.slug}`, undefined, 0.6)),
    ...allPosts().map((p) => at(`/blog/${p.slug}`, p.updatedAt ?? p.publishedAt, 0.7)),
    ...allAcademy().map((p) => at(`/academy/${p.slug}`, p.updatedAt ?? p.publishedAt, 0.7)),
    ...allGlossary().map((t) => at(`/glossary/${t.slug}`, t.updatedAt, 0.6)),
    ...allReports().map((r) => at(`/research/${r.slug}`, r.updatedAt ?? r.publishedAt, 0.8)),
    ...epochs.map((e) => at(`/data/difficulty/epoch/${e.height}`, e.settledAt ?? e.startedAt, 0.7)),
    ...allTags().map((t) => at(`/blog/tag/${t.replace(/\s+/g, '-')}`, undefined, 0.4)),
  ]
}

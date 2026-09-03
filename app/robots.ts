import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

/**
 * AI crawlers are allowed explicitly rather than by omission — a default-deny CDN
 * rule or a wildcard mistake is the common way this silently breaks.
 */
export default function robots(): MetadataRoute.Robots {
  const agents = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'ClaudeBot',
    'Claude-Web',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
    'Bingbot',
    'Googlebot',
  ]
  return {
    rules: [
      ...agents.map((userAgent) => ({ userAgent, allow: '/' })),
      { userAgent: '*', allow: '/', disallow: ['/studio'] },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  }
}

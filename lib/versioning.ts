export type SiteVersion = 'v1' | 'v3'

/** Keep page links inside a version while leaving shared assets and endpoints alone. */
export function versionedPath(href: string, version: SiteVersion = 'v1'): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  // V4 is an explicit standalone landing; shared documentation stays on V3.
  if (/^\/v4(?:\/|[?#]|$)/.test(href)) return href
  if (version === 'v1' && /^\/v[123](?:\/|[?#]|$)/.test(href)) return href
  if (/^\/(?:images|_next|api)(?:\/|[?#]|$)/.test(href) ||
      /^\/(?:favicon\.ico|feed\.xml|sitemap\.xml|robots\.txt|llms\.txt|opengraph-image)(?:[/?#]|$)/.test(href)) return href

  if (version === 'v3') {
    const suffixAt = href.search(/[?#]/)
    const pathname = suffixAt === -1 ? href : href.slice(0, suffixAt)
    const suffix = suffixAt === -1 ? '' : href.slice(suffixAt)
    const page = pathname.replace(/^\/v[123](?=\/|$)/, '') || '/'
    return '/v3' + (page === '/' ? '' : page) + suffix
  }

  return '/v1' + (href === '/' ? '' : href.startsWith('/?') || href.startsWith('/#') ? href.slice(1) : href)
}

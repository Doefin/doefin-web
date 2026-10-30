export type SiteVersion = 'v3'

/** Normalize retired comparison prefixes while leaving assets and endpoints alone. */
export function versionedPath(href: string, _version: SiteVersion = 'v3'): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (/^\/(?:images|_next|api)(?:\/|[?#]|$)/.test(href) ||
      /^\/(?:favicon\.ico|feed\.xml|sitemap\.xml|robots\.txt|llms\.txt|opengraph-image)(?:[/?#]|$)/.test(href)) return href

  const suffixAt = href.search(/[?#]/)
  const pathname = suffixAt === -1 ? href : href.slice(0, suffixAt)
  const suffix = suffixAt === -1 ? '' : href.slice(suffixAt)
  // Normalize retained content links that originally used a comparison prefix.
  const page = pathname.replace(/^\/v[1234](?=\/|$)/, '') || '/'
  return page + suffix
}

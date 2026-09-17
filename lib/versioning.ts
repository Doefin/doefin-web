/** Keep page links inside a version while leaving shared assets and endpoints alone. */
export function versionedPath(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  if (/^\/v[12](?:\/|[?#]|$)/.test(href)) return href
  if (/^\/(?:images|_next)(?:\/|$)/.test(href) ||
      /^\/(?:favicon\.ico|feed\.xml|sitemap\.xml|robots\.txt|llms\.txt|opengraph-image)(?:[/?#]|$)/.test(href)) return href
  return '/v1' + (href === '/' ? '' : href.startsWith('/?') || href.startsWith('/#') ? href.slice(1) : href)
}

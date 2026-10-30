/** Normalize only root-relative legacy V3 links during source parity checks. */
export function comparableHref(href) {
  if (typeof href !== 'string') return href
  const legacyPath = href.match(/^\/v3(?=\/|[?#]|$)/)
  if (!legacyPath) return href
  const remainder = href.slice(3)
  return remainder && !remainder.startsWith('/') ? `/${remainder}` : remainder || '/'
}

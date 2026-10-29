import { site } from './site'
import { versionedPath } from './versioning'
type DocsHref = string | { pathname?: string | null; protocol?: string | null; host?: string | null; hostname?: string | null; port?: string | number | null; auth?: string | null; username?: string | null; password?: string | null; slashes?: boolean | null }
const unsafe = (value: string) => /[\u0000-\u0020\u007f\\]/.test(value)
/** Only a root path or an explicit HTTP(S) URL on the configured canonical
 * origin belongs to this site's Docs namespace. External/ambiguous URLs are
 * never normalized into local navigation by the availability policy. */
export function contentPath(href: DocsHref): string | undefined {
  const canonical = new URL(site.url)
  if (typeof href === 'string') {
    if (unsafe(href)) return
    if (href.startsWith('/') && !href.startsWith('//')) {
      const url = new URL(href,canonical)
      return url.origin === canonical.origin ? versionedPath(url.pathname + url.search + url.hash) : undefined
    }
    if (!/^https?:\/\/[^/]/i.test(href)) return
    try { const url = new URL(href); return !url.username && !url.password && url.origin === canonical.origin ? versionedPath(url.pathname + url.search + url.hash) : undefined } catch { return }
  }
  const pathname = href.pathname ?? ''
  if (unsafe(pathname) || href.auth || href.username || href.password) return
  if (!href.host && !href.hostname && !href.protocol && !href.slashes && /^https?:\/\/[^/]/i.test(pathname)) return contentPath(pathname)
  if (!pathname.startsWith('/') || pathname.startsWith('//')) return
  if (href.host || href.hostname || href.protocol || href.slashes) {
    // Require an explicit protocol/authority; don't reinterpret partial objects
    // or protocol-relative forms as though they were canonical absolute URLs.
    if (!href.protocol || !/^https?:?$/i.test(href.protocol)) return
    const authority = href.host ?? (href.hostname ? href.hostname + (href.port ? ':' + href.port : '') : '')
    if (!authority || unsafe(authority) || /[\/?#@]/.test(authority) || href.auth) return
    try { if (new URL(href.protocol.replace(/:?$/, ':') + '//' + authority).origin !== canonical.origin) return } catch { return }
  }
  const path = new URL(pathname,canonical)
  return versionedPath(path.pathname + path.search + path.hash)
}
/** Missing or unknown individual guides have a clearly labeled hub fallback.
 * Published destinations remain untouched, including their original query/hash. */
export function docsLinkState(href: DocsHref, slugs: readonly string[] | null | undefined): 'published' | 'missing' | 'unavailable' | undefined {
  const path = contentPath(href)
  if (!path?.startsWith('/docs/') || slugs === undefined) return undefined
  if (slugs === null) return 'unavailable'
  let slug: string
  try { slug = decodeURIComponent(path.split(/[?#]/)[0].slice('/docs/'.length).replace(/\/$/,'')) } catch { return 'missing' }
  return slugs.includes(slug) ? 'published' : 'missing'
}

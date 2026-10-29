import type { Metadata } from 'next'
import { site } from './site'
import { versionedPath, type SiteVersion } from './versioning'

/**
 * Stable node identifiers for the entity graph.
 *
 * Every page previously minted its own inline `publisher: { '@type':
 * 'Organization', ... }`, so a crawler saw a fresh, unrelated Organization on
 * every URL instead of one company publishing many documents. Referencing a
 * single @id is how the pages resolve to one entity.
 */
export const ID = {
  org: `${site.url}/#organization`,
  website: `${site.url}/#website`,
} as const

/** A reference to the canonical Organization node, never a fresh copy of it. */
export const publisherRef = { '@id': ID.org } as const

/** Explicitly shared: Next.js replaces nested Open Graph metadata between layouts/pages. */
export const v3SocialImage = {
  url: `${site.url}/v3/social-image`,
  width: 1200,
  height: 630,
  alt: 'Doefin — Bitcoin difficulty markets. Understand the market and review the details. Educational prototype.',
} as const

/**
 * The author node for a piece of content.
 *
 * Previously every article emitted `{'@type':'Organization', name:'Doefin
 * Research'}` — a second, unrelated company with no url and no stated
 * relationship to the publisher. This gives the research desk a resolving url and
 * names its parent, so the two nodes describe one organisation and its desk
 * rather than two strangers.
 */
export function authorNode(a: {
  slug: string
  kind: 'organization' | 'person'
  name: string
  url: string
  description: string
  metadataDescription?: string
  sameAs?: string[]
}) {
  return {
    '@type': a.kind === 'person' ? 'Person' : 'Organization',
    '@id': `${site.url}/#${a.slug}`,
    name: a.name,
    url: `${site.url}${versionedPath(a.url)}`,
    description: a.metadataDescription ?? a.description,
    ...(a.kind === 'person'
      ? { worksFor: { '@id': ID.org } }
      : { parentOrganization: { '@id': ID.org } }),
    ...(a.sameAs?.length ? { sameAs: a.sameAs } : {}),
  }
}

type SeoInput = {
  title: string
  description: string
  path: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  /**
   * Drop the "| Doefin" suffix. Use on data pages, where the title carries a
   * number and a block height and every character counts before truncation.
   */
  absoluteTitle?: boolean
}

/** Every page builds its metadata through here, so nothing ships without a canonical. */
export function seo({ title, description, path, type = 'website', publishedTime, modifiedTime, absoluteTitle }: SeoInput): Metadata {
  const url = `${site.url}${versionedPath(path)}`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: site.name,
      type,
      images: [v3SocialImage],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, images: [v3SocialImage] },
  }
}

export function jsonLd(data: Record<string, unknown>, version: SiteVersion = 'v3') {
  return { __html: JSON.stringify(data, (_key, value: unknown) => {
    // Keep stable organisation IDs; page URLs follow the versioned routes.
    if (typeof value === 'string' && value.startsWith(site.url + '/') && !value.startsWith(site.url + '/#')) {
      return site.url + versionedPath(value.slice(site.url.length), version)
    }
    return value
  }).replace(/</g, '\\u003c') }
}

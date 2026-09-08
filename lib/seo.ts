import type { Metadata } from 'next'
import { site } from './site'

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
  sameAs?: string[]
}) {
  return {
    '@type': a.kind === 'person' ? 'Person' : 'Organization',
    '@id': `${site.url}/#${a.slug}`,
    name: a.name,
    url: `${site.url}${a.url}`,
    description: a.description,
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
  const url = `${site.url}${path}`
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
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export function jsonLd(data: Record<string, unknown>) {
  return { __html: JSON.stringify(data) }
}

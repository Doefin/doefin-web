'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { versionedPath } from '@/lib/versioning'
import { usePublishedDocs } from './DocsPublicationContext'
import { docsLinkState } from '@/lib/docs-links'
import { useSiteVersion } from './SiteVersionContext'

/** Keep every internal page link in the selected V3 application. */
export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const version = useSiteVersion()
  const docSlugs = usePublishedDocs()
  const destination = typeof href === 'string'
    ? versionedPath(href, version)
    : href.host || href.hostname || href.protocol || !href.pathname
      ? href
      : (() => {
          const [pathname, hash] = versionedPath(href.pathname, version).split('#')
          return { ...href, pathname, ...(hash ? { hash: '#' + hash } : {}) }
        })()
  const state = docsLinkState(destination, docSlugs)
  const fallback = state === 'missing' || state === 'unavailable'
  return <NextLink href={fallback ? '/v3/docs' : destination} {...props} {...(fallback ? {children:'Browse documentation', 'aria-label':state === 'unavailable' ? 'Browse documentation (guide status temporarily unavailable)' : 'Browse documentation (requested guide unavailable)', title:state === 'unavailable' ? 'Guide publication status is temporarily unavailable.' : 'This guide is not currently published.', 'data-docs-fallback':state} : {})} />
}

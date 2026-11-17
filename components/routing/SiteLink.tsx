'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { versionedPath } from '@/lib/versioning'
import { usePublishedDocs } from './DocsPublicationContext'
import { toolGuideLinkState } from '@/lib/tool-guide-links'
import { usePublishedGuides } from './GuidesPublicationContext'
import { docsLinkState } from '@/lib/docs-links'
import { useSiteVersion } from './SiteVersionContext'

/** Keep every internal page link in the selected V3 application. */
export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const version = useSiteVersion()
  const docSlugs = usePublishedDocs()
  const guideSlugs = usePublishedGuides()
  const destination = typeof href === 'string'
    ? versionedPath(href, version)
    : href.host || href.hostname || href.protocol || !href.pathname
      ? href
      : (() => {
          const [pathname, hash] = versionedPath(href.pathname, version).split('#')
          return { ...href, pathname, ...(hash ? { hash: '#' + hash } : {}) }
        })()
  // An unavailable manifest cannot establish that a destination is missing.
  // Keep its URL and label so a transient lookup failure does not reroute navigation.
  const guideState=toolGuideLinkState(destination,guideSlugs)
  if(guideState === 'missing') return <NextLink href="/academy#guides" {...props} children="Browse calculator guides" aria-label="Browse calculator guides (requested guide unavailable)" data-guides-fallback={guideState} />
  const state = docsLinkState(destination, docSlugs)
  const fallback = state === 'missing'
  return <NextLink href={fallback ? '/docs' : destination} {...props} {...(fallback ? {children:'Browse documentation', 'aria-label':'Browse documentation (requested guide unavailable)', title:'This guide is not currently published.', 'data-docs-fallback':state} : {})} />
}

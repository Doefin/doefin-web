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
  const guideState=toolGuideLinkState(destination,guideSlugs)
  if(guideState === 'missing' || guideState === 'unavailable') return <NextLink href="/academy#guides" {...props} children="Browse calculator guides" aria-label={guideState === 'missing' ? 'Browse calculator guides (requested guide unavailable)' : 'Browse calculator guides (publication status temporarily unavailable)'} data-guides-fallback={guideState} />
  const state = docsLinkState(destination, docSlugs)
  const fallback = state === 'missing' || state === 'unavailable'
  return <NextLink href={fallback ? '/docs' : destination} {...props} {...(fallback ? {children:'Browse documentation', 'aria-label':state === 'unavailable' ? 'Browse documentation (guide status temporarily unavailable)' : 'Browse documentation (requested guide unavailable)', title:state === 'unavailable' ? 'Guide publication status is temporarily unavailable.' : 'This guide is not currently published.', 'data-docs-fallback':state} : {})} />
}

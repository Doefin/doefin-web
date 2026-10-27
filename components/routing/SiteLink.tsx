'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { versionedPath } from '@/lib/versioning'
import { useSiteVersion } from './SiteVersionContext'

/** Keep every internal page link in the selected V3 application. */
export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const version = useSiteVersion()
  const destination = typeof href === 'string'
    ? versionedPath(href, version)
    : href.host || href.hostname || href.protocol || !href.pathname
      ? href
      : (() => {
          const [pathname, hash] = versionedPath(href.pathname, version).split('#')
          return { ...href, pathname, ...(hash ? { hash: '#' + hash } : {}) }
        })()
  return <NextLink href={destination} {...props} />
}

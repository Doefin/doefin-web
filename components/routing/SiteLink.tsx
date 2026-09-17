import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { versionedPath } from '@/lib/versioning'

/** Normalize authored V1 paths once; explicitly versioned V2 links pass through. */
export default function SiteLink({ href, ...props }: ComponentProps<typeof NextLink>) {
  const destination = typeof href === 'string'
    ? versionedPath(href)
    : { ...href, pathname: href.pathname ? versionedPath(href.pathname) : href.pathname }
  return <NextLink href={destination} {...props} />
}

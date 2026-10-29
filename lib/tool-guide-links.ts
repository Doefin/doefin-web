import { contentPath } from './docs-links'
export function toolGuideLinkState(href: Parameters<typeof contentPath>[0], slugs: readonly string[] | null | undefined): 'published' | 'missing' | 'unavailable' | undefined {
  const path=contentPath(href)
  if (!path?.startsWith('/academy/guides/') || slugs === undefined) return
  if(slugs === null) return 'unavailable'
  let slug: string
  try {slug=decodeURIComponent(path.split(/[?#]/)[0].slice('/academy/guides/'.length).replace(/\/$/,''))} catch {return 'missing'}
  return slugs.includes(slug) ? 'published' : 'missing'
}

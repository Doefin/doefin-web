'use client'

import Link from '@/components/routing/SiteLink'
import { useSiteVersion } from '@/components/routing/SiteVersionContext'

/** Preserve V2's comparison copy while connecting V3 to the complete library. */
export function LibraryLinks({ className }: { className: string }) {
  const isV3 = useSiteVersion() === 'v3'
  const links = isV3
    ? [['Resource library', '/v3/resources'], ['Academy & guides', '/v3/academy'], ['Articles', '/v3/blog'], ['Mining glossary', '/v3/glossary'], ['Docs', '/v3/docs']]
    : [['Academy', '/academy'], ['Blog', '/blog'], ['Glossary', '/glossary'], ['Product documentation', '/docs']]
  return <section className={className}>
    <h2 className="text-xl font-bold">{isV3 ? 'Keep exploring' : 'Explore the existing library'}</h2>
    <p className="mt-3 text-sm leading-relaxed text-subtle">{isV3 ? 'Build on this walkthrough with mining fundamentals, written guides and definitions. Use the Docs for market mechanics and app tasks.' : 'The broader article library remains available while these new content formats are being reviewed.'}</p>
    <div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-highlight">{links.map(([label, href]) => <Link key={href} href={href} target={isV3 ? undefined : '_blank'} rel={isV3 ? undefined : 'noopener noreferrer'} className={isV3 ? 'inline-flex min-h-11 items-center hover:underline' : 'hover:underline'}>{label} {isV3 ? '→' : '↗'}{!isV3 && <span className="sr-only"> (original website, opens a new tab)</span>}</Link>)}</div>
  </section>
}

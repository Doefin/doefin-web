import Link from 'next/link'
import { jsonLd } from '@/lib/seo'
import { site } from '@/lib/site'

export type Crumb = { name: string; href: string }

/**
 * Renders the visible trail and the BreadcrumbList schema together, so the two can
 * never drift apart.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: 'Home', href: '/' }, ...items]
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all.map((c, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: c.name,
            item: `${site.url}${c.href === '/' ? '' : c.href}`,
          })),
        })}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-muted/50">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-subtle">{c.name}</span>
              ) : (
                <Link href={c.href} className="hover:text-body">{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}

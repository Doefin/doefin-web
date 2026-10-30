import type { Metadata } from 'next'
import { V3Chrome } from '@/components/v3/Chrome'
import { MeasurementBoundary } from '@/components/v3/Measurement'
import { SiteVersionProvider } from '@/components/routing/SiteVersionContext'
import { GuidesPublicationProvider } from '@/components/routing/GuidesPublicationContext'
import { DocsPublicationProvider } from '@/components/routing/DocsPublicationContext'
import { docsNavigation, guidesNavigation } from '@/content'
import { jsonLd, ID, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: { default: `${site.name} — ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: site.name, type: 'website', locale: 'en_GB' },
  robots: { index: false, follow: false },
  icons: { icon: '/images/favicon.png', shortcut: '/favicon.ico' },
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [docSlugs, guideSlugs] = await Promise.all([docsNavigation(), guidesNavigation()])
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ID.org,
    name: site.name,
    url: site.url,
    description: site.description,
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  }
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': ID.website,
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: publisherRef,
    inLanguage: 'en-GB',
  }

  return <SiteVersionProvider version="v3"><DocsPublicationProvider slugs={docSlugs}><GuidesPublicationProvider slugs={guideSlugs}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(org)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(website)} />
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
    <div className="flex min-h-screen flex-col"><MeasurementBoundary /><V3Chrome>{children}</V3Chrome></div>
  </GuidesPublicationProvider></DocsPublicationProvider></SiteVersionProvider>
}

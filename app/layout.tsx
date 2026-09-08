import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { jsonLd, ID, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import './globals.css'

// Manrope is the brand typeface, carried over from the trading app.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

/**
 * NOTE: this file is a SERVER component and must stay one.
 * Marking it "use client" is what makes the trading app return an empty body to
 * crawlers, and it also makes `export const metadata` impossible on every page
 * beneath it. See .claude/CLAUDE.md.
 */
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: site.name, type: 'website', locale: 'en_GB' },
  robots: { index: true, follow: true },
  icons: { icon: '/images/favicon.png', shortcut: '/favicon.ico' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ID.org,
    name: site.name,
    url: site.url,
    description: site.description,
    legalName: site.legalName,
    address: { '@type': 'PostalAddress', addressLocality: 'Port Louis', addressCountry: 'MU' },
    ...(site.sameAs.length ? { sameAs: site.sameAs } : {}),
  }

  // WebSite tells search engines the site is one entity rather than loose pages.
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

  return (
    <html lang="en-GB" className={manrope.variable}>
      <body className="flex min-h-screen flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(org)} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(website)} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}

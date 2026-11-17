import type { Metadata } from 'next'
import { V3Chrome } from '@/components/v3/Chrome'
import { MeasurementBoundary } from '@/components/v3/Measurement'
import { SiteVersionProvider } from '@/components/routing/SiteVersionContext'
import { GuidesPublicationProvider } from '@/components/routing/GuidesPublicationContext'
import { DocsPublicationProvider } from '@/components/routing/DocsPublicationContext'
import { docsNavigation, guidesNavigation } from '@/content'
import { jsonLd, ID, publisherRef } from '@/lib/seo'
import { site } from '@/lib/site'
import { documentMetadata } from './SiteDocument'
import { getDictionary } from '@/dictionaries'
import { languages, type Language } from '@/lib/languages'

export const publicMetadata: Metadata = {
  ...documentMetadata,
  title: { default: `${site.tagline} | ${site.name}`, template: `%s | ${site.name}` },
  description: site.description,
  alternates: { canonical: '/' },
  openGraph: { siteName: site.name, type: 'website', locale: 'en_GB' },
  robots: { index: false, follow: false },
  icons: { icon: '/images/favicon.png', shortcut: '/favicon.ico' },
}

export async function PublicFrame({ children, language = 'en' }: { children: React.ReactNode; language?: Language }) {
  const [docSlugs, guideSlugs, dictionary] = await Promise.all([docsNavigation(), guidesNavigation(), getDictionary(language)])
  const { landing, navigation } = dictionary
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
    description: language === 'en' ? site.description : landing.homeDescription,
    publisher: publisherRef,
    inLanguage: languages[language].tag,
  }

  return <SiteVersionProvider version="v3"><DocsPublicationProvider slugs={docSlugs}><GuidesPublicationProvider slugs={guideSlugs}>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(org)} />
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(website)} />
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">{landing.skipToContent}</a>
    <div className="flex min-h-screen flex-col"><MeasurementBoundary /><V3Chrome language={language} navigation={navigation} labels={{
      language: landing.language,
      main: landing.main,
      closeNavigation: landing.closeNavigation,
      openNavigation: landing.openNavigation,
      browseDoefin: landing.browseDoefin,
      contact: landing.contactTheTeam,
      enterApp: landing.enterApp,
      tagline: landing.tagline,
      risk: landing.disclaimer,
      terms: landing.terms,
      privacy: landing.privacy,
    }}>{children}</V3Chrome></div>
  </GuidesPublicationProvider></DocsPublicationProvider></SiteVersionProvider>
}

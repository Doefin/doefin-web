import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import { site } from '@/lib/site'
import { languages, type Language } from '@/lib/languages'
import '@/app/globals.css'

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
export const documentMetadata: Metadata = {
  metadataBase: new URL(site.url),
  robots: { index: false, follow: false },
}

export function SiteDocument({ children, language = 'en' }: { children: React.ReactNode; language?: Language }) {
  return (
    <html lang={languages[language].tag} className={manrope.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
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
  robots: { index: false, follow: false },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={manrope.variable}>
      <body>
        {children}
      </body>
    </html>
  )
}

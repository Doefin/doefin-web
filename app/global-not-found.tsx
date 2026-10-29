import type { Metadata } from 'next'
import Image from 'next/image'
import './globals.css'

export const metadata: Metadata = {
  title: 'Page not found | Doefin',
  description: 'This address does not match a page. Return to the website or open the V3 documentation.',
  robots: { index: false, follow: true },
}

/** Unmatched URLs cannot safely choose version-specific chrome at build time. */
export default function GlobalNotFound() {
  return <html lang="en-GB">
    <body className="min-h-screen bg-ink font-sans text-body" style={{ fontFamily: 'Segoe UI, system-ui, sans-serif' }}>
      <main className="mx-auto max-w-xl px-5 py-20 sm:py-28">
        <a href="/" aria-label="Doefin home" className="inline-flex"><Image src="/images/logo/logo-white.png" alt="Doefin" width={1800} height={241} className="h-auto w-28" /></a>
        <p className="mt-14 text-xs font-bold uppercase tracking-widest text-highlight">404</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">Page not found.</h1>
        <p className="mt-5 text-base leading-relaxed text-subtle">Check the address, or choose a starting point below.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <a href="/" className="inline-flex min-h-11 items-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">Website home</a>
          <a href="/docs" className="inline-flex min-h-11 items-center rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-highlight">V3 documentation</a>
        </div>
      </main>
    </body>
  </html>
}

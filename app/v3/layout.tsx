import type { Metadata } from 'next'
import { SiteVersionProvider } from '@/components/routing/SiteVersionContext'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Keep the layout and page bodies on the server; scope link adaptation to V3. */
export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <SiteVersionProvider version="v3">{children}</SiteVersionProvider>
}

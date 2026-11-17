import type { ReactNode } from 'react'
import { documentMetadata, SiteDocument } from '@/components/layout/SiteDocument'

export const metadata = documentMetadata

export default function StudioLayout({ children }: { children: ReactNode }) {
  return <SiteDocument>{children}</SiteDocument>
}

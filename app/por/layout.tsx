import type { ReactNode } from 'react'
import { SiteDocument } from '@/components/layout/SiteDocument'
import { PublicFrame, publicMetadata } from '@/components/layout/PublicFrame'

export const metadata = publicMetadata

export default function LocalizedLayout({ children }: { children: ReactNode }) {
  return <SiteDocument language="por"><PublicFrame language="por">{children}</PublicFrame></SiteDocument>
}

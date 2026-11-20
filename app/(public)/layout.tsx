import type { ReactNode } from 'react'
import { SiteDocument } from '@/components/layout/SiteDocument'
import { PublicFrame, publicMetadata } from '@/components/layout/PublicFrame'

export const metadata = publicMetadata

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <SiteDocument><PublicFrame>{children}</PublicFrame></SiteDocument>
}

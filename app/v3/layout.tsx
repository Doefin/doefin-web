import type { Metadata } from 'next'
import { MeasurementBoundary } from '@/components/v3/Measurement'

export const metadata: Metadata = { robots: { index: false, follow: false } }

/** Keep the layout and page bodies on the server; scope link adaptation to V3. */
export default function V3Layout({ children }: { children: React.ReactNode }) {
  return <><MeasurementBoundary />{children}</>
}

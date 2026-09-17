import type { Metadata } from 'next'

/** No preview page should enter the production search index. */
export const metadata: Metadata = { robots: { index: false, follow: false } }

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return children
}

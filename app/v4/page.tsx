import type { Metadata } from 'next'
import { V4Landing } from '@/components/v4/V4Landing'
import { seo } from '@/lib/seo'
import './site.css'

export const metadata: Metadata = {
  ...seo({
    title: 'Bitcoin difficulty markets — V4',
    description: 'Explore Doefin’s Bitcoin difficulty markets, compare YES and NO outcomes and see how positions work. Examples are illustrative.',
    path: '/v4',
  }),
  robots: { index: false, follow: false },
}

/** The interactive client boundary is still prerendered as complete HTML by Next.js. */
export default function V4Home() {
  return <div className="v4-site"><V4Landing /></div>
}

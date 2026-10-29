import { PrototypeReview } from '@/components/v3/PrototypeReview'
import { seo } from '@/lib/seo'

export const metadata = { ...seo({ title: 'Prototype journey review', description: 'Review the six-stage website prototype and inspect optional local interaction labels.', path: '/prototype-review' }), robots: { index: false, follow: false } }

export default function Page() {
  return <PrototypeReview />
}

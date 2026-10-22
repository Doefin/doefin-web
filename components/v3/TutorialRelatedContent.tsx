'use client'

import { useSiteVersion } from '@/components/routing/SiteVersionContext'
import { RelatedContent, type RelatedLink } from '@/components/preview/Primitives'

/** V3 keeps the tutorial's next reading educational; V2 retains its comparison. */
export function TutorialRelatedContent({ learning, action }: { learning: RelatedLink; action: RelatedLink }) {
  const isV3 = useSiteVersion() === 'v3'
  return <RelatedContent
    learning={isV3 ? {
      href: '/v3/docs/how-settlement-works',
      title: 'Distinguish production from settlement',
      text: 'Read how a threshold-based payout differs from a continuously changing production estimate.',
    } : learning}
    action={action}
  />
}

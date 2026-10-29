'use client'

import { RelatedContent, type RelatedLink } from '@/components/preview/Primitives'

/** Keep the tutorial's next reading educational. */
export function TutorialRelatedContent({ action }: { learning: RelatedLink; action: RelatedLink }) {
  return <RelatedContent
    learning={{
      href: '/docs/how-settlement-works',
      title: 'Distinguish production from settlement',
      text: 'Read how a threshold-based payout differs from a continuously changing production estimate.',
    }}
    action={action}
  />
}

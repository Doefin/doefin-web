'use client'

import { Fragment, useSyncExternalStore, type ReactNode } from 'react'

const mobileQuery = '(max-width: 767px)'
const isMobile = () => window.matchMedia(mobileQuery).matches
const serverSnapshot = () => false

function subscribe(onChange: () => void) {
  const media = window.matchMedia(mobileQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** CSS sets the first-paint layout; the DOM follows it after hydration. */
export function IntroSections({ audience, product }: { audience: ReactNode; product: ReactNode }) {
  const mobile = useSyncExternalStore(subscribe, isMobile, serverSnapshot)
  const sections = { audience, product }
  const order = mobile ? ['product', 'audience'] as const : ['audience', 'product'] as const
  return <div className="v39-intro-sections">
    {order.map(key => <Fragment key={key}>{sections[key]}</Fragment>)}
  </div>
}

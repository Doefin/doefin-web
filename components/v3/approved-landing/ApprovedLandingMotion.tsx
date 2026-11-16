'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { mountApprovedLandingMotion } from './approved-motion.mjs'

export function ApprovedLandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (root.current) return mountApprovedLandingMotion(root.current)
  }, [])

  return (
    <div ref={root} className="approved-landing">
      {children}
    </div>
  )
}

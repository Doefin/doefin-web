'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { SiteVersion } from '@/lib/versioning'

const SiteVersionContext = createContext<SiteVersion | undefined>(undefined)

/** Server-rendered pages remain children; only links need this browser context. */
export function SiteVersionProvider({ version, children }: { version: SiteVersion; children: ReactNode }) {
  return <SiteVersionContext.Provider value={version}>{children}</SiteVersionContext.Provider>
}

export function useSiteVersion() {
  return useContext(SiteVersionContext)
}

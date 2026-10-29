'use client'
import { createContext, useContext, type ReactNode } from 'react'
const Context = createContext<readonly string[] | null | undefined>(undefined)
export function GuidesPublicationProvider({slugs,children}:{slugs:readonly string[] | null;children:ReactNode}) {
  return <Context.Provider value={slugs}>{children}</Context.Provider>
}
export const usePublishedGuides = () => useContext(Context)

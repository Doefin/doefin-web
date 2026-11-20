import 'server-only'
import type { Language } from '@/lib/languages'
import type { HomeFaqItem } from '@/content/sanity/home-faq-parse'
import type { landing, howItWorks } from './en'

export type LandingCopy = typeof landing
export type HowItWorksCopy = typeof howItWorks

export type NavigationCopy = Readonly<Record<string, string>>

const dictionaries = {
  en: () => import('./en'),
  spn: () => import('./spn'),
  por: () => import('./por'),
  chin: () => import('./chin'),
} satisfies Record<Language, () => Promise<{ landing: LandingCopy; navigation: NavigationCopy; faq: HomeFaqItem[]; howItWorks: HowItWorksCopy }>>

export const getDictionary = (language: Language) => dictionaries[language]()

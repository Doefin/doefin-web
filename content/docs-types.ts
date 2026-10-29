import type { v3DocGroups } from './docs-contract'
export type V3Doc = {
  slug: string
  title: string
  summary: string
  group: typeof v3DocGroups[number]
  sortOrder: number
  reviewedAt?: string
  reviewDateSource?: 'legacy-shared-review-date'
  sections: { id: string; title: string; paragraphs?: string[]; steps?: string[]; definitions?: { term: string; definition: string }[] }[]
  optionalLinks?: { href: string; label: string }[]
  related: string[]
}

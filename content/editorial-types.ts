/** Published editorial view model. Source seeds remain in v3-editorial.ts. */
export type EditorialTopic = { slug: string; label: string }
export type V3EditorialArticle = {
  kind: 'blog' | 'academy'
  slug: string
  title: string
  summary: string
  topics: EditorialTopic[]
  /** Derived labels retained for library search; never used to construct URLs. */
  tags: string[]
  sections: { id: string; heading: string; paragraphs: string[] }[]
  sortOrder: number
  reviewedAt?: string
  publishedAt?: string
  reviewDateSource?: string
}

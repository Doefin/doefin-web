export type ToolGuideContent = {
  /** Publishing metadata for the standalone long-form guide at /academy/guides/<slug>. */
  article: { title: string; seoTitle: string; summary: string; publishedAt?: string }
  whatItIs: string
  whoFor: string
  howToUse: string[]
  inputs: { label: string; means: string; whereToFind: string; typical: string }[]
  readingResults: { figure: string; means: string; soWhat: string }[]
  walkthrough: { title: string; setup: string; steps: string[]; takeaway: string }
  mistakes: string[]
  limits: string[]
}


export type ToolGuide = { slug: string; toolSlug: string; sortOrder: number; reviewedAt?: string; guide: ToolGuideContent }

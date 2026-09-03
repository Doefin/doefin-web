/**
 * Content model. These types are the contract between the content source and the
 * templates. Today the source is the typed files in this directory; when a CMS
 * arrives it becomes the only module that changes.
 */

export type Confidence = 'measured' | 'single-source' | 'judgement'

export type Source = {
  label: string
  url?: string
  accessedAt: string
  confidence: Confidence
}

type Base = {
  slug: string
  title: string
  /** Shorter title for the <title> tag when the on-page heading runs long. */
  seoTitle?: string
  summary: string
  publishedAt: string
  updatedAt?: string
  author: string
  sources?: Source[]
  draft?: boolean
}

export type Post = Base & { tags: string[]; readingMinutes: number; body: string[] }

export type AcademyPost = Base & {
  level: 'intro' | 'working' | 'technical'
  glossaryTerms?: string[]
  body: string[]
}

export type GlossaryTerm = {
  slug: string
  term: string
  shortDef: string
  aliases?: string[]
  body: string[]
  seeAlso?: string[]
  updatedAt: string
}

export type Report = Base & {
  reportId: string
  findings: string[]
  body: string[]
  datasetDoi?: string
}

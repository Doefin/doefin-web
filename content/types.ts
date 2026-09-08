/**
 * Content model. These types are the contract between the content source and the
 * templates. Today the source is the typed files in this directory; when a CMS
 * arrives it becomes the only module that changes.
 */

export type Confidence = 'measured' | 'single-source' | 'judgement'

/**
 * A unit of body copy: a paragraph, or a section heading.
 *
 * `string` stays a member of the union on purpose, so every existing `body: [...]`
 * keeps compiling and headings can be introduced one article at a time.
 *
 * Headings matter more here than they look. A section heading with a stable `id`
 * is the smallest thing an assistant can cite — without them the only address on
 * a page is the page itself, and a reader arriving from a citation lands at the
 * top of a document rather than at the passage that answered them.
 */
export type Block = string | { heading: string; id?: string }

/** Deterministic anchor for a heading, so a cited URL survives an edit elsewhere. */
export const blockId = (b: Extract<Block, { heading: string }>) =>
  b.id ??
  b.heading
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

export const isHeading = (b: Block): b is Extract<Block, { heading: string }> =>
  typeof b !== 'string'

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

export type Post = Base & { tags: string[]; body: Block[] }

export type AcademyPost = Base & {
  level: 'intro' | 'working' | 'technical'
  glossaryTerms?: string[]
  body: Block[]
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
  body: Block[]
  datasetDoi?: string
}

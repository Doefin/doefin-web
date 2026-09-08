/**
 * Content model. These types are the contract between the content source and the
 * templates. Today the source is the typed files in this directory; when a CMS
 * arrives it becomes the only module that changes.
 */

/** One question and its self-contained answer. */
export type QA = { q: string; a: string }

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

/**
 * A number the piece establishes, pulled out so it can be read — and quoted —
 * without reading the prose.
 *
 * `value` is pre-formatted on purpose: the string is what gets cited, so the
 * author controls the units and precision rather than a formatter guessing.
 *
 * `asOf` is not optional. An undated figure is a rumour, and this site's whole
 * argument is that a published number needs a date and a basis attached.
 *
 * A figure must come from a claim the piece already makes and supports — its own
 * findings or its own sources. Lifting a plausible number out of
 * content/sample-data.ts and grading it `measured` is exactly the failure the
 * illustrative badge exists to prevent.
 */
export type KeyFigure = {
  /** Pre-formatted, with units. '4.67 pp', not 4.67. */
  value: string
  /** Under 60 characters, no product language. */
  label: string
  asOf: string
  confidence: Confidence
  /** Where a reader checks it. Expected whenever confidence is 'measured'. */
  href?: string
}

type Base = {
  slug: string
  title: string
  /** Shorter title for the <title> tag when the on-page heading runs long. */
  seoTitle?: string
  summary: string
  publishedAt: string
  updatedAt?: string
  /** A slug in content/authors.ts, not a display name. Resolved by getAuthor(). */
  author: string
  sources?: Source[]
  /** Two to five. More than five is a table, not a summary. */
  keyFigures?: KeyFigure[]
  /**
   * Questions this piece answers, each answer self-contained enough to be lifted
   * out on its own. Every answer must restate a claim the piece already makes.
   */
  faq?: QA[]
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
  /**
   * Questions a reader asks NEXT, never a restatement of the definition.
   *
   * The page already renders the short definition under a heading reading
   * "What is X?", so asking that again in the same words adds nothing, and the
   * aliases render directly above it. Every answer must come from a claim the
   * term's own body already makes.
   */
  faq?: QA[]
  updatedAt: string
}

export type Report = Base & {
  reportId: string
  findings: string[]
  body: Block[]
  datasetDoi?: string
}

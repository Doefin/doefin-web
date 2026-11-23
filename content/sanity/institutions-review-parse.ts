import { institutionsReviewCardCount, institutionsReviewId, institutionsReviewType } from '../institutions-review-contract'
import { isSafeDocsHref } from '../docs-contract'
import type { InstitutionsReview, InstitutionsReviewCard, InstitutionsReviewLink } from '../institutions-review-types'
type Row = Record<string, unknown>
const text = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0

function parseLink(input: unknown): InstitutionsReviewLink {
  if (!input || typeof input !== 'object') throw new Error('Invalid institutions review link')
  const row = input as Row
  const hasHref = text(row.href), hasContact = text(row.contactSubject)
  if (!text(row.label) || hasHref === hasContact) throw new Error('Invalid institutions review link')
  if (hasHref) {
    if (!isSafeDocsHref(row.href)) throw new Error('Unsafe institutions review link href')
    return { label: row.label as string, href: row.href as string }
  }
  return { label: row.label as string, contactSubject: row.contactSubject as string }
}

/** Reject invalid API content instead of publishing partial or misleading pages. */
export function parseInstitutionsReview(value: unknown): InstitutionsReview {
  if (!value || typeof value !== 'object') throw new Error('Sanity institutions review response is not an object')
  const data = value as Row
  if (data._id !== institutionsReviewId || data._type !== institutionsReviewType) throw new Error('Unexpected institutions review document')
  if (typeof data.visible !== 'boolean' ||
    !text(data.eyebrow) || !text(data.heading) || !text(data.intro) || !text(data.riskNote) ||
    !text(data.stripHeading) || !text(data.stripText) || !text(data.stripLabel) || !text(data.stripSubject)) throw new Error('Sanity institutions review page is incomplete')
  if (!Array.isArray(data.cards) || data.cards.length !== institutionsReviewCardCount) throw new Error('Sanity institutions review cards are incomplete')
  const cards: InstitutionsReviewCard[] = data.cards.map((input: unknown) => {
    if (!input || typeof input !== 'object') throw new Error('Invalid institutions review card')
    const row = input as Row
    if (!text(row.title) || !text(row.summary) || !text(row.disclosureSummary) ||
      !Array.isArray(row.disclosureParagraphs) || !row.disclosureParagraphs.length || !row.disclosureParagraphs.every(text) ||
      !Array.isArray(row.links) || !row.links.length) throw new Error('Invalid institutions review card content')
    return {
      title: row.title as string, summary: row.summary as string, disclosureSummary: row.disclosureSummary as string,
      disclosureParagraphs: row.disclosureParagraphs as string[], links: (row.links as unknown[]).map(parseLink),
    }
  })
  return {
    visible: data.visible as boolean,
    eyebrow: data.eyebrow as string, heading: data.heading as string, intro: data.intro as string, riskNote: data.riskNote as string,
    cards,
    stripHeading: data.stripHeading as string, stripText: data.stripText as string, stripLabel: data.stripLabel as string, stripSubject: data.stripSubject as string,
  }
}

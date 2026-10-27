import { guideTools, guideText as text, guideSlug as slug, guideDate } from '../tool-guide-contract'
import type { ToolGuide, ToolGuideContent } from '../tool-guide-types'
type Row = Record<string, unknown>
const publicId = (v: unknown): v is string => text(v) && !/^(drafts|versions)\./.test(v)
export function parseGuideManifest(value: unknown): string[] {
  if (!Array.isArray(value)) throw new Error('Sanity tool guides response is not an array')
  const ids = new Set<string>(), slugs = new Set<string>()
  for (const row of value) {
    if (!row || !publicId(row._id) || row._type !== 'toolGuide' || !slug(row.slug) || ids.has(row._id) || slugs.has(row.slug)) throw new Error('Invalid or duplicate tool guide identity')
    ids.add(row._id); slugs.add(row.slug)
  }
  return [...slugs]
}
function strings(value: unknown): string[] {
  if (!Array.isArray(value) || !value.length || !value.every(text)) throw new Error('Invalid tool guide prose list')
  return [...value]
}
function object(value: unknown, fields: readonly string[]): Row {
  if (!value || typeof value !== 'object' || fields.some(field => !text((value as Row)[field]))) throw new Error('Invalid tool guide text object')
  return Object.fromEntries(fields.map(field => [field,(value as Row)[field]]))
}
export function parseToolGuides(value: unknown): ToolGuide[] {
  parseGuideManifest(value)
  return (value as Row[]).map(row => {
    if (!(guideTools as readonly unknown[]).includes(row.toolSlug) || !Number.isInteger(row.sortOrder) || Number(row.sortOrder) < 0 || (!guideDate(row.reviewedAt) || !guideDate((row.article as Row | null)?.publishedAt))) throw new Error('Invalid tool guide tool/order/date')
    if ((guideTools as readonly unknown[]).includes(row.slug) && row.toolSlug !== row.slug) throw new Error('Canonical tool guide mapping changed')
    const article = object(row.article,['title','seoTitle','summary'])
    const publishedAt = (row.article as Row).publishedAt
    if (!Array.isArray(row.inputs) || !row.inputs.length || !Array.isArray(row.readingResults) || !row.readingResults.length) throw new Error('Invalid tool guide inputs/results')
    const walkthrough = object(row.walkthrough,['title','setup','takeaway'])
    const guide = {
      article: {...article,...(publishedAt ? {publishedAt}: {})},
      ...object(row,['whatItIs','whoFor']), howToUse:strings(row.howToUse),
      inputs:row.inputs.map(input => object(input,['label','means','whereToFind','typical'])),
      readingResults:row.readingResults.map(result => object(result,['figure','means','soWhat'])),
      walkthrough:{...walkthrough,steps:strings((row.walkthrough as Row).steps)},
      mistakes:strings(row.mistakes),limits:strings(row.limits),
    } as ToolGuideContent
    return {slug:row.slug as string,toolSlug:row.toolSlug as string,sortOrder:Number(row.sortOrder),...(row.reviewedAt ? {reviewedAt:row.reviewedAt as string}:{}),guide}
  }).sort((a,b) => a.sortOrder-b.sortOrder || a.slug.localeCompare(b.slug))
}

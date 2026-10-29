import type { SanityClient, SanityDocument } from '@sanity/client'

type IdentityDocument = Pick<SanityDocument, '_id'> & {
  _type?: string; _rev?: string; slug?: { current?: string }; canonicalSlug?: string
  kind?: string; canonicalKind?: string; label?: string; toolSlug?: string; canonicalToolSlug?: string
}
type IdentityContext = { document?: IdentityDocument; getClient: (options: { apiVersion: string }) => SanityClient }
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const publishedIdentity = (id: string) => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id
const importedEditorialIdentity = (id: string) => /^editorial-(blog|academy)-(.+)$/.exec(publishedIdentity(id))
export function fixedSlug(document: IdentityDocument): string | undefined {
  const id = publishedIdentity(document._id)
  if (id.startsWith('glossary-')) return id.slice('glossary-'.length)
  if (id.startsWith('topic-')) return id.slice('topic-'.length)
  if (id.startsWith('tool-guide-')) return id.slice('tool-guide-'.length)
  if (id.startsWith('docs-')) return id.slice('docs-'.length)
  if (id.startsWith('research-report-')) return id.slice('research-report-'.length)
  if (id.startsWith('research-methodology-')) return id.slice('research-methodology-'.length)
  return importedEditorialIdentity(id)?.[2] ?? document.canonicalSlug
}
export function fixedKind(document: IdentityDocument): string | undefined {
  return importedEditorialIdentity(document._id)?.[1] ?? document.canonicalKind
}
const identityRows = (context: IdentityContext) => {
  const id = publishedIdentity(context.document!._id)
  return context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw', useCdn: false })
    .fetch<IdentityDocument[]>('*[_id in $ids]{_id,_type,slug,kind,canonicalSlug,canonicalKind,toolSlug,canonicalToolSlug}', { ids: [id, `drafts.${id}`] })
}

/** The stored stamp survives unpublish; imported IDs independently encode identity. */
export async function validatePermanentSlug(value: unknown, context: IdentityContext): Promise<true | string> {
  const slug = (value as { current?: string } | undefined)?.current
  if (!slug || !validSlug.test(slug)) return 'Use lowercase words separated by hyphens.'
  if (!context.document) return true
  const kind = context.document.kind
  if (context.document._type === 'editorialArticle' && ((kind === 'blog' && slug === 'tag') || (kind === 'academy' && slug === 'guides'))) return 'This slug is reserved for an existing route.'
  let locked = fixedSlug(context.document)
  if (!locked) {
    const id = publishedIdentity(context.document._id)
    const rows = await identityRows(context)
    locked = rows.map(row => row.canonicalSlug).find(Boolean) ?? rows.find(row => row._id === id)?.slug?.current
  }
  return !locked || locked === slug || 'This document has a permanent public URL. Keep its original slug; URL changes require a separate reviewed redirect migration.'
}

export async function validatePermanentKind(value: unknown, context: IdentityContext): Promise<true | string> {
  if (value !== 'blog' && value !== 'academy') return 'Choose blog or academy.'
  if (!context.document) return true
  let locked = fixedKind(context.document)
  if (!locked) {
    const id = publishedIdentity(context.document._id)
    const rows = await identityRows(context)
    locked = rows.map(row => row.canonicalKind).find(Boolean) ?? rows.find(row => row._id === id)?.kind
  }
  return !locked || locked === value || 'The published article kind is permanent because it is part of the public URL.'
}

export function fixedTool(document: IdentityDocument): string | undefined {
  const id=publishedIdentity(document._id)
  return ['hosting-effective-rate','difficulty-exposure','fleet-payback'].map(slug=>`tool-guide-${slug}`).includes(id) ? id.slice('tool-guide-'.length) : document.canonicalToolSlug
}
export async function validatePermanentTool(value: unknown, context: IdentityContext): Promise<true | string> {
  if (!['hosting-effective-rate','difficulty-exposure','fleet-payback'].includes(String(value))) return 'Choose a supported calculator.'
  if(!context.document) return true
  if (['hosting-effective-rate','difficulty-exposure','fleet-payback'].includes(context.document.slug?.current ?? '') && value !== context.document.slug?.current) return 'Canonical calculator guides must keep the matching calculator.'
  let locked=fixedTool(context.document)
  if(!locked) {
    const id=publishedIdentity(context.document._id),rows=await identityRows(context)
    locked=rows.map(row=>row.canonicalToolSlug).find(Boolean) ?? rows.find(row=>row._id===id)?.toolSlug
  }
  return !locked || locked === value || 'Keep the original calculator identity after publication.'
}

/** Sanity's default slug uniqueness is type-wide; article routes are kind-scoped. */
export async function isUniqueContentSlug(slug: string, context: IdentityContext): Promise<boolean> {
  const doc = context.document
  if (!doc || !validSlug.test(slug)) return false
  const id = publishedIdentity(doc._id)
  const rows = await context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw', useCdn: false })
    .fetch<IdentityDocument[]>('*[_type == $type && slug.current == $slug]{_id,kind}', { type: doc._type, slug })
  return !rows.some(row => publishedIdentity(row._id) !== id && (doc._type !== 'editorialArticle' || row.kind === doc.kind))
}

export async function validateUniqueTopicLabel(value: unknown, context: IdentityContext): Promise<true | string> {
  if (typeof value !== 'string' || !value.trim()) return 'A topic label is required.'
  if (!context.document) return true
  const normalize = (label: string) => label.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '-')
  const id = publishedIdentity(context.document._id)
  const rows = await context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw', useCdn: false })
    .fetch<IdentityDocument[]>('*[_type == "topic"]{_id,label}', {})
  return !rows.some(row => publishedIdentity(row._id) !== id && typeof row.label === 'string' && normalize(row.label) === normalize(value)) || 'An equivalent topic label already exists. Reference that topic instead.'
}

/** Called before Sanity's built-in publish. Revision guard prevents stamping a
 * route that another editor changed since this draft was read.
 */
export async function stampPermanentSlug(client: SanityClient, documentId: string): Promise<void> {
  const id = publishedIdentity(documentId)
  const rows = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch<IdentityDocument[]>(
    '*[_id in $ids]{_id,_type,_rev,slug,kind,canonicalSlug,canonicalKind,toolSlug,canonicalToolSlug}', { ids: [id, `drafts.${id}`] },
  )
  const draft = rows.find(row => row._id === `drafts.${id}`)
  if (!draft?._rev || !draft.slug?.current) throw new Error('Wait for the draft to finish saving before publishing.')
  const published = rows.find(row => row._id === id)
  const locked = fixedSlug(draft) ?? (published && (fixedSlug(published) ?? published.slug?.current)) ?? draft.slug.current
  if (draft.slug.current !== locked) throw new Error('Restore the permanent slug before publishing.')
  const kind = draft._type === 'editorialArticle' ? fixedKind(draft) ?? (published && (fixedKind(published) ?? published.kind)) ?? draft.kind : undefined
  if (draft._type === 'editorialArticle' && (!['blog', 'academy'].includes(kind ?? '') || draft.kind !== kind)) throw new Error('Restore the permanent article kind before publishing.')
  const tool = draft._type === 'toolGuide' ? fixedTool(draft) ?? (published && (fixedTool(published) ?? published.toolSlug)) ?? draft.toolSlug : undefined
  if (draft._type === 'toolGuide' && ['hosting-effective-rate','difficulty-exposure','fleet-payback'].includes(draft.slug.current) && draft.toolSlug !== draft.slug.current) throw new Error('Canonical calculator guides must keep the matching calculator.')
  if (draft._type === 'toolGuide' && (!['hosting-effective-rate','difficulty-exposure','fleet-payback'].includes(tool ?? '') || draft.toolSlug !== tool)) throw new Error('Restore the permanent calculator identity before publishing.')
  if (draft.canonicalSlug === locked && (!kind || draft.canonicalKind === kind) && (!tool || draft.canonicalToolSlug === tool)) return
  await client.patch(draft._id).ifRevisionId(draft._rev).setIfMissing({ canonicalSlug: locked, ...(kind ? { canonicalKind: kind } : {}), ...(tool ? { canonicalToolSlug: tool } : {}) }).commit()
}

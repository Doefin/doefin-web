import type { SanityClient, SanityDocument } from '@sanity/client'

type IdentityDocument = Pick<SanityDocument, '_id'> & { _rev?: string; slug?: { current?: string }; canonicalSlug?: string }
export const publishedIdentity = (id: string) => id.replace(/^drafts\./, '')
export function fixedSlug(document: IdentityDocument): string | undefined {
  const id = publishedIdentity(document._id)
  return id.startsWith('glossary-') ? id.slice('glossary-'.length) : document.canonicalSlug
}

/** The stored stamp survives unpublish; imported IDs independently encode identity. */
export async function validatePermanentSlug(value: unknown, context: {
  document?: IdentityDocument; getClient: (options: { apiVersion: string }) => SanityClient
}): Promise<true | string> {
  const slug = (value as { current?: string } | undefined)?.current
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return 'Use lowercase words separated by hyphens.'
  if (!context.document) return true
  let locked = fixedSlug(context.document)
  if (!locked) {
    const id = publishedIdentity(context.document._id)
    const rows = await context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw', useCdn: false })
      .fetch<IdentityDocument[]>('*[_id in $ids]{_id,slug,canonicalSlug}', { ids: [id, `drafts.${id}`] })
    locked = rows.map(row => row.canonicalSlug).find(Boolean) ?? rows.find(row => row._id === id)?.slug?.current
  }
  return !locked || locked === slug || 'This term has a permanent public URL. Keep its original slug; URL changes require a separate reviewed redirect migration.'
}

/** Called before delegating to Sanity's built-in publish operation. Revision guard
 * prevents stamping a slug that another editor changed since this draft was read.
 */
export async function stampPermanentSlug(client: SanityClient, documentId: string): Promise<void> {
  const id = publishedIdentity(documentId)
  const rows = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch<IdentityDocument[]>(
    '*[_id in $ids]{_id,_rev,slug,canonicalSlug}', { ids: [id, `drafts.${id}`] },
  )
  const draft = rows.find(row => row._id === `drafts.${id}`)
  if (!draft?._rev || !draft.slug?.current) throw new Error('Wait for the draft to finish saving before publishing.')
  const published = rows.find(row => row._id === id)
  const locked = fixedSlug(draft) ?? (published && (fixedSlug(published) ?? published.slug?.current)) ?? draft.slug.current
  if (draft.slug.current !== locked) throw new Error('Restore the permanent slug before publishing.')
  if (draft.canonicalSlug === locked) return
  await client.patch(draft._id).ifRevisionId(draft._rev).setIfMissing({ canonicalSlug: locked }).commit()
}

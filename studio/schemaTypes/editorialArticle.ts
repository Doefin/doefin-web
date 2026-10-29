import { isEditorialAnchor } from '../../content/editorial-contract'
import { defineArrayMember, defineField, defineType } from 'sanity'
import { isUniqueContentSlug, validatePermanentKind, validatePermanentSlug } from '../glossaryIdentity'

const nonBlank = (value: unknown) => typeof value === 'string' && value.trim().length > 0 || 'Enter nonempty text.'
export const editorialArticle = defineType({
  name: 'editorialArticle', title: 'Article / Academy lesson', type: 'document',
  fields: [
    defineField({ name: 'canonicalSlug', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'canonicalKind', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'kind', type: 'string', options: { list: [{ title: 'Blog article', value: 'blog' }, { title: 'Academy lesson', value: 'academy' }] }, description: 'Part of the public URL. Once published, keep this kind unchanged.', validation: rule => rule.required().custom(validatePermanentKind) }),
    defineField({ name: 'title', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96, isUnique: isUniqueContentSlug }, description: 'Permanent public URL. Blog tag and Academy guides are reserved route prefixes.', validation: rule => rule.required().custom(validatePermanentSlug) }),
    defineField({ name: 'summary', type: 'text', rows: 3, validation: rule => rule.required().custom(nonBlank) }),
    defineField({ name: 'sortOrder', type: 'number', initialValue: 1000, description: 'Library order; lower numbers first. Existing five articles retain their original order.', validation: rule => rule.required().integer().min(0) }),
    defineField({ name: 'topics', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'topic' }] })], validation: rule => rule.required().min(1).unique().custom(async (value, context) => {
      if (!Array.isArray(value) || !value.length) return 'Choose at least one published topic.'
      if (value.some(ref => ref && typeof ref === 'object' && '_weak' in ref && ref._weak)) return 'Topic references must be strong.'
      const refs = value.map(ref => ref && typeof ref === 'object' && '_ref' in ref ? ref._ref : undefined)
      if (refs.some(id => typeof id !== 'string' || id.startsWith('drafts.') || id.startsWith('versions.'))) return 'Reference published topic identities.'
      const published = await context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'published', useCdn: false })
        .fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: refs })
      return refs.every(id => published.some(doc => doc._id === id && doc._type === 'topic')) || 'Publish referenced topics before publishing the article.'
    }) }),
    defineField({ name: 'sections', type: 'array', of: [defineArrayMember({ name: 'editorialSection', type: 'object', fields: [
      defineField({ name: 'id', title: 'Stable heading anchor', type: 'string', description: 'Deep links use this ID. Keep published IDs stable when editing heading text; review any intentional ID changes.', validation: rule => rule.required().custom(value => isEditorialAnchor(value) || 'Use a nonreserved lowercase heading anchor; main, navigation IDs and article template IDs are reserved.') }),
      defineField({ name: 'heading', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
      defineField({ name: 'paragraphs', type: 'array', of: [defineArrayMember({ type: 'text', rows: 4, validation: rule => rule.required().custom(nonBlank) })], validation: rule => rule.required().min(1) }),
    ], preview: { select: { title: 'heading', subtitle: 'id' } } })], validation: rule => rule.required().min(1).custom(value => {
      if (!Array.isArray(value)) return true
      const anchors = value.map(section => section && typeof section === 'object' && 'id' in section ? section.id : undefined)
      return new Set(anchors).size === anchors.length || 'Every section needs a unique heading anchor.'
    }) }),
    defineField({ name: 'reviewedAt', title: 'Last reviewed date (optional)', type: 'date', description: 'Editorial review date. It is not a publication date.' }),
    defineField({ name: 'publishedAt', title: 'First publication date (optional)', type: 'date', description: 'Set only when supported by publication evidence. Do not copy the review date into this field.' }),
    defineField({ name: 'reviewDateSource', type: 'string', hidden: true, readOnly: true, validation: rule => rule.custom(value => !value || value === 'legacy-shared-review-date' || 'Unknown migration provenance.') }),
  ],
  preview: { select: { title: 'title', subtitle: 'kind' } },
  orderings: [{ title: 'Library order', name: 'libraryOrder', by: [{ field: 'sortOrder', direction: 'asc' }, { field: 'title', direction: 'asc' }] }],
})

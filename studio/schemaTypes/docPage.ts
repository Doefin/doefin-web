import { defineArrayMember, defineField, defineType } from 'sanity'
import { isDocsAnchor, isSafeDocsHref, v3DocGroups } from '../../content/docs-contract'
import { isUniqueContentSlug, publishedIdentity, validatePermanentSlug } from '../glossaryIdentity'

const nonBlank = (value: unknown) => typeof value === 'string' && value.trim().length > 0 || 'Enter nonempty text.'
export const docPage = defineType({
  name: 'docPage', title: 'Documentation page', type: 'document',
  fields: [
    defineField({ name: 'canonicalSlug', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'title', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title', maxLength: 96, isUnique: isUniqueContentSlug },
      description: 'Permanent documentation URL. Keep it unchanged after first publication.', validation: rule => rule.required().custom(validatePermanentSlug) }),
    defineField({ name: 'summary', type: 'text', rows: 3, validation: rule => rule.required().custom(nonBlank) }),
    defineField({ name: 'group', type: 'string', options: { list: v3DocGroups.map(group => ({ title: group, value: group })) },
      validation: rule => rule.required().custom(value => (v3DocGroups as readonly unknown[]).includes(value) || 'Choose a documentation navigation group.') }),
    defineField({ name: 'sortOrder', type: 'number', initialValue: 1000, description: 'Global reading order. Existing documentation retains its original 0–17 sequence.', validation: rule => rule.required().integer().min(0) }),
    defineField({ name: 'reviewedAt', title: 'Last reviewed date (optional)', type: 'date', description: 'Set only when the page was editorially reviewed. This is not a publication date.' }),
    defineField({ name: 'reviewDateSource', type: 'string', hidden: true, readOnly: true,
      validation: rule => rule.custom(value => !value || value === 'legacy-shared-review-date' || 'Unknown migration provenance.') }),
    defineField({ name: 'sections', type: 'array', of: [defineArrayMember({ name: 'docSection', type: 'object', fields: [
      defineField({ name: 'id', title: 'Stable section anchor', type: 'string', description: 'Existing deep links use this ID. Keep it stable when changing the section title.',
        validation: rule => rule.required().custom(value => isDocsAnchor(value) || 'Use a nonreserved lowercase anchor; shell, navigation and Docs template IDs are reserved.') }),
      defineField({ name: 'title', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
      defineField({ name: 'paragraphs', type: 'array', of: [defineArrayMember({ type: 'text', rows: 4, validation: rule => rule.required().custom(nonBlank) })], validation: rule => rule.min(1) }),
      defineField({ name: 'steps', type: 'array', of: [defineArrayMember({ type: 'text', rows: 3, validation: rule => rule.required().custom(nonBlank) })], validation: rule => rule.min(1) }),
      defineField({ name: 'definitions', type: 'array', of: [defineArrayMember({ name: 'docDefinition', type: 'object', fields: [
        defineField({ name: 'term', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
        defineField({ name: 'definition', type: 'text', rows: 3, validation: rule => rule.required().custom(nonBlank) }),
      ], preview: { select: { title: 'term', subtitle: 'definition' } } })], validation: rule => rule.min(1) }),
    ], validation: rule => rule.custom(value => {
      if (!value || typeof value !== 'object') return 'A section is required.'
      const section = value as { paragraphs?: unknown[]; steps?: unknown[]; definitions?: unknown[] }
      return [section.paragraphs, section.steps, section.definitions].some(items => Array.isArray(items) && items.length > 0) || 'Add paragraphs, steps or definitions to the section.'
    }), preview: { select: { title: 'title', subtitle: 'id' } } })], validation: rule => rule.required().min(1).custom(value => {
      if (!Array.isArray(value)) return true
      const anchors = value.map(section => section && typeof section === 'object' && 'id' in section ? section.id : undefined)
      return new Set(anchors).size === anchors.length || 'Each section needs a unique anchor.'
    }) }),
    defineField({ name: 'optionalLinks', title: 'Optional tools / further reading', type: 'array', of: [defineArrayMember({ name: 'docOptionalLink', type: 'object', fields: [
      defineField({ name: 'href', title: 'Destination', type: 'string', validation: rule => rule.required().custom(value => isSafeDocsHref(value) || 'Use a site-root path or HTTPS URL without unsafe encoding, controls or credentials.') }),
      defineField({ name: 'label', type: 'string', validation: rule => rule.required().custom(nonBlank) }),
    ], preview: { select: { title: 'label', subtitle: 'href' } } })], validation: rule => rule.custom(value => {
      if (!Array.isArray(value)) return true
      const hrefs = value.map(link => link && typeof link === 'object' && 'href' in link ? link.href : undefined)
      return new Set(hrefs).size === hrefs.length || 'Each optional destination must appear only once.'
    }) }),
    defineField({ name: 'related', title: 'Related documentation', type: 'array',
      description: 'Optional recommendations use weak references so referenced pages can be unpublished independently. Unpublished recommendations are hidden on the website.',
      of: [defineArrayMember({ type: 'reference', weak: true, to: [{ type: 'docPage' }], options: {
        filter: ({ document }) => ({ filter: '_id != $id', params: { id: publishedIdentity(document._id) } }),
      } })], validation: rule => rule.unique().custom(async (value, context) => {
        if (value === undefined || value === null) return true
        if (!Array.isArray(value)) return 'Choose related documentation pages.'
        const id = context.document?._id ? publishedIdentity(context.document._id) : undefined
        const refs = value.map(ref => ref && typeof ref === 'object' && '_ref' in ref ? ref._ref : undefined)
        if (value.some(ref => !ref || typeof ref !== 'object' || !('_weak' in ref) || ref._weak !== true) ||
          refs.some(ref => typeof ref !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(ref) || ref === id) || new Set(refs).size !== refs.length) {
          return 'Use unique weak references to other canonical documentation identities.'
        }
        if (!refs.length) return true
        const rows = await context.getClient({ apiVersion: '2025-02-19' }).withConfig({ perspective: 'raw', useCdn: false })
          .fetch<{ _id: string; _type: string }[]>('*[_id in $ids]{_id,_type}', { ids: refs.flatMap(ref => [ref, `drafts.${ref}`]) })
        return rows.every(doc => doc._type === 'docPage') || 'Related references must point to documentation pages.'
      }) }),
  ],
  preview: { select: { title: 'title', subtitle: 'group' } },
  orderings: [{ title: 'Reading order', name: 'readingOrder', by: [{ field: 'sortOrder', direction: 'asc' }, { field: 'title', direction: 'asc' }] }],
})

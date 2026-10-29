import { defineField, defineType } from 'sanity'
import { isUniqueContentSlug, validatePermanentSlug, validateUniqueTopicLabel } from '../glossaryIdentity'

export const topic = defineType({
  name: 'topic', title: 'Editorial topic', type: 'document',
  fields: [
    defineField({ name: 'canonicalSlug', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'label', type: 'string', description: 'Reusable topic label. Articles reference this document instead of typing new tags.', validation: rule => rule.required().custom(validateUniqueTopicLabel) }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'label', maxLength: 96, isUnique: isUniqueContentSlug },
      description: 'Permanent topic URL identity; preserve after first publication.', validation: rule => rule.required().custom(validatePermanentSlug) }),
  ],
  preview: { select: { title: 'label', subtitle: 'slug.current' } },
  orderings: [{ title: 'Label A–Z', name: 'labelAsc', by: [{ field: 'label', direction: 'asc' }] }],
})

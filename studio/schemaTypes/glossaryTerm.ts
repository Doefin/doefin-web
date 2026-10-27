import { defineArrayMember, defineField, defineType } from 'sanity'
import { validatePermanentSlug } from '../glossaryIdentity'

export const glossaryTerm = defineType({
  name: 'glossaryTerm', title: 'Glossary term', type: 'document',
  fields: [
    defineField({ name: 'canonicalSlug', title: 'Permanent URL identity', type: 'string', hidden: true, readOnly: true }),
    defineField({ name: 'term', type: 'string', validation: r => r.required() }),
    defineField({
      name: 'slug', type: 'slug', options: { source: 'term', maxLength: 96 },
      description: 'Public URL. Once published, keep this stable so existing links survive.',
      validation: r => r.required().custom(validatePermanentSlug),
    }),
    defineField({ name: 'shortDef', title: 'Short definition', type: 'text', rows: 3,
      description: 'Factual, quotable definition. Fewer than 160 characters.', validation: r => r.required().max(159) }),
    defineField({ name: 'browseTopic', title: 'Browse topic', type: 'string',
      options: { list: [
        { title: 'Network & difficulty', value: 'network' }, { title: 'Revenue & pools', value: 'revenue' },
        { title: 'Operations', value: 'operations' }, { title: 'Forecast uncertainty', value: 'uncertainty' },
      ] }, validation: r => r.required().custom(value => ['network', 'revenue', 'operations', 'uncertainty'].includes(String(value)) || 'Choose a browse topic.') }),
    defineField({ name: 'domain', title: 'Domain (optional)', type: 'string',
      description: 'Separate from browse topic. Leave unset until the network/product classification is agreed.',
      options: { list: [{ title: 'Network', value: 'network' }, { title: 'Product', value: 'product' }] },
      validation: r => r.custom(value => !value || ['network', 'product'].includes(String(value)) || 'Choose network or product.') }),
    defineField({ name: 'aliases', type: 'array', of: [defineArrayMember({ type: 'string', validation: r => r.required() })], validation: r => r.unique() }),
    defineField({ name: 'body', title: 'Explanation paragraphs', type: 'array',
      of: [defineArrayMember({ type: 'text', rows: 4, validation: r => r.required() })], validation: r => r.required().min(1) }),
    defineField({ name: 'seeAlso', title: 'Related terms', type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'glossaryTerm' }], options: {
        filter: ({ document }) => ({ filter: '_id != $id', params: { id: document._id.replace(/^drafts\./, '') } }),
      } })], validation: r => r.unique().custom((refs, context) => {
        const id = context.document?._id.replace(/^drafts\./, '')
        return !refs?.some(ref => ref && typeof ref === 'object' && '_ref' in ref && ref._ref === id) || 'A term cannot reference itself.'
      }) }),
    defineField({ name: 'faq', title: 'Questions and answers', type: 'array', of: [defineArrayMember({
      name: 'questionAnswer', type: 'object', fields: [
        defineField({ name: 'q', title: 'Question', type: 'string', validation: r => r.required() }),
        defineField({ name: 'a', title: 'Answer', type: 'text', rows: 4, validation: r => r.required() }),
      ], preview: { select: { title: 'q' } },
    })] }),
    defineField({ name: 'updatedAt', title: 'Last reviewed date', type: 'date',
      description: 'Editorial review date, preserved separately from the CMS modification timestamp.', validation: r => r.required() }),
  ],
  preview: { select: { title: 'term', subtitle: 'browseTopic' } },
  orderings: [{ title: 'Term A–Z', name: 'termAsc', by: [{ field: 'term', direction: 'asc' }] }],
})

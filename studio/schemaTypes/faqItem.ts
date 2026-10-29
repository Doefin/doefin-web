import { defineField, defineType } from 'sanity'
import { faqText, safeFaqHref } from '../../content/home-faq-contract'
const nonBlank = (v: unknown) => faqText(v) || 'Enter nonempty plain text.'
export const faqItem = defineType({ name:'faqItem', title:'FAQ answer', type:'document', fields:[
 defineField({name:'question',type:'string',validation:r=>r.required().custom(nonBlank)}),
 defineField({name:'answer',type:'text',rows:4,validation:r=>r.required().custom(nonBlank)}),
 defineField({name:'href',title:'Related link',type:'string',validation:r=>r.required().custom(v=>safeFaqHref(v)||'Use a safe root-relative URL.')}),
 defineField({name:'label',title:'Link label',type:'string',validation:r=>r.required().custom(nonBlank)}),
], preview:{select:{title:'question',subtitle:'label'}} })

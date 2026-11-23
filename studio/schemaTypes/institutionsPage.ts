import { defineArrayMember, defineField, defineType } from 'sanity'
import { isSafeDocsHref } from '../../content/docs-contract'
import { institutionsReviewCardCount } from '../../content/institutions-review-contract'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
export const institutionsPage=defineType({name:'institutionsPage',title:'Institutions page',type:'document',fields:[
  defineField({name:'eyebrow',title:'Review section eyebrow',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'heading',title:'Review section heading',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'intro',title:'Review section intro',type:'text',rows:3,validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'riskNote',title:'Risk note',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'cards',title:'Review cards',type:'array',of:[defineArrayMember({name:'reviewCard',title:'Review card',type:'object',fields:[
    defineField({name:'title',type:'string',validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'summary',type:'text',rows:2,validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'disclosureSummary',title:'Disclosure summary',type:'string',validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'disclosureParagraphs',title:'Disclosure paragraphs',type:'array',of:[defineArrayMember({type:'text',rows:3,validation:r=>r.required().custom(nonBlank)})],validation:r=>r.required().min(1)}),
    defineField({name:'links',type:'array',of:[defineArrayMember({name:'reviewLink',title:'Review link',type:'object',fields:[
      defineField({name:'label',type:'string',validation:r=>r.required().custom(nonBlank)}),
      defineField({name:'href',title:'Href (site path or HTTPS)',type:'string',validation:r=>r.custom(v=>v===undefined||v===''||isSafeDocsHref(v)||'Use a site path or an HTTPS URL.')}),
      defineField({name:'contactSubject',title:'Contact subject (emails the team inbox)',type:'string'}),
    ],validation:r=>r.custom((link:{href?:unknown,contactSubject?:unknown}|undefined)=>{
      if(!link)return true
      const hasHref=typeof link.href==='string'&&link.href.trim().length>0
      const hasContact=typeof link.contactSubject==='string'&&link.contactSubject.trim().length>0
      return hasHref!==hasContact||'Set either an href or a contact subject, never both.'
    }),preview:{select:{title:'label',subtitle:'href'}}})],validation:r=>r.required().min(1)}),
  ],preview:{select:{title:'title'}}})],validation:r=>r.required().length(institutionsReviewCardCount)}),
  defineField({name:'stripHeading',title:'Contact strip heading',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'stripText',title:'Contact strip text',type:'text',rows:2,validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'stripLabel',title:'Contact strip link label',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'stripSubject',title:'Contact strip email subject',type:'string',validation:r=>r.required().custom(nonBlank)}),
],preview:{prepare:()=>({title:'For institutions'})}})

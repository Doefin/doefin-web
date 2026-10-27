import { defineArrayMember, defineField, defineType } from 'sanity'
import { isResearchAnchor } from '../../content/research-contract'
import { isUniqueContentSlug, validatePermanentSlug } from '../glossaryIdentity'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
export const researchReport=defineType({name:'researchReport',title:'Research report',type:'document',fields:[
  defineField({name:'slug',type:'slug',options:{source:'title',maxLength:96,isUnique:isUniqueContentSlug},validation:r=>r.required().custom((v,c)=>validatePermanentSlug(v,c))}),
  defineField({name:'title',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'summary',type:'text',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'seoSummary',type:'text',validation:r=>r.custom(v=>v===undefined||nonBlank(v)===true||'Enter nonempty text.')}),
  defineField({name:'publishedAt',type:'date',validation:r=>r.required()}),
  defineField({name:'sections',type:'array',of:[defineArrayMember({type:'object',name:'researchSection',fields:[
    defineField({name:'id',title:'Stable heading anchor',type:'string',description:'Deep links use this ID. Keep published IDs stable when editing heading text.',validation:r=>r.required().custom(v=>isResearchAnchor(v)||'Use a safe stable anchor.')}),
    defineField({name:'heading',type:'string',validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'paragraphs',type:'array',of:[defineArrayMember({type:'text',validation:r=>r.required().custom(nonBlank)})],validation:r=>r.required().min(1)}),
  ]})],validation:r=>r.required().min(1)}),
],preview:{select:{title:'title',subtitle:'publishedAt'}}})

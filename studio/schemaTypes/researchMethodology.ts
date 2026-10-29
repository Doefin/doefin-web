import { defineArrayMember, defineField, defineType } from 'sanity'
import { isResearchAnchor } from '../../content/research-contract'
import { isUniqueContentSlug, validatePermanentSlug } from '../glossaryIdentity'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
export const researchMethodology=defineType({name:'researchMethodology',title:'Research methodology',type:'document',fields:[
  defineField({name:'slug',type:'slug',options:{source:'title',maxLength:96,isUnique:isUniqueContentSlug},validation:r=>r.required().custom((v,c)=>validatePermanentSlug(v,c))}),
  defineField({name:'sections',type:'array',of:[defineArrayMember({type:'object',name:'researchSection',fields:[
    defineField({name:'id',title:'Stable heading anchor',type:'string',description:'Deep links use this ID. Keep published IDs stable when editing heading text.',validation:r=>r.required().custom(v=>isResearchAnchor(v)||'Use a safe stable anchor.')}),
    defineField({name:'heading',type:'string',validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'paragraphs',type:'array',of:[defineArrayMember({type:'text',validation:r=>r.required().custom(nonBlank)})],validation:r=>r.required().min(1)}),
  ]})],validation:r=>r.required().min(4).max(4)}),
],preview:{prepare:()=>({title:'Difficulty forecast methodology'})}})

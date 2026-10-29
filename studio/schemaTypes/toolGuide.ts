import { defineArrayMember, defineField, defineType } from 'sanity'
import { guideTools, guideDate, guideText } from '../../content/tool-guide-contract'
import { isUniqueContentSlug, validatePermanentSlug, validatePermanentTool } from '../glossaryIdentity'
const nonBlank = (value: unknown) => guideText(value) || 'Enter nonempty text.'
const prose = (name: string) => defineField({name,type:'text',rows:3,validation:rule=>rule.required().custom(nonBlank)})
const list = (name: string) => defineField({name,type:'array',of:[defineArrayMember({type:'text',rows:3,validation:rule=>rule.required().custom(nonBlank)})],validation:rule=>rule.required().min(1)})
const objectList = (name: string, fields: string[]) => defineField({name,type:'array',of:[defineArrayMember({name:`${name}Entry`,type:'object',fields:fields.map(prose),preview:{select:{title:fields[0]}}})],validation:rule=>rule.required().min(1)})
export const toolGuide = defineType({name:'toolGuide',title:'Calculator guide',type:'document',fields:[
  defineField({name:'canonicalSlug',type:'string',hidden:true,readOnly:true}),
  defineField({name:'canonicalToolSlug',type:'string',hidden:true,readOnly:true}),
  defineField({name:'slug',type:'slug',description:'Permanent guide URL, independent of the calculator URL.',options:{source:'article.title',maxLength:96,isUnique:isUniqueContentSlug},validation:rule=>rule.required().custom(validatePermanentSlug)}),
  defineField({name:'toolSlug',title:'Calculator',type:'string',description:'Permanent calculator identity. Formula, bounds, presets and calculator microcopy stay in code.',options:{list:guideTools.map(value=>({title:value,value}))},validation:rule=>rule.required().custom(validatePermanentTool)}),
  defineField({name:'sortOrder',type:'number',initialValue:1000,validation:rule=>rule.required().integer().min(0)}),
  defineField({name:'reviewedAt',type:'date',description:'Optional editorial review date. Initial guides preserve the shared 31 August 2026 review footer.',validation:rule=>rule.custom(value=>guideDate(value)||'Use a real calendar date.')}),
  defineField({name:'article',type:'object',validation:rule=>rule.required(),fields:[...['title','seoTitle','summary'].map(prose),defineField({name:'publishedAt',type:'date',description:'Optional known publication date; never inferred from review date.',validation:rule=>rule.custom(value=>guideDate(value)||'Use a real calendar date.')})]}),
  prose('whatItIs'),prose('whoFor'),list('howToUse'),
  objectList('inputs',['label','means','whereToFind','typical']),
  objectList('readingResults',['figure','means','soWhat']),
  defineField({name:'walkthrough',type:'object',validation:rule=>rule.required(),fields:[prose('title'),prose('setup'),list('steps'),prose('takeaway')]}),
  list('mistakes'),list('limits'),
],preview:{select:{title:'article.title',subtitle:'toolSlug'}},orderings:[{name:'guideOrder',title:'Reading order',by:[{field:'sortOrder',direction:'asc'}]}]})

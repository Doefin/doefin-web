import { defineField, defineType } from 'sanity'
import { isSafeDocsHref } from '../../content/docs-contract'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
export const authorProfile=defineType({name:'authorProfile',title:'Author profile',type:'document',fields:[
  defineField({name:'slug',type:'string',readOnly:true,validation:r=>r.required().custom(v=>v==='doefin-research'||'Only existing author identities are currently managed here.')}),
  defineField({name:'kind',type:'string',options:{list:[{title:'Organization',value:'organization'},{title:'Person',value:'person'}]},validation:r=>r.required()}),
  defineField({name:'name',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'url',type:'string',validation:r=>r.required().custom(v=>isSafeDocsHref(v)||'Use a site-root path or safe HTTPS URL.')}),
  defineField({name:'description',type:'text',rows:4,validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'metadataDescription',title:'Structured data description',type:'text',rows:3,validation:r=>r.custom(v=>v===undefined||v===null||nonBlank(v)===true||'Enter nonempty text.')}),
  defineField({name:'sameAs',title:'External identity URLs',type:'array',of:[{type:'url'}],validation:r=>r.unique()}),
],preview:{select:{title:'name',subtitle:'kind'}}})

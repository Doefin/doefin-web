import { defineField, defineType } from 'sanity'
import { isSafeDocsHref } from '../../content/docs-contract'
import { publishedIdentity } from '../glossaryIdentity'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
const researchProfileId = 'author-doefin-research'
const isResearchProfile = (id?: string) => !!id && publishedIdentity(id) === researchProfileId
export const authorProfile=defineType({name:'authorProfile',title:'Author profile',type:'document',initialValue:{kind:'person'},fields:[
  defineField({name:'slug',title:'Author ID',type:'string',readOnly:({document})=>isResearchProfile(document?._id),validation:r=>r.required().custom(async (v,{document,getClient})=>{
    if (isResearchProfile(document?._id)) return v === 'doefin-research' || 'Use the existing Doefin Research ID.'
    if (typeof v !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || v === 'doefin-research') return 'Use a different ID with lowercase letters, numbers and hyphens.'
    const ids = await getClient({apiVersion:'2025-02-19'}).withConfig({perspective:'raw',useCdn:false})
      .fetch<string[]>('*[_type == "authorProfile" && slug == $slug]._id', {slug:v})
    const id = document?._id ? publishedIdentity(document._id) : undefined
    return ids.every(candidate=>publishedIdentity(candidate)===id) || 'Another author profile uses this ID.'
  })}),
  defineField({name:'kind',type:'string',readOnly:({document})=>isResearchProfile(document?._id),options:{list:[{title:'Organisation',value:'organization'},{title:'Person',value:'person'}]},validation:r=>r.required()}),
  defineField({name:'name',type:'string',validation:r=>r.required().custom(nonBlank)}),
  defineField({name:'url',type:'string',validation:r=>r.custom((v,{document})=>(!isResearchProfile(document?._id) && v == null) || isSafeDocsHref(v) || 'Use a site path or an HTTPS URL.')}),
  defineField({name:'description',type:'text',rows:4,validation:r=>r.custom((v,{document})=>(!isResearchProfile(document?._id) && v == null) || nonBlank(v))}),
  defineField({name:'metadataDescription',title:'Structured data description',type:'text',rows:3,validation:r=>r.custom(v=>v===undefined||v===null||nonBlank(v)===true||'Enter nonempty text.')}),
  defineField({name:'sameAs',title:'External identity URLs',type:'array',of:[{type:'url'}],validation:r=>r.unique()}),
],preview:{select:{title:'name',subtitle:'kind'}}})

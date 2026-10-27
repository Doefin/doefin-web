import { defineArrayMember, defineField, defineType } from 'sanity'
export const homeFaqPlacement = defineType({name:'homeFaqPlacement',title:'FAQ placement',type:'document',fields:[
 defineField({name:'placement',type:'string',hidden:true,readOnly:true}),
 defineField({name:'items',type:'array',of:[defineArrayMember({type:'reference',to:[{type:'faqItem'}],weak:true})],validation:r=>r.required().min(1).unique()}),
],preview:{select:{title:'placement'}}})

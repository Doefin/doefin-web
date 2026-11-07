import { defineArrayMember, defineField, defineType } from 'sanity'
import { aboutSectionAnchor } from '../../content/about-contract'
const nonBlank=(v:unknown)=>typeof v==='string'&&v.trim().length>0||'Enter nonempty text.'
export const aboutPage=defineType({name:'aboutPage',title:'About page',type:'document',fields:[
  defineField({name:'sections',type:'array',of:[defineArrayMember({name:'aboutSection',type:'object',fields:[
    defineField({name:'id',title:'Stable section anchor',type:'string',readOnly:true,validation:r=>r.required().custom(v=>aboutSectionAnchor(v)||'Use a safe stable section anchor.')}),
    defineField({name:'heading',type:'string',validation:r=>r.required().custom(nonBlank)}),
    defineField({name:'paragraphs',type:'array',of:[defineArrayMember({type:'text',rows:4,validation:r=>r.required().custom(nonBlank)})],validation:r=>r.required().min(1)}),
  ],preview:{select:{title:'heading',subtitle:'id'}}})],validation:r=>r.required().min(3).max(3)}),
  defineField({
    name:'author',type:'reference',weak:true,to:[{type:'authorProfile'}],
    options:{disableNew:true,filter:'_id in ["author-doefin-research", "drafts.author-doefin-research"]'},
    validation:r=>r.required().custom(v=>v?._ref==='author-doefin-research'&&v._weak===true||'Choose Doefin Research for the About page.'),
  }),
],preview:{prepare:()=>({title:'About Doefin'})}})

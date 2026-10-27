import assert from 'node:assert/strict'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import NextLink from 'next/link.js'
import * as jsxRuntime from 'react/jsx-runtime'
import ts from 'typescript'
import { readFileSync } from 'node:fs'
import { loadTypescript } from './lib/load-typescript.mjs'
import { docsMigrationDocuments, docsSeed, docsId } from './lib/docs-migration.mjs'
import { docsFixture } from './lib/docs-fixture.mjs'
const contract=loadTypescript('content/docs-contract.ts',{'./editorial-contract':loadTypescript('content/editorial-contract.ts')})
const {parseDocs,parseDocsManifest}=loadTypescript('content/sanity/docs-parse.ts',{'../docs-contract':contract})
const {docsLinkState}=loadTypescript('lib/docs-links.ts',{'./site':loadTypescript('lib/site.ts'),'./versioning':loadTypescript('lib/versioning.ts')})
const source=loadTypescript('content/v3-docs.ts'),rows=docsFixture(),parsed=parseDocs(rows)
assert.equal(parsed.length,18);assert.deepEqual(parsed.map(d=>d.slug),docsSeed.map(d=>d.slug))
for(const [i,doc] of parsed.entries()){
 const seed=docsSeed[i]
 assert.deepEqual({...doc,sections:doc.sections.map(({id,...rest})=>rest),sortOrder:undefined,reviewedAt:undefined,reviewDateSource:undefined},{...seed,sortOrder:undefined,reviewedAt:undefined,reviewDateSource:undefined})
 assert.equal(doc.reviewedAt,seed.reviewedAt??source.v3DocReviewedAt)
 assert.equal(doc.sortOrder,i);assert.deepEqual(doc.sections.map(s=>s.id),seed.sections.map(s=>contract.docsSectionId(s.title)))
 assert.equal(doc.reviewedAt,doc.slug==='methodology-and-evidence'?'2026-10-27':'2026-10-19')
}
const capture=JSON.parse(readFileSync('content/research-archive/v1.json','utf8'))
assert.equal(capture.rows.length,25);assert.equal(capture.forecasts.length,0)
assert(docsSeed.find(d=>d.slug==='methodology-and-evidence').sections[2].paragraphs[0].includes('frozen capture of 25 observed difficulty changes'))
assert(!docsSeed.find(d=>d.slug==='methodology-and-evidence').sections[2].paragraphs[0].includes('research datasets and displayed ranges are authored'))
for(const id of ['main','v3-mobile-menu','v3-navigation-0','v3-navigation-future','article-body','article-next','docs-content','docs-resources']){
 const bad=structuredClone(rows);bad[0].sections[0].id=id;assert.throws(()=>parseDocs(bad),/anchor/)
}
for(const mutate of [r=>r.push(structuredClone(r[0])),r=>r[0].sections[1].id=r[0].sections[0].id,r=>r[0].reviewedAt='2026-02-30',r=>r[0].group='New arbitrary group',r=>r[0].sections[0].paragraphs=[],r=>r[0].related[0].target._type='topic',r=>r[0].related.push(r[0].related[0]),r=>r[0]._id='drafts.docs-overview',r=>r[0]._id='versions.release.docs-overview']){
 const bad=structuredClone(rows);mutate(bad);assert.throws(()=>parseDocs(bad))
}
for(const href of ['https://evil@doefin.com/v3/docs/smart-contracts',new URL('https://evil:password@doefin.com/v3/docs/smart-contracts'),'https://doefin.com@external.example/v3/docs/smart-contracts','javascript:alert(1)','data:text/html,x','//evil.example','/\\evil.example','/v3/docs/%0afoo','https://user:password@example.com','/v3/docs/bad%','https://example.com/\nprobe']){
 const bad=structuredClone(rows);bad[0].optionalLinks=[{href,label:'Unsafe'}];assert.throws(()=>parseDocs(bad),/unsafe/)
}
for(const href of ['/v3/tools/difficulty-exposure','/v3/docs/key-terms#underlying-and-market','https://bitcoin.org/en/'])assert(contract.isSafeDocsHref(href))
const gone=rows.filter(d=>d.slug!=='overview').map(d=>({...d,related:d.related.map(ref=>ref._ref===docsId('overview')?{...ref,target:null}:ref)}))
assert(!parseDocs(gone).some(d=>d.related.includes('overview')))
assert.deepEqual(parseDocs([]),[]);assert.deepEqual(parseDocsManifest([]),[])
const undated=structuredClone(rows);delete undated[0].reviewedAt;delete undated[0].reviewDateSource;assert.equal(parseDocs(undated)[0].reviewedAt,undefined)
const noRelated=structuredClone(rows);delete noRelated[0].related;assert.deepEqual(parseDocs(noRelated)[0].related,[])
const renamed=structuredClone(rows);renamed[0].sections[0].title='New heading';assert.equal(parseDocs(renamed)[0].sections[0].id,rows[0].sections[0].id)
assert.equal(docsLinkState('/v3/docs/overview#anchor',['overview']),'published')
assert.equal(docsLinkState('/v3/docs/%6fverview/',['overview']),'published')
for(const href of ['/v3/docs/gone','/v3/docs/gone/?x=1','/v3/docs/no/such/path'])assert.equal(docsLinkState(href,[]),'missing')
assert.equal(docsLinkState('/v3/docs/overview',null),'unavailable');assert.equal(docsLinkState('/v3/product',null),undefined)
// Exercise the actual SiteLink and actual NextLink server DOM, including URL
// objects (the CMS field itself intentionally stores validated string URLs).
let publication=[]
const module={exports:{}}
const componentCode=ts.transpileModule(readFileSync('components/routing/SiteLink.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText
const dependencies={'next/link':{default:NextLink},'react/jsx-runtime':jsxRuntime,'@/lib/versioning':loadTypescript('lib/versioning.ts'),'./SiteVersionContext':{useSiteVersion:()=> 'v3'},'./DocsPublicationContext':{usePublishedDocs:()=>publication},'@/lib/docs-links':{docsLinkState}}
new Function('require','module','exports',componentCode)(name=>{assert(Object.hasOwn(dependencies,name),name);return dependencies[name]},module,module.exports)
const actualSiteLink=module.exports.default
const destinations=[
 '/v3/docs/smart-contracts?ref=a#keep',
 'https://doefin.com/v3/docs/smart-contracts?ref=a#keep',
 'https://DOEFIN.COM:443/docs/smart-contracts?ref=a#keep',
 {protocol:'https',host:'DOEFIN.COM:443',pathname:'/docs/smart-contracts',query:{ref:'a'},hash:'#keep'},
 {pathname:'https://doefin.com/v3/docs/smart-contracts',query:{ref:'a'},hash:'#keep'},
 {pathname:'/v3/docs/smart-contracts',query:{ref:'a'},hash:'#keep'},
 {protocol:'https:',hostname:'doefin.com',pathname:'/v3/docs/smart-contracts',query:{ref:'a'},hash:'#keep'},
 new URL('https://doefin.com/v3/docs/smart-contracts?ref=a#keep'),
]
for(const href of destinations){
 for(const [state,slugs] of [['published',['smart-contracts']],['missing',[]],['unavailable',null]]){
  publication=slugs;assert.equal(docsLinkState(href,slugs),state)
  const html=renderToStaticMarkup(React.createElement(actualSiteLink,{href,children:'Original guide label'}))
  if(state==='published'){assert(html.includes('smart-contracts?ref=a#keep'));assert(html.includes('Original guide label'));assert(!html.includes('data-docs-fallback'))}
  else {assert(html.includes('href="/v3/docs"'));assert(html.includes(`data-docs-fallback="${state}"`));assert(html.includes('Browse documentation'));assert(html.includes('aria-label='))}
 }
}
for(const href of ['https://external.example/v3/docs/smart-contracts?ref=a#keep','https://doefin.com.evil.example/v3/docs/smart-contracts',{protocol:'https:',hostname:'external.example',pathname:'/v3/docs/smart-contracts',query:{ref:'a'},hash:'#keep'}]){
 publication=[];assert.equal(docsLinkState(href,publication),undefined)
 const html=renderToStaticMarkup(React.createElement(actualSiteLink,{href,children:'External guide'}));assert(html.includes('External guide'));assert(!html.includes('data-docs-fallback'))
}
for(const href of ['https://evil@doefin.com/v3/docs/smart-contracts',new URL('https://evil:password@doefin.com/v3/docs/smart-contracts'),'https://doefin.com@external.example/v3/docs/smart-contracts','javascript:alert(1)','//doefin.com/v3/docs/smart-contracts','https://doefin.com\\evil.example/v3/docs/smart-contracts','https://doefin.com:8443/v3/docs/smart-contracts',{host:'doefin.com',pathname:'/v3/docs/smart-contracts'},{protocol:'javascript:',hostname:'doefin.com',pathname:'/v3/docs/smart-contracts'}])assert.equal(docsLinkState(href,[]),undefined)
assert.equal(docsLinkState('https://doefin.com/v3/docs/unknown',[]),'missing')
assert.equal(docsLinkState('/v3/%2e%2e/v3/docs/smart-contracts',[]),'missing')
assert.equal(docsLinkState('/v3/docs/%2e/smart-contracts',['smart-contracts']),'published')
assert.equal(docsLinkState({pathname:'/v3/%2e%2e/v3/docs/smart-contracts'},[]),'missing')
let response={result:rows},status=200,calls=[]
const originalFetch=globalThis.fetch
const reader=loadTypescript('content/sanity/docs.ts',{'server-only':{},react:{cache:fn=>fn},'./config':{sanityProjectId:'yzvr33lo',sanityDataset:'production',sanityApiVersion:'2025-02-19'},'./docs-parse':{parseDocs,parseDocsManifest}})
try{
 globalThis.fetch=async(url,init)=>{calls.push({url:new URL(url),init});return new Response(JSON.stringify(response),{status})}
 assert.equal((await reader.allV3Docs()).length,18);assert.equal((await reader.getV3Doc('overview')).slug,'overview');assert.equal(await reader.getV3Doc('unknown'),undefined)
 for(const {url,init}of calls){assert.equal(url.searchParams.get('perspective'),'published');assert.equal(init.cache,'no-store');assert(!init.headers?.Authorization)}
 response={result:[]};assert.deepEqual(await reader.allV3Docs(),[])
 response={result:rows};status=503;await assert.rejects(reader.allV3Docs(),/unavailable/);assert.equal(await reader.docsNavigation(),null)
 status=200;response={result:{malformed:true}};await assert.rejects(reader.allV3Docs());assert.equal(await reader.docsNavigation(),null)
 response={result:rows.map(({_id,_type,slug})=>({_id,_type,slug}))};assert.equal((await reader.docsNavigation()).length,18)
}finally{globalThis.fetch=originalFetch}
const {renderLlms}=loadTypescript('lib/llms.ts',{'./site':{site:{name:'Doefin',url:'https://doefin.com',description:'Description'}}})
const hostile='Doc ](javascript:probe) <script>\n# invented section'
const llms=renderLlms([],[],[{...parsed[0],title:hostile,summary:hostile}]);assert(llms.includes('Doc \\]'));assert(!llms.includes('\n# invented section'));assert(llms.includes('https://doefin.com/v3/docs/overview'))
assert.equal(docsMigrationDocuments().length,18)
console.log('Docs seed/correction/date parity, parser/manifest/references/anchors/links, published reader failures and Markdown discovery passed.')

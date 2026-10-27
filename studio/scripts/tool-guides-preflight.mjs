import {getCliClient} from 'sanity/cli'
import {mkdir,writeFile} from 'node:fs/promises'
import {fileURLToPath} from 'node:url'
const client=getCliClient({apiVersion:'2025-02-19'}).withConfig({perspective:'raw',useCdn:false})
process.chdir(fileURLToPath(new URL('../..',import.meta.url)))
const {planToolGuidesImport,toolGuideMigrationDocuments,toolGuidesRawQuery}=await import('../../scripts/lib/tool-guides-migration.mjs')
if(!client.config().token||!(await client.users.getById('me'))?.id)throw new Error('Authenticated user required')
const rows=await client.fetch(toolGuidesRawQuery,{},{perspective:'raw',cache:'no-store'})
const plan=planToolGuidesImport(rows),baseline=rows.map(({_id,_type,_rev})=>({_id,_type,_rev})).sort((a,b)=>a._id.localeCompare(b._id))
await mkdir('work',{recursive:true})
await writeFile('work/tool-guides-preflight.json',JSON.stringify({capturedAt:new Date().toISOString(),project:'yzvr33lo',dataset:'production',perspective:'raw',baseline,plan:{...plan,missing:plan.missing.map(row=>row._id)}},null,2)+'\n')
console.log(JSON.stringify({total:rows.length,drafts:rows.filter(row=>row._id.startsWith('drafts.')).length,versions:rows.filter(row=>row._id.startsWith('versions.')).length,plan:{...plan,missing:plan.missing.map(row=>row._id)},records:toolGuideMigrationDocuments().map(({_id,slug,toolSlug,sortOrder,article,reviewedAt})=>({_id,slug:slug.current,toolSlug,sortOrder,publishedAt:article.publishedAt,reviewedAt}))},null,2))

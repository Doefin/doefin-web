import { getCliClient } from 'sanity/cli'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../..',import.meta.url)))
const client=getCliClient({apiVersion:'2025-02-19'})
const {runHomeFaqImport}=await import('../../scripts/lib/home-faq-migration.mjs')
const args=process.argv.slice(2)
const result=await runHomeFaqImport(client,{apply:args.includes('--apply'),editorsPaused:args.includes('--editors-paused')})
console.log(JSON.stringify({project:'yzvr33lo',dataset:'production',perspective:'raw',...result},null,2))

import { getCliClient } from 'sanity/cli'
import { fileURLToPath } from 'node:url'
import { mkdir, writeFile } from 'node:fs/promises'
process.chdir(fileURLToPath(new URL('../..',import.meta.url)))
const client=getCliClient({apiVersion:'2025-02-19'})
const {runAboutAuthorsImport}=await import('../../scripts/lib/about-authors-migration.mjs')
const args=process.argv.slice(2)
const result=await runAboutAuthorsImport(client,{apply:args.includes('--apply'),editorsPaused:args.includes('--editors-paused')})
await mkdir('work/sanity-about-authors',{recursive:true})
await writeFile('work/sanity-about-authors/raw-baseline.json',JSON.stringify(result.rawSnapshot,null,2)+'\n')
const {rawSnapshot,...sanitized}=result
console.log(JSON.stringify({project:'yzvr33lo',dataset:'production',perspective:'raw',rawBaseline:'work/sanity-about-authors/raw-baseline.json',...sanitized},null,2))

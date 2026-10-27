import { mkdir, writeFile } from 'node:fs/promises'
import { aboutAuthorDocuments } from './lib/about-authors-migration.mjs'
const docs=aboutAuthorDocuments()
await mkdir('work/sanity-about-authors',{recursive:true})
await writeFile('work/sanity-about-authors/about-authors.ndjson',[...docs.authors,docs.about].map(doc=>JSON.stringify(doc)).join('\n')+'\n')
console.log(JSON.stringify({expectedAuthors:docs.authors.length,expectedAboutPages:1,paragraphs:docs.about.sections.reduce((n,s)=>n+s.paragraphs.length,0),file:'work/sanity-about-authors/about-authors.ndjson'},null,2))

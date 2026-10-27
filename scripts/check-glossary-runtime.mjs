/** Exercise real built glossary routes with hostile CMS text in an isolated local
 * fixture process. No external writes or production-source test switches.
 */
import assert from 'node:assert/strict'
import { mkdir, writeFile, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { seed, idFor } from './lib/glossary-migration.mjs'
const port = Number(process.argv.find(a => a.startsWith('--port='))?.slice(7) ?? 3041)
assert(Number.isInteger(port) && port > 1024 && port < 65536)
const base = `http://127.0.0.1:${port}`
await mkdir('work', {recursive:true})
const fixture = resolve(`work/glossary-hostile-${port}.json`)
const reviewDate = '2025-02-13' // Deliberately differs from both seed and global footer defaults.
const rows = seed.map(t => ({_id:idFor(t.slug),...t,updatedAt:reviewDate}))
const hostile = '</script><script>globalThis.__glossaryXssProbe=true</script>'
rows[0] = {...rows[0],term:hostile,shortDef:hostile,faq:[{q:hostile,a:hostile}]}
await writeFile(fixture,JSON.stringify(rows))
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
  env:{...process.env,NODE_OPTIONS:`--require=${resolve('scripts/lib/mock-sanity.cjs')}`,DOEFIN_GLOSSARY_TEST_FIXTURE:fixture},stdio:['ignore','pipe','pipe'],
})
let output=''
server.stdout.on('data',x=>{output+=x});server.stderr.on('data',x=>{output+=x})
try {
  for(let tries=0;;tries++) {
    try { await fetch(base+'/robots.txt');break } catch {
      if(tries>=30 || server.exitCode!==null) throw new Error(`Fixture server failed: ${output}`)
      await new Promise(r=>setTimeout(r,250))
    }
  }
  for(const path of ['/v3/glossary',`/v3/glossary/${rows[0].slug}`]) {
    const response=await fetch(base+path,{headers:{'user-agent':'Googlebot'}})
    assert.equal(response.status,200,path)
    const html=await response.text()
    const json=[...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]))
    assert(!html.includes('<script>globalThis.__glossaryXssProbe=true</script>'),`${path}: executable breakout`)
    if(path.endsWith(rows[0].slug)) {
      const term=json.find(x=>x['@type']==='DefinedTerm')
      assert.equal(term.name,hostile);assert.equal(term.description,hostile)
      const faq=json.find(x=>x['@type']==='FAQPage')
      assert.equal(faq.mainEntity[0].name,hostile);assert.equal(faq.mainEntity[0].acceptedAnswer.text,hostile)
    } else {
      const set=json.find(x=>x['@type']==='DefinedTermSet')
      assert(set.hasDefinedTerm.some(t=>t.name===hostile&&t.description===hostile))
    }
    assert(html.includes('\\u003c/script>'),`${path}: expected safe JSON string escape`)
    await writeFile(resolve(`work/hostile-${path.endsWith(rows[0].slug)?'detail':'index'}.html`),html)
  }
  for (const row of rows) {
    const response = await fetch(`${base}/v3/glossary/${row.slug}`, { headers: { 'user-agent': 'Googlebot' } })
    assert.equal(response.status, 200, row.slug)
    const html = await response.text()
    const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
    const reviewed = [...visible.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)]
      .filter(match => match[1].includes('Last reviewed'))
    assert.equal(reviewed.length, 2, `${row.slug}: check every displayed review date`)
    assert.equal((visible.match(/Last reviewed/g) ?? []).length, reviewed.length, `${row.slug}: no review dates outside checked paragraphs`)
    const renderedDate = new Date(reviewDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const dateTexts = reviewed.map(match => match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    assert.equal(dateTexts[0], `Last reviewed ${reviewDate}`, `${row.slug}: inline date must use CMS review date`)
    assert.equal(dateTexts[1], `Last reviewed ${renderedDate}. Figures marked illustrative are placeholders until the data pipeline is connected.`, `${row.slug}: footer must use the same CMS review date`)
    const semanticDates = [...reviewed[1][1].matchAll(/<time\b[^>]*dateTime="([^"]+)"/gi)].map(match => match[1])
    assert.deepEqual(semanticDates, [reviewDate], `${row.slug}: semantic review date must agree`)
  }
  console.log('Passed hostile CMS text through actual built glossary index/detail/FAQ JSON-LD and all 19 term routes with nondefault CMS review date: every visible/semantic review date agrees. Isolated fixture process only; no Sanity writes.')
} finally {
  server.kill('SIGTERM')
  await new Promise(r=>server.once('exit',r))
}

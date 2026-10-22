/** Local-only draft preparation, never a claim of external publication. Run with Node >=22 --experimental-strip-types. */
import { mkdir, readdir, readFile, open, unlink } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { forecastHash, validateForecast } from '../lib/research-archive.ts'

const [provider, methodVersion, prediction, sourceUrl] = process.argv.slice(2)
if (!provider || !methodVersion || !prediction || !sourceUrl) throw new Error('Usage: node --experimental-strip-types scripts/stage-research-forecast.mjs PROVIDER METHOD_VERSION PREDICTED_CHANGE_PCT HTTPS_SOURCE_CAPTURE')
const directory = resolve('work/research-staging')
await mkdir(directory, { recursive: true })
const lock = join(directory, '.lock')
const handle = await open(lock, 'wx')
try {
  const filenames = (await readdir(directory)).filter(name => name.endsWith('.json')).sort()
  const records = await Promise.all(filenames.map(async name => JSON.parse(await readFile(join(directory, name), 'utf8'))))
  records.forEach((record, i) => validateForecast(record, records[i - 1]))
  const response = await fetch('https://mempool.space/api/blocks/tip/height', { signal: AbortSignal.timeout(15000) })
  if (!response.ok) throw new Error('Cannot capture the current input block')
  const inputHeight = Number(await response.text())
  const issuedAt = new Date().toISOString()
  const record = { id: randomUUID(), provider, methodVersion, issuedAt, inputHeight, targetHeight: Math.ceil((inputHeight + 1) / 2016) * 2016, predictedChangePct: Number(prediction), sourceUrl, previousHash: records.at(-1)?.hash ?? null }
  record.hash = forecastHash(record)
  validateForecast(record, records.at(-1))
  const path = join(directory, `${issuedAt.replace(/:/g, '-')}-${record.id}.json`)
  const output = await open(path, 'wx')
  try { await output.writeFile(JSON.stringify(record, null, 2) + '\n') } finally { await output.close() }
  console.log(JSON.stringify({ path, status: 'Local staged draft only; not public and not included in the website archive', targetHeight: record.targetHeight, hash: record.hash, requiredNext: 'Review source/model evidence and publish with independently verifiable timestamps before the outcome and any relevant market listing. Never backdate.' }, null, 2))
} finally { await handle.close(); await unlink(lock) }

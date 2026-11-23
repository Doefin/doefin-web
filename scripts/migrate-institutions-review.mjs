import { mkdir, writeFile } from 'node:fs/promises'
import { institutionsReviewDocument } from './lib/institutions-review-migration.mjs'
const doc = institutionsReviewDocument()
await mkdir('work/sanity-institutions-review', { recursive: true })
await writeFile('work/sanity-institutions-review/institutions-review.ndjson', JSON.stringify(doc) + '\n')
console.log(JSON.stringify({ document: doc._id, type: doc._type, cards: doc.cards.length, file: 'work/sanity-institutions-review/institutions-review.ndjson' }, null, 2))

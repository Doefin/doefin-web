import { loadTypescript } from './load-typescript.mjs'
const contract = loadTypescript('content/institutions-review-contract.ts')
const editorialContract = loadTypescript('content/editorial-contract.ts')
const docsContract = loadTypescript('content/docs-contract.ts', { './editorial-contract': editorialContract })
const seedSource = loadTypescript('content/institutions-review.ts')
export const institutionsReviewSeed = seedSource.institutionsReviewSeed
export const institutionsReviewDocumentId = contract.institutionsReviewId
const text = value => typeof value === 'string' && value.trim().length > 0

export function institutionsReviewDocument(review = institutionsReviewSeed) {
  if (!review || typeof review !== 'object') throw new Error('Expected the institutions review seed')
  const fields = ['eyebrow', 'heading', 'intro', 'riskNote', 'stripHeading', 'stripText', 'stripLabel', 'stripSubject']
  if (typeof review.visible !== 'boolean' || fields.some(field => !text(review[field]))) throw new Error('Invalid institutions review seed content')
  if (!Array.isArray(review.cards) || review.cards.length !== contract.institutionsReviewCardCount) throw new Error('Expected the four source review cards')
  const cards = review.cards.map((card, index) => {
    if (!card || !text(card.title) || !text(card.summary) || !text(card.disclosureSummary) ||
      !Array.isArray(card.disclosureParagraphs) || !card.disclosureParagraphs.length || !card.disclosureParagraphs.every(text) ||
      !Array.isArray(card.links) || !card.links.length) throw new Error(`Invalid review card: ${card?.title}`)
    const links = card.links.map((link, linkIndex) => {
      const hasHref = text(link.href), hasContact = text(link.contactSubject)
      if (!text(link.label) || hasHref === hasContact) throw new Error(`Invalid review link: ${link?.label}`)
      if (hasHref && !docsContract.isSafeDocsHref(link.href)) throw new Error(`Unsafe review link href: ${link.href}`)
      return { _key: `link-${index}-${linkIndex}`, _type: 'reviewLink', label: link.label, ...(hasHref ? { href: link.href } : { contactSubject: link.contactSubject }) }
    })
    return { _key: `card-${index}`, _type: 'reviewCard', title: card.title, summary: card.summary, disclosureSummary: card.disclosureSummary, disclosureParagraphs: [...card.disclosureParagraphs], links }
  })
  return { _id: contract.institutionsReviewId, _type: 'institutionsPage', visible: review.visible, ...Object.fromEntries(fields.map(field => [field, review[field]])), cards }
}

const normalizedId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id
// Compare content, not storage layout: drop revision/array-key metadata and sort
// object keys, because the API may return fields in projection or edit order.
const normalize = value => Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).filter(([key]) => !['_key', '_rev'].includes(key)).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([key, v]) => [key, normalize(v)])) : value

export function planInstitutionsReviewImport(snapshot, expected = institutionsReviewDocument()) {
  if (!Array.isArray(snapshot) || snapshot.some(row => !row || !text(row._id) || !text(row._type))) throw new Error('Invalid authenticated raw snapshot')
  const conflicts = [], changed = [], missing = []
  const family = snapshot.filter(row => normalizedId(row._id) === expected._id)
  const canonical = family.find(row => row._id === expected._id)
  if (family.some(row => row._type !== expected._type)) conflicts.push(`${expected._id}: reserved ID occupied by another type`)
  if (!canonical && family.length) conflicts.push(`${expected._id}: draft/version-only editor work exists`)
  if (canonical) {
    if (JSON.stringify(normalize(canonical)) !== JSON.stringify(normalize(expected))) changed.push(expected._id)
    if (family.some(row => row._id !== expected._id)) conflicts.push(`${expected._id}: draft/version family exists alongside canonical record`)
  } else if (!family.length) missing.push(expected)
  return { conflicts, changed, missing, unrelated: snapshot.filter(row => normalizedId(row._id) !== expected._id).length, snapshotRecords: snapshot.length }
}

export async function runInstitutionsReviewImport(client, { apply = false } = {}) {
  const config = client.config()
  if (!config.token || config.projectId !== 'yzvr33lo' || config.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  const started = Date.now()
  const snapshot = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch('*[]{_id,_type,_rev,visible,eyebrow,heading,intro,riskNote,cards,stripHeading,stripText,stripLabel,stripSubject}', {}, { perspective: 'raw', cache: 'no-store' })
  const plan = planInstitutionsReviewImport(snapshot)
  if (plan.conflicts.length) throw new Error(`Institutions review import blocked: ${plan.conflicts.join('; ')}`)
  if (plan.changed.length) throw new Error(`Existing institutions review record differs from source; preserve editor work: ${plan.changed.join(', ')}`)
  if (apply && plan.missing.length) { if (Date.now() - started > 5000) throw new Error('Preflight snapshot is stale; rerun immediately'); let tx = client.transaction(); for (const doc of plan.missing) tx = tx.createIfNotExists(doc); await tx.commit({ visibility: 'sync' }) }
  const countsByType = {}
  for (const row of snapshot) countsByType[row._type] = (countsByType[row._type] ?? 0) + 1
  return { expected: 1, missing: plan.missing.map(d => d._id), changed: plan.changed, conflicts: plan.conflicts, unrelated: plan.unrelated, snapshotRecords: plan.snapshotRecords, countsByType, created: apply ? plan.missing.length : 0 }
}

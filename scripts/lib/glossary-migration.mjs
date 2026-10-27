import { loadTypescript } from './load-typescript.mjs'
export const seed = loadTypescript('content/glossary.ts').glossary
const { parseGlossary } = loadTypescript('content/sanity/parse.ts')
export const idFor = slug => `glossary-${slug}` // No dots: dotted IDs are private in public datasets.
export function migrationDocuments(terms = seed) {
  parseGlossary(terms.map(t => ({ _id: idFor(t.slug), ...t })))
  return [...terms].sort((a, b) => a.slug.localeCompare(b.slug)).map(t => ({
    _id: idFor(t.slug), _type: 'glossaryTerm', canonicalSlug: t.slug, ...t,
    slug: { _type: 'slug', current: t.slug },
    ...(t.seeAlso ? { seeAlso: t.seeAlso.map((slug, i) => ({ _key: `related-${i}`, _type: 'reference', _ref: idFor(slug) })) } : {}),
    ...(t.faq ? { faq: t.faq.map((qa, i) => ({ _key: `faq-${i}`, _type: 'questionAnswer', ...qa })) } : {}),
  }))
}

export const normalizedId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id
const comparison = doc => ({
  _id: doc._id, _type: doc._type, canonicalSlug: doc.canonicalSlug ?? null,
  slug: doc.slug?.current, term: doc.term, shortDef: doc.shortDef,
  aliases: doc.aliases ?? null, body: doc.body, browseTopic: doc.browseTopic,
  domain: doc.domain ?? null,
  seeAlso: doc.seeAlso?.map(ref => ref._ref) ?? null,
  faq: doc.faq?.map(({ q, a }) => ({ q, a })) ?? null, updatedAt: doc.updatedAt,
})

/** Requires a complete authenticated raw snapshot. Never derive safety from public reads. */
export function planGlossaryImport(snapshot, docs = migrationDocuments()) {
  if (!Array.isArray(snapshot)) throw new Error('Authenticated raw snapshot is not an array')
  const conflicts = [], missing = [], changed = [], preservedDrafts = []
  for (const doc of docs) {
    const family = snapshot.filter(row => typeof row._id === 'string' && normalizedId(row._id) === doc._id)
    const canonical = family.find(row => row._id === doc._id)
    if (family.some(row => row._type !== 'glossaryTerm')) conflicts.push(`${doc._id}: ID is occupied by another document type`)
    if (!canonical && family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists; do not create a published counterpart`)
    const collisions = snapshot.filter(row => row._type === 'glossaryTerm' && row.slug?.current === doc.slug.current && normalizedId(row._id) !== doc._id)
    if (collisions.length) conflicts.push(`${doc.slug.current}: glossary slug exists under another glossary ID (including draft/version)`)
    if (canonical) {
      if (JSON.stringify(comparison(canonical)) !== JSON.stringify(comparison(doc))) changed.push(doc.slug.current)
      if (family.some(row => row._id !== doc._id)) preservedDrafts.push(doc.slug.current)
    } else if (!family.length && !collisions.length) missing.push(doc)
  }
  return { conflicts, missing, changed, preservedDrafts,
    additional: snapshot.filter(row => !docs.some(doc => normalizedId(row._id) === doc._id)).length }
}

/** Authenticated CLI path only. Fresh raw preflight is immediately followed by
 * createIfNotExists mutations; this is not a transactional slug uniqueness lock.
 */
export async function runGlossaryImport(client, { apply = false, verify = false, editorsPaused = false } = {}) {
  const config = client.config()
  if (!config.token || config.projectId !== 'yzvr33lo' || config.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  const user = await client.users.getById('me')
  if (!user?.id) throw new Error('Cannot establish authenticated CLI user identity')
  if (apply && !editorsPaused) throw new Error('Pause glossary editing, then pass --editors-paused for this one-time import')
  const started = Date.now()
  // Fetch every document's relevant fields, including all types/draft/version IDs.
  // A collision cannot be hidden by an incorrect type or an alternate editor ID.
  const snapshot = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch(
    '*[]{_id,_type,_rev,canonicalSlug,slug, _type == "glossaryTerm" => {term,shortDef,aliases,body,browseTopic,domain,seeAlso,faq,updatedAt}}', {}, { perspective: 'raw', cache: 'no-store' },
  )
  const plan = planGlossaryImport(snapshot)
  if (plan.conflicts.length) throw new Error(`Import blocked: ${plan.conflicts.join('; ')}`)
  if (verify && (plan.missing.length || plan.changed.length)) throw new Error(`Initial parity verification failed: ${plan.missing.length} missing, ${plan.changed.length} changed`)
  if (apply && plan.missing.length) {
    if (Date.now() - started > 5000) throw new Error('Preflight snapshot is too old; rerun before importing')
    let transaction = client.transaction()
    for (const doc of plan.missing) transaction = transaction.createIfNotExists(doc)
    await transaction.commit({ visibility: 'sync' })
  }
  return { missing: plan.missing.map(doc => doc.slug.current), changed: plan.changed, preservedDrafts: plan.preservedDrafts, additional: plan.additional, created: apply ? plan.missing.length : 0 }
}

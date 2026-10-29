import { loadTypescript } from './load-typescript.mjs'
const editorialContract = loadTypescript('content/editorial-contract.ts')
const { v3DocGroups, docsSectionId, isDocsAnchor, isSafeDocsHref } = loadTypescript('content/docs-contract.ts', { './editorial-contract': editorialContract })
const source = loadTypescript('content/v3-docs.ts')
export const docsSeed = source.allV3Docs()
export const docsId = slug => `docs-${slug}`
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const text = value => typeof value === 'string' && value.trim().length > 0
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
export const normalizedDocsId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id

/** Preserve effective existing review dates without inventing publication dates. */
export function docsMigrationDocuments(seed = docsSeed) {
  const slugs = new Set()
  for (const doc of seed) {
    if (!doc || !text(doc.slug) || !slugPattern.test(doc.slug) || slugs.has(doc.slug) || !text(doc.title) || !text(doc.summary) ||
      !v3DocGroups.includes(doc.group) || !date(doc.reviewedAt ?? source.v3DocReviewedAt) || !Array.isArray(doc.sections) || !doc.sections.length || !Array.isArray(doc.related)) throw new Error('Invalid Docs migration seed')
    slugs.add(doc.slug)
    const anchors = new Set()
    for (const section of doc.sections) {
      if (!section || !text(section.title)) throw new Error(`Invalid section: ${doc.slug}`)
      const id = docsSectionId(section.title)
      if (!isDocsAnchor(id) || anchors.has(id)) throw new Error(`Duplicate/reserved Docs anchor: ${doc.slug}`)
      anchors.add(id)
      for (const name of ['paragraphs', 'steps']) if (section[name] !== undefined && (!Array.isArray(section[name]) || !section[name].length || !section[name].every(text))) throw new Error(`Invalid ${name}: ${doc.slug}`)
      if (section.definitions !== undefined && (!Array.isArray(section.definitions) || !section.definitions.length || !section.definitions.every(item => item && text(item.term) && text(item.definition)))) throw new Error(`Invalid definitions: ${doc.slug}`)
      if (![section.paragraphs, section.steps, section.definitions].some(items => Array.isArray(items) && items.length > 0)) throw new Error(`Empty section: ${doc.slug}`)
    }
    if (doc.optionalLinks !== undefined && (!Array.isArray(doc.optionalLinks) || !doc.optionalLinks.every(link => link && text(link.label) && isSafeDocsHref(link.href)) || new Set(doc.optionalLinks.map(link => link.href)).size !== doc.optionalLinks.length)) throw new Error(`Unsafe or duplicate optional link: ${doc.slug}`)
  }
  for (const doc of seed) {
    if (new Set(doc.related).size !== doc.related.length || doc.related.some(slug => !slugs.has(slug) || slug === doc.slug)) throw new Error(`Invalid related Docs references: ${doc.slug}`)
  }
  return seed.map((doc, sortOrder) => ({
    _id: docsId(doc.slug), _type: 'docPage', canonicalSlug: doc.slug,
    slug: { _type: 'slug', current: doc.slug }, title: doc.title, summary: doc.summary, group: doc.group, sortOrder,
    reviewedAt: doc.reviewedAt ?? source.v3DocReviewedAt,
    ...(!doc.reviewedAt ? { reviewDateSource: 'legacy-shared-review-date' } : {}),
    sections: doc.sections.map((section, index) => ({ _key: `section-${index}`, _type: 'docSection', id: docsSectionId(section.title), title: section.title,
      ...(section.paragraphs ? { paragraphs: [...section.paragraphs] } : {}), ...(section.steps ? { steps: [...section.steps] } : {}),
      ...(section.definitions ? { definitions: section.definitions.map((item, at) => ({ _key: `definition-${at}`, _type: 'docDefinition', ...item })) } : {}),
    })),
    ...(doc.optionalLinks ? { optionalLinks: doc.optionalLinks.map((link, index) => ({ _key: `optional-link-${index}`, _type: 'docOptionalLink', ...link })) } : {}),
    related: doc.related.map((slug, index) => ({ _key: `related-${index}`, _type: 'reference', _ref: docsId(slug), _weak: true })),
  }))
}
const comparison = doc => ({
  _id: doc._id, _type: doc._type, canonicalSlug: doc.canonicalSlug ?? null, slug: doc.slug?.current,
  title: doc.title, summary: doc.summary, group: doc.group, sortOrder: doc.sortOrder,
  reviewedAt: doc.reviewedAt ?? null, reviewDateSource: doc.reviewDateSource ?? null,
  sections: doc.sections?.map(section => ({ id: section.id, title: section.title, paragraphs: section.paragraphs ?? null, steps: section.steps ?? null, definitions: section.definitions?.map(({ term, definition }) => ({ term, definition })) ?? null })),
  optionalLinks: doc.optionalLinks?.map(({ href, label }) => ({ href, label })) ?? null,
  related: doc.related?.map(ref => ({ type: ref._type, _ref: ref._ref, weak: ref._weak === true })) ?? null,
})

export function planDocsImport(snapshot, documents = docsMigrationDocuments()) {
  if (!Array.isArray(snapshot) || snapshot.some(row => !row || !text(row._id) || !text(row._type))) throw new Error('Invalid authenticated raw Docs snapshot')
  const identities = new Set(documents.map(doc => doc._id))
  if (identities.size !== documents.length || documents.some(doc => !Array.isArray(doc.related) || doc.related.some(ref => ref._type !== 'reference' || ref._weak !== true || !identities.has(ref._ref)))) throw new Error('Unsafe Docs seed reference set')
  const conflicts = [], changed = [], preservedDrafts = [], missing = []
  for (const doc of documents) {
    const family = snapshot.filter(row => normalizedDocsId(row._id) === doc._id)
    const canonical = family.find(row => row._id === doc._id)
    if (family.some(row => row._type !== 'docPage')) conflicts.push(`${doc._id}: reserved ID occupied by another type`)
    if (!canonical && family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists`)
    const collisions = snapshot.filter(row => row._type === 'docPage' && row.slug?.current === doc.slug.current && normalizedDocsId(row._id) !== doc._id)
    if (collisions.length) conflicts.push(`${doc._id}: Docs slug exists under another ID (including draft/version)`)
    if (canonical) {
      if (JSON.stringify(comparison(canonical)) !== JSON.stringify(comparison(doc))) changed.push(doc._id)
      if (family.some(row => row._id !== doc._id)) preservedDrafts.push(doc._id)
    } else if (!family.length && !collisions.length) missing.push(doc)
  }
  return { conflicts, changed, preservedDrafts, missing, unrelated: snapshot.filter(row => !identities.has(normalizedDocsId(row._id))).length }
}

/** Preflight is not an atomic cross-document slug lock. A new exclusive editing
 * window and post-import reconciliation remain required for this milestone. */
export async function runDocsImport(client, { apply = false, verify = false, editorsPaused = false } = {}) {
  const config = client.config()
  if (!config.token || config.projectId !== 'yzvr33lo' || config.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  const user = await client.users.getById('me')
  if (!user?.id) throw new Error('Cannot establish authenticated CLI user identity')
  if (apply && !editorsPaused) throw new Error('Obtain a new exclusive Docs editing window and pass --editors-paused; earlier import windows do not apply')
  const started = Date.now()
  const snapshot = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch(
    '*[]{_id,_type,_rev,slug,canonicalSlug, _type == "docPage" => {title,summary,group,sortOrder,reviewedAt,reviewDateSource,sections,optionalLinks,related}}', {}, { perspective: 'raw', cache: 'no-store' },
  )
  const plan = planDocsImport(snapshot)
  if (plan.conflicts.length) throw new Error(`Docs import blocked: ${plan.conflicts.join('; ')}`)
  if ((apply || verify) && plan.changed.length) throw new Error(`Existing Docs records differ from seed; preserve editor work and resolve before import: ${plan.changed.join(', ')}`)
  if (verify && plan.missing.length) throw new Error(`Initial Docs parity verification failed: ${plan.missing.length} missing`)
  if (apply && plan.missing.length) {
    if (Date.now() - started > 5000) throw new Error('Docs preflight snapshot is too old; rerun before importing')
    let transaction = client.transaction()
    for (const doc of plan.missing) transaction = transaction.createIfNotExists(doc)
    await transaction.commit({ visibility: 'sync' })
  }
  return { seedDocs: docsMigrationDocuments().length, missing: plan.missing.map(doc => doc._id), changed: plan.changed, preservedDrafts: plan.preservedDrafts, unrelated: plan.unrelated, created: apply ? plan.missing.length : 0 }
}

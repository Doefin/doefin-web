import { loadTypescript } from './load-typescript.mjs'

const { isEditorialAnchor } = loadTypescript('content/editorial-contract.ts')
const source = loadTypescript('content/v3-editorial.ts')
export const editorialSeed = [...source.allV3Editorial('blog'), ...source.allV3Editorial('academy')]
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const text = value => typeof value === 'string' && value.trim().length > 0
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
export const topicSlug = label => label.normalize('NFKC').trim().toLowerCase().replace(/\s+/g, '-')
export const topicId = slug => `topic-${slug}`
export const articleId = (kind, slug) => `editorial-${kind}-${slug}`
export const editorialAnchor = heading => heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
export const normalizedEditorialId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id

/** This is the original rendered review date, not a newly invented publication date. */
export function editorialMigrationDocuments(seed = editorialSeed) {
  const labels = new Map(), identities = new Set()
  for (const article of seed) {
    if (!article || !['blog', 'academy'].includes(article.kind) || !slugPattern.test(article.slug) ||
      (article.kind === 'blog' && article.slug === 'tag') || (article.kind === 'academy' && article.slug === 'guides') ||
      !text(article.title) || !text(article.summary) || !Array.isArray(article.tags) || !article.tags.length ||
      !Array.isArray(article.sections) || !article.sections.length) throw new Error('Invalid editorial migration seed')
    const identity = articleId(article.kind, article.slug)
    if (identities.has(identity)) throw new Error(`Duplicate article identity: ${identity}`)
    identities.add(identity)
    if (!date(article.reviewedAt ?? source.v3EditorialReviewedAt) || (article.publishedAt && !date(article.publishedAt))) throw new Error(`Invalid article dates: ${identity}`)
    const anchors = new Set()
    for (const section of article.sections) {
      if (!text(section.heading) || !Array.isArray(section.paragraphs) || !section.paragraphs.length || !section.paragraphs.every(text)) throw new Error(`Invalid article section: ${identity}`)
      const anchor = editorialAnchor(section.heading)
      if (!isEditorialAnchor(anchor) || anchors.has(anchor)) throw new Error(`Duplicate/invalid article heading anchor: ${identity}`)
      anchors.add(anchor)
    }
    const articleTopics = new Set()
    for (const label of article.tags) {
      if (!text(label)) throw new Error(`Invalid topic label: ${identity}`)
      const slug = topicSlug(label)
      if (!slugPattern.test(slug) || articleTopics.has(slug)) throw new Error(`Duplicate/invalid article topic: ${identity}`)
      articleTopics.add(slug)
      if (labels.has(slug) && labels.get(slug) !== label) throw new Error(`Ambiguous topic labels normalize to ${slug}`)
      labels.set(slug, label)
    }
  }
  const topics = [...labels].map(([slug, label]) => ({ _id: topicId(slug), _type: 'topic', canonicalSlug: slug, slug: { _type: 'slug', current: slug }, label }))
  const articles = seed.map((article, sortOrder) => ({
    _id: articleId(article.kind, article.slug), _type: 'editorialArticle', canonicalSlug: article.slug, canonicalKind: article.kind,
    kind: article.kind, slug: { _type: 'slug', current: article.slug }, title: article.title, summary: article.summary, sortOrder,
    reviewedAt: article.reviewedAt ?? source.v3EditorialReviewedAt,
    ...(!article.reviewedAt ? { reviewDateSource: 'legacy-shared-review-date' } : {}),
    ...(article.publishedAt ? { publishedAt: article.publishedAt } : {}),
    sections: article.sections.map((section, index) => ({ _key: `section-${index}`, _type: 'editorialSection', id: editorialAnchor(section.heading), heading: section.heading, paragraphs: [...section.paragraphs] })),
    topics: article.tags.map((label, index) => ({ _key: `topic-${index}`, _type: 'reference', _ref: topicId(topicSlug(label)) })),
  }))
  return { topics, articles }
}

const compareTopic = doc => ({ _id: doc._id, _type: doc._type, canonicalSlug: doc.canonicalSlug ?? null, slug: doc.slug?.current, label: doc.label })
const compareArticle = doc => ({
  _id: doc._id, _type: doc._type, canonicalSlug: doc.canonicalSlug ?? null, canonicalKind: doc.canonicalKind ?? null,
  slug: doc.slug?.current, kind: doc.kind, title: doc.title, summary: doc.summary, sortOrder: doc.sortOrder,
  reviewedAt: doc.reviewedAt ?? null, publishedAt: doc.publishedAt ?? null, reviewDateSource: doc.reviewDateSource ?? null,
  sections: doc.sections?.map(section => ({ id: section.id, heading: section.heading, paragraphs: section.paragraphs })),
  topics: doc.topics?.map(ref => ({ _ref: ref._ref, weak: Boolean(ref._weak) })),
})

/** All raw document families are inspected; namespace identity is type+kind+slug.
 * A glossary term and topic may intentionally share a slug without sharing a URL.
 */
export function planEditorialImport(snapshot, documents = editorialMigrationDocuments()) {
  if (!Array.isArray(snapshot) || snapshot.some(row => !row || !text(row._id) || !text(row._type))) throw new Error('Invalid authenticated raw snapshot')
  const expected = [...documents.topics, ...documents.articles]
  const topicIds = new Set(documents.topics.map(doc => doc._id))
  for (const article of documents.articles) {
    if (!article.topics?.length || article.topics.some(ref => ref._weak || !topicIds.has(ref._ref))) throw new Error('Unsafe editorial seed references')
  }
  const conflicts = [], changed = [], preservedDrafts = [], missingTopics = [], missingArticles = []
  for (const doc of expected) {
    const family = snapshot.filter(row => normalizedEditorialId(row._id) === doc._id)
    const canonical = family.find(row => row._id === doc._id)
    if (family.some(row => row._type !== doc._type)) conflicts.push(`${doc._id}: reserved ID occupied by another document type`)
    if (!canonical && family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists`)
    const collisions = snapshot.filter(row => row._type === doc._type && row.slug?.current === doc.slug.current &&
      (doc._type !== 'editorialArticle' || row.kind === doc.kind) && normalizedEditorialId(row._id) !== doc._id)
    if (collisions.length) conflicts.push(`${doc._id}: slug already exists under another ID (including draft/version)`)
    if (doc._type === 'topic' && snapshot.some(row => row._type === 'topic' && text(row.label) && topicSlug(row.label) === topicSlug(doc.label) && normalizedEditorialId(row._id) !== doc._id)) {
      conflicts.push(`${doc._id}: equivalent topic label already exists under another ID`)
    }
    if (canonical) {
      const compare = doc._type === 'topic' ? compareTopic : compareArticle
      if (JSON.stringify(compare(canonical)) !== JSON.stringify(compare(doc))) changed.push(doc._id)
      if (family.some(row => row._id !== doc._id)) preservedDrafts.push(doc._id)
    } else if (!family.length && !collisions.length) (doc._type === 'topic' ? missingTopics : missingArticles).push(doc)
  }
  return { conflicts, changed, preservedDrafts, missingTopics, missingArticles,
    unrelated: snapshot.filter(row => !expected.some(doc => normalizedEditorialId(row._id) === doc._id)).length }
}

export async function runEditorialImport(client, { apply = false, verify = false, editorsPaused = false } = {}) {
  const config = client.config()
  if (!config.token || config.projectId !== 'yzvr33lo' || config.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  const user = await client.users.getById('me')
  if (!user?.id) throw new Error('Cannot establish authenticated CLI user identity')
  if (apply && !editorsPaused) throw new Error('Obtain a new exclusive editorial editing window and pass --editors-paused; the glossary import window does not apply')
  const started = Date.now()
  const snapshot = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch(
    '*[]{_id,_type,_rev,slug,kind,label,canonicalSlug,canonicalKind, _type == "editorialArticle" => {title,summary,sortOrder,reviewedAt,publishedAt,reviewDateSource,sections,topics}}', {}, { perspective: 'raw', cache: 'no-store' },
  )
  const plan = planEditorialImport(snapshot)
  if (plan.conflicts.length) throw new Error(`Editorial import blocked: ${plan.conflicts.join('; ')}`)
  if ((apply || verify) && plan.changed.length) throw new Error(`Existing editorial records differ from seed; preserve editor work and resolve before import: ${plan.changed.join(', ')}`)
  const missing = [...plan.missingTopics, ...plan.missingArticles]
  if (verify && missing.length) throw new Error(`Initial editorial parity verification failed: ${missing.length} missing`)
  if (apply && missing.length) {
    if (Date.now() - started > 5000) throw new Error('Editorial preflight snapshot is too old; rerun before importing')
    let transaction = client.transaction()
    // Topic creations precede article creations; all strong references resolve in this transaction.
    for (const doc of missing) transaction = transaction.createIfNotExists(doc)
    await transaction.commit({ visibility: 'sync' })
  }
  return { seedTopics: 4, seedArticles: 5, missingTopics: plan.missingTopics.map(doc => doc._id), missingArticles: plan.missingArticles.map(doc => doc._id), changed: plan.changed, preservedDrafts: plan.preservedDrafts, unrelated: plan.unrelated, created: apply ? missing.length : 0 }
}

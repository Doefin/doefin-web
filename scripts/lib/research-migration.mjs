import { loadTypescript } from './load-typescript.mjs'
const source = loadTypescript('content/v3-research.ts')
const { researchAnchor, isResearchAnchor } = loadTypescript('content/research-contract.ts', { './editorial-contract': loadTypescript('content/editorial-contract.ts') })
export const researchSeeds = source.v3Reports
export const methodologySeed = source.v3Methodology
export const reportId = slug => `research-report-${slug}`
export const methodologyId = 'research-methodology-difficulty-index'
export const normalizedResearchId = id => id.startsWith('drafts.') ? id.slice(7) : id.startsWith('versions.') ? id.split('.').slice(2).join('.') : id
const text = value => typeof value === 'string' && value.trim().length > 0
const date = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value
function sections(rows, identity) {
  if (!Array.isArray(rows) || !rows.length) throw new Error(`Invalid section list: ${identity}`)
  const anchors = new Set()
  return rows.map((section, index) => {
    const id = researchAnchor(section.heading)
    if (!text(section.heading) || !isResearchAnchor(id) || anchors.has(id) || !Array.isArray(section.paragraphs) || !section.paragraphs.length || !section.paragraphs.every(text)) throw new Error(`Invalid section: ${identity}`)
    anchors.add(id)
    return { _key: `section-${index}`, _type: 'researchSection', id, heading: section.heading, paragraphs: [...section.paragraphs] }
  })
}
export function researchDocuments(reports = researchSeeds, method = methodologySeed) {
  if (!Array.isArray(reports) || reports.length !== 2 || !Array.isArray(method) || method.length !== 4) throw new Error('Expected the two source research reports and four methodology sections')
  const ids = new Set(), slugs = new Set()
  const reportDocs = reports.map(report => {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(report.slug) || ids.has(report.slug) || slugs.has(report.slug) || !text(report.title) || !text(report.summary) || (report.seoSummary !== undefined && !text(report.seoSummary)) || !date(report.publishedAt)) throw new Error(`Invalid research report: ${report?.slug}`)
    ids.add(report.slug); slugs.add(report.slug)
    return { _id: reportId(report.slug), _type: 'researchReport', slug: { _type: 'slug', current: report.slug }, title: report.title, summary: report.summary, ...(report.seoSummary ? { seoSummary: report.seoSummary } : {}), publishedAt: report.publishedAt, sections: sections(report.sections, report.slug) }
  })
  return { reports: reportDocs, methodology: { _id: methodologyId, _type: 'researchMethodology', slug: { _type: 'slug', current: 'difficulty-index' }, sections: sections(method, 'difficulty-index') } }
}
const compare = doc => ({ _id: doc._id, _type: doc._type, slug: doc.slug?.current, title: doc.title ?? null, summary: doc.summary ?? null, seoSummary: doc.seoSummary ?? null, publishedAt: doc.publishedAt ?? null, sections: doc.sections?.map(row => ({ id: row.id, heading: row.heading, paragraphs: row.paragraphs })) })
export function planResearchImport(snapshot, expected = researchDocuments()) {
  if (!Array.isArray(snapshot) || snapshot.some(row => !row || !text(row._id) || !text(row._type))) throw new Error('Invalid authenticated raw snapshot')
  const documents = [...expected.reports, expected.methodology], conflicts = [], changed = [], missing = []
  for (const doc of documents) {
    const family = snapshot.filter(row => normalizedResearchId(row._id) === doc._id), canonical = family.find(row => row._id === doc._id)
    if (family.some(row => row._type !== doc._type)) conflicts.push(`${doc._id}: reserved ID occupied by another type`)
    if (!canonical && family.length) conflicts.push(`${doc._id}: draft/version-only editor work exists`)
    if (family.some(row => row._id !== doc._id)) conflicts.push(`${doc._id}: draft/version family exists alongside canonical record`)
    const collisions = snapshot.filter(row => row._type === doc._type && (row.slug?.current === doc.slug.current || row.slug === doc.slug.current) && normalizedResearchId(row._id) !== doc._id)
    if (collisions.length) conflicts.push(`${doc._id}: reserved slug exists under another ID`)
    if (canonical) { if (JSON.stringify(compare(canonical)) !== JSON.stringify(compare(doc))) changed.push(doc._id) }
    else if (!family.length && !collisions.length) missing.push(doc)
  }
  return { conflicts, changed, missing, unrelated: snapshot.filter(row => !documents.some(doc => normalizedResearchId(row._id) === doc._id)).length, snapshotRecords: snapshot.length }
}
export async function runResearchImport(client, { apply = false, editorsPaused = false } = {}) {
  const config = client.config()
  if (!config.token || config.projectId !== 'yzvr33lo' || config.dataset !== 'production') throw new Error('Authenticated CLI access to yzvr33lo/production is required')
  if (apply && !editorsPaused) throw new Error('A fresh exclusive research/methodology editing window is required')
  const started = Date.now()
  const snapshot = await client.withConfig({ perspective: 'raw', useCdn: false }).fetch('*[]{_id,_type,_rev,slug,title,summary,seoSummary,publishedAt,sections}', {}, { perspective: 'raw', cache: 'no-store' })
  const plan = planResearchImport(snapshot)
  if (plan.conflicts.length) throw new Error(`Research import blocked: ${plan.conflicts.join('; ')}`)
  if (plan.changed.length) throw new Error(`Existing research records differ from source: ${plan.changed.join(', ')}`)
  if (apply && plan.missing.length) {
    if (Date.now() - started > 5000) throw new Error('Research preflight snapshot is stale; rerun immediately')
    let tx = client.transaction()
    for (const doc of plan.missing) tx = tx.createIfNotExists(doc)
    await tx.commit({ visibility: 'sync' })
  }
  const prefix = id => id.startsWith('drafts.') || id.startsWith('versions.')
  return { expectedReports: 2, expectedMethodologies: 1, missing: plan.missing.map(doc => doc._id), changed: plan.changed, conflicts: plan.conflicts, unrelated: plan.unrelated, snapshotRecords: plan.snapshotRecords, publishedRecords: snapshot.filter(row => !prefix(row._id)).length, draftRecords: snapshot.filter(row => row._id.startsWith('drafts.')).length, versionRecords: snapshot.filter(row => row._id.startsWith('versions.')).length, countsByType: Object.fromEntries(snapshot.reduce((m, row) => m.set(row._type, (m.get(row._type) ?? 0) + 1), new Map())), rawSnapshot: snapshot, created: apply ? plan.missing.length : 0 }
}

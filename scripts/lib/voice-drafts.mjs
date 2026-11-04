// Turns a reviewed copy rewrite (rows of {_id, path, before, after, verdict}) into
// Sanity draft patches. Pure functions: callers fetch documents and write drafts.
// A row's path is a Sanity patch path, such as sections[_key=="section-0"].paragraphs[1].

export const WRITE_VERDICTS = new Set(['Change', 'Cut', 'Matteo'])
const CUT = Symbol('cut')

export function parsePath(path) {
  const segments = []
  const re = /([A-Za-z_][A-Za-z0-9_]*)|\[_key=="([^"]+)"\]|\[(\d+)\]|\./gy
  let m
  while (re.lastIndex < path.length && (m = re.exec(path))) {
    if (m[1]) segments.push({ field: m[1] })
    else if (m[2]) segments.push({ key: m[2] })
    else if (m[3]) segments.push({ index: Number(m[3]) })
  }
  if (re.lastIndex !== path.length || !segments.length || !segments[0].field) throw new Error(`Unreadable path: ${path}`)
  return segments
}

function step(node, segment) {
  if (node == null) return undefined
  if ('field' in segment) return node[segment.field]
  if ('key' in segment) return Array.isArray(node) ? node.find(item => item?._key === segment.key) : undefined
  return Array.isArray(node) ? node[segment.index] : undefined
}

export const valueAt = (doc, path) => parsePath(path).reduce(step, doc)

function assign(doc, segments, value) {
  const parent = segments.slice(0, -1).reduce(step, doc)
  const last = segments.at(-1)
  if (parent == null) return false
  if ('field' in last) parent[last.field] = value
  else if ('key' in last) {
    const i = parent.findIndex(item => item?._key === last.key)
    if (i < 0) return false
    parent[i] = value
  } else parent[last.index] = value
  return true
}

const prune = value => Array.isArray(value)
  ? value.filter(item => item !== CUT && !(item && typeof item === 'object' && item[CUT])).map(prune)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, prune(v)]))
    : value

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/**
 * Plans one draft per document. A document is skipped, with a reason, when any of its
 * rows no longer matches the published text, or when an editor already has a draft.
 * Cutting a list item removes it; cutting a field of a keyed object removes the object.
 */
export function planVoiceDrafts(rows, published, { draftIds = new Set() } = {}) {
  const byId = new Map()
  for (const row of rows) {
    if (!WRITE_VERDICTS.has(row.verdict)) continue
    if (!byId.has(row._id)) byId.set(row._id, [])
    byId.get(row._id).push(row)
  }
  const drafts = [], conflicts = []
  for (const [id, docRows] of byId) {
    const base = published.find(doc => doc._id === id)
    if (!base) { conflicts.push(`${id}: not published`); continue }
    if (draftIds.has(`drafts.${id}`)) { conflicts.push(`${id}: an editor already has a draft`); continue }
    const stale = docRows.filter(row => !same(valueAt(base, row.path), row.before))
    if (stale.length) { conflicts.push(`${id}: published text changed at ${stale.map(row => row.path).join(', ')}`); continue }
    const next = structuredClone(base)
    for (const row of docRows) {
      const segments = parsePath(row.path)
      const cut = row.verdict === 'Cut' || (row.verdict === 'Matteo' && row.after === '')
      if (!cut) { assign(next, segments, row.after); continue }
      const last = segments.at(-1)
      if ('index' in last) assign(next, segments, CUT)
      else {
        const owner = segments.slice(0, -1).reduce(step, next)
        if (!owner || typeof owner !== 'object' || !segments.at(-2) || !('key' in segments.at(-2))) {
          conflicts.push(`${id}: cannot cut ${row.path}`)
          continue
        }
        owner[CUT] = true
      }
    }
    const pruned = prune(next)
    const set = {}
    for (const field of new Set(docRows.map(row => parsePath(row.path)[0].field))) {
      if (!same(pruned[field], base[field])) set[field] = pruned[field]
    }
    if (Object.keys(set).length) drafts.push({ _id: id, _type: base._type, set, rows: docRows.length })
  }
  return { drafts, conflicts }
}

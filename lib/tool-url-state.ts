export type ToolBounds<T> = Partial<Record<keyof T, readonly [number, number]>>

/** Shared by URL restoration and scenario exports; invalid values keep defaults. */
export function readToolQuery<T extends Record<string, number>>(
  defaults: T,
  query: URLSearchParams,
  bounds?: ToolBounds<T>,
) {
  const values = { ...defaults }
  let found = false
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const raw = query.get(String(key))
    if (raw !== null && raw.trim() !== '' && Number.isFinite(Number(raw))) {
      const range = bounds?.[key]
      values[key] = (range ? Math.min(range[1], Math.max(range[0], Number(raw))) : Number(raw)) as T[keyof T]
      found = true
    }
  }
  return { values, found }
}

export function toolQuery<T extends Record<string, number>>(defaults: T, values: T) {
  const query = new URLSearchParams()
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    if (values[key] !== defaults[key]) query.set(String(key), String(values[key]))
  }
  return query.toString()
}

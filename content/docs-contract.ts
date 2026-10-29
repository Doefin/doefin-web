import { isEditorialAnchor } from './editorial-contract'
/** Fixed navigation groups; new pages choose a group without component edits. */
export const v3DocGroups = ['Understand Doefin', 'Use the app', 'Reference'] as const
/** Preserve every original deep link; stored IDs no longer follow title edits. */
export const docsSectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
export const isDocsAnchor = (value: unknown): value is string => isEditorialAnchor(value) && !['docs-content', 'docs-resources'].includes(value)
/** Optional navigation accepts site-root paths or HTTPS, never executable schemes,
 * protocol-relative URLs, controls, backslashes or encoded separator ambiguity. */
export function isSafeDocsHref(value: unknown): value is string {
  if (typeof value !== 'string' || !value || /%(?![a-f0-9]{2})/i.test(value) || value !== value.trim() || /[\s\u0000-\u001f\u007f\\]/.test(value) || /%(?:0[0-9a-f]|1[0-9a-f]|7f|2f|5c)/i.test(value)) return false
  const segments = value.split(/[?#]/)[0].split('/')
  if (segments.some(segment => { try { return ['.','..'].includes(decodeURIComponent(segment)) } catch { return true } })) return false
  if (value.startsWith('/')) return !value.startsWith('//')
  if (!/^https:\/\/[^/]/i.test(value)) return false
  try { const url = new URL(value); return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password } catch { return false }
}

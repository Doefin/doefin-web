/** IDs owned by the shared shell and editorial templates cannot be CMS anchors.
 * Shared by runtime parsing, Studio validation and seed import validation. */
export const reservedEditorialAnchors = ['main', 'v3-mobile-menu', 'article-body', 'article-next'] as const
export function isEditorialAnchor(value: unknown): value is string {
  return typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
    !(reservedEditorialAnchors as readonly string[]).includes(value) && !value.startsWith('v3-navigation-')
}

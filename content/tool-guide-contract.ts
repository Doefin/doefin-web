/** Executable calculator identities and fixed article anchors remain application-owned. */
export const guideTools = ['hosting-effective-rate', 'difficulty-exposure', 'fleet-payback'] as const
export const guideAnchors = ['how-to-use', 'settings', 'reading', 'walkthrough', 'mistakes', 'limits'] as const
export const guideText = (value: unknown): value is string => typeof value === 'string' && !!value.trim()
export const guideSlug = (value: unknown): value is string => guideText(value) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)
export const guideDate = (value: unknown) => value == null || (guideText(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value)

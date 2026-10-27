import { isEditorialAnchor } from './editorial-contract'
export const researchAnchor = (heading: string) => heading.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
export const isResearchAnchor = (value: unknown): value is string => isEditorialAnchor(value)

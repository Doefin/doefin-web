/** Presentation policy only. No indexing, redirects or deployment is activated here. */
export type PublicationMode = 'preview' | 'canonical'
export const publicationMode: PublicationMode = 'preview'

export type NavigationItem = { label: string; href: string; description: string }
export type NavigationGroup = { label: string; items: readonly NavigationItem[] }
export const navigationGroups: readonly NavigationGroup[] = [
  { label: 'Product', items: [
    { label: 'How it works', href: '/v3/product', description: 'Understand the instrument and its limits.' },
    { label: 'For miners', href: '/v3/for/miners', description: 'Plan production exposure and review a market.' },
    { label: 'For finance teams, funds & desks', href: '/v3/for/institutions', description: 'Prepare an internal review and inspect contract terms.' },
    { label: 'Documentation', href: '/v3/docs', description: 'Mechanics, app tasks, risks and key terms.' },
    { label: 'Technical review', href: '/v3/docs/smart-contracts', description: 'Inspect deployment and contract evidence.' },
  ] },
  { label: 'Tools', items: [
    { label: 'All calculators', href: '/v3/tools', description: 'Use exact inputs and compare operating scenarios.' },
    { label: 'Difficulty exposure', href: '/v3/tools/difficulty-exposure', description: 'Compare BTC production and prepare a team brief.' },
  ] },
  { label: 'Data & Research', items: [
    { label: 'Data', href: '/v3/data', description: 'Inspect data provenance, examples and limitations.' },
    { label: 'Research', href: '/v3/research', description: 'Read findings, methods and reproducible calculations.' },
    { label: 'Forecast evaluation', href: '/v3/data/scoreboard', description: 'Compare errors and check the evidence status.' },
    { label: 'Methodology', href: '/v3/methodology/difficulty-index', description: 'Understand how the difficulty estimate is constructed.' },
    { label: 'Research emails', href: '/v3/newsletter', description: 'Preview retarget research, requested formats and publication alerts.' },
  ] },
  { label: 'Learn', items: [
    { label: 'Start learning', href: '/v3/learn', description: 'Follow a practical, reproducible walkthrough.' },
    { label: 'Worked example', href: '/v3/learn/difficulty-exposure', description: 'Connect difficulty to BTC production.' },
    { label: 'Academy', href: '/v3/academy', description: 'Understand difficulty, hashprice and uncertainty.' },
    { label: 'Articles', href: '/v3/blog', description: 'Read about mining assumptions and data.' },
    { label: 'Mining glossary', href: '/v3/glossary', description: 'Look up factual network and operating definitions.' },
    { label: 'All resources', href: '/v3/resources', description: 'Find the complete reference library.' },
  ] },
]

/** Research and educational commentary use a non-promotional shared template. */
export function isCommentaryPath(pathname: string): boolean {
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, '')
  return /^\/v3\/(?:research|data|methodology|learn|academy|blog|glossary|newsletter)(?:\/|$)/.test(path)
}
export function navigationForPath(pathname: string): readonly NavigationGroup[] {
  return isCommentaryPath(pathname) ? navigationGroups.filter(group => group.label !== 'Product') : navigationGroups
}
export function publicationUi(mode: PublicationMode = publicationMode) {
  return { showVersionSelector: false, showPreviewLabel: mode === 'preview' }
}

/** Generates reviewable canonical destinations without changing current routes. */
export function plannedCanonicalPath(href: string): string | null {
  if (!/^\/v[1234](?:\/|[?#]|$)/.test(href)) return null
  const unversioned = href.replace(/^\/v[1234](?=\/|[?#]|$)/, '')
  if (unversioned === '' || unversioned.startsWith('?') || unversioned.startsWith('#')) return '/' + unversioned
  return unversioned
}

export type ApprovedPromotion = { label: string; description: string; href: string; approvalReference: string }
/** Intentionally empty. Any addition needs a documented publication review. */
export const approvedCommentaryPromotions: Readonly<Record<string, ApprovedPromotion>> = Object.freeze({})
export function commentaryPromotionFor(pathname: string): ApprovedPromotion | null {
  if (!isCommentaryPath(pathname)) return null
  return approvedCommentaryPromotions[pathname.split(/[?#]/)[0].replace(/\/$/, '')] ?? null
}

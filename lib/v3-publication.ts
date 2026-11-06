/** Presentation policy only. No indexing, redirects or deployment is activated here. */
export type PublicationMode = 'preview' | 'canonical'
export const publicationMode: PublicationMode = 'preview'

export type NavigationItem = { label: string; href: string; description: string }
export type NavigationGroup = { label: string; items: readonly NavigationItem[] }
export const navigationGroups: readonly NavigationGroup[] = [
  { label: 'Product', items: [
    { label: 'How it works', href: '/product', description: 'See how difficulty markets work and what they do not cover.' },
    { label: 'For miners', href: '/for/miners', description: 'Estimate how rising difficulty affects expected BTC production and how a position could offset part of the exposure.' },
    { label: 'For finance teams, funds & desks', href: '/for/institutions', description: 'Trade your view on Bitcoin network hashrate.' },
    { label: 'Documentation', href: '/docs', description: 'Mechanics, app tasks, risks and key terms.' },
    { label: 'Technical review', href: '/docs/smart-contracts', description: 'Inspect deployment and contract evidence.' },
  ] },
  { label: 'Tools', items: [
    { label: 'All calculators', href: '/tools', description: 'Enter your own assumptions and compare mining scenarios.' },
    { label: 'Difficulty exposure', href: '/tools/difficulty-exposure', description: 'Compare expected BTC production and prepare a team brief.' },
  ] },
  { label: 'Data & Research', items: [
    { label: 'Data', href: '/data', description: 'Check where the data comes from, with examples and limits.' },
    { label: 'Research', href: '/research', description: 'Read findings, methods and reproducible calculations.' },
    { label: 'Forecast evaluation', href: '/data/scoreboard', description: 'Compare forecast errors and check which figures are examples.' },
    { label: 'Methodology', href: '/methodology/difficulty-index', description: 'See how the difficulty estimate is calculated.' },
    { label: 'Newsletter demo', href: '/newsletter', description: 'Preview newsletter preferences. No subscription is saved.' },
  ] },
  { label: 'Learn', items: [
    { label: 'Start learning', href: '/learn', description: 'Follow a worked example and check the calculation.' },
    { label: 'Worked example', href: '/learn/difficulty-exposure', description: 'Connect difficulty to expected BTC production.' },
    { label: 'Academy', href: '/academy', description: 'Understand difficulty, hashprice and uncertainty.' },
    { label: 'Articles', href: '/blog', description: 'Read about mining assumptions and data.' },
    { label: 'Mining glossary', href: '/glossary', description: 'Look up mining and network terms.' },
    { label: 'All resources', href: '/resources', description: 'Find the guides, calculators and definitions.' },
  ] },
]

/** Research and educational commentary use a non-promotional shared template. */
export function isCommentaryPath(pathname: string): boolean {
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, '')
  return /^\/(?:research|data|methodology|learn|academy|blog|glossary|newsletter)(?:\/|$)/.test(path)
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

/** Presentation policy only. No indexing, redirects or deployment is activated here. */
export type PublicationMode = 'preview' | 'canonical'
export const publicationMode: PublicationMode = 'preview'

export type NavigationItem = { label: string; href: string }
type NavigationSection = { label: string; items: readonly NavigationItem[] }
type NavigationFeature = { kicker: string; title: string; description: string; item: NavigationItem }
export type NavigationGroup = {
  id: string
  label: string
  description: string
  sections: readonly NavigationSection[]
  feature: NavigationFeature
}

const marketOverview = { label: 'Difficulty markets overview', href: '/product' }
const difficultyCalculator = { label: 'Difficulty exposure calculator', href: '/tools/difficulty-exposure' }
const research = { label: 'Research', href: '/research' }
const workedExample = { label: 'Worked production example', href: '/learn/difficulty-exposure' }

export const navigationGroups: readonly NavigationGroup[] = [
  {
    id: 'product',
    label: 'Product',
    description: 'Markets, settlement and documentation',
    sections: [
      { label: 'Markets', items: [
        marketOverview,
        { label: 'For miners', href: '/for/miners' },
        { label: 'For funds and desks', href: '/for/institutions' },
        { label: 'How settlement works', href: '/product/settlement' },
      ] },
      { label: 'Reference and company', items: [
        { label: 'Documentation', href: '/docs' },
        { label: 'Contract and audit evidence', href: '/docs/smart-contracts' },
        { label: 'Risks and limitations', href: '/docs/risks-and-limitations' },
        { label: 'About Doefin', href: '/about' },
      ] },
    ],
    feature: { kicker: 'Start here', title: 'How difficulty markets work', description: 'Read the contract basics and what a position can cover.', item: marketOverview },
  },
  {
    id: 'tools',
    label: 'Tools',
    description: 'Difficulty, hosting and fleet calculators',
    sections: [
      { label: 'Calculators', items: [
        difficultyCalculator,
        { label: 'Hosting costs calculator', href: '/tools/hosting-effective-rate' },
        { label: 'Fleet payback calculator', href: '/tools/fleet-payback' },
        { label: 'All calculators', href: '/tools' },
      ] },
    ],
    feature: { kicker: 'Start with your fleet', title: 'Estimate BTC production', description: 'Compare expected production at different difficulty levels.', item: difficultyCalculator },
  },
  {
    id: 'data',
    label: 'Data & research',
    description: 'Mining data, research and methods',
    sections: [
      { label: 'Data and methods', items: [
        { label: 'Mining data', href: '/data' },
        { label: 'Difficulty estimate', href: '/data/difficulty' },
        { label: 'Network hashrate', href: '/data/hashrate' },
        { label: 'Forecast evaluation', href: '/data/scoreboard' },
        { label: 'Difficulty index methodology', href: '/methodology/difficulty-index' },
      ] },
      { label: 'Research and updates', items: [research, { label: 'Newsletter demo', href: '/newsletter' }] },
    ],
    feature: { kicker: 'Explore the evidence', title: 'Bitcoin mining research', description: 'Read the findings and the methods behind them.', item: research },
  },
  {
    id: 'learn',
    label: 'Learn',
    description: 'Guides, articles and glossary',
    sections: [
      { label: 'Guides and examples', items: [
        { label: 'Learning overview', href: '/learn' },
        workedExample,
        { label: 'Academy', href: '/academy' },
        { label: 'Calculator guides', href: '/academy#guides' },
      ] },
      { label: 'Reference', items: [
        { label: 'Articles', href: '/blog' },
        { label: 'Mining glossary', href: '/glossary' },
        { label: 'All resources', href: '/resources' },
      ] },
    ],
    feature: { kicker: 'Start with an example', title: 'Expected BTC production', description: 'See what happens to expected production when difficulty changes.', item: workedExample },
  },
]

export function navigationShortcuts(commentary: boolean): readonly NavigationItem[] {
  const calculator = { ...difficultyCalculator, label: 'Difficulty calculator' }
  return commentary ? [calculator] : [{ ...marketOverview, label: 'Difficulty markets' }, calculator]
}

/** Research and educational commentary use a non-promotional shared template. */
export function isCommentaryPath(pathname: string): boolean {
  const path = pathname.split(/[?#]/)[0].replace(/\/$/, '')
  return /^\/(?:research|data|methodology|learn|academy|blog|glossary|newsletter)(?:\/|$)/.test(path)
}
export function navigationForPath(pathname: string): readonly NavigationGroup[] {
  return isCommentaryPath(pathname) ? navigationGroups.filter(group => group.id !== 'product') : navigationGroups
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

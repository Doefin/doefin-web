// The trading app (doefin-frontend). Amplify sets NEXT_PUBLIC_TRADING_APP_URL per
// environment: https://app.doefin.com in production, https://app.staging.doefin.com in
// staging. doefin.com itself is this site.
export const tradingAppOrigin = new URL(process.env.NEXT_PUBLIC_TRADING_APP_URL || 'https://app.doefin.com').origin

export const site = {
  name: 'Doefin',
  url: 'https://doefin.com',
  appUrl: `${tradingAppOrigin}/app/markets`,
  tagline: 'Trade and hedge Bitcoin hashrate exposure',
  description:
    'Doefin provides markets for trading and hedging Bitcoin hashrate exposure. Documentation, calculators and illustrative examples on mining difficulty.',
  entity: 'Doefin',
  /** Retained legal-page prototype values; unverified and excluded from shared metadata. */
  legalName: 'Doefin',
  registeredIn: 'Port Louis, Mauritius',
  contactEmail: 'matteo@doefin.com',
  sameAs: [
    // These become the Organization sameAs. Populate once the accounts exist —
    // they are how search engines confirm we are a real company.
    // 'https://www.linkedin.com/company/doefin',
    // 'https://x.com/doefin',
  ],
} as const

export const nav = [
  { href: '/data', label: 'Data' },
  { href: '/research', label: 'Research' },
  { href: '/academy', label: 'Learn' },
  { href: '/tools', label: 'Tools' },
  { href: '/blog', label: 'Blog' },
  { href: '/docs', label: 'Docs' },
] as const

export const footerNav = [
  {
    title: 'Data',
    links: [
      { href: '/data', label: 'Overview' },
      { href: '/data/difficulty', label: 'Difficulty forecast' },
      { href: '/data/scoreboard', label: 'Accuracy scoreboard' },
      { href: '/data/hashrate', label: 'Network hashrate' },
      { href: '/methodology/difficulty-index', label: 'Methodology' },
    ],
  },
  {
    title: 'Learn',
    links: [
      { href: '/academy', label: 'Academy' },
      { href: '/glossary', label: 'Glossary' },
      { href: '/research', label: 'Research' },
      { href: '/blog', label: 'Blog' },
      { href: '/newsletter', label: 'Newsletter' },
    ],
  },
  {
    title: 'For you',
    links: [
      { href: '/for/miners', label: 'For miners' },
      { href: '/for/institutions', label: 'For funds & desks' },
      { href: '/tools', label: 'Tools' },
      { href: '/resources', label: 'Resources' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/docs', label: 'Documentation' },
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
    ],
  },
] as const

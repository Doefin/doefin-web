export const site = {
  name: 'Doefin',
  url: 'https://doefin.com',
  appUrl: 'https://app.doefin.com',
  tagline: 'Bitcoin mining difficulty, forecast honestly.',
  description:
    'Forward difficulty forecasts with published confidence intervals, a public accuracy scoreboard, and the research behind them. For Bitcoin miners, funds and desks.',
  entity: 'Doefin',
  /** The registered legal name, as it must appear in Terms and in schema. */
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

export type Doc = {
  slug: string
  title: string
  summary: string
  group: 'Getting started' | 'Trading' | 'Positions' | 'Technical'
  body: string[]
  status: 'published' | 'to-migrate'
}

/**
 * Product documentation. Two pages are written out to show the shape; the rest are
 * listed as stubs because the source is 15 files in the trading app awaiting
 * migration — the largest single body of prose we own that is currently invisible
 * to search.
 */
export const docs: Doc[] = [
  {
    slug: 'what-doefin-settles-on',
    title: 'What Doefin settles on',
    summary: 'Bitcoin mining difficulty, observed once at a stated block height.',
    group: 'Getting started',
    status: 'published',
    body: [
      'Every Doefin market settles on Bitcoin mining difficulty as published by the network, observed once at a specific block height. Not hashprice, not the bitcoin price, and not a composite index.',
      'Settlement is defined by block height rather than by calendar date because heights are exact. A date is an estimate until the block actually lands, and in a market that settles on a single observation that difference matters.',
      'Because difficulty is public chain data, any counterparty can verify the settlement value independently rather than trusting a print. That is the point of settling on it.',
    ],
  },
  {
    slug: 'how-settlement-works',
    title: 'How settlement works',
    summary: 'Binary settlement, observed once, fully collateralised.',
    group: 'Positions',
    status: 'published',
    body: [
      'Positions are binary. At the observation block, difficulty is either at or above the level you selected or it is not, and the position pays in full or pays nothing.',
      'The size of the move does not change the payout. A small move past your selected level and a large one pay the same amount, which is what makes the instrument simple to size against a production shortfall.',
      'All positions are fully collateralised, and settle in a bitcoin-denominated token so payouts keep their bitcoin denomination.',
    ],
  },
  { slug: 'connecting-a-wallet', title: 'Connecting a wallet', summary: 'Supported wallets and the connection flow.', group: 'Getting started', status: 'to-migrate', body: [] },
  { slug: 'getting-collateral', title: 'Getting collateral', summary: 'How to fund an account.', group: 'Getting started', status: 'to-migrate', body: [] },
  { slug: 'your-first-trade', title: 'Your first trade', summary: 'Placing an order, step by step.', group: 'Trading', status: 'to-migrate', body: [] },
  { slug: 'market-vs-limit-orders', title: 'Market and limit orders', summary: 'Which to use and when.', group: 'Trading', status: 'to-migrate', body: [] },
  { slug: 'order-management', title: 'Managing orders', summary: 'Amending and cancelling.', group: 'Trading', status: 'to-migrate', body: [] },
  { slug: 'prices-and-probability', title: 'Prices and probability', summary: 'Reading a price as an implied probability.', group: 'Trading', status: 'to-migrate', body: [] },
  { slug: 'managing-positions', title: 'Managing positions', summary: 'Monitoring open exposure.', group: 'Positions', status: 'to-migrate', body: [] },
  { slug: 'redeeming-positions', title: 'Redeeming positions', summary: 'Claiming after settlement.', group: 'Positions', status: 'to-migrate', body: [] },
  { slug: 'collateral-tokens', title: 'Collateral tokens', summary: 'Which tokens are accepted.', group: 'Technical', status: 'to-migrate', body: [] },
  { slug: 'smart-contracts', title: 'Smart contracts', summary: 'Deployed addresses and audits.', group: 'Technical', status: 'to-migrate', body: [] },
]

export const publishedDocs = () => docs.filter((d) => d.status === 'published')
export const docGroups = ['Getting started', 'Trading', 'Positions', 'Technical'] as const

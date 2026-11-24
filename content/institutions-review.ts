import type { InstitutionsReview } from './institutions-review-types'

/**
 * Migration seed for the /for/institutions "Before committing capital" section,
 * copied verbatim from the pre-CMS InstitutionsPage markup. Never a runtime
 * fallback: the page reads published Sanity content, and this module exists so
 * scripts/migrate-institutions-review.mjs can recreate the initial document.
 */
export const institutionsReviewSeed: InstitutionsReview = {
  visible: true,
  eyebrow: 'Before committing capital',
  heading: 'Check the market against your requirements.',
  intro: 'Use the selected market’s terms alongside the documentation. Public material is freely available; it does not establish suitability or approval for your organisation.',
  riskNote: 'You can lose the full amount paid for a position.',
  cards: [
    {
      title: 'What decision are you making?',
      summary: 'Start with the decision your team needs to make.',
      disclosureSummary: 'Review planning details',
      disclosureParagraphs: [
        'For a production comparison, check the fleet assumptions and period against your operating forecast. Record the model’s limits and the questions still open.',
        'Share the inputs and results your team needs. Keep private discussion notes out of public links.',
      ],
      links: [{ label: 'Prepare a scenario brief', href: '/tools/difficulty-exposure#scenario-brief' }],
    },
    {
      title: 'What are the costs and outcomes?',
      summary: 'Check the threshold and observation block against your analysis.',
      disclosureSummary: 'Review costs and settlement',
      disclosureParagraphs: [
        'Read the settlement block, payout and redemption rules separately. Confirm the collateral token, how you will fund the position and the fees. Check what your team needs to report and how the position affects cash needs.',
      ],
      links: [{ label: 'Read settlement and payout rules', href: '/docs/how-settlement-works' }],
    },
    {
      title: 'Could you exit the position?',
      summary: 'Check market depth, whether your order could fill only in part and how you could exit.',
      disclosureSummary: 'Review liquidity and custody',
      disclosureParagraphs: [
        'Limited liquidity can prevent a full exit before settlement. Review your wallet or custody controls, the smart contract deployments and the technical evidence.',
        'Funding and payouts depend on the collateral token, smart contracts, networks and the settlement process.',
      ],
      links: [
        { label: 'Read how orders execute', href: '/docs/market-vs-limit-orders' },
        { label: 'Inspect smart contracts', href: '/docs/smart-contracts' },
      ],
    },
    {
      title: 'Who can approve the amount?',
      summary: 'Your authorised reviewers must confirm your organisation’s mandate and eligibility.',
      disclosureSummary: 'Review approval requirements',
      disclosureParagraphs: [
        'They must resolve legal or accounting questions and approve the amount before you commit capital.',
        'This walkthrough sets no minimum fleet size or capital amount. Assess suitability through your own review process.',
      ],
      links: [
        { label: 'Read the limitations', href: '/docs/risks-and-limitations' },
        { label: 'Discuss mandate questions', contactSubject: 'Doefin finance and mandate review' },
      ],
    },
  ],
  stripHeading: 'Have a question about a market?',
  stripText: 'Contact the team with the market you are considering and the question you need answered.',
  stripLabel: 'Contact the team',
  stripSubject: 'Doefin desk review',
}

import { preview } from '@/lib/preview'
import { calculateExposure, exposureDefaults } from '@/lib/exposure'

export type PreviewTool = {
  slug: string; title: string; description: string; use: string; limit: string
  assumptions: string; learning: { href: string; title: string; text: string }
}
const tools: PreviewTool[] = [
  { slug: 'difficulty-exposure', title: 'Put a number on difficulty exposure.',
    description: 'Compare the BTC your fleet could produce across two difficulty scenarios. Start with a sample, then enter your own assumptions.',
    use: 'Measure production sensitivity over a fixed time window.',
    limit: 'This is not a contract payout or an order size.',
    assumptions: 'The model holds hashrate, average fees and the 3.125 BTC block subsidy constant. Each epoch represents approximately two weeks at the target block interval; it does not predict actual epoch duration. Difficulty changes are applied across the whole period. Uptime and pool fees are excluded.',
    learning: { href: preview.tutorial, title: 'Follow a worked exposure example', text: 'Understand each input and check your result, step by step.' } },
  { slug: 'hosting-effective-rate', title: 'Compare the cost behind the quote.',
    description: 'Bring hosting fees, paid downtime and curtailment into one calculation. Save one quote and see how another compares.',
    use: 'Compare hosting offers on the same assumptions.',
    limit: 'A difficulty contract does not settle on your hosting bill.',
    assumptions: 'This model assumes you pay for contracted power even during downtime and curtailment. Pool fees are expressed as an equivalent cost adjustment for comparison; they are not an electricity invoice. Check your actual billing terms before using the result.',
    learning: { href: preview.learn, title: 'Choose the right question first', text: 'Separate operating cost, production sensitivity and contract settlement.' } },
  { slug: 'fleet-payback', title: 'Test the assumptions behind payback.',
    description: 'Explore how power costs and different difficulty paths change when a fleet could recover its initial outlay.',
    use: 'Compare simple cash-flow scenarios for the same fleet.',
    limit: 'A payback estimate is not a guaranteed return.',
    assumptions: 'This simplified model holds BTC price, efficiency and the 3.125 BTC subsidy constant, including across any future halving. It excludes transaction fees, pool fees, downtime, tax, financing and resale value. Use the comparison to investigate assumptions, not as a complete investment model.',
    learning: { href: preview.report, title: 'How to evaluate a forecast', text: 'Inspect the evidence behind a difficulty assumption.' } },
]

const tutorialInputs = { ...exposureDefaults, eh: 1, epochs: 1, low: 0, high: 10 }
const example = calculateExposure(tutorialInputs)
export const exposureTutorial = {
  title: 'Measure your fleet’s difficulty exposure.',
  description: 'A practical walkthrough: load a sample fleet, compare production, and understand what the result can — and cannot — tell you.',
  objective: 'Estimate the BTC production difference caused by a difficulty change over a fixed time window.',
  prerequisites: ['Your fleet hashrate in EH/s (1 EH/s = 1,000,000 TH/s).', 'A starting difficulty and two scenarios to compare.', 'An average fee assumption and a time window. No wallet is needed.'],
  inputs: tutorialInputs,
  example,
  calculatorHref: preview.exposure + '?' + new URLSearchParams(Object.entries(tutorialInputs).map(([k, v]) => [k, String(v)])).toString(),
  steps: [
    { id: 'load', title: 'Load a clearly defined sample.', body: 'Open the worked example. It uses 1 EH/s, starting difficulty of 127.48 T, average fees of 0.05 BTC per block and one epoch of target time (about two weeks). These are illustrative inputs, not current network data.', expected: 'Hashrate reads 1.00 EH/s and the window reads one epoch.' },
    { id: 'compare', title: 'Change one variable: difficulty.', body: 'Set the lower scenario to 0% and the higher scenario to +10%. Leave hashrate, fees and time unchanged. This isolates difficulty sensitivity instead of mixing several operational changes.', expected: 'The lower scenario matches “No change”; the higher scenario produces fewer BTC.' },
    { id: 'read', title: 'Read production before the dollar value.', body: 'Compare production at starting difficulty with production after the 10% increase. The USD figure simply multiplies the BTC difference by the price input; it is not a second source of loss.', expected: `Production falls from ${example.base.toFixed(3)} BTC to ${example.atHigh.toFixed(3)} BTC, a difference of ${example.lossHigh.toFixed(3)} BTC.` },
    { id: 'apply', title: 'Replace the sample with your own inputs.', body: 'Enter your hashrate and assumptions. Read the model limits, then review how a difficulty contract settles. A production difference changes continuously; a binary contract has a threshold and a fixed payout.', expected: 'You can explain the production range and why it is different from a contract payout.' },
  ],
  related: {
    learning: { href: preview.settlement, title: 'Connect exposure to settlement', text: 'See how a binary outcome differs from a production shortfall.' },
    action: { href: preview.exposure, title: 'Calculate your own exposure', text: 'Replace the worked example with your fleet and assumptions.' },
  },
}

export type EvidenceRow = { sample: string; forecast: number; observed: number }
export const forecastReport = {
  title: 'How to evaluate a difficulty forecast.',
  description: 'A sample research format that puts the evidence, calculation and limits beside the conclusion.',
  publishedAt: '2026-09-17',
  classification: 'Synthetic example — not historical performance',
  summary: 'A point forecast is only one part of the story. Compare a frozen forecast with the same outcome definition, keep missed predictions in the record, and inspect the size and direction of the errors.',
  rows: [
    { sample: 'Sample 01', forecast: 2, observed: 3.2 },
    { sample: 'Sample 02', forecast: -1, observed: -0.5 },
    { sample: 'Sample 03', forecast: 4, observed: 2.8 },
    { sample: 'Sample 04', forecast: 0.5, observed: 1 },
    { sample: 'Sample 05', forecast: 3, observed: 4.6 },
  ] satisfies EvidenceRow[],
  findings: [
    { title: 'Show every observation.', body: 'The table includes all five synthetic pairs. A useful report lets the reader inspect misses as easily as successes.' },
    { title: 'Keep the units explicit.', body: 'The forecast and observed columns are difficulty changes in percent. Their difference is measured in percentage points.' },
    { title: 'Keep the claim proportional to the evidence.', body: 'These invented rows demonstrate the format and arithmetic. They cannot establish forecast accuracy or support a trading decision.' },
  ],
  related: {
    learning: { href: preview.tutorial, title: 'Turn a scenario into a production estimate', text: 'Work through the effect of a difficulty change on a sample fleet.' },
    action: { href: preview.exposure, title: 'Explore difficulty scenarios', text: 'Use assumptions you choose; this sample does not supply a forecast.' },
  },
}

export const previewTools = () => tools
export const getPreviewTool = (slug: string) => tools.find(tool => tool.slug === slug)
export const getExposureTutorial = () => exposureTutorial
export const getForecastReport = () => forecastReport

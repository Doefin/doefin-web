import type { Report } from './types'

export const reports: Report[] = [
  {
    slug: 'difficulty-forecast-accuracy-2026',
    reportId: 'DR-2026-01',
    title: 'How accurate are public Bitcoin difficulty forecasts?',
    seoTitle: 'How accurate are Bitcoin difficulty forecasts?',
    summary:
      'Four widely used estimators, scored against what actually happened. They disagree with each other more than any of them admits.',
    publishedAt: '2026-08-21',
    author: 'Doefin Research',
    findings: [
      'For the same adjustment, published estimates from three major sources spanned more than three percentage points.',
      'None of the four publishes a confidence interval alongside its live figure.',
      'Empirical adjustment volatility in the current era is 4.67 percentage points, which is wider than most readers assume.',
      'A perfect oracle would beat naive extrapolation by roughly one percentage point of error at mid-epoch — the room for skill is small, and the room for honesty about uncertainty is large.',
    ],
    sources: [
      { label: 'All difficulty epochs, computed from chain data', accessedAt: '2026-08-21', confidence: 'measured' },
      { label: 'Published estimates captured at time of reading', accessedAt: '2026-08-21', confidence: 'measured' },
    ],
    body: [
      { heading: 'What we measured' },
      'We took every public source that publishes a forward difficulty estimate and recorded what each said, when, and what the adjustment turned out to be.',
      { heading: 'They disagree more than any of them admits' },
      'The headline is not that any one of them is bad. It is that they disagree — sometimes by more than three percentage points on the same adjustment — while each presents its figure as a single confident number with no range attached.',
      { heading: 'What a reader cannot see' },
      'A reader consulting one source has no way to know how much disagreement exists, or how much uncertainty is genuinely present at that point in the epoch. Both are knowable, and both are omitted.',
      { heading: 'Scoring ourselves too' },
      'This report accompanies a public scoreboard that scores every estimator, including ours, on every adjustment from here on. We expect to be wrong sometimes, and we intend to publish it when we are.',
    ],
  },
]

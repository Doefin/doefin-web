/** Fictional provider exercise; these are not captured predictions by actual providers. */
export const illustrativeComparison = [
  { provider: 'Example model A', forecasts: [{ targetHeight: 909216, predicted: -0.74, low: -4.2, high: 2.7, outcome: -2.06 }, { targetHeight: 911232, predicted: 1.12, low: -1.9, high: 4.1, outcome: 1.84 }, { targetHeight: 913248, predicted: 2.31, low: -2.4, high: 7, outcome: null }] },
  { provider: 'Example model B', forecasts: [{ targetHeight: 909216, predicted: -2.5, low: -3, high: -1, outcome: -2.06 }, { targetHeight: 911232, predicted: 2.8, low: 2, high: 3, outcome: 1.84 }, { targetHeight: 913248, predicted: 1.5, low: 0, high: 3, outcome: null }] },
  { provider: 'Example baseline C', forecasts: [{ targetHeight: 909216, predicted: 0, low: -5, high: 5, outcome: -2.06 }, { targetHeight: 911232, predicted: 0, low: -5, high: 5, outcome: 1.84 }, { targetHeight: 913248, predicted: 0, low: -5, high: 5, outcome: null }] },
]
export function summarizeIllustrativeProvider(model: typeof illustrativeComparison[number]) {
  const scored = model.forecasts.filter((row): row is typeof row & { outcome: number } => row.outcome !== null)
  return { count: scored.length, missing: model.forecasts.length - scored.length, maePp: scored.reduce((sum, row) => sum + Math.abs(row.predicted - row.outcome), 0) / scored.length, coveragePct: scored.filter(row => row.outcome >= row.low && row.outcome <= row.high).length / scored.length * 100, widthPp: scored.reduce((sum, row) => sum + row.high - row.low, 0) / scored.length }
}

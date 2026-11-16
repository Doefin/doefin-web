import { researchCapture, researchRows, researchSummary } from '@/lib/research-data'

const BLOCKS_PER_EPOCH = 2016
// The raw capture includes the boundary before the first recorded adjustment.
const sourceBoundaries: [timestamp: number, height: number, difficulty: number, ratio: number][] = JSON.parse(researchCapture.sourceRaw)
const timestampByHeight = new Map(sourceBoundaries.map(([timestamp, height]) => [height, timestamp]))

const periods = researchRows.map((row, index) => {
  const previousTimestamp = timestampByHeight.get(row.height - BLOCKS_PER_EPOCH)
  const averageEH = previousTimestamp === undefined || previousTimestamp >= row.timestamp
    ? null
    : row.previousDifficulty * 2 ** 32 * BLOCKS_PER_EPOCH / (row.timestamp - previousTimestamp) / 1e18
  const x = 18 + index * 564 / Math.max(researchRows.length - 1, 1)
  const date = row.date.slice(0, 10)
  const change = `${row.changePct > 0 ? '+' : ''}${row.changePct.toFixed(2)}%`
  return { row, averageEH, x, date, change }
})
const maxAbsolute = Math.max(...periods.map(period => Math.abs(period.row.changePct))) || 1
const estimates = periods.flatMap(period => period.averageEH === null ? [] : [{ ...period, averageEH: period.averageEH }])
const rates = estimates.map(period => period.averageEH)
const minHashrate = rates.length ? Math.min(...rates) : 0
const maxHashrate = rates.length ? Math.max(...rates) : 0
const points = estimates.map(period => ({
  ...period,
  y: 122 - (period.averageEH - minHashrate) / (maxHashrate - minHashrate || 1) * 96,
}))
const line = points.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

export function LandingHistory() {
  return <section className="landing-market-context" id="mining-history" aria-labelledby="landing-market-title">
    <p className="landing-impact-eyebrow">Observed adjustments · Frozen capture</p>
    <h2 id="landing-market-title">Difficulty moves in both directions</h2>
    <p>Across {researchSummary.count} recorded adjustments from <time dateTime={researchSummary.firstDate}>{researchSummary.firstDate.slice(0, 10)}</time> to <time dateTime={researchSummary.lastDate}>{researchSummary.lastDate.slice(0, 10)}</time>, {researchSummary.increases} were increases and {researchSummary.decreases} were decreases. The mean absolute change was {researchSummary.meanAbsoluteChangePct.toFixed(2)}% per adjustment. These are historical observations, not forecasts.</p>
    <div className="landing-history-grid">
      <figure className="landing-history-panel">
        <figcaption><strong>Difficulty adjustment (%)</strong><span>Each bar is one observed adjustment.</span></figcaption>
        <svg viewBox="0 0 600 210" role="img" aria-label={`Observed changes in Bitcoin mining difficulty across ${periods.length} adjustments, with both positive and negative bars.`} preserveAspectRatio="xMidYMid meet">
          <path d="M0 105H600" stroke="var(--df-text-muted)" strokeWidth="1" opacity=".7" />
          {periods.map(({ row, x, date, change }) => {
            const height = Math.abs(row.changePct) / maxAbsolute * 82
            const y = row.changePct >= 0 ? 105 - height : 105
            return <rect key={row.height} x={x - 7.5} y={y} width="15" height={height} rx="1" fill="var(--df-chart-1, var(--df-blue))"><title>{`${date}: ${change}`}</title></rect>
          })}
          <text x="0" y="18" fontSize="12" fill="var(--df-text-muted)">Increase</text>
          <text x="0" y="198" fontSize="12" fill="var(--df-text-muted)">Decrease</text>
        </svg>
      </figure>
      <figure className="landing-history-panel">
        <figcaption><strong>Estimated 2,016-block average hashrate (EH/s)</strong><span>Derived from difficulty and elapsed time, not machine measurements.</span></figcaption>
        <svg viewBox="0 0 600 160" role="img" aria-label={`Estimated average network hashrate across ${points.length} complete 2,016-block intervals.`} preserveAspectRatio="xMidYMid meet">
          <path d="M0 122H600" stroke="var(--df-text-muted)" strokeWidth="1" opacity=".35" />
          <path d={line} fill="none" stroke="var(--df-chart-1, var(--df-blue))" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
          {points.map(({ row, x, y, date, averageEH }) => <circle key={row.height} cx={x} cy={y} r="2.5" fill="var(--df-blue)"><title>{`${date}: ${averageEH.toFixed(0)} EH/s`}</title></circle>)}
          <text x="0" y="15" fontSize="12" fill="var(--df-text-muted)">{maxHashrate.toFixed(0)} EH/s</text>
          <text x="0" y="147" fontSize="12" fill="var(--df-text-muted)">{minHashrate.toFixed(0)} EH/s</text>
        </svg>
      </figure>
    </div>
    <p className="landing-history-source">Source: <a href={researchCapture.sourceUrl} rel="noopener noreferrer">mempool.space difficulty-adjustment archive</a>, captured <time dateTime={researchCapture.capturedAt}>{researchCapture.capturedAt.slice(0, 10)}</time>. Single-source capture, without independent node verification. Hashrate estimate: previous epoch difficulty × 2³² × 2,016 ÷ elapsed seconds. Block timestamps can vary from actual block discovery times. Calculated estimates are not a direct measurement of mining equipment. A frozen window does not predict the next adjustment.</p>
    <details className="landing-history-details">
      <summary>Read the observed values and estimates</summary>
      <div className="landing-history-table-scroll">
        <table>
          <thead><tr><th scope="col">Adjustment date (UTC)</th><th scope="col">Difficulty change</th><th scope="col">Average hashrate estimate</th></tr></thead>
          <tbody>{periods.map(({ row, averageEH, date, change }) => <tr key={row.height}><th scope="row"><time dateTime={row.date}>{date}</time></th><td>{change}</td><td>{averageEH === null ? 'Unavailable' : `${averageEH.toFixed(0)} EH/s`}</td></tr>)}</tbody>
        </table>
      </div>
    </details>
    <div className="landing-market-links">
      <a href="/api/v3/research/v1/dataset?format=csv">Download source dataset →</a>
      <a href="/data/difficulty">Review difficulty data →</a>
      <a href="/data/hashrate">Review network hashrate →</a>
    </div>
  </section>
}

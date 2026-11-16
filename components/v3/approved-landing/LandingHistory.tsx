import { Archive, ArrowRight, CaretDown, ChartBar, ChartLine, Clock, DownloadSimple, Info, Table } from '@phosphor-icons/react/dist/ssr'
import { researchCapture, researchRows } from '@/lib/research-data'
import { getLandingHistory, type HistoryPoint } from '@/lib/server/landing-history'
import { HistoryChart } from './HistoryChart'
import { directionOf } from './direction'

const BLOCKS_PER_EPOCH = 2016
const PLOT_LEFT = 62
const PLOT_RIGHT = 467
const PLOT_TOP = 14
const PLOT_BOTTOM = 160
const PLOT_MIDDLE = (PLOT_TOP + PLOT_BOTTOM) / 2
const BAR_HALF_WIDTH = 6
const dateLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
// The raw capture includes the boundary before the first recorded adjustment.
const sourceBoundaries: [timestamp: number, height: number, difficulty: number, ratio: number][] = JSON.parse(researchCapture.sourceRaw)
const timestampByHeight = new Map(sourceBoundaries.map(([timestamp, height]) => [height, timestamp]))

const frozenPoints: HistoryPoint[] = researchRows.map(row => {
  const previousTimestamp = timestampByHeight.get(row.height - BLOCKS_PER_EPOCH)
  return {
    height: row.height,
    date: row.date,
    changePct: row.changePct,
    averageEH: previousTimestamp === undefined || previousTimestamp >= row.timestamp
      ? null
      : row.previousDifficulty * 2 ** 32 * BLOCKS_PER_EPOCH / (row.timestamp - previousTimestamp) / 1e18,
  }
})

function percent(change: number) {
  return (change < 0 ? '−' : change > 0 ? '+' : '') + Math.abs(change).toFixed(2) + '%'
}

function adjustmentBarPath(x: number, tipY: number) {
  const radius = Math.min(2, Math.abs(tipY - PLOT_MIDDLE) / 3)
  const left = x - BAR_HALF_WIDTH
  const right = x + BAR_HALF_WIDTH
  const shoulder = tipY + Math.sign(PLOT_MIDDLE - tipY) * radius
  return `M ${left} ${PLOT_MIDDLE} V ${shoulder} Q ${left} ${tipY} ${left + radius} ${tipY} H ${right - radius} Q ${right} ${tipY} ${right} ${shoulder} V ${PLOT_MIDDLE} Z`
}

function ChartGrid({ ticks }: { ticks: { y: number; label: string; zero?: boolean }[] }) {
  return ticks.map(({ y, label, zero }) => (
    <g key={label} className={zero ? 'landing-history-zero' : undefined}>
      <line x1={PLOT_LEFT} x2={PLOT_RIGHT} y1={y} y2={y} />
      <text x={PLOT_LEFT - 8} y={y} textAnchor="end" dominantBaseline="middle">{label}</text>
    </g>
  ))
}

function DateRange({ first, last }: { first: string; last: string }) {
  return <div className="landing-history-dates">
    <time dateTime={first}>{dateLabel.format(new Date(first))}</time>
    <time dateTime={last}>{dateLabel.format(new Date(last))}</time>
  </div>
}

export async function LandingHistory() {
  const live = await getLandingHistory()
  return <LandingHistoryContent source={live} />
}

export function LandingHistoryFallback() {
  return <section className="landing-market-context" id="mining-history" aria-labelledby="landing-market-title">
    <h2 id="landing-market-title">Difficulty moves in both directions</h2>
    <p className="landing-history-intro" role="status">Loading Bitcoin block history</p>
  </section>
}

function LandingHistoryContent({ source }: { source: Awaited<ReturnType<typeof getLandingHistory>> }) {
  const rows = source?.points ?? frozenPoints
  const periods = rows.map((row, index) => {
    const x = PLOT_LEFT + (index + 0.5) * (PLOT_RIGHT - PLOT_LEFT) / rows.length
    return { row, x, date: dateLabel.format(new Date(row.date)), change: percent(row.changePct) }
  })
  const changes = rows.map(row => row.changePct)
  const minChange = Math.min(...changes)
  const maxChange = Math.max(...changes)
  const maxAbsolute = Math.max(2, Math.ceil(Math.max(...changes.map(Math.abs)) / 2) * 2)
  const bars = periods.map(period => {
    const offset = period.row.changePct / maxAbsolute * (PLOT_MIDDLE - PLOT_TOP)
    return { ...period, tipY: PLOT_MIDDLE - offset }
  })
  const estimates = periods.flatMap(period => period.row.averageEH === null ? [] : [{ ...period, averageEH: period.row.averageEH }])
  const rates = estimates.map(period => period.averageEH)
  const minHashrate = Math.min(...rates)
  const maxHashrate = Math.max(...rates)
  const rateFloor = Math.floor(minHashrate / 100) * 100
  const rateCeiling = Math.max(rateFloor + 200, Math.ceil(maxHashrate / 100) * 100)
  const rateY = (rate: number) => PLOT_BOTTOM - (rate - rateFloor) / (rateCeiling - rateFloor) * (PLOT_BOTTOM - PLOT_TOP)
  const points = estimates.map(period => ({ ...period, y: rateY(period.averageEH) }))
  const line = points.map(({ x, y }, i) => (i === 0 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1)).join(' ')
  const adjustmentTicks = [
    { y: PLOT_TOP, label: '+' + maxAbsolute + '%' },
    { y: PLOT_MIDDLE, label: '0%', zero: true },
    { y: PLOT_BOTTOM, label: '−' + maxAbsolute + '%' },
  ]
  const rateTicks = [rateCeiling, (rateCeiling + rateFloor) / 2, rateFloor].map(rate => ({ y: rateY(rate), label: String(rate) }))
  const first = rows[0].date
  const last = rows[rows.length - 1].date
  const csv = source ? 'height,date_utc,difficulty_change_percent,estimated_average_hashrate_eh_s\n' +
    rows.map(row => [row.height, row.date, row.changePct, row.averageEH].join(',')).join('\n') + '\n' : null

  return <section className="landing-market-context" id="mining-history" aria-labelledby="landing-market-title">
    <p className="landing-impact-eyebrow landing-history-eyebrow"><Archive aria-hidden="true" /> {source ? 'Observed adjustments · Doefin API' : 'Observed adjustments · Frozen capture'}</p>
    <h2 id="landing-market-title">Difficulty moves in both directions</h2>
    <p className="landing-history-intro">{rows.length} recorded adjustments from <time dateTime={first}>{dateLabel.format(new Date(first))}</time> to <time dateTime={last}>{dateLabel.format(new Date(last))}</time>.</p>
    <dl className="landing-history-stats">
      <div><dt>Increases</dt><dd className="landing-signed-value" data-direction="up">{changes.filter(change => change > 0).length}</dd></div>
      <div><dt>Decreases</dt><dd className="landing-signed-value" data-direction="down">{changes.filter(change => change < 0).length}</dd></div>
      <div><dt>Mean absolute change</dt><dd>{(changes.reduce((sum, change) => sum + Math.abs(change), 0) / changes.length).toFixed(2)}%</dd></div>
    </dl>
    <div className="landing-history-grid">
      <figure className="landing-history-panel">
        <figcaption>
          <strong><ChartBar aria-hidden="true" /> Difficulty adjustments</strong>
          <span>
            <span className="landing-signed-value" data-direction={directionOf(minChange)}>{percent(minChange)}</span>
            {' to '}
            <span className="landing-signed-value" data-direction={directionOf(maxChange)}>{percent(maxChange)}</span>
            {' across the period.'}
          </span>
        </figcaption>
        <HistoryChart title="Observed changes in Bitcoin mining difficulty." points={bars.map(({ x, tipY, date, change, row }) => ({ x, y: tipY, date, value: change, change: row.changePct }))}>
          <ChartGrid ticks={adjustmentTicks} />
          {bars.map(({ row, x, tipY }) => {
            if (row.changePct === 0) return null
            if (Math.abs(tipY - PLOT_MIDDLE) < 2.5) {
              return <path key={row.height} className="landing-history-series-line" d={`M ${x - BAR_HALF_WIDTH} ${tipY} H ${x + BAR_HALF_WIDTH}`} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            }
            return <path key={row.height} className="landing-history-series" d={adjustmentBarPath(x, tipY)} />
          })}
        </HistoryChart>
        <DateRange first={first} last={last} />
      </figure>
      <figure className="landing-history-panel">
        <figcaption><strong><ChartLine aria-hidden="true" /> Estimated network hashrate</strong><span>{minHashrate.toFixed(0)} to {maxHashrate.toFixed(0)} EH/s across 2,016-block averages.</span></figcaption>
        <HistoryChart title="Estimated average network hashrate in EH/s." points={points.map(({ x, y, date, averageEH }) => ({ x, y, date, value: averageEH.toFixed(0) + ' EH/s' }))}>
          <ChartGrid ticks={rateTicks} />
          <path className="landing-history-series-line" d={line} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {points.map(({ row, x, y }) => <circle key={row.height} className="landing-history-series" cx={x} cy={y} r="2.8" />)}
        </HistoryChart>
        <DateRange first={first} last={last} />
      </figure>
    </div>
    <div className="landing-history-provenance">
      <div className="landing-history-source">
        <span><Archive aria-hidden="true" /> <a href={source ? 'https://api.doefin.com/docs' : researchCapture.sourceUrl}>{source ? 'Doefin Bitcoin block history' : 'mempool.space difficulty archive'}</a></span>
        <span><Clock aria-hidden="true" /> {source
          ? <>Retrieved{' '}<time dateTime={source.retrievedAt}>{dateLabel.format(new Date(source.retrievedAt))}, {source.retrievedAt.slice(11, 16)} UTC</time></>
          : <>Captured{' '}<time dateTime={researchCapture.capturedAt}>{dateLabel.format(new Date(researchCapture.capturedAt))}</time></>}
        </span>
      </div>
      <details className="landing-history-details landing-history-method">
        <summary><span><Info aria-hidden="true" /> How to read these charts</span><CaretDown className="landing-history-caret" aria-hidden="true" /></summary>
        <dl>
          <div>
            <dt>Difficulty adjustments</dt>
            <dd>{source ? 'Each adjustment appears after six subsequent blocks.' : 'This capture uses a single source without independent node verification.'} Past adjustments do not predict the next one.</dd>
          </div>
          <div>
            <dt>Estimated network hashrate</dt>
            <dd>Calculated from block data using the previous period’s difficulty × 2³² × 2,016 ÷ elapsed seconds. Block timestamps can differ from the actual times blocks were found.</dd>
          </div>
        </dl>
      </details>
    </div>
    <details className="landing-history-details">
      <summary><span><Table aria-hidden="true" /> View data table</span><CaretDown className="landing-history-caret" aria-hidden="true" /></summary>
      <div className="landing-history-table-scroll" role="region" aria-label="Observed values and estimates table" tabIndex={0}>
        <table>
          <thead><tr><th scope="col">Adjustment date (UTC)</th><th scope="col">Difficulty change</th><th scope="col">Average hashrate estimate</th></tr></thead>
          <tbody>{periods.map(({ row, date, change }) => <tr key={row.height}><th scope="row"><time dateTime={row.date}>{date}</time></th><td className="landing-signed-value" data-direction={directionOf(row.changePct)}>{change}</td><td>{row.averageEH === null ? 'Unavailable' : row.averageEH.toFixed(0) + ' EH/s'}</td></tr>)}</tbody>
        </table>
      </div>
    </details>
    <div className="landing-market-links">
      <a href={csv ? 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv) : '/api/v3/research/v1/dataset?format=csv'} download={csv ? 'doefin-mining-history.csv' : undefined}><DownloadSimple aria-hidden="true" /> Download source dataset</a>
      <a href="/data/difficulty">Review difficulty data <ArrowRight aria-hidden="true" /></a>
      <a href="/data/hashrate">Review network hashrate <ArrowRight aria-hidden="true" /></a>
    </div>
  </section>
}

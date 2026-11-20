import type { LandingCopy } from '@/dictionaries'
import { languages, type Language } from '@/lib/languages'
import { Archive, ArrowRight, CaretDown, ChartBar, ChartLine, Clock, Info, Table } from '@phosphor-icons/react/dist/ssr'
import { researchCapture, researchRows } from '@/lib/research-data'
import { getLandingHistory, type HistoryPoint } from '@/lib/server/landing-history'
import { HistoryChart } from './HistoryChart'

const BLOCKS_PER_EPOCH = 2016
const PLOT_LEFT = 62
const PLOT_RIGHT = 467
const PLOT_TOP = 14
const PLOT_BOTTOM = 160
const PLOT_MIDDLE = (PLOT_TOP + PLOT_BOTTOM) / 2
const BAR_HALF_WIDTH = 6
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

function DateRange({ first, last, dateLabel }: { first: string; last: string; dateLabel: Intl.DateTimeFormat }) {
  return <div className="landing-history-dates">
    <time dateTime={first}>{dateLabel.format(new Date(first))}</time>
    <time dateTime={last}>{dateLabel.format(new Date(last))}</time>
  </div>
}

export async function LandingHistory({ copy, language }: { copy: LandingCopy; language: Language }) {
  const live = await getLandingHistory()
  return <LandingHistoryContent source={live} copy={copy} language={language} />
}

export function LandingHistoryFallback({ copy }: { copy: LandingCopy }) {
  return <section className="landing-market-context" id="mining-history" aria-labelledby="landing-market-title">
    <h2 id="landing-market-title">{copy.bitcoinHashrateMovesTradeYourView}</h2>
    <p className="landing-history-intro" role="status">{copy.loadingBitcoinBlockHistory}</p>
  </section>
}

function LandingHistoryContent({ source, copy, language }: { source: Awaited<ReturnType<typeof getLandingHistory>>; copy: LandingCopy; language: Language }) {
  const dateLabel = new Intl.DateTimeFormat(languages[language].tag, { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
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

  return <section className="landing-market-context" id="mining-history" aria-labelledby="landing-market-title">
    <p className="landing-impact-eyebrow landing-history-eyebrow"><Archive aria-hidden="true" /> {source ? copy.observedAdjustmentsDoefinApi : copy.observedAdjustmentsFrozenCapture}</p>
    <h2 id="landing-market-title">{copy.bitcoinHashrateMovesTradeYourView}</h2>
    <p className="landing-history-intro">{rows.length}{' '}{copy.recordedAdjustmentsFrom}{' '}<time dateTime={first}>{dateLabel.format(new Date(first))}</time>{' '}{copy.to}{' '}<time dateTime={last}>{dateLabel.format(new Date(last))}</time>.</p>
    <dl className="landing-history-stats">
      <div><dt>{copy.increases}</dt><dd className="landing-signed-value">{changes.filter(change => change > 0).length}</dd></div>
      <div><dt>{copy.decreases}</dt><dd className="landing-signed-value">{changes.filter(change => change < 0).length}</dd></div>
      <div><dt>{copy.meanAbsoluteChange}</dt><dd>{(changes.reduce((sum, change) => sum + Math.abs(change), 0) / changes.length).toFixed(2)}%</dd></div>
    </dl>
    <div className="landing-history-grid">
      <figure className="landing-history-panel">
        <figcaption>
          <strong><ChartBar aria-hidden="true" />{' '}{copy.difficultyAdjustments}</strong>
          <span>
            <span className="landing-signed-value">{percent(minChange)}</span>
            {" " + copy.to + " "}
            <span className="landing-signed-value">{percent(maxChange)}</span>
            {" " + copy.acrossThePeriod}
          </span>
        </figcaption>
        <HistoryChart copy={copy} title={copy.observedChangesInBitcoinMining} points={bars.map(({ x, tipY, date, change, row }) => ({ x, y: tipY, date, value: change, change: row.changePct }))}>
          <ChartGrid ticks={adjustmentTicks} />
          {bars.map(({ row, x, tipY }) => {
            if (row.changePct === 0) return null
            if (Math.abs(tipY - PLOT_MIDDLE) < 2.5) {
              return <path key={row.height} className="landing-history-series-line" d={`M ${x - BAR_HALF_WIDTH} ${tipY} H ${x + BAR_HALF_WIDTH}`} fill="none" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
            }
            return <path key={row.height} className="landing-history-series" d={adjustmentBarPath(x, tipY)} />
          })}
        </HistoryChart>
        <DateRange dateLabel={dateLabel} first={first} last={last} />
      </figure>
      <figure className="landing-history-panel">
        <figcaption><strong><ChartLine aria-hidden="true" />{' '}{copy.estimatedNetworkHashrate}</strong><span>{minHashrate.toFixed(0)}{' '}{copy.to}{' '}{maxHashrate.toFixed(0)}{' '}{copy.ehSAcross2016}</span></figcaption>
        <HistoryChart copy={copy} title={copy.estimatedAverageNetworkHashrateIn} points={points.map(({ x, y, date, averageEH }) => ({ x, y, date, value: averageEH.toFixed(0) + ' EH/s' }))}>
          <ChartGrid ticks={rateTicks} />
          <path className="landing-history-series-line" d={line} fill="none" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          {points.map(({ row, x, y }) => <circle key={row.height} className="landing-history-series" cx={x} cy={y} r="2.8" />)}
        </HistoryChart>
        <DateRange dateLabel={dateLabel} first={first} last={last} />
      </figure>
    </div>
    <div className="landing-history-provenance">
      <div className="landing-history-source">
        {!source && <span>{copy.source} <a href={researchCapture.sourceUrl}>{copy.mempoolSpace}</a> · {copy.singleSource}</span>}
        <span><Clock aria-hidden="true" /> {source
          ? <>{copy.retrieved}{' '}<time dateTime={source.retrievedAt}>{dateLabel.format(new Date(source.retrievedAt))}, {source.retrievedAt.slice(11, 16)} UTC</time></>
          : <>{copy.captured}{' '}<time dateTime={researchCapture.capturedAt}>{dateLabel.format(new Date(researchCapture.capturedAt))}</time></>}
        </span>
      </div>
      <details className="landing-history-details landing-history-method">
        <summary><span><Info aria-hidden="true" />{' '}{copy.howToReadTheseCharts}</span><CaretDown className="landing-history-caret" aria-hidden="true" /></summary>
        <dl>
          <div>
            <dt>{copy.difficultyAdjustments}</dt>
            <dd>{source ? copy.eachAdjustmentAppearsAfterSix : copy.thisCaptureUsesASingle}{' '}{copy.pastAdjustmentsDoNotPredict}</dd>
          </div>
          <div>
            <dt>{copy.estimatedNetworkHashrate}</dt>
            <dd>{copy.calculatedFromBlockDataUsing}</dd>
          </div>
        </dl>
      </details>
    </div>
    <details className="landing-history-details">
      <summary><span><Table aria-hidden="true" />{' '}{copy.viewDataTable}</span><CaretDown className="landing-history-caret" aria-hidden="true" /></summary>
      <div className="landing-history-table-scroll" role="region" aria-label={copy.observedValuesAndEstimatesTable} tabIndex={0}>
        <table>
          <thead><tr><th scope="col">{copy.adjustmentDateUtc}</th><th scope="col">{copy.difficultyChange}</th><th scope="col">{copy.averageHashrateEstimate}</th></tr></thead>
          <tbody>{periods.map(({ row, date, change }) => <tr key={row.height}><th scope="row"><time dateTime={row.date}>{date}</time></th><td className="landing-signed-value">{change}</td><td>{row.averageEH === null ? copy.unavailable : row.averageEH.toFixed(0) + ' EH/s'}</td></tr>)}</tbody>
        </table>
      </div>
    </details>
    <div className="landing-market-links">
      <a href="/data/difficulty">{copy.reviewDifficultyData}{' '}<ArrowRight aria-hidden="true" /></a>
      <a href="/data/hashrate">{copy.reviewNetworkHashrate}{' '}<ArrowRight aria-hidden="true" /></a>
    </div>
  </section>
}

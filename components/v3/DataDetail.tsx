import type { ReactNode } from 'react'
import Link from '@/components/routing/SiteLink'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { epochs, networkSeries } from '@/content'
import { dateShort, int, pct } from '@/lib/format'
import { Arrow } from './Arrow'
import styles from './data-detail.module.css'

export const dataPanel = 'rounded-panel border border-white/10 bg-surface/25 p-5 sm:p-7'
export const dataCopy = 'text-sm leading-[1.85] text-subtle'

export function DataDetail({ title, summary, category, current, crumbs = [], children, datasetNotice }: {
  title: string; summary: string; category: string; current: 'difficulty' | 'hashrate' | 'scoreboard';
  crumbs?: { name: string; href: string }[]; children: ReactNode; datasetNotice?: ReactNode
}) {
  return <Container className="pb-16 pt-5 sm:pb-20 sm:pt-9">
    <div className="hidden sm:block"><Breadcrumbs items={[{ name: 'Data', href: '/v3/data' }, ...crumbs]} /></div>
    <header className="mt-2 sm:mt-7">
      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-highlight">Data field guide / {category}</p>
      <h1 className="tabular mt-3 max-w-4xl text-balance text-[32px] font-extrabold leading-[1.13] tracking-[-0.035em] sm:text-[46px]">{title}</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-subtle">{summary}</p>
      <p className="mt-4 max-w-2xl border-l-2 border-caution/50 pl-3 text-xs leading-[1.8] text-subtle">{datasetNotice ?? <><strong className="font-semibold text-caution">Synthetic learning dataset.</strong> Figures, dates and outcomes are authored examples, not current network data or measured performance.</>}</p>
    </header>
    <nav aria-label="Data guides" className="mb-6 mt-6 flex flex-wrap gap-2 sm:mb-8">
      <Link href="/v3/data" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-xs font-semibold text-subtle hover:border-brand/40 hover:text-highlight">← Data library</Link>
      {[['difficulty', 'Difficulty'], ['hashrate', 'Hashrate'], ['scoreboard', 'Accuracy']].map(([slug, name]) => <Link key={slug} href={'/v3/data/' + slug} aria-current={current === slug ? 'page' : undefined} className={`inline-flex min-h-10 items-center rounded-lg border px-3 text-xs font-semibold ${current === slug ? 'border-chart/30 bg-chart/10 text-highlight' : 'border-white/10 text-subtle hover:border-brand/40 hover:text-highlight'}`}>{name}</Link>)}
    </nav>
    {children}
  </Container>
}

export function DataSection({ id, eyebrow, title, description, children }: { id?: string; eyebrow?: string; title: string; description?: ReactNode; children: ReactNode }) {
  return <section id={id} className="mt-11 scroll-mt-28 sm:mt-14">
    <div className="mb-6 max-w-3xl">{eyebrow && <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.13em] text-highlight">{eyebrow}</p>}<h2 className="text-2xl font-extrabold tracking-[-0.025em] sm:text-[28px]">{title}</h2>{description && <div className={'mt-3 ' + dataCopy}>{description}</div>}</div>
    {children}
  </section>
}

export function DataFields({ rows }: { rows: { label: string; value: ReactNode; note?: string }[] }) {
  return <dl className="divide-y divide-white/10">{rows.map(row => <div key={row.label} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_1.2fr] sm:gap-6"><dt className="text-xs leading-relaxed text-subtle">{row.label}</dt><dd className="tabular text-sm font-semibold leading-relaxed text-body">{row.value}{row.note && <span className="mt-1 block text-xs font-normal leading-[1.7] text-subtle">{row.note}</span>}</dd></div>)}</dl>
}

export function DataRange({ low, high, forecast, outcome, id }: { low: number; high: number; forecast: number; outcome?: number; id: string }) {
  const position = (value: number) => `${((value - low) / (high - low)) * 100}%`
  return <figure aria-labelledby={id}>
    <figcaption id={id} className="text-sm font-bold">Authored range: <span className="tabular">{pct(low, 1)} to {pct(high, 1)}</span></figcaption>
    <div className="relative mx-1 mt-3 h-12" role="img" aria-label={`Synthetic range from ${pct(low, 1)} to ${pct(high, 1)}. Forecast ${pct(forecast)}.${outcome === undefined ? ' No outcome included.' : ` Example outcome ${pct(outcome)}.`} No calibrated confidence level.`}>
      <div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-chart/20" />
      {[0, 100].map(left => <span key={left} aria-hidden="true" className="absolute top-1/2 h-4 w-px -translate-y-1/2 bg-highlight" style={{ left: `${left}%` }} />)}
      {low < 0 && high > 0 && <span aria-hidden="true" className="absolute inset-y-1 border-l border-dashed border-subtle" style={{ left: position(0) }} />}
      <span aria-hidden="true" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-highlight" style={{ left: position(forecast) }} />
      {outcome !== undefined && <span aria-hidden="true" className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-ink bg-chart" style={{ left: position(outcome) }} />}
    </div>
    <div className="tabular flex justify-between text-xs font-semibold text-body"><span>{pct(low, 1)}</span><span>{pct(high, 1)}</span></div>
    <div className="tabular mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs leading-relaxed text-subtle"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-highlight" />Forecast {pct(forecast)}</span>{outcome !== undefined && <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 shrink-0 rotate-45 bg-chart" />Outcome {pct(outcome)}</span>}<span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 border-l border-dashed border-subtle" />Zero change</span></div>
  </figure>
}

/** One source series, one unit, HTML labels: no scaled SVG text or client chart dependency. */
export function DataSeries({ metric }: { metric: 'difficultyT' | 'hashrateEH' }) {
  const isDifficulty = metric === 'difficultyT'
  const unit = isDifficulty ? 'T' : 'EH/s'
  const max = isDifficulty ? 140 : 1000
  const value = (n: number) => isDifficulty ? n.toFixed(2) : int(n)
  const y = (n: number) => 240 - (n / max) * 240
  const x = (i: number) => 8 + (i / (networkSeries.length - 1)) * 984
  const path = networkSeries.map((point, i) => i === 0 ? `M${x(i)},${y(point[metric])}` : `H${x(i)}V${y(point[metric])}`).join(' ')
  const first = networkSeries[0]
  const last = networkSeries[networkSeries.length - 1]
  const title = `Synthetic ${isDifficulty ? 'difficulty' : 'implied hashrate'} series`
  return <div className="overflow-hidden rounded-panel border border-white/10 bg-surface/20">
    <figure className="p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-3"><figcaption className="text-sm font-bold">{title}</figcaption><span className="tabular text-[10px] font-bold uppercase tracking-wider text-caution">Authored data · {networkSeries.length} points</span></div>
      <p className="tabular mt-3 text-xl font-bold tracking-tight text-highlight">{value(first[metric])} → {value(last[metric])} <span className="text-sm font-semibold">{unit}</span></p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">{isDifficulty ? 'Difficulty changes in discrete steps; the line steps between the supplied example points.' : 'These values are derived from the series’ difficulty using the ten-minute target. They are not independent observations of hashrate.'} Vertical axis starts at zero.</p>
      <div className="mt-7 grid grid-cols-[3rem_minmax(0,1fr)] gap-3">
        <div className="tabular flex h-48 flex-col justify-between text-right text-[11px] text-subtle sm:h-56"><span>{int(max)}</span><span>{int(max / 2)}</span><span>0</span></div>
        <div className="min-w-0"><svg viewBox="0 0 1000 240" preserveAspectRatio="none" role="img" aria-label={`${title}. ${networkSeries.length} points from ${first.date} to ${last.date}. Starts at ${value(first[metric])} ${unit}, ends at ${value(last[metric])} ${unit}. All values are available in the following table.`} className="h-48 w-full overflow-visible sm:h-56">
          {[0, 120, 240].map(y => <line key={y} x1="0" y1={y} x2="1000" y2={y} className="stroke-white/10" strokeWidth="1" vectorEffect="non-scaling-stroke" />)}
          <path d={path} fill="none" className="stroke-chart" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg><div className="tabular mt-3 flex justify-between gap-3 text-[11px] text-subtle"><time dateTime={first.date}>{dateShort(first.date)}</time><time dateTime={last.date}>{dateShort(last.date)}</time></div></div>
      </div>
      <p className="mt-4 text-xs leading-[1.8] text-subtle">Unit: {unit === 'T' ? 'T, meaning trillion' : 'EH/s, exahashes per second'}. This is a separate synthetic series, not a verified year of network history or a continuation of the snapshot above.</p>
    </figure>
    <details className="border-t border-white/10"><summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-highlight sm:px-7 [&::-webkit-details-marker]:hidden">Inspect all {networkSeries.length} source rows<span aria-hidden="true">＋</span></summary><div>
      <table className={`${styles.seriesTable} tabular w-full text-left text-sm`}><caption className="sr-only">All values for the synthetic {isDifficulty ? 'difficulty' : 'implied hashrate'} chart. Dates and heights belong to the example fixture.</caption><thead className="bg-ink/25 text-xs text-subtle"><tr><th scope="col">Example date</th><th scope="col">Block</th><th scope="col">{isDifficulty ? 'Difficulty (T)' : 'Implied hashrate (EH/s)'}</th></tr></thead><tbody>{networkSeries.map(point => <tr key={point.height}><th scope="row"><time dateTime={point.date}>{dateShort(point.date)}</time></th><td><span className={styles.mobileLabel}>Block</span>{int(point.height)}</td><td><span className={styles.mobileLabel}>{isDifficulty ? 'Difficulty' : 'Implied hashrate'}</span>{value(point[metric])} {unit}</td></tr>)}</tbody></table>
    </div></details>
  </div>
}

export function DataRecords({ exclude }: { exclude?: number }) {
  return <div aria-label="Synthetic difficulty examples" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{epochs.filter(epoch => epoch.height !== exclude).map(epoch => <article key={epoch.height} className="rounded-panel border border-white/10 bg-surface/20 p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic example · not a published record</p><h3 className="tabular mt-3 text-lg font-bold">Block {int(epoch.height)}</h3><p className="tabular mt-3 text-xs leading-[1.9] text-subtle">Forecast {pct(epoch.forecastPct)}<br />{epoch.realisedPct === undefined ? 'No outcome included' : `Outcome ${pct(epoch.realisedPct)}`}<br /><time dateTime={epoch.startedAt}>Reference {dateShort(epoch.startedAt)}</time></p></article>)}</div>
}

export function DataNext({ items }: { items: { href: string; label: string; note: string }[] }) {
  return <nav aria-label="Next steps" className="mt-12 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-2">{items.map(item => <Link key={item.href} href={item.href} className="group rounded-panel border border-white/10 p-5 hover:border-brand/40"><span className="flex items-center justify-between gap-3 text-sm font-bold text-highlight">{item.label}<Arrow className="h-4 w-4" /></span><span className="mt-3 block text-xs leading-[1.8] text-subtle">{item.note}</span></Link>)}</nav>
}

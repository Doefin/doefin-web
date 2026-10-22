import Link from '@/components/routing/SiteLink'
import { difficulty } from '@/content'
import { int, pct, tera } from '@/lib/format'
import { seo } from '@/lib/seo'
import { DifficultyReadingPanel } from './data-reading'
import { DataDetail, DataFields, DataNext, DataRecords, DataSection, DataSeries, dataCopy, dataPanel } from './DataDetail'

export const metadata = seo({ title: 'Reading a Bitcoin difficulty forecast', description: 'Inspect a synthetic difficulty forecast, its level calculation, observation context, source series and dated examples.', path: '/v3/data/difficulty' })

export default function V3Difficulty() {
  const projected = difficulty.currentT * (1 + difficulty.changePct / 100)
  const low = difficulty.currentT * (1 + difficulty.band95[0] / 100)
  const high = difficulty.currentT * (1 + difficulty.band95[1] / 100)
  const heightGap = difficulty.nextRetargetHeight - difficulty.asOfHeight
  const countGap = difficulty.blocksInEpoch - difficulty.blocksObserved
  return <DataDetail title="Inside a difficulty forecast." summary="Read the starting level, translate a projected change, and inspect the information behind it." category="Difficulty" current="difficulty" crumbs={[{ name: 'Difficulty example', href: '/v3/data/difficulty' }]}>
    <div className="grid items-start gap-5 lg:grid-cols-[1.4fr_1fr]">
      <DifficultyReadingPanel detail />
      <section className={dataPanel} aria-labelledby="projected-level-title">
        <p className="text-[10px] font-bold uppercase tracking-wider text-highlight">Translate the percentage</p><h2 id="projected-level-title" className="mt-3 text-xl font-bold tracking-tight">What level would that imply?</h2>
        <p className="tabular mt-5 text-[38px] font-extrabold leading-none tracking-[-0.04em] text-highlight sm:text-[44px]">{tera(projected)}</p>
        <p className="mt-3 text-xs leading-[1.8] text-subtle">The level implied by applying the authored <span className="tabular">{pct(difficulty.changePct)}</span> change to <span className="tabular">{tera(difficulty.currentT)}</span>. This is derived arithmetic, not another forecast.</p>
        <div className="tabular my-5 rounded-lg bg-ink/45 p-4 text-sm leading-[1.9]">{difficulty.currentT.toFixed(2)} × (1 + {difficulty.changePct.toFixed(2)} ÷ 100)<br /><span className="font-semibold text-highlight">= {projected.toFixed(2)} T</span><span className="mt-2 block text-xs text-subtle">Displayed to two decimal places.</span></div>
        <DataFields rows={[{ label: `At ${pct(difficulty.band95[0], 1)}`, value: tera(low), note: 'Lower authored endpoint applied to the same starting level.' }, { label: `At ${pct(difficulty.band95[1], 1)}`, value: tera(high), note: 'Upper authored endpoint applied to the same starting level.' }]} />
        <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-[1.8] text-subtle">A higher difficulty level means more expected work per block. It is not the Bitcoin price or a return on a position.</p>
      </section>
    </div>

    <DataSection id="observation-context" title="A projection needs an observation context." description="A difficulty level and a block height are not enough to reproduce a forecast. You also need the timestamps and interval convention used to estimate block pace.">
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={dataPanel}><h3 className="mb-5 text-base font-bold">Fields supplied with this example</h3><DataFields rows={[
          { label: 'Snapshot timestamp', value: <time dateTime={difficulty.builtAt}>24 August 2026 · 14:00 UTC</time> },
          { label: 'Reference block', value: int(difficulty.asOfHeight) },
          { label: 'Example target block', value: int(difficulty.nextRetargetHeight) },
          { label: 'Authored observation count', value: int(difficulty.blocksObserved) },
          { label: 'Stored interval count', value: int(difficulty.blocksInEpoch), note: 'This is a fixture field, not a verified current epoch boundary.' },
          { label: 'Stored fit-window label', value: difficulty.fitWindow, note: 'A label alone does not establish which observations were fitted.' },
        ]} /></section>
        <div className="space-y-5"><section className={dataPanel}><h3 className="text-base font-bold">Why the projection can move</h3><p className={'mt-3 ' + dataCopy}>A forecast extends the block pace observed so far to an adjustment target. New blocks can change that pace. A forecast captured earlier and one captured later answer different questions, even if both refer to the same target.</p><p className={'mt-3 ' + dataCopy}>For a reproducible estimate, retain the reference block, its timestamp, the starting boundary and the calculation method. A target block is an observation point, not a promised calendar date.</p></section><section className={dataPanel}><h3 className="text-base font-bold">Why a range needs its own evidence</h3><p className={'mt-3 ' + dataCopy}>The authored range crosses zero, so it includes both a decrease and an increase. Nothing in those endpoints establishes a confidence level or a probability that the direction is wrong.</p><p className={'mt-3 ' + dataCopy}>To assess an interval, inspect its construction, width and coverage over a comparable set of recorded forecasts.</p><Link href="/v3/data/scoreboard" className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-highlight hover:underline">Read error and coverage metrics →</Link></section></div>
      </div>
      <details className="mt-5 rounded-lg border border-white/10 px-5 py-1"><summary className="cursor-pointer py-3 text-sm font-semibold text-highlight">Why this example has no countdown or live progress</summary><div className="pb-4 text-xs leading-[1.9] text-subtle"><p>The authored heights differ by <span className="tabular">{int(heightGap)}</span> blocks, while subtracting the stored counts gives <span className="tabular">{int(countGap)}</span>. Those fields do not describe one consistent snapshot. The underlying block timestamps and forecast input captures are absent.</p><p className="mt-2">These supplied fields cannot establish a remaining-block count, arrival date or verified progress bar. The stored fit-window label and range are not a published calibration study.</p></div></details>
    </DataSection>

    <DataSection title="Read a sequence of difficulty levels." eyebrow="A separate authored series" description="This separate 26-point authored series uses one unit, with every plotted value available as text. Read its shape as an illustration of step changes, not a historical market signal.">
      <DataSeries metric="difficultyT" />
    </DataSection>

    <DataSection id="records" title="Keep a forecast separate from its outcome." description="These dated records show the forecast reference, authored range, before/after levels and an outcome where one is supplied. Their dates and values are independent fixtures; they do not complete the chart above.">
      <DataRecords />
    </DataSection>
    <DataNext items={[{ href: '/v3/methodology/difficulty-index', label: 'Inspect the methodology', note: 'The inputs, calculation and evidence a reproducible forecast needs.' }, { href: '/v3/tools/difficulty-exposure', label: 'Explore production sensitivity', note: 'Use your own fleet and difficulty scenarios. A scenario is not a forecast or payout.' }]} />
  </DataDetail>
}

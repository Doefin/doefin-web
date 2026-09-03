import { difficulty } from '@/content'

/**
 * Where the current retarget period stands. A server component — it has no
 * interaction, so it renders straight into the HTML and a crawler reads every figure.
 */
export function EpochProgress() {
  const { blocksObserved, blocksInEpoch, nextRetargetHeight, changePct, band95 } = difficulty
  const pct = (blocksObserved / blocksInEpoch) * 100
  const remaining = blocksInEpoch - blocksObserved
  const days = (remaining * 10) / 60 / 24

  return (
    <section className="rounded-panel border border-white/[0.07] bg-surface p-6" aria-labelledby="epoch-progress">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="epoch-progress" className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
          Current retarget period
        </h2>
        <p className="tabular text-sm text-muted">
          {blocksObserved.toLocaleString('en-US')} of {blocksInEpoch.toLocaleString('en-US')} blocks
          — {pct.toFixed(1)}% through
        </p>
      </div>

      <div
        className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/[0.06]"
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Blocks mined in the current retarget period"
      >
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ['Blocks remaining', remaining.toLocaleString('en-US'), `about ${days.toFixed(1)} days at 10 min`],
          ['Retargets at block', nextRetargetHeight.toLocaleString('en-US'), 'the next adjustment'],
          ['Forecast change', `${changePct > 0 ? '+' : ''}${changePct.toFixed(2)}%`,
            `95% interval ${band95[0].toFixed(1)}% to +${band95[1].toFixed(1)}%`],
        ].map(([k, v, note]) => (
          <div key={k}>
            <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{k}</dt>
            <dd className="tabular mt-1.5 text-xl font-extrabold tracking-[-0.02em]">{v}</dd>
            <dd className="mt-0.5 text-xs text-muted">{note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

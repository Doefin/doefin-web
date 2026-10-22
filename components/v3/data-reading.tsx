import Link from '@/components/routing/SiteLink'
import { difficulty } from '@/content'
import { dateLong, int, pct } from '@/lib/format'
import { Arrow } from './Arrow'

/** A range diagram, not a time series or a calibrated probability distribution. */
export function DifficultyReadingPanel({ detail = false }: { detail?: boolean } = {}) {
  const [low, high] = difficulty.band95
  const x = (value: number) => 20 + ((value - low) / (high - low)) * 560
  return <article className="overflow-hidden rounded-panel border border-chart/25 bg-gradient-to-br from-surfaceAlt/70 to-surface/20">
    <div className="p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-bold tracking-tight">Difficulty forecast</h2><span className="text-[10px] font-bold uppercase tracking-wider text-caution">Synthetic example</span></div>
      <p className="mt-2 text-xs text-subtle">Sample reference: <time className="tabular" dateTime={difficulty.builtAt}>{dateLong(difficulty.builtAt)}</time></p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-7 sm:gap-8">
        <div><p className="text-xs text-subtle">Starting difficulty</p><p className="tabular mt-2 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.05em] min-[360px]:text-[36px] sm:text-[48px]">{difficulty.currentT.toFixed(2)} <span className="text-sm font-semibold text-subtle min-[360px]:text-lg sm:text-2xl">T</span></p><p className="mt-3 text-xs leading-relaxed text-subtle">T means trillion.<br />This is a level.</p></div>
        <div className="border-l border-white/10 pl-3 sm:pl-8"><p className="text-xs text-subtle">Projected adjustment</p><p className="tabular mt-2 whitespace-nowrap text-[28px] font-extrabold leading-none tracking-[-0.05em] text-highlight min-[360px]:text-[36px] sm:text-[48px]">{pct(difficulty.changePct)}</p><p className="mt-3 text-xs leading-relaxed text-subtle">Relative to the starting level.<br />This is a hypothetical change.</p></div>
      </div>
      <div className="mt-7 rounded-lg border border-white/[0.07] bg-ink/40 px-4 pb-4 pt-4 sm:mt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-xs font-semibold">The range spans both directions</h3><p className="text-[10px] font-semibold uppercase tracking-wider text-subtle">Authored · uncalibrated</p></div>
        <svg viewBox="0 0 600 60" className="mt-2 w-full overflow-visible" role="img" aria-labelledby="difficulty-range-title difficulty-range-desc">
          <title id="difficulty-range-title">Synthetic difficulty-change range</title><desc id="difficulty-range-desc">Authored endpoints {pct(low, 1)} and {pct(high, 1)}, crossing zero. Projected adjustment {pct(difficulty.changePct)}. No confidence level or probability is established.</desc>
          <line x1="20" y1="37" x2="580" y2="37" className="stroke-chart/20" strokeWidth="12" strokeLinecap="round" />
          <line x1="20" y1="30" x2="20" y2="44" className="stroke-highlight" strokeWidth="2" />
          <line x1="580" y1="30" x2="580" y2="44" className="stroke-highlight" strokeWidth="2" />
          <line x1={x(0)} y1="20" x2={x(0)} y2="53" className="stroke-subtle" strokeDasharray="3 4" />
          <circle cx={x(difficulty.changePct)} cy="37" r="7" className="fill-highlight stroke-ink" strokeWidth="3" />
        </svg>
        <div className="tabular mt-1 flex justify-between text-sm font-bold text-body"><span>{pct(low, 1)}</span><span>{pct(high, 1)}</span></div>
        <div className="tabular mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[11px] leading-relaxed text-subtle"><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-3 w-px border-l border-dashed border-subtle" />Dashed: 0% change</span><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-highlight" />Dot: {pct(difficulty.changePct)} projection</span></div>
        <p className="mt-4 text-xs leading-relaxed text-subtle">The range includes a decrease and an increase. Its endpoints do not establish the chance of either outcome.</p>
      </div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-white/10 px-5 py-4 sm:px-7"><p className="tabular text-xs text-subtle">Example target · block <span className="font-semibold text-body">{int(difficulty.nextRetargetHeight)}</span></p><Link href={detail ? '#observation-context' : '/v3/data/difficulty'} className="inline-flex min-h-11 items-center gap-3 text-sm font-bold text-highlight hover:underline">{detail ? 'Inspect the inputs' : 'Read the difficulty example'}{detail ? <span aria-hidden="true">↓</span> : <Arrow className="h-4 w-4" />}</Link></div>
  </article>
}

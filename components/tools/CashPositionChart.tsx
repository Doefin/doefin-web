/** V3 view of the existing simulation: fit the entire cash path, including month zero. */
export function CashPositionChart({ series, capex, months }: {
  series: { m: number; cum: number }[]; capex: number; months: number
}) {
  const values = [{ m: 0, cum: -capex }, ...series]
  const low = Math.min(...values.map(p => p.cum), 0)
  const high = Math.max(...values.map(p => p.cum), 0)
  const span = Math.max(1, high - low)
  const y = (n: number) => 18 + (high - n) / span * 110
  const path = values.map(p => `${48 + p.m / months * 366},${y(p.cum)}`).join(' ')
  // Explicit formatting keeps server/browser ICU compact-number rules from diverging.
  const money = (n: number) => {
    const abs = Math.abs(n)
    const [divisor, suffix] = abs >= 1e9 ? [1e9, 'B'] : abs >= 1e6 ? [1e6, 'M'] : abs >= 1e3 ? [1e3, 'K'] : [1, '']
    const amount = divisor === 1 ? String(Math.round(abs)) : (abs / divisor).toFixed(1).replace(/\.0$/, '')
    return `${n < 0 ? '-' : ''}$${amount}${suffix}`
  }
  const end = series[series.length - 1].cum
  return <figure className="mt-6 rounded-xl border border-white/[0.07] bg-ink/30 p-4">
    <figcaption className="flex flex-wrap items-baseline justify-between gap-2 text-xs"><span className="font-semibold text-subtle">Cumulative cash position</span><span className="tabular font-bold text-body">{money(end)} at month {months}</span></figcaption>
    <svg viewBox="0 0 440 166" className="mt-4 w-full overflow-visible" role="img" aria-label={`Central cash path: ${money(-capex)} at month zero to ${money(end)} after ${months} months. Dashed line marks break-even.`}>
      {[high, low].map((n, i) => <g key={i}><line x1="48" y1={y(n)} x2="414" y2={y(n)} stroke="currentColor" className="text-white/10" /><text x="0" y={y(n) + 4} fill="currentColor" className="tabular text-[11px] text-subtle">{money(n)}</text></g>)}
      <line x1="48" y1={y(0)} x2="414" y2={y(0)} stroke="currentColor" strokeDasharray="4 4" className="text-subtle/50" />
      {low < 0 && high > 0 ? <text x="0" y={y(0) + 4} fill="currentColor" className="tabular text-[11px] text-subtle">$0</text> : null}
      <polyline points={path} fill="none" stroke="currentColor" className="text-chart" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="414" cy={y(end)} r="3.5" fill="currentColor" className="text-highlight" />
      <text x="48" y="154" fill="currentColor" className="text-[11px] text-subtle">Month 0</text><text x="414" y="154" textAnchor="end" fill="currentColor" className="tabular text-[11px] text-subtle">Month {months}</text>
    </svg>
  </figure>
}

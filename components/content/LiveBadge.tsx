/**
 * Marks figures that are placeholders. While the static build has no backend,
 * every number on the site must say so — a plausible-looking fake number is
 * worse than no number.
 */
export function IllustrativeBadge({ isLive }: { isLive: boolean }) {
  if (isLive) return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-caution/40 bg-caution/10 px-2.5 py-1 text-xs font-semibold text-caution">
      <span aria-hidden>●</span> Illustrative — not live data
    </span>
  )
}

export function AsOf({ height, builtAt }: { height: number; builtAt: string }) {
  return (
    <p className="tabular text-xs text-muted">
      as of block {height.toLocaleString('en-US')} · built{' '}
      {new Date(builtAt).toISOString().slice(11, 16)} UTC
    </p>
  )
}

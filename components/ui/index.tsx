import Link from 'next/link'
import { clsx } from '@/lib/clsx'
import { blockId, isHeading, type Block } from '@/content/types'

/* ── Section heading ────────────────────────────────────────────────────── */

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-brand">{children}</p>
  )
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow?: string
  title: string
  lede?: string
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
        {title}
      </h1>
      {lede ? <p className="mt-5 text-lg leading-relaxed text-muted">{lede}</p> : null}
    </div>
  )
}

/* ── Surfaces ───────────────────────────────────────────────────────────── */

export function Panel({
  children,
  className,
  as: As = 'div',
}: {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article' | 'section' | 'li'
}) {
  return (
    <As className={clsx('rounded-panel border border-white/[0.07] bg-surface p-6', className)}>
      {children}
    </As>
  )
}

/* ── Buttons ────────────────────────────────────────────────────────────── */

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-[filter,background-color,border-color]'

export function Button({
  href,
  children,
  variant = 'primary',
  external,
}: {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  external?: boolean
}) {
  const cls = clsx(
    buttonBase,
    variant === 'primary'
      ? 'bg-brand text-white hover:brightness-110'
      : 'border border-white/[0.12] text-body hover:border-white/25 hover:bg-white/[0.04]',
  )
  if (external) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}

/* ── Data display ───────────────────────────────────────────────────────── */

export function Stat({
  label,
  value,
  note,
  tone = 'neutral',
}: {
  label: string
  value: string
  note?: string
  tone?: 'neutral' | 'up' | 'down'
}) {
  return (
    <div className="rounded-panel border border-white/[0.07] bg-surface px-5 py-4">
      <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{label}</dt>
      <dd
        className={clsx(
          'tabular mt-2 text-2xl font-extrabold tracking-[-0.02em]',
          tone === 'up' && 'text-up',
          tone === 'down' && 'text-down',
        )}
      >
        {value}
      </dd>
      {note ? <p className="mt-1 text-xs text-muted">{note}</p> : null}
    </div>
  )
}

/** Data tables carry the numbers as HTML text — never a chart alone. */
export function DataTable({
  caption,
  head,
  rows,
}: {
  caption?: string
  head: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <div className="overflow-x-auto rounded-panel border border-white/[0.07]">
      <table className="w-full min-w-[34rem] border-collapse text-sm">
        {caption ? (
          <caption className="border-b border-white/[0.07] bg-surface/60 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {caption}
          </caption>
        ) : null}
        <thead>
          <tr className="bg-surface/60">
            {head.map((h) => (
              <th
                key={h}
                scope="col"
                className="whitespace-nowrap border-b border-white/[0.07] px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.1em] text-muted"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/[0.05] last:border-0">
              {r.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-subtle">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Callout({
  tone = 'note',
  title,
  children,
}: {
  tone?: 'note' | 'caution' | 'good'
  title?: string
  children: React.ReactNode
}) {
  const border =
    tone === 'caution' ? 'border-l-caution' : tone === 'good' ? 'border-l-up' : 'border-l-brand'
  const label = tone === 'caution' ? 'text-caution' : tone === 'good' ? 'text-up' : 'text-brand'
  return (
    <div className={clsx('rounded-lg border border-white/[0.07] border-l-[3px] bg-surface p-5', border)}>
      {title ? (
        <p className={clsx('mb-2 text-xs font-bold uppercase tracking-[0.12em]', label)}>{title}</p>
      ) : null}
      <div className="text-[15px] leading-relaxed text-subtle [&>p+p]:mt-3">{children}</div>
    </div>
  )
}

export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs font-medium text-muted">
      {children}
    </span>
  )
}

/* ── Long-form ──────────────────────────────────────────────────────────── */

export function Prose({ paragraphs }: { paragraphs: Block[] }) {
  return (
    <div className="prose-doefin">
      {paragraphs.map((b, i) =>
        isHeading(b) ? (
          <h2 key={i} id={blockId(b)} className="scroll-mt-24">
            {b.heading}
          </h2>
        ) : (
          <p key={i}>{b}</p>
        ),
      )}
    </div>
  )
}

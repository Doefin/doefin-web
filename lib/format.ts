export const pct = (n: number, digits = 2) =>
  `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`

export const int = (n: number) => n.toLocaleString('en-US')

export const tera = (n: number, digits = 2) => `${n.toFixed(digits)} T`

export const dateLong = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export const dateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

/**
 * Reading time from the body itself.
 *
 * This was a hand-typed field. Both authored values were wrong — one declared six
 * minutes over a 163-word body — which is hard to defend on a site whose argument
 * is that a published number without a basis is not worth much. Deriving it means
 * it cannot drift, and a short post is honestly reported as short.
 */
export const readingMinutes = (body: Array<string | { heading: string }>) =>
  Math.max(
    1,
    Math.round(
      body
        .map((b) => (typeof b === 'string' ? b : b.heading))
        .join(' ')
        .trim()
        .split(/\s+/)
        .filter(Boolean).length / 220,
    ),
  )

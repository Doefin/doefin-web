export const pct = (n: number, digits = 2) =>
  `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`

export const int = (n: number) => n.toLocaleString('en-US')

export const tera = (n: number, digits = 2) => `${n.toFixed(digits)} T`

export const dateLong = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export const dateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

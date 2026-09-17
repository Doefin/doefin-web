import { versionedPath } from './versioning'

/** Stable preview URLs; no content imports, so navigation can use this in the browser. */
export const preview = {
  home: '/v2',
  product: '/v2/product',
  miners: '/v2/for/miners',
  institutions: '/v2/for/institutions',
  settlement: '/v2/product/settlement',
  tools: '/v2/tools',
  exposure: '/v2/tools/difficulty-exposure',
  hosting: '/v2/tools/hosting-effective-rate',
  payback: '/v2/tools/fleet-payback',
  learn: '/v2/learn',
  tutorial: '/v2/learn/difficulty-exposure',
  research: '/v2/research',
  report: '/v2/research/evaluating-a-forecast',
} as const

export const previewNav = [
  { label: 'Product', href: preview.product },
  { label: 'Tools', href: preview.tools },
  { label: 'Data & Research', href: preview.research },
  { label: 'Learn', href: preview.learn },
]

const originalRoutes: Record<string, string> = {
  [preview.home]: '/',
  [preview.product]: '/docs',
  [preview.miners]: '/for/miners',
  [preview.institutions]: '/for/institutions',
  [preview.settlement]: '/docs/how-settlement-works',
  [preview.tools]: '/tools',
  [preview.exposure]: '/tools/difficulty-exposure',
  [preview.hosting]: '/tools/hosting-effective-rate',
  [preview.payback]: '/tools/fleet-payback',
  [preview.learn]: '/academy',
  [preview.tutorial]: '/academy/guides/difficulty-exposure',
  [preview.research]: '/research',
  [preview.report]: '/research/difficulty-forecast-accuracy-2026',
}

export const originalForPreview = (path: string) => versionedPath(originalRoutes[path] ?? '/')

export function previewForOriginal(path: string): string {
  const original = path.replace(/^\/v1(?=\/|$)/, '') || '/'
  const match = Object.entries(originalRoutes).find(([, value]) => value === original)
  if (match) return match[0]
  if (original.startsWith('/docs/')) return preview.settlement
  if (original.startsWith('/tools/')) return preview.tools
  if (original.startsWith('/academy/') || original.startsWith('/blog') || original.startsWith('/glossary')) return preview.learn
  if (original.startsWith('/research/') || original.startsWith('/data') || original.startsWith('/methodology')) return preview.research
  if (original === '/newsletter') return preview.research + '#updates'
  return preview.home
}

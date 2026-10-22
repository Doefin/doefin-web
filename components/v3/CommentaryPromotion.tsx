import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import type { ApprovedPromotion } from '@/lib/v3-publication'

/** Separate optional promotion layer; empty means no markup or reserved space. */
export function CommentaryPromotion({ promotion }: { promotion: ApprovedPromotion | null }) {
  if (!promotion) return null
  return <aside aria-label="Product promotion" data-publication-layer="promotion" className="border-t border-white/10">
    <Container className="py-7"><p className="text-xs uppercase tracking-wider text-subtle">Product promotion</p><h2 className="mt-2 text-lg font-semibold">{promotion.label}</h2><p className="mt-2 text-sm text-subtle">{promotion.description}</p><Link className="mt-3 inline-flex min-h-11 items-center text-sm text-highlight" href={promotion.href}>Read more →</Link></Container>
  </aside>
}

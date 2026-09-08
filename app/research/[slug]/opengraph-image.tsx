import { allReports, getReport } from '@/content'
import { articleCard, OG_CONTENT_TYPE, OG_SIZE } from '@/lib/og'
import { dateShort } from '@/lib/format'

export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE
export const alt = 'Doefin'

// Prerendered with the page rather than rendered on request: the card is a
// pure function of content that only changes at build time.
export function generateStaticParams() {
  return allReports().map((r) => ({ slug: r.slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = getReport(slug)
  if (!item) return articleCard({ eyebrow: 'Research', title: 'Doefin' })
  return articleCard({
    eyebrow: item.reportId,
    title: item.title,
    figures: item.keyFigures,
    footer: dateShort(item.publishedAt),
  })
}

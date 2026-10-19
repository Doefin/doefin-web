import { ReferenceGuidePage } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'
import { allGuides, guideFor } from '@/content'

export function generateStaticParams() {
  return allGuides().map(({ slug }) => ({ slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = guideFor(slug)
  if (!g) return {}
  return seo({
    title: g.article.seoTitle,
    description: g.article.summary,
    path: `/academy/guides/${slug}`,
    type: 'article',
  })
}

export default function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  return <ReferenceGuidePage params={params} />
}

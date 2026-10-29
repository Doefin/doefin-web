import { ReferenceGuidePage } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'
import { guideFor } from '@/content'

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await guideFor(slug)
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

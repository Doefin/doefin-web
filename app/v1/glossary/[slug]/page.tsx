import { ReferenceTermPage } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'
import { allGlossary, getGlossary } from '@/content'

export function generateStaticParams() {
  return allGlossary().map((t) => ({ slug: t.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getGlossary(slug)
  if (!t) return {}
  return seo({
    title: `${t.term} — definition`,
    description: t.shortDef,
    path: `/glossary/${t.slug}`,
  })
}

export default function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  return <ReferenceTermPage params={params} />
}

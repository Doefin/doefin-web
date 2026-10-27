import { ReferenceTermPage } from '@/components/content/ReferencePages'
import { seo } from '@/lib/seo'
import { getGlossary } from '@/content'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = await getGlossary(slug)
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

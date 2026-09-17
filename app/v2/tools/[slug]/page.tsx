import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { PreviewCalculator } from '@/components/preview/PreviewCalculator'
import { PageIntro, RelatedContent, previewSeo } from '@/components/preview/Primitives'
import { previewTools, getPreviewTool } from '@/content'
import { preview } from '@/lib/preview'

export const dynamicParams = false
export const generateStaticParams = () => previewTools().map(({ slug }) => ({ slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getPreviewTool(slug)
  if (!tool) notFound()
  return previewSeo(tool.title, tool.description, preview.tools + '/' + slug)
}

export default async function ToolPreview({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getPreviewTool(slug)
  if (!tool) notFound()
  return <>
    <PageIntro section="Tools" title={tool.title} description={tool.description} />
    <Container className="py-10 sm:py-12">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 text-sm">
        <div><p className="font-semibold">{tool.use}</p><p className="mt-1 text-subtle">{tool.limit}</p></div>
        <p className="text-xs font-semibold text-caution">Illustrative — not live data<br /><span className="mt-1 inline-block font-normal text-subtle">Sample inputs · 17 September 2026</span></p>
      </div>
      <p className="mb-5 text-xs text-subtle">Drag a slider, or type an exact value and press Enter. Share the page URL to share your inputs.</p>
      <PreviewCalculator slug={slug} />
      <details className="mt-7 rounded-panel border border-white/10 bg-surface/40 p-5">
        <summary className="cursor-pointer text-sm font-bold">Assumptions and limits</summary>
        <p className="mt-4 max-w-3xl text-sm leading-[1.75] text-subtle">{tool.assumptions}</p>
      </details>
      <RelatedContent learning={tool.learning} action={slug === 'difficulty-exposure'
        ? { href: preview.payback, title: 'Test the wider payback picture', text: 'Explore power costs and capital recovery separately.' }
        : { href: preview.exposure, title: 'Isolate difficulty exposure', text: 'Compare BTC production across two difficulty scenarios.' }} />
    </Container>
  </>
}

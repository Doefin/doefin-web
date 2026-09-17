import { Container } from '@/components/layout/Container'
import { PageIntro, LinkCards, panelClass, previewSeo } from '@/components/preview/Primitives'
import { previewTools } from '@/content'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('Tools for mining decisions', 'Compare hosting costs, explore difficulty exposure and test fleet payback with your own assumptions.', preview.tools)

export default function ToolsPreview() {
  return <>
    <PageIntro section="Tools" title="Start with a question. Bring your numbers."
      description="Each tool answers a different part of mining economics. Choose the question you need to explore; every result explains what to do next." />
    <Container className="py-12 sm:py-16">
      <LinkCards items={previewTools().map(tool => ({ href: preview.tools + '/' + tool.slug, title: tool.title, text: tool.description }))} />
      <section className={'mt-10 ' + panelClass}><h2 className="text-xl font-bold">A calculation you can inspect.</h2><p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-subtle">Use sliders to explore a range or type an exact value and press Enter. Results update on the page, and the calculator URL keeps your current assumptions so you can return to a scenario. Sample inputs are illustrative, not live market data.</p><p className="mt-3 max-w-3xl text-sm leading-relaxed text-subtle">Hosting compares operating costs. Payback explores simplified capital recovery. Difficulty exposure isolates production sensitivity. Only the last of these directly connects to the underlying described in Doefin’s contract documentation.</p></section>
    </Container>
  </>
}

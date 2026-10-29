import { GuidesPublicationProvider } from '@/components/routing/GuidesPublicationContext'
import { notFound } from 'next/navigation'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { PreviewCalculator } from '@/components/preview/PreviewCalculator'
import { previewSeo, RelatedContent } from '@/components/preview/Primitives'
import { previewTools, getPreviewTool, examplesFor, guideDiscovery } from '@/content'
import { preview } from '@/lib/preview'
export const generateStaticParams = () => previewTools().map(({ slug }) => ({ slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getPreviewTool(slug)
  if (!tool) notFound()
  return previewSeo(tool.title, tool.description, preview.tools + '/' + slug)
}

const tools = [
  { slug: 'difficulty-exposure', name: 'Difficulty exposure', detail: 'Production sensitivity' },
  { slug: 'hosting-effective-rate', name: 'Hosting comparison', detail: 'Effective cost of power' },
  { slug: 'fleet-payback', name: 'Fleet payback', detail: 'Capital recovery' },
]

export default async function V3ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const tool = getPreviewTool(slug)
  if (!tool || !previewTools().some(t => t.slug === slug)) notFound()
  const examples = examplesFor(slug)
  const {guides,unavailable} = await guideDiscovery()
  const guide = guides.find(row=>row.slug===slug)?.guide
  const active = tools.find(t => t.slug === slug)!
  return <GuidesPublicationProvider slugs={unavailable ? null : guides.map(row=>row.slug)}><Container className="pb-14 pt-8 sm:pt-10 [overflow-wrap:anywhere]">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
      <Link href="/v3/tools" className="py-1 hover:text-highlight">Tools <span aria-hidden> / </span><span className="text-body">Mining analysis</span></Link>
      <span className="rounded-full border border-white/10 px-3 py-1.5">Sample inputs · 17 September 2026</span>
    </div>
    <div className="mb-7 max-w-3xl">
      <h1 className="text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">{active.name}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">{tool.description}</p>
    </div>
    <nav aria-label="Mining calculators" className="mb-6 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-surface/60 p-1.5">
      {tools.map(t => <Link key={t.slug} href={'/v3/tools/' + t.slug} aria-current={slug === t.slug ? 'page' : undefined}
        className={'min-w-0 rounded-lg px-2 py-3 transition-colors sm:px-4 ' + (slug === t.slug ? 'bg-active text-body shadow-sm' : 'text-subtle hover:bg-white/5 hover:text-body')}>
        <span className="block text-xs font-bold sm:text-sm">{t.name}</span><span className="mt-1 hidden text-xs text-subtle sm:block">{t.detail}</span>
      </Link>)}
    </nav>
    <div className="mb-5 flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border-l-2 border-brand pl-4 text-xs leading-relaxed text-subtle">
      <p className="max-w-xl"><strong className="font-semibold text-body">{tool.use}</strong><br />{tool.limit}</p>
      <p className="sm:max-w-xs">Illustrative. Not live data.<br />Type a value and press Enter, or drag a slider. Your inputs are saved in the page URL.</p>
    </div>
    <PreviewCalculator slug={slug} />
    <details className="mt-7 rounded-panel border border-white/10 bg-surface/40 p-5">
      <summary className="cursor-pointer text-sm font-bold">Assumptions and limits</summary>
      <p className="mt-4 max-w-3xl text-sm leading-[1.75] text-subtle">{tool.assumptions}</p>
    </details>
    <section className="mt-7 border-t border-white/10 pt-6" aria-labelledby="tool-worked-examples">
      <h2 id="tool-worked-examples" className="text-lg font-bold">Check the working</h2>
      <p className="mt-2 text-sm leading-relaxed text-subtle">Educational scenarios with stated assumptions. Compare the working, then return to the calculator.</p>
      {unavailable && <p role="status" className="mt-3 text-sm text-subtle">Calculator guides are temporarily unavailable.</p>}
      <ul className="mt-3 space-y-2 text-sm">
        {examples.map(example => <li key={example.slug}><Link href={`/v3/tools/${slug}/example/${example.slug}`} className="inline-flex min-h-11 items-center text-highlight underline underline-offset-4">{example.title}</Link></li>)}
        {guide && <li><Link href={`/v3/academy/guides/${slug}`} className="inline-flex min-h-11 items-center text-highlight underline underline-offset-4">Read the input guide: {guide.article.title}</Link></li>}
      </ul>
    </section>
    <RelatedContent learning={tool.learning} action={slug === 'difficulty-exposure'
      ? { href: preview.payback, title: 'Test the wider payback picture', text: 'Explore power costs and capital recovery separately.' }
      : { href: preview.exposure, title: 'Isolate difficulty exposure', text: 'Compare expected BTC production across two difficulty scenarios.' }} />
  </Container></GuidesPublicationProvider>
}

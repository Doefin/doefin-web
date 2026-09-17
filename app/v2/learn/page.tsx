import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { PageIntro, LinkCards, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('Learn mining economics and Doefin', 'Follow a practical tutorial, inspect a worked example and understand the product mechanics.', preview.learn)

export default function LearnPreview() {
  return <>
    <PageIntro section="Learn" title="Understand it. Work through it. Try it."
      description="Start with a practical walkthrough, then use the same method with your own numbers. Every guide gives you an outcome and a useful next step." />
    <Container className="py-12 sm:py-16">
      <section className="grid overflow-hidden rounded-header border border-white/10 bg-surface/60 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="p-7 sm:p-10"><Eyebrow>Featured tutorial · 4 steps</Eyebrow><h2 className={headingClass}>Measure your fleet’s difficulty exposure.</h2><p className="mt-5 text-[17px] leading-[1.75] text-subtle">Follow a sample fleet from inputs to BTC production. See an annotated result, check your expected outcome, then open the calculator with the example already loaded.</p><div className="mt-7"><Button href={preview.tutorial}>Start the walkthrough →</Button></div></div>
        <div className="border-t border-white/10 bg-surfaceAlt/60 p-7 sm:p-10 lg:border-l lg:border-t-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-highlight">You will be able to</p><ul className="mt-6 space-y-5">{['Choose a clear time window.', 'Compare difficulty scenarios.', 'Read the production difference.', 'Distinguish exposure from payout.'].map((text, i) => <li key={text} className="flex gap-4 text-sm leading-relaxed"><span className="tabular text-highlight">0{i + 1}</span>{text}</li>)}</ul></div>
      </section>
      <section className="mt-14"><h2 className={headingClass}>Continue by what you want to do.</h2><div className="mt-7"><LinkCards items={[
        { title: 'Understand the product', href: preview.settlement, text: 'Follow the threshold example and learn what happens at settlement.' },
        { title: 'Evaluate the evidence', href: preview.report, text: 'Inspect a sample research table and reproduce its error calculation.' },
        { title: 'Use your own numbers', href: preview.tools, text: 'Compare operating costs, explore production and test payback assumptions.' },
      ]} /></div></section>
      <section className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Explore the existing library</h2><p className="mt-3 text-sm leading-relaxed text-subtle">The broader article library remains available while these new content formats are being reviewed.</p><div className="mt-5 flex flex-wrap gap-6 text-sm font-semibold text-highlight">{[['Academy', '/academy'], ['Blog', '/blog'], ['Glossary', '/glossary'], ['Product documentation', '/docs']].map(([label, href]) => <Link key={href} href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">{label} ↗<span className="sr-only"> (original website, opens a new tab)</span></Link>)}</div></section>
    </Container>
  </>
}

import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { PageIntro, RelatedContent, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { getExposureTutorial } from '@/content'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('Tutorial: measure difficulty exposure', 'Follow four steps, inspect an annotated example and open the exposure calculator with the sample loaded.', preview.tutorial)

export default function TutorialPreview() {
  const tutorial = getExposureTutorial()
  const result = tutorial.example
  return <>
    <PageIntro section="Learn / Tutorial" title={tutorial.title} description={tutorial.description}>
      <div className="flex flex-wrap items-center gap-5"><Button href={tutorial.calculatorHref}>Open the worked example →</Button><span className="text-xs text-subtle">4 steps · No account required · 17 September 2026</span></div>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <div className="grid items-start gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-14">
        <aside className="lg:sticky lg:top-24">
          <nav aria-label="Tutorial steps" className={panelClass + ' !p-5'}><h2 className="text-xs font-bold uppercase tracking-[0.12em] text-subtle">In this tutorial</h2><ol className="mt-5 space-y-4">{tutorial.steps.map((step, i) => <li key={step.id}><Link href={'#' + step.id} className="flex gap-3 text-sm leading-relaxed text-subtle hover:text-highlight"><span className="tabular text-highlight">0{i + 1}</span>{step.title}</Link></li>)}</ol></nav>
        </aside>
        <article className="min-w-0">
          <section className={panelClass}><Eyebrow>The outcome</Eyebrow><h2 className="text-xl font-bold">{tutorial.objective}</h2><h3 className="mt-6 text-sm font-bold">Before you start</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-subtle">{tutorial.prerequisites.map(text => <li key={text}>{text}</li>)}</ul></section>
          <ol className="mt-10 space-y-12">{tutorial.steps.map((step, i) => <li key={step.id} id={step.id} className="scroll-mt-36">
            <div className="flex items-start gap-4"><span className="tabular grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-brand/30 bg-brand/10 text-sm font-bold text-highlight">{i + 1}</span><h2 className={headingClass}>{step.title}</h2></div>
            <p className="mt-5 text-[17px] leading-[1.8] text-subtle">{step.body}</p>
            {i === 1 ? <figure className="mt-7 overflow-hidden rounded-panel border border-white/10 bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4"><p className="text-xs font-bold text-body">Annotated calculator example</p><p className="text-xs text-caution">Illustrative — not live data</p></div>
              <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
                <div><p className="mb-5 text-xs font-bold uppercase tracking-[0.1em] text-subtle">Inputs</p>{[
                  ['A', 'Hashrate', '1.00 EH/s'], ['B', 'Difficulty increase', '+10.0%'],
                ].map(([n, label, value]) => <div key={n} className="mb-5"><div className="flex items-center gap-2"><span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/20 text-xs font-bold text-highlight">{n}</span><span className="text-sm text-subtle">{label}</span></div><p className="tabular mt-3 rounded-lg border border-white/10 bg-ink/60 px-4 py-3 text-lg font-bold">{value}</p></div>)}</div>
                <div className="rounded-lg border border-brand/20 bg-ink/50 p-5"><p className="flex items-center gap-2 text-xs font-bold text-highlight"><span className="grid h-6 w-6 place-items-center rounded-full bg-brand/20">C</span>Production difference</p><p className="tabular mt-5 text-3xl font-extrabold text-caution">{result.lossHigh.toFixed(3)} BTC</p><dl className="tabular mt-5 space-y-3 text-sm"><div><dt className="text-subtle">At starting difficulty</dt><dd className="mt-1 font-bold">{result.base.toFixed(3)} BTC</dd></div><div><dt className="text-subtle">At 10% higher difficulty</dt><dd className="mt-1 font-bold">{result.atHigh.toFixed(3)} BTC</dd></div></dl></div>
              </div>
              <figcaption className="border-t border-white/10 px-5 py-4 text-xs leading-relaxed text-subtle"><strong className="text-body">A</strong> fixes fleet size. <strong className="text-body">B</strong> changes difficulty only. <strong className="text-body">C</strong> is the difference in production, not a payout. One epoch of target time; 127.48 T starting difficulty; 0.05 BTC fees per block. Sample prepared 17 September 2026.</figcaption>
            </figure> : null}
            {i === 2 ? <div className="mt-6 rounded-lg border border-white/10 bg-surface/50 p-5"><p className="text-xs font-bold uppercase tracking-[0.1em] text-highlight">Check the arithmetic</p><p className="tabular mt-3 break-words text-sm leading-relaxed">Production after change = baseline production ÷ 1.10</p><p className="mt-3 text-sm leading-relaxed text-subtle">A 10% difficulty increase produces about 9.09% less BTC in this fixed-duration model. The calculation holds everything else constant.</p></div> : null}
            <p className="mt-5 rounded-lg border-l-[3px] border-brand bg-brand/[0.07] p-4 text-sm leading-relaxed text-subtle"><strong className="text-body">Expected outcome: </strong>{step.expected}</p>
          </li>)}</ol>
          <section className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">What this exercise leaves out</h2><p className="mt-4 text-sm leading-[1.75] text-subtle">Uptime, pool fees, changing transaction fees and changes in your fleet are not modelled here. The sample assumes a constant 3.125 BTC subsidy and a fixed time window. The calculator does not forecast difficulty or determine a position size.</p><div className="mt-6"><Button href={tutorial.calculatorHref}>Try the worked example →</Button></div></section>
        </article>
      </div>
      <RelatedContent {...tutorial.related} />
    </Container>
  </>
}

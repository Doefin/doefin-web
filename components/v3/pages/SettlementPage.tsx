import { Container } from '@/components/layout/Container'
import { Button, Eyebrow, DataTable } from '@/components/ui'
import { PageIntro, RelatedContent, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { publishedDocs } from '@/content'
import { preview } from '@/lib/preview'
import { site } from '@/lib/site'

export const metadata = previewSeo('Understand binary settlement', 'Follow an illustrative threshold example and understand how settlement differs from mining production.', preview.settlement)

export default function SettlementPreview() {
  const sources = publishedDocs()
  return <>
    <PageIntro section="Product / Settlement" title="Production changes continuously. A contract settles at a threshold."
      description="Your calculator result estimates a range of BTC production. A Doefin position answers a different question: is difficulty at or above a defined level at the observation block?" />
    <Container className="py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div><Eyebrow>A worked settlement example</Eyebrow><h2 className={headingClass}>Watch the level, the block and the side.</h2>
          <p className="mt-5 text-[17px] leading-[1.75] text-subtle">Suppose a market asks whether difficulty will be at or above <strong className="tabular text-body">130 T</strong> at a specified observation block. The table shows the outcome for the “at or above” side.</p>
          <p className="mt-4 text-sm leading-relaxed text-subtle">The values illustrate the rule; they are not an available market or a quote. “Full payout” means the amount specified by the contract, before considering what you paid and any fees.</p>
        </div>
        <div className="min-w-0"><p className="mb-4 text-xs font-semibold text-caution">Illustrative — not live data · 17 September 2026</p>
          <DataTable caption="Example threshold: 130 T · at-or-above side" head={['Observed difficulty', 'Threshold met?', 'Outcome']} rows={[
            ['129 T', 'No', 'No payout'], ['130 T', 'Yes', 'Full payout'], ['135 T', 'Yes', 'Full payout'],
          ]} />
          <p className="mt-4 text-xs leading-relaxed text-subtle">Difficulty is a dimensionless target ratio; T denotes one trillion. A larger move above the threshold does not increase the binary payout.</p>
        </div>
      </section>
      <section className="mt-14"><h2 className={headingClass}>Connect the calculation to the contract.</h2>
        <ol className="mt-7 grid gap-5 md:grid-cols-3">{[
          ['Match the horizon', 'The calculator uses a fixed time window. The contract observes difficulty at a block height. Calendar timing is an estimate.'],
          ['Read the payoff', 'The calculator’s production gap varies with difficulty. The contract’s payout depends on its side and threshold.'],
          ['Include cost and residual risk', 'Position price, fees and size affect net results. Power costs, downtime and Bitcoin price remain separate risks.'],
        ].map(([title, text], i) => <li key={title} className={panelClass}><span className="tabular text-sm font-bold text-highlight">0{i + 1}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-[1.75] text-subtle">{text}</p></li>)}</ol>
      </section>
      <section className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Collateral and verification</h2>
        <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-subtle">The current product documentation describes fully collateralised positions settling in a bitcoin-denominated token. Verify the specific token and contract terms in the app. Network difficulty is publicly observable; independent observation of the value does not remove smart-contract, token or execution risks.</p>
        <details className="mt-5"><summary className="cursor-pointer text-sm font-semibold text-highlight">Read the source documentation</summary>
          <div className="mt-4 space-y-5">{sources.map(source => <section key={source.slug}><h3 className="font-bold">{source.title}</h3>{source.body.map(text => <p key={text} className="mt-2 text-sm leading-relaxed text-subtle">{text}</p>)}</section>)}</div>
        </details>
      </section>
      <section className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-header border border-brand/30 bg-surfaceAlt/60 p-7 sm:p-10">
        <div><h2 className={headingClass}>Ready to inspect a market?</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-subtle">Check its observation block, threshold, price and payout before deciding whether to take a position.</p></div>
        <Button href={site.appUrl} external>Open the trading app ↗</Button>
      </section>
      <RelatedContent learning={{ href: preview.institutions, title: 'Review the institutional checklist', text: 'Markets, collateral, execution and the questions to resolve.' }} action={{ href: preview.exposure, title: 'Return to the exposure calculator', text: 'Test another scenario with the contract mechanics in mind.' }} />
    </Container>
  </>
}

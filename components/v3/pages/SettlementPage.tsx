import { Container } from '@/components/layout/Container'
import { Button, Eyebrow, DataTable } from '@/components/ui'
import { PageIntro, RelatedContent, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { publishedDocs } from '@/content'
import { preview } from '@/lib/preview'
import { site } from '@/lib/site'

export const metadata = previewSeo('Understand contract payouts', 'Follow an illustrative threshold example and understand how settlement differs from mining production.', preview.settlement)

export default function SettlementPreview() {
  const sources = publishedDocs()
  return <>
    <PageIntro section="Product / Settlement" title="Production varies. Payouts are all or nothing."
      description="The calculator compares BTC production under your assumptions. A Doefin position depends on whether difficulty is at or above a set level at the observation block." />
    <Container className="py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div><Eyebrow>A worked settlement example</Eyebrow><h2 className={headingClass}>Check the threshold, block and side.</h2>
          <p className="mt-5 text-[17px] leading-[1.75] text-subtle">Suppose a market asks whether difficulty will be at or above <strong className="tabular text-body">130T</strong> at a specified observation block. The table shows the outcome for the Yes side, which pays at or above the threshold.</p>
          <p className="mt-4 text-sm leading-relaxed text-subtle">These values explain the rule. They are not an available market or a quote. “Full payout” means the amount specified by the contract. To work out profit or loss, you also need what you paid and any fees.</p>
        </div>
        <div className="min-w-0"><p className="mb-4 text-xs font-semibold text-caution">Illustrative. Not live data · 17 September 2026</p>
          <DataTable caption="Example threshold: 130T · Yes side" head={['Observed difficulty', 'Threshold met?', 'Outcome']} rows={[
            ['129T', 'No', 'No payout'], ['130T', 'Yes', 'Full payout'], ['135T', 'Yes', 'Full payout'],
          ]} />
          <p className="mt-4 text-xs leading-relaxed text-subtle">Difficulty is a dimensionless target ratio; T denotes one trillion. A larger move above the threshold does not increase the binary payout.</p>
        </div>
      </section>
      <section className="mt-14"><h2 className={headingClass}>Compare production and contract payout.</h2>
        <ol className="mt-7 grid gap-5 md:grid-cols-3">{[
          ['Compare the time periods', 'The calculator estimates production over a fixed period. The contract observes difficulty at a specified block. Its calendar date is an estimate.'],
          ['Check the payout rule', 'The difference in expected production changes with difficulty in the calculator. The contract pays out according to its side and threshold.'],
          ['Include costs and other risks', 'Position price, fees and size affect your profit or loss. Power costs, downtime and Bitcoin price remain separate risks.'],
        ].map(([title, text], i) => <li key={title} className={panelClass}><span className="tabular text-sm font-bold text-highlight">0{i + 1}</span><h3 className="mt-4 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-[1.75] text-subtle">{text}</p></li>)}</ol>
      </section>
      <section className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Collateral and verification</h2>
        <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-subtle">Positions are fully collateralised. Check your market’s collateral token, payout terms and contract terms in the app. You can check network difficulty yourself. This does not remove smart-contract, token or execution risks.</p>
        <details className="mt-5"><summary className="cursor-pointer text-sm font-semibold text-highlight">Read the source documentation</summary>
          <div className="mt-4 space-y-5">{sources.map(source => <section key={source.slug}><h3 className="font-bold">{source.title}</h3>{source.body.map(text => <p key={text} className="mt-2 text-sm leading-relaxed text-subtle">{text}</p>)}</section>)}</div>
        </details>
      </section>
      <section className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-header border border-brand/30 bg-surfaceAlt/60 p-7 sm:p-10">
        <div><h2 className={headingClass}>Inspect a market in the app.</h2><p className="mt-3 max-w-xl text-sm leading-relaxed text-subtle">Check its observation block, threshold, price and payout before deciding whether to take a position.</p></div>
        <Button href={site.appUrl} external>Enter app ↗</Button>
      </section>
      <RelatedContent learning={{ href: preview.institutions, title: 'Review the institutional checklist', text: 'Check markets, collateral and execution before trading.' }} action={{ href: preview.exposure, title: 'Return to the exposure calculator', text: 'Compare another production scenario with the contract payout.' }} />
    </Container>
  </>
}

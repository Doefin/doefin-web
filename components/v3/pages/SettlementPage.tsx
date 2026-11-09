import Link from '@/components/routing/SiteLink'
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
        <div className="min-w-0">
          <DataTable caption="Example threshold: 130T · Yes side · 17 September 2026" head={['Observed difficulty', 'Threshold met?', 'Outcome']} rows={[
            ['129T', 'No', 'No payout'], ['130T', 'Yes', 'Full payout'], ['135T', 'Yes', 'Full payout'],
          ]} />
          <p className="mt-4 text-xs leading-relaxed text-subtle">Difficulty is a dimensionless target ratio; T denotes one trillion. A larger move above the threshold does not increase the binary payout.</p>
        </div>
      </section>
      <section className="mt-14 max-w-3xl"><h2 className={headingClass}>Why payout can differ from production.</h2>
        <p className="mt-5 text-[17px] leading-[1.75] text-subtle">The calculator estimates expected BTC production for the chosen period. Actual production can change with difficulty, hashrate and uptime throughout that period. The contract observes difficulty once, at its specified block, so a fixed payout can offset more or less than the actual production shortfall.</p>
        <p className="mt-4 text-sm leading-relaxed text-subtle">The observation block determines which difficulty value counts. Reaching that block and having a resolved, redeemable position are separate stages. The calendar date is an estimate; redemption follows resolution under the market’s settlement rules.</p>
        <p className="mt-4 text-sm leading-relaxed text-subtle">Position price, fees and size affect your profit or loss. Power costs, downtime and Bitcoin price remain separate risks. You can lose the full amount paid for a position.</p>
      </section>
      <section className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Collateral and verification</h2>
        <p className="mt-4 max-w-3xl text-[17px] leading-[1.75] text-subtle">Positions are fully collateralised. Check your market’s collateral token, payout terms and contract terms in the app. You can check network difficulty yourself. This does not remove smart-contract, token or execution risks.</p>
        <details className="mt-5"><summary className="cursor-pointer text-sm font-semibold text-highlight">Read the source documentation</summary>
          <nav aria-label="Settlement source documentation" className="mt-4 flex flex-col items-start gap-3">{sources.map(source => <Link key={source.slug} href={'/docs/' + source.slug} className="inline-flex min-h-11 items-center text-sm font-semibold text-highlight hover:underline">{source.title} →</Link>)}</nav>
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

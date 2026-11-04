import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { PageIntro, LinkCards, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'
import { site } from '@/lib/site'

export const metadata = previewSeo('A market on Bitcoin difficulty', 'Understand Doefin’s underlying, observation block, collateral and binary settlement.', preview.product)

export default function ProductPreview() {
  return <>
    <PageIntro section="Product" title="Trade hashrate exposure through difficulty markets."
      description="Doefin lets professional investors take Yes or No positions on whether Bitcoin mining difficulty will be above or below a specified level at a specified block height. Hashrate is the economic exposure; difficulty determines the contract outcome.">
      <div className="flex flex-wrap gap-3"><Button href={preview.settlement}>Understand settlement →</Button><Button href={site.appUrl} external variant="secondary">Enter app ↗</Button></div>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div><Eyebrow>The contract at a glance</Eyebrow>
          <p className="mt-5 text-[17px] leading-[1.75] text-subtle">The outcome uses public Bitcoin network difficulty. A larger move past the threshold does not increase the payout.</p>
        </div>
        <dl className={panelClass + ' divide-y divide-white/10'}>
          {[
            ['Underlying', 'Bitcoin mining difficulty.'],
            ['Observation', 'One specified block height. Calendar dates are estimates.'],
            ['Outcome', 'Yes wins at or above the threshold; No wins below it.'],
            ['Collateral', 'Fully collateralised positions in a BTC-denominated token, as described in the current documentation.'],
          ].map(([label, text]) => <div key={label} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr]"><dt className="text-sm text-subtle">{label}</dt><dd className="text-sm leading-relaxed">{text}</dd></div>)}
        </dl>
      </section>
      <section className="mt-14"><h2 className={headingClass}>Choose your starting point.</h2><div className="mt-7"><LinkCards items={[
        { title: 'I run a mining operation', text: 'Estimate your BTC production and see how a difficulty position could offset part of that exposure.', href: preview.miners },
        { title: 'I represent a fund or desk', text: 'Review the markets, collateral and settlement before you trade a view on hashrate.', href: preview.institutions },
        { title: 'I want to learn the mechanics', text: 'Follow a threshold example before you enter the app.', href: preview.settlement },
      ]} /></div></section>
      <div className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Before you enter a market</h2><p className="mt-4 max-w-3xl text-sm leading-[1.75] text-subtle">Review the actual threshold, observation block, collateral token, payout denomination, price, fees and available liquidity in the app. A production estimate does not determine a suitable order size. You can lose the full amount paid for a position.</p></div>
    </Container>
  </>
}

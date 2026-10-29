import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { PageIntro, LinkCards, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'
import { site } from '@/lib/site'

export const metadata = previewSeo('A market on Bitcoin difficulty', 'Understand Doefin’s underlying, observation block, collateral and binary settlement.', preview.product)

export default function ProductPreview() {
  return <>
    <PageIntro section="Product" title="A defined view on Bitcoin difficulty."
      description="Doefin markets let professional investors take positions on mining difficulty at a specified block height. Start with the mechanics, then explore the market.">
      <div className="flex flex-wrap gap-3"><Button href={preview.settlement}>Understand settlement →</Button><Button href={site.appUrl} external variant="secondary">Open app ↗</Button></div>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div><Eyebrow>The contract at a glance</Eyebrow><h2 className={headingClass}>A threshold.<br />An observation.<br />A binary outcome.</h2>
          <p className="mt-5 text-[17px] leading-[1.75] text-subtle">The product documentation describes an outcome based on public Bitcoin network difficulty. The size of a move past the threshold does not change the full payout.</p>
        </div>
        <dl className={panelClass + ' divide-y divide-white/10'}>
          {[
            ['Underlying', 'Bitcoin mining difficulty.'],
            ['Observation', 'One specified block height, rather than a guaranteed calendar date.'],
            ['Outcome', 'At or above the market’s level, or below it.'],
            ['Collateral', 'Fully collateralised positions with a bitcoin-denominated token, as described in the current documentation.'],
          ].map(([label, text]) => <div key={label} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[7rem_1fr]"><dt className="text-sm text-subtle">{label}</dt><dd className="text-sm leading-relaxed">{text}</dd></div>)}
        </dl>
      </section>
      <section className="mt-14"><h2 className={headingClass}>Choose your starting point.</h2><div className="mt-7"><LinkCards items={[
        { title: 'I run a mining operation', text: 'Calculate production sensitivity and consider how a difficulty position relates to it.', href: preview.miners },
        { title: 'I represent a fund or desk', text: 'Review markets, collateral, settlement and the questions for due diligence.', href: preview.institutions },
        { title: 'I want to learn the mechanics', text: 'Follow a simple threshold example before entering the app.', href: preview.settlement },
      ]} /></div></section>
      <div className={'mt-12 ' + panelClass}><h2 className="text-xl font-bold">Before entering a market</h2><p className="mt-4 max-w-3xl text-sm leading-[1.75] text-subtle">Review the actual threshold, observation block, collateral token, payout denomination, price, fees and available liquidity in the app. A production estimate does not determine a suitable order size. Positions involve risk, including the loss of the amount paid.</p></div>
    </Container>
  </>
}

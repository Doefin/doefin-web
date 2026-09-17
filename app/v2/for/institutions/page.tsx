import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { PageIntro, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'
import { site } from '@/lib/site'

export const metadata = previewSeo('For funds and trading desks', 'Review Doefin’s markets, collateral and settlement, then explore the app or contact the team.', preview.institutions)

export default function InstitutionsPreview() {
  return <>
    <PageIntro section="Product / For funds & desks" title="Evaluate the market before expressing a view."
      description="A focused starting point for professional investors assessing Bitcoin difficulty as an underlying: what determines the outcome, how positions settle, and what requires further review.">
      <div className="flex flex-wrap gap-3"><Button href={preview.settlement}>Review settlement mechanics →</Button><Button href={'mailto:' + site.contactEmail + '?subject=Doefin%20institutional%20enquiry'} external variant="secondary">Contact the team</Button></div>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <section><Eyebrow>Product overview</Eyebrow><h2 className={headingClass}>Four areas to understand.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">{[
          ['Markets', 'Positions reference network difficulty at a defined observation block. A binary outcome depends on the market’s threshold and selected side.'],
          ['Collateral', 'The current documentation describes full collateralisation and a bitcoin-denominated settlement token. Review the actual token and contract before funding.'],
          ['Settlement', 'Difficulty is observed once at the specified block height. Crossing the selected threshold determines the binary outcome.'],
          ['Risk and execution', 'Review position cost, liquidity, fees, contract behaviour and token risk. A model forecast or public settlement reference is not a guarantee of returns.'],
        ].map(([title, text]) => <article key={title} className={panelClass}><h3 className="text-xl font-bold">{title}</h3><p className="mt-4 text-[15px] leading-[1.8] text-subtle">{text}</p></article>)}</div>
      </section>
      <section className="mt-14 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div><Eyebrow>Due diligence</Eyebrow><h2 className={headingClass}>Make the open questions explicit.</h2><p className="mt-5 text-[17px] leading-[1.75] text-subtle">Use these questions to structure an internal review or a conversation with the team. Detailed operational requirements should be checked against the market and your mandate.</p></div>
        <dl className="divide-y divide-white/10 border-y border-white/10">{[
          ['Contract specification', 'Which side, threshold, observation block and payout denomination are being traded?'],
          ['Funding and custody', 'Which collateral token and network are used? What are the funding, withdrawal and redemption flows?'],
          ['Execution', 'What liquidity is available? What are the fees, order types and position limits?'],
          ['Technical review', 'Which contracts are deployed? What review evidence and operational controls are available?'],
          ['Portfolio fit', 'How does the payoff relate to the exposure, horizon and limits you want to manage?'],
        ].map(([term, text]) => <div key={term} className="py-5"><dt className="text-sm font-bold">{term}</dt><dd className="mt-2 text-sm leading-relaxed text-subtle">{text}</dd></div>)}</dl>
      </section>
      <section className={'mt-14 ' + panelClass}><h2 className={headingClass}>Continue with the evidence or the product.</h2><div className="mt-6 flex flex-wrap gap-3"><Button href={site.appUrl} external>Explore the app ↗</Button><Button href={preview.report} variant="secondary">Inspect a sample research report</Button><Button href={'mailto:' + site.contactEmail} external variant="secondary">Contact Doefin</Button></div></section>
    </Container>
  </>
}

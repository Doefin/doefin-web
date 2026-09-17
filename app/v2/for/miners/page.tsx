import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { ExposurePreview } from '@/components/home/ExposurePreview'
import { PageIntro, LinkCards, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('Plan around mining difficulty', 'Measure production sensitivity, review settlement and explore Doefin’s difficulty markets.', preview.miners)

export default function MinersPreview() {
  return <>
    <PageIntro section="Product / For miners" title="Start with the production you stand to lose."
      description="A rising difficulty can reduce the BTC your fleet produces. Put a range around that exposure before exploring a position.">
      <div className="flex flex-wrap gap-3"><Button href={preview.exposure}>Calculate difficulty exposure →</Button><Button href={preview.tutorial} variant="secondary">Walk through an example</Button></div>
      <p className="mt-4 text-xs text-subtle">No account needed to use the tools.</p>
    </PageIntro>
    <Container className="py-12 sm:py-16">
      <section className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div><Eyebrow>One variable, made visible</Eyebrow><h2 className={headingClass}>Same fleet. Harder network.<br />Less production.</h2>
          <p className="mt-5 text-[17px] leading-[1.75] text-subtle">Keep your hashrate and time window fixed. A difficulty increase changes how much work the same fleet must do to earn a block reward.</p>
          <p className="mt-4 text-[17px] leading-[1.75] text-subtle">Use the calculator to compare two scenarios. Then review the contract’s observation block, threshold and payout to understand whether the instrument is relevant to your operation.</p>
        </div><ExposurePreview />
      </section>
      <section className="mt-16"><Eyebrow>Your path through Doefin</Eyebrow><h2 className={headingClass}>Measure. Understand. Explore.</h2>
        <div className="mt-7"><LinkCards items={[
          { title: 'Measure your exposure', text: 'Enter your fleet hashrate and see the BTC difference across difficulty scenarios.', href: preview.exposure },
          { title: 'Review settlement', text: 'Understand why a binary payout differs from your production loss.', href: preview.settlement },
          { title: 'Explore the product', text: 'Review the market mechanics and what to check before entering the app.', href: preview.product },
        ]} /></div>
      </section>
      <section className={'mt-14 ' + panelClass}>
        <h2 className={headingClass}>Keep the other risks in view.</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">{[
          ['Power and hosting', 'A difficulty position does not settle on your electricity bill.', preview.hosting, 'Compare hosting quotes'],
          ['Capital recovery', 'Payback depends on several assumptions, including price and costs.', preview.payback, 'Test fleet payback'],
          ['Contract fit', 'Threshold, timing, position cost and size affect the outcome.', preview.settlement, 'Read the settlement example'],
        ].map(([title, text, href, action]) => <div key={title}><h3 className="font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-subtle">{text}</p><Link href={href} className="mt-4 inline-block text-sm font-semibold text-highlight hover:underline">{action} →</Link></div>)}</div>
      </section>
    </Container>
  </>
}

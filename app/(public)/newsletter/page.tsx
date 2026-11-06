import type { Metadata } from 'next'
import Link from '@/components/routing/SiteLink'
import { seo } from '@/lib/seo'
import { Container } from '@/components/layout/Container'
import { NewsletterForm } from '@/components/v3/NewsletterForm'
import { NewsletterDelivery } from '@/components/v3/NewsletterDelivery'
import { researchCapture, researchSummary } from '@/lib/research-data'
import { dateLong } from '@/lib/format'

export const metadata: Metadata = { ...seo({ title: 'Read a sample research email', description: 'Read an example research email and try the email preferences demo. Reports and datasets are public; this demo does not create a subscription.', path: '/newsletter' }), robots: { index: false, follow: false } }

export default function Newsletter() {
  return <Container className="py-12 sm:py-16">
    <header className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.14em] text-highlight">Research newsletter · Interactive demo</p><h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">Read a sample<br />research email.</h1><p className="mt-5 text-base leading-relaxed text-subtle">Read findings from {researchSummary.count} recorded difficulty adjustments, then try the email preferences demo.</p><p className="mt-3 text-sm leading-relaxed text-subtle">Findings and data are public, with no email address required. The preference form is a demo that sends no email and creates no subscription.</p></header>
    <div className="mt-10 grid gap-10 border-t border-white/10 pt-7 lg:grid-cols-2">
      <article id="sample-issue" className="scroll-mt-28 rounded-panel border border-white/10 bg-surface/40 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wider text-highlight">Example email · Not sent or scheduled</p>
        <h2 className="mt-4 text-2xl font-bold">What changed across {researchSummary.count} difficulty adjustments?</h2>
        <p className="mt-4 text-sm leading-relaxed text-subtle">Subject: Observed difficulty changes, {dateLong(researchSummary.firstDate)} to {dateLong(researchSummary.lastDate)}</p>
        <h3 className="mt-6 font-semibold">Difficulty moved in both directions</h3>
        <p className="mt-3 text-sm leading-relaxed text-subtle">The dataset records {researchSummary.increases} increases and {researchSummary.decreases} decreases. The mean absolute change was {researchSummary.meanAbsoluteChangePct.toFixed(2)}% per adjustment. This average uses the size of each change, so increases and decreases do not cancel each other out.</p>
        <p className="mt-3 text-xs leading-relaxed text-subtle">Source: <a href={researchCapture.sourceUrl} className="text-highlight underline">{researchCapture.sourcePublisher}</a>, captured <time dateTime={researchCapture.capturedAt}>{dateLong(researchCapture.capturedAt)}</time>. These observations cover a fixed historical window, not a live feed. No independent check against a Bitcoin node is documented.</p>
        <h3 className="mt-6 font-semibold">What this tells us about forecasts</h3>
        <p className="mt-3 text-sm leading-relaxed text-subtle">The changes describe what happened in this sample. They do not measure forecast accuracy or show what the next adjustment will be. Assessing a forecast requires a record made before the outcome. The forecast archive has no published predictions.</p>
        <div className="mt-5 flex flex-col items-start gap-2 text-sm font-semibold text-highlight"><Link href="/api/v3/research/v1/report" className="inline-flex min-h-11 items-center hover:underline">Read the public report →</Link><Link href="/api/v3/research/v1/dataset?format=csv" className="inline-flex min-h-11 items-center hover:underline">Inspect the public CSV →</Link><Link href="/data#prospective-archive" className="inline-flex min-h-11 items-center hover:underline">Check the forecast archive status →</Link></div>
        <p className="mt-6 border-t border-white/10 pt-4 text-xs leading-relaxed text-subtle">This sample has no active unsubscribe link. A live service would let you manage preferences and unsubscribe. Research commentary is separate from a trading decision.</p>
      </article>
      <section id="signup" aria-labelledby="preferences-title" className="scroll-mt-28"><h2 id="preferences-title" className="text-2xl font-bold">Preview your email preferences.</h2><NewsletterForm /></section>
    </div>
    <section className="mt-12 max-w-2xl border-t border-white/10 pt-7" aria-label="Requested research formats"><NewsletterDelivery kind="report" /><p className="mt-5 text-sm leading-relaxed text-subtle">No email needed: <Link href="/api/v3/research/v1/report" className="text-highlight underline">read the report</Link> or <Link href="/api/v3/research/v1/dataset?format=csv" className="text-highlight underline">download the dataset</Link> directly.</p></section>
  </Container>
}

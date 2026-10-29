import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { seo } from '@/lib/seo'
import { Arrow } from './Arrow'

export const metadata = seo({ title: 'Learn Bitcoin mining economics', description: 'Understand difficulty, reproduce a BTC production example and test the assumptions with your own inputs.', path: '/learn' })

export default function V3Learn() {
  return <Container className="py-12 sm:py-16">
    <p className="text-xs font-semibold uppercase tracking-wider text-highlight">Learn</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">Understand the method.<br />Reproduce the result.</h1>
    <p className="mt-5 max-w-2xl text-lg leading-relaxed text-subtle">Learn how difficulty affects expected BTC production, work through the arithmetic, then compare your own assumptions. These educational examples describe production, not trading returns.</p>
    <section className="mt-10 rounded-panel border border-white/10 bg-surface/30 p-6 sm:p-9" aria-labelledby="learning-example-title">
      <p className="text-xs uppercase tracking-wider text-subtle">Worked tutorial · four steps</p><h2 id="learning-example-title" className="mt-3 text-2xl font-bold">Measure a fleet’s difficulty exposure.</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-subtle">Start with a 1 EH/s illustrative fleet. Hold time, fees and the block reward constant, change difficulty, and verify the resulting BTC production difference. Replay the same inputs in the calculator.</p><Link href="/learn/difficulty-exposure" data-v3-cta="tutorial" data-v3-placement="contextual" className="mt-5 inline-flex min-h-11 items-center gap-3 font-semibold text-highlight">Start the walkthrough <Arrow /></Link>
    </section>
    <section className="mt-10 grid gap-5 md:grid-cols-3" aria-label="Continue learning">
      {[
        { title: 'Build the fundamentals', description: 'Read about mining difficulty, hashprice and uncertainty.', href: '/academy' },
        { title: 'Look up a term', description: 'Use short definitions and follow links to related methods.', href: '/glossary' },
        { title: 'Check a forecast’s evidence', description: 'Inspect a worked evaluation and reproduce its error calculation.', href: '/research/evaluating-a-forecast' },
      ].map(item => <Link key={item.href} href={item.href} className="rounded-panel border border-white/10 p-6 hover:border-brand/40"><h2 className="text-lg font-semibold">{item.title} →</h2><p className="mt-3 text-sm leading-relaxed text-subtle">{item.description}</p></Link>)}
    </section>
    <div className="mt-8 flex flex-wrap gap-x-7 text-sm font-semibold text-highlight"><Link href="/tools" className="inline-flex min-h-11 items-center gap-2">Use your own inputs <Arrow /></Link><Link href="/resources" className="inline-flex min-h-11 items-center gap-2">Browse the reference library <Arrow /></Link></div>
  </Container>
}

import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import PublicMinersPlanner from './PublicMinersPlanner'

export const metadata = seo({ title: 'Bitcoin difficulty planning for mining operators', description: 'Estimate your fleet’s BTC production, compare a live difficulty market and review the position in the Doefin app.', path: '/v3/for/miners' })

export default function MinersPage() {
  return <Container className="py-6 sm:py-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><Link href="/v3#who-its-for" className="inline-flex min-h-10 items-center text-xs font-semibold text-subtle hover:text-body">← For mining operators</Link><Link href="/v3/docs/what-doefin-settles-on" className="inline-flex min-h-10 items-center text-xs font-semibold text-highlight hover:underline">How difficulty contracts work ↗</Link></div>
    <div className="mt-4 flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Plan your production.</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle sm:text-base">Estimate your Bitcoin production from your hashrate and compare different difficulty scenarios. Then explore how a Doefin position could offset part of that exposure.</p></div></div>
    <PublicMinersPlanner />
    <div className="mt-8 grid gap-5 border-t border-white/10 py-6 text-xs leading-relaxed text-subtle md:grid-cols-3"><p><strong className="mb-1 block text-sm text-body">A contract, not a production guarantee.</strong>Difficulty is observed once, at one block. Your uptime, energy costs and BTC price are separate risks.</p><p><strong className="mb-1 block text-sm text-body">Payout is different from profit.</strong>Position cost, fees and collateral risks affect the result. <Link href="/v3/docs/how-settlement-works" className="text-highlight underline">Understand settlement ↗</Link></p><div><strong className="mb-1 block text-sm text-body">Have a fleet-specific question?</strong><a href={`mailto:${site.contactEmail}?subject=Doefin%20for%20mining%20operators`} className="inline-flex min-h-8 items-center text-highlight hover:underline">Contact the team ↗</a><br /><Link href="/v3/tools/difficulty-exposure" className="inline-flex min-h-8 items-center text-highlight hover:underline">Compare more production scenarios →</Link></div></div>
  </Container>
}

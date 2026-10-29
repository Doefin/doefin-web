import { getV3Editorial } from '@/content'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import { BrandIcon } from './BrandIcon'

/** Concrete entry points put the library on the visitor's path. */
export async function HomeResources() {
  const featured = await getV3Editorial('blog', 'reading-a-hashrate-chart-honestly')
  return <>
    <div className="v37-section-top" data-reveal>
      <div><p className="v37-eyebrow">Tools and learning</p><h2 id="learning-title" className="v37-heading">Tools and reading<br />you can use.</h2></div>
      <Link href="/resources" data-v3-cta="resources" data-v3-placement="resources" className="v37-link">Browse all resources <Arrow /></Link>
    </div>
    <div className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
      {[
        { type: 'Walkthrough', icon: 'threshold' as const, title: 'Work through difficulty exposure', description: 'Connect a change in difficulty to expected production, one step at a time.', href: '/learn/difficulty-exposure', action: 'Follow the worked example', cta: 'tutorial' },
        { type: 'Hosting calculator', icon: 'block' as const, title: 'Compare hosting costs', description: 'Bring fees, downtime and curtailment into an effective hosting rate.', href: '/tools/hosting-effective-rate', action: 'Explore hosting assumptions', cta: 'hosting' },
        { type: 'Payback calculator', icon: 'mining' as const, title: 'Compare fleet payback', description: 'Explore simplified cash flows across difficulty, power and fleet assumptions.', href: '/tools/fleet-payback', action: 'Explore payback assumptions', cta: 'payback' },
      ].map(item => <Link key={item.href} href={item.href} data-v3-cta={item.cta} data-v3-placement="resources" className="group flex flex-col rounded-panel border border-white/10 bg-surface/40 p-5 transition-colors hover:border-brand/50 hover:bg-surface/70 md:p-6">
        <div className="flex items-center gap-3 text-highlight"><BrandIcon name={item.icon} /><span className="text-xs font-semibold uppercase tracking-[0.1em]">{item.type}</span></div>
        <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold leading-snug tracking-tight text-body group-hover:text-highlight md:mt-5 md:text-xl">{item.title}<Arrow className="mt-1 text-highlight md:hidden" /></h3>
        <p className="mt-2 text-sm leading-relaxed text-subtle md:mb-5 md:mt-3">{item.description}</p>
        <span className="mt-auto hidden min-h-11 items-center justify-between gap-3 text-sm font-semibold text-highlight md:inline-flex">{item.action} <Arrow /></span>
      </Link>)}
    </div>
    <p className="mt-5 max-w-3xl text-sm leading-relaxed text-subtle" data-reveal><Link href="/research/observed-difficulty-adjustments" className="font-semibold text-highlight underline underline-offset-4">Inspect 25 observed difficulty adjustments →</Link> Sourced historical findings, public CSV and citation metadata. These network observations are separate from the site’s synthetic forecast examples.</p>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/10 pt-4" data-reveal>
      <p className="max-w-xl text-xs leading-relaxed text-subtle">Calculators explore assumptions. They do not forecast difficulty or determine a suitable position size. Hosting-bill comparison is a separate question from production exposure; a business may operate owned and hosted fleets.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Link href={featured ? '/blog/' + featured.slug : '/blog'} className="v37-link">{featured ? 'Read a hashrate chart honestly' : 'Browse mining articles'} <Arrow /></Link>
        <Link href="/for/institutions" data-v3-cta="institutions" data-v3-placement="resources" className="v37-link">For funds &amp; desks <Arrow /></Link>
      </div>
    </div>
  </>
}

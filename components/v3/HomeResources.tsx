import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import { BrandIcon } from './BrandIcon'

/** Concrete entry points put the library on the visitor's path. */
export function HomeResources() {
  return <>
    <div className="v37-section-top" data-reveal>
      <div><p className="v37-eyebrow">Tools and learning</p><h2 id="learning-title" className="v37-heading">Tools and reading<br />you can use.</h2></div>
      <Link href="/v3/resources" className="v37-link">Browse all resources <Arrow /></Link>
    </div>
    <div className="mt-7 grid gap-4 md:grid-cols-3" data-reveal>
      {[
        { type: 'Calculator', icon: 'threshold' as const, title: 'Calculate difficulty exposure', description: 'Compare expected BTC production across your own difficulty scenarios.', href: '/v3/tools/difficulty-exposure', action: 'Use the calculator' },
        { type: 'Academy', icon: 'block' as const, title: 'Understand difficulty adjustment', description: 'Start with how the network adjusts and why it affects production.', href: '/v3/academy/how-difficulty-adjustment-works', action: 'Read the guide' },
        { type: 'Glossary', icon: 'mining' as const, title: 'Look up a mining term', description: 'Find short definitions of difficulty, hashprice, epochs and more.', href: '/v3/glossary', action: 'Open the glossary' },
      ].map(item => <Link key={item.href} href={item.href} className="group flex flex-col rounded-panel border border-white/10 bg-surface/40 p-5 transition-colors hover:border-brand/50 hover:bg-surface/70 md:p-6">
        <div className="flex items-center gap-3 text-highlight"><BrandIcon name={item.icon} /><span className="text-xs font-semibold uppercase tracking-[0.1em]">{item.type}</span></div>
        <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold leading-snug tracking-tight text-body group-hover:text-highlight md:mt-5 md:text-xl">{item.title}<Arrow className="mt-1 text-highlight md:hidden" /></h3>
        <p className="mt-2 text-sm leading-relaxed text-subtle md:mb-5 md:mt-3">{item.description}</p>
        <span className="mt-auto hidden min-h-11 items-center justify-between gap-3 text-sm font-semibold text-highlight md:inline-flex">{item.action} <Arrow /></span>
      </Link>)}
    </div>
    <div className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t border-white/10 pt-4" data-reveal>
      <p className="max-w-xl text-xs leading-relaxed text-subtle">Calculators explore assumptions. They do not forecast difficulty or determine a suitable position size.</p>
      <div className="flex flex-wrap gap-x-6 gap-y-1">
        <Link href="/v3/blog" className="v37-link">Read the articles <Arrow /></Link>
        <Link href="/v3/research" className="v37-link">Research examples <Arrow /></Link>
      </div>
    </div>
  </>
}

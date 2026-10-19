import Link from '@/components/routing/SiteLink'
import { epochs } from '@/content'
import { seo } from '@/lib/seo'
import { ContentPage } from './ContentPage'

export const metadata = seo({ title: 'Bitcoin difficulty data: worked examples', description: 'Learn to read difficulty forecasts, hashrate estimates and dated records using clearly labelled examples.', path: '/v3/data' })

export default function V3DataIndex() {
  return <ContentPage title="Read the number in context." summary="Difficulty, hashrate and forecast error describe different things. These examples show how to read them; they are not current network data." eyebrow="Data examples" crumbs={[{ name: 'Data', href: '/v3/data' }]}>
    <div className="divide-y divide-white/10 border-y border-white/10">{[
      ['Difficulty forecast example', 'Separate the observed level, projected change and uncertainty range.', '/v3/data/difficulty'],
      ['Hashrate estimate example', 'Understand why an inferred network rate depends on the observation window.', '/v3/data/hashrate'],
      ['Accuracy calculation', 'Reproduce a synthetic error calculation and see what a comparison requires.', '/v3/data/scoreboard'],
    ].map(([label, description, href]) => <Link key={href} href={href} className="group block py-6"><h2 className="text-xl font-bold group-hover:text-highlight">{label} →</h2><p className="mt-3 text-sm leading-relaxed text-subtle">{description}</p></Link>)}</div>
    <section className="mt-10"><h2 className="text-2xl font-bold">Dated record examples</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">These sample pages show how a forecast and an outcome could be recorded together. Their heights, dates and values belong to authored examples; they are not an observed history or an immutable archive.</p><ul className="mt-5 space-y-3">{epochs.map(epoch => <li key={epoch.height}><Link href={'/v3/data/difficulty/epoch/' + epoch.height} className="text-sm font-semibold text-highlight hover:underline">Inspect sample record {epoch.height.toLocaleString('en-US')} →</Link></li>)}</ul></section>
  </ContentPage>
}

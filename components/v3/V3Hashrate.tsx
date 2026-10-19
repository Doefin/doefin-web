import { hashrate } from '@/content'
import { DataTable } from '@/components/ui'
import { seo } from '@/lib/seo'
import { ContentLinks, ContentPage } from './ContentPage'

export const metadata = seo({ title: 'Understanding network hashrate estimates', description: 'Read an inferred hashrate estimate and its observation window using a clearly labelled synthetic example.', path: '/v3/data/hashrate' })

export default function V3Hashrate() {
  return <ContentPage title="Hashrate is an estimate." summary="Network hashrate is inferred from mining difficulty and observed block timing. The observation window affects the result." eyebrow="Synthetic data example" crumbs={[{ name: 'Data', href: '/v3/data' }, { name: 'Hashrate example', href: '/v3/data/hashrate' }]}>
    <p className="text-sm font-semibold leading-relaxed text-caution">Illustrative only · sample reference date: 24 August 2026. This page does not report current network hashrate.</p>
    <div className="mt-6"><DataTable caption="Synthetic hashrate example · 24 August 2026 · EH/s = exahashes per second" head={['Field', 'Sample value']} rows={[
      ['Inferred hashrate', `${hashrate.currentEH.toLocaleString('en-US')} EH/s`],
      ['Reference block in the example', hashrate.asOfHeight.toLocaleString('en-US')],
      ['Measured uncertainty', 'Not available for this synthetic value'],
    ]} /></div>
    <section className="mt-9"><h2 className="text-2xl font-bold">Check the window before comparing</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">Blocks arrive irregularly. A short observation window can produce a different estimate from a longer one even without a corresponding change in the fleet of mining machines. Compare estimates that use the same definition and window.</p></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">Ask for the uncertainty method</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">An error band needs a stated method and assumptions. This page publishes no calibrated confidence interval and makes no claim about whether a recent network move is signal or noise.</p></section>
    <ContentLinks links={[{ href: '/v3/data/difficulty', label: 'Read the difficulty example' }, { href: '/v3/methodology/difficulty-index', label: 'Review inputs and uncertainty' }, { href: '/v3/tools/difficulty-exposure', label: 'Use your fleet’s hashrate in a scenario' }]} />
  </ContentPage>
}

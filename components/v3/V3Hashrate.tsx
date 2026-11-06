import { getCurrentHashrate } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { HashrateReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Understanding network hashrate estimates', description: 'Compare current hashrate estimates and check when their source was updated. A separate example explains how the values can move.', path: '/data/hashrate' })
export const dynamic = 'force-dynamic'

export default async function V3Hashrate() {
  const result = await getCurrentHashrate()
  return <DataDetail title="Hashrate is estimated, not counted." summary="Compare estimates over different block windows and see when the source was updated. The example chart is separate from these readings." category="Hashrate" current="hashrate" crumbs={[{ name: 'Hashrate', href: '/data/hashrate' }]} datasetNotice={<><strong className="font-semibold text-highlight">Current API reading.</strong> The panel uses the current response. The chart below is a separate example made with synthetic values.</>}>
    <HashrateReadingPanel result={result} />
    <DataSection title="Why the averaging window matters." description="The API estimates hashrate over recent blocks and reports it in hashes per second. It supplies no forecast ranges or hashrate records for each difficulty adjustment.">
      <p className={dataCopy}>A longer window smooths short-term variation. Each of the 120-, 144- and 2,016-block estimates is a separate source value. The gap between them is not a forecast range.</p>
    </DataSection>
    <DataSection title="Hashrate implied by example difficulty." eyebrow="Teaching illustration" description="The chart converts example difficulty into hashrate using the ten-minute block target. Its values are not current network history or API observations.">
      <DataSeries metric="hashrateEH" />
    </DataSection>
    <DataNext items={[{ href: '/data/difficulty', label: 'Read difficulty estimates', note: 'Inspect the current point estimate and its limitations.' }, { href: '/methodology/difficulty-index', label: 'Inspect the methodology', note: 'See which inputs a forecast uses and how it is calculated.' }]} />
  </DataDetail>
}

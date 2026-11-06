import { getCurrentHashrate } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { HashrateReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Understanding network hashrate estimates', description: 'Compare current hashrate estimates and check when their source was updated. A separate example explains how the values can move.', path: '/data/hashrate' })
export const dynamic = 'force-dynamic'

export default async function V3Hashrate() {
  const result = await getCurrentHashrate()
  return <DataDetail title="Hashrate is estimated, not counted." summary="Compare the rolling estimates and check their timestamp. The example series below is separate from the current data." category="Hashrate" current="hashrate" crumbs={[{ name: 'Hashrate', href: '/data/hashrate' }]} datasetNotice={<><strong className="font-semibold text-highlight">Live backend reading.</strong> The panel uses the current API response. The series below uses made-up values as a separate teaching example.</>}>
    <HashrateReadingPanel result={result} />
    <DataSection title="What a hashrate window means." description="The backend publishes rolling estimates in hashes per second. It does not publish forecast intervals or hashrate records for each difficulty adjustment.">
      <p className={dataCopy}>A longer averaging window smooths short-term variation. The 120-, 144- and 2,016-block windows are separate source values; no range is inferred from them.</p>
    </DataSection>
    <DataSection title="A sequence of teaching examples." eyebrow="Teaching illustration" description="These example values show how a rate can move. They are not current network history or observations from the API.">
      <DataSeries metric="hashrateEH" />
    </DataSection>
    <DataNext items={[{ href: '/data/difficulty', label: 'Read difficulty estimates', note: 'Inspect the current point estimate and its limitations.' }, { href: '/methodology/difficulty-index', label: 'Inspect the methodology', note: 'Review the inputs and calculation context.' }]} />
  </DataDetail>
}

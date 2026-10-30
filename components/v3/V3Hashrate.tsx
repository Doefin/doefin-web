import { getCurrentHashrate } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { HashrateReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Understanding network hashrate estimates', description: 'Read current backend hashrate windows with their source timestamp and freshness, beside a separate synthetic teaching illustration.', path: '/data/hashrate' })
export const dynamic = 'force-dynamic'

export default async function V3Hashrate() {
  const result = await getCurrentHashrate()
  return <DataDetail title="Hashrate is inferred, not counted." summary="Read backend rolling windows and their timestamp, then separate them from an illustrative series." category="Hashrate" current="hashrate" crumbs={[{ name: 'Hashrate', href: '/data/hashrate' }]} datasetNotice={<><strong className="font-semibold text-highlight">Live backend reading.</strong> The panel uses the current API response. The series below is a separate synthetic illustration.</>}>
    <HashrateReadingPanel result={result} />
    <DataSection title="What a hashrate window means." description="The backend publishes rolling estimates in hashes per second. It does not publish forecast intervals or per-retarget hashrate records.">
      <p className={dataCopy}>A longer averaging window smooths short-term variation. The 120, 144 and 2016 block windows are separate source values; no range is inferred from them.</p>
    </DataSection>
    <DataSection title="A synthetic sequence for learning." eyebrow="Teaching illustration" description="This authored series illustrates how a rate can move. It is not current network history or a backend observation.">
      <DataSeries metric="hashrateEH" />
    </DataSection>
    <DataNext items={[{ href: '/data/difficulty', label: 'Read difficulty estimates', note: 'Inspect the current point estimate and its limitations.' }, { href: '/methodology/difficulty-index', label: 'Inspect the methodology', note: 'Review the inputs and calculation context.' }]} />
  </DataDetail>
}

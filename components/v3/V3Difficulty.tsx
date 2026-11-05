import { getDifficultyAnalytics } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { DifficultyReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Reading Bitcoin difficulty estimates', description: 'Check the current difficulty estimate, understand its limits and compare it with clearly labelled teaching examples.', path: '/data/difficulty' })
export const dynamic = 'force-dynamic'

export default async function V3Difficulty() {
  const result = await getDifficultyAnalytics()
  return <DataDetail title="Reading Bitcoin difficulty estimates." summary="Check where the current estimate comes from and what it tells you. The teaching examples below are separate." category="Difficulty" current="difficulty" crumbs={[{ name: 'Difficulty', href: '/data/difficulty' }]} datasetNotice={<><strong className="font-semibold text-highlight">Live backend reading.</strong> The panel uses the current API response. The series below uses made-up values as a separate teaching example.</>}>
    <DifficultyReadingPanel result={result} detail />
    <DataSection id="observation-context" title="Check the estimate and its source." description="These values come from the analytics API. It provides no forecast range or fixed record for each difficulty adjustment.">
      <p className={dataCopy}>The panel shows current difficulty and the API’s estimate for the next adjustment. The relative change is converted to a percentage. No forecast range is shown because the API supplies no lower or upper limit.</p>
    </DataSection>
    <DataSection title="A sequence of teaching examples." eyebrow="Teaching illustration" description="These values were created for the example. They are not current network history or a record of measured forecasts.">
      <DataSeries metric="difficultyT" />
    </DataSection>
    <DataSection id="records" title="Published forecast records are unavailable." description="The API does not provide timestamped forecast records with their ranges and outcomes. Dated teaching examples cannot replace those records."><p className={dataCopy}>There is no separate page for an adjustment without a source record.</p></DataSection>
    <DataNext items={[{ href: '/methodology/difficulty-index', label: 'Inspect the methodology', note: 'The inputs, calculation and evidence a reproducible forecast needs.' }, { href: '/tools/difficulty-exposure', label: 'Estimate BTC production', note: 'Use your own fleet and difficulty scenarios.' }]} />
  </DataDetail>
}

import { getDifficultyAnalytics } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { DifficultyReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Reading Bitcoin difficulty estimates', description: 'Check the current difficulty estimate, understand its limits and compare it with clearly labelled teaching examples.', path: '/data/difficulty' })
export const dynamic = 'force-dynamic'

export default async function V3Difficulty() {
  const result = await getDifficultyAnalytics()
  return <DataDetail title="What does the difficulty estimate mean?" summary="See the current difficulty and the estimated next adjustment, then learn what the API can and cannot tell you." category="Difficulty" current="difficulty" crumbs={[{ name: 'Difficulty', href: '/data/difficulty' }]} datasetNotice={<><strong className="font-semibold text-highlight">Current API reading.</strong> The panel uses the current response. The chart below is a separate example made with synthetic values.</>}>
    <DifficultyReadingPanel result={result} detail />
    <DataSection id="observation-context" title="An estimate without a forecast range." description="The analytics API supplies the values above. It does not publish a lower and upper forecast limit or a saved record for each adjustment.">
      <p className={dataCopy}>The percentage change shows how far the estimated next difficulty is above or below the current level. It is converted from the ratio returned by the API.</p>
    </DataSection>
    <DataSection title="How difficulty changes in steps." eyebrow="Teaching illustration" description="The chart illustrates step changes using made-up values. It is not current network history or a record of measured forecasts.">
      <DataSeries metric="difficultyT" />
    </DataSection>
    <DataSection id="records" title="Why there is no forecast history." description="The API does not provide timestamped forecast records with their ranges and outcomes. Dated teaching examples cannot replace those records."><p className={dataCopy}>A page for an individual adjustment needs its original forecast record.</p></DataSection>
    <DataNext items={[{ href: '/methodology/difficulty-index', label: 'Inspect the methodology', note: 'The inputs and calculation needed to repeat a forecast and assess its range.' }, { href: '/tools/difficulty-exposure', label: 'Estimate BTC production', note: 'Use your own fleet and difficulty scenarios.' }]} />
  </DataDetail>
}

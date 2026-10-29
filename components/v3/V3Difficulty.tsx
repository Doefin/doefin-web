import { getDifficultyAnalytics } from '@/lib/bitcoin-analytics'
import { seo } from '@/lib/seo'
import { DifficultyReadingPanel } from './data-reading'
import { DataDetail, DataNext, DataSection, DataSeries, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'Reading Bitcoin difficulty estimates', description: 'Read the current backend difficulty point estimate and its source limitations beside clearly labelled synthetic teaching examples.', path: '/v3/data/difficulty' })
export const dynamic = 'force-dynamic'

export default async function V3Difficulty() {
  const result = await getDifficultyAnalytics()
  return <DataDetail title="Reading Bitcoin difficulty estimates." summary="Inspect the backend point estimate and its source context, then distinguish it from the authored teaching examples." category="Difficulty" current="difficulty" crumbs={[{ name: 'Difficulty', href: '/v3/data/difficulty' }]} datasetNotice={<><strong className="font-semibold text-highlight">Live backend reading.</strong> The panel uses the current API response. Any authored series below is a separate synthetic illustration.</>}>
    <DifficultyReadingPanel result={result} detail />
    <DataSection id="observation-context" title="Read the point estimate with its source context." description="These values come from the backend analytics response. Its contract does not publish a forecast interval or an immutable record of each difficulty adjustment.">
      <p className={dataCopy}>The current difficulty and next-adjustment point estimate describe the API response. The percentage is the backend’s relative change converted to percent. A range is unavailable because the endpoint does not publish interval endpoints.</p>
    </DataSection>
    <DataSection title="A synthetic sequence for learning." eyebrow="Teaching illustration" description="The separate authored series is an illustration, not current network history or a measured forecast archive.">
      <DataSeries metric="difficultyT" />
    </DataSection>
    <DataSection id="records" title="Published forecast records are unavailable." description="The current backend contract has no endpoint for timestamped forecast records, ranges and outcomes. Synthetic dated examples are not published records."><p className={dataCopy}>No page per difficulty adjustment is published without a backend record.</p></DataSection>
    <DataNext items={[{ href: '/v3/methodology/difficulty-index', label: 'Inspect the methodology', note: 'The inputs, calculation and evidence a reproducible forecast needs.' }, { href: '/v3/tools/difficulty-exposure', label: 'Estimate BTC production', note: 'Use your own fleet and difficulty scenarios.' }]} />
  </DataDetail>
}

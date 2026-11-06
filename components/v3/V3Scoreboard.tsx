import Link from '@/components/routing/SiteLink'
import { scoreboard } from '@/content'
import { seo } from '@/lib/seo'
import { IllustrativeComparison } from './IllustrativeComparison'
import { ResearchArchiveSummary } from './ResearchArchiveSummary'
import { DataDetail, DataNext, DataSection, dataCopy } from './DataDetail'

export const metadata = seo({ title: 'How to read forecast accuracy metrics', description: 'Follow one fictional model comparison from a forecast error to average error, range coverage and width, then inspect the evidence a measured comparison needs.', path: '/data/scoreboard' })

export default function V3Scoreboard() {
  return <DataDetail title="What does forecast accuracy tell you?" summary="Read average error alongside forecast ranges and sample size. Follow the same fictional models from one forecast to their summary scores." category="Accuracy" current="scoreboard" datasetNotice={<><strong className="font-semibold text-caution">Illustrative: synthetic forecasts and outcomes.</strong> The examples below use made-up values. They do not measure any provider’s performance.</>} crumbs={[{ name: 'Accuracy metrics', href: '/data/scoreboard' }]}>
    <IllustrativeComparison />

    <DataSection title="What a measured comparison needs.">
      <p className={dataCopy}>The site has no measured provider comparison: <span className="tabular">{scoreboard.epochsScored}</span> observed adjustment periods scored. Provider errors and range coverage are unavailable.</p>
      <p className={'mt-4 ' + dataCopy}><Link href="/research/observed-difficulty-adjustments" className="font-semibold text-highlight underline">Historical network observations</Link> record what happened. They do not supply the forecasts needed to calculate forecast errors.</p>
      <p className={'mt-4 ' + dataCopy}>Compare the same target and outcome definition at similar lead times. Later forecasts can use information unavailable to earlier ones.</p>
      <p className={'mt-4 ' + dataCopy}>Keep the original timestamped forecasts, source inputs and method versions. State the evaluated dates, scored count, missing forecasts and exclusion rules, including large misses.</p>
      <p className={'mt-4 ' + dataCopy}>A small or selected sample may not represent future conditions. Measured errors cannot guarantee the next forecast, a trading result or production at your fleet.</p>
    </DataSection>
    <ResearchArchiveSummary compact />
    <DataNext items={[{ href: '/research/difficulty-forecast-accuracy-2026', label: 'Read the comparison guide', note: 'Evaluate the assumptions and evidence behind a forecast claim.' }, { href: '/research/evaluating-a-forecast', label: 'Try the optional arithmetic exercise', note: 'Practise average error with five separate synthetic pairs and download their CSV. This exercise has no forecast ranges.' }, { href: '/methodology/difficulty-index', label: 'Assess a forecast method', note: 'See how block pace informs an estimate and what supports its range.' }, { href: '/data', label: 'Return to the data field guide', note: 'Current estimates, historical network changes and dated examples, explained.' }]} />
  </DataDetail>
}

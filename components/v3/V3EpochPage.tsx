import { notFound } from 'next/navigation'
import { epochs } from '@/content'
import { DataTable } from '@/components/ui'
import { seo } from '@/lib/seo'
import { ContentLinks, ContentPage } from './ContentPage'

const findEpoch = (height: string) => epochs.find(epoch => String(epoch.height) === height)
export const generateStaticParams = () => epochs.map(epoch => ({ height: String(epoch.height) }))
export async function generateMetadata({ params }: { params: Promise<{ height: string }> }) {
  const epoch = findEpoch((await params).height)
  return epoch ? seo({ title: `Sample difficulty record: ${epoch.height}`, description: 'An authored example of a dated forecast record. Values and outcomes are synthetic, not a historical accuracy claim.', path: '/v3/data/difficulty/epoch/' + epoch.height }) : {}
}

export default async function V3EpochPage({ params }: { params: Promise<{ height: string }> }) {
  const epoch = findEpoch((await params).height)
  if (!epoch) notFound()
  const settled = epoch.realisedPct !== undefined
  const error = settled ? Math.abs(epoch.realisedPct! - epoch.forecastPct) : undefined
  return <ContentPage title={`Sample record: block ${epoch.height.toLocaleString('en-US')}`} summary="An example of recording a forecast and an outcome separately. The dates, heights and figures here are synthetic." eyebrow="Dated record example" crumbs={[{ name: 'Data', href: '/v3/data' }, { name: 'Difficulty', href: '/v3/data/difficulty' }, { name: 'Sample record', href: '/v3/data/difficulty/epoch/' + epoch.height }]}>
    <DataTable caption={`Synthetic record · sample reference date ${epoch.startedAt} · changes in %, errors in percentage points`} head={['Field', 'Example value']} rows={[
      ['Target block', epoch.height.toLocaleString('en-US')],
      ['Forecast reference date', epoch.startedAt],
      ['Projected change', `${epoch.forecastPct.toFixed(2)}%`],
      ['Authored range (uncalibrated)', `${epoch.band95[0].toFixed(1)}% to ${epoch.band95[1].toFixed(1)}%`],
      ['Example outcome date', epoch.settledAt ?? 'No outcome included'],
      ['Example outcome', settled ? `${epoch.realisedPct!.toFixed(2)}%` : 'No outcome included'],
      ['Absolute error in this example', error !== undefined ? `${error.toFixed(2)} pp` : 'Not calculated without an outcome'],
    ]} />
    <section className="mt-9"><h2 className="text-2xl font-bold">What a measured record would need</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">A historical record needs the original forecast capture, input data, observation timestamps, method version and a verifiable network outcome. This authored example supplies none of that historical evidence. Its error calculation shows arithmetic only.</p></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">Corrections and revisions</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">These are editable example pages. They do not implement or promise an immutable archive. A measured publication should identify revisions and preserve enough source evidence for readers to reproduce earlier results.</p></section>
    <ContentLinks links={[{ href: '/v3/data/difficulty', label: 'Return to the difficulty example' }, { href: '/v3/data/scoreboard', label: 'Understand error measurement' }, { href: '/v3/methodology/difficulty-index', label: 'Review the methodology checklist' }]} />
  </ContentPage>
}

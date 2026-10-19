import { seo } from '@/lib/seo'
import { ContentLinks, ContentPage } from './ContentPage'
import { SampleEvidence } from './SampleEvidence'

export const metadata = seo({ title: 'Forecast accuracy: a sample comparison', description: 'Reproduce error calculations on synthetic data and learn what a measured forecast scoreboard needs.', path: '/v3/data/scoreboard' })

export default function V3Scoreboard() {
  return <ContentPage title="Understand forecast accuracy." summary="An inspectable example of error measurement. A measured comparison of Doefin and other forecasters is not available here." eyebrow="Accuracy example" crumbs={[{ name: 'Data', href: '/v3/data' }, { name: 'Accuracy example', href: '/v3/data/scoreboard' }]}>
    <SampleEvidence />
    <section className="mt-10"><h2 className="text-2xl font-bold">What a comparison must include</h2><ul className="mt-5 list-disc space-y-3 pl-5 text-[16px] leading-relaxed text-subtle">
      <li>The same observation targets and forecast lead times for each estimator.</li>
      <li>Time-stamped forecast captures, source data and a reproducible outcome definition.</li>
      <li>The evaluation window, observation count and missing forecasts.</li>
      <li>Average error, alongside interval coverage and width when an estimator publishes intervals.</li>
    </ul></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">What is not established</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">This example does not rank providers or show a track record. It contains no measured interval calibration. A synthetic average error cannot establish an accuracy advantage or a likely trading result.</p></section>
    <ContentLinks links={[{ href: '/v3/research/difficulty-forecast-accuracy-2026', label: 'Read the forecast-comparison guide' }, { href: '/v3/methodology/difficulty-index', label: 'Inspect the methodology checklist' }]} />
  </ContentPage>
}

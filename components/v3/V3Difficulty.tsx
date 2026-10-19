import Link from '@/components/routing/SiteLink'
import { difficulty, epochs } from '@/content'
import { DataTable } from '@/components/ui'
import { seo } from '@/lib/seo'
import { ContentLinks, ContentPage } from './ContentPage'

export const metadata = seo({ title: 'Reading a Bitcoin difficulty forecast', description: 'A synthetic example showing a difficulty level, projected change and uncalibrated range.', path: '/v3/data/difficulty' })

export default function V3Difficulty() {
  return <ContentPage title="Read a difficulty forecast." summary="Distinguish the observed difficulty, a projected adjustment and the uncertainty around that projection." eyebrow="Synthetic data example" crumbs={[{ name: 'Data', href: '/v3/data' }, { name: 'Difficulty example', href: '/v3/data/difficulty' }]}>
    <p className="text-sm font-semibold leading-relaxed text-caution">Illustrative only · sample reference date: 24 August 2026. These values were authored for the website; they are not a current forecast.</p>
    <div className="mt-6"><DataTable caption="Synthetic difficulty example · 24 August 2026 · T = trillion, change in %" head={['Field', 'Sample value', 'How to read it']} rows={[
      ['Starting difficulty', `${difficulty.currentT.toFixed(2)} T`, 'The level from which the example projects a change.'],
      ['Projected adjustment', `${difficulty.changePct.toFixed(2)}%`, 'A hypothetical change, not an observed outcome.'],
      ['Example range', `${difficulty.band95[0].toFixed(1)}% to ${difficulty.band95[1].toFixed(1)}%`, 'An authored range with no measured coverage or confidence level.'],
      ['Target block', difficulty.nextRetargetHeight.toLocaleString('en-US'), 'The observation target used by this example.'],
    ]} /></div>
    <section className="mt-9"><h2 className="text-2xl font-bold">Ask how the range was established</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">A forecast extrapolates from information available at a particular time. Changing block pace can change that projection. An interval requires an explicit method and evaluation; its endpoints alone do not establish the chance of an outcome.</p></section>
    <section className="mt-9"><h2 className="text-2xl font-bold">Inspect an example record</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">A useful record separates the forecast issued at a known time from the later outcome. These pages demonstrate that structure with sample data.</p><ul className="mt-5 space-y-3">{epochs.map(epoch => <li key={epoch.height}><Link href={'/v3/data/difficulty/epoch/' + epoch.height} className="text-sm font-semibold text-highlight hover:underline">Sample record {epoch.height.toLocaleString('en-US')} →</Link></li>)}</ul></section>
    <ContentLinks links={[{ href: '/v3/methodology/difficulty-index', label: 'Review the methodology checklist' }, { href: '/v3/data/scoreboard', label: 'Compare forecasts and outcomes' }, { href: '/v3/tools/difficulty-exposure', label: 'Explore your own production assumptions' }]} />
  </ContentPage>
}

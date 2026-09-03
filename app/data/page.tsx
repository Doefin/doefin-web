import Link from 'next/link'
import { IllustrativeBadge } from '@/components/content/LiveBadge'
import { Container } from '@/components/layout/Container'
import { PageHeader, Panel, Stat } from '@/components/ui'
import { difficulty, hashrate, networkSeries } from '@/content'
import { int, pct, tera } from '@/lib/format'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'
import { NetworkChart, SeriesTable } from '@/components/data/NetworkChart'

export const metadata = seo({
  title: 'Bitcoin mining data',
  description:
    'Difficulty forecast with confidence intervals, network hashrate with error bars, and a public accuracy scoreboard. Free and open.',
  path: '/data',
})

export default function DataHub() {
  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumbs items={[{ name: 'Data', href: '/data' }]} />

        <PageHeader
          eyebrow="Data"
          title="Open Bitcoin mining data"
          lede="Free, keyless and reproducible. Every figure here is HTML text with its date and units, so machines can read it too."
        />
        <IllustrativeBadge isLive={difficulty.isLive} />
      </div>

      <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Current difficulty" value={tera(difficulty.currentT)} note={`block ${int(difficulty.asOfHeight)}`} />
        <Stat label="Next adjustment" value={pct(difficulty.changePct)} tone="up" note={`block ${int(difficulty.nextRetargetHeight)}`} />
        <Stat label="Network hashrate" value={`${int(hashrate.currentEH)} EH/s`} note={`±${hashrate.band7dPct}% over 7 days`} />
        <Stat label="Sign uncertainty" value={`${Math.round(difficulty.probSignWrong * 100)}%`} note="chance the direction is wrong" />
      </dl>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">The network, over the last year</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          Difficulty, implied hashrate and price across twenty-six retargets. Every point is a retarget. The same figures are in the table below the chart,
          so they can be read and quoted without running the page.
        </p>
        <div className="mt-6">
          <NetworkChart data={networkSeries} />
          <SeriesTable data={networkSeries} />
        </div>
      </section>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          { href: '/data/difficulty', title: 'Difficulty forecast', body: 'The current forecast, its fitted interval, and where the public estimators disagree.' },
          { href: '/data/scoreboard', title: 'Accuracy scoreboard', body: 'Every public estimator scored on realised error and calibration. We are listed first.' },
          { href: '/methodology/difficulty-index', title: 'Methodology', body: 'The arithmetic, the fit window, and the restatement log. Versioned.' },
        ].map((c) => (
          <Link key={c.href} href={c.href} className="group">
            <Panel className="h-full transition-colors group-hover:border-brand/40">
              <h2 className="text-lg font-bold tracking-[-0.015em]">{c.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.body}</p>
            </Panel>
          </Link>
        ))}
      </div>

      <NextLinks
        items={[
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

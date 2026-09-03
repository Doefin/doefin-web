import { IllustrativeBadge } from '@/components/content/LiveBadge'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, PageHeader } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { scoreboard } from '@/content'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Bitcoin difficulty forecast accuracy',
  description:
    'A public league table scoring every Bitcoin difficulty estimator on realised error and calibration — including our own.',
  path: '/data/scoreboard',
})

export default function ScoreboardPage() {
  return (
    <Container className="py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumbs items={[{ name: 'Data', href: '/data' }, { name: 'Accuracy scoreboard', href: '/data/scoreboard' }]} />

        <PageHeader
          eyebrow="Scoreboard"
          title="How accurate is every difficulty forecast?"
          lede="Each public estimator scored on what actually happened. We are listed first, and we publish our own losses."
        />
        <IllustrativeBadge isLive={scoreboard.isLive} />
      </div>

      <div className="mt-10">
        <DataTable
          caption={`Scoring begins with the first published epoch · ${scoreboard.epochsScored} epochs scored`}
          head={['Source', 'Mean absolute error', '95% band coverage', 'Note']}
          rows={scoreboard.rows.map((r) => [
            <span key={r.source} className={r.source === 'Doefin' ? 'font-bold text-body' : ''}>
              {r.source}
            </span>,
            <span key="mae" className="tabular">{r.mae ?? '—'}</span>,
            <span key="cov" className="tabular">{r.coverage ?? '—'}</span>,
            <span key="note" className="text-muted">{r.note}</span>,
          ])}
        />
      </div>

      <FAQ
        items={[
          {
            q: 'How is difficulty forecast accuracy measured?',
            a: 'Two ways. Mean absolute error is the average distance between a forecast and what actually happened. Coverage asks whether a stated 95% confidence interval genuinely contained the outcome about 95% of the time across many forecasts.',
          },
          {
            q: 'What is calibration and why does it matter?',
            a: 'Calibration is whether a stated confidence interval is honest. A forecaster can be accurate on average while quoting intervals far too narrow, which makes their numbers look more certain than the evidence supports. It can only be assessed over a run of forecasts, which is why a dated public archive matters more than any single prediction.',
          },
          {
            q: 'Why publish a scoreboard that grades your own forecasts?',
            a: 'Because a league table is only credible from someone willing to appear in it. No incumbent can publish one they are scored on, which is what makes this a position a competitor cannot copy — and it only works if we publish our own errors first.',
          },
        ]}
      />

      <div className="mt-8 max-w-prose space-y-4">
        <Callout tone="good" title="Why this is the asset">
          <p>
            No incumbent can credibly publish a league table they appear in. It is only believable
            from someone willing to publish their own errors first — which is what makes it a
            position no competitor can copy.
          </p>
        </Callout>
        <p className="text-[15px] leading-relaxed text-muted">
          Two measures matter. <strong className="text-body">Mean absolute error</strong> is how far
          off a forecast was on average.{' '}
          <strong className="text-body">Coverage</strong> asks whether a stated 95% band actually
          contained the outcome about 95% of the time — the claim almost nobody in this market makes
          about their own numbers.
        </p>
      </div>

      <NextLinks
        items={[
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

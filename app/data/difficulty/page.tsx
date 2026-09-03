import Link from 'next/link'
import { AsOf, IllustrativeBadge } from '@/components/content/LiveBadge'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, Eyebrow, Panel, Stat } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { difficulty, epochs, networkSeries } from '@/content'
import { int, pct, tera } from '@/lib/format'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'
import { NetworkChart, SeriesTable } from '@/components/data/NetworkChart'
import { EpochProgress } from '@/components/data/EpochProgress'

/**
 * The title carries the number and the block height. That is the difference
 * between winning a live-value query and not appearing at all.
 */
export const metadata = seo({
  absoluteTitle: true,
  title: `Bitcoin difficulty forecast ${pct(difficulty.changePct)} at block ${int(difficulty.nextRetargetHeight)}`,
  description: `Forecast ${pct(difficulty.changePct)} for the next Bitcoin difficulty adjustment at block ${int(difficulty.nextRetargetHeight)}, with a 95% interval of ${pct(difficulty.band95[0], 1)} to ${pct(difficulty.band95[1], 1)}.`,
  path: '/data/difficulty',
})

export default function DifficultyPage() {
  const progress = Math.round((difficulty.blocksObserved / difficulty.blocksInEpoch) * 100)

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Bitcoin difficulty forecast',
          description: 'Forward Bitcoin mining difficulty forecast with fitted confidence intervals.',
          url: `${site.url}/data/difficulty`,
          creator: { '@type': 'Organization', name: site.name },
          license: 'https://creativecommons.org/licenses/by/4.0/',
        })}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <Breadcrumbs items={[{ name: 'Data', href: '/data' }, { name: 'Difficulty forecast', href: '/data/difficulty' }]} />

        <div className="max-w-3xl">
          <Eyebrow>Difficulty forecast</Eyebrow>
          {/* Answer first: the claim in the opening sentence. */}
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Bitcoin difficulty is forecast to change{' '}
            <span className="text-up">{pct(difficulty.changePct)}</span> at block{' '}
            <span className="tabular">{int(difficulty.nextRetargetHeight)}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            The 95% interval runs {pct(difficulty.band95[0], 1)} to {pct(difficulty.band95[1], 1)},
            fitted on {difficulty.fitWindow}. There is a{' '}
            {Math.round(difficulty.probSignWrong * 100)}% chance the direction is wrong.
          </p>
        </div>
        <IllustrativeBadge isLive={difficulty.isLive} />
      </div>

      <div className="mt-4">
        <AsOf height={difficulty.asOfHeight} builtAt={difficulty.builtAt} />
      </div>

      <div className="mt-10">
        <EpochProgress />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">A year of retargets</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          Difficulty, the hashrate it implies, and the bitcoin price over the last twenty-six adjustments. Every point is a retarget. The same figures are in the table below the chart,
          so they can be read and quoted without running the page.
        </p>
        <div className="mt-6">
          <NetworkChart data={networkSeries} />
          <SeriesTable data={networkSeries} />
        </div>
      </section>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Current difficulty" value={tera(difficulty.currentT)} />
        <Stat label="Forecast change" value={pct(difficulty.changePct)} tone="up" />
        <Stat label="95% interval" value={`${pct(difficulty.band95[0], 1)} … ${pct(difficulty.band95[1], 1)}`} />
        <Stat label="Epoch progress" value={`${progress}%`} note={`${int(difficulty.blocksObserved)} of ${int(difficulty.blocksInEpoch)} blocks`} />
      </dl>

      {/* Numbers as a table, always — the chart is enhancement, never the only source. */}
      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The figures</h2>
        <DataTable
          caption="Current epoch"
          head={['Measure', 'Value', 'Note']}
          rows={[
            ['Current difficulty', <span key="a" className="tabular">{tera(difficulty.currentT)}</span>, 'As published by the network'],
            ['Blocks observed', <span key="b" className="tabular">{int(difficulty.blocksObserved)} / {int(difficulty.blocksInEpoch)}</span>, 'Intervals used for the projection'],
            ['Forecast change', <span key="c" className="tabular text-up">{pct(difficulty.changePct)}</span>, 'Projection from observed block pace'],
            ['95% interval', <span key="d" className="tabular">{pct(difficulty.band95[0], 1)} to {pct(difficulty.band95[1], 1)}</span>, `Fitted on ${difficulty.fitWindow}`],
            ['Chance sign is wrong', <span key="e" className="tabular text-caution">{Math.round(difficulty.probSignWrong * 100)}%</span>, 'Probability the direction flips'],
            ['Next retarget height', <span key="f" className="tabular">{int(difficulty.nextRetargetHeight)}</span>, 'Block at which difficulty resets'],
          ]}
        />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The dated archive</h2>
        <p className="mb-5 max-w-prose text-[15px] leading-relaxed text-muted">
          Every adjustment gets a permanent page recording what we forecast, the band around it,
          and what actually happened. Those pages never change.
        </p>
        <nav className="flex flex-wrap gap-3" aria-label="Epoch archive">
          {epochs.map((e) => (
            <Link
              key={e.height}
              href={`/data/difficulty/epoch/${e.height}`}
              className="tabular rounded-lg border border-white/[0.1] px-4 py-2.5 text-sm text-subtle hover:border-brand/50 hover:text-body"
            >
              Epoch {int(e.height)}
              <span className="ml-2 text-muted/70">
                {e.realisedPct !== undefined ? pct(e.realisedPct) : 'pending'}
              </span>
            </Link>
          ))}
        </nav>
      </section>

      <FAQ
        items={[
          {
            q: 'When is the next Bitcoin difficulty adjustment?',
            a: `The next adjustment falls at block ${int(difficulty.nextRetargetHeight)}. Bitcoin recalculates mining difficulty every 2,016 blocks, which is roughly every two weeks.`,
          },
          {
            q: 'What is Bitcoin difficulty forecast to do next?',
            a: `Difficulty is forecast to change ${pct(difficulty.changePct)} at block ${int(difficulty.nextRetargetHeight)}, with a 95% interval running ${pct(difficulty.band95[0], 1)} to ${pct(difficulty.band95[1], 1)}. There is roughly a ${Math.round(difficulty.probSignWrong * 100)}% chance the direction is wrong.`,
          },
          {
            q: 'Why does a difficulty forecast need a confidence interval?',
            a: 'A forecast is a projection from the blocks mined so far in the current epoch. Early in an epoch it rests on very little evidence, and the honest range can be wide enough to include zero — meaning the direction itself is genuinely uncertain. A single number hides that.',
          },
          {
            q: 'How is this forecast calculated?',
            a: 'It projects the full-epoch timespan from the blocks mined so far, then converts that into a difficulty multiplier. The interval is fitted to measured historical error rather than derived from theory. The full method is published and versioned.',
          },
        ]}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Callout tone="caution" title="Why the interval matters">
          <p>
            Early in an epoch the projection rests on very few blocks and the honest band is wide
            enough to include zero. Every widely used estimator publishes the point and hides the
            range.
          </p>
        </Callout>
        <Callout title="How this is computed">
          <p>
            The method, its fit window and every restatement are published and versioned at{' '}
            <Link href="/methodology/difficulty-index" className="text-brand hover:underline">
              /methodology/difficulty-index
            </Link>
            . Reproducibility is the point.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

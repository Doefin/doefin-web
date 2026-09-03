import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { IllustrativeBadge } from '@/components/content/LiveBadge'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, Eyebrow, Stat } from '@/components/ui'
import { epochs, epochsIsLive } from '@/content'
import { dateLong, int, pct, tera } from '@/lib/format'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return epochs.map((e) => ({ height: String(e.height) }))
}
export const dynamicParams = false

const find = (height: string) => epochs.find((e) => String(e.height) === height)

export async function generateMetadata({ params }: { params: Promise<{ height: string }> }) {
  const { height } = await params
  const e = find(height)
  if (!e) return {}
  const settled = e.realisedPct !== undefined
  return seo({
    // The number and the block height in the title — this is the whole reason a
    // dated page wins a live-value query.
    absoluteTitle: true,
    title: settled
      ? `Bitcoin difficulty epoch ${int(e.height)}: ${pct(e.realisedPct!)} actual`
      : `Bitcoin difficulty epoch ${int(e.height)}: ${pct(e.forecastPct)} forecast`,
    description: settled
      ? `At block ${int(e.height)} Bitcoin difficulty changed ${pct(e.realisedPct!)}. We forecast ${pct(e.forecastPct)} with a 95% interval of ${pct(e.band95[0], 1)} to ${pct(e.band95[1], 1)}.`
      : `Forecast ${pct(e.forecastPct)} for the Bitcoin difficulty adjustment at block ${int(e.height)}, with a 95% interval of ${pct(e.band95[0], 1)} to ${pct(e.band95[1], 1)}.`,
    path: `/data/difficulty/epoch/${e.height}`,
    type: 'article',
    publishedTime: e.startedAt,
  })
}

export default async function EpochPage({ params }: { params: Promise<{ height: string }> }) {
  const { height } = await params
  const e = find(height)
  if (!e) notFound()

  const settled = e.realisedPct !== undefined
  const inBand = settled && e.realisedPct! >= e.band95[0] && e.realisedPct! <= e.band95[1]
  const error = settled ? Math.abs(e.realisedPct! - e.forecastPct) : null

  const crumbs = [
    { name: 'Data', href: '/data' },
    { name: 'Difficulty', href: '/data/difficulty' },
    { name: `Epoch ${int(e.height)}`, href: `/data/difficulty/epoch/${e.height}` },
  ]

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: `Bitcoin difficulty adjustment at block ${e.height}`,
          description: settled
            ? `Forecast and realised Bitcoin difficulty change at block ${e.height}.`
            : `Forecast Bitcoin difficulty change at block ${e.height}.`,
          url: `${site.url}/data/difficulty/epoch/${e.height}`,
          temporalCoverage: settled ? `${e.startedAt}/${e.settledAt}` : e.startedAt,
          creator: { '@type': 'Organization', name: site.name },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          variableMeasured: 'Bitcoin mining difficulty',
        })}
      />

      <Breadcrumbs items={crumbs} />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <Eyebrow>Epoch {int(e.height)}</Eyebrow>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            {settled ? (
              <>
                Bitcoin difficulty changed{' '}
                <span className={e.realisedPct! >= 0 ? 'text-up' : 'text-down'}>
                  {pct(e.realisedPct!)}
                </span>{' '}
                at block <span className="tabular">{int(e.height)}</span>
              </>
            ) : (
              <>
                Bitcoin difficulty is forecast to change{' '}
                <span className="text-up">{pct(e.forecastPct)}</span> at block{' '}
                <span className="tabular">{int(e.height)}</span>
              </>
            )}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {settled ? (
              <>
                We forecast {pct(e.forecastPct)} with a 95% interval of{' '}
                {pct(e.band95[0], 1)} to {pct(e.band95[1], 1)}. The outcome fell{' '}
                {inBand ? 'inside' : 'outside'} that band, an absolute error of{' '}
                {error!.toFixed(2)} percentage points.
              </>
            ) : (
              <>
                The 95% interval runs {pct(e.band95[0], 1)} to {pct(e.band95[1], 1)}. This page
                becomes the permanent record once the adjustment settles.
              </>
            )}
          </p>
        </div>
        <IllustrativeBadge isLive={epochsIsLive} />
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Forecast" value={pct(e.forecastPct)} />
        <Stat
          label="Realised"
          value={settled ? pct(e.realisedPct!) : 'Pending'}
          tone={settled ? (e.realisedPct! >= 0 ? 'up' : 'down') : 'neutral'}
        />
        <Stat label="Absolute error" value={settled ? `${error!.toFixed(2)} pp` : '—'} />
        <Stat label="Inside 95% band" value={settled ? (inBand ? 'Yes' : 'No') : '—'} />
      </dl>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The record</h2>
        <DataTable
          caption={`Epoch ${int(e.height)} · opened ${dateLong(e.startedAt)}`}
          head={['Measure', 'Value']}
          rows={[
            ['Retarget block height', <span key="a" className="tabular">{int(e.height)}</span>],
            ['Difficulty before', <span key="b" className="tabular">{tera(e.difficultyBeforeT)}</span>],
            ['Difficulty after', <span key="c" className="tabular">{e.difficultyAfterT ? tera(e.difficultyAfterT) : 'Pending'}</span>],
            ['Forecast change', <span key="d" className="tabular">{pct(e.forecastPct)}</span>],
            ['95% interval', <span key="e" className="tabular">{pct(e.band95[0], 1)} to {pct(e.band95[1], 1)}</span>],
            ['Realised change', <span key="f" className="tabular">{settled ? pct(e.realisedPct!) : 'Pending'}</span>],
            ['Absolute error', <span key="g" className="tabular">{settled ? `${error!.toFixed(2)} pp` : 'Pending'}</span>],
          ]}
        />
      </section>

      <div className="mt-10">
        <Callout title="This page never changes">
          <p>
            Once an adjustment settles, this record is permanent. Corrections are published as a
            new entry plus a note in the{' '}
            <Link href="/methodology/difficulty-index" className="text-brand hover:underline">
              methodology restatement log
            </Link>{' '}
            — never as an edit here.
          </p>
        </Callout>
      </div>

      <nav className="mt-10 flex flex-wrap gap-3" aria-label="Other epochs">
        {epochs
          .filter((o) => o.height !== e.height)
          .map((o) => (
            <Link
              key={o.height}
              href={`/data/difficulty/epoch/${o.height}`}
              className="tabular rounded-lg border border-white/[0.1] px-4 py-2 text-sm text-subtle hover:border-brand/50 hover:text-body"
            >
              Epoch {int(o.height)}
            </Link>
          ))}
      </nav>

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

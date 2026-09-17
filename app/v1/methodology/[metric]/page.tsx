import { notFound } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, PageHeader, Prose } from '@/components/ui'
import { difficulty } from '@/content'
import { seo } from '@/lib/seo'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

const METHODS = {
  'difficulty-index': {
    metric: 'Doefin Difficulty Index',
    version: '0.1.0',
    summary:
      'A forward Bitcoin difficulty forecast with an interval fitted to measured error, reproducible from public chain data.',
    body: [
      'The forecast projects the full-epoch timespan from the blocks mined so far, then converts that into a difficulty multiplier. It is arithmetic over a public API, not a model with hidden parameters.',
      'Four details decide whether an implementation matches the network exactly: anchor on the epoch’s first block; divide by 2,015 intervals rather than 2,016; clamp the multiplier to the range a quarter to four; and round-trip the target through the compact encoding the protocol uses, so the published difficulty matches to the last digit.',
      'The interval is fitted empirically from realised error at each position in the epoch — never derived from Poisson theory, which produces a band two to three times too narrow and fails publicly the first time it is tested.',
    ],
    restatements: [] as { date: string; reason: string; effect: string }[],
  },
} as const

export function generateStaticParams() {
  return Object.keys(METHODS).map((metric) => ({ metric }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params
  const m = METHODS[metric as keyof typeof METHODS]
  if (!m) return {}
  return seo({
    title: `${m.metric} methodology v${m.version}`,
    description: m.summary,
    path: `/methodology/${metric}`,
  })
}

export default async function MethodologyPage({ params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params
  const m = METHODS[metric as keyof typeof METHODS]
  if (!m) notFound()

  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs items={[{ name: 'Data', href: '/data' }, { name: 'Methodology', href: `/methodology/${metric}` }]} />

      <PageHeader eyebrow={`Version ${m.version}`} title={`${m.metric} — methodology`} lede={m.summary} />

      <div className="mt-10">
        <Prose paragraphs={[...m.body]} />
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">Parameters</h2>
        <DataTable
          head={['Parameter', 'Value']}
          rows={[
            ['Blocks per epoch', '2,016'],
            ['Intervals used', '2,015'],
            ['Clamp', '0.25 to 4.0'],
            ['Interval fit window', difficulty.fitWindow],
            ['Confidence levels published', '50% · 80% · 95%'],
          ]}
        />
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">Restatement log</h2>
        {m.restatements.length ? (
          <DataTable
            head={['Date', 'Reason', 'Effect']}
            rows={m.restatements.map((r) => [r.date, r.reason, r.effect])}
          />
        ) : (
          <p className="text-[15px] leading-relaxed text-muted">
            No restatements. Any correction to a published figure will be recorded here with its
            date, its reason and its effect.
          </p>
        )}
      </section>

      <div className="mt-10">
        <Callout title="Reproducibility is the governance">
          <p>
            A published method and an open restatement log is what a small publisher can offer in
            place of a formal index-governance apparatus. It is checkable by anyone, which is the
            point.
          </p>
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
        ]}
      />

      <Reviewed />
    </Container>
  )
}

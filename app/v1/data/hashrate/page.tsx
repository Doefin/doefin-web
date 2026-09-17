import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { IllustrativeBadge } from '@/components/content/LiveBadge'
import { FAQ } from '@/components/content/FAQ'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, Eyebrow, Stat } from '@/components/ui'
import { hashrate, networkSeries } from '@/content'
import { int } from '@/lib/format'
import { jsonLd, seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { Subscribe } from '@/components/content/Subscribe'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'
import { NetworkChart, SeriesTable } from '@/components/data/NetworkChart'

export const metadata = seo({
  absoluteTitle: true,
  title: `Bitcoin network hashrate — ${int(hashrate.currentEH)} EH/s at block ${int(hashrate.asOfHeight)}`,
  description: `Bitcoin network hashrate is approximately ${int(hashrate.currentEH)} EH/s, with a 95% band of ±${hashrate.band7dPct}% over seven days. Hashrate is inferred from difficulty and block times, never measured directly.`,
  path: '/data/hashrate',
})

export default function HashratePage() {
  const lo7 = Math.round(hashrate.currentEH * (1 - hashrate.band7dPct / 100))
  const hi7 = Math.round(hashrate.currentEH * (1 + hashrate.band7dPct / 100))
  const lo1 = Math.round(hashrate.currentEH * (1 - hashrate.band1dPct / 100))
  const hi1 = Math.round(hashrate.currentEH * (1 + hashrate.band1dPct / 100))

  return (
    <Container className="py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd({
          '@context': 'https://schema.org',
          '@type': 'Dataset',
          name: 'Bitcoin network hashrate',
          description: 'Estimated Bitcoin network hashrate with honest error bands.',
          url: `${site.url}/data/hashrate`,
          creator: { '@type': 'Organization', name: site.name },
          license: 'https://creativecommons.org/licenses/by/4.0/',
          variableMeasured: 'Bitcoin network hashrate',
        })}
      />
      <Breadcrumbs items={[{ name: 'Data', href: '/data' }, { name: 'Hashrate', href: '/data/hashrate' }]} />

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <Eyebrow>Network hashrate</Eyebrow>
          <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
            Bitcoin network hashrate is about{' '}
            <span className="tabular text-brand">{int(hashrate.currentEH)} EH/s</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            Over a seven-day window the 95% band runs {int(lo7)} to {int(hi7)} EH/s. Over one day it
            widens to {int(lo1)} to {int(hi1)}. Hashrate is never measured — it is inferred from
            difficulty and how fast blocks arrived.
          </p>
        </div>
        <IllustrativeBadge isLive={hashrate.isLive} />
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Hashrate against difficulty</h2>
        <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
          Network hashrate is derived from difficulty, so the two move together by construction. Every point is a retarget. The same figures are in the table below the chart,
          so they can be read and quoted without running the page.
        </p>
        <div className="mt-6">
          <NetworkChart data={networkSeries} />
          <SeriesTable data={networkSeries} />
        </div>
      </section>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Estimate" value={`${int(hashrate.currentEH)} EH/s`} note={`block ${int(hashrate.asOfHeight)}`} />
        <Stat label="7-day band" value={`±${hashrate.band7dPct}%`} note={`${int(lo7)} – ${int(hi7)} EH/s`} />
        <Stat label="1-day band" value={`±${hashrate.band1dPct}%`} note={`${int(lo1)} – ${int(hi1)} EH/s`} />
        <Stat label="Directly measured" value="No" note="Inferred from difficulty and block times" />
      </dl>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The figures</h2>
        <DataTable
          caption="Estimate and honest uncertainty"
          head={['Window', 'Estimate', '95% band', 'Range']}
          rows={[
            ['1 day', <span key="a" className="tabular">{int(hashrate.currentEH)} EH/s</span>, <span key="b" className="tabular text-caution">±{hashrate.band1dPct}%</span>, <span key="c" className="tabular">{int(lo1)} – {int(hi1)} EH/s</span>],
            ['7 days', <span key="d" className="tabular">{int(hashrate.currentEH)} EH/s</span>, <span key="e" className="tabular">±{hashrate.band7dPct}%</span>, <span key="f" className="tabular">{int(lo7)} – {int(hi7)} EH/s</span>],
          ]}
        />
      </section>

      <div className="mt-8">
        <Callout tone="caution" title="Most hashrate charts are showing you noise">
          <p>
            A chart showing hashrate &ldquo;dropping sharply&rdquo; over two days is usually showing
            block-time variance. The move sits inside the error bar. That is why we publish the band
            alongside the number and refuse to report sub-weekly moves as signal.
          </p>
        </Callout>
      </div>

      <FAQ
        items={[
          {
            q: 'How is Bitcoin network hashrate measured?',
            a: 'It is not measured. There is no register of mining machines and no telemetry. The published figure is inferred from two observable things: the current difficulty, and how quickly blocks arrived.',
          },
          {
            q: 'Why does hashrate have an error bar?',
            a: `Because block discovery is random. Over a single day the 95% uncertainty band is roughly ±${hashrate.band1dPct}%; over seven days it narrows to about ±${hashrate.band7dPct}%. A short-window figure carries far more uncertainty than most charts admit.`,
          },
          {
            q: 'What is the current Bitcoin hashrate?',
            a: `Approximately ${int(hashrate.currentEH)} EH/s as of block ${int(hashrate.asOfHeight)}, with a seven-day 95% band of ${int(lo7)} to ${int(hi7)} EH/s.`,
          },
        ]}
      />

      <NextLinks
        items={[
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/glossary', label: 'Glossary', note: 'Plain definitions of every term used here.' },
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

import { Container } from '@/components/layout/Container'
import { Button, Callout, DataTable, PageHeader, Panel } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { difficulty } from '@/content'
import { int, pct } from '@/lib/format'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Hedge Bitcoin mining difficulty — for miners',
  description:
    'Difficulty is the denominator of mining revenue. Size the exposure, see what it costs, and decide whether it is worth managing.',
  path: '/for/miners',
})

export default function ForMiners() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'For miners', href: '/for/miners' }]} />

      <PageHeader
        eyebrow="For mining operators"
        title="Difficulty is the denominator of your revenue"
        lede="The same machines earn less bitcoin as difficulty rises. Most operations carry that exposure without ever choosing to."
      />

      <section className="mt-14 max-w-prose space-y-5 text-[17px] leading-[1.72] text-subtle">
        <p>
          A fleet’s bitcoin production is its share of network hashrate multiplied by what the
          network pays out. When difficulty rises, your share falls — the machines are unchanged,
          the power bill is unchanged, and the revenue drops.
        </p>
        <p>
          The current forecast is <strong className="text-body">{pct(difficulty.changePct)}</strong>{' '}
          at block <span className="tabular">{int(difficulty.nextRetargetHeight)}</span>, with a 95%
          interval of {pct(difficulty.band95[0], 1)} to {pct(difficulty.band95[1], 1)}. That range,
          not the point estimate, is what an exposure is priced against.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.02em]">A worked example</h2>
        <p className="mb-5 max-w-prose text-[15px] leading-relaxed text-muted">
          A fleet producing roughly 7 BTC per epoch, against the current forecast band. Figures are
          illustrative and rounded.
        </p>
        <DataTable
          head={['If difficulty settles at', 'Production per epoch', 'Change vs today']}
          rows={[
            [<span key="a" className="tabular">{pct(difficulty.band95[0], 1)}</span>, <span key="b" className="tabular">7.17 BTC</span>, <span key="c" className="tabular text-up">+0.17</span>],
            [<span key="d" className="tabular">{pct(difficulty.changePct)} (forecast)</span>, <span key="e" className="tabular">6.84 BTC</span>, <span key="f" className="tabular text-down">−0.16</span>],
            [<span key="g" className="tabular">{pct(difficulty.band95[1], 1)}</span>, <span key="h" className="tabular">6.54 BTC</span>, <span key="i" className="tabular text-down">−0.46</span>],
          ]}
        />
      </section>

      <FAQ
        items={[
          {
            q: 'How does Bitcoin difficulty affect mining revenue?',
            a: 'A fleet earns its share of network hashrate multiplied by what the network pays out. When difficulty rises, that share falls — the machines are unchanged and the power bill is unchanged, but the bitcoin produced drops. Difficulty is effectively the denominator of mining revenue.',
          },
          {
            q: 'Should a small mining operation hedge difficulty?',
            a: 'Usually not. For an operation running a few petahash, a ten-point difficulty surprise is worth a few hundred to a few thousand dollars — real money, but below the size at which a hedge covers its own costs and spread. Hedging starts to make sense at scale, where a single adjustment moves a meaningful share of monthly revenue.',
          },
          {
            q: 'How do I size my difficulty exposure?',
            a: 'Take your hashrate as a share of network hashrate, multiply by network issuance over the period you care about, and recompute at the top and bottom of the current forecast interval. The gap between those two production figures is the exposure. It is the range, not the point forecast, that a hedge is priced against.',
          },
          {
            q: 'Does hedging difficulty protect against the bitcoin price falling?',
            a: 'No. A difficulty contract settles on difficulty alone. If the bitcoin price falls while difficulty is flat, a difficulty hedge pays nothing — that is a separate exposure requiring a separate instrument.',
          },
        ]}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Callout tone="caution" title="When this is not worth doing">
          <p>
            For an operation running a few petahash, a ten-point difficulty surprise is worth a few
            hundred to a few thousand dollars — real money, and below the size at which hedging
            makes sense. We would rather say so than sell you something.
          </p>
        </Callout>
        <Panel>
          <h3 className="text-lg font-bold tracking-[-0.015em]">Where to start</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted">
            Read how difficulty adjustment works, then look at the current forecast and its interval.
            Size your own exposure before talking to anyone.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button href="/academy/how-difficulty-adjustment-works" variant="secondary">
              How it works
            </Button>
            <Button href="/data/difficulty">Current forecast</Button>
          </div>
        </Panel>
      </div>

      <NextLinks
        items={[
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

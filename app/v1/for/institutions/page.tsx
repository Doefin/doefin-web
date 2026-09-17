import { Container } from '@/components/layout/Container'
import { Button, Callout, DataTable, PageHeader } from '@/components/ui'
import { FAQ } from '@/components/content/FAQ'
import { seo } from '@/lib/seo'
import { AppCTA } from '@/components/content/NextStep'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export const metadata = seo({
  title: 'Bitcoin difficulty derivatives for funds and desks',
  description:
    'Binary settlement on a published, reproducible difficulty index. Mechanics, settlement and counterparty terms, stated plainly.',
  path: '/for/institutions',
})

export default function ForInstitutions() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'For funds and desks', href: '/for/institutions' }]} />

      <PageHeader
        eyebrow="For funds, desks and treasuries"
        title="Exposure to mining economics, as an instrument"
        lede="A market on a variable that drives an entire industry’s revenue, settling on an index anyone can reproduce."
      />

      <section className="mt-14 max-w-prose space-y-5 text-[17px] leading-[1.72] text-subtle">
        <p>
          Bitcoin mining difficulty moves the revenue of every miner on the network, and until now
          there has been no clean way to take a position on it. Equity in listed miners carries
          management, leverage and treasury decisions alongside the mining exposure.
        </p>
        <p>
          Doefin settles on difficulty alone. The index is published, versioned and reproducible
          from public chain data, so a counterparty can verify settlement independently rather than
          trusting a print.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-2xl font-extrabold tracking-[-0.02em]">Mechanics</h2>
        <DataTable
          head={['Term', 'Detail']}
          rows={[
            ['Underlying', 'Bitcoin mining difficulty, as published by the network'],
            ['Settlement', 'Binary. Observed once, at a stated block height'],
            ['Observation', 'A block height, not a calendar date — heights are exact'],
            ['Collateral', 'Fully collateralised; settlement in a bitcoin-denominated token'],
            ['Index', 'Published method, versioned, with a public restatement log'],
            ['Eligibility', 'Professional investors only'],
          ]}
        />
      </section>

      <FAQ
        items={[
          {
            q: 'What does a Doefin contract settle on?',
            a: 'Bitcoin mining difficulty, as published by the network, observed once at a stated block height. It settles on difficulty alone — not on hashprice, not on the bitcoin price, and not on any composite index.',
          },
          {
            q: 'How is settlement determined?',
            a: 'Settlement is binary and observed at a specific block height rather than a calendar date, because heights are exact while dates are estimates until the block lands. The value is taken from public chain data, so any counterparty can verify it independently.',
          },
          {
            q: 'Who can trade on Doefin?',
            a: 'Professional investors only. Doefin is registered in Port Louis, Mauritius, and the venue terms exclude retail participants.',
          },
          {
            q: 'How is the difficulty index governed?',
            a: 'The method is published, versioned and reproducible from public chain data, with every correction recorded in a public restatement log. Reproducibility is what a small publisher offers in place of a formal index-governance apparatus — it is checkable by anyone.',
          },
          {
            q: 'Why not just take mining exposure through listed miner equity?',
            a: 'Miner equity carries management decisions, leverage, treasury policy and equity beta alongside the mining exposure. A difficulty contract isolates the variable that drives industry revenue, without the rest.',
          },
        ]}
      />

      <div className="mt-10">
        <Callout title="Verify before you trade">
          <p>
            The index method, its fit window and every restatement are public. Score our forecasts
            against realised outcomes yourself on the scoreboard — including the epochs we got wrong.
          </p>
        </Callout>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/methodology/difficulty-index">Read the methodology</Button>
        <Button href="/data/scoreboard" variant="secondary">
          See the scoreboard
        </Button>
      </div>

      <NextLinks
        items={[
          { href: '/docs', label: 'Documentation', note: 'Contract specifications and settlement mechanics.' },
          { href: '/data/scoreboard', label: 'Accuracy scoreboard', note: 'Every past forecast, scored against what happened.' },
          { href: '/methodology/difficulty-index', label: 'Methodology', note: 'How the forecast is built, and its known limits.' },
        ]}
      />

      <AppCTA
        title="Start with a conversation"
        blurb="Desk onboarding, contract specifications and settlement mechanics — the app, or a person."
      />

      <Reviewed />
    </Container>
  )
}

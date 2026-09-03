import Link from 'next/link'
import { IllustrativeBadge } from '@/components/content/LiveBadge'
import { Container } from '@/components/layout/Container'
import { Button, Callout, Eyebrow, Panel, Stat, Tag } from '@/components/ui'
import { Subscribe } from '@/components/content/Subscribe'
import { allPosts, allReports, difficulty } from '@/content'
import { dateShort, int, pct, tera } from '@/lib/format'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export default function HomePage() {
  const latestReport = allReports()[0]
  const latestPosts = allPosts().slice(0, 2)
  const progress = Math.round((difficulty.blocksObserved / difficulty.blocksInEpoch) * 100)

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]"
        />
        <Container className="relative py-20 sm:py-28">
          <div className="grid items-start gap-14 lg:grid-cols-[1.15fr_1fr]">
            <div>
              <Eyebrow>Bitcoin mining difficulty</Eyebrow>
              <h1 className="text-balance text-4xl font-extrabold leading-[1.03] tracking-[-0.035em] sm:text-6xl">
                Every difficulty forecast is a bare number.{' '}
                <span className="text-brand">We publish the error bar.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Forward forecasts with fitted confidence intervals, a public scoreboard grading
                every estimator — ourselves included — and the research behind both. Free, open and
                reproducible.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/data/difficulty">See the current forecast</Button>
                <Button href="/research" variant="secondary">
                  Read the research
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted/80">
                Doefin is available to professional investors only.
              </p>
            </div>

            {/* The headline figure is HTML text, not a chart. Crawlers and AI
                assistants read this; the chart is enhancement. */}
            <Panel className="lg:mt-2">
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">
                    Next adjustment
                  </p>
                  <p className="tabular mt-1 text-sm text-subtle">
                    block {int(difficulty.nextRetargetHeight)}
                  </p>
                </div>
                <IllustrativeBadge isLive={difficulty.isLive} />
              </div>

              <p className="tabular text-5xl font-extrabold tracking-[-0.03em] text-up">
                {pct(difficulty.changePct)}
              </p>
              <p className="tabular mt-2 text-sm text-muted">
                95% interval {pct(difficulty.band95[0], 1)} to {pct(difficulty.band95[1], 1)}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-ink/60 px-4 py-3">
                  <dt className="text-xs text-muted">Current difficulty</dt>
                  <dd className="tabular mt-1 font-bold">{tera(difficulty.currentT)}</dd>
                </div>
                <div className="rounded-lg bg-ink/60 px-4 py-3">
                  <dt className="text-xs text-muted">Chance the sign is wrong</dt>
                  <dd className="tabular mt-1 font-bold text-caution">
                    {Math.round(difficulty.probSignWrong * 100)}%
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-muted">
                  <span>Epoch progress</span>
                  <span className="tabular">
                    {int(difficulty.blocksObserved)} / {int(difficulty.blocksInEpoch)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <Link
                href="/data/difficulty"
                className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
              >
                Full forecast and method →
              </Link>
            </Panel>
          </div>
        </Container>
      </section>

      {/* ── What we publish ──────────────────────────────────────────────── */}
      <Container className="py-20">
        <Eyebrow>What we publish</Eyebrow>
        <h2 className="max-w-2xl text-balance text-3xl font-extrabold tracking-[-0.025em] sm:text-4xl">
          Four things, and the reason each exists
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {[
            {
              href: '/data/difficulty',
              title: 'The difficulty index',
              body: 'A forward forecast with an interval fitted to measured error, not derived from theory. Reproducible, with the method published and versioned.',
            },
            {
              href: '/data/scoreboard',
              title: 'The accuracy scoreboard',
              body: 'Every public estimator scored on what actually happened, us listed first. No incumbent can publish a league table they appear in.',
            },
            {
              href: '/research',
              title: 'Research and datasets',
              body: 'Original analysis on mining economics, published in full and free. The formatted report and underlying data arrive by email.',
            },
            {
              href: '/tools',
              title: 'Tools',
              body: 'Calculators for the questions miners actually argue about — what a hosting contract really costs, what difficulty growth does to payback.',
            },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group">
              <Panel className="h-full transition-colors group-hover:border-brand/40">
                <h3 className="text-lg font-bold tracking-[-0.015em]">{c.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{c.body}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-brand">Open →</span>
              </Panel>
            </Link>
          ))}
        </div>
      </Container>

      {/* ── Audience split ───────────────────────────────────────────────── */}
      <Container className="pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          <Panel className="bg-gradient-to-br from-surface to-surfaceAlt">
            <Tag>For miners</Tag>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.02em]">
              Difficulty is the denominator of your revenue
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              The same machines earn less bitcoin as difficulty rises. Size the exposure, see what
              it costs, and decide whether it is worth managing.
            </p>
            <div className="mt-6">
              <Button href="/for/miners" variant="secondary">
                For mining operators
              </Button>
            </div>
          </Panel>

          <Panel className="bg-gradient-to-br from-surface to-surfaceAlt">
            <Tag>For funds &amp; desks</Tag>
            <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.02em]">
              Exposure to mining economics, as an instrument
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">
              Binary settlement on a published, reproducible index. Mechanics, settlement and
              counterparty terms, stated plainly.
            </p>
            <div className="mt-6">
              <Button href="/for/institutions" variant="secondary">
                For institutions
              </Button>
            </div>
          </Panel>
        </div>
      </Container>

      {/* ── Latest ───────────────────────────────────────────────────────── */}
      <Container className="pb-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <Eyebrow>Latest</Eyebrow>
            <h2 className="text-3xl font-extrabold tracking-[-0.025em]">Recent work</h2>
          </div>
          <Link href="/research" className="text-sm font-semibold text-brand hover:underline">
            All research →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {latestReport ? (
            <Link href={`/research/${latestReport.slug}`} className="group md:col-span-1">
              <Panel className="h-full transition-colors group-hover:border-brand/40">
                <Tag>Research</Tag>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-[-0.015em]">
                  {latestReport.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{latestReport.summary}</p>
                <p className="mt-4 text-xs text-muted/70">{dateShort(latestReport.publishedAt)}</p>
              </Panel>
            </Link>
          ) : null}

          {latestPosts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <Panel className="h-full transition-colors group-hover:border-brand/40">
                <Tag>{p.tags[0]}</Tag>
                <h3 className="mt-4 text-lg font-bold leading-snug tracking-[-0.015em]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.summary}</p>
                <p className="mt-4 text-xs text-muted/70">
                  {dateShort(p.publishedAt)} · {p.readingMinutes} min read
                </p>
              </Panel>
            </Link>
          ))}
        </div>

      <NextLinks
        items={[
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/research', label: 'Research', note: 'Dated reports with the data behind them.' },
        ]}
      />

        <div className="mt-12">
          <Subscribe />
        </div>

        <div className="mt-10">
          <Callout tone="caution" title="A note on what is here">
            <p>
              This is a static build with no backend attached yet. Every figure carries an
              “illustrative” badge until the data pipeline is connected. Nothing on this site is a
              published forecast.
            </p>
          </Callout>
        </div>
  
      <Reviewed />
    </Container>
    </>
  )
}

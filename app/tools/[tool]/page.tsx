import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { FAQ } from '@/components/content/FAQ'
import { Container } from '@/components/layout/Container'
import { HostingCalculator } from '@/components/tools/HostingCalculator'
import { ExposureSizer } from '@/components/tools/ExposureSizer'
import { PaybackModel } from '@/components/tools/PaybackModel'
import { ToolBrief, ToolWatchOut } from '@/components/tools/ToolBrief'
import { Eyebrow } from '@/components/ui'
import { examplesFor, guideFor, microFor, TOOLS } from '@/content'
import { seo } from '@/lib/seo'
import { AppCTA } from '@/components/content/NextStep'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.slug }))
}
export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const t = TOOLS.find((x) => x.slug === tool)
  if (!t) return {}
  return seo({ title: t.title, description: t.summary, path: `/tools/${t.slug}` })
}

export default async function ToolPage({ params }: { params: Promise<{ tool: string }> }) {
  const { tool } = await params
  const t = TOOLS.find((x) => x.slug === tool)
  if (!t) notFound()
  const examples = examplesFor(t.slug)
  const micro = microFor(t.slug)
  const guide = guideFor(t.slug)

  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ name: 'Tools', href: '/tools' }, { name: t.title, href: `/tools/${t.slug}` }]} />

      <div className="mt-6 max-w-3xl">
        <Eyebrow>Tool</Eyebrow>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
          {t.title}
        </h1>
        {/* The lede is the editorial framing; the brief below is the plain-language
            version written for someone about to use the thing. Never both. */}
        {micro ? null : <p className="mt-5 text-lg leading-relaxed text-muted">{t.lede}</p>}
      </div>

      {micro && guide ? (
        <ToolBrief m={micro} slug={t.slug} guideTitle={guide.article.title} />
      ) : null}

      <div className="mt-10">
        {t.slug === 'hosting-effective-rate' && <HostingCalculator />}
        {t.slug === 'difficulty-exposure' && <ExposureSizer />}
        {t.slug === 'fleet-payback' && <PaybackModel />}
      </div>

      {micro ? <ToolWatchOut m={micro} slug={t.slug} /> : null}

      {/* The twin. A calculator's output only exists after someone types into it, and
          AI crawlers do not run JavaScript — so worked examples ship as static prose. */}
      {examples.length ? (
        <section className="mt-14">
          <h2 className="text-2xl font-extrabold tracking-[-0.02em]">Worked examples</h2>
          <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted">
            Real scenarios with the numbers written out, so they can be read, quoted and linked
            without opening the calculator.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {examples.map((e) => (
              <Link key={e.slug} href={`/tools/${t.slug}/example/${e.slug}`} className="group">
                <div className="h-full rounded-panel border border-white/[0.07] bg-surface p-5 transition-colors group-hover:border-brand/40">
                  <h3 className="font-bold leading-snug tracking-[-0.015em]">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{e.summary}</p>
                  <p className="tabular mt-3 text-sm font-bold text-down">{e.headline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <FAQ items={t.faq} />

      <NextLinks
        items={[
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
          { href: '/data/difficulty', label: 'Difficulty forecast', note: 'The current epoch, with its confidence interval.' },
          { href: '/for/miners', label: 'For miners', note: 'What difficulty risk looks like on a real site.' },
        ]}
      />

      <AppCTA
        title="Hedge what you just measured"
        blurb="You have put a number on it. Doefin is where that number becomes a position you can actually take."
      />

      <Reviewed />
    </Container>
  )
}

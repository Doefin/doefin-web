import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Breadcrumbs } from '@/components/content/Breadcrumbs'
import { Container } from '@/components/layout/Container'
import { Callout, DataTable, Eyebrow, Prose } from '@/components/ui'
import { EXAMPLES, guideFor, TOOLS } from '@/content'
import { seo } from '@/lib/seo'
import { Subscribe } from '@/components/content/Subscribe'
import { NextLinks, Reviewed } from '@/components/content/NextLinks'

export function generateStaticParams() {
  return EXAMPLES.map((e) => ({ tool: e.toolSlug, case: e.slug }))
}
export const dynamicParams = false

const find = (tool: string, c: string) => EXAMPLES.find((e) => e.toolSlug === tool && e.slug === c)

export async function generateMetadata({ params }: { params: Promise<{ tool: string; case: string }> }) {
  const { tool, case: c } = await params
  const e = find(tool, c)
  if (!e) return {}
  return seo({
    absoluteTitle: true,
    title: e.seoTitle,
    description: `${e.headline}. ${e.summary}`,
    path: `/tools/${tool}/example/${c}`,
  })
}

export default async function ExamplePage({ params }: { params: Promise<{ tool: string; case: string }> }) {
  const { tool, case: c } = await params
  const e = find(tool, c)
  const t = TOOLS.find((x) => x.slug === tool)
  if (!e || !t) notFound()
  const guide = guideFor(t.slug)

  return (
    <Container size="narrow" className="py-16">
      <Breadcrumbs
        items={[
          { name: 'Tools', href: '/tools' },
          { name: t.title, href: `/tools/${t.slug}` },
          { name: e.title, href: `/tools/${t.slug}/example/${e.slug}` },
        ]}
      />
      <div className="mt-6">
        <Eyebrow>Worked example</Eyebrow>
        <h1 className="text-balance text-4xl font-extrabold leading-[1.06] tracking-[-0.03em]">
          {e.title}
        </h1>
        {/* Answer first — the result before the working. */}
        <p className="tabular mt-5 border-l-[3px] border-down pl-5 text-2xl font-extrabold text-body">
          {e.headline}
        </p>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The contract</h2>
        <DataTable head={['Term', 'Value']} rows={e.inputs.map(([k, v]) => [k, <span key={k} className="tabular">{v}</span>])} />
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-xl font-bold tracking-[-0.02em]">The working</h2>
        <DataTable head={['Step', 'Result']} rows={e.steps.map(([k, v]) => [k, <span key={k} className="tabular">{v}</span>])} />
      </section>

      <div className="mt-10">
        <Prose paragraphs={e.body} />
      </div>

      <div className="mt-10">
        <Callout title="Run it with your own numbers">
          <p>
            <Link href={`/tools/${t.slug}`} className="text-brand hover:underline">
              Open the calculator
            </Link>{' '}
            and change any input. Your scenario is encoded in the URL, so you can paste it into a
            conversation.
          </p>
          {guide ? (
            <p>
              Not sure which number goes where?{' '}
              <Link href={`/academy/guides/${t.slug}`} className="text-brand hover:underline">
                {guide.article.title}
              </Link>{' '}
              covers every setting and where to find yours.
            </p>
          ) : null}
        </Callout>
      </div>

      <NextLinks
        items={[
          { href: '/tools', label: 'Calculators', note: 'Work out your hosting cost, exposure or payback.' },
          { href: '/academy', label: 'Learn', note: 'How difficulty works, from first principles.' },
          { href: '/for/miners', label: 'For miners', note: 'What difficulty risk looks like on a real site.' },
        ]}
      />

      <div className="mt-16">
        <Subscribe compact />
      </div>

      <Reviewed />
    </Container>
  )
}

import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Arrow } from './Arrow'
import { allV3Reports } from '@/content'
import { dateShort } from '@/lib/format'
import { seo } from '@/lib/seo'

export const metadata = seo({ title: 'Research on Bitcoin mining difficulty', description: 'Explore sample research and worked examples on Bitcoin mining difficulty, forecast accuracy and mining economics.', path: '/v3/research' })

/** Keep prototype research honest without changing the original comparison site. */
export default function ResearchIndex() {
  const reports = allV3Reports()
  return <Container className="py-12 sm:py-16">
    <Link href="/v3/resources" className="text-sm text-subtle hover:text-body">Resources / Research</Link>
    <h1 className="mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-5xl">Inspect the evidence.<br />Understand the assumptions.</h1>
    <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-subtle">Explore the research library and work through a forecast example. Reports and figures in this prototype are illustrative; they are not live research results.</p>
    <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
      {reports.map(report => <Link key={report.slug} href={'/v3/research/' + report.slug} className="group flex items-center justify-between gap-6 py-7"><div><p className="text-xs font-semibold text-caution">Sample report · <time dateTime={report.publishedAt}>{dateShort(report.publishedAt)}</time></p><h2 className="mt-3 max-w-3xl text-xl font-bold leading-snug group-hover:text-highlight">{report.title}</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">{report.summary}</p><span className="mt-4 inline-block text-sm font-semibold text-highlight">Read the sample report</span></div><Arrow diagonal className="text-subtle" /></Link>)}
      <Link href="/v3/research/evaluating-a-forecast" className="group flex items-center justify-between gap-6 py-7"><div><p className="text-xs font-semibold text-caution">Worked example · Sample dataset</p><h2 className="mt-3 text-xl font-bold group-hover:text-highlight">Evaluate a difficulty forecast</h2><p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">Follow the error calculation, inspect the example table, and download the sample CSV directly.</p><span className="mt-4 inline-block text-sm font-semibold text-highlight">Work through the example</span></div><Arrow diagonal className="text-subtle" /></Link>
    </div>
    <div className="mt-10 grid gap-5 sm:grid-cols-2">{[
      ['Forecast methodology', 'Read how the calculation is built and where its limits sit.', '/v3/methodology/difficulty-index'],
      ['Data and scoreboard', 'Explore the prototype data pages and sample forecast comparisons.', '/v3/data'],
    ].map(([title, description, href]) => <Link key={href} href={href} className="rounded-panel border border-white/10 bg-surface/40 p-6 hover:border-brand/40"><h2 className="font-bold">{title} <span aria-hidden="true">→</span></h2><p className="mt-3 text-sm leading-relaxed text-subtle">{description}</p></Link>)}</div>
  </Container>
}

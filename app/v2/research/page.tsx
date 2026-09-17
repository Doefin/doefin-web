import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { Button, Eyebrow } from '@/components/ui'
import { ResearchUpdates } from '@/components/preview/ResearchUpdates'
import { PageIntro, panelClass, headingClass, previewSeo } from '@/components/preview/Primitives'
import { preview } from '@/lib/preview'

export const metadata = previewSeo('Data and research', 'Inspect evidence, methods and downloadable sample data before using a forecast in your assumptions.', preview.research)

export default function ResearchPreview() {
  return <>
    <PageIntro section="Data & Research" title="See the evidence behind the assumption."
      description="Research should make its reasoning inspectable. Start with the conclusion, examine the observations, then decide what the evidence supports." />
    <Container className="py-12 sm:py-16">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className={panelClass}><Eyebrow>Featured report · Sample format</Eyebrow><h2 className={headingClass}>How to evaluate a difficulty forecast.</h2><p className="mt-5 text-[17px] leading-[1.75] text-subtle">A short conclusion, a complete evidence table and a calculation you can reproduce. This sample shows how future reports can connect claims to data.</p><div className="mt-7"><Button href={preview.report}>Read the sample report →</Button></div><p className="mt-4 text-xs text-caution">Synthetic example — not historical performance</p></div>
        <div className={panelClass}><Eyebrow>Inside the report</Eyebrow><ol className="mt-5 space-y-6">{[['The finding', 'Understand what the evidence supports.'], ['The evidence', 'Inspect the same rows used in the calculation.'], ['The method', 'Download the CSV and reproduce the result.']].map(([title, text], i) => <li key={title} className="flex gap-4"><span className="tabular text-sm text-highlight">0{i + 1}</span><div><h3 className="text-sm font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-subtle">{text}</p></div></li>)}</ol></div>
      </section>
      <section className="my-12 grid gap-5 md:grid-cols-2">{[
        { title: 'Inspect the sample dataset', text: 'Five synthetic observations, with forecast, outcome and absolute error.', href: preview.report + '#evidence', label: 'Open the evidence table', external: false },
        { title: 'Explore the existing data library', text: 'The original forecast, hashrate and scoreboard pages remain available for comparison.', href: '/data', label: 'View original data pages', external: true },
      ].map(item => <div key={item.href} className={panelClass}><h2 className="text-xl font-bold">{item.title}</h2><p className="mt-3 text-sm leading-relaxed text-subtle">{item.text}</p><Link href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} className="mt-5 inline-block text-sm font-semibold text-highlight hover:underline">{item.label} {item.external ? '↗' : '→'}</Link></div>)}</section>
      <ResearchUpdates />
    </Container>
  </>
}

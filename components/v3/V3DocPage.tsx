import { notFound } from 'next/navigation'
import Link from '@/components/routing/SiteLink'
import { allV3Docs, getV3Doc, v3DocReviewedAt } from '@/content'
import { seo } from '@/lib/seo'
import { V3DocsLayout } from './V3DocsLayout'

export const generateStaticParams = () => allV3Docs().map(doc => ({ slug: doc.slug }))
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const doc = getV3Doc((await params).slug)
  return doc ? seo({ title: doc.title, description: doc.summary, path: '/v3/docs/' + doc.slug }) : {}
}

const sectionId = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default async function V3DocPage({ params }: { params: Promise<{ slug: string }> }) {
  const doc = getV3Doc((await params).slug)
  if (!doc) notFound()
  const reviewedAt = doc.reviewedAt ?? v3DocReviewedAt
  const reviewedLabel = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(reviewedAt))
  const ordered = allV3Docs()
  const position = ordered.findIndex(item => item.slug === doc.slug)
  const previous = ordered[position - 1]
  const next = ordered[position + 1]

  return <V3DocsLayout activeSlug={doc.slug} title={doc.title} summary={doc.summary} eyebrow={doc.group}>
    <p className="text-xs text-subtle">Reviewed <time dateTime={reviewedAt}>{reviewedLabel}</time></p>
    <nav aria-label="On this page" className="mt-7 border-y border-white/10 py-4">
      <p className="text-xs font-semibold text-subtle">On this page</p>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-2">{doc.sections.map(section => <li key={section.title}><Link href={'#' + sectionId(section.title)} className="text-sm text-highlight underline-offset-4 hover:underline">{section.title}</Link></li>)}</ul>
    </nav>

    <div className="mt-9 space-y-10">{doc.sections.map(section => <section id={sectionId(section.title)} key={section.title} className="scroll-mt-36">
      <h2 className="mb-4 text-2xl font-bold tracking-[-0.025em]">{section.title}</h2>
      {section.paragraphs ? <div className="space-y-4 text-[17px] leading-[1.8] text-subtle">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div> : null}
      {section.steps ? <ol className="list-decimal space-y-3 pl-5 text-[16px] leading-[1.8] text-subtle">{section.steps.map(step => <li key={step}>{step}</li>)}</ol> : null}
      {section.definitions ? <dl className="divide-y divide-white/10 border-y border-white/10">{section.definitions.map(item => <div key={item.term} className="py-4"><dt className="font-semibold">{item.term}</dt><dd className="mt-1.5 text-[16px] leading-[1.75] text-subtle">{item.definition}</dd></div>)}</dl> : null}
    </section>)}</div>

    {doc.optionalLinks?.length ? <aside aria-label="Optional tools" className="mt-9 border-l-2 border-white/20 pl-4"><p className="mb-2 text-xs font-semibold text-subtle">Explore further, if useful</p>{doc.optionalLinks.map(link => <Link key={link.href} href={link.href} className="inline-flex min-h-10 items-center text-sm text-highlight underline-offset-4 hover:underline">{link.label} <span aria-hidden="true" className="ml-2">→</span></Link>)}</aside> : null}

    <nav aria-label="Related documentation" className="mt-12 border-t border-white/10 pt-7">
      <h2 className="text-lg font-bold">Related documentation</h2>
      <ul className="mt-3 space-y-2">{doc.related.map(slug => <li key={slug}><Link href={'/v3/docs/' + slug} className="inline-flex min-h-8 items-center text-sm font-semibold text-highlight underline-offset-4 hover:underline">{getV3Doc(slug)?.title ?? slug}</Link></li>)}</ul>
    </nav>
    <nav aria-label="Documentation reading order" className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-2">
      {previous ? <Link href={'/v3/docs/' + previous.slug} className="text-sm hover:text-highlight"><span className="mb-1 block text-xs text-subtle">Previous</span>{previous.title}</Link> : <span />}
      {next ? <Link href={'/v3/docs/' + next.slug} className="text-sm hover:text-highlight sm:text-right"><span className="mb-1 block text-xs text-subtle">Next</span>{next.title}</Link> : null}
    </nav>
  </V3DocsLayout>
}

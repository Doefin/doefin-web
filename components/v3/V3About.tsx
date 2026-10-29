import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { aboutAuthorsSnapshot } from '@/content'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContentLinks, ContentPage } from './ContentPage'

export const metadata = seo({ title: 'About Doefin', description: 'Doefin provides markets for trading and hedging Bitcoin hashrate exposure. Read how the markets work and contact the team.', path: '/v3/about' })

export default async function V3About() {
  const { sections, author } = await aboutAuthorsSnapshot()
  return <ContentPage title="About Doefin" summary="Doefin provides markets for trading and hedging Bitcoin hashrate exposure. Our contracts reference future Bitcoin mining difficulty. We help miners assess that exposure and give professional investors a way to trade their views through defined market outcomes." eyebrow="About" crumbs={[{ name: 'About', href: '/v3/about' }]}>
    <AutoLinkedProse paragraphs={sections.flatMap(section => [{ heading: section.heading, id: section.id }, ...section.paragraphs])} />
    <section id="doefin-research" className="mt-10 scroll-mt-28"><h2 className="text-2xl font-bold">{author.name}</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">{author.description}</p><p className="mt-4 text-[16px] leading-relaxed text-subtle">The research library contains educational examples. Each page states its classification and sources. A sample report is not a measured result.</p></section>
    <a href={'mailto:' + site.contactEmail} className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">Contact the team ↗</a>
    <ContentLinks links={[{ href: '/v3/docs/smart-contracts', label: 'Technical review questions' }, { href: '/v3/for/institutions', label: 'Review the market with your team' }, { href: '/v3/docs', label: 'Read the documentation' }]} />
  </ContentPage>
}

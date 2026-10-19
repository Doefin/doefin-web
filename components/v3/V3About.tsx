import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { v3AboutSections } from '@/content'
import { seo } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContentLinks, ContentPage } from './ContentPage'

export const metadata = seo({ title: 'About Doefin', description: 'Understand Doefin’s Bitcoin difficulty markets, review the available documentation and contact the team.', path: '/v3/about' })

export default function V3About() {
  return <ContentPage title="About Doefin" summary="Doefin provides markets on future Bitcoin mining difficulty for professional investors." eyebrow="About" crumbs={[{ name: 'About', href: '/v3/about' }]}>
    <AutoLinkedProse paragraphs={v3AboutSections.flatMap(section => [{ heading: section.heading }, ...section.paragraphs])} />
    <section id="doefin-research" className="mt-10 scroll-mt-28"><h2 className="text-2xl font-bold">Doefin research</h2><p className="mt-4 text-[16px] leading-relaxed text-subtle">The current research library contains educational examples. Read the classification and sources on each page; a sample report should not be treated as a measured result.</p></section>
    <a href={'mailto:' + site.contactEmail} className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white">Contact the team ↗</a>
    <ContentLinks links={[{ href: '/v3/docs/smart-contracts', label: 'Technical review questions' }, { href: '/v3/for/institutions', label: 'Review the market with your team' }, { href: '/v3/docs', label: 'Read the documentation' }]} />
  </ContentPage>
}

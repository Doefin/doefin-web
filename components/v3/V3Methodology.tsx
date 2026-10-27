import { notFound } from 'next/navigation'
import { AutoLinkedProse } from '@/components/content/AutoLinkedProse'
import { getV3Methodology } from '@/content'
import { seo } from '@/lib/seo'
import { ContentLinks, ContentPage } from './ContentPage'

export const generateStaticParams = () => [{ metric: 'difficulty-index' }]
export async function generateMetadata({ params }: { params: Promise<{ metric: string }> }) {
  const { metric } = await params
  return metric === 'difficulty-index' ? seo({ title: 'Evaluating a difficulty forecast method', description: 'Review a difficulty forecast’s inputs, calculation, uncertainty and evaluation evidence.', path: '/v3/methodology/difficulty-index' }) : {}
}

export default async function V3Methodology({ params }: { params: Promise<{ metric: string }> }) {
  const methodology = await getV3Methodology((await params).metric)
  if (!methodology) notFound()
  return <ContentPage title="Evaluate the method behind a forecast." summary="A reproducible forecast needs identifiable inputs, an explicit calculation and evidence for its uncertainty claims." eyebrow="Forecast methodology" crumbs={[{ name: 'Resources', href: '/v3/resources' }, { name: 'Methodology', href: '/v3/methodology/difficulty-index' }]}>
    <AutoLinkedProse paragraphs={methodology.sections.flatMap(section => [{ heading: section.heading, id: section.id }, ...section.paragraphs])} />
    <ContentLinks links={[{ href: '/v3/research/evaluating-a-forecast', label: 'Reproduce the worked error calculation' }, { href: '/v3/data/scoreboard', label: 'Read the sample accuracy comparison' }, { href: '/v3/docs/what-doefin-settles-on', label: 'Separate a forecast from market settlement' }]} />
  </ContentPage>
}

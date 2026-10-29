import { notFound } from 'next/navigation'
import { getV3Route, v3RouteMetadata, v3Routes } from '@/lib/v3-routes'

type Props = { params: Promise<{ path: string[] }> }

export const dynamicParams = false

export function generateStaticParams() {
  return v3Routes.map(({ path }) => ({ path: path.split('/') }))
}

export async function generateMetadata({ params }: Props) {
  const route = getV3Route((await params).path)
  if (!route) notFound()
  return v3RouteMetadata(route)
}

export default async function V3SupportingPage({ params }: Props) {
  const route = getV3Route((await params).path)
  if (!route) notFound()
  return route.render()
}

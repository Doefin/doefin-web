import { createElement, type ReactNode } from 'react'
import type { Metadata } from 'next'
import { seo } from '@/lib/seo'

// Explicit imports make the complete preview graph visible to the Next.js build.
// Shared pages live under V3 and remain Server Components.
import * as Product from '@/components/v3/pages/ProductPage'
import * as Settlement from '@/components/v3/pages/SettlementPage'
import * as Miners from '@/components/v3/MinersPage'
import * as Institutions from '@/components/v3/InstitutionsPage'
import * as Tools from '@/components/v3/V3ToolsIndex'
import * as Tool from '@/components/v3/V3ToolPage'
import * as Learn from '@/components/v3/V3Learn'
import * as Tutorial from '@/components/v3/pages/TutorialPage'
import * as SampleReport from '@/components/v3/V3ForecastExample'
import * as Research from '@/components/v3/ResearchIndex'
import * as Report from '@/components/v3/V3ReportPage'
import * as Data from '@/components/v3/V3DataIndex'
import * as Difficulty from '@/components/v3/V3Difficulty'
import * as Hashrate from '@/components/v3/V3Hashrate'
import * as Scoreboard from '@/components/v3/V3Scoreboard'
import * as Epoch from '@/components/v3/V3EpochPage'
import * as Methodology from '@/components/v3/V3Methodology'
import * as Example from '@/components/v3/pages/WorkedExamplePage'
import * as About from '@/components/v3/V3About'
import * as Privacy from '@/components/v3/V3Privacy'
import * as Terms from '@/components/v3/pages/TermsPage'

type PageResult = ReactNode | Promise<ReactNode>
type StaticPage = { default: () => PageResult; metadata: Metadata }
type DynamicPage<P extends Record<string, string>> = {
  default: (props: { params: Promise<P> }) => PageResult
  generateStaticParams: () => P[]
  generateMetadata: (props: { params: Promise<P> }) => Metadata | Promise<Metadata>
}

export type V3Route = {
  /** Path below /v3, without a leading slash. */
  path: string
  render: () => ReactNode
  metadata: () => Metadata | Promise<Metadata>
}

function staticRoute(path: string, page: StaticPage): V3Route {
  return {
    path,
    render: () => createElement(page.default),
    metadata: () => page.metadata,
  }
}

function dynamicRoutes<P extends Record<string, string>>(
  page: DynamicPage<P>,
  pathFor: (params: P) => string,
): V3Route[] {
  return page.generateStaticParams().map(params => ({
    path: pathFor(params),
    render: () => createElement(page.default, { params: Promise.resolve(params) }),
    metadata: () => page.generateMetadata({ params: Promise.resolve(params) }),
  }))
}

/**
 * The complete V3 product journey, reference routes and supporting content.
 * Home, resources, newsletter and internal prototype review have dedicated V3 pages.
 */
export const v3Routes: readonly V3Route[] = [
  staticRoute('product', Product),
  staticRoute('product/settlement', Settlement),
  staticRoute('for/miners', Miners),
  staticRoute('for/institutions', Institutions),
  staticRoute('tools', Tools),
  ...dynamicRoutes(Tool, ({ slug }) => `tools/${slug}`),
  staticRoute('learn', Learn),
  staticRoute('learn/difficulty-exposure', Tutorial),
  staticRoute('research/evaluating-a-forecast', SampleReport),
  staticRoute('research', Research),
  ...dynamicRoutes(Report, ({ slug }) => `research/${slug}`),
  staticRoute('data', Data),
  staticRoute('data/difficulty', Difficulty),
  staticRoute('data/hashrate', Hashrate),
  staticRoute('data/scoreboard', Scoreboard),
  ...dynamicRoutes(Epoch, ({ height }) => `data/difficulty/epoch/${height}`),
  ...dynamicRoutes(Methodology, ({ metric }) => `methodology/${metric}`),
  ...dynamicRoutes(Example, ({ tool, case: example }) => `tools/${tool}/example/${example}`),
  staticRoute('about', About),
  staticRoute('privacy', Privacy),
  staticRoute('terms', Terms),
]

const routesByPath = new Map(v3Routes.map(route => [route.path, route]))
if (routesByPath.size !== v3Routes.length) throw new Error('Duplicate V3 supporting route')

export function getV3Route(path: string[]): V3Route | undefined {
  return routesByPath.get(path.join('/'))
}

/** Imported pages do not inherit their source route's metadata automatically. */
export async function v3RouteMetadata(route: V3Route): Promise<Metadata> {
  const source = await route.metadata()
  const base = seo({
    title: 'Doefin preview',
    description: source.description ?? '',
    path: `/v3/${route.path}`,
  })
  return {
    ...base,
    ...source,
    alternates: { ...source.alternates, ...base.alternates },
    openGraph: { ...base.openGraph, ...source.openGraph, url: base.openGraph?.url, images: base.openGraph?.images },
    twitter: { ...base.twitter, ...source.twitter, images: base.twitter?.images },
    robots: { index: false, follow: false },
  }
}

import { posts } from './posts'
import { academy } from './academy'
import { glossary } from './glossary'
import { reports } from './research'
import type { AcademyPost, GlossaryTerm, Post, Report } from './types'

/**
 * The only module that knows where content comes from. Keep every read behind
 * these functions — that discipline is what makes swapping in a CMS a one-file
 * change rather than a refactor.
 */

const live = <T extends { draft?: boolean }>(items: T[]) => items.filter((i) => !i.draft)
const byDate = <T extends { publishedAt: string }>(a: T, b: T) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()

export const allPosts = (): Post[] => live(posts).sort(byDate)
export const getPost = (slug: string) => allPosts().find((p) => p.slug === slug)

export const allAcademy = (): AcademyPost[] => live(academy).sort(byDate)
export const getAcademy = (slug: string) => allAcademy().find((p) => p.slug === slug)

export const allGlossary = (): GlossaryTerm[] =>
  [...glossary].sort((a, b) => a.term.localeCompare(b.term))
export const getGlossary = (slug: string) => allGlossary().find((t) => t.slug === slug)

export const allReports = (): Report[] => live(reports).sort(byDate)
export const getReport = (slug: string) => allReports().find((r) => r.slug === slug)

export const allTags = (): string[] =>
  [...new Set(allPosts().flatMap((p) => p.tags))].sort()

export type { Post, AcademyPost, GlossaryTerm, Report, Source, Confidence } from './types'

/**
 * Tools, guides, docs and the placeholder figures. Same discipline: server code
 * reads through this file so that swapping in a CMS stays a one-file change.
 *
 * The exception is deliberate. components/tools/{Hosting,Exposure,Payback}*.tsx are
 * client components, and importing this barrel from a client component would pull
 * every article, report and glossary term — about 96 KB — into the browser bundle to
 * reach one 16 KB module. They import './tool-micro' directly and must keep doing so.
 * That data has to be statically bundled either way, so it is not what a CMS swap
 * touches, and the rule loses nothing.
 */
export { TOOLS, EXAMPLES, examplesFor } from './tools'
export type { Tool, ToolExample } from './tools'

export { TOOL_GUIDES, guideFor, allGuides } from './tool-guides'
export type { ToolGuideContent } from './tool-guides'

export { TOOL_MICRO, microFor, hintFor, resultHintFor, presetsFor } from './tool-micro'
export type { ToolMicro } from './tool-micro'

export { docs, publishedDocs, docGroups } from './docs'
export type { Doc } from './docs'

export { difficulty, hashrate, scoreboard, epochs, epochsIsLive, networkSeries, networkSeriesIsLive } from './sample-data'
export type { Epoch, NetworkPoint } from './sample-data'

export { authors, getAuthor } from './authors'
export type { Author } from './authors'

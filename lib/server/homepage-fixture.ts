import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { DifficultyImpactSnapshot } from '../difficulty-impact'

export type HomepageFixture = {
  source: string
  snapshot: DifficultyImpactSnapshot
  points: {
    height: number
    date: string
    changePct: number
    averageEH: number | null
  }[]
  retrievedAt: string
}

/** Development-only replay for deterministic production comparisons. */
export async function getHomepageFixture(): Promise<HomepageFixture | null> {
  if (process.env.NODE_ENV !== 'development') return null
  const filename = process.env.DOFIN_HOMEPAGE_FIXTURE || path.join(process.cwd(), 'fixtures', 'homepage-production.json')
  try {
    const fixture = JSON.parse(await readFile(filename, 'utf8')) as HomepageFixture
    if (!fixture.snapshot || !Array.isArray(fixture.points) || typeof fixture.retrievedAt !== 'string') return null
    return fixture
  } catch {
    return null
  }
}

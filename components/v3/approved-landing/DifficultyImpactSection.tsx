import type { LandingCopy } from '@/dictionaries'
import type { Language } from '@/lib/languages'
import { getDifficultyImpactSnapshot } from '@/lib/server/difficulty-impact'
import type { DifficultyImpactResult } from '@/lib/difficulty-impact'
import { DifficultyImpact } from './DifficultyImpact'

export { DifficultyImpactLoading } from './DifficultyImpact'

export async function DifficultyImpactSection({ copy, language }: { copy: LandingCopy; language: Language }) {
  let initialResult: DifficultyImpactResult
  try {
    initialResult = await getDifficultyImpactSnapshot()
  } catch {
    initialResult = { status: 'unavailable', receivedAt: new Date().toISOString() }
  }

  return <DifficultyImpact copy={copy} language={language} initialResult={initialResult} initialNow={Date.now()} />
}

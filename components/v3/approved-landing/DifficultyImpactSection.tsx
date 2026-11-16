import { getDifficultyImpactSnapshot } from '@/lib/server/difficulty-impact'
import type { DifficultyImpactResult } from '@/lib/difficulty-impact'
import { DifficultyImpact } from './DifficultyImpact'

export { DifficultyImpactLoading } from './DifficultyImpact'

export async function DifficultyImpactSection() {
  let initialResult: DifficultyImpactResult
  try {
    initialResult = await getDifficultyImpactSnapshot()
  } catch {
    initialResult = { status: 'unavailable', receivedAt: new Date().toISOString() }
  }

  return <DifficultyImpact initialResult={initialResult} initialNow={Date.now()} />
}

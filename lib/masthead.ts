import type { Confidence, Source } from '@/content/types'

/**
 * The provenance a reader needs before deciding whether to trust a figure:
 * who published it, when, on what evidence, and how strong that evidence is.
 *
 * Every field is a pure function of data the content model already requires, so
 * a new article gets a masthead with no extra authoring and nothing to keep in
 * sync. That is the whole design constraint — a per-article human step would stop
 * being taken by about the fourth article.
 */

/** Weakest source wins. A single judgement call downgrades the whole piece. */
const RANK: Record<Confidence, number> = { measured: 2, 'single-source': 1, judgement: 0 }

export function evidenceGrade(sources: Source[] = []): Confidence | null {
  if (!sources.length) return null
  return sources.reduce<Confidence>(
    (weakest, s) => (RANK[s.confidence] < RANK[weakest] ? s.confidence : weakest),
    'measured',
  )
}

export const GRADE_LABEL: Record<Confidence, string> = {
  measured: 'Measured',
  'single-source': 'Single source',
  judgement: 'Judgement',
}

/**
 * What the grade means, stated on the page rather than left as a badge the
 * reader has to interpret. A label without its definition is decoration.
 */
export const GRADE_NOTE: Record<Confidence, string> = {
  measured: 'Every figure computed from public chain data, reproducible from the method.',
  'single-source': 'At least one figure rests on a single source that has not been cross-checked.',
  judgement: 'At least one figure is an estimate rather than a measurement.',
}

export function sourceSummary(sources: Source[] = []): string | null {
  if (!sources.length) return null
  const grade = evidenceGrade(sources)!
  const all = sources.every((s) => s.confidence === sources[0].confidence)
  const n = `${sources.length} source${sources.length === 1 ? '' : 's'}`
  return all ? `${n}, all ${sources[0].confidence}` : `${n}, weakest ${grade}`
}

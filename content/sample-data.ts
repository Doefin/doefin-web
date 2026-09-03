/**
 * ILLUSTRATIVE FIGURES ONLY.
 *
 * This is a static build with no backend attached. Every number below is a
 * plausible placeholder so the templates can be reviewed with realistic shapes.
 * Nothing here is a real forecast and nothing should be published as one.
 *
 * When the backend lands, replace this module with a fetch and set
 * `isLive: true`. The `asOf` stamp and the "illustrative" badge are wired to
 * that flag, so the UI corrects itself.
 */
export const difficulty = {
  isLive: false,
  asOfHeight: 912_904,
  builtAt: '2026-08-24T14:00:00Z',
  currentT: 127.48,
  nextRetargetHeight: 913_248,
  blocksObserved: 1_264,
  blocksInEpoch: 2_015,
  changePct: 2.31,
  band95: [-2.4, 7.0] as const,
  probSignWrong: 0.18,
  fitWindow: 'post-halving-4 epochs',
}

export const hashrate = {
  isLive: false,
  currentEH: 912,
  band1dPct: 16.3,
  band7dPct: 6.2,
  asOfHeight: 912_904,
}

/** Estimators scored on realised error. Ours is listed first, deliberately. */
export const scoreboard = {
  isLive: false,
  epochsScored: 0,
  rows: [
    { source: 'Doefin', mae: null, coverage: null, note: 'Scoring begins at first published epoch' },
    { source: 'Estimator A', mae: null, coverage: null, note: 'No interval published' },
    { source: 'Estimator B', mae: null, coverage: null, note: 'No interval published' },
    { source: 'Estimator C', mae: null, coverage: null, note: 'No interval published' },
  ],
}

/**
 * The dated epoch archive — the compounding asset.
 *
 * One permanent page per difficulty adjustment: what we forecast, the band around
 * it, and afterwards what actually happened. A self-overwriting page accumulates no
 * citation surface; 26 dated pages a year accumulate a corpus a competitor starting
 * later cannot manufacture.
 *
 * Entries are append-only. A correction is a new entry plus a methodology
 * restatement, never an edit to a published one.
 */
export type Epoch = {
  height: number
  startedAt: string
  settledAt?: string
  forecastPct: number
  band95: readonly [number, number]
  realisedPct?: number
  difficultyBeforeT: number
  difficultyAfterT?: number
}

export const epochs: Epoch[] = [
  {
    height: 913_248,
    startedAt: '2026-08-10',
    forecastPct: 2.31,
    band95: [-2.4, 7.0],
    difficultyBeforeT: 127.48,
  },
  {
    height: 911_232,
    startedAt: '2026-07-27',
    settledAt: '2026-08-10',
    forecastPct: 1.12,
    band95: [-1.9, 4.1],
    realisedPct: 1.84,
    difficultyBeforeT: 125.18,
    difficultyAfterT: 127.48,
  },
  {
    height: 909_216,
    startedAt: '2026-07-13',
    settledAt: '2026-07-27',
    forecastPct: -0.74,
    band95: [-4.2, 2.7],
    realisedPct: -2.06,
    difficultyBeforeT: 127.81,
    difficultyAfterT: 125.18,
  },
]

export const epochsIsLive = false

/**
 * Twenty-six retargets — one year — of ILLUSTRATIVE network history, for the charts.
 *
 * Deterministic, not random, so every build produces the same picture. Two internal
 * consistencies are deliberate and must survive any edit: the series LANDS on
 * `difficulty.currentT`, and hashrate is derived from difficulty by the 10-minute
 * target rather than invented separately. A chart that disagrees with the figure
 * printed beside it is worse than no chart. Price is the one series with no
 * arithmetic tie to the others, and it is the crudest placeholder here.
 */
export type NetworkPoint = {
  height: number
  date: string
  difficultyT: number
  hashrateEH: number
  priceUsd: number
}

export const networkSeries: NetworkPoint[] = [
  { height: 862848, date: "2025-09-01", difficultyT: 92.3, hashrateEH: 661, priceUsd: 61000 },
  { height: 864864, date: "2025-09-15", difficultyT: 94.98, hashrateEH: 680, priceUsd: 63400 },
  { height: 866880, date: "2025-09-29", difficultyT: 96.31, hashrateEH: 689, priceUsd: 61500 },
  { height: 868896, date: "2025-10-13", difficultyT: 95.54, hashrateEH: 684, priceUsd: 65800 },
  { height: 870912, date: "2025-10-27", difficultyT: 98.97, hashrateEH: 708, priceUsd: 67100 },
  { height: 872928, date: "2025-11-10", difficultyT: 101.05, hashrateEH: 723, priceUsd: 63700 },
  { height: 874944, date: "2025-11-24", difficultyT: 101.46, hashrateEH: 726, priceUsd: 69400 },
  { height: 876960, date: "2025-12-08", difficultyT: 99.53, hashrateEH: 712, priceUsd: 70100 },
  { height: 878976, date: "2025-12-22", difficultyT: 103.71, hashrateEH: 742, priceUsd: 68700 },
  { height: 880992, date: "2026-01-05", difficultyT: 104.85, hashrateEH: 751, priceUsd: 72800 },
  { height: 883008, date: "2026-01-19", difficultyT: 107.68, hashrateEH: 771, priceUsd: 75000 },
  { height: 885024, date: "2026-02-02", difficultyT: 107.04, hashrateEH: 766, priceUsd: 69800 },
  { height: 887040, date: "2026-02-16", difficultyT: 110.35, hashrateEH: 790, priceUsd: 73300 },
  { height: 889056, date: "2026-03-02", difficultyT: 112.34, hashrateEH: 804, priceUsd: 79200 },
  { height: 891072, date: "2026-03-16", difficultyT: 112.57, hashrateEH: 806, priceUsd: 78400 },
  { height: 893088, date: "2026-03-30", difficultyT: 109.86, hashrateEH: 786, priceUsd: 81500 },
  { height: 895104, date: "2026-04-13", difficultyT: 114.15, hashrateEH: 817, priceUsd: 78200 },
  { height: 897120, date: "2026-04-27", difficultyT: 116.66, hashrateEH: 835, priceUsd: 82900 },
  { height: 899136, date: "2026-05-11", difficultyT: 118.41, hashrateEH: 848, priceUsd: 84600 },
  { height: 901152, date: "2026-05-25", difficultyT: 117.11, hashrateEH: 838, priceUsd: 92200 },
  { height: 903168, date: "2026-06-08", difficultyT: 120.39, hashrateEH: 862, priceUsd: 89400 },
  { height: 905184, date: "2026-06-22", difficultyT: 121.47, hashrateEH: 870, priceUsd: 93900 },
  { height: 907200, date: "2026-07-06", difficultyT: 125.48, hashrateEH: 898, priceUsd: 94800 },
  { height: 909216, date: "2026-07-20", difficultyT: 122.84, hashrateEH: 879, priceUsd: 89100 },
  { height: 911232, date: "2026-08-03", difficultyT: 125.18, hashrateEH: 896, priceUsd: 95300 },
  { height: 913248, date: "2026-08-17", difficultyT: 127.48, hashrateEH: 913, priceUsd: 99100 },
]

export const networkSeriesIsLive = false

import type { Post } from './types'

export const posts: Post[] = [
  {
    slug: 'what-a-static-growth-assumption-costs-you',
    title: 'What a static difficulty assumption costs a mining operation',
    summary:
      'The calculator most miners use assumes difficulty grows at a fixed rate forever. Here is what that assumption does to a payback estimate.',
    publishedAt: '2026-08-19',
    author: 'Doefin Research',
    tags: ['difficulty', 'mining economics'],
    readingMinutes: 6,
    sources: [
      { label: 'Bitcoin difficulty history, all epochs', accessedAt: '2026-08-19', confidence: 'measured' },
      { label: 'Community calculator assumptions, r/BitcoinMining threads', accessedAt: '2026-08-11', confidence: 'single-source' },
    ],
    body: [
      'Most mining return calculators either ignore difficulty growth entirely or hard-code a fixed monthly rate. The most-recommended community tool uses a flat assumption applied indefinitely.',
      'A fixed rate is not a forecast. It is a guess that happens to have been roughly right over some past window, applied to a future that has no obligation to match it. The error compounds: over a two-year payback horizon, a small difference in assumed growth moves the payback date by months.',
      'The honest version states the assumption, states the range around it, and shows the reader what changes if the assumption is wrong. That is more useful and less flattering than a single confident number.',
      'It is also worth being honest in the other direction. For an operation running a few petahash, a ten-point difficulty surprise is worth a few hundred to a few thousand dollars. That is real money and it is below the size at which hedging makes sense. The tool should say so.',
    ],
  },
  {
    slug: 'reading-a-hashrate-chart-honestly',
    title: 'Reading a hashrate chart honestly',
    summary:
      'Network hashrate is never measured. It is inferred — and the error bars on a one-day figure are wider than most people assume.',
    publishedAt: '2026-08-22',
    author: 'Doefin Research',
    tags: ['hashrate', 'methodology'],
    readingMinutes: 4,
    sources: [
      { label: 'Difficulty and block-interval series, computed', accessedAt: '2026-08-22', confidence: 'measured' },
    ],
    body: [
      'Nobody can see the Bitcoin network hashrate. There is no register of machines and no telemetry. What gets charted is an inference from two things that are observable: the current difficulty, and how quickly blocks arrived.',
      'That inference carries real uncertainty, and the shorter the window the worse it is. A one-day estimate has a 95% band of roughly plus or minus sixteen percent. Over seven days it narrows to about six.',
      'Which means a chart showing hashrate "dropping sharply" over two days is usually showing block-time noise. The move is inside the error bar. Publishing it as a trend is publishing randomness with a headline attached.',
      'The fix is not complicated: show the band. A hashrate chart with error bars is less dramatic and considerably more useful, and it stops readers drawing conclusions the data cannot support.',
    ],
  },
]

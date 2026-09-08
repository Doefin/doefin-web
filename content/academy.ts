import type { AcademyPost } from './types'

export const academy: AcademyPost[] = [
  {
    slug: 'how-difficulty-adjustment-works',
    title: 'How Bitcoin difficulty adjustment works',
    summary:
      'Every 2,016 blocks the network resets how hard mining is. Here is the arithmetic, and the off-by-one that catches most implementations.',
    level: 'intro',
    publishedAt: '2026-08-12',
    author: 'doefin-research',
    glossaryTerms: ['mining-difficulty', 'difficulty-adjustment', 'epoch'],
    keyFigures: [
      { value: '2,016', label: 'Blocks per adjustment', asOf: '2026-08-14', confidence: 'measured', href: '/glossary/epoch' },
      { value: '2,015', label: 'Intervals in that timespan', asOf: '2026-08-14', confidence: 'measured', href: '/methodology/difficulty-index' },
      { value: '0.05 pp', label: 'Bias from dividing by 2,016', asOf: '2026-08-14', confidence: 'measured' },
      { value: '4x', label: 'Maximum move per adjustment', asOf: '2026-08-14', confidence: 'measured' },
    ],
    faq: [
      {
        q: 'How does Bitcoin decide to change mining difficulty?',
        a: 'Every 2,016 blocks the network compares how long those blocks actually took against the target of 20,160 minutes, and scales difficulty by the ratio. A single adjustment cannot move by more than a factor of four.',
      },
      {
        q: 'What is the 2,015 versus 2,016 off-by-one?',
        a: 'The measured timespan spans 2,015 intervals, because that is how many gaps sit between 2,016 blocks. Dividing by 2,016 instead biases every forecast by roughly 0.05 percentage points.',
      },
      {
        q: 'Why should a miner care about difficulty at all?',
        a: 'Difficulty is the denominator of revenue — the same machines earn less bitcoin as it rises. An operation that has not thought about it is carrying an exposure it never chose to take.',
      },
    ],
    body: [
      { heading: 'The feedback loop' },
      'Bitcoin aims to produce one block every ten minutes. It has no clock and no coordinator, so it uses a feedback loop instead: every 2,016 blocks, the network looks at how long those blocks actually took and adjusts how hard the next 2,016 will be.',
      { heading: 'Which way it moves, and by how much' },
      'If the last 2,016 blocks took less than the target 20,160 minutes, more computing power has joined and difficulty rises. If they took longer, capacity has left and difficulty falls. A single adjustment cannot move by more than a factor of four in either direction.',
      { heading: 'The 2,015 interval off-by-one' },
      'The detail that catches most implementations: the timespan measured spans 2,015 intervals, because that is how many gaps sit between 2,016 blocks. Dividing by 2,016 instead biases every forecast by roughly 0.05 percentage points — small, consistent, and enough to make a published number wrong in a way anyone can check.',
      { heading: 'Why it matters to a miner' },
      'For a miner this is not trivia. Difficulty is the denominator of revenue: the same machines earn less bitcoin as it rises. An operation that has not thought about difficulty is carrying an exposure it never chose to take.',
    ],
  },
  {
    slug: 'what-hashprice-means',
    title: 'What hashprice actually measures',
    summary:
      'One number tells a miner whether the machines are worth running. It is also computed differently by everyone who publishes it.',
    level: 'intro',
    publishedAt: '2026-08-14',
    author: 'doefin-research',
    glossaryTerms: ['hashprice', 'hashrate', 'mining-difficulty'],
    keyFigures: [
      { value: '< 1%', label: 'Fee share of the block reward', asOf: '2026-08-16', confidence: 'measured', href: '/glossary/hashprice' },
      { value: '3', label: 'Inputs rolled into one figure', asOf: '2026-08-16', confidence: 'measured', href: '/glossary/hashprice' },
    ],
    faq: [
      {
        q: 'What is hashprice?',
        a: 'The revenue a miner earns per terahash per day. It rolls three moving parts into one figure: the bitcoin price, the network difficulty, and transaction fees.',
      },
      {
        q: 'Why do two sites publish different hashprice figures?',
        a: 'Because no two publishers compute it identically, and the differences sit almost entirely in the price leg — which exchanges are in the basket, how they are weighted, and when the snapshot is taken.',
      },
      {
        q: 'How much of hashprice comes from transaction fees?',
        a: 'Well under one percent of the reward in normal conditions. The price source accounts for essentially all of the spread between published figures.',
      },
    ],
    body: [
      { heading: 'What hashprice is' },
      'Hashprice is the revenue a miner earns per terahash per day. It rolls three moving parts into one figure: the bitcoin price, the network difficulty, and transaction fees.',
      { heading: 'The number that decides whether to run' },
      'It is the number that decides whether a machine covers its power bill. When hashprice falls below a fleet’s all-in cost per terahash, that fleet is losing money every hour it stays on.',
      { heading: 'Why published figures disagree' },
      'The complication is that no two publishers compute it identically. The differences sit almost entirely in the price leg — which exchanges are in the basket, how they are weighted, and when the snapshot is taken. Fees account for well under one percent of the reward in normal conditions; the price source accounts for essentially all of the spread between published figures.',
      { heading: 'What a publisher should disclose' },
      'Anyone quoting hashprice should state their basket, their weighting and their snapshot time. Most do not.',
    ],
  },
  {
    slug: 'why-forecasts-need-error-bars',
    title: 'Why a difficulty forecast without an error bar is not a forecast',
    seoTitle: 'Why difficulty forecasts need error bars',
    summary:
      'Every public estimator publishes a single number. Early in an epoch that number can be wrong by enough to flip its sign.',
    level: 'working',
    publishedAt: '2026-08-18',
    author: 'doefin-research',
    glossaryTerms: ['confidence-interval', 'calibration', 'difficulty-adjustment'],
    keyFigures: [
      { value: '2-3x', label: 'How far Poisson bands understate error', asOf: '2026-08-18', confidence: 'measured', href: '/methodology/difficulty-index' },
      { value: '95%', label: 'Band a calibrated forecaster must hit', asOf: '2026-08-18', confidence: 'measured', href: '/data/scoreboard' },
    ],
    faq: [
      {
        q: 'Why does a difficulty forecast need an error bar?',
        a: 'Because early in an epoch the point estimate rests on almost no evidence, and the honest interval around it can be wide enough to include zero — meaning the direction itself is genuinely uncertain.',
      },
      {
        q: 'Why are theoretically derived confidence bands too narrow?',
        a: 'A band computed from Poisson assumptions alone comes out two to three times too narrow. The interval has to be fitted to measured error, not derived from theory.',
      },
      {
        q: 'What is the right test of a difficulty forecaster?',
        a: 'Not accuracy on any single epoch, but calibration over many: whether the stated 95% band actually contains the outcome about 95% of the time. That can only be answered from a dated public record.',
      },
    ],
    body: [
      { heading: 'How a forecast firms up across an epoch' },
      'A difficulty forecast is a projection from the blocks mined so far in the current epoch. At block 50 of 2,015 it rests on almost no evidence. By block 1,800 it is nearly settled. The number moves the entire way, and the honest uncertainty around it shrinks as it goes.',
      { heading: 'The point without the range' },
      'Every widely used estimator publishes the point and hides the range. That is fine if you are curious and misleading if you are making a decision, because early in an epoch the interval can be wide enough to include zero — meaning the direction itself is genuinely uncertain.',
      { heading: 'Fitting the interval to measured error' },
      'The interval has to be fitted to measured error, not derived from theory. A band computed from Poisson assumptions alone comes out two to three times too narrow, and the first time reality lands outside it, publicly, the credibility is gone.',
      { heading: 'Calibration, not accuracy' },
      'The right test of a forecaster is not accuracy on any single epoch. It is calibration over many: does the stated 95% band actually contain the outcome about 95% of the time? That question can only be answered from a dated public record, which is why we keep one.',
    ],
  },
]

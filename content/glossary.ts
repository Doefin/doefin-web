import type { GlossaryTerm } from './types'

/**
 * Seeded from the tooltip strings already written in the trading app.
 * The short definition is the product — it is what gets quoted. Keep it under
 * 160 characters, factual, and free of product language.
 */
export const glossary: GlossaryTerm[] = [
  {
    slug: 'mining-difficulty',
    term: 'Mining difficulty',
    shortDef:
      'A number expressing how hard it is to find a valid Bitcoin block. It rises when more hashrate joins the network and falls when hashrate leaves.',
    aliases: ['difficulty'],
    updatedAt: '2026-08-20',
    seeAlso: ['difficulty-adjustment', 'epoch', 'hashrate', 'hashprice'],
    body: [
      'Bitcoin targets one block every ten minutes on average. Difficulty is the dial that holds that average steady as the total computing power pointed at the network changes.',
      'For a miner, difficulty is the denominator of their revenue. The same machines earn less bitcoin as difficulty rises, which is why an unhedged operation carries an exposure it did not choose.',
    ],
  },
  {
    slug: 'difficulty-adjustment',
    term: 'Difficulty adjustment',
    shortDef:
      'The recalculation of mining difficulty that happens every 2,016 blocks — roughly every two weeks — based on how quickly the previous 2,016 blocks were mined.',
    aliases: ['retarget'],
    updatedAt: '2026-08-20',
    seeAlso: ['mining-difficulty', 'epoch', 'confidence-interval'],
    body: [
      'The network compares how long the last 2,016 blocks actually took against the 20,160 minutes they should have taken, and scales difficulty by the ratio. A single adjustment is clamped to a factor of four in either direction.',
      'One subtlety trips up most implementations: the timespan spans 2,015 intervals between 2,016 blocks, not 2,016. Dividing by the wrong number biases every forecast by roughly 0.05 percentage points.',
    ],
  },
  {
    slug: 'epoch',
    term: 'Epoch',
    shortDef:
      'A run of 2,016 Bitcoin blocks between two difficulty adjustments, lasting about two weeks.',
    aliases: ['difficulty epoch', 'retarget period'],
    updatedAt: '2026-08-20',
    seeAlso: ['difficulty-adjustment', 'block-height', 'mining-difficulty'],
    body: [
      'Epochs are the natural unit of time for anyone managing difficulty risk. Production, forecasts and settlement all align to epoch boundaries rather than to calendar dates.',
      'Because block times vary, an epoch is identified by block height rather than by date. A date is an estimate until the block actually lands.',
    ],
  },
  {
    slug: 'hashrate',
    term: 'Hashrate',
    shortDef:
      'The total computing power securing the Bitcoin network, measured in hashes per second. It is estimated from difficulty and block times, never measured directly.',
    aliases: ['hash rate', 'network hashrate'],
    updatedAt: '2026-08-20',
    seeAlso: ['mining-difficulty', 'exahash', 'hashprice'],
    body: [
      'No one can observe the network hashrate. What is published is a restatement of difficulty and how fast blocks arrived, which means short-window figures carry wide error bars.',
      'A one-day hashrate estimate has an uncertainty band of roughly plus or minus sixteen percent. A seven-day estimate narrows to about six. Reporting a daily move as a trend is reporting noise.',
    ],
  },
  {
    slug: 'hashprice',
    term: 'Hashprice',
    shortDef:
      'The revenue a miner earns per unit of hashrate per day, usually in dollars per terahash. It combines the bitcoin price, difficulty and transaction fees.',
    updatedAt: '2026-08-20',
    seeAlso: ['hashrate', 'mining-difficulty', 'terahash'],
    body: [
      'Hashprice is the single number that tells a miner whether the machines are worth running. It falls when difficulty rises, when the bitcoin price falls, or when fees dry up.',
      'The term was coined by Luxor in 2019 and is now the industry standard. Different publishers compute it differently — mostly in which exchange prices they use and when they sample — and few disclose the basket.',
    ],
  },
  {
    slug: 'confidence-interval',
    term: 'Confidence interval',
    shortDef:
      'A range around a forecast expressing how uncertain it is. A 95% interval is one expected to contain the true outcome 95 times out of 100.',
    aliases: ['error bar', 'prediction interval'],
    updatedAt: '2026-08-20',
    seeAlso: ['calibration', 'difficulty-adjustment'],
    body: [
      'Every public difficulty forecast is a single number. That number hides how much it could be wrong by — and early in an epoch it can be wrong by a great deal.',
      'An interval only means something if it has been fitted to what actually happened. A band derived from theory rather than from measured error is typically two to three times too narrow, and fails publicly the first time reality tests it.',
    ],
  },
  {
    slug: 'calibration',
    term: 'Calibration',
    shortDef:
      'Whether a stated confidence interval is honest — whether a 95% band really does contain the outcome about 95% of the time when checked over many forecasts.',
    updatedAt: '2026-08-20',
    seeAlso: ['confidence-interval'],
    body: [
      'A forecaster can be accurate on average and still badly calibrated, by quoting intervals that are far too tight. Calibration is the claim almost nobody in this market makes about their own numbers.',
      'It can only be assessed over a run of forecasts, which is why a dated public archive matters more than any single prediction.',
    ],
  },
  {
    slug: 'block-height',
    term: 'Block height',
    shortDef:
      'The position of a block in the Bitcoin chain, counted from the first block. It is the canonical way to identify a moment in Bitcoin time.',
    updatedAt: '2026-08-20',
    seeAlso: ['epoch'],
    body: [
      'Heights are exact and dates are not. A settlement defined at a block height is unambiguous; the same settlement defined by a calendar date depends on how fast blocks happen to arrive.',
    ],
  },
  {
    slug: 'exahash',
    term: 'Exahash',
    shortDef:
      'One quintillion hashes per second, written EH/s. The unit in which total network hashrate and large mining fleets are quoted.',
    aliases: ['EH/s'],
    updatedAt: '2026-08-20',
    seeAlso: ['hashrate', 'terahash'],
    body: [
      'A single modern machine produces a few hundred terahash. A thousand terahash is one petahash; a thousand petahash is one exahash. Large listed miners operate tens of exahash.',
    ],
  },
  {
    slug: 'terahash',
    term: 'Terahash',
    shortDef:
      'One trillion hashes per second, written TH/s. The unit used for individual machines and for quoting hashprice.',
    aliases: ['TH/s'],
    updatedAt: '2026-08-20',
    seeAlso: ['exahash', 'hashprice'],
    body: [
      'Because hashprice is quoted per terahash per day, terahash is the unit in which a fleet’s revenue is most easily reasoned about.',
    ],
  },
  {
    slug: 'block-subsidy',
    term: 'Block subsidy',
    shortDef:
      'The newly issued bitcoin paid to whoever mines a block. It halves roughly every four years and currently stands at 3.125 BTC.',
    aliases: ['block reward'],
    updatedAt: '2026-08-20',
    seeAlso: ['halving', 'transaction-fees'],
    body: [
      'The subsidy plus transaction fees is the total a miner can earn from a block. As the subsidy halves, fees become a larger share of mining revenue.',
    ],
  },
  {
    slug: 'halving',
    term: 'Halving',
    shortDef:
      'The scheduled event every 210,000 blocks — about four years — at which the Bitcoin block subsidy is cut in half.',
    updatedAt: '2026-08-20',
    seeAlso: ['block-subsidy'],
    body: [
      'A halving cuts mining revenue overnight without changing costs, which historically forces the least efficient capacity offline and eventually shows up as a difficulty fall.',
      'Because behaviour before and after a halving differs so much, models fitted across a halving boundary tend to mislead. Fit windows should state which era they cover.',
    ],
  },
  {
    slug: 'transaction-fees',
    term: 'Transaction fees',
    shortDef:
      'The amount users pay to have transactions included in a block, paid to the miner on top of the block subsidy.',
    updatedAt: '2026-08-20',
    seeAlso: ['block-subsidy'],
    body: [
      'Fees are volatile and hard to forecast. They affect production estimates but should never affect settlement, which is why a difficulty contract settles on difficulty alone.',
    ],
  },
  {
    slug: 'mining-pool',
    term: 'Mining pool',
    shortDef:
      'A service that combines many miners’ hashrate and shares the resulting rewards, smoothing the income of participants who would otherwise find blocks rarely.',
    updatedAt: '2026-08-20',
    seeAlso: ['fpps', 'pool-luck'],
    body: [
      'Pools differ in fee, payout scheme and how much variance they absorb. Comparing them honestly is difficult because pool luck swamps a small fee difference over any short window.',
    ],
  },
  {
    slug: 'fpps',
    term: 'FPPS',
    shortDef:
      'Full Pay Per Share: a pool scheme paying a fixed amount per share submitted, including average transaction fees, whether or not the pool finds blocks.',
    aliases: ['full pay per share'],
    updatedAt: '2026-08-20',
    seeAlso: ['mining-pool', 'pool-luck'],
    body: [
      'Under FPPS the pool absorbs variance and charges for it. The miner gets predictable income; the pool takes the risk that a run of bad luck costs more than the fee covers.',
    ],
  },
  {
    slug: 'pool-luck',
    term: 'Pool luck',
    shortDef:
      'How a pool’s actual block discoveries compare with what probability alone predicts. Above 100% means more blocks than expected; below means fewer.',
    updatedAt: '2026-08-20',
    seeAlso: ['mining-pool', 'fpps'],
    body: [
      'Luck is noise, not skill, and it dominates short-run pool comparisons. A pool can look one percent better for months purely by chance — which is why payout comparisons need the variance maths shown alongside them.',
    ],
  },
  {
    slug: 'curtailment',
    term: 'Curtailment',
    shortDef:
      'Deliberately switching mining machines off, usually because power is expensive or the grid needs the capacity back. It reduces both power cost and revenue.',
    updatedAt: '2026-08-20',
    seeAlso: ['uptime', 'hosting'],
    body: [
      'Curtailment terms are one of the least visible line items in a hosting contract, and one of the largest determinants of what a quoted power price actually costs.',
    ],
  },
  {
    slug: 'uptime',
    term: 'Uptime',
    shortDef:
      'The share of time a miner’s machines are actually hashing. Advertised uptime is a target; realised uptime is what determines revenue.',
    updatedAt: '2026-08-20',
    seeAlso: ['curtailment', 'hosting'],
    body: [
      'Hosting providers advertise uptime figures that operators generally cannot verify independently. The gap between advertised and realised uptime is a recurring source of dispute.',
    ],
  },
  {
    slug: 'hosting',
    term: 'Hosting',
    shortDef:
      'Paying a third party to run your mining machines in their facility, typically priced per kilowatt-hour plus fees.',
    updatedAt: '2026-08-20',
    seeAlso: ['curtailment', 'uptime'],
    body: [
      'The advertised power price is rarely the effective price. Management fees, power factor charges, curtailment terms, uptime buffers, pool fees and exit terms all sit between the quoted rate and the number that lands in a wallet.',
    ],
  },
]

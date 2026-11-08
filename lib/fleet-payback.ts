import { networkEHFromDifficulty } from './exposure'

export const fleetPaybackDefaults = {
  th: 1000,        // fleet terahash — roughly five modern machines
  jPerTh: 15,      // efficiency
  power: 0.045,    // $/kWh all-in
  capex: 20000,    // $ — calibrated to the fleet size above
  price: 90000,    // BTC/USD
  diffT: 127.48,
  growth: 1.5,     // % per month, central
  months: 48,
}
export const fleetPaybackAssumptions = {
  blockSubsidyBtc: 3.125,
  blocksPerDay: 144,
  daysPerMonth: 30.4,
}

/** Simplified cumulative cash flow after upfront cost, using subsidy revenue and power cost. */
export function simulateFleetPayback(v: typeof fleetPaybackDefaults, monthlyGrowthPct: number) {
  const { blockSubsidyBtc, blocksPerDay, daysPerMonth } = fleetPaybackAssumptions
  const net0 = networkEHFromDifficulty(v.diffT) * 1e6 // EH/s -> TH/s
  const kWhDay = (v.th * v.jPerTh) / 1000 * 24
  const powerDay = kWhDay * v.power
  let cum = -v.capex
  let paybackMonth: number | null = null
  const series: { m: number; cum: number }[] = []

  for (let m = 1; m <= v.months; m++) {
    const net = net0 * Math.pow(1 + monthlyGrowthPct / 100, m)
    const btcDay = (v.th / net) * blocksPerDay * blockSubsidyBtc
    const revDay = btcDay * v.price
    cum += (revDay - powerDay) * daysPerMonth
    series.push({ m, cum })
    if (paybackMonth === null && cum >= 0) paybackMonth = m
  }
  return { paybackMonth, series, final: cum, powerDay }
}

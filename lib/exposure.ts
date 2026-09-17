export const exposureDefaults = { eh: 1, epochs: 4, diffT: 127.48, low: -2.4, high: 7, fees: 0.05, price: 64000 }
export type ExposureInputs = typeof exposureDefaults
export const networkEHFromDifficulty = (diffT: number) => (diffT * 1e12 * 2 ** 32) / 600 / 1e18

/** Fixed-duration sensitivity; time is expressed as 2016 target block intervals per epoch. */
export function calculateExposure(v: ExposureInputs) {
  const net = networkEHFromDifficulty(v.diffT)
  const prod = (changePct: number) =>
    (v.eh / (net * (1 + changePct / 100))) * 2016 * (3.125 + v.fees) * v.epochs
  const base = prod(0)
  const atLow = prod(v.low)
  const atHigh = prod(v.high)
  return { net, base, atLow, atHigh, lossHigh: base - atHigh, gainLow: atLow - base,
    spreadBtc: atLow - atHigh, spreadUsd: (atLow - atHigh) * v.price, weeks: Math.round(v.epochs * 2) }
}

/** Exact rational arithmetic keeps entered decimal amounts through every estimate.
 * Mirrors app/lib/minersView/math.ts: 2016 blocks, current subsidy, two-decimal
 * protection payout sizing before price multiplication. No order amounts are sent.
 */
type Input = string | number | bigint | Rational
/** BTC production cannot size a different denomination without a conversion source. */
export const supportsProductionSizing = (currency: string) => currency === 'cbBTC'
export function validateMinerInputs(inputs: { hash: string; fees: string; epochs: string; risk: string }, includeRisk: boolean) {
  const value = (text: string) => { try { const result = new Rational(text).number(); return Number.isFinite(result) ? result : NaN } catch { return NaN } }
  const hash = value(inputs.hash), fees = value(inputs.fees), epochs = value(inputs.epochs), risk = value(inputs.risk)
  return {
    hash: hash > 0 ? '' : 'Enter a fleet hashrate greater than 0.',
    fees: fees >= 0 ? '' : 'Enter average fees of 0 or more BTC per block.',
    epochs: epochs >= 0.5 && epochs <= 12 ? '' : 'Enter a production horizon from 0.5 to 12 epochs.',
    risk: !includeRisk || risk > 0 ? '' : 'Enter a collateral risk budget greater than 0 cbBTC.',
  }
}
export class Rational {
  readonly n: bigint
  readonly d: bigint
  constructor(value: Input, denominator = 1n) {
    if (value instanceof Rational) { this.n = value.n; this.d = value.d * denominator; if (this.d === 0n) throw new Error('Cannot divide by zero.'); return }
    const text = String(value)
    const match = /^(-?)(\d+)(?:\.(\d+))?(?:e([+-]?\d+))?$/i.exec(text)
    if (!match) throw new Error('Enter a valid decimal amount.')
    const fraction = match[3] ?? '', exponent = Number(match[4] ?? 0)
    if ((typeof value !== 'bigint' && text.length > 120) || Math.abs(exponent) > 100) throw new Error('The amount is too large.')
    const scale = fraction.length - exponent
    let n = BigInt(`${match[1]}${match[2]}${fraction}`) * (scale < 0 ? 10n ** BigInt(-scale) : 1n)
    let d = denominator * (scale > 0 ? 10n ** BigInt(scale) : 1n)
    if (d === 0n) throw new Error('Cannot divide by zero.')
    if (d < 0n) { n = -n; d = -d }
    let a = n < 0n ? -n : n, b = d
    while (b) [a, b] = [b, a % b]
    this.n = n / a; this.d = d / a
  }
  add(value: Input) { const b = new Rational(value); return new Rational(this.n * b.d + b.n * this.d, this.d * b.d) }
  sub(value: Input) { const b = new Rational(value); return this.add(new Rational(-b.n, b.d)) }
  mul(value: Input) { const b = new Rational(value); return new Rational(this.n * b.n, this.d * b.d) }
  div(value: Input) { const b = new Rational(value); return new Rational(this.n * b.d, this.d * b.n) }
  number() { return Number(this.n) / Number(this.d) }
  fixed(decimals: number) {
    const abs = this.n < 0n ? -this.n : this.n, denominator = this.d < 0n ? -this.d : this.d
    const scaled = abs * 10n ** BigInt(decimals)
    const rounded = scaled / denominator + (scaled % denominator * 2n >= denominator ? 1n : 0n)
    const digits = rounded.toString().padStart(decimals + 1, '0')
    return `${(this.n < 0n) !== (this.d < 0n) ? '-' : ''}${decimals ? `${digits.slice(0, -decimals)}.${digits.slice(-decimals)}` : digits}`
  }
}
export function formatPublicAmount(value: Rational, decimals = 6) {
  const absolute = value.n < 0n ? -value.n : value.n
  if (absolute > 0n && absolute * 1_000_000n < value.d) return value.n < 0n ? '>-0.000001' : '<0.000001'
  if (absolute > 0n && Number(value.fixed(decimals)) === 0) return value.fixed(6)
  return value.fixed(decimals)
}
export function estimateProduction(hashrate: string, unit: 'PH' | 'EH', fees: string, difficulty: number, epochs: string) {
  if (new Rational(hashrate).number() <= 0 || new Rational(fees).number() < 0 || difficulty <= 0 || new Rational(epochs).number() < 0.5 || new Rational(epochs).number() > 12) throw new Error('Check your fleet, fee and horizon inputs.')
  const network = new Rational(difficulty).mul('1000000000000').mul(4294967296n).div(600).div('1000000000000000000')
  return new Rational(hashrate).div(unit === 'PH' ? 1000 : 1).div(network).mul(2016).mul(new Rational(fees).add('3.125')).mul(epochs)
}
export function estimateProtection(production: Rational, currentDifficulty: number, threshold: number, yesPrice: string) {
  const fraction = threshold > currentDifficulty ? new Rational(threshold).sub(currentDifficulty).div(threshold) : new Rational(0)
  const payout = new Rational(production.mul(fraction).fixed(2))
  return { fraction, payout, cost: payout.mul(yesPrice) }
}
export function estimatePremium(risk: string, noPrice: string) {
  if (new Rational(risk).number() <= 0 || new Rational(noPrice).number() <= 0) throw new Error('Enter a positive risk budget.')
  const payout = new Rational(risk).div(noPrice)
  return { payout, netIfNo: payout.sub(risk) }
}

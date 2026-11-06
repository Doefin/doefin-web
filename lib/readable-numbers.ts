/** Presentation only: decimal digits never pass through a floating-point number. */
function decimalParts(value: unknown, shift: number) {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  if (typeof value === 'number' && !Number.isFinite(value)) return null
  const match = /^([+-]?)(\d+(?:\.\d*)?|\.\d+)(?:e([+-]?\d+))?$/i.exec(String(value))
  if (!match) return null
  // Bound expansion, not coefficient precision. The API's exponent limit is 100.
  const exponent = Number(match[3] ?? 0)
  if (!Number.isSafeInteger(exponent) || Math.abs(exponent) > 1000) return null
  const [whole, fraction = ''] = match[2].split('.')
  const digits = whole + fraction
  const point = whole.length + exponent + shift
  const expanded = point <= 0 ? `0.${'0'.repeat(-point)}${digits}`
    : point >= digits.length ? digits + '0'.repeat(point - digits.length)
      : `${digits.slice(0, point)}.${digits.slice(point)}`
  const [integer, decimals = ''] = expanded.split('.')
  return { negative: match[1] === '-', integer: integer.replace(/^0+(?=\d)/, ''), fraction: decimals.replace(/0+$/, '') }
}

function increment(digits: string) {
  const output = digits.split('')
  for (let i = output.length - 1; i >= 0; i--) {
    if (output[i] !== '9') { output[i] = String(Number(output[i]) + 1); return output.join('') }
    output[i] = '0'
  }
  return '1' + output.join('')
}

function rounded(integer: string, fraction: string, places: number) {
  const discarded = fraction.slice(places)
  let digits = integer + fraction.slice(0, places).padEnd(places, '0')
  if (discarded && discarded[0] >= '5') digits = increment(digits)
  digits = digits.padStart(places + 1, '0')
  const whole = digits.slice(0, digits.length - places)
  const decimals = places ? digits.slice(-places).replace(/0+$/, '') : ''
  return { text: whole + (decimals ? '.' + decimals : ''), approximate: /[1-9]/.test(discarded) }
}

function readable(value: unknown, shift: number, unit: string, signed = false, nonnegative = false): string {
  const parts = decimalParts(value, shift)
  if (!parts) return 'Unavailable'
  const { integer, fraction, negative } = parts
  const zero = integer === '0' && fraction === ''
  if (negative && !zero && nonnegative) return 'Unavailable'
  if (zero) return `0${unit}`
  const sign = negative ? '−' : signed ? '+' : ''
  const first = fraction.search(/[1-9]/)
  // Two significant digits keep a small nonzero reading distinct from zero.
  if (integer === '0' && first >= 2) {
    if (first >= 6) {
      const significant = rounded(fraction[first], fraction.slice(first + 1), 1)
      // A carry from 9.99 to 10 shifts the scientific exponent once.
      const carry = significant.text === '10'
      return `${significant.approximate ? '~' : ''}${sign}${carry ? '1' : significant.text}e−${first + 1 - (carry ? 1 : 0)}${unit}`
    }
    const result = rounded(integer, fraction, first + 2)
    return `${result.approximate ? '~' : ''}${sign}${result.text}${unit}`
  }
  const result = rounded(integer, fraction, 2)
  const [whole, decimals] = result.text.split('.')
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `${result.approximate ? '~' : ''}${sign}${grouped}${decimals ? '.' + decimals : ''}${unit}`
}

export const readableDifficulty = (value: unknown) => readable(value, -12, 'T', false, true)
export const readableHashrate = (value: unknown) => readable(value, -18, ' EH/s', false, true)
/** The backend supplies a ratio. Shift its decimal point two places for %. */
export const readablePercentageChange = (ratio: unknown) => readable(ratio, 2, '%', true)

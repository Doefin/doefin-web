import 'server-only'
import { cache } from 'react'

/**
 * Invite links (SCRUM-571). The API builds them as `<PUBLIC_APP_URL>/?ref=CODE`, with
 * PUBLIC_APP_URL set to this site, so `/?ref=CODE` redirects to `/invite?ref=CODE`
 * (next.config.mjs). The invite page reads the public lookup below, then "Enter app"
 * carries the code into the trading app, which keeps it until the visitor joins.
 */

/** Same rule as the trading app (doefin-frontend `lib/rewards/inviteCode.ts`). */
const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,30}[A-Z0-9]$/

export const normalizeInviteCode = (raw: unknown): string | null => {
  const value = Array.isArray(raw) ? raw[0] : raw
  if (typeof value !== 'string' || !value) return null
  const code = value.trim().toUpperCase()
  return CODE_PATTERN.test(code) ? code : null
}

export type InviteLookup =
  | { status: 'found'; partner: string | null; bonus: string | null; programActive: boolean }
  | { status: 'not-found' }
  | { status: 'unavailable' }

type TokenAmount = { symbol: string; decimals: number; amount: string }

const isTokenAmount = (value: unknown): value is TokenAmount => {
  if (!value || typeof value !== 'object') return false
  const row = value as Record<string, unknown>
  return (
    typeof row.symbol === 'string' && /^[A-Za-z0-9._-]{1,16}$/.test(row.symbol) &&
    Number.isInteger(row.decimals) && (row.decimals as number) >= 0 && (row.decimals as number) <= 36 &&
    typeof row.amount === 'string' && /^\d{1,78}$/.test(row.amount)
  )
}

/** "1,250.5 mUSDT": exact whole-token value from raw units, as the trading app shows it. */
const formatTokenAmount = ({ symbol, decimals, amount }: TokenAmount): string => {
  const raw = BigInt(amount)
  const unit = BigInt(10) ** BigInt(decimals)
  const whole = (raw / unit).toLocaleString('en-GB')
  const fraction = decimals ? (raw % unit).toString().padStart(decimals, '0').replace(/0+$/, '') : ''
  return `${whole}${fraction ? `.${fraction}` : ''} ${symbol}`
}

/** Any one of the amounts applies; zero amounts pay nothing and are never shown. */
const formatBonus = (value: unknown): string | null => {
  if (!Array.isArray(value)) return null
  const amounts = value.filter(isTokenAmount).filter(({ amount }) => BigInt(amount) > BigInt(0))
  return amounts.length ? amounts.map(formatTokenAmount).join(' or ') : null
}

const apiBase = () => (process.env.DOFIN_API_BASE_URL || 'https://api.doefin.com').replace(/\/+$/, '')

/**
 * The public `GET /v3/rewards/codes/{code}`: the affiliate's name (null for a personal
 * code, whose owner stays anonymous), the welcome bonus and whether the programme runs.
 * 404 means the code does not exist or is switched off. Cached per request, so the
 * page and its metadata share one call.
 */
export const lookupInvite = cache(async (code: string): Promise<InviteLookup> => {
  try {
    const response = await fetch(`${apiBase()}/v3/rewards/codes/${encodeURIComponent(code)}`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(8_000),
      headers: { Accept: 'application/json' },
    })
    if (response.status === 404) return { status: 'not-found' }
    if (!response.ok) return { status: 'unavailable' }
    const body: unknown = await response.json()
    if (!body || typeof body !== 'object') return { status: 'unavailable' }
    const row = body as Record<string, unknown>
    if (typeof row.program_active !== 'boolean') return { status: 'unavailable' }
    const partner = typeof row.partner === 'string' && row.partner.trim() ? row.partner.trim().slice(0, 80) : null
    return { status: 'found', partner, bonus: formatBonus(row.welcome_bonus), programActive: row.program_active }
  } catch {
    return { status: 'unavailable' }
  }
})

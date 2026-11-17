/** Probe only the fixed application origin; never forward caller URLs or headers. */
export const dynamic = 'force-dynamic'
/** The trading app (NEXT_PUBLIC_TRADING_APP_URL, set per environment). */
const APP_ORIGIN = new URL(process.env.NEXT_PUBLIC_TRADING_APP_URL || 'https://app.doefin.com').origin
export async function GET() {
  let supported = false
  try {
    const response = await fetch(`${APP_ORIGIN}/api/market-review-support`, {
      cache: 'no-store', signal: AbortSignal.timeout(8_000), headers: { Accept: 'application/json' },
    })
    if (response.ok) {
      const body: unknown = await response.json()
      supported = !!body && typeof body === 'object' && 'version' in body && body.version === 1
    }
  } catch { /* An unavailable app cannot accept a verified review handoff. */ }
  return Response.json({ supported }, { headers: { 'Cache-Control': 'no-store' } })
}

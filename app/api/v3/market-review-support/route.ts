/** Probe only the fixed application origin; never forward caller URLs or headers. */
export const dynamic = 'force-dynamic'
export async function GET() {
  let supported = false
  try {
    const response = await fetch('https://www.doefin.com/api/market-review-support', {
      cache: 'no-store', signal: AbortSignal.timeout(8_000), headers: { Accept: 'application/json' },
    })
    if (response.ok) {
      const body: unknown = await response.json()
      supported = !!body && typeof body === 'object' && 'version' in body && body.version === 1
    }
  } catch { /* An unavailable app cannot accept a verified review handoff. */ }
  return Response.json({ supported }, { headers: { 'Cache-Control': 'no-store' } })
}

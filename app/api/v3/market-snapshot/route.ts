import { getPublicMarketSnapshot, PublicMarketDataUnavailable } from '@/lib/server/public-market-snapshot'
export const dynamic = 'force-dynamic'
export async function GET() {
  try {
    return Response.json(await getPublicMarketSnapshot(), { headers: { 'Cache-Control': 'no-store' } })
  } catch (failure) {
    const restricted = failure instanceof PublicMarketDataUnavailable && failure.status === 451
    return Response.json({ error: restricted ? 'Market data is unavailable in this location.' : 'Market data could not be refreshed. Please try again.' }, { status: restricted ? 451 : 503, headers: { 'Cache-Control': 'no-store' } })
  }
}

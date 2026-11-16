import { getDifficultyImpactSnapshot } from '@/lib/server/difficulty-impact'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await getDifficultyImpactSnapshot()
  const status = result.status === 'available' ? 200 : result.status === 'region-restricted' ? 451 : 503
  return Response.json(result, { status, headers: { 'Cache-Control': 'no-store' } })
}

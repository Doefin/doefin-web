import { researchCsv, researchRows } from '@/lib/research-data'
export function GET(request: Request) {
  const format = new URL(request.url).searchParams.get('format') ?? 'json'
  if (format === 'json') return Response.json(researchRows, { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'public, max-age=3600' } })
  if (format !== 'csv') return Response.json({ error: 'Use format=json or format=csv' }, { status: 400, headers: { 'X-Robots-Tag': 'noindex, nofollow' } })
  return new Response(researchCsv(), { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="doefin-observed-adjustments-v1.csv"', 'Cache-Control': 'public, max-age=3600' } })
}

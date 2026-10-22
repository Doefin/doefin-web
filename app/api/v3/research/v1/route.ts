import { researchManifest } from '@/lib/research-data'
export const dynamic = 'force-static'
export function GET() { return Response.json(researchManifest(), { headers: { 'X-Robots-Tag': 'noindex, nofollow' } }) }

import { researchCapture } from '@/lib/research-data'
export const dynamic = 'force-static'
export function GET() { return new Response(researchCapture.sourceRaw, { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Content-Type': 'application/json; charset=utf-8', 'X-Content-SHA256': researchCapture.sourceSha256 } }) }

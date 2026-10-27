import { allGlossary } from '@/content'
import { renderLlms } from '@/lib/llms'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(renderLlms(await allGlossary()), { headers: { 'content-type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}

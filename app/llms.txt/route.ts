import { allGlossary, allV3Editorial, allV3Docs, allGuides } from '@/content'
import { renderLlms } from '@/lib/llms'

export const dynamic = 'force-dynamic'

export async function GET() {
  return new Response(renderLlms(await allGlossary(), [...await allV3Editorial('blog'), ...await allV3Editorial('academy')], await allV3Docs(), await allGuides()), { headers: { 'content-type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' } })
}

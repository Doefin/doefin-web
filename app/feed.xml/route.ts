import { allV3Editorial, allV3Reports } from '@/content'
import { renderEditorialFeed } from '@/lib/editorial-feed'
export const dynamic = 'force-dynamic'
export async function GET() {
  return new Response(renderEditorialFeed(await allV3Editorial('blog'), await allV3Reports()), {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

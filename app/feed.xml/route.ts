import { allV3Editorial, allReports } from '@/content'
import { renderEditorialFeed } from '@/lib/editorial-feed'
export const dynamic = 'force-dynamic'
export async function GET() {
  return new Response(renderEditorialFeed(await allV3Editorial('blog'), allReports()), {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'no-store' },
  })
}

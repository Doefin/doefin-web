import { timingSafeEqual } from 'node:crypto'
import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const expected = process.env.SANITY_PREVIEW_SECRET
  const supplied = request.nextUrl.searchParams.get('secret') ?? ''
  if (!expected || !process.env.SANITY_API_READ_TOKEN) return new Response('Preview is not configured', { status: 503 })
  const a = Buffer.from(expected), b = Buffer.from(supplied)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return new Response('Unauthorized', { status: 401 })
  const slug = request.nextUrl.searchParams.get('slug') ?? ''
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return new Response('Invalid glossary slug', { status: 400 })
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(`/v3/glossary/${slug}`, request.url), { headers: { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' } })
}

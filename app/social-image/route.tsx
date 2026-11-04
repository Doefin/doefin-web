import { ImageResponse } from 'next/og'
import config from '@/tailwind.config'

export const dynamic = 'force-static'

/** One explicit, local social image for every V3 preview page. */
export function GET() {
  const colors = config.theme.extend.colors
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '60px 72px', background: colors.ink, color: colors.body, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 34, fontWeight: 700 }}>
        <div style={{ width: 14, height: 34, background: colors.brand, borderRadius: 4 }} />
        Doefin
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', marginTop: 76 }}>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -4 }}>Trade and hedge Bitcoin hashrate exposure</div>
        <div style={{ fontSize: 42, marginTop: 18, color: colors.highlight }}>through markets on mining difficulty.</div>
      </div>
      <div style={{ display: 'flex', marginTop: 'auto', paddingTop: 28, borderTop: `1px solid ${colors.active}`, color: colors.subtle, fontSize: 24 }}>
        Educational prototype · Illustrative examples
      </div>
    </div>,
    { width: 1200, height: 630, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  )
}

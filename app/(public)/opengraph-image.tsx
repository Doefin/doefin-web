import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Without this, every share and many AI previews render a blank card. Built with
 * the brand tokens rather than a screenshot so it stays correct as the site changes.
 */
export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0A0F1C',
          padding: '72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: '#3475FE' }} />
          <div style={{ color: '#838EA7', fontSize: 24, letterSpacing: 4, textTransform: 'uppercase' }}>
            Doefin
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ color: '#E8ECF4', fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Every difficulty forecast
          </div>
          <div style={{ color: '#3475FE', fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            is a bare number.
          </div>
          <div style={{ color: '#838EA7', fontSize: 30, marginTop: 24, maxWidth: 900 }}>
            We publish the error bar.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 40, color: '#99A2B5', fontSize: 22 }}>
          <div style={{ display: 'flex' }}>doefin.com</div>
          <div style={{ display: 'flex' }}>Open Bitcoin mining data</div>
        </div>
      </div>
    ),
    size,
  )
}

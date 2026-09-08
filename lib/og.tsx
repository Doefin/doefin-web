import { ImageResponse } from 'next/og'
import type { KeyFigure } from '@/content/types'
import { site } from './site'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

/**
 * The share card for a single piece.
 *
 * This is where a banner actually earns its keep. On the page itself, an image
 * sits six pixels above a headline the reader is already looking at; in Slack, on
 * LinkedIn, or on a Perplexity result card it is the whole first impression, and
 * it arrives before the reader does.
 *
 * Until now every article shared the site-wide card, so a link to the difficulty
 * report and a link to the glossary looked identical when pasted.
 *
 * Built from brand tokens and the piece's own frontmatter rather than a
 * screenshot or a designed asset: nothing to re-cut when a token moves, and no
 * human minutes per article. Deliberately typographic — an abstract glowing panel
 * above a difficulty forecast marks the forecast down for a professional reader.
 */
export function articleCard({
  eyebrow,
  title,
  figures = [],
  footer,
}: {
  eyebrow: string
  title: string
  figures?: KeyFigure[]
  footer?: string
}) {
  const shown = figures.slice(0, 3)

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
          padding: '68px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: '#3475FE' }} />
          <div style={{ color: '#838EA7', fontSize: 22, letterSpacing: 4, textTransform: 'uppercase' }}>
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            color: '#E8ECF4',
            fontSize: title.length > 78 ? 50 : 60,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: -1.6,
            display: 'flex',
          }}
        >
          {title}
        </div>

        {shown.length ? (
          <div style={{ display: 'flex', gap: 56 }}>
            {shown.map((f) => (
              <div key={f.label} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ color: '#3475FE', fontSize: 42, fontWeight: 800, letterSpacing: -1 }}>
                  {f.value}
                </div>
                <div style={{ color: '#838EA7', fontSize: 19, marginTop: 6, maxWidth: 300 }}>
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex' }} />
        )}

        <div style={{ display: 'flex', gap: 32, color: '#99A2B5', fontSize: 20 }}>
          <div style={{ display: 'flex' }}>doefin.com</div>
          {footer ? <div style={{ display: 'flex' }}>{footer}</div> : null}
          <div style={{ display: 'flex' }}>{site.tagline}</div>
        </div>
      </div>
    ),
    OG_SIZE,
  )
}

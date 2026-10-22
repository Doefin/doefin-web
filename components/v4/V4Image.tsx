import Image, { type ImageProps } from 'next/image'

/** Responsive delivery for the reviewed artwork; keep the small historical JPEG exact. */
export function V4Image({ sizes, src, ...props }: ImageProps) {
  const filename = typeof src === 'string' ? src : ''
  const imageSizes = filename.includes('doefin-logo') ? '128px'
    : filename.includes('position-') ? '(max-width: 639px) 45vw, 220px'
    : filename.includes('observation-') ? '(max-width: 639px) 100vw, 520px'
    : filename.includes('payout-') ? '(max-width: 639px) 100vw, 380px'
    : filename.includes('product-updates') ? '(max-width: 639px) 240px, 490px'
    : '(max-width: 639px) 100vw, 720px'
  return <Image {...props} src={src} sizes={sizes ?? imageSizes} unoptimized={filename.endsWith('.jpg')} />
}

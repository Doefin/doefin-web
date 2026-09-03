import Image from 'next/image'
import Link from 'next/link'

/**
 * The brand wordmark is a white lockup built for dark grounds, carried over from
 * the trading app. Never place it on a light surface without the dark plate.
 */
export function Logo({ className = 'w-[104px]' }: { className?: string }) {
  return (
    <Link href="/" aria-label="Doefin — home" className="inline-flex shrink-0 items-center">
      <Image
        src="/images/logo/logo-white.png"
        alt="Doefin"
        width={1800}
        height={241}
        priority
        className={`${className} h-auto`}
      />
    </Link>
  )
}

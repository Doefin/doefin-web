import { clsx } from '@/lib/clsx'

export function Container({
  children,
  className,
  size = 'default',
}: {
  children: React.ReactNode
  className?: string
  size?: 'default' | 'narrow'
}) {
  return (
    <div
      className={clsx(
        'mx-auto w-full px-5 sm:px-8',
        size === 'narrow' ? 'max-w-3xl' : 'max-w-container',
        className,
      )}
    >
      {children}
    </div>
  )
}

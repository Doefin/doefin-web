import Link from 'next/link'
import { Container } from './Container'
import { Logo } from './Logo'
import { nav, site } from '@/lib/site'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink/85 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <Logo />
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-white/[0.04] hover:text-body"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/for/miners"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-body lg:inline-block"
            >
              For miners
            </Link>
            <a
              href={site.appUrl}
              className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
            >
              Open app
            </a>
          </div>
        </div>

        {/* Small screens: the primary nav becomes a scrollable strip rather than a
            hidden menu, so every destination stays one tap away. */}
        <nav aria-label="Sections" className="-mx-5 flex gap-1 overflow-x-auto px-5 pb-3 md:hidden">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg bg-white/[0.04] px-3 py-1.5 text-sm font-medium text-muted"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  )
}

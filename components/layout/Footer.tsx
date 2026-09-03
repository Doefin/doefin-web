import Link from 'next/link'
import { Container } from './Container'
import { Logo } from './Logo'
import { footerNav, site } from '@/lib/site'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.07] bg-surface/40">
      <Container>
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <Logo className="w-[96px]" />
            <p className="mt-4 text-sm leading-relaxed text-muted">{site.tagline}</p>
            <p className="mt-4 text-xs leading-relaxed text-muted/70">
              {site.entity}. Doefin is available to professional investors only. Nothing on this
              site is investment advice.
            </p>
          </div>

          {footerNav.map((col) => (
            <div key={col.title}>
              <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted/70">
                {col.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-subtle transition-colors hover:text-body">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/[0.07] py-6 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.entity}, {site.registeredIn}. All rights reserved.
            <br className="hidden sm:block" />
            Doefin is directed at professional investors only. Nothing published here is
            investment advice or a recommendation, and anyone who is not a professional
            investor should not act on or rely on it.
          </p>
          <p>
            Data published here is free to use with attribution.{' '}
            <Link href="/resources" className="text-brand hover:underline">
              API and datasets
            </Link>
          </p>
        </div>
      </Container>
    </footer>
  )
}

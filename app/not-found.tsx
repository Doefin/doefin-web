import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui'

export const metadata = { title: 'Page not found', robots: { index: false, follow: true } }

export default function NotFound() {
  return (
    <Container size="narrow" className="py-28 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">404</p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-[-0.03em]">This page does not exist</h1>
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
        Published pages here keep their address permanently, so a broken link usually means a typo
        rather than something moved.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/data/difficulty">Current forecast</Button>
        <Button href="/glossary" variant="secondary">
          Glossary
        </Button>
      </div>
    </Container>
  )
}

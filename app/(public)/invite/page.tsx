import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Container } from '@/components/layout/Container'
import { Button } from '@/components/ui'
import { lookupInvite, normalizeInviteCode, type InviteLookup } from '@/lib/server/invite'
import { seo } from '@/lib/seo'
import { tradingAppOrigin } from '@/lib/site'
import { inviteCopy } from './copy'

/**
 * The invite landing page (SCRUM-571). Invite links are `<this site>/?ref=CODE`, which
 * redirects here (next.config.mjs). The trading app captures the code from its own
 * `?ref=` and keeps it until the visitor joins Doefin Rewards.
 */
export const dynamic = 'force-dynamic'

type Props = { searchParams: Promise<{ ref?: string | string[] }> }

/**
 * The Doefin Rewards terms, as the trading app publishes them (REWARDS_TERMS_URL, the
 * same setting as the app's NEXT_PUBLIC_REWARDS_TERMS_URL; a path is on the app's host).
 * Unset means the terms are not published, so the app keeps joining closed. This page
 * then promises no bonus either (LEGAL-1).
 */
const rewardsTermsUrl = (): string | null => {
  const value = process.env.REWARDS_TERMS_URL?.trim()
  if (!value) return null
  try {
    const url = new URL(value, tradingAppOrigin)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

type Rendered = {
  heading: string
  body: readonly string[]
  note: string | null
  showTermsLink: boolean
  carryCode: boolean
}

const fill = (text: string, values: { partner?: string | null; bonus?: string | null }) =>
  text.replace('{partner}', values.partner ?? '').replace('{bonus}', values.bonus ?? '')

const render = (lookup: InviteLookup, termsUrl: string | null): Rendered => {
  const { states } = inviteCopy
  if (lookup.status === 'not-found') return { ...states.notFound, carryCode: false }
  if (lookup.status === 'unavailable') return { ...states.lookupUnavailable, carryCode: true }

  const { partner, bonus, programActive } = lookup
  const values = { partner, bonus }
  const pick = (state: { heading: string; headingPersonal?: string }) =>
    partner ? fill(state.heading, values) : fill(state.headingPersonal ?? state.heading, values)

  // Joining needs both a running programme and published terms, as in the app.
  if (!programActive || !termsUrl) {
    const state = states.programmeInactive
    return { ...state, heading: pick(state), carryCode: true }
  }
  if (!bonus) {
    const state = states.noBonus
    return { ...state, heading: pick(state), carryCode: true }
  }
  const state = partner ? states.partnerBonus : states.personalBonus
  return {
    ...state,
    heading: fill(state.heading, values),
    body: state.body.map((line) => fill(line, values)),
    carryCode: true,
  }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const code = normalizeInviteCode((await searchParams).ref)
  const lookup = code ? await lookupInvite(code) : null
  const partner = lookup?.status === 'found' ? lookup.partner : null
  const meta = partner ? inviteCopy.meta.partner : inviteCopy.meta.generic
  return {
    ...seo({ title: fill(meta.title, { partner }), description: meta.description, path: '/invite', absoluteTitle: true }),
    // A personal link: never indexed.
    robots: { index: false, follow: false },
  }
}

export default async function Invite({ searchParams }: Props) {
  const raw = (await searchParams).ref
  if (raw === undefined) redirect('/')
  const code = normalizeInviteCode(raw)
  const lookup: InviteLookup = code ? await lookupInvite(code) : { status: 'not-found' }
  const termsUrl = rewardsTermsUrl()
  const page = render(lookup, termsUrl)
  const appHref = page.carryCode && code ? `${tradingAppOrigin}/?ref=${encodeURIComponent(code)}` : `${tradingAppOrigin}/`

  return (
    <Container className="py-12 sm:py-16">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">{page.heading}</h1>
        {page.body.map((line) => (
          <p key={line} className="mt-5 text-base leading-relaxed text-subtle">{line}</p>
        ))}
      </header>
      <div className="mt-8 max-w-3xl">
        <Button href={appHref} external>{inviteCopy.button}</Button>
        {page.note && <p className="mt-4 text-sm leading-relaxed text-subtle">{page.note}</p>}
        {page.showTermsLink && termsUrl && (
          <p className="mt-3 text-sm">
            <a href={termsUrl} className="text-highlight underline underline-offset-4">{inviteCopy.termsLink}</a>
          </p>
        )}
        <p className="mt-8 border-t border-white/10 pt-5 text-xs leading-relaxed text-subtle">{inviteCopy.disclaimer}</p>
      </div>
    </Container>
  )
}

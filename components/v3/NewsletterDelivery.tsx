'use client'

import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import Link from '@/components/routing/SiteLink'
import type { ExposureInputs } from '@/lib/exposure'
import { validateEngagement } from '@/lib/newsletter-contract'
import { createScenarioBrief, formatScenarioBtc } from '@/lib/scenario-brief'
import { emitV3Measurement } from '@/lib/v3-measurement'
import styles from './ProductUpdates.module.css'

/** Explicit demo: no network transport, mailto, storage or captured recipient. */
export function NewsletterDelivery({ kind, inputs }: { kind: 'report' | 'scenario'; inputs?: ExposureInputs }) {
  const id = useId()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [previewKey, setPreviewKey] = useState<string | null>(null)
  const key = JSON.stringify([kind, inputs])
  const brief = useMemo(() => inputs ? createScenarioBrief(inputs, null, null) : null, [inputs])
  useEffect(() => setReady(true), [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      validateEngagement({ kind, email: values.get('email'), consent: values.has('consent'), inputs, token: '' })
      setError(''); setPreviewKey(key)
      ;(form.elements.namedItem('email') as HTMLInputElement).value = ''
      emitV3Measurement('identification_request', { kind, result: 'demo-preview' })
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Check the form details.'); setPreviewKey(null); (form.elements.namedItem(!values.get('email') ? 'email' : !values.has('consent') ? 'consent' : 'email') as HTMLElement)?.focus() }
  }
  return <div className="mt-5">
    <h3 className="text-base font-semibold">{kind === 'scenario' ? 'Preview a scenario email' : 'Preview a report and dataset email'} <span className="ml-1 text-xs font-normal text-subtle">Demo</span></h3>
    <p id={`${id}-notice`} className="mt-2 text-xs leading-relaxed text-subtle">Preview the email content. No email is sent, no personal details are saved and no newsletter subscription is created.</p>
    <form className={styles.form} noValidate onSubmit={submit} onChange={() => { setError(''); setPreviewKey(null) }}>
      <label htmlFor={`${id}-email`}>Email address</label>
      <div className={styles.formGrid}><input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} disabled={!ready} required placeholder="you@example.com" aria-describedby={`${id}-notice ${id}-error`} /></div>
      <label className={styles.consent}><input type="checkbox" name="consent" required />I understand this is a demo and want to preview the email.</label>
      <div className={styles.controls}><button type="submit" disabled={!ready}>Preview {kind === 'scenario' ? 'scenario email' : 'report email'} <span aria-hidden>→</span></button></div>
      <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>
      {previewKey === key ? <section className={styles.confirmation} role="status" aria-live="polite" aria-label="Demo email preview">
        <strong>Demo email prepared. Nothing was sent.</strong>
        {kind === 'report' ? <><p>Subject: Doefin difficulty report and dataset</p><p>Read the report on past difficulty adjustments, check its sources and reuse the dataset. These observations do not show how well a forecast would have performed.</p><p><Link href="/api/v3/research/v1/report">Open printable report</Link><br /><Link href="/api/v3/research/v1/dataset?format=csv">Open CSV dataset</Link><br /><Link href="/api/v3/research/v1">Check sources &amp; publication status</Link></p></> : <><p>Subject: Your Doefin difficulty scenario</p><p>This preview shows the calculator’s seven numerical inputs and expected BTC production in three scenarios. Your discussion notes are excluded.</p><dl>{brief?.inputRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{brief ? <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[24rem] border-collapse text-left text-xs"><caption className="mb-2 text-left font-semibold">Production over the selected horizon</caption><thead><tr>{['Difficulty case', 'Production', 'Versus unchanged'].map(label => <th key={label} scope="col" className="border-b border-white/15 px-2 py-2 font-semibold">{label}</th>)}</tr></thead><tbody>{brief.scenarios.map(row => <tr key={row.label}><th scope="row" className="border-b border-white/10 px-2 py-2 font-normal">{row.label}</th><td className="border-b border-white/10 px-2 py-2">{row.production}</td><td className="border-b border-white/10 px-2 py-2">{row.difference}</td></tr>)}</tbody></table></div> : null}<p>Difference between selected cases: {brief ? formatScenarioBtc(brief.results.spreadBtc) : '—'}. This is an illustrative production comparison, not a forecast, contract payout or trading recommendation.</p><p>Use Download brief above to save the complete document now.</p></>}
        <p>The address you entered has been cleared. This demo creates no email request or newsletter subscription.</p>
      </section> : null}
    </form>
  </div>
}

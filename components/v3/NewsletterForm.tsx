'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'
import Link from '@/components/routing/SiteLink'
import { EngagementError, newsletterRoles, validateEngagement, type NewsletterRequest } from '@/lib/newsletter-contract'
import { emitV3Measurement } from '@/lib/v3-measurement'
import styles from './ProductUpdates.module.css'

export function NewsletterForm() {
  const id = useId()
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState('')
  const [preview, setPreview] = useState<Omit<NewsletterRequest, 'email' | 'token'> | null>(null)
  useEffect(() => setReady(true), [])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      const request = validateEngagement({ kind: 'newsletter', email: values.get('email'), role: values.get('role'), company: values.get('company'), domain: values.get('domain'), research: values.has('research'), product: values.has('product'), alerts: values.has('alerts'), consent: values.has('consent'), token: '' })
      if (request.kind !== 'newsletter') return
      const { email: _email, token: _token, ...summary } = request
      setPreview(summary); setError(''); setErrorField('')
      // A local interaction signal only. Identity and preferences never enter analytics.
      emitV3Measurement('identification_request', { kind: 'newsletter', result: 'demo-preview' })
      ;(form.elements.namedItem('email') as HTMLInputElement).value = ''
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Check the form details.')
      setPreview(null)
      const field = cause instanceof EngagementError ? cause.field || 'email' : 'email'
      setErrorField(field)
      const target = form.elements.namedItem(field) as HTMLElement
      const optional = target?.closest('details')
      if (optional) optional.open = true
      target?.focus()
    }
  }
  return <form className={styles.form} aria-label="Research newsletter demo" noValidate onSubmit={submit} onChange={() => { setError(''); setErrorField(''); setPreview(null) }}>
    <p id={`${id}-notice`} className={styles.notice}>Interactive demo. No email is sent and no personal details are saved. Entries clear when you leave or reload this page.</p>
    <div className={styles.formGrid}>
      <div><label htmlFor={`${id}-email`}>Email address</label><input id={`${id}-email`} name="email" aria-invalid={errorField === 'email' || undefined} type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} required disabled={!ready} placeholder="you@example.com" aria-describedby={`${id}-notice ${id}-error`} /></div>
      <div><label htmlFor={`${id}-role`}>Your role</label><select id={`${id}-role`} name="role" aria-invalid={errorField === 'role' || undefined} aria-describedby={`${id}-error`} required disabled={!ready} defaultValue=""><option value="" disabled>Choose a role</option>{newsletterRoles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
    </div>
    <details className={styles.optional}><summary>Company context <span>Optional</span></summary><p>Only what you choose to share. We do not infer your company from your email.</p><div className={styles.formGrid}><div><label htmlFor={`${id}-company`}>Company</label><input id={`${id}-company`} name="company" aria-invalid={errorField === 'company' || undefined} aria-describedby={`${id}-error`} maxLength={120} autoComplete="organization" /></div><div><label htmlFor={`${id}-domain`}>Company domain</label><input id={`${id}-domain`} name="domain" aria-invalid={errorField === 'domain' || undefined} aria-describedby={`${id}-error`} maxLength={253} placeholder="example.com" autoCapitalize="none" spellCheck={false} /></div></div></details>
    <fieldset className={styles.preferences}><legend>Email preferences</legend>
      <label><input type="checkbox" name="research" aria-invalid={errorField === 'research' || undefined} aria-describedby={`${id}-error`} defaultChecked />Difficulty adjustment research &amp; published findings</label>
      <label><input type="checkbox" name="product" />Product updates</label>
      <label><input type="checkbox" name="alerts" />Publication alerts <span>(demo; not scheduled)</span></label>
    </fieldset>
    <label className={styles.consent}><input type="checkbox" name="consent" aria-invalid={errorField === 'consent' || undefined} aria-describedby={`${id}-error`} required />I understand this is a demo and want to preview these email preferences.</label>
    <div className={styles.controls}><button type="submit" disabled={!ready}>Preview email preferences <span aria-hidden>→</span></button></div>
    <p id={`${id}-error`} role="alert" className={styles.error}>{error}</p>
    <p className={styles.privacy}><Link href="/v3/privacy">Privacy policy</Link> · Future live emails require confirmation and include unsubscribe controls.</p>
    {preview ? <div className={styles.confirmation} role="status" aria-live="polite" tabIndex={-1}>
      <strong>Demo preferences prepared. You are not subscribed.</strong>
      <dl><div><dt>Role</dt><dd>{newsletterRoles.find(([role]) => role === preview.role)?.[1]}</dd></div><div><dt>Selected emails</dt><dd>{[preview.research && 'Difficulty adjustment research', preview.product && 'Product updates', preview.alerts && 'Publication alerts'].filter(Boolean).join(', ')}</dd></div>{preview.company ? <div><dt>Company you entered</dt><dd>{preview.company}</dd></div> : null}{preview.domain ? <div><dt>Domain you entered</dt><dd>{preview.domain}</dd></div> : null}</dl>
      <p>No request was sent, no email address was retained and no alert was scheduled.</p><Link href="/v3/newsletter#sample-issue">Read an example research email →</Link>
    </div> : null}
    <noscript><p className={styles.notice}>Enable JavaScript to preview preferences. Public research remains available without this form.</p></noscript>
  </form>
}

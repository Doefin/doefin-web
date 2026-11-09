'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import Link from '@/components/routing/SiteLink'
import { EngagementError, newsletterRoles, validateEngagement, type NewsletterRequest } from '@/lib/newsletter-contract'
import { emitV3Measurement } from '@/lib/v3-measurement'
import { Arrow } from './Arrow'
import { NewsletterRolePicker } from './NewsletterRolePicker'
import homeStyles from './HomeResearchEmail.module.css'
import legacyStyles from './ProductUpdates.module.css'

export function NewsletterForm({ homepage = false, describedBy }: { homepage?: boolean; describedBy?: string }) {
  const id = useId()
  const errorId = `${id}-error`
  const noticeId = describedBy ?? `${id}-notice`
  const styles = homepage ? homeStyles : legacyStyles
  const roleTrigger = useRef<HTMLButtonElement>(null)
  const confirmation = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState('')
  const [preview, setPreview] = useState<Omit<NewsletterRequest, 'email' | 'token'> | null>(null)

  useEffect(() => setReady(true), [])
  useEffect(() => {
    if (homepage && preview) confirmation.current?.focus()
  }, [homepage, preview])

  function clearFeedback() {
    setError('')
    setErrorField('')
    setPreview(null)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    try {
      const request = validateEngagement({ kind: 'newsletter', email: values.get('email'), role: values.get('role'), company: values.get('company'), domain: values.get('domain'), research: values.has('research'), product: values.has('product'), alerts: values.has('alerts'), consent: values.has('consent'), token: '' })
      if (request.kind !== 'newsletter') return
      const { email: _email, token: _token, ...summary } = request
      clearFeedback()
      setPreview(summary)
      // A local interaction signal only. Identity and preferences never enter analytics.
      emitV3Measurement('identification_request', { kind: 'newsletter', result: 'demo-preview' })
      const email = form.elements.namedItem('email') as HTMLInputElement
      email.value = ''
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Check the form details.')
      setPreview(null)
      const field = cause instanceof EngagementError ? cause.field || 'email' : 'email'
      setErrorField(field)
      const target = homepage && field === 'role' ? roleTrigger.current : form.elements.namedItem(field) as HTMLElement | null
      const optional = target?.closest('details')
      if (optional) optional.open = true
      target?.focus()
    }
  }

  const details = <>
    <div className={styles.formGrid}>
      <div>
        <label htmlFor={`${id}-email`}>Email address</label>
        <input id={`${id}-email`} name="email" aria-invalid={errorField === 'email' || undefined} type="email" autoComplete="email" inputMode="email" autoCapitalize="none" spellCheck={false} maxLength={254} required disabled={!ready} placeholder="you@example.com" aria-describedby={`${noticeId} ${errorId}`} />
      </div>
      <div>
        <label id={`${id}-role-label`} htmlFor={`${id}-role`}>Your role</label>
        {homepage
          ? <NewsletterRolePicker id={`${id}-role`} errorId={errorId} invalid={errorField === 'role'} disabled={!ready} triggerRef={roleTrigger} onChange={clearFeedback} />
          : <select id={`${id}-role`} name="role" aria-invalid={errorField === 'role' || undefined} aria-describedby={errorId} required disabled={!ready} defaultValue="">
              <option value="" disabled>Choose a role</option>
              {newsletterRoles.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>}
      </div>
    </div>
    <details className={styles.optional}>
      <summary>{homepage
        ? <><span>Company context <span className={homeStyles.optionalLabel}>Optional</span></span><span className={homeStyles.companyIndicator} aria-hidden="true" /></>
        : <>Company context <span>Optional</span></>}
      </summary>
      <p>{homepage ? 'We do not work out your company from your email address.' : 'These fields are optional. We do not work out your company from your email address.'}</p>
      <div className={styles.formGrid}>
        <div>
          <label htmlFor={`${id}-company`}>Company</label>
          <input id={`${id}-company`} name="company" aria-invalid={errorField === 'company' || undefined} aria-describedby={errorId} maxLength={120} autoComplete="organization" />
        </div>
        <div>
          <label htmlFor={`${id}-domain`}>Company domain</label>
          <input id={`${id}-domain`} name="domain" aria-invalid={errorField === 'domain' || undefined} aria-describedby={errorId} maxLength={253} placeholder="example.com" autoCapitalize="none" spellCheck={false} />
        </div>
      </div>
    </details>
  </>

  const checkMark = homepage ? <span className={homeStyles.checkMark} aria-hidden="true" /> : null

  return <form className={styles.form} aria-label="Research newsletter demo" aria-describedby={describedBy} noValidate onSubmit={submit} onChange={clearFeedback}>
    {!homepage && <p id={noticeId} className={styles.notice}>Try the email preferences below. This is a demo: you will not be subscribed, no email is sent and no personal details are saved. Entries clear when you leave or reload the page.</p>}
    {homepage
      ? <div className={homeStyles.identity}>
          <h4>Your details</h4>
          {details}
        </div>
      : details}
    <fieldset className={styles.preferences}>
      <legend>Email preferences</legend>
      <label>
        <input type="checkbox" name="research" aria-invalid={errorField === 'research' || undefined} aria-describedby={errorId} defaultChecked />
        {checkMark}
        {homepage ? <span>Difficulty adjustment research and published findings</span> : 'Difficulty adjustment research & published findings'}
      </label>
      <label>
        <input type="checkbox" name="product" />
        {checkMark}
        {homepage ? <span>Product updates</span> : 'Product updates'}
      </label>
      <label>
        <input type="checkbox" name="alerts" />
        {checkMark}
        {homepage ? <span>Publication alerts <span className={homeStyles.note}>(demo only)</span></span> : <>Publication alerts <span>(demo; not scheduled)</span></>}
      </label>
    </fieldset>
    <div className={homepage ? homeStyles.formEnd : undefined}>
      <label className={styles.consent}>
        <input type="checkbox" name="consent" aria-invalid={errorField === 'consent' || undefined} aria-describedby={errorId} required />
        {checkMark}
        <span>I understand this is a demo and want to preview these email preferences.</span>
      </label>
      <div className={styles.controls}>
        <button type="submit" className={homepage ? 'v37-button' : undefined} disabled={!ready}>
          Preview email preferences {homepage ? <Arrow diagonal /> : <span aria-hidden>→</span>}
        </button>
      </div>
      <p id={errorId} role="alert" className={styles.error}>{error}</p>
      <p className={styles.privacy}><Link href="/privacy">Privacy policy</Link> · A live subscription would require confirmation and include an unsubscribe link.</p>
      {preview && <div ref={confirmation} className={styles.confirmation} role="status" aria-live="polite" tabIndex={-1}>
        <strong>Demo preferences prepared. You are not subscribed.</strong>
        <dl>
          <div><dt>Role</dt><dd>{newsletterRoles.find(([role]) => role === preview.role)?.[1]}</dd></div>
          <div><dt>Selected emails</dt><dd>{[preview.research && 'Difficulty adjustment research', preview.product && 'Product updates', preview.alerts && 'Publication alerts'].filter(Boolean).join(', ')}</dd></div>
          {preview.company && <div><dt>Company you entered</dt><dd>{preview.company}</dd></div>}
          {preview.domain && <div><dt>Domain you entered</dt><dd>{preview.domain}</dd></div>}
        </dl>
        {homepage
          ? <p className={homeStyles.note}>No email was sent or saved. No alert was scheduled.</p>
          : <><p>No request was sent, no email address was retained and no alert was scheduled.</p><Link href="/newsletter#sample-issue">Read an example research email →</Link></>}
      </div>}
      <noscript><p className={styles.notice}>Enable JavaScript to preview preferences. Public research remains available without this form.</p></noscript>
    </div>
  </form>
}

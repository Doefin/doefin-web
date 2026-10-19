'use client'

import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import Link from '@/components/routing/SiteLink'
import { Arrow } from './Arrow'
import styles from './ProductUpdates.module.css'

/** Local form preview only: no request, persistence or simulated subscription. */
export function ProductUpdates() {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [ready, setReady] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [previewed, setPreviewed] = useState(false)

  // Prevent native form submission before the preview handler is attached.
  useEffect(() => setReady(true), [])

  const emailError = () => {
    if (!email.trim()) return 'Enter your email address.'
    if (input.current?.validity.typeMismatch) return 'Enter a valid email, like you@example.com.'
    return ''
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const message = emailError()
    setError(message)
    if (message) {
      setPreviewed(false)
      input.current?.focus()
      return
    }
    setEmail(email.trim())
    setPreviewed(true)
  }

  return <div className={styles.layout} data-reveal>
    <div className={styles.copy}>
      <p className={`v37-eyebrow ${styles.eyebrow}`}>
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="14" rx="3" />
          <path d="m4 7 6.7 5a2.2 2.2 0 0 0 2.6 0L20 7" />
        </svg>
        Stay informed
      </p>
      <h2 id="updates-title" className="v37-heading">Get Doefin product updates.</h2>
      <p className={`v37-copy ${styles.description}`}>New features and changes to the app, in your inbox.</p>
    </div>
    <form className={styles.form} aria-labelledby="updates-title" noValidate onSubmit={submit}>
      <label htmlFor={`${id}-email`}>Email address</label>
      <div className={styles.controls}>
        <div className={styles.field}>
          <input
            ref={input}
            id={`${id}-email`}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            required
            maxLength={254}
            disabled={!ready}
            value={email}
            placeholder="you@example.com"
            aria-invalid={error ? true : undefined}
            aria-describedby={`${id}-notice${error ? ` ${id}-error` : ''}`}
            onChange={event => { setEmail(event.target.value); setError(''); setPreviewed(false) }}
            onBlur={() => { if (email.trim()) setError(emailError()) }}
          />
          <p id={`${id}-error`} className={styles.error} role="alert">{error}</p>
        </div>
        <button type="submit" disabled={!ready}>Subscribe <Arrow /></button>
      </div>
      <p className={styles.privacy}><Link href="/v3/privacy">Privacy policy</Link></p>
      <p id={`${id}-notice`} className={styles.notice} role="status" aria-live="polite" aria-atomic="true">
        <span aria-hidden="true">{previewed ? '↳' : '○'}</span>
        {previewed ? 'Preview complete. No email was submitted or saved.' : 'Form preview only. No email is submitted or saved.'}
      </p>
      <noscript><p className={styles.notice}>Enable JavaScript to try this form preview.</p></noscript>
    </form>
  </div>
}

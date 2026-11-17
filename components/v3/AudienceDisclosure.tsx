import type { ReactNode } from 'react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr'
import styles from './AudienceDisclosure.module.css'

/** Native disclosure keeps supporting text in the server-rendered HTML. */
export function AudienceDisclosure({ summary, children, className = '' }: {
  summary: string
  children: ReactNode
  className?: string
}) {
  return <details className={`${styles.disclosure} ${className}`}>
    <summary className={styles.summary}>
      <span>{summary}</span>
      <CaretDown className={styles.caret} size={18} aria-hidden="true" />
    </summary>
    <div className={styles.content}>{children}</div>
  </details>
}

'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { CaretDown, Check } from '@phosphor-icons/react'
import { languages, type Language } from '@/lib/languages'
import styles from './LanguageSelector.module.css'

function Flag({ country }: { country: (typeof languages)[Language]['flag'] }) {
  return <Image src={`/images/language-flags/${country}.svg`} alt="" width={20} height={15} className={styles.flag} unoptimized />
}

export function LanguageSelector({ language, label }: { language: Language; label: string }) {
  const disclosure = useRef<HTMLDetailsElement>(null)
  const trigger = useRef<HTMLElement>(null)
  const current = languages[language]

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      if (disclosure.current && !disclosure.current.contains(event.target as Node)) {
        disclosure.current.open = false
      }
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [])

  return (
    <details className={styles.selector} ref={disclosure}
      onBlur={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false
      }}
      onKeyDown={event => {
        if (event.key !== 'Escape' || !event.currentTarget.open) return
        event.preventDefault()
        event.stopPropagation()
        event.currentTarget.open = false
        trigger.current?.focus()
      }}
    >
      <summary ref={trigger} className={styles.trigger} aria-label={`${label}: ${current.name}`}>
        <Flag country={current.flag} />
        <span lang={current.tag}>{current.code}</span>
        <CaretDown className={styles.chevron} size={12} aria-hidden="true" />
      </summary>
      <div className={styles.panel}>
        <p>{label}</p>
        <ul>
          {(Object.entries(languages) as [Language, typeof current][]).map(([code, option]) => (
            <li key={code}>
              <a href={option.path} lang={option.tag} hrefLang={option.tag}
                aria-current={code === language ? 'true' : undefined}
                onClick={event => {
                  event.currentTarget.href = option.path + window.location.search + window.location.hash
                }}
              >
                <Flag country={option.flag} />
                <span>{option.name}</span>
                {code === language && <Check size={16} aria-hidden="true" />}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </details>
  )
}

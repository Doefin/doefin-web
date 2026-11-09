'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type Ref } from 'react'
import { newsletterRoles } from '@/lib/newsletter-contract'
import styles from './HomeResearchEmail.module.css'

type Props = {
  id: string
  errorId: string
  invalid: boolean
  disabled: boolean
  triggerRef: Ref<HTMLButtonElement>
  onChange: () => void
}

export function NewsletterRolePicker({ id, errorId, invalid, disabled, triggerRef, onChange }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [active, setActive] = useState<number | null>(null)
  const control = useRef<HTMLDivElement>(null)
  const activeOption = useRef<HTMLLIElement>(null)
  const search = useRef({ text: '', time: 0 })
  const open = active !== null
  const lastOption = newsletterRoles.length - 1
  const optionId = (index: number) => `${id}-option-${index}`

  function close() {
    search.current = { text: '', time: 0 }
    setActive(null)
  }

  function select(index: number) {
    setSelected(index)
    close()
    onChange()
  }

  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    const { key } = event
    if (key === 'Tab') {
      if (active !== null) select(active)
      return
    }
    if (key === 'Escape' && open) {
      event.preventDefault()
      close()
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (active === null) setActive(selected ?? 0)
      else select(active)
      return
    }
    if (key === 'Home' || key === 'End' || key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      if (key === 'Home') setActive(0)
      else if (key === 'End') setActive(lastOption)
      else if (active === null) setActive(selected ?? 0)
      else setActive(Math.max(0, Math.min(lastOption, active + (key === 'ArrowDown' ? 1 : -1))))
      return
    }
    if (key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const time = Date.now()
      const text = (time - search.current.time < 600 ? search.current.text : '') + key.toLowerCase()
      search.current = { text, time }
      const match = newsletterRoles.findIndex(([, label]) => label.toLowerCase().startsWith(text))
      if (match >= 0) setActive(match)
    }
  }

  useEffect(() => {
    if (!open) return
    function dismissOutside(event: PointerEvent) {
      if (event.target instanceof Node && !control.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', dismissOutside)
    return () => document.removeEventListener('pointerdown', dismissOutside)
  }, [open])

  useEffect(() => {
    const option = activeOption.current
    const list = option?.parentElement
    if (!option || !list) return
    const optionRect = option.getBoundingClientRect()
    const listRect = list.getBoundingClientRect()
    if (optionRect.bottom > listRect.bottom) list.scrollTop += optionRect.bottom - listRect.bottom
    if (optionRect.top < listRect.top) list.scrollTop -= listRect.top - optionRect.top
  }, [active])

  const role = selected === null ? null : newsletterRoles[selected]
  return <div className={styles.roleControl} ref={control}>
    <input type="hidden" name="role" value={role?.[0] ?? ''} />
    <button
      id={id}
      ref={triggerRef}
      type="button"
      role="combobox"
      className={styles.roleTrigger}
      aria-labelledby={`${id}-label`}
      aria-describedby={errorId}
      aria-controls={`${id}-listbox`}
      aria-expanded={open}
      aria-activedescendant={active === null ? undefined : optionId(active)}
      aria-invalid={invalid || undefined}
      aria-required="true"
      disabled={disabled}
      onClick={() => open ? close() : setActive(selected ?? 0)}
      onBlur={close}
      onKeyDown={keyboard}
    >
      <span>{role?.[1] ?? 'Choose a role'}</span>
      <svg viewBox="0 0 20 20" aria-hidden="true" fill="none"><path d="m5 8 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    <ul id={`${id}-listbox`} className={styles.roleList} role="listbox" aria-labelledby={`${id}-label`} hidden={!open} onMouseDown={event => event.preventDefault()}>
      {newsletterRoles.map(([value, label], index) => <li
        key={value}
        id={optionId(index)}
        role="option"
        ref={index === active ? activeOption : undefined}
        aria-selected={selected === index}
        data-active={index === active || undefined}
        onClick={() => select(index)}
      >{label}</li>)}
    </ul>
  </div>
}

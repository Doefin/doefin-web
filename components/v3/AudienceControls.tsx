'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import styles from './audience-controls.module.css'

/** Typographic identifiers, not representations of official token logos. */
export function TokenChip({ currency, compact = false }: { currency: string; compact?: boolean }) {
  const monogram = currency === 'BTC' ? '₿' : currency === 'cbBTC' ? 'cb' : currency === 'USDC' ? '$' : currency.slice(0, 2)
  return <span className={`${styles.token} ${compact ? styles.compact : ''}`} data-token-chip={currency} title={currency}><span className={styles.monogram} aria-hidden="true">{monogram}</span><span>{currency}</span></span>
}

export function OutcomeChip({ side }: { side: 'yes' | 'no' }) {
  return <span className={styles.outcome} data-outcome={side}>{side === 'yes' ? 'Yes' : 'No'}</span>
}

export function CollateralSelect({ value, currencies, onChange, disabled = false }: { value: string; currencies: string[]; onChange: (value: string) => void; disabled?: boolean }) {
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [position, setPosition] = useState({ left: 0, top: 0, width: 230, maxHeight: 300 })
  const options = ['all', ...currencies.filter(currency => currency !== 'all')]
  const optionsKey = options.join('\u0000')
  const visibleActive = Math.min(active, options.length - 1)
  function measurePosition() {
    const rect = trigger.current?.getBoundingClientRect()
    if (!rect) return null
    const margin = 12, gap = 7
    if (rect.bottom < margin || rect.top > window.innerHeight - margin) return null
    const width = Math.min(Math.max(rect.width, 230), window.innerWidth - margin * 2)
    const below = Math.max(0, window.innerHeight - rect.bottom - margin - gap)
    const above = Math.max(0, rect.top - margin - gap)
    const useBelow = below >= Math.min(220, above)
    const maxHeight = Math.min(300, useBelow ? below : above)
    const contentHeight = menu.current ? menu.current.scrollHeight + 2 : options.length * 46 + 14
    return { left: Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin)), top: useBelow ? rect.bottom + gap : Math.max(margin, rect.top - gap - Math.min(maxHeight, contentHeight)), width, maxHeight }
  }
  function show(boundary?: 'first' | 'last') {
    if (disabled) return
    const initialPosition = measurePosition()
    if (!initialPosition) return
    setPosition(initialPosition)
    const selected = options.indexOf(value)
    setActive(boundary === 'last' ? options.length - 1 : boundary === 'first' ? 0 : Math.max(0, selected))
    setOpen(true)
  }
  function close(returnFocus = false) {
    setOpen(false)
    if (returnFocus) trigger.current?.focus()
  }
  function choose(index: number) {
    const option = options[index]
    if (option !== undefined && option !== value) onChange(option)
    close(true)
  }
  function keyboard(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Tab') { close(); return }
    if (event.key === 'Escape' && open) { event.preventDefault(); close(true); return }
    if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) {
      event.preventDefault()
      if (!open) { show(event.key === 'End' ? 'last' : event.key === 'Home' ? 'first' : undefined); return }
      if (event.key === 'Enter' || event.key === ' ') choose(visibleActive)
      else if (event.key === 'Home') setActive(0)
      else if (event.key === 'End') setActive(options.length - 1)
      else setActive(index => (Math.min(index, options.length - 1) + (event.key === 'ArrowDown' ? 1 : -1) + options.length) % options.length)
    }
  }
  useLayoutEffect(() => {
    if (!open) return
    function place() {
      const nextPosition = measurePosition()
      if (!nextPosition) { setOpen(false); return }
      setPosition(nextPosition)
    }
    function outside(event: PointerEvent) {
      if (!trigger.current?.contains(event.target as Node) && !menu.current?.contains(event.target as Node)) close()
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    document.addEventListener('pointerdown', outside)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true); document.removeEventListener('pointerdown', outside) }
  }, [open, optionsKey, options.length])
  useEffect(() => { if (disabled) setOpen(false) }, [disabled])
  useEffect(() => { if (open) document.getElementById(`${id}-option-${visibleActive}`)?.scrollIntoView({ block: 'nearest' }) }, [open, visibleActive, id])
  return <div className={styles.selectWrap}><span id={`${id}-label`} className={styles.selectLabel}>Collateral</span><button ref={trigger} type="button" role="combobox" aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="listbox" aria-controls={`${id}-listbox`} aria-expanded={open} aria-activedescendant={open ? `${id}-option-${visibleActive}` : undefined} disabled={disabled} className={styles.trigger} onClick={() => open ? close() : show()} onKeyDown={keyboard}><span id={`${id}-value`} className={styles.selectedValue}>{value === 'all' ? <span className={styles.allLabel}><span className={styles.allIcon} aria-hidden="true">◈</span>All collateral</span> : <><TokenChip currency={value} compact />{!currencies.includes(value) && <span className={styles.unavailable}>Unavailable</span>}</>}</span><svg aria-hidden="true" viewBox="0 0 16 16" className={open ? styles.chevronOpen : styles.chevron}><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></button>{open && createPortal(<div ref={menu} id={`${id}-listbox`} role="listbox" aria-labelledby={`${id}-label`} className={styles.menu} style={position}>{options.map((option, index) => <div id={`${id}-option-${index}`} key={option} role="option" aria-selected={value === option} className={`${styles.option} ${visibleActive === index ? styles.optionActive : ''}`} onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)}>{option === 'all' ? <span className={styles.allLabel}><span className={styles.allIcon} aria-hidden="true">◈</span>All collateral</span> : <TokenChip currency={option} compact />}<span className={styles.check} aria-hidden="true">{value === option ? '✓' : ''}</span></div>)}</div>, document.body)}</div>
}

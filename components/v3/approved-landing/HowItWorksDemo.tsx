'use client'

import type { HowItWorksCopy } from '@/dictionaries'

import { useEffect, useRef, useState } from 'react'
import { site } from '@/lib/site'
import styles from './HowItWorksDemo.module.css'

const markets = [
  { threshold: '127.5T', yes: '0.97', no: '0.07' },
  { threshold: '129.5T', yes: '0.93', no: '0.13' },
  { threshold: '131.5T', yes: '0.65', no: '0.39' },
  { threshold: '133.5T', yes: '0.32', no: '0.72' },
]

type DepositMethod = 'transfer' | 'bitcoin' | 'extension'

function TransferIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" /><path d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75V16.5zM16.5 6.75h.75v.75h-.75v-.75z" /></svg>
}

function ExtensionIcon() {
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3m18-3V6" /></svg>
}

function DepositIcon({ method }: { method: DepositMethod }) {
  if (method === 'transfer') return <TransferIcon />
  if (method === 'bitcoin') return <span className={styles.bitcoin} aria-hidden="true">₿</span>
  return <ExtensionIcon />
}

export function HowItWorksDemo({ copy }: { copy: HowItWorksCopy }) {
  const [marketIndex, setMarketIndex] = useState<number | null>(null)
  const [marketSide, setMarketSide] = useState<'Yes' | 'No' | null>(null)
  const [deposit, setDeposit] = useState<DepositMethod | null>(null)
  const [depositForm, setDepositForm] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])
  const amountInputRef = useRef<HTMLInputElement>(null)
  const depositOptionsRef = useRef<HTMLDivElement>(null)

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  function replay() {
    clearTimers()
    setMarketIndex(null)
    setMarketSide(null)
    setDeposit(null)
    setDepositForm(false)
    timers.current = [
      setTimeout(() => { setMarketIndex(1); setMarketSide('Yes') }, 900),
      setTimeout(() => setDeposit('extension'), 2500),
      setTimeout(() => setDepositForm(true), 3500),
    ]
  }

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setMarketIndex(1)
      setMarketSide('Yes')
      setDeposit('extension')
      setDepositForm(true)
      return
    }
    replay()
    return clearTimers
  }, [])

  function chooseMarket(index: number, side: 'Yes' | 'No') {
    clearTimers()
    setMarketIndex(index)
    setMarketSide(side)
  }

  function chooseDeposit(method: DepositMethod) {
    if (method === 'bitcoin') return
    clearTimers()
    setDeposit(method)
    setDepositForm(false)
    if (method === 'extension') {
      timers.current = [setTimeout(() => {
        setDepositForm(true)
        amountInputRef.current?.focus()
      }, 450)]
    }
  }

  function cancelDeposit() {
    clearTimers()
    setDepositForm(false)
    depositOptionsRef.current?.querySelector<HTMLButtonElement>('[data-method="extension"]')?.focus()
  }

  return (
    <section id="how-it-works" className={styles.section} aria-labelledby="how-heading">
      <div className={styles.headingRow}>
        <h2 id="how-heading">{copy.heading}</h2>
        <button type="button" className={styles.replay} onClick={replay}>{copy.replay}</button>
      </div>

      <ol className={styles.steps}>
        <li className={styles.step}>
          <div className={`${styles.stage} ${styles.marketStage}`}>
            <table className={styles.marketTable} aria-label={copy.illustrativeMarkets}>
              <thead><tr><th scope="col">{copy.difficultyThreshold}</th><th scope="col" className={styles.yesLabel}>{copy.buyYes}</th><th scope="col">{copy.currency}</th><th scope="col" className={styles.noLabel}>{copy.buyNo}</th></tr></thead>
              <tbody>{markets.map((market, index) => <tr key={market.threshold} data-selected={marketIndex === index || undefined}>
                <th scope="row">{market.threshold}</th>
                <td><button type="button" className={styles.yesPrice} aria-pressed={marketIndex === index && marketSide === 'Yes'} onClick={() => chooseMarket(index, 'Yes')}>{market.yes}</button></td>
                <td><span className={styles.coin} aria-label={copy.bitcoin}>₿</span></td>
                <td><button type="button" className={styles.noPrice} aria-pressed={marketIndex === index && marketSide === 'No'} onClick={() => chooseMarket(index, 'No')}>{market.no}</button></td>
              </tr>)}</tbody>
            </table>
          </div>
          <div className={styles.copy}><span>01</span><h3>{copy.chooseMarket}</h3><p>{copy.chooseMarketDescription}</p></div>
        </li>

        <li className={styles.step}>
          <div className={`${styles.stage} ${styles.depositStage}`} data-form-open={depositForm || undefined}>
            <div ref={depositOptionsRef} className={styles.depositOptions} aria-hidden={depositForm} inert={depositForm}>
              <p className={styles.panelTitle}>{copy.deposit}</p>
              <DepositOption method="transfer" title={copy.transferCrypto} description={copy.anyWalletShowQr} selected={deposit === 'transfer'} onClick={chooseDeposit} />
              <DepositOption method="bitcoin" title={copy.depositBitcoin} description={copy.btcToCbbtcComingSoon} selected={false} onClick={chooseDeposit} disabled />
              <DepositOption method="extension" title={copy.fromExtension} description={copy.connectedWalletDirectTransfer} selected={deposit === 'extension'} onClick={chooseDeposit} />
            </div>
            <div className={styles.depositForm} aria-hidden={!depositForm} inert={!depositForm}>
              <p className={styles.panelTitle}>{copy.depositFromExtension}</p>
              <label className={styles.amountLabel} htmlFor="how-deposit-amount">{copy.amount}</label>
              <div className={styles.amountInput}><input ref={amountInputRef} id="how-deposit-amount" value="0.5 cbBTC" inputMode="decimal" readOnly /><button type="button">{copy.max}</button></div>
              <p className={styles.gasHint}>{copy.gasHint}</p>
              <div className={styles.formActions}><button type="button" onClick={cancelDeposit}>{copy.cancel}</button><button type="button" disabled>{copy.deposit}</button></div>
            </div>
          </div>
          <div className={styles.copy}><span>02</span><h3>{copy.fundAccountAndTrade}</h3><p>{copy.fundAccountDescription}</p></div>
        </li>

        <li className={styles.step}>
          <div className={`${styles.stage} ${styles.tradeStage}`}>
            <div className={styles.tradeBar}><div className={styles.orderToggle}><button type="button" aria-pressed="true">{copy.market}<span>{copy.marketDescription}</span></button><button type="button">{copy.limit}<span>{copy.limitDescription}</span></button></div></div>
            <div className={styles.outcomes} role="group" aria-label={copy.tradeOutcome}><Outcome copy={copy} side="Yes" price="0.62" chance="62" active /><Outcome copy={copy} side="No" price="0.41" chance="41" /></div>
            <div className={styles.orderForm}><div className={styles.orderLabel}><label htmlFor="how-sell-amount">{copy.howManySharesSell}</label></div><div className={styles.orderInput}><input id="how-sell-amount" value="0.5" inputMode="decimal" readOnly /><span>{copy.shares}</span></div><button type="button" className={styles.sellButton}>{copy.sellYes}</button></div>
          </div>
          <div className={styles.copy}><span>03</span><h3>{copy.tradeOrSettle}</h3><p>{copy.tradeOrSettleDescription}</p></div>
        </li>
      </ol>

      <div className={styles.foundation}><p><strong>{copy.illustrativePayoutExample}</strong>{' '}{copy.payoutExample}</p><p>{copy.payoutIncludesBeforeFees}</p></div>
      <div className={styles.action}><a href={site.appUrl} data-v3-cta="app" data-v3-placement="how">{copy.exploreMarkets}</a></div>
    </section>
  )
}

function DepositOption({ method, title, description, selected, disabled, onClick }: { method: DepositMethod; title: string; description: string; selected: boolean; disabled?: boolean; onClick: (method: DepositMethod) => void }) {
  return <button type="button" data-method={method} className={styles.depositOption} aria-pressed={selected} disabled={disabled} onClick={() => onClick(method)}><span className={styles.depositIcon}><DepositIcon method={method} /></span><span><strong>{title}</strong><small>{description}</small></span><span className={styles.chevron} aria-hidden="true">›</span></button>
}

function Outcome({ side, price, chance, active = false, copy }: { side: 'Yes' | 'No'; price: string; chance: string; active?: boolean; copy: HowItWorksCopy }) {
  return <button type="button" className={styles.outcome} data-side={side.toLowerCase()} aria-pressed={active}><span><strong>{side === 'Yes' ? copy.sellYes : copy.sellNo}{side === 'Yes' ? '↑' : '↓'}</strong><b>{price} <small>mUSDT</small></b></span><em>{copy.chance.replace('{chance}', chance)}</em></button>
}

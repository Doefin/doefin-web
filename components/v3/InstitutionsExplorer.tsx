'use client'

import { useEffect, useRef, useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { marketIdentity as identity, type PublicMarket } from '@/lib/public-markets'
import { usePublicMarkets } from './usePublicMarkets'
import { MarketReviewButton } from './MarketReviewButton'
import { Arrow } from './Arrow'
import { CollateralSelect, OutcomeChip, TokenChip } from './AudienceControls'
import styles from './audience.module.css'

const integer = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 0 })
const difficulty = (value: number) => value.toLocaleString('en-US', { maximumFractionDigits: 4 })
const price = (value: string) => Number(value) > 0 && Number(value) < 0.000001 ? '<0.000001' : Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 })

export function InstitutionsExplorer() {
  const { snapshot, loading, error, stale, refresh } = usePublicMarkets()
  const [currency, setCurrency] = useState('all')
  const [selection, setSelection] = useState<PublicMarket | null>(null)
  const [side, setSide] = useState<'yes' | 'no'>('yes')
  const initialized = useRef(false)
  const inspector = useRef<HTMLElement>(null)
  useEffect(() => {
    if (snapshot && !initialized.current) {
      initialized.current = true
      setSelection(snapshot.markets[0] ?? null)
    }
  }, [snapshot])
  const markets = snapshot?.markets ?? []
  const currencies = Array.from(new Set(markets.map(market => market.currency))).sort()
  const filtered = markets.filter(market => currency === 'all' || market.currency === currency)
  const selected = selection ? markets.find(market => identity(market) === identity(selection)) : undefined
  const selectMarket = (market: PublicMarket) => {
    setSelection(market)
    if (window.matchMedia('(max-width: 767px)').matches) inspector.current?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }
  const retry = () => { void refresh().catch(() => {}) }
  return <section id="market-explorer" aria-labelledby="desk-markets-title" className={styles.explorer}>
    <div className={styles.explorerTop}>
      <div><p className={styles.eyebrow}>Read-only market explorer</p><h2 id="desk-markets-title">Start with the contract.</h2></div>
      <div className={styles.sourceStatus} aria-live="polite"><span>{loading ? 'Updating snapshot…' : stale ? 'Snapshot needs refreshing' : snapshot ? 'Snapshot from Doefin' : 'Market data unavailable'}</span>{snapshot && <time dateTime={snapshot.fetchedAt}>{new Date(snapshot.fetchedAt).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })} UTC</time>}<button type="button" onClick={retry} disabled={loading}>Refresh <span aria-hidden="true">↻</span></button></div>
    </div>
    {snapshot && <dl className={styles.networkStrip}><div><dt>Current network difficulty</dt><dd>{difficulty(snapshot.currentDifficultyTrillions)}<span>T</span></dd></div><div><dt>Current block</dt><dd>{integer(snapshot.currentBlock)}</dd></div><div><dt>Priced active contracts</dt><dd>{markets.length}</dd></div></dl>}
    {error && <p className={styles.error} role="alert">{error} {snapshot ? 'The last snapshot is shown below. Refresh before continuing.' : 'Try refreshing to load available contracts.'}</p>}
    {!snapshot && loading ? <div className={styles.empty} role="status"><span className={styles.eyebrow}>Fetching the public snapshot</span><h3>Loading active contracts…</h3><p>Observation blocks, thresholds and indicative prices will appear here.</p></div> : !snapshot ? <div className={styles.empty}><h3>We could not load market data.</h3><p>Prices and contract selections are unavailable until a snapshot can be verified.</p><button onClick={retry} type="button" className={styles.textLink}>Try again <Arrow /></button></div> : <div className={styles.workspace}>
      <div className={styles.marketBrowser}>
        <div className={styles.browserTop}><h3>Available contracts <span>{filtered.length}</span></h3><CollateralSelect value={currency} currencies={currencies} disabled={loading} onChange={value => { setCurrency(value); setSelection(null) }} /></div>
        <p className={styles.listHint}>Choose a threshold and observation block. Contracts without both reference prices are omitted.</p>
        <div className={styles.marketList} role="group" aria-label="Choose a difficulty contract">{filtered.length ? filtered.map(market => <button key={identity(market)} type="button" aria-pressed={!!selection && identity(selection) === identity(market)} onClick={() => selectMarket(market)} className={styles.marketRow}>
          <span className={styles.contractLabel}><TokenChip currency={market.currency} compact /><span>Block {integer(market.targetBlock)}</span></span>
          <span className={styles.strike}>{difficulty(market.difficultyTrillions)}<span>T threshold</span><Arrow /></span>
          <span className={styles.rowPrices}><span><OutcomeChip side="yes" /> <strong>{price(market.yesPrice)}</strong></span><span><OutcomeChip side="no" /> <strong>{price(market.noPrice)}</strong></span><span>Indicative</span></span>
        </button>) : <div className={styles.listEmpty}><h3>No active contracts found.</h3><p>{currency === 'all' ? 'Refresh later to check availability.' : 'Choose another collateral or show all contracts.'}</p></div>}</div>
      </div>
      <article className={styles.inspector} ref={inspector} aria-labelledby="contract-inspector-title">
        {!selected ? <div className={styles.inspectorEmpty}><p className={styles.eyebrow}>Contract inspector</p><h3 id="contract-inspector-title">{selection ? 'This contract is no longer available.' : 'Choose a contract to inspect.'}</h3><p>{selection ? `Your ${selection.currency} / block ${integer(selection.targetBlock)} / ${difficulty(selection.difficultyTrillions)}T selection is missing from the current snapshot. Choose a contract explicitly to continue.` : 'Select an available contract to compare the Yes and No outcomes and see its settlement block.'}</p></div> : <>
          <div className={styles.inspectorHeading}><span className={styles.eyebrow}>Contract inspector</span><span className={styles.collateral}><TokenChip currency={selected.currency} /> collateral</span></div>
          <h3 id="contract-inspector-title">Will difficulty be at or above <strong>{difficulty(selected.difficultyTrillions)}T</strong> at block <strong>{integer(selected.targetBlock)}</strong>?</h3>
          <dl className={styles.contractFacts}><div><dt>Observation block</dt><dd>{integer(selected.targetBlock)}</dd></div><div><dt>Settlement block</dt><dd>{integer(selected.settlementBlock)}</dd></div></dl>
          <fieldset className={styles.outcomes}><legend>Choose the outcome to review</legend>{(['yes', 'no'] as const).map(outcome => <label key={outcome} className={side === outcome ? styles.outcomeSelected : styles.outcome}><input type="radio" name="desk-outcome" value={outcome} checked={side === outcome} onChange={() => setSide(outcome)} /><span className={styles.outcomeTop}><OutcomeChip side={outcome} /> <strong>{price(outcome === 'yes' ? selected.yesPrice : selected.noPrice)}</strong></span><span>{outcome === 'yes' ? `At or above ${difficulty(selected.difficultyTrillions)}T` : `Below ${difficulty(selected.difficultyTrillions)}T`}</span></label>)}</fieldset>
          <p className={styles.priceNote}>Indicative reference prices per unit of winning payout in {selected.currency}. These are not size-specific quotes or forecasts. Fees and available depth affect execution.</p>
          <div className={styles.handoff}><MarketReviewButton market={selected} side={side} disabled={stale || loading || !!error} className={styles.reviewButton}>Review the {side === 'yes' ? 'Yes' : 'No'} side in the app</MarketReviewButton><p>{stale || error ? 'Refresh this snapshot before opening the market.' : 'Rechecks this exact contract before continuing. Enter size and review execution in the app.'}</p></div>
          <details className={styles.mechanics}><summary>What determines the payout? <span aria-hidden="true">+</span></summary><p>The outcome compares Bitcoin network difficulty with the threshold at the observation block. A larger move beyond the threshold does not increase the fixed payout per winning share. Payout and profit differ: position cost and fees matter.</p><Link href="/v3/docs/how-settlement-works" className={styles.textLink}>Read settlement mechanics <Arrow /></Link></details>
        </>}
      </article>
    </div>}
    <div className={styles.executionBoundary}><span aria-hidden="true">↗</span><p><strong>Execution happens in the app.</strong> Review the current order book, fees, available size and market terms there. This explorer does not show executable depth, provide a size-specific quote or place an order.</p></div>
  </section>
}

'use client';

import { V4Image } from './V4Image';
import { ProductUpdates } from './ProductUpdates';
import { HeroDecision } from './HeroDecision';
import { ViewComparison } from './ViewComparison';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowCounterClockwise, List, X, Cpu, ChartBar, Plus, ArrowSquareOut, Info, EnvelopeSimple, MagnifyingGlassPlus, CheckCircle } from '@phosphor-icons/react';

const SITE = '/v3';
const APP = 'https://app.doefin.com';

function AppLink({ children = 'Open app', className = '', quiet = false }: { children?: ReactNode; className?: string; quiet?: boolean }) {
  return <a className={`${quiet ? 'text-link' : 'button primary'} ${className}`} href={APP} target="_blank" rel="noreferrer">{children}<ArrowUpRight size={18} aria-hidden="true" /></a>;
}

function RadioSwitch({ legend, name, options, value, onChange }: { legend: string; name: string; options: [string, string][]; value: string; onChange: (value: string) => void }) {
  return <fieldset className="switch-field"><legend className="sr-only">{legend}</legend><div className="segmented">{options.map(([id, label]) => <label key={id} className={value === id ? 'selected' : ''}><input type="radio" name={name} value={id} checked={value === id} onChange={() => onChange(id)} /><span>{label}</span></label>)}</div></fieldset>;
}

const faqs: [string, ReactNode][] = [
  ['How do I fund my account?', <>Check the funding options and network shown in the app before sending funds. The documentation explains the steps and the costs to review. <a href={`${SITE}/docs`}>Read the funding guide <ArrowUpRight size={14} /></a></>],
  ['How does a market settle?', <>Each market states its difficulty threshold and observation block. The observed difficulty determines which outcome wins; settlement follows the market’s stated rules. Earlier crossings do not count. <a href={`${SITE}/docs/how-settlement-works`}>Read the settlement guide <ArrowUpRight size={14} /></a></>],
  ['Can I exit before settlement?', <>You can look for an available sell quote in the app. An exit depends on market liquidity and execution; it may be unavailable or at a price below what you paid.</>],
  ['What fees and costs should I check?', <>Review the quoted position price, trading fees, network costs, funding costs and any withdrawal costs in the app. The illustrative walkthrough on this page is before fees.</>],
  ['What risks should I understand?', <>A position can lose its full purchase cost. Liquidity, execution, settlement, smart-contract and funding risks also matter. A difficulty position does not cover every mining risk. <a href={`${SITE}/docs/risks-and-limitations`}>Read the risks and limitations <ArrowUpRight size={14} /></a></>],
];

export function V4Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [position, setPosition] = useState('YES');
  const [condition, setCondition] = useState('above');
  const menuButton = useRef<HTMLButtonElement>(null);
  const imageDialog = useRef<HTMLDialogElement>(null);
  const won = (position === 'YES') === (condition === 'above');
  const conditionLabel = condition === 'above' ? 'at or above' : 'below';
  const otherCondition = condition === 'above' ? 'below' : 'at or above';

  useEffect(() => {
    const close = (e: KeyboardEvent) => { if (e.key === 'Escape' && menuOpen) { setMenuOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  const reset = () => { setPosition('YES'); setCondition('above'); };

  return <>
    <header className="site-header">
      <div className="container header-row">
        <a className="brand" href="#main" aria-label="Doefin home"><V4Image src="/v4/assets/doefin-logo.png" alt="Doefin" width="128" height="27" /></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} id="main-navigation" aria-label="Main">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a><a href={`${SITE}/docs`}>Docs</a><a href={`${SITE}/about`}>About</a>
        </nav>
        <div className="header-actions"><AppLink className="small outline" /><button className="icon-button menu-button" ref={menuButton} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <List size={22} />}</button></div>
      </div>
    </header>

    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero-grid">
          <div className="hero-copy"><p className="eyebrow">For mining operators, funds & trading desks</p><h1 id="hero-title">Trade Bitcoin<br /><span>mining difficulty.</span></h1><p className="hero-description">Buy YES or NO position tokens on whether difficulty will be at or above a set level at a specified Bitcoin block.</p><div className="action-row"><AppLink /><a className="text-link" href="#how-it-works">How it works<ArrowRight size={19} /></a></div><p className="risk-note">Positions involve risk and can lose value.</p></div>
          <HeroDecision />
        </div>
      </section>

      <section className="walkthrough section" id="how-it-works" aria-labelledby="walkthrough-title">
        <div className="container">
          <p className="eyebrow">Illustrative market walkthrough</p>
          <div className="section-heading"><h2 id="walkthrough-title">Change the scenario. See what happens.</h2></div>
          <div className="steps-grid">
            <div className="step">
              <div className="step-heading"><span className="step-number">1</span><div><h3>Choose your position</h3><p>Set your position and see the terms for this example contract.</p></div><ArrowRight className="step-arrow" size={26} aria-hidden="true" /></div>
              <div className="position-explanation">
                <fieldset className="position-choices"><legend className="sr-only">Choose your illustrative position</legend>{['YES','NO'].map(side=><label className={`token-choice ${position===side?'is-selected':''}`} key={side}><input type="radio" name="position" aria-label={side} value={side} checked={position===side} onChange={()=>setPosition(side)} /><V4Image src={`/v4/assets/position-${side.toLowerCase()}.png`} alt={`${side} position token`} width="480" height="400" /><span className="token-caption">{side==='YES'?'At or above':'Below'} 137.2 T</span><span className="choice-status"><CheckCircle size={14} weight={position===side?'fill':'regular'} aria-hidden="true" />{position===side?'Selected':`Choose ${side}`}</span></label>)}</fieldset>
                <p className="position-meaning"><strong>{position}</strong> wins if difficulty is <strong>{position==='YES'?'at or above':'below'} 137.2 T</strong> at block <strong>979,776</strong>.</p>
                <dl className="example-terms"><div><dt>Example cost</dt><dd>60<span>units paid</span></dd></div><div><dt>If your side wins</dt><dd>100<span>total payout</span></dd></div></dl>
              </div>
            </div>
            <div className="step observation-step">
              <div className="step-heading"><span className="step-number">2</span><div><h3>Observe the condition</h3><p>This is the only difficulty observation that counts. Earlier crossings don’t count.</p></div><ArrowRight className="step-arrow" size={26} aria-hidden="true" /></div>
              <div className="observation-panel"><RadioSwitch legend="Observed difficulty scenario" name="condition" options={[["above", "At or above"], ["below", "Below"]]} value={condition} onChange={setCondition} />
                <figure className="observation-art"><V4Image src={`/v4/assets/observation-${condition}.png`} width="1315" height="1196" alt={`Illustrative observation: difficulty ${conditionLabel} the 137.2 T threshold at block 979,776.`} /><figcaption className="sr-only">Observed {conditionLabel} 137.2 T at block 979,776. Earlier crossings don’t count.</figcaption></figure>
              </div>
            </div>
            <div className="step">
              <div className="step-heading"><span className="step-number">3</span><div><h3>See the result</h3><p>If difficulty is {conditionLabel} 137.2 T, your {position} position {won ? 'wins' : 'loses'}.</p></div></div>
              <div className={`visual-result ${won?'is-win':'is-loss'}`} aria-live="polite" aria-atomic="true" data-testid="scenario-result">
                <p className="visual-result-condition">Observed {conditionLabel} 137.2 T</p><p className="visual-result-title">Your <strong>{position}</strong> position {won?'wins':'loses'}</p>
                <div className="visual-payout"><strong>{won?'100':'0'}</strong><span>Total payout</span></div>
                <V4Image className="payout-art" src={`/v4/assets/payout-${won?'win':'loss'}.png`} alt={won?'The 100-unit winning payout consists of 60 units of cost returned and 40 units of profit.':'All 60 units of purchase cost are lost. Total payout is zero.'} width="1000" height="440" />
                <p className="visual-net"><span>{won?'60 cost returned':'60-unit cost lost'}</span><strong>{won?'+40 profit':'−60 loss'}</strong></p>
                <p className="before-fees">Before fees · Held through resolution</p>
                <div className="alternate-visual"><p>If observed {otherCondition} 137.2 T</p><div className="alternate-numbers"><strong>{won?'0':'100'}</strong><span>Total payout</span><b className={won?'loss-text':'win-text'}>{won?'60 loss':'+40 profit'}</b></div><V4Image src={`/v4/assets/payout-${won?'loss':'win'}.png`} alt={won?'Alternative losing outcome: no payout, full 60-unit cost lost.':'Alternative winning outcome: 60 cost returned and 40 profit, 100 total payout.'} width="1000" height="440" /></div>
              </div>
            </div>
          </div>
          <div className="walkthrough-notes"><p><Info size={17} aria-hidden="true" />Illustrative inputs: 60 units paid, 100 units if your side wins. Fixed example values, not live quotes.</p><button className="text-link reset-button" onClick={reset}><ArrowCounterClockwise size={16} />Reset example</button></div>
          <p className="settlement-note sr-only">The observation determines the winning outcome. Redemption follows the market’s settlement rules. <a href={`${SITE}/docs/how-settlement-works`}>Read the settlement guide<ArrowUpRight size={14} /></a></p>
        </div>
      </section>

      <section className="audiences section" aria-labelledby="audience-title"><div className="container">
        <p className="eyebrow">One market. Different reasons to use it.</p><h2 id="audience-title">One market. Different reasons to use it.</h2>
        <div className="audience-grid">
          <article className="mining-story"><div className="audience-label"><Cpu size={21} aria-hidden="true" /><span>Mining operators</span></div><h3>Manage difficulty exposure.</h3><p>Higher difficulty reduces expected BTC production at a fixed hashrate. A winning YES payout may offset part of that loss, depending on the position’s cost, size and timing.</p><figure><V4Image src="/v4/assets/mining-comparison.png" alt="Illustrative comparison of identical mining rigs at fixed hashrate. Lower difficulty means more expected BTC production; higher difficulty means less expected BTC production." width="1200" height="600" loading="lazy" /><figcaption className="sr-only">Same mining power. Different expected output. Illustrative relationship; a position does not provide full protection.</figcaption></figure><a className="text-link" href={`${SITE}/for/miners#planning-example`}>See a miner planning example<ArrowUpRight size={16} /></a></article>
          <article className="trading-story"><div className="audience-label"><ChartBar size={21} aria-hidden="true" /><span>Funds & trading desks</span></div><h3>Trade your view on difficulty.</h3><p>Express your difficulty forecast with a YES or NO position. Compare market prices, timing and available liquidity.</p><ViewComparison /><a className="text-link" href={`${SITE}/for/institutions`}>Explore the trading use case<ArrowUpRight size={16} /></a></article>
        </div><p className="audience-caveat"><Info size={17} aria-hidden="true" />A difficulty position does not cover every mining risk. Bitcoin price, power costs and downtime remain separate considerations.</p>
      </div></section>

      <section className="product section" aria-labelledby="product-title"><div className="container product-grid"><div className="product-copy"><p className="eyebrow">Inside the product</p><h2 id="product-title">See the market<br />before you enter.</h2><p>The question defines the condition. The chart shows how the market’s implied chance of YES changed over time.</p><p className="product-distinction">Market-implied chance,<br /><strong>not network difficulty.</strong></p><p>This is market pricing, not a Doefin forecast or trade quote.</p><AppLink quiet>Explore the app</AppLink></div><figure className="product-figure"><div className="capture-heading"><span>YES price history</span><span>Captured 19 October 2026 · Not live</span></div><button className="capture-button" aria-label="Enlarge historical Doefin market screenshot" onClick={() => imageDialog.current?.showModal()}><V4Image src="/v4/assets/market-detail-2026-10-19.jpg" alt="Historical Doefin market screenshot, captured 19 October 2026. The question is difficulty at or above 137.2 T at block 979,776. The price-history chart shows market-implied chance of YES." width="1440" height="756" loading="lazy" /><span className="enlarge-label"><MagnifyingGlassPlus size={16} />View full screenshot</span></button><figcaption><div><strong>The market question</strong><span>The difficulty threshold and the observation block.</span></div><div><strong>The price-history chart</strong><span>Hourly order-book midpoints as an implied chance of YES.</span></div></figcaption></figure></div></section>

      <section className="faq section" aria-labelledby="faq-title"><div className="container faq-grid"><div><p className="eyebrow">Common questions</p><h2 id="faq-title">Before you<br />get started.</h2><p>The essentials here.<br />The full explanations in Docs.</p><a className="text-link" href={`${SITE}/docs`}>Explore the documentation<ArrowUpRight size={17} /></a></div><div className="faq-list">{faqs.map(([question,answer])=><details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><div className="faq-answer">{answer}</div></details>)}</div></div></section>

      <ProductUpdates />

      <section className="closing"><div className="container closing-inner"><div><p className="eyebrow">Your next step</p><h2>Take a closer look<br />at Doefin.</h2><p>Explore the markets, or talk to our team.</p></div><div className="closing-actions"><AppLink /><a className="text-link" href="mailto:matteo@doefin.com">Talk to the team<ArrowUpRight size={17} /></a></div></div></section>
    </main>
    <footer className="footer"><div className="container"><div className="footer-grid"><div><a className="brand" href="#main"><V4Image src="/v4/assets/doefin-logo.png" alt="Doefin" width="128" height="27" /></a><p>Markets for Bitcoin mining difficulty.</p></div><div><h2>Documentation</h2><a href={`${SITE}/docs`}>Start here</a><a href={`${SITE}/docs/what-doefin-settles-on`}>Contract mechanics</a><a href={`${SITE}/docs/risks-and-limitations`}>Risks & limitations</a><a href={`${SITE}/docs/key-terms`}>Key terms</a></div><div><h2>Connect</h2><a href={`${SITE}/about`}>About Doefin</a><a href="mailto:matteo@doefin.com">Talk to the team</a><a href={APP}>Open app<ArrowUpRight size={13} /></a></div></div><div className="footer-legal"><p>For professional investors. Positions involve risk. Nothing here is investment advice. This prototype contains illustrative content.</p><div><a href={`${SITE}/terms`}>Terms</a><a href={`${SITE}/privacy`}>Privacy</a></div></div><div className="prototype-note"><span>Doefin · V4 preview</span><nav className="version-links" aria-label="Website version">{["v1", "v2", "v3", "v4"].map(version => <a key={version} href={`/${version}`} aria-current={version === "v4" ? "page" : undefined}>{version.toUpperCase()}</a>)}</nav></div></div></footer>
    <dialog ref={imageDialog} className="image-dialog" onClick={e=>{if(e.target===e.currentTarget)imageDialog.current?.close();}}><div className="dialog-toolbar"><p>Historical market capture · 19 October 2026 · Not live</p><button className="icon-button" aria-label="Close screenshot" onClick={()=>imageDialog.current?.close()}><X size={24}/></button></div><V4Image src="/v4/assets/market-detail-2026-10-19.jpg" alt="Full historical Doefin market screenshot" width="1440" height="756" /></dialog>
  </>;
}

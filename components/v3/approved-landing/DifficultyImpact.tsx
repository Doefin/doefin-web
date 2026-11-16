'use client'

import { useState } from 'react'

const BASE_DIFFICULTY = 150
const BASE_PRODUCTION = 0.01

export function DifficultyImpact() {
  const [change, setChange] = useState(0)
  const difficulty = BASE_DIFFICULTY * (1 + change / 100)
  const hashrate = difficulty * 2 ** 32 / 600 / 1_000_000
  const production = BASE_PRODUCTION / (1 + change / 100)
  const productionChange = (production / BASE_PRODUCTION - 1) * 100

  return <section className="landing-impact" id="difficulty-impact" aria-labelledby="impact-title">
    <div className="landing-impact-copy">
      <p className="landing-impact-eyebrow">Illustrative — not live data</p>
      <h2 id="impact-title">How difficulty affects expected BTC production</h2>
      <p>Move the slider to change Bitcoin mining difficulty. At the same miner hashrate, a rise in difficulty reduces expected BTC production over a fixed period, all else equal.</p>
    </div>
    <div className="landing-impact-panel">
      <div className="landing-impact-slider-head">
        <label htmlFor="landing-difficulty-slider">Difficulty adjustment</label>
        <output htmlFor="landing-difficulty-slider">{change > 0 ? '+' : ''}{change}%</output>
      </div>
      <input id="landing-difficulty-slider" type="range" min="-30" max="30" step="1" value={change} onChange={event => setChange(Number(event.target.value))} />
      <div className="landing-impact-range" aria-hidden="true"><span>−30%</span><span>0%</span><span>+30%</span></div>
      <dl className="landing-impact-stats" aria-live="polite">
        <div><dt>Difficulty</dt><dd>{difficulty.toFixed(2)}T</dd></div>
        <div><dt>Implied network hashrate</dt><dd>{hashrate.toFixed(0)} EH/s</dd></div>
        <div><dt>Expected BTC production</dt><dd>{production.toFixed(5)} BTC</dd><span>{productionChange > 0 ? '+' : ''}{productionChange.toFixed(1)}% vs. baseline</span></div>
      </dl>
      <p className="landing-impact-note">Illustrative — not live data. Baseline: 150T difficulty and 0.01 BTC production for an unspecified fixed period. Implied hashrate uses difficulty × 2³² ÷ 600 seconds and is not a direct network measurement. Production assumes unchanged miner hashrate and reward conditions. This is not a forecast of trading returns.</p>
      <a className="landing-impact-link" href="/tools/difficulty-exposure">Open the full difficulty calculator →</a>
    </div>
  </section>
}

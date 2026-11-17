import { Gauge, ShieldWarning, Target } from '@phosphor-icons/react/dist/ssr'
import { Suspense } from 'react'
import { site } from '@/lib/site'
import { AudienceDisclosure } from '../AudienceDisclosure'
import { ApprovedLandingMotion } from './ApprovedLandingMotion'
import { DifficultyImpactLoading, DifficultyImpactSection } from './DifficultyImpactSection'
import { LandingHistory, LandingHistoryFallback } from './LandingHistory'
import { LandingTeam } from './LandingTeam'
import { LandingTrust } from './LandingTrust'

export function ApprovedLanding() {
  return (
    <ApprovedLandingMotion>
      <Hero />
      <Audience />
      <Why />
      <How />
      <Suspense fallback={<LandingHistoryFallback />}>
        <LandingHistory />
      </Suspense>
      <Suspense fallback={<DifficultyImpactLoading />}>
        <DifficultyImpactSection />
      </Suspense>
      <LandingTrust />
      <LandingTeam />
      <Closing />
    </ApprovedLandingMotion>
  )
}

function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <h1 id="hero-title">
          <span>Trade Bitcoin</span> <span className="accent">hashrate.</span>
        </h1>
        <p className="lead">
          A Bitcoin-native market for Bitcoin mining difficulty.
        </p>
        <p className="description">
          <span>
            Investors can trade views on where network hashrate goes.
          </span>{' '}
          <span>
            Miners can hedge rising Bitcoin difficulty.
          </span>
        </p>
        <div className="actions">
          <a
            className="button button-primary"
            href={site.appUrl}
            data-v3-cta="app"
            data-v3-placement="hero"
          >
            Enter app{' '}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h15m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            className="button button-secondary"
            href="mailto:info@doefin.com"
          >
            Talk to us
          </a>
        </div>
        <p className="hero-risk">
          You can lose the full amount paid for a position.
        </p>
      </div>
      <div className="visual">
        <figure className="chart-panel" aria-labelledby="chart-title">
          <div className="chart-header">
            <h2 id="chart-title">Bitcoin hashrate and price</h2>
            <div className="chart-legend" aria-label="Chart series">
              <span className="chart-key chart-key-hashrate">Hashrate</span>
              <span className="chart-key chart-key-price">Bitcoin price</span>
            </div>
          </div>
          <svg
            className="chart"
            viewBox="0 0 540 240"
            preserveAspectRatio="none"
            role="img"
            aria-label="Illustrative lines for Bitcoin hashrate and price."
          >
            <defs>
              <clipPath id="hero-chart-reveal" clipPathUnits="userSpaceOnUse">
                <rect
                  className="chart-reveal-window"
                  x="0"
                  y="-8"
                  width={540}
                  height={256}
                />
              </clipPath>
            </defs>
            <path
              className="chart-grid"
              d="M22 30H518M22 82H518M22 134H518M22 186H518M22 30V220M121 30V220M220 30V220M319 30V220M418 30V220M518 30V220"
            />
            <g className="chart-series" clipPath="url(#hero-chart-reveal)">
              <path
                className="chart-area"
                d="M23 215 31 194 38 170 45 150 52 164 59 174 66 195 74 170 82 168 90 164 99 158 106 144 113 140 120 135 127 172 134 169 142 167 149 188 158 200 168 212 176 207 184 213 193 204 201 205 209 210 217 205 224 214 232 207 240 203 248 213 257 211 266 201 275 204 284 197 292 191 300 192 309 183 317 180 325 171 333 178 342 180 350 176 358 186 366 190 375 174 383 181 391 167 399 148 407 154 414 140 422 137 430 119 438 123 446 111 453 101 460 80 468 81 476 65 483 61 491 51 498 36 505 58 512 65 519 120 L519 240H23Z"
              />
              <path
                className="chart-context"
                d="M23 204 30 187 36 178 42 161 49 173 56 165 63 180 69 171 77 161 84 145 90 151 97 162 104 151 111 146 117 153 124 159 132 154 139 168 147 148 154 145 163 143 171 139 179 126 187 134 195 136 203 134 210 139 217 137 225 139 232 134 240 139 247 137 255 141 263 139 269 117 275 91 282 95 289 89 297 94 305 98 313 89 321 96 329 98 337 104 345 110 353 92 360 69 367 76 374 72 382 77 390 76 398 69 405 75 413 75 420 85 427 84 435 88 442 85 450 82 458 78 465 76 473 83 481 88 488 87 496 90 504 84 512 90 518 95"
              />
              <path
                className="chart-main"
                d="M23 215 31 194 38 170 45 150 52 164 59 174 66 195 74 170 82 168 90 164 99 158 106 144 113 140 120 135 127 172 134 169 142 167 149 188 158 200 168 212 176 207 184 213 193 204 201 205 209 210 217 205 224 214 232 207 240 203 248 213 257 211 266 201 275 204 284 197 292 191 300 192 309 183 317 180 325 171 333 178 342 180 350 176 358 186 366 190 375 174 383 181 391 167 399 148 407 154 414 140 422 137 430 119 438 123 446 111 453 101 460 80 468 81 476 65 483 61 491 51 498 36 505 58 512 65 519 120"
              />
              <circle className="chart-end" cx="519" cy="120" r="5" />
              <circle className="chart-end-core" cx="519" cy="120" r="1.5" />
            </g>
          </svg>
          <figcaption className="chart-source">
            Illustrative chart, not live data
          </figcaption>
        </figure>
        <section className="market-panel" aria-labelledby="market-title">
          <h2 className="market-title" id="market-title">
            Will Bitcoin difficulty be at or above the threshold at the
            observation block?
          </h2>
          <div className="market-scroll">
            <table
              className="market-table"
              aria-label="Illustrative Bitcoin difficulty market quotes"
            >
              <caption className="market-source">
                Illustrative quotes in cbBTC, not live prices
              </caption>
              <colgroup>
                <col className="strike-col" />
              </colgroup>
              <colgroup>
                <col className="yes-col" />
                <col className="currency-col" />
                <col className="no-col" />
              </colgroup>
              <thead>
                <tr className="context-row">
                  <th
                    id="strike-heading"
                    className="strike-heading"
                    rowSpan={2}
                    scope="col"
                  >
                    <span className="table-eyebrow">DIFFICULTY THRESHOLD</span>
                  </th>
                  <th colSpan={3} className="block-meta" scope="colgroup">
                    <span className="table-eyebrow">
                      BLOCK <strong className="block-number">929,776</strong>
                    </span>
                    <span className="table-meta">
                      Example observation block
                    </span>
                  </th>
                </tr>
                <tr className="column-row">
                  <th className="yes-label" scope="col">
                    Buy Yes
                  </th>
                  <th scope="col">Currency</th>
                  <th className="no-label" scope="col">
                    Buy No
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">129.5T</th>
                  <td>
                    <span className="quote quote-yes">0.93</span>
                  </td>
                  <td>
                    <span className="market-currency-icon" role="img" aria-label="cbBTC (wrapped Bitcoin)">
                      <img src="/images/bitcoin.svg" width={24} height={24} alt="" />
                    </span>
                  </td>
                  <td>
                    <span className="quote quote-no">0.13</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row">137.2T</th>
                  <td>
                    <span className="quote quote-yes">0.75</span>
                  </td>
                  <td>
                    <span className="market-currency-icon" role="img" aria-label="cbBTC (wrapped Bitcoin)">
                      <img src="/images/bitcoin.svg" width={24} height={24} alt="" />
                    </span>
                  </td>
                  <td>
                    <span className="quote quote-no">0.30</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </section>
  )
}

function Audience() {
  return (
    <section
      id="who-its-for"
      className="audience-section"
      aria-labelledby="audience-heading"
    >
      <h2 className="audience-heading" id="audience-heading">
        Who it is for
      </h2>
      <div className="audience-grid">
        <article
          className="audience-panel audience-traders"
          aria-labelledby="audience-traders-title"
        >
          <h3 className="audience-title" id="audience-traders-title">
            For traders and investors
          </h3>
          <p className="audience-description">
            Trade Bitcoin difficulty as a measurable, Bitcoin-native underlying.
          </p>
          <a className="landing-copy-link" href="/for/institutions">See how →</a>
          <div className="audience-art-control">
            <svg
              className="audience-art audience-market-art"
              viewBox="0 0 208 184"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M16 39H192M16 61H192M16 83H192M16 105H192M16 127H192M16 149H192"
                stroke="#28354C"
                strokeWidth="1"
              />
              <g
                fill="#6DCB91"
                fillOpacity="1"
                stroke="#23413C"
                strokeOpacity="1"
                strokeWidth="1.5"
              >
                <rect
                  x="61"
                  y="27"
                  width={38}
                  height={12}
                  rx="3"
                />
                <rect
                  x="43"
                  y="49"
                  width={56}
                  height={12}
                  rx="3"
                />
                <rect
                  x="52"
                  y="71"
                  width={47}
                  height={12}
                  rx="3"
                />
                <rect
                  x="30"
                  y="93"
                  width={69}
                  height={12}
                  rx="3"
                />
                <rect
                  x="36"
                  y="115"
                  width={63}
                  height={12}
                  rx="3"
                />
                <rect
                  x="17"
                  y="137"
                  width={82}
                  height={12}
                  rx="3"
                />
              </g>
              <g
                fill="#ED9077"
                fillOpacity="1"
                stroke="#46292C"
                strokeOpacity="1"
                strokeWidth="1.5"
              >
                <rect
                  x="109"
                  y="27"
                  width={79}
                  height={12}
                  rx="3"
                />
                <rect
                  x="109"
                  y="49"
                  width={59}
                  height={12}
                  rx="3"
                />
                <rect
                  x="109"
                  y="71"
                  width={70}
                  height={12}
                  rx="3"
                />
                <rect
                  x="109"
                  y="93"
                  width={44}
                  height={12}
                  rx="3"
                />
                <rect
                  x="109"
                  y="115"
                  width={51}
                  height={12}
                  rx="3"
                />
                <rect
                  x="109"
                  y="137"
                  width={31}
                  height={12}
                  rx="3"
                />
              </g>
              <path
                d="M104 18V158"
                stroke="var(--df-chart-context)"
                strokeWidth="1"
              />
              <path
                d="M98 18H110M98 158H110M7 158H191M4 25v-7h9m176 0h9v7M4 148v7h9m176 0h9v-7"
                stroke="var(--df-line-strong)"
                strokeWidth="1"
              />
            </svg>
          </div>
        </article>
        <article
          className="audience-panel audience-miners"
          aria-labelledby="audience-miners-title"
        >
          <h3 className="audience-title" id="audience-miners-title">
            For miners
          </h3>
          <p className="audience-description">
            Hedge rising difficulty or trade your view on network hashrate.
          </p>
          <a className="landing-copy-link" href="/for/miners">See how →</a>
          <button
            className="audience-art-control"
            type="button"
            disabled
            data-illustration="mining"
            aria-label="Pause mining animation"
          >
            <svg
              className="audience-art audience-mining-art"
              viewBox="0 0 208 184"
              fill="none"
              aria-hidden="true"
            >
              <defs>
                <g
                  id="audience-fan-housing"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle r="29" stroke="#52617A" strokeWidth="1.5" />
                  <circle r="25" stroke="#303D55" />
                </g>
                <g
                  id="audience-fan-rotor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#213653"
                  stroke="#7793B7"
                  strokeWidth="1.4"
                >
                  <path d="M-3-6C-9-14-7-21 1-22c10 1 12 10 5 16Z" />
                  <path d="M6-3C14-9 21-7 22 1c-1 10-10 12-16 5Z" />
                  <path d="M3 6C9 14 7 21-1 22c-10-1-12-10-5-16Z" />
                  <path d="M-6 3C-14 9-21 7-22-1c1-10 10-12 16-5Z" />
                </g>
              </defs>
              <path
                d="M27 30H182V143H27"
                fill="#0C1321"
                stroke="#303D55"
                strokeWidth="1.5"
              />
              <rect
                x="17"
                y="38"
                width={164}
                height={100}
                rx="8"
                fill="#141F33"
                stroke="#52617A"
                strokeWidth="1.5"
              />
              <path
                data-audience="miner-rail"
                d="M31 47H167"
                stroke="#3475FE"
                strokeWidth="2"
              />
              <g transform="translate(63 89)">
                <use href="#audience-fan-housing" />
                <g data-audience="fan-left">
                  <use href="#audience-fan-rotor" />
                </g>
                <circle
                  data-audience="fan-left-hub"
                  r="5"
                  fill="#1B3158"
                  stroke="#8FB4FF"
                  strokeWidth="1.5"
                />
              </g>
              <g transform="translate(135 89)">
                <use href="#audience-fan-housing" />
                <g data-audience="fan-right">
                  <use href="#audience-fan-rotor" />
                </g>
                <circle
                  data-audience="fan-right-hub"
                  r="5"
                  fill="#1B3158"
                  stroke="#8FB4FF"
                  strokeWidth="1.5"
                />
              </g>
              <g fill="#77859B">
                <circle cx="25" cy="47" r="1.2" />
                <circle cx="173" cy="47" r="1.2" />
                <circle cx="25" cy="129" r="1.2" />
                <circle cx="173" cy="129" r="1.2" />
              </g>
              <path
                d="M38 126h8m7 0h8m7 0h8m7 0h8m7 0h8m7 0h8m7 0h8m7 0h8m7 0h8"
                stroke="#52617A"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M34 139v10h20v-10m90 0v10h20v-10"
                fill="#19243A"
                stroke="#3D4B64"
                strokeWidth="1.5"
              />
              <path
                d="M7 158H191M4 25v-7h9m176 0h9v7M4 148v7h9m176 0h9v-7"
                stroke="#303D55"
                strokeWidth="1"
              />
              <path
                data-audience="miner-vent-1"
                d="M38 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-2"
                d="M53 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-3"
                d="M68 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-4"
                d="M83 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-5"
                d="M98 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-6"
                d="M113 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-7"
                d="M128 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-8"
                d="M143 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <path
                data-audience="miner-vent-9"
                d="M158 126h8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0"
              />
              <rect
                data-audience="miner-outline"
                x="17"
                y="38"
                width={164}
                height={100}
                rx="8"
                stroke="#8FB4FF"
                strokeWidth="1.5"
                opacity="0"
              />
            </svg>
          </button>
        </article>
      </div>
    </section>
  )
}

function Why() {
  return (
    <section id="why-doefin" className="why-section" aria-labelledby="why-heading">
      <h2 className="why-heading" id="why-heading">
        Why Doefin
      </h2>
      <AudienceDisclosure
        className="why-market-reference"
        summary="Hashrate and Bitcoin mining difficulty"
      >
        <dl className="why-market-terms">
          <div>
            <dt><Gauge aria-hidden="true" /> Hashrate</dt>
            <dd>The economic exposure behind the market.</dd>
          </div>
          <div>
            <dt><Target aria-hidden="true" /> Bitcoin mining difficulty</dt>
            <dd>Determines each market outcome. Each market specifies a <strong>difficulty threshold</strong> and a <strong>settlement block</strong>.</dd>
          </div>
        </dl>
        <div className="why-market-use">
          <p>These market terms give <strong>miners</strong> a public reference for hedging and <strong>professional investors</strong> a reference for trading a view.</p>
          <p className="why-market-risk"><ShieldWarning aria-hidden="true" /> <span>A difficulty position may offset some exposure, but it does not cover every mining risk.</span></p>
        </div>
      </AudienceDisclosure>
      <div className="why-layout">
        <article
          className="why-panel why-drivers"
          aria-labelledby="why-drivers-title"
        >
          <div className="why-driver-copy">
            <h3 className="why-title" id="why-drivers-title">
              Trustless Bitcoin oracle:
            </h3>
            <p className="why-description">
              Difficulty, block heights and timestamps verified directly from block headers.
            </p>
          </div>
          <div className="why-driver-visual">
            <svg
              className="why-driver-art"
              viewBox="0 0 560 230"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <g
                stroke="#293A54"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M0 59h24l20 20M0 177h24l20-20M560 62h-15l-16 16M560 180h-16l-15-15M258 0v24m0 181v25" />
                <path d="M185 0v20l25 25M340 230v-25l-25-25" />
              </g>
              <path
                d="M152 73h23a12 12 0 0 1 12 12v18a12 12 0 0 0 12 12h13M152 159h23a12 12 0 0 0 12-12v-20a12 12 0 0 1 12-12h13"
                stroke="#536C8E"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="187" cy="115" r="3" fill="#B0C5E2" />
              <path
                d="M324 115h42"
                stroke="#7189AD"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="m358 110 6 5-6 5"
                stroke="#8CA8CD"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="47"
                y="39"
                width={108}
                height={68}
                rx="12"
                fill="#101A2C"
                stroke="#344965"
                strokeWidth="1.2"
              />
              <rect
                x="43"
                y="43"
                width={108}
                height={68}
                rx="12"
                fill="#17263C"
                stroke="#7288A6"
                strokeWidth="1.5"
              />
              <image href="/images/bitcoin.svg" x="53" y="57" width={40} height={40} aria-hidden="true" />
              <path d="M96 92h41" stroke="#344965" strokeWidth="1.1" />
              <path
                d="m97 83 8-8 7 4 9-14 6 5 9-10"
                stroke="#AEC2DE"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <rect
                x="47"
                y="128"
                width={108}
                height={62}
                rx="12"
                fill="#101A2C"
                stroke="#344965"
                strokeWidth="1.2"
              />
              <rect
                x="43"
                y="132"
                width={108}
                height={62}
                rx="12"
                fill="#17263C"
                stroke="#7288A6"
                strokeWidth="1.5"
              />
              <path d="m77 143-18 22h13l-5 19 22-27H76l1-14Z" fill="#CAD8EC" />
              <g fill="#486181" stroke="#8EA6C6" strokeWidth="1.2">
                <rect x="101" y="169" width={7} height={11} rx="1.5" />
                <rect x="114" y="162" width={7} height={18} rx="1.5" />
                <rect x="127" y="151" width={7} height={29} rx="1.5" />
              </g>
              <g stroke="#526A8C" strokeWidth="1.6" strokeLinecap="round">
                <path d="M224 59V48m15 11V48m15 11V48m15 11V48m15 11V48m15 11V48m15 11V48M224 173v11m15-11v11m15-11v11m15-11v11m15-11v11m15-11v11m15-11v11" />
                <path d="M212 72h-10m10 15h-10m10 15h-10m10 15h-10m10 15h-10m10 15h-10m10 15h-10M324 72h10m-10 15h10m-10 15h10m-10 15h10m-10 15h10m-10 15h10m-10 15h10" />
              </g>
              <rect
                x="212"
                y="59"
                width={112}
                height={114}
                rx="11"
                fill="#1C2A42"
                stroke="#8298B7"
                strokeWidth="1.6"
              />
              <rect
                x="221"
                y="68"
                width={94}
                height={96}
                rx="5"
                stroke="#344C6E"
              />
              <rect
                x="230"
                y="77"
                width={76}
                height={78}
                rx="5"
                fill="#3475FE"
              />
              <g stroke="#C6DAFF" strokeWidth="1.3">
                <rect
                  x="240"
                  y="87"
                  width={22}
                  height={23}
                  rx="2"
                />
                <rect
                  x="274"
                  y="87"
                  width={22}
                  height={23}
                  rx="2"
                />
                <rect
                  x="240"
                  y="122"
                  width={22}
                  height={23}
                  rx="2"
                />
                <rect
                  x="274"
                  y="122"
                  width={22}
                  height={23}
                  rx="2"
                />
                <path
                  d="M246 94h10m-10 7h10M280 94h10m-10 7h10M246 129h10m-10 7h10M280 129h10m-10 7h10"
                  opacity=".6"
                />
              </g>
              <g fill="#90A6C5">
                <circle cx="217" cy="64" r="1.3" />
                <circle cx="319" cy="64" r="1.3" />
                <circle cx="217" cy="168" r="1.3" />
                <circle cx="319" cy="168" r="1.3" />
              </g>
              <rect
                x="372"
                y="48"
                width={150}
                height={132}
                rx="12"
                fill="#101A2C"
                stroke="#344965"
                strokeWidth="1.3"
              />
              <rect
                x="366"
                y="54"
                width={150}
                height={132}
                rx="12"
                fill="#17263C"
                stroke="#839AB9"
                strokeWidth="1.6"
              />
              <path d="M367 82h148" stroke="#354C6A" strokeWidth="1.2" />
              <path
                d="M380 68h24m5 0h8"
                stroke="#A6BAD6"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <circle cx="501" cy="68" r="3" fill="#3475FE" />
              <g stroke="#2B405D" strokeWidth="1">
                <path d="M384 105h115M384 129h115M384 153h115M406 94v69M437 94v69M468 94v69M499 94v69" />
              </g>
              <path
                d="M380 94v69h119M376 105h4m-4 24h4m-4 24h4"
                stroke="#5C7393"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="m386 148 12-8 11 4 12-18 10 5 13-16 11 6 13-12 12 6 13-17v65H386Z"
                fill="#3475FE"
                opacity=".09"
              />
              <path
                d="m386 148 12-8 11 4 12-18 10 5 13-16 11 6 13-12 12 6 13-17"
                stroke="#7DAAFF"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="493"
                cy="98"
                r="3.4"
                fill="#17263C"
                stroke="#A6C7FF"
                strokeWidth="1.8"
              />
            </svg>
          </div>
        </article>
        <article
          className="why-panel why-side-panel why-views"
          aria-labelledby="why-views-title"
        >
          <h3 className="why-title" id="why-views-title">Fully collateralised:</h3>
          <p className="why-description">
            Collateralisation limits trading-counterparty credit exposure. cbBTC issuer and custody risks remain.
          </p>
          <div className="why-side-visual">
            <svg
              className="why-side-art"
              viewBox="0 0 190 180"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <rect
                x="22"
                y="17"
                width={156}
                height={134}
                rx="12"
                fill="#101A2C"
                stroke="#344965"
                strokeWidth="1.3"
              />
              <rect
                x="14"
                y="25"
                width={156}
                height={134}
                rx="12"
                fill="#17263C"
                stroke="#8A9FBE"
                strokeWidth="1.6"
              />
              <path
                d="M27 26h130a12 12 0 0 1 12 12v13H15V38a12 12 0 0 1 12-12Z"
                fill="#1E2F49"
              />
              <path d="M15 52h154" stroke="#354C6A" />
              <path
                d="M29 39h32"
                stroke="#B4C8E5"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M88 67v29m0 20v29"
                stroke="#3B526F"
                strokeWidth="1"
                strokeDasharray="2 4"
                strokeLinecap="round"
              />
              <path
                d="m30 126 13-13 13 6 15-21 17 8"
                stroke="#AEC2DE"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M88 106C108 96 142 98 142 73"
                stroke="#6DCB91"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M135 80l7-7 7 7"
                stroke="#6DCB91"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M88 106C108 116 142 114 142 139"
                stroke="#ED9077"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M135 132l7 7 7-7"
                stroke="#ED9077"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="88" cy="106" r="6.5" fill="#17263C" />
              <circle
                cx="88"
                cy="106"
                r="3.8"
                fill="#E0ECFF"
              />
            </svg>
          </div>
        </article>
        <article
          className="why-panel why-side-panel why-bitcoin"
          aria-labelledby="why-bitcoin-title"
        >
          <h3 className="why-title" id="why-bitcoin-title">
            <span className="why-title-line">A Bitcoin-native</span>{' '}
            <span className="why-title-line">underlying:</span>
          </h3>
          <div className="why-side-visual">
            <svg
              className="why-side-art"
              viewBox="0 0 190 180"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M57 43H75"
                stroke="#8098BA"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <path
                d="M115 43H133"
                stroke="#8098BA"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <g>
                <rect
                  x="21"
                  y="20"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#101A2C"
                  stroke="#344965"
                  strokeWidth="1.3"
                />
                <rect
                  x="17"
                  y="24"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#17263C"
                  stroke="#8096B6"
                  strokeWidth="1.6"
                />
                <g fill="#304766" stroke="#8AA5CC" strokeWidth="1.1">
                  <rect x="27" y="34" width={7} height={7} rx="1.2" />
                  <rect x="40" y="34" width={7} height={7} rx="1.2" />
                  <rect x="27" y="47" width={7} height={7} rx="1.2" />
                  <rect x="40" y="47" width={7} height={7} rx="1.2" />
                </g>
              </g>
              <g>
                <rect
                  x="79"
                  y="20"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#101A2C"
                  stroke="#344965"
                  strokeWidth="1.3"
                />
                <rect
                  x="75"
                  y="24"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#1C2A42"
                  stroke="#91A8C9"
                  strokeWidth="1.6"
                />
                <svg
                  x="81"
                  y="30"
                  width={28}
                  height={28}
                  viewBox="0 0 40 40"
                  fill="none"
                  aria-hidden="true"
                  focusable="false"
                >
                  <g transform="translate(-289.60744,-341.50536)">
                    <g transform="matrix(0.61129216,0,0,0.61129216,170.80346,315.53734)">
                      <path
                        d="m258.845 82.989c-4.274 17.143-21.637 27.576-38.782 23.301-17.138-4.274-27.571-21.638-23.295-38.78 4.272-17.145 21.635-27.579 38.775-23.305 17.144 4.274 27.576 21.64 23.302 38.784z"
                        fill="#f7931a"
                      />
                      <path
                        d="m241.91 70.689c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4 5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439 5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934 3.75c0 0 2.605 0.597 2.55 0.634 1.422 0.355 1.679 1.296 1.636 2.042l-1.638 6.571c0.098 0.025 0.225 0.061 0.365 0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296 9.205c-0.174 0.432-0.615 1.08-1.609 0.834 0.035 0.051-2.552-0.637-2.552-0.637l-1.743 4.019 4.569 1.139c0.85 0.213 1.683 0.436 2.503 0.646l-1.453 5.834 3.507 0.875 1.439-5.772c0.958 0.26 1.888 0.5 2.798 0.726l-1.434 5.745 3.511 0.875 1.453-5.823c5.987 1.133 10.489 0.676 12.384-4.739 1.527-4.36-0.076-6.875-3.226-8.515 2.294-0.529 4.022-2.038 4.483-5.155zm-8.022 11.249c-1.085 4.36-8.426 2.003-10.806 1.412l1.928-7.729c2.38 0.594 10.012 1.77 8.878 6.317zm1.086-11.312c-0.99 3.966-7.1 1.951-9.082 1.457l1.748-7.01c1.982 0.494 8.365 1.416 7.334 5.553z"
                        fill="#fff"
                      />
                    </g>
                  </g>
                </svg>
              </g>
              <g>
                <rect
                  x="137"
                  y="20"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#101A2C"
                  stroke="#344965"
                  strokeWidth="1.3"
                />
                <rect
                  x="133"
                  y="24"
                  width={40}
                  height={40}
                  rx="6"
                  fill="#17263C"
                  stroke="#8096B6"
                  strokeWidth="1.6"
                />
                <g fill="#304766" stroke="#8AA5CC" strokeWidth="1.1">
                  <rect x="143" y="34" width={7} height={7} rx="1.2" />
                  <rect x="156" y="34" width={7} height={7} rx="1.2" />
                  <rect x="143" y="47" width={7} height={7} rx="1.2" />
                  <rect x="156" y="47" width={7} height={7} rx="1.2" />
                </g>
              </g>
              <path
                d="M95 64V91"
                stroke="#8AA5CC"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="m90 86 5 5 5-5"
                stroke="#8AA5CC"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <g>
                <rect
                  x="22"
                  y="102"
                  width={146}
                  height={43}
                  rx="7"
                  fill="#17263C"
                  stroke="#8A9FBE"
                  strokeWidth="1.6"
                />
                <path d="M23 103H167V114H23Z" fill="#1E2F49" />
                <path
                  d="M32 114H158"
                  stroke="#A8BEDC"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M32 114v18m16-18v10m16-10v18m16-18v10m31-10v10m16-10v18m16-18v10m15-10v18"
                  stroke="#8AA5CC"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <rect
                  x="88"
                  y="106"
                  width={14}
                  height={33}
                  rx="3"
                  fill="#3475FE"
                />
                <path
                  d="M95 112v20"
                  stroke="#E0ECFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M32 154H125"
                  stroke="#344965"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              </g>
              <g>
                <circle
                  cx="153"
                  cy="151"
                  r="13"
                  fill="#17263C"
                  stroke="#8AA5CC"
                  strokeWidth="1.7"
                />
                <path
                  d="m147 151 4 4 8-9"
                  stroke="#A8C7FF"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
        </article>
      </div>
    </section>
  )
}

function How() {
  return (
    <section
      id="how-it-works"
      className="how-section"
      aria-labelledby="how-heading"
    >
      <h2 className="how-heading" id="how-heading">
        How it works
      </h2>
      <ol className="how-flow" role="list">
        <li className="how-step">
          <div className="how-artwork">
            <svg
              className="how-art"
              viewBox="20 10 220 160"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <g>
                <g>
                  <rect
                    x="112"
                    y="16"
                    width={87}
                    height={113}
                    rx="9"
                    fill="#10192A"
                    stroke="#3D5376"
                  />
                  <path
                    d="M127 33h42m-42 14h56m-56 14h32"
                    stroke="#526D92"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>
                <path
                  d="M42 94V71c0-8 7-14 15-14h79v87H57c-8 0-15-6-15-14V94Z"
                  fill="#18273F"
                  stroke="#7F94B5"
                  strokeWidth="1.6"
                />
                <path
                  d="M49 70h86"
                  stroke="#4B6286"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <g>
                  <g transform="translate(64 25) scale(1.25)">
                    <g transform="translate(-289.60744,-341.50536)">
                      <g transform="matrix(0.61129216,0,0,0.61129216,170.80346,315.53734)">
                        <path
                          d="m258.845 82.989c-4.274 17.143-21.637 27.576-38.782 23.301-17.138-4.274-27.571-21.638-23.295-38.78 4.272-17.145 21.635-27.579 38.775-23.305 17.144 4.274 27.576 21.64 23.302 38.784z"
                          fill="#f7931a"
                        />
                        <path
                          d="m241.91 70.689c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4 5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439 5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934 3.75c0 0 2.605 0.597 2.55 0.634 1.422 0.355 1.679 1.296 1.636 2.042l-1.638 6.571c0.098 0.025 0.225 0.061 0.365 0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296 9.205c-0.174 0.432-0.615 1.08-1.609 0.834 0.035 0.051-2.552-0.637-2.552-0.637l-1.743 4.019 4.569 1.139c0.85 0.213 1.683 0.436 2.503 0.646l-1.453 5.834 3.507 0.875 1.439-5.772c0.958 0.26 1.888 0.5 2.798 0.726l-1.434 5.745 3.511 0.875 1.453-5.823c5.987 1.133 10.489 0.676 12.384-4.739 1.527-4.36-0.076-6.875-3.226-8.515 2.294-0.529 4.022-2.038 4.483-5.155zm-8.022 11.249c-1.085 4.36-8.426 2.003-10.806 1.412l1.928-7.729c2.38 0.594 10.012 1.77 8.878 6.317zm1.086-11.312c-0.99 3.966-7.1 1.951-9.082 1.457l1.748-7.01c1.982 0.494 8.365 1.416 7.334 5.553z"
                          fill="#fff"
                        />
                      </g>
                    </g>
                  </g>
                </g>
                <g>
                  <rect
                    x="42"
                    y="79"
                    width={135}
                    height={80}
                    rx="12"
                    fill="#1B2B45"
                    stroke="#91A8C9"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M54 82h111"
                    stroke="#BACBE6"
                    strokeOpacity=".18"
                    strokeLinecap="round"
                  />
                  <g>
                    <rect
                      x="142"
                      y="106"
                      width={38}
                      height={28}
                      rx="7"
                      fill="#293F61"
                      stroke="#91A8C9"
                      strokeWidth="1.6"
                    />
                    <circle
                      cx="161"
                      cy="120"
                      r="4.2"
                      fill="#1B2B45"
                      stroke="#AEC1DC"
                      strokeWidth="1.2"
                    />
                    <circle cx="161" cy="120" r="1.5" fill="#AEC1DC" />
                  </g>
                  <path
                    d="M59 141h27"
                    stroke="#607A9F"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>
                <path
                  d="M211 62v34a24 24 0 0 1-24 24h-3m6-6-6 6 6 6"
                  stroke="#729FFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </div>
          <h3 className="how-step-title">
            <span className="how-number">1.</span>{' '}
            <span>
              Choose a<br />
              difficulty market
            </span>
          </h3>
          <p className="how-step-description">
            Buy Yes or No depending on where you expect Bitcoin difficulty to be at expiry.
          </p>
        </li>
        <li className="how-step">
          <div className="how-artwork">
            <svg
              className="how-art"
              viewBox="20 10 220 160"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <g>
                <rect
                  x="62"
                  y="17"
                  width={150}
                  height={141}
                  rx="12"
                  fill="#10192A"
                  stroke="#324562"
                />
                <rect
                  x="52"
                  y="25"
                  width={150}
                  height={141}
                  rx="12"
                  fill="#172238"
                  stroke="#7F94B5"
                  strokeWidth="1.6"
                />
                <path
                  d="M64 26h126a11 11 0 0 1 11 11v20H53V37a11 11 0 0 1 11-11Z"
                  fill="#1D2B43"
                />
                <path
                  d="M69 42h44"
                  stroke="#C1CDE0"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path d="M53 58h148" stroke="#3B4E6D" />
                <g>
                  <rect
                    x="63"
                    y="69"
                    width={128}
                    height={34}
                    rx="6"
                    fill="#193B35"
                    stroke="#3D765F"
                  />
                  <path
                    d="M83 93V79m-6 6 6-6 6 6"
                    stroke="#8BDCB4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M105 86h39"
                    stroke="#89BFA7"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="153"
                    y="79"
                    width={28}
                    height={14}
                    rx="4"
                    fill="#285344"
                  />
                  <path
                    d="M160 86h14"
                    stroke="#9CCDB6"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
                <g>
                  <rect
                    x="63"
                    y="119"
                    width={128}
                    height={34}
                    rx="6"
                    fill="#382B38"
                    stroke="#7B4D60"
                  />
                  <path
                    d="M83 129v14m-6-6 6 6 6-6"
                    stroke="#F3A4AA"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M105 136h39"
                    stroke="#C48E9B"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <rect
                    x="153"
                    y="129"
                    width={28}
                    height={14}
                    rx="4"
                    fill="#523846"
                  />
                  <path
                    d="M160 136h14"
                    stroke="#D4A0AB"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
                <path
                  d="M33 111h188"
                  stroke="#879AB8"
                  strokeDasharray="3 5"
                />
                <path
                  d="M32 107v8m190-8v8"
                  stroke="#879AB8"
                  strokeLinecap="round"
                />
              </g>
            </svg>
          </div>
          <h3 className="how-step-title">
            <span className="how-number">2.</span>{' '}
            <span>
              Fund your
              <br />
              account and trade
            </span>
          </h3>
          <p className="how-step-description">
            Deposit cbBTC directly or convert native BTC using SwapKit (integrated).
          </p>
        </li>
        <li className="how-step">
          <div className="how-artwork">
            <svg
              className="how-art"
              viewBox="20 10 220 160"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <g>
                <g>
                  <rect
                    x="35"
                    y="41"
                    width={69}
                    height={94}
                    rx="9"
                    fill="#10192A"
                    stroke="#324562"
                  />
                  <rect
                    x="28"
                    y="48"
                    width={69}
                    height={94}
                    rx="9"
                    fill="#172238"
                    stroke="#7F94B5"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M38 49h49a8 8 0 0 1 9 9v17H29V58a9 9 0 0 1 9-9Z"
                    fill="#1D2B43"
                  />
                  <path d="M29 76h67" stroke="#3B4E6D" />
                  <path
                    d="M40 63h26"
                    stroke="#C1CDE0"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <rect
                    x="38"
                    y="86"
                    width={49}
                    height={20}
                    rx="4"
                    fill="#2C63D8"
                    stroke="#5889F1"
                  />
                  <path
                    d="M48 96h29"
                    stroke="#D4E3FF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M40 123h28"
                    stroke="#7890B1"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </g>
                <path
                  d="M97 94h16"
                  stroke="#6F8DB5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M113 94c8 0 13-5 13-13V65c0-8 5-13 13-13h6"
                  stroke="#6F8DB5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M113 94c8 0 13 5 13 13v15c0 8 5 13 13 13h5"
                  stroke="#6F8DB5"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <circle cx="113" cy="94" r="2.5" fill="#A3BDDF" />
                <g>
                  <g>
                    <path
                      d="M150 29h12l10 10v31a5 5 0 0 1-5 5h-17a5 5 0 0 1-5-5V34a5 5 0 0 1 5-5Z"
                      fill="#1B2B45"
                      stroke="#91A8C9"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M162 29v10h10"
                      fill="#293F61"
                      stroke="#91A8C9"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="151"
                      y="48"
                      width={15}
                      height={13}
                      rx="3"
                      fill="#2C63D8"
                      stroke="#5889F1"
                      strokeWidth=".8"
                    />
                  </g>
                  <path
                    d="M178 38h19m-5-5 5 5-5 5"
                    stroke="#ED9077"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M197 67h-19m5-5-5 5 5 5"
                    stroke="#6DCB91"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g>
                    <g transform="translate(200 35) scale(.85)">
                      <g transform="translate(-289.60744,-341.50536)">
                        <g transform="matrix(0.61129216,0,0,0.61129216,170.80346,315.53734)">
                          <path
                            d="m258.845 82.989c-4.274 17.143-21.637 27.576-38.782 23.301-17.138-4.274-27.571-21.638-23.295-38.78 4.272-17.145 21.635-27.579 38.775-23.305 17.144 4.274 27.576 21.64 23.302 38.784z"
                            fill="#f7931a"
                          />
                          <path
                            d="m241.91 70.689c0.637-4.258-2.605-6.547-7.038-8.074l1.438-5.768-3.511-0.875-1.4 5.616c-0.923-0.23-1.871-0.447-2.813-0.662l1.41-5.653-3.509-0.875-1.439 5.766c-0.764-0.174-1.514-0.346-2.242-0.527l0.004-0.018-4.842-1.209-0.934 3.75c0 0 2.605 0.597 2.55 0.634 1.422 0.355 1.679 1.296 1.636 2.042l-1.638 6.571c0.098 0.025 0.225 0.061 0.365 0.117-0.117-0.029-0.242-0.061-0.371-0.092l-2.296 9.205c-0.174 0.432-0.615 1.08-1.609 0.834 0.035 0.051-2.552-0.637-2.552-0.637l-1.743 4.019 4.569 1.139c0.85 0.213 1.683 0.436 2.503 0.646l-1.453 5.834 3.507 0.875 1.439-5.772c0.958 0.26 1.888 0.5 2.798 0.726l-1.434 5.745 3.511 0.875 1.453-5.823c5.987 1.133 10.489 0.676 12.384-4.739 1.527-4.36-0.076-6.875-3.226-8.515 2.294-0.529 4.022-2.038 4.483-5.155zm-8.022 11.249c-1.085 4.36-8.426 2.003-10.806 1.412l1.928-7.729c2.38 0.594 10.012 1.77 8.878 6.317zm1.086-11.312c-0.99 3.966-7.1 1.951-9.082 1.457l1.748-7.01c1.982 0.494 8.365 1.416 7.334 5.553z"
                            fill="#fff"
                          />
                        </g>
                      </g>
                    </g>
                  </g>
                </g>
                <g>
                  <g>
                    <rect
                      x="178"
                      y="101"
                      width={53}
                      height={58}
                      rx="8"
                      fill="#10192A"
                      stroke="#324562"
                    />
                    <path
                      d="M180 107h31l14 14v36a8 8 0 0 1-8 8h-37a8 8 0 0 1-8-8v-42a8 8 0 0 1 8-8Z"
                      fill="#1B2B45"
                      stroke="#91A8C9"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M211 107v14h14"
                      fill="#293F61"
                      stroke="#91A8C9"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <rect
                      x="183"
                      y="116"
                      width={19}
                      height={8}
                      rx="2.5"
                      fill="#2C63D8"
                      stroke="#5889F1"
                      strokeWidth=".8"
                    />
                    <path
                      d="m183 143 8 8 18-20"
                      stroke="#A9C6FF"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <g>
                    <path
                      d="M145 114h23v8c0 6-5 9-8 13 3 4 8 7 8 13v8h-23v-8c0-6 5-9 8-13-3-4-8-7-8-13v-8Z"
                      fill="#132139"
                      stroke="#91A8C9"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M149 120h15v3c0 3-5 6-7.5 9-2.5-3-7.5-6-7.5-9v-3Z"
                      fill="#729FFF"
                    />
                    <path
                      d="m156.5 143 7.5 7v2h-15v-2l7.5-7Z"
                      fill="#729FFF"
                    />
                    <path
                      d="M142 113h29m-29 44h29"
                      stroke="#B4C8E5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </div>
          <h3 className="how-step-title">
            <span className="how-number">3.</span> <span>Trade or settle</span>
          </h3>
          <p className="how-step-description">
            Sell before settlement or hold until the market resolves.
          </p>
        </li>
      </ol>
      <div className="how-foundation">
        <div className="how-foundation-item">
          <p><strong>Illustrative payout example.</strong> Buy Yes at 0.20 cbBTC. If Yes wins, receive 1 cbBTC. Otherwise, lose the 0.20 cbBTC paid.</p>
        </div>
        <div className="how-foundation-item">
          <p>The payout includes the amount paid and is before fees. Collateral and technical risks still apply.</p>
        </div>
      </div>
      <div className="landing-how-action"><a className="button button-primary" href={site.appUrl} data-v3-cta="app" data-v3-placement="how">Explore markets →</a></div>
    </section>
  )
}

function Closing() {
  return (
    <section className="closing-section" aria-labelledby="closing-title">
      <div className="closing-content">
        <h2 className="closing-title" id="closing-title">
          Read a sample research email.
        </h2>
        <p className="closing-description">
          Simple to understand. Practical to use.
        </p>
        <p className="landing-closing-newsletter">This demo does not create a subscription.</p>
        <div className="closing-actions">
          <a
            className="button button-primary"
            href="/newsletter"
            data-v3-cta="newsletter"
            data-v3-placement="closing"
          >
            Read sample email{' '}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 12h15m-6-6 6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            className="button button-secondary"
            href={`mailto:${site.contactEmail}`}
          >
            Contact us
          </a>
        </div>
      </div>
      <svg
        className="closing-landscape"
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M0 25c62 4 79 42 130 40 52-2 72 36 132 38 63 1 94 28 154 33 73 6 126 20 200 24H0V25Z"
          fill="#111E35"
        />
        <path
          d="M0 72c64-4 88 24 145 28 54 4 79 30 141 32 84 3 144 21 224 28H0V72Z"
          fill="#192D50"
        />
        <path
          d="M0 116c71-9 105 19 182 21 81 3 145 18 216 23H0v-44Z"
          fill="#223C65"
        />
        <path
          d="M1440 15c-66 8-96 39-148 44-60 6-76 35-137 41-64 5-93 25-157 33-73 8-125 23-202 27h644V15Z"
          fill="#111E35"
        />
        <path
          d="M1440 64c-73 7-100 29-162 34-53 5-85 30-148 33-76 4-134 24-208 29h518V64Z"
          fill="#192D50"
        />
        <path
          d="M1440 109c-76-1-113 23-188 28-77 5-135 19-205 23h393v-51Z"
          fill="#223C65"
        />
        <path
          d="M0 25c62 4 79 42 130 40 52-2 72 36 132 38 63 1 94 28 154 33m1024-121c-66 8-96 39-148 44-60 6-76 35-137 41-64 5-93 25-157 33"
          stroke="#304C78"
          strokeWidth="1"
        />
      </svg>
    </section>
  )
}

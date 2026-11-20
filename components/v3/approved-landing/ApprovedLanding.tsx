import type { HowItWorksCopy, LandingCopy } from '@/dictionaries'
import type { Language } from '@/lib/languages'
import { Gauge, ShieldWarning, Target } from '@phosphor-icons/react/dist/ssr'
import { Suspense } from 'react'
import { site } from '@/lib/site'
import { AudienceDisclosure } from '../AudienceDisclosure'
import { ApprovedLandingMotion } from './ApprovedLandingMotion'
import { DifficultyImpactLoading, DifficultyImpactSection } from './DifficultyImpactSection'
import { HowItWorksDemo } from './HowItWorksDemo'
import { LandingHistory, LandingHistoryFallback } from './LandingHistory'
import { LandingTeam } from './LandingTeam'
import { LandingTrust } from './LandingTrust'

export function ApprovedLanding({ copy, language, howItWorks }: { copy: LandingCopy; language: Language; howItWorks: HowItWorksCopy }) {
  return (
    <ApprovedLandingMotion>

      <Hero copy={copy} />

      <Audience copy={copy} />

      <Why copy={copy} />

      <How copy={howItWorks} />

      <Suspense fallback={<LandingHistoryFallback copy={copy} />}>

        <LandingHistory copy={copy} language={language} />

      </Suspense>

      <Suspense fallback={<DifficultyImpactLoading copy={copy} />}>

        <DifficultyImpactSection copy={copy} language={language} />

      </Suspense>

      <LandingTrust copy={copy} />

      <LandingTeam copy={copy} />

      <Closing copy={copy} />

    </ApprovedLandingMotion>
  )
}

function Hero({ copy }: { copy: LandingCopy }) {
  return (
    <section className="hero" aria-labelledby="hero-title">

      <div className="hero-copy">

        <h1 id="hero-title">

          <span>{copy.tradeBitcoin}</span>{' '}<span className="accent">{copy.hashrate}</span>

        </h1>

        <p className="lead">
          {copy.aBitcoinNativeMarketFor}
        </p>

        <p className="description">

          <span>
            {copy.investorsCanTradeViewsOnWhere}
          </span>{' '}

          <span>
            {copy.minersCanHedgeRisingBitcoin}
          </span>

        </p>

        <div className="actions">

          <a
            className="button button-primary"
            href={site.appUrl}
            data-v3-cta="app"
            data-v3-placement="hero"
          >
            {copy.enterApp}{' '}

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
            {copy.talkToUs}
          </a>

        </div>

        <p className="hero-risk">
          {copy.youCanLoseTheFull}
        </p>

      </div>

      <div className="visual">

        <figure className="chart-panel" aria-labelledby="chart-title">

          <div className="chart-header">

            <h2 id="chart-title">{copy.bitcoinHashrateAndPrice}</h2>

            <div className="chart-legend" aria-label={copy.chartSeries}>

              <span className="chart-key chart-key-hashrate">{copy.hashrate2}</span>

              <span className="chart-key chart-key-price">{copy.bitcoinPrice}</span>

            </div>

          </div>

          <svg
            className="chart"
            viewBox="0 0 540 240"
            preserveAspectRatio="none"
            role="img"
            aria-label={copy.illustrativeLinesForBitcoinHashrate}
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
            {copy.illustrativeChartNotLiveData}
          </figcaption>

        </figure>

        <section className="market-panel" aria-labelledby="market-title">

          <h2 className="market-title" id="market-title">
            {copy.willBitcoinDifficultyBeAt}
          </h2>

          <div className="market-scroll">

            <table
              className="market-table"
              aria-label={copy.illustrativeBitcoinDifficultyMarketQuotes}
            >

              <caption className="market-source">
                {copy.illustrativeQuotesInCbbtcNot}
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

                    <span className="table-eyebrow">{copy.difficultyThreshold}</span>

                  </th>

                  <th colSpan={3} className="block-meta" scope="colgroup">

                    <span className="table-eyebrow">
                      {copy.block}{' '}<strong className="block-number">929,776</strong>

                    </span>

                    <span className="table-meta">
                      {copy.exampleObservationBlock}
                    </span>

                  </th>

                </tr>

                <tr className="column-row">

                  <th className="yes-label" scope="col">
                    {copy.buyYes}
                  </th>

                  <th scope="col">{copy.currency}</th>

                  <th className="no-label" scope="col">
                    {copy.buyNo}
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

                    <span className="market-currency-icon" role="img" aria-label={copy.cbBtcWrappedBitcoin}>

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

                    <span className="market-currency-icon" role="img" aria-label={copy.cbBtcWrappedBitcoin}>

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

function Audience({ copy }: { copy: LandingCopy }) {
  return (
    <section
      id="who-its-for"
      className="audience-section"
      aria-labelledby="audience-heading"
    >

      <h2 className="audience-heading" id="audience-heading">
        {copy.whoItIsFor}
      </h2>

      <div className="audience-grid">

        <article
          className="audience-panel audience-traders"
          aria-labelledby="audience-traders-title"
        >

          <h3 className="audience-title" id="audience-traders-title">
            {copy.forTradersAndInvestors}
          </h3>

          <p className="audience-description">
            {copy.tradeBitcoinDifficultyAsA}
          </p>

          <a className="landing-copy-link" href="/for/institutions">{copy.seeHow}</a>

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
            {copy.forMiners}
          </h3>

          <p className="audience-description">
            {copy.hedgeRisingDifficultyOrTrade}
          </p>

          <a className="landing-copy-link" href="/for/miners">{copy.seeHow}</a>

          <button
            className="audience-art-control"
            type="button"
            disabled
            data-illustration="mining"
            data-pause-label={copy.pauseMiningAnimation}
            data-resume-label={copy.resumeMiningAnimation}
            aria-label={copy.pauseMiningAnimation}
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

function Emphasized({ text, terms }: { text: string; terms: string[] }) {
  const pattern = new RegExp(`(${terms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g')
  return <>{text.split(pattern).map((part, index) => terms.includes(part) ? <strong key={index}>{part}</strong> : part)}</>
}

function Why({ copy }: { copy: LandingCopy }) {
  return (
    <section id="why-doefin" className="why-section" aria-labelledby="why-heading">

      <h2 className="why-heading" id="why-heading">
        {copy.whyDoefin}
      </h2>

      <AudienceDisclosure
        className="why-market-reference"
        summary={copy.hashrateAndBitcoinMiningDifficulty}
      >

        <dl className="why-market-terms">

          <div>

            <dt><Gauge aria-hidden="true" />{' '}{copy.hashrate2}</dt>

            <dd>{copy.theEconomicExposureBehindThe}</dd>

          </div>

          <div>

            <dt><Target aria-hidden="true" />{' '}{copy.bitcoinMiningDifficulty}</dt>

            <dd><Emphasized text={copy.determinesEachMarketOutcomeEach} terms={[copy.difficultyThresholdInline, copy.settlementBlock]} /></dd>

          </div>

        </dl>

        <div className="why-market-use">

          <p><Emphasized text={copy.theseMarketTermsGiveMiners} terms={[copy.minersInline, copy.professionalInvestorsInline]} /></p>

          <p className="why-market-risk"><ShieldWarning aria-hidden="true" />{' '}{' '}<span>{copy.aDifficultyPositionMayOffset}</span></p>

        </div>

      </AudienceDisclosure>

      <div className="why-layout">

        <article
          className="why-panel why-drivers"
          aria-labelledby="why-drivers-title"
        >

          <div className="why-driver-copy">

            <h3 className="why-title" id="why-drivers-title">
              {copy.trustlessBitcoinOracle}
            </h3>

            <p className="why-description">
              {copy.difficultyBlockHeightsAndTimestamps}
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

          <h3 className="why-title" id="why-views-title">{copy.fullyCollateralised}</h3>

          <p className="why-description">
            {copy.collateralisationLimitsTradingCounterparty}
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

            <span className="why-title-line">{copy.aBitcoinNative}</span>{' '}

            <span className="why-title-line">{copy.underlying}</span>

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

function How({ copy }: { copy: HowItWorksCopy }) {
  return <HowItWorksDemo copy={copy} />
}

function Closing({ copy }: { copy: LandingCopy }) {
  return (
    <section className="closing-section">

      <div className="closing-content">

        <div className="closing-actions">

          <a
            className="button button-secondary"
            href={`mailto:${site.contactEmail}`}
          >
            {copy.contactUs}
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

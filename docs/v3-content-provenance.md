# V3.1 content provenance

Reviewed 19 October 2026. This note records source evidence and limits for the V3-only documentation and research corrections. It is an internal review record, not product copy.

## App documentation snapshot

Read-only source: `/Users/fardinvahdat/workspace/doefin/doefin-local/repos/doefin-frontend`.

HEAD: `9751d6b56214cf81d2dcd42a31c2b111bb670828`. The reviewed MDX files were clean relative to that commit. No applicable `AGENTS.md` was found in the repository or its filesystem ancestors.

Primary documents under `app/docs/`:

- `getting-started/connecting-wallet/page.mdx`: email, Google and external-wallet sign-in; separate account-wallet balance.
- `getting-started/getting-collateral/page.mdx`: Funds, Transfer Crypto and From Extension deposit paths.
- `understanding-markets/how-markets-work/page.mdx`: threshold, observation block and equality rule.
- `trading-mechanics/your-first-trade/page.mdx`: market selection, preview, account setup and order confirmation.
- `trading/market-vs-limit-orders/page.mdx`: order types and liquidity/partial-fill considerations.
- `trading/order-management/page.mdx`: order states, cancellation and cancel-and-replace failure states.
- `trading-mechanics/prices-and-probability/page.mdx`: bid/ask, depth and implied-price interpretation.
- `portfolio/managing-positions/page.mdx` and `portfolio/redeeming-positions/page.mdx`: holdings, split/merge and redemption to the account.
- `advanced/collateral-tokens/page.mdx` and `technical/smart-contracts/page.mdx`: reviewed for context; unsupported current-token, deployment, audit and fee claims were not carried forward.

## Code cross-checks

The app working tree contained existing edits. These were read without modification and are evidence of local behavior, not proof of deployment parity.

| Path in app repository | SHA-256 at review | Use |
| --- | --- | --- |
| `components/Header/VaultMenu.tsx` (modified) | `5e2124d6c86eb057dbd143a61ad8447dd04efa6dfa4ba2efb7e7da525b25ef11` | Recipient-first withdrawal; total/locked/available balances; warnings affecting open BUY orders; confirmed versus submitted feedback. |
| `components/Order/EditOrderModal.tsx` (modified) | `bf1ab942d551c8e926db8a825fa9325e8d384a8da79618560fa4915049593e86` | Cancellation and replacement can fail separately. |
| `components/Portfolio/UnifiedPortfolioPanel.tsx` (modified) | `8725d703133c71d50567487cf8ebf481e4a9da365247240cc11a599899b16755` | Editing restricted to active, unexpired, completely unfilled limit orders. |
| `hooks/v3/useWithdraw.ts` | `9ce592f2d27756440c0169a9577364e1eea73370cdf98ea9fcefc33a3e9613c7` | Token transfer from the account wallet, destination validation and receipt tracking. |
| `hooks/v3/useDeposit.ts` | `88d50086e924c71a0ed6f85c8209f1c368ba9436e96d748d082dda605053b4bd` | External-wallet transfer to the account wallet and selected-network check. |

## Content decisions

- V3 has thirteen substantive documentation pages: the twelve existing topics plus `withdrawing-funds`. Source MDX wording was rewritten, not copied wholesale. Conflicting instant-execution, guaranteed sponsorship and stale supported-token claims were removed.
- V3-specific data, report, scoreboard, epoch and methodology modules replace unsupported measured figures, calibrated-band claims, provider rankings and immutable-archive promises. Synthetic values remain explicitly synthetic in visible copy and metadata.
- The two blog articles and three academy articles use V3-specific educational content. Unsupported numerical comparisons, fee-share claims and unqualified statements about competing publishers were removed.
- V3 About distinguishes company registration from regulatory authorisation and makes no verified regulatory, deployment or audit claim.
- Content is read through `content/index.ts`. V1/V2 source content remains intact; substitutions occur in `lib/v3-routes.ts`.

## Verification and remaining limits

Static inspection found thirteen unique documentation slugs, no missing related-document targets and no empty guides. Syntax parsing passed for the new modules. The lead owns the integrated build, route crawl and rendered review.

No sign-in, funding, trade, redemption or withdrawal was performed. Current deployment addresses, network/token availability, fee sponsorship, audit scope, legal entity, permissions and eligibility were not independently verified. Optional Bitcoin conversion availability is not asserted. No measured historical dataset or forecast-calibration evidence was supplied.

The inherited V1 Terms/Privacy content remains a separate owner/legal review item; this work does not manufacture legal terms or independently verify registration and access assertions.

## V3.3 documentation consolidation — 19 October 2026

The existing thirteen operating guides retain their source boundary above. Five explanatory/reference guides were added from the reviewed V3 material: overview, Bitcoin mining difficulty, risks and limitations, key terms, and methodology/evidence. The documentation now groups eighteen pages under Understand Doefin, Use the app and Reference. This is an editorial reorganisation, not a new audit of the live trading application.

The homepage uses an explicitly assumed payout of one unit versus zero to explain the binary condition. It names no live token or available market. The actual payout amount, token, entry cost and fees must be checked in the market specification. Research examples remain synthetic and are no longer presented as homepage evidence of product performance. Calculators remain optional, with no new data collection or external submission.
# V3.4 landing capture and copy — 19 October 2026

- User-selected source: the live Chrome tab at `https://www.doefin.com/app/markets/cbBTC/979776/137.2?side=yes`, captured on 19 October 2026. The unmodified viewport JPEG is `public/images/v3/market-detail-2026-10-19.jpg`; original viewport/full captures remain in task outputs. Mobile crops are CSS presentation, not altered prices or fabricated product UI. All capture values are historical, not live quotes.
- Main product references: difficulty threshold 137.2 T, observation block 979,776, displayed midpoint 68%, YES displayed ask 0.71000001 cbBTC and NO displayed ask 0.35 cbBTC. Bid/ask prices and midpoint express different quantities; the landing does not present them as calibrated forecasts or guarantee execution.
- The mechanics illustration reuses that threshold/block but assumes a 1-unit winning payout and hypothetical observations of 136 T or at least 137.2 T. It does not report actual settlement, profit or hedge effectiveness.
- Five homepage FAQ answers are concise summaries of the accepted V3 guides: funding, settlement, managing positions, market versus limit orders, and risks. Those source guides and their route registry were left unchanged. Answers remain in server-rendered HTML within native disclosures.
- No email provider is configured. The updates CTA is explicitly an email enquiry to the existing public contact address, not a newsletter subscription or delivery promise.


## V3.5 presentation refinement — 19 October 2026

The existing source boundaries remain. Hero and audience copy describe possible difficulty exposure management without guaranteeing hedge effectiveness or execution. The mobile market reading aid transcribes the existing 137.2 T / block 979,776 condition; it is explanatory text, not reconstructed order UI or a live quote. The unmodified screenshot and full-image link preserve access to the actual captured interface. Mechanics retains explicitly hypothetical observations and an assumed one-unit payout, separate from costs. The quieter updates link prepares an email enquiry only; no subscription or delivery is promised.

## V3.6 planning example and screenshot framing — 19 October 2026

The static miner example is a hypothetical planning situation derived from existing Docs: fixed hashrate/uptime/reward assumptions, lower expected BTC production at higher difficulty, and a binary market's threshold, timing, entry-cost and liquidity limitations. It reports no actual operation, measured hedge performance, market quote or recommended position size. The homepage promotes the existing distinction between gross payout and result after entry cost and fees.

The original image file is unchanged. ProductPreview presents only its question and chart through CSS framing (x14/y175/w918/h512 of the original 1440×756 capture), with an explicit cropped-screenshot label. The full original is still available through the image link; capture date and historical-pricing qualification remain visible. No prices were generated or retouched.

The final planning example makes the comparison explicit: a difficulty level 10% above baseline throughout the same month gives a production ratio of 1 / 1.10, or approximately 9.1% less expected BTC. This is a hypothetical sensitivity calculation under fixed hashrate, uptime and rewards, not a live forecast or hedge return. Decimal arithmetic verified the displayed rounding; no money, token quantity or recommended position size is calculated.

## V3.7 visual assets — 19 October 2026

- HeroVisual.tsx / HeroVisual.module.css: original editable SVG illustration created for this prototype. Isometric Bitcoin blocks, a fixed observation plane and a threshold guide are conceptual; no prices, projected returns or live network data are depicted. HTML caption identifies it as a concept illustration.
- BrandIcon.tsx: original small outline icon family, with consistent 24px viewBox and 1.5px rounded strokes. Icons are decorative alongside explicit text labels; they do not add new product capabilities.
- app/v3/home.css: palette and primary gradient derived from the user's doefin-frontend tailwind.config.js, UI/Button.tsx and Home/Home.css. Other shades in the vector describe lighting and depth.
- The authentic market screenshot and its historical-pricing disclosure remain unchanged. All existing FAQ answers, payout/profit wording and miner-example assumptions are retained.

## V3.8 explanatory hero — 19 October 2026

HeroVisual replaces the conceptual block scene with an original SVG/HTML diagram of the existing market condition: difficulty at Bitcoin block 979,776 compared with 137.2 T. The at-or-above branch resolves YES and the below branch resolves NO. Both outcomes are shown equally; no actual observation, resolution, quote, forecast or profit is displayed. The visible caption says “Illustrative market rule” and defines T as trillion. Exact threshold/block values reuse the unchanged product capture and mechanics example.

Mobile uses a separate compact vector with the same HTML labels and rule. A finite CSS sequence highlights the block reference, comparison and both branches; all semantic content and static connecting paths exist before hydration and with reduced motion. The homepage lede now explicitly introduces taking a YES or NO position; existing risk and cost qualifications remain. Supporting label changes are scoped to the landing stylesheet, without editing the accepted Docs or screenshot components.

## V3.9 wording and presentation — 19 October 2026

The hero presents the same binary condition as a question: “Will difficulty reach 137.2 T?” at Bitcoin block 979,776. Explicit at-or-above / below outcomes retain the inclusive threshold rule. The introductory copy asks about a set future difficulty level and describes trading a view or exploring a hedge; no effectiveness, profit, availability or actual outcome is promised. The screenshot, market example and Docs source content are unchanged.

Mobile presents the existing product section before the existing audience section. Each is rendered once, with responsive DOM ordering after hydration. Desktop retains its previous sequence. Motion is a one-time explanation gated by visibility, with a reading pause and slower stages; it never hides labels or chooses an outcome.

## V3.10 clarity — 19 October 2026

Hero and mechanics use the existing Docs definition: purchased outcome tokens, difficulty at or above the threshold at the specified block, resolution, then redemption. The payout illustration defines a single YES position token and its stated gross payout in the market’s funding token; no denomination, live price, dollar conversion or contract amount is invented. Fees and purchase cost remain separate from gross payout. A miner’s possible partial offset depends on position cost, size and timing.

Chart wording was checked against local doefin-frontend: hooks/usePriceHistory.ts documents daily VWAP from fills; app/api/markets/[market_id]/price-history/route.ts proxies backend probability values; MarketProbabilityChart.tsx plots those percentages and labels them daily traded prices / YES implied chance. The separate current-chance badge is based on bid/ask information and is not described as the historical line’s calculation. The backend normalization, captured market data and deployed implementation have not been independently verified. Caption describes the line as daily YES trade prices shown as implied chance, distinguishes it from network difficulty and keeps the historical/non-forecast disclosure.

Payout wording also matches hooks/v3/useRedeemPositions.ts and lib/v3/fees.ts in that frontend. PayoutBreakdown distinguishes the gross winning-share amount, resolution fee and received amount. The website does not promise automatic receipt, fee-free payout or profit. Original image pixels and Docs remain unchanged.


## V3.11 payout comparison — 19 October 2026

The panel reuses the illustrative observation block 979,776 and difficulty threshold 137.2 T. At or above the threshold, YES tokens pay and NO tokens do not; below it, NO tokens pay and YES tokens do not. Only difficulty at that block decides the comparison. These are conditional examples, not an actual resolution.

The comparison is per position token and describes the fixed contract payout in the market’s funding token before fees. It invents no amount, denomination, price or dollar conversion; the app supplies the exact amount and asset. Larger difficulty moves do not increase the binary payout. Gross payout minus purchase cost and applicable fees gives profit or loss. Redemption follows market resolution and is not described as an automatic wallet receipt. Docs, captured product image and all other landing content remain in their existing scope.


## V3.12 explicit losing payouts — 19 October 2026

Zero payout refers to losing position tokens at settlement, not their possible resale value before settlement. The purchase cost is not refunded by redemption. Winning tokens retain the stated fixed gross payout in the market’s funding token; no live amount, denomination, market result or profit is invented. Gross payout minus purchase cost and fees is labelled profit or loss. The outcome cards, formula and explicit loss explanation remain server-rendered, visible text. The settlement guide and all accepted Docs are unchanged.


## V3.13 settlement comparison — 19 October 2026

This is a new visual composition of the existing conditional example: block 979,776, threshold 137.2 T, at-or-above YES payout / NO zero, below YES zero / NO payout. No actual resolution, quote, denomination or amount is asserted. The table is explicitly a settlement example with per-token payouts before fees. Losing tokens have no payout and purchase cost is not refunded. Gross payout minus purchase cost and fees remains the profit/loss calculation. Payout is fixed in the market’s funding token, larger difficulty moves do not increase it, and the app provides the amount/token to check before buying. Redemption follows resolution. The block icon is the existing BrandIcon asset; no new raster assets or dependencies.


### V3.14 illustrative purchase story

The payout section now uses explicitly hypothetical whole-position amounts: 60 funding-token units paid, assumed fixed gross payout 100 if YES wins, zero if NO wins. The resulting 40 gain/60 loss excludes fees. This is arithmetic illustration, not an observed market quote, current collateral promise, per-token amount or USD/native-BTC representation. This supersedes V3.13's no-numerical-example choice. The same token denominates all amounts; actual market price, payout and fees must be checked in the app. The example assumes an executed purchase held through resolution. Measurement remains at block 979,776 with inclusive 137.2 T threshold; redemption follows resolution. Existing Docs are unchanged.

### V3.15 example-unit clarification

The numerical assumptions remain unchanged from V3.14. Copy now explicitly defines the figures as totals for one example purchase in the token used to pay, rather than a quantity of YES tokens. The 100-unit winning payout is assumed and before fees. Both outcomes refer to the same held YES position, preventing the zero payout from being read as a winning NO-token payout. No actual supported asset, live price, per-token amount or new operational claim has been introduced. Docs remain unchanged.


### V3.16 color and label refinement

Whole-position example assumptions remain: 60 units paid in the payment token, assumed gross winning payout 100, 40 profit before fees or zero payout and 60 loss before fees. The shortened unit explanation still identifies totals for one purchase. Total payout and +40 profit distinguish gross proceeds from earnings; threshold, observation block, holding through resolution and redemption wording are unchanged. Green #3EC875 and red-orange #F05122 reuse the local doefin-frontend success/error palette; they describe the held position's result, not intrinsic YES/NO profitability. Docs and all other landing content are unchanged.


### V3.17 subscription prototype

The user explicitly selected form prototype only. ProductUpdates.tsx validates local input and displays neutral preview feedback; it sends no request, persists no address and makes no subscription or delivery claim. The new envelope SVG is an original decorative outline. Product-update benefit copy is proposed signup copy, with a persistent disclosure that no email is submitted or saved. No research cadence, opt-in mechanism or unsubscribe capability is claimed. The existing privacy route remains a legal-content placeholder. Real subscription functionality requires a chosen provider and agreed actual behavior in a subsequent scope. The existing six-section structure and accepted Docs are preserved.


### V3.18 captured-chart correction and proposed signup wording

The unchanged 19 October 2026 market capture explicitly labels its chart Order-book midpoint at the close of every hour and selects 1H. The new caption, alt text and historical-snapshot disclosure follow that visible label. This supersedes V3.10's daily-trade description for this image. The local doefin-frontend checkout currently describes daily VWAP from order fills in MarketProbabilityChart.tsx and usePriceHistory.ts; that source does not establish the captured deployment's implementation. Local current-chance code uses a YES bid/ask midpoint with an ask-only fallback, but this does not verify the captured historical data or backend calculation. No backend parity claim is made.

The hero audience cue reuses the existing mining-operator and funds/trading-desk audiences. Get Doefin product updates and New features and changes to the app, in your inbox are proposed signup copy. The persistent Form preview only disclosure and neutral completion state remain; no email is sent or saved. No cadence, delivery, subscriber count, opt-in or unsubscribe promise has been added. The existing Privacy page remains a placeholder and is unchanged. Six sections and all accepted Docs are preserved.

### V3.21 responsive capture summary and compact payout

The mobile market question, 137.2 T threshold, Bitcoin block 979,776 and 68% YES value are transcribed from the unchanged 19 October 2026 capture. The October plot is a CSS-framed detail at x624/y438/w288/h204 of the original 1440×756 image; no curve or numerical series is generated. Readable HTML axes reproduce its 0–100% scale and October date positions. The separate captured-chance value is not described as a calculation from the historical line. The caption follows the image's hourly order-book-midpoint label; it does not establish parity with the current local frontend source or backend. The original image and full-screenshot link remain unchanged.

The payout example retains 60 payment-token units paid, assumed gross winning payout 100, 40 profit before fees or zero payout and 60 loss before fees. Shorter labels still refer to the same held YES position and illustrative whole-position totals. Both threshold conditions, observation block, redemption and fee qualification remain visible. Approved colors, section order, subscription component/design and accepted Docs are unchanged. Subscription continues to send and save no address.

### V3.22 captured probability and aggregate payout

Market-implied chance of YES describes the same captured 68%; it is not represented as Doefin forecast accuracy or a tradable quote. The historical line remains described as hourly order-book midpoints. Original pixels, timestamp and not-live disclosure are preserved.

The separate illustrative purchase now explains that the assumed 100-unit gross winning payout is the aggregate of tokens held times each token's stated payout. This relationship is supported by existing content/v3-docs.ts and the local frontend's lib/v3/fees.ts and components/Portfolio/PayoutBreakdown.tsx, which aggregate winning holdings and separate fees from gross proceeds. It does not establish current deployed-contract parity. No numeric token quantity, per-token constant or supported payment asset is asserted. The example's arithmetic, outcome conditions and fee qualifications remain unchanged, as do Docs and the non-submitting subscription prototype.

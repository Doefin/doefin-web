export type V3Doc = {
  slug: string
  title: string
  summary: string
  group: 'Understand Doefin' | 'Use the app' | 'Reference'
  reviewedAt?: string
  sections: { title: string; paragraphs?: string[]; steps?: string[]; definitions?: { term: string; definition: string }[] }[]
  optionalLinks?: { href: string; label: string }[]
  related: string[]
}

export const v3DocReviewedAt = '2026-10-19'
export const v3DocGroups = ['Understand Doefin', 'Use the app', 'Reference'] as const

const docs: V3Doc[] = [
  // Added 19 October 2026 from the reviewed V3 operating guides, V3 editorial
  // difficulty explanation and V3 research methodology. These are explanations,
  // not a new verification of live markets, deployments or forecast performance.
  {
    slug: 'overview', title: 'Doefin overview',
    summary: 'Understand the market, the outcome it tracks and the steps between an order and a withdrawal.', group: 'Understand Doefin', reviewedAt: '2026-10-19',
    sections: [
      { title: 'A market on Bitcoin mining difficulty', paragraphs: ['Doefin lets participants take positions on whether Bitcoin mining difficulty will be at or above a stated threshold at a specified block height. The market concerns difficulty, rather than Bitcoin’s price or the revenue of a particular mining operation.', 'Each market has its own threshold, observation block, outcome sides and collateral token. Read that specification before interpreting a price or deciding whether to place an order.'] },
      { title: 'An order, a position and a payout are different', paragraphs: ['An order is an instruction to buy or sell. If it fills, the resulting position is a holding of outcome tokens. A market or limit order can depend on available liquidity and may not fill completely.', 'After the market resolves, winning tokens can be redeemed for the specified collateral payout; losing tokens have no payout. The amount received is not the same as profit, because the price paid and applicable costs matter. Moving proceeds from the Doefin account to an external wallet requires a separate withdrawal.'] },
      { title: 'Choose what you need to understand next', paragraphs: ['Start with mining difficulty and market mechanics if the underlying is new to you. Read settlement and the risks before moving to the app guides.', 'The Use the app guides cover sign-in, funding, orders and account actions. Reference pages define the terms and explain what evidence to check. Calculators are optional aids for exploring assumptions; no calculation or input is required to read these docs.'] },
    ], related: ['bitcoin-mining-difficulty', 'what-doefin-settles-on', 'risks-and-limitations', 'connecting-a-wallet'],
  },
  {
    slug: 'bitcoin-mining-difficulty', title: 'Bitcoin mining difficulty',
    summary: 'Understand the underlying, why its timing is estimated and how it differs from mining revenue.', group: 'Understand Doefin', reviewedAt: '2026-10-19',
    sections: [
      { title: 'What difficulty measures', paragraphs: ['Mining difficulty describes the work required to find a valid Bitcoin block relative to the reference target. It is dimensionless; a quoted level using T expresses the value in trillions. It is different from hashrate, which measures hashing work per second.', 'Bitcoin periodically adjusts difficulty using elapsed time in the preceding adjustment period. Faster block production generally leads to higher difficulty, and slower production generally leads to lower difficulty, subject to the protocol’s rules.'] },
      { title: 'Block height and calendar time', paragraphs: ['Individual blocks arrive irregularly. A specified block height identifies an observation, but the calendar date when it will arrive is an estimate. A projection made before that observation is complete remains a forecast.', 'For a Doefin market, check the specified observation block and threshold. Reaching the block, recording the resolved outcome and redeeming a position are separate stages.'] },
      { title: 'Production and revenue are broader questions', paragraphs: ['For a fixed hashrate and time window, higher difficulty lowers expected block production. Actual results also depend on block discovery, uptime and pool arrangements. Revenue further depends on rewards, fees and the Bitcoin price.', 'A binary difficulty position has a threshold-based payout. That payout does not scale with every change in a fleet’s production, so a production estimate alone does not determine an appropriate position size.'] },
    ], related: ['what-doefin-settles-on', 'how-settlement-works', 'key-terms'],
    optionalLinks: [{ href: '/tools/difficulty-exposure', label: 'Optional: explore production sensitivity in the calculator' }],
  },
  {
    slug: 'risks-and-limitations', title: 'Risks and limitations',
    summary: 'Review the limits of execution, payout, collateral and operational cover before using a market.', group: 'Understand Doefin', reviewedAt: '2026-10-19',
    sections: [
      { title: 'Outcome and execution risk', paragraphs: ['A losing outcome token has no payout. Even a winning position’s net result depends on its acquisition price and applicable costs. The displayed price or implied probability is not a guarantee of the outcome.', 'Available liquidity affects whether an order can execute and at what price. A limit order may stay open or fill partly, and a displayed position valuation does not establish that the entire holding can be sold for that amount.'] },
      { title: 'Collateral and technical dependencies', paragraphs: ['Read the exact collateral token, network and payout denomination. Tokens with similar names may have different contracts or redemption arrangements; a wrapped Bitcoin token is not native Bitcoin.', 'Account permissions, token approvals, contracts and market resolution introduce separate dependencies. Ask for deployment addresses and review evidence matched to the current implementation. These docs do not certify the deployment, audit coverage or uninterrupted availability.'] },
      { title: 'A position does not cover every operating risk', paragraphs: ['A difficulty market has a binary payout at a defined observation. Mining production changes continuously and depends on fleet hashrate, uptime and other inputs. The two can differ in timing and magnitude.', 'Power costs, fees, Bitcoin price and changes in the operation remain separate considerations. Calculator scenarios illustrate sensitivity; they do not establish suitability, a hedge size or a contract payout.'] },
      { title: 'Resolve open questions before funding', paragraphs: ['Check the current market specification, transaction confirmation, applicable terms and access requirements. An organisation should also resolve its internal permissions and review requirements. Contact the team for current information when the documents or app do not answer a material question.'] },
    ], related: ['what-doefin-settles-on', 'market-vs-limit-orders', 'collateral-tokens', 'smart-contracts'],
  },
  {
    slug: 'key-terms', title: 'Key terms',
    summary: 'A compact reference for the market, account and execution terms used throughout these docs.', group: 'Reference', reviewedAt: '2026-10-19',
    sections: [
      { title: 'Underlying and market', definitions: [
        { term: 'Mining difficulty', definition: 'The work required to find a valid Bitcoin block relative to the reference target; a dimensionless measure.' },
        { term: 'Hashrate', definition: 'Hashing work per second, commonly expressed in TH/s, PH/s or EH/s.' },
        { term: 'Threshold', definition: 'The difficulty level against which the observed outcome is compared.' },
        { term: 'Observation block', definition: 'The specified Bitcoin block height used to observe difficulty for a market.' },
        { term: 'Binary payout', definition: 'A payout determined by which of two outcomes occurs, rather than by the size of a move beyond the threshold.' },
        { term: 'Collateral', definition: 'The asset used to fund a position and denominate its payout.' },
      ] },
      { title: 'Trading and account actions', definitions: [
        { term: 'Order', definition: 'An instruction to buy or sell that may be open, partly filled, filled, cancelled or expired.' },
        { term: 'Position', definition: 'A holding of outcome tokens for a specific market and collateral.' },
        { term: 'Liquidity', definition: 'Available trading interest that an order can match, with quantity and price conditions.' },
        { term: 'Redemption', definition: 'Conversion of resolved winning outcome tokens into collateral in the account.' },
        { term: 'Withdrawal', definition: 'A transfer of account funds to a selected external recipient on the specified network.' },
      ] },
    ], related: ['what-doefin-settles-on', 'prices-and-probability', 'managing-positions', 'methodology-and-evidence'],
  },
  {
    slug: 'methodology-and-evidence', title: 'Methodology and evidence',
    summary: 'Distinguish observed difficulty, a forecast, a market price and an illustrative calculation.', group: 'Reference', reviewedAt: '2026-10-27',
    sections: [
      { title: 'Identify the kind of information', paragraphs: ['An observed difficulty level describes network data at a stated block. A forecast projects a later value using information available when it was issued. A market price reflects trading interest and costs. An illustrative calculation applies selected assumptions.', 'Keep those categories separate. A forecast does not resolve a position, and an example dataset does not establish a live forecast service or a historical performance record.'] },
      { title: 'Make a forecast reproducible', paragraphs: ['Check the source block heights and timestamps, current difficulty, target adjustment, formula, protocol constraints and rounding rules. Record the issue time and method version so the output can be reproduced.', 'Any uncertainty range needs a construction method and evaluation against outcomes. Compare interval coverage and width across a stated evaluation window; a range alone does not establish calibration.'] },
      { title: 'Read the limits of the website examples', paragraphs: ['The observed-adjustment research report uses a frozen capture of 25 observed difficulty changes. The website’s forecast examples and displayed example ranges remain authored illustrations. Neither establishes measured forecast accuracy, a forecaster ranking or a verified running forecast service.', 'A production-sensitivity calculation holds selected inputs constant to compare scenarios. It does not forecast difficulty or translate directly into a contract payout. The assumptions and limitations belong alongside the result.'] },
    ], related: ['bitcoin-mining-difficulty', 'prices-and-probability', 'risks-and-limitations', 'smart-contracts'],
  },
  {
    slug: 'what-doefin-settles-on', title: 'What Doefin settles on',
    summary: 'Bitcoin mining difficulty at a specified block height determines the market outcome.', group: 'Understand Doefin',
    sections: [
      { title: 'Read the threshold and observation block', paragraphs: ['A difficulty market asks whether Bitcoin mining difficulty will be at or above a stated threshold at its observation block. The at-or-above side includes equality; the other side wins below the threshold. Read the actual market specification before placing an order.', 'Difficulty is a network parameter, not Bitcoin’s price, a miner’s revenue or an individual fleet’s hashrate. The “T” in a difficulty level means trillion; difficulty itself is a dimensionless measure.'] },
      { title: 'Block height determines the observation', paragraphs: ['The market uses a Bitcoin block height. A calendar date shown alongside it is an estimate because blocks do not arrive on a fixed schedule. Reaching the observation block and having a resolved, redeemable position are separate stages.'] },
      { title: 'Separate the market outcome from your operation', paragraphs: ['A position has a binary payoff. Its payout does not increase with the size of a difficulty move beyond the threshold. A miner’s production varies continuously and also depends on hashrate, uptime and other assumptions; the position is not a complete replacement for lost production.'] },
    ], related: ['how-settlement-works', 'your-first-trade'],
  },
  {
    slug: 'how-settlement-works', title: 'How settlement works',
    summary: 'Understand the observation, resolved outcome and redemption of a difficulty position.', group: 'Understand Doefin',
    sections: [
      { title: 'From observation to resolution', paragraphs: ['The market specification identifies the threshold and observation block. The resolution process reports the observed Bitcoin difficulty and determines the winning outcome. Wait for the app to show that the market has resolved; an estimated date or a forecast does not resolve a position.'] },
      { title: 'Read payout separately from profit', paragraphs: ['Winning position tokens become redeemable for the contract’s full payout in its specified collateral token. Losing position tokens have no payout. Check the token and payout denomination for the particular market.', 'Gross redemption proceeds are not profit. Your acquisition cost, execution costs and any applicable fees affect the result. A larger move past the threshold does not produce a larger payout per token.'] },
      { title: 'Redeem, then withdraw if needed', paragraphs: ['Redemption converts the winning tokens into collateral in your Doefin account. It does not send the proceeds to an external wallet. Withdrawing funds is a separate action with its own recipient and confirmation.'] },
    ], related: ['redeeming-positions', 'withdrawing-funds', 'what-doefin-settles-on'],
  },
  {
    slug: 'connecting-a-wallet', title: 'Signing in to Doefin',
    summary: 'Use the sign-in options offered in the app and check the account you are accessing.', group: 'Use the app',
    sections: [
      { title: 'Choose a sign-in method', steps: ['Open the Doefin app and select Sign in.', 'Choose an available method: email, Google or a supported crypto wallet. Email uses a one-time code; a wallet connection can request an ownership-verification signature.', 'Check the signed-in account before funding or placing an order. Use the same sign-in method when returning to that account.'] },
      { title: 'Understand the two wallet roles', paragraphs: ['Email and Google sign-in can create an embedded wallet for the account. An external-wallet sign-in uses a wallet you connect. The app’s Funds balance refers to the Smart Contract Wallet used for trading; it is separate from funds held in an external wallet.', 'A sign-in request establishes account ownership. Read each later order or transaction confirmation separately: signing in does not mean you have placed an order or funded the account.'] },
      { title: 'If sign-in stalls', paragraphs: ['Check the email address and spam folder for a missing code. For wallet sign-in, unlock the wallet and inspect any pending request. If the request was cancelled or expired, restart sign-in and check the account shown afterwards. Never share an email code or wallet recovery phrase with support.'] },
    ], related: ['getting-collateral', 'your-first-trade'],
  },
  {
    slug: 'getting-collateral', title: 'Funding your Doefin account',
    summary: 'Select the token and network in Funds, then track the transfer into your trading account.', group: 'Use the app',
    sections: [
      { title: 'Check the destination before sending', paragraphs: ['Open Funds and select Deposit. The token, network and deposit address shown for your account determine what to send. Match all three in the sending wallet or exchange. A token’s familiar name alone does not identify the correct network or contract.'] },
      { title: 'Choose the available deposit route', steps: ['Transfer Crypto shows a deposit address and QR code. Copy that address into the sending service and select the network shown in Doefin.', 'From Extension, when offered, transfers a selected token from the connected external wallet. Review the amount and wallet confirmation.', 'Wait for confirmation and the Funds balance to update. Keep the transaction reference if the balance has not appeared; a submitted transaction is not yet a confirmed deposit.'] },
      { title: 'Check route-specific conditions', paragraphs: ['Read any quote, fee, minimum, expiry and receiving-asset information shown for the chosen route. A Bitcoin conversion route, if offered, has different instructions from an ordinary token transfer. Do not send native BTC to a token-deposit address.', 'External wallets, exchanges and conversion services can have their own network fees and processing times. Review the current confirmation rather than assuming a transfer is free or immediate.'] },
    ], related: ['collateral-tokens', 'your-first-trade', 'withdrawing-funds'],
  },
  {
    slug: 'your-first-trade', title: 'Placing your first order',
    summary: 'Review the market, available liquidity and confirmation before submitting an order.', group: 'Use the app',
    sections: [
      { title: 'Start with the market specification', steps: ['Sign in and check your available collateral in Funds.', 'Open a market and read its difficulty threshold, observation block, collateral token and resolution status.', 'Choose the outcome and whether you are buying or selling. Selling requires an available holding of the relevant position token.', 'Choose market or limit execution, then enter the amount. Review the quoted quantity, price, costs and any partial-fill or unavailable-liquidity message.'] },
      { title: 'Review and submit', paragraphs: ['If account setup is required, the app presents it before the order. Read that confirmation and any signing request. Then review the order confirmation itself; setup completion is not an order fill.', 'A market quote depends on available orders and can change. If no executable liquidity is available, no trade is assured. A limit order specifies price conditions but may remain open or fill only partly.'] },
      { title: 'Check what actually happened', paragraphs: ['After submission, inspect the order status and filled amount in Portfolio. An accepted or open order is not the same as a completed trade. Reconcile any remaining open amount before placing a replacement, and use the resulting position balance to confirm the exposure you hold.'] },
    ], related: ['market-vs-limit-orders', 'order-management', 'managing-positions'],
  },
  {
    slug: 'market-vs-limit-orders', title: 'Market and limit orders',
    summary: 'Market orders seek available execution; limit orders add a price condition. Neither guarantees a complete fill.', group: 'Use the app',
    sections: [
      { title: 'Market orders depend on available liquidity', paragraphs: ['A market order seeks execution against available orders. The order preview can show a weighted average price and an execution plan; the price displayed for a small quantity need not be available for the whole order.', 'Review the actual quote, available amount and any partial-fill warning. An empty or changing book can prevent execution. Refresh the quote when the app requires it rather than treating an earlier preview as a guarantee.'] },
      { title: 'Limit orders specify a price condition', paragraphs: ['A limit order sets the price at which you are willing to trade. It can match, remain open, fill in parts or expire. While an order is open, inspect the amount it reserves in your account.', 'A price condition does not guarantee a counterparty or execution. Check the remaining size and expiry in Portfolio, and cancel the unfilled portion if you no longer want it active.'] },
      { title: 'Compare the whole order', paragraphs: ['Compare outcome, direction, collateral, amount, average or limit price, fees and expiry. The same outcome in a different collateral token is a different instrument for funding and redemption.'] },
    ], related: ['prices-and-probability', 'order-management', 'your-first-trade'],
  },
  {
    slug: 'order-management', title: 'Managing orders',
    summary: 'Check fills, cancel the remaining amount and understand cancel-and-replace edits.', group: 'Use the app',
    sections: [
      { title: 'Find the order and its current state', paragraphs: ['Open Portfolio and the Orders tab. Compare the original amount, filled amount, remaining amount, expiry and status. Use the active/history filter to distinguish an open order from a completed one.', 'Cancelling an order affects only its unfilled portion. It does not reverse fills or remove position tokens you already acquired. Wait for the cancellation result and refresh the order state if the outcome is unclear.'] },
      { title: 'Editing cancels and replaces', paragraphs: ['The app offers editing for active, unexpired limit orders that are completely unfilled. An edit cancels the original order and submits a replacement with updated size, price or expiry. To change a partly filled order, inspect its fills and cancel the remainder before placing another order.', 'Cancellation and replacement can fail separately. If cancellation succeeded but the replacement was not signed or accepted, the old order is cancelled and there may be no replacement. Check Orders before submitting again.'] },
      { title: 'Reconcile reserved funds', paragraphs: ['Compare Total, Locked and Available balances after changes. A pending action or a stale balance is not confirmation that funds have been released. Use the order’s latest status and any transaction or request reference when asking the team to investigate.'] },
    ], related: ['managing-positions', 'market-vs-limit-orders', 'withdrawing-funds'],
  },
  {
    slug: 'prices-and-probability', title: 'Prices and implied probability',
    summary: 'A binary price can express a market-implied view, but it is not a calibrated forecast.', group: 'Understand Doefin',
    sections: [
      { title: 'Read price relative to the full payout', paragraphs: ['A binary token’s price as a fraction of its full payout is often read as an implied probability. That interpretation depends on the instrument, collateral and costs; it is a way to read a market price, not evidence that the stated chance is objectively correct.'] },
      { title: 'Separate the display from an executable quote', paragraphs: ['The best bid, best ask, midpoint and a derived or estimated price describe different things. A displayed percentage need not be a price at which your full order can execute.', 'Review the available depth and your order preview. A wide spread or thin order book can make the displayed probability a weak summary of what participants would actually trade.'] },
      { title: 'Keep the outcome and cost basis separate', paragraphs: ['The resolved outcome determines the gross payout. The price you paid and your costs determine your result. Two traders can hold the same winning outcome and earn different returns because they entered at different prices.'] },
    ], related: ['market-vs-limit-orders', 'how-settlement-works'],
  },
  {
    slug: 'managing-positions', title: 'Managing positions',
    summary: 'Review outcome-token holdings separately from open orders and available collateral.', group: 'Use the app',
    sections: [
      { title: 'Read each holding in context', paragraphs: ['In Portfolio, identify the market’s observation block, threshold, collateral token, outcome side and token quantity. A position records what you hold; an order records an instruction that may still be waiting to fill.', 'A displayed valuation for an unresolved position is an estimate based on the available price reference. It is not a promise that the whole holding can be sold at that value.'] },
      { title: 'Ways a holding can change', paragraphs: ['A filled buy adds position tokens; a filled sell reduces them. Where offered, Split converts collateral into matching YES and NO tokens for the same market and collateral. Merge converts equal quantities of those complementary tokens back into collateral.', 'Splitting creates both sides together. It does not itself select a directional view or create a profit. Check the market and collateral when reviewing a merge, because tokens from different markets or collateral pools are not interchangeable pairs.'] },
      { title: 'After resolution', paragraphs: ['Review the market’s resolved status and winning side. If you hold redeemable winning tokens, use Redeem and wait for confirmation. The resulting collateral appears in the Doefin account; withdrawal is separate.'] },
    ], related: ['order-management', 'redeeming-positions', 'withdrawing-funds'],
  },
  {
    slug: 'redeeming-positions', title: 'Redeeming positions',
    summary: 'Convert resolved winning position tokens into collateral in your Doefin account.', group: 'Use the app',
    sections: [
      { title: 'Check that redemption is available', paragraphs: ['Open Portfolio and locate the resolved market. Check the winning outcome and that you still hold a positive redeemable balance. An observation block passing does not by itself confirm that the resolution has been recorded and redemption is ready.'] },
      { title: 'Review, redeem and confirm', steps: ['Select Redeem for the relevant holding and check the market and collateral token.', 'Review the app confirmation and any requested signature.', 'Wait for the transaction result, then check both the position balance and your Funds balance. Redemption sends collateral to the Doefin Smart Contract Wallet, not directly to an external recipient.'] },
      { title: 'If the balance has not updated', paragraphs: ['Check the transaction status before retrying. A pending transaction can still confirm; a reverted transaction has not completed the redemption. If confirmation succeeded but the interface has not refreshed, retain the transaction reference and ask the team to investigate.', 'A losing token has no payout. Redemption proceeds are gross proceeds; subtracting the acquisition cost and applicable costs is necessary to understand the result.'] },
    ], related: ['how-settlement-works', 'managing-positions', 'withdrawing-funds'],
  },
  {
    slug: 'withdrawing-funds', title: 'Withdrawing funds',
    summary: 'Choose a recipient, review available collateral and follow the withdrawal through confirmation.', group: 'Use the app',
    sections: [
      { title: 'Choose where the funds should go', paragraphs: ['Open Funds and select Withdraw. Enter the recipient address, then select the token and amount. External-wallet users can use the connected-address shortcut when it is offered. Check that the recipient supports the selected token on the network shown in the app.', 'A withdrawal transfers a token from your Doefin Smart Contract Wallet. It is not a bridge or a conversion to native Bitcoin. Verify the complete recipient address before confirming.'] },
      { title: 'Check total, locked and available balances', paragraphs: ['Available is the amount not reserved by open orders. The withdrawal interface warns when an amount exceeds the available balance and may cancel open BUY orders to free collateral. Read that warning and inspect those orders before proceeding.'] },
      { title: 'Follow the transaction to its result', steps: ['Review the recipient, token, amount, network and any effect on open orders.', 'Confirm in the app and complete any signing request.', 'Wait for the confirmed result. A transaction reference or “submitted” message does not yet establish that the recipient has received the funds.', 'If the status is pending or unclear, inspect the transaction reference before trying again. After confirmation, check the recipient and the updated Doefin balance.'] },
    ], related: ['getting-collateral', 'order-management', 'redeeming-positions'],
  },
  {
    slug: 'collateral-tokens', title: 'Collateral tokens',
    summary: 'Match the market’s collateral to the token, contract and network used for funding and payout.', group: 'Reference',
    sections: [
      { title: 'The token is part of the market specification', paragraphs: ['Collateral is the asset used to fund a position and denominate its payout. Check the collateral listed for the specific market and the supported-token list in Funds. This guide does not maintain a live token list.', 'Tokens with similar names can have different contracts, networks and redemption arrangements. A wrapped or bridged Bitcoin token is not native Bitcoin, and a stablecoin carries its own issuer and redemption risks.'] },
      { title: 'Check each stage', steps: ['Before depositing, match the selected token, network and account deposit address.', 'Before trading, check which collateral the market uses and how the order is denominated.', 'Before redeeming or withdrawing, check the receiving asset and the destination network.'] },
      { title: 'Approvals and setup', paragraphs: ['The app may request account setup or token approvals before an action can proceed. Review the scope presented in the current confirmation. A previous approval for one token does not establish support for a different token or contract.'] },
    ], related: ['getting-collateral', 'smart-contracts', 'how-settlement-works'],
  },
  {
    slug: 'smart-contracts', title: 'Smart contracts and technical review',
    summary: 'Understand the account and position flows, and the deployment evidence to request before funding.', group: 'Reference',
    sections: [
      { title: 'Separate account, order and token operations', paragraphs: ['The app uses a Smart Contract Wallet for account funds. Order submission and cancellation use signed requests; transfers, split/merge and redemption involve contract transactions. A signature prompt and a transaction confirmation therefore do not mean the same thing.', 'Position tokens represent outcomes for a particular market and collateral. Market resolution and redemption determine which tokens can return collateral. Review the deployed contracts behind the exact market you intend to use.'] },
      { title: 'What to verify', steps: ['Obtain the network and deployed contract addresses for the current environment.', 'Inspect verified contract code and identify the implementation and any upgrade authority.', 'Request the audit reports, commit or version reviewed, scope, outstanding findings and remediation evidence.', 'Review account permissions, token approvals, resolution dependencies and the operational process for interruptions.'] },
      { title: 'Evidence must match the deployment', paragraphs: ['A source repository, verified explorer page or audit of another version is not proof that the current deployment has the same properties. This guide does not certify contract security or provide a verified deployment registry. Contact the team for the current evidence before relying on an address or audit claim.'] },
    ], related: ['collateral-tokens', 'what-doefin-settles-on', 'order-management'],
  },
]

const readingOrder = [
  'overview', 'bitcoin-mining-difficulty', 'what-doefin-settles-on',
  'prices-and-probability', 'how-settlement-works', 'risks-and-limitations',
  'connecting-a-wallet', 'getting-collateral', 'your-first-trade',
  'market-vs-limit-orders', 'order-management', 'managing-positions',
  'redeeming-positions', 'withdrawing-funds', 'key-terms',
  'collateral-tokens', 'smart-contracts', 'methodology-and-evidence',
]

export const allV3Docs = () => [...docs].sort((a, b) => readingOrder.indexOf(a.slug) - readingOrder.indexOf(b.slug))
export const getV3Doc = (slug: string) => docs.find(doc => doc.slug === slug)

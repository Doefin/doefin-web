# Matteo's edits

Every draft Matteo has rewritten, with his version and what it teaches. This is the evidence behind `thinking.md`. Read it as worked examples: the draft on top is what a writer or a model produced, and the version under it is what the CEO wanted.

Source: the Doefin tone check, answered on 29 Oct 2026. Spelling, capitals, missing full stops and one missing article ("in a few minutes", E15) are corrected. Everything else is his wording; his comments are quoted exactly. Two entries are marked "attribution unconfirmed" where the export does not show clearly which words are his.

A lesson says what he changed. It does not guess why, unless he said why.

New edits go at the end, in the same shape, with the next number. `tools/add_edit.py` writes the entry for you; the learner procedure in `skills/doefin-voice/SKILL.md` says what to do next.

## Decisions he wrote himself

### E01 · Doefin in one line · 29 Oct 2026

**Before**
> Markets for Bitcoin mining difficulty. / The first on-chain market on Bitcoin network difficulty. / On-chain derivatives on Bitcoin hashrate.

**After**
> Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty.

**What it teaches:** He rejected all three options. He leads with the two actions and the economic exposure, and names difficulty last, as the mechanism. No category label and no "first".

### E02 · Homepage headline · 29 Oct 2026

**Before**
> Markets for Bitcoin mining difficulty. / Trade Bitcoin mining difficulty. / What does the next difficulty rise cost you?

**After**
> Trade and hedge Bitcoin network hashrate.

**What it teaches:** The same two verbs. The headline names hashrate, the thing people are exposed to, not difficulty.

### E03 · What we call what users do · 29 Oct 2026

**Before**
> Take a position / Trade / Hedge

**After**
> Use "Trade" for the action and "take the position" when explaining a market.

**What it teaches:** "Trade" on buttons and headlines. "Take a position" belongs in the explanation of how a market works.

### E04 · LinkedIn About · 29 Oct 2026

**Before**
> Doefin builds decentralized derivatives on Bitcoin mining difficulty. With Doefin, miners can hedge revenue risk and BTC holders can earn native yield.

**After**
> Doefin provides markets for trading and hedging Bitcoin hashrate exposure.

**What it teaches:** He removed the category label ("derivatives") and the yield promise, and kept one sentence.

## Website lines

### E05 · Homepage, under the headline · 29 Oct 2026

**Before**
> Each market asks one question: will difficulty be at or above a set level at a set block? Prices run from 0.01 to 0.99. Collateral is in BTC, and markets settle from public Bitcoin network data.

**After**
> Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. Each market asks whether difficulty will be at or above a set level at a specified Bitcoin block. Positions are funded and settled in cbBTC.

**What it teaches:** He turned the question into a statement, corrected a fact (the collateral is cbBTC, not BTC), dropped the price range and put the one-liner first.

### E06 · Start with production · 29 Oct 2026

**Before**
> What changes when difficulty rises? For the same machines, a 5.92% rise means about 5.6% fewer coins until the next adjustment.

**After**
> A 5.92% rise in difficulty means about 5.6% less expected Bitcoin production from the same hashrate.

**What it teaches:** A statement, not a question. "Fewer coins" became "less expected Bitcoin production", and "the same machines" became "the same hashrate".

### E07 · How it works · 29 Oct 2026

**Before**
> Review both outcomes before you enter.

**After**
> Choose a Bitcoin difficulty market, fund your account and buy Yes or No shares. Prices change as traders buy and sell.

**What it teaches:** Advice about the steps was replaced by the steps themselves. "Shares", and Yes and No in sentence case.

### E08 · For miners, intro · 29 Oct 2026

**Before**
> Difficulty sets how many coins your machines earn. When it rises, the same fleet produces less. A Doefin market puts a price on that change.

**After**
> When Bitcoin mining difficulty rises, the same machines are expected to earn less Bitcoin, all else equal. Use Doefin markets to hedge that exposure.

**What it teaches:** "Expected" and "all else equal" go in. The last line tells a miner what to do, and the verb is "hedge".

### E09 · For funds and desks, intro · 29 Oct 2026

**Before**
> Network difficulty is public, moves every two weeks and settles to a number anyone can check. Each Doefin market turns a view on it into a price.

**After**
> Trade your view on Bitcoin network hashrate through markets on mining difficulty, which adjusts roughly every two weeks.

**What it teaches:** For investors the verb is "trade" and the object is a view on hashrate. One sentence instead of two.

### E10 · Newsletter sign-up · 29 Oct 2026

**Before**
> Follow the next difficulty adjustment. One email per adjustment: the number, what it means and where it came from.

**After**
> Get difficulty market updates, trading activity and network hashrate insights.

**What it teaches:** No promise of a cadence. The newsletter covers the markets and trading, not only the network.

### E11 · Error when an order fails · 29 Oct 2026

**Before**
> Order not placed. This market closed at block 971,712. Choose an open market.

**After**
> Order not placed. This market is closed. Choose an open market.

**What it teaches:** He removed the block height.

### E12 · Closing line · 29 Oct 2026

**Before**
> Take a closer look at Doefin.

**After**
> Enter app

**What it teaches:** He replaced the invitation with the app button.

## The v3 site

### E13 · v3 homepage, hero · 29 Oct 2026

**Before**
> For miners planning BTC production. Trade Bitcoin mining difficulty.

**After**
> Trade and hedge Bitcoin hashrate exposure.

**What it teaches:** The headline repeats the one-liner's verbs and its object.

### E14 · v3 homepage, hero intro · 29 Oct 2026

**Before**
> At a fixed hashrate, higher difficulty reduces expected BTC production. Explore that exposure, then understand YES or NO position tokens on whether difficulty is at or above a set level at a specified Bitcoin block.

**After**
> Miners can hedge the effect of rising difficulty on expected Bitcoin production. Investors can trade their views on network hashrate through markets on Bitcoin mining difficulty.

**What it teaches:** One sentence per reader: miners hedge, investors trade. "Explore … then understand" and "YES or NO position tokens" are gone.

### E15 · v3 homepage, how it works · 29 Oct 2026

**Before**
> Review both outcomes before entering.

**After**
> Choose a market. Fund your account. Place a trade. All done in a few minutes.
>
> 1. Choose a Bitcoin difficulty market. Review the difficulty threshold and settlement block. Buy Yes if you expect difficulty to be at or above the threshold, or No if you expect it to be below. Prices change as traders buy and sell.
> 2. Fund your account and trade. Deposit cbBTC directly or use the integrated SwapKit to convert native BTC. Then choose your position and place your trade. cbBTC is a wrapped Bitcoin asset; it is not native BTC.
> 3. Sell or redeem. Place a sell order before settlement, or hold until the market resolves. A sale depends on available buyers and price. Each winning share redeems for 1 cbBTC; losing shares have no payout. Your profit or loss also depends on what you paid and any fees.

**What it teaches:** Three imperatives first. Then each step carries its own limit inside it: cbBTC is not native BTC, a sale depends on buyers, losing shares pay nothing. Attribution unconfirmed for the three steps: they may include v3 or docs text he pasted and edited (step 3's "A sale depends on available buyers" is the construction he changed to "Execution depends on" in E16).

### E16 · v3 FAQ, exiting early · 29 Oct 2026

**Before**
> You can place a sell order for position tokens you hold. A sale depends on available liquidity and price, so a complete exit is not guaranteed.

**After**
> You can place a sell order for shares you hold. Execution depends on available liquidity and price, so a full exit is not guaranteed.

**What it teaches:** He replaced "position tokens" with "shares", "A sale depends on" with "Execution depends on", and "complete" with "full".

### E17 · v3 FAQ, risks · 29 Oct 2026

**Before**
> A losing position has no payout. Liquidity, collateral and technical dependencies also matter.

**After**
> You can lose the full amount paid for a position. You may not be able to sell before settlement. Funding and payouts also depend on cbBTC, smart contracts, networks and the settlement process. A difficulty position may offset some mining losses, but does not cover every source of production or revenue risk.

**What it teaches:** He makes the risk concrete and personal, names each dependency, and states what a hedge does not cover. Nobody asked him to add the last sentence.

### E18 · v3 homepage, newsletter · 29 Oct 2026

**Before**
> Follow the next difficulty retarget. Research you can inspect: observed retargets, methods and reusable datasets.

**After**
> Get difficulty market updates, trading activity and network hashrate insights.

**What it teaches:** Same as E10. "Retarget" did not survive.

### E19 · v3 homepage, closing · 29 Oct 2026

**Before**
> Take a closer look at Doefin. Start with your production assumptions, or ask the team about the product.

**After**
> Put your hashrate view to work.
> Explore the markets or talk to the team about hedging your exposure.
> [Enter app] [Contact the team]

**What it teaches:** An active headline, two concrete next steps, two buttons that name them.

### E20 · v3 for miners, intro · 29 Oct 2026

**Before**
> Plan your production. Estimate your fleet's BTC output, choose a difficulty contract and compare the outcomes before you open the app.

**After**
> Estimate your Bitcoin production from your hashrate and compare different difficulty scenarios. Then explore how a Doefin position could offset part of that exposure.

**What it teaches:** "Could offset part of": the claim carries its own limit.

### E21 · v3 for miners, button · 29 Oct 2026

**Before**
> Production protection

**After**
> Estimate BTC production
> Compare potential hedge outcomes, their cost and payout.

**What it teaches:** He replaced "Production protection" with an action, and added a line naming hedge outcomes, cost and payout.

### E22 · v3 for funds and desks, intro · 29 Oct 2026

**Before**
> A view on difficulty. A contract to inspect. For funds, trading desks and lender credit teams, inspect the contract and its assumptions against your mandate.

**After**
> Trade your view on Bitcoin network hashrate.
> Take positions through markets on mining difficulty, with a defined threshold and settlement block. The contract outcome follows difficulty, giving your hashrate view a publicly verifiable reference. Trading involves the risk of loss.

**What it teaches:** He replaced the fragments with a headline that has a verb, added "a publicly verifiable reference", and closed on a risk line. He also dropped "lender credit teams".

### E23 · v3 product, intro · 29 Oct 2026

**Before**
> A defined view on Bitcoin difficulty. Doefin markets let professional investors take positions on mining difficulty at a specified block height.

**After**
> Trade hashrate exposure through difficulty markets.
> Doefin lets professional investors take Yes or No positions on whether Bitcoin mining difficulty will be above or below a specified level at a specified block height. Hashrate is the economic exposure; difficulty determines the contract outcome.

**What it teaches:** The hashrate and difficulty distinction, stated once, in one sentence.

### E24 · v3 product, section heading · 29 Oct 2026 · Cut

**Before**
> A threshold. An observation. A binary outcome.

**After**
> Cut. "We already had point "3. Homepage: how it works" why we need to repeat again?"

**What it teaches:** He cut it because it repeated How it works, in his words above.

### E25 · v3 docs, how settlement works · 29 Oct 2026 · Cut

**Before**
> Wait for the app to show that the market has resolved; an estimated date or a forecast does not resolve a position.

**After**
> Each market specifies a difficulty threshold and a Bitcoin block. Yes wins if the difficulty at that block is at or above the threshold; No wins if it is below. Redeem winning shares once the market has resolved under its settlement rules. Calendar dates are estimates; the specified block determines the observation.

**What it teaches:** His note: "Too much information. Not needed (already in point 3 "how it works"). Replace with a concise explanation." His replacement states the rule instead of describing the wait. A second "already said" sighting, after E24.

### E26 · v3 docs, payout and profit · 29 Oct 2026

**Before**
> Read payout separately from profit

**After**
> Payout example
> Suppose you buy 0.01 Yes shares at 0.40 cbBTC per share. Your position costs 0.004 cbBTC.
> If Yes wins, you redeem 0.01 cbBTC: a profit of 0.006 cbBTC before fees. If Yes loses, the payout is zero and you lose the 0.004 cbBTC paid, plus fees.
> This is an illustrative example, not a live quote. A payout includes the amount you originally paid; it is not all profit.

**What it teaches:** Where a draft gives advice, he shows it with numbers: the cost, the payout, the loss, the fees, and a line saying it is illustrative.

### E27 · v3 docs, risks and limitations · 29 Oct 2026

**Before**
> Review the limits of execution, payout, collateral and operational cover before using a market.

**After**
> Risks and limitations
> - Position risk. Losing shares have no settlement payout. You can lose the full position cost.
> - Exit risk. A sell order may not fill, or may fill only in part. The available price may be below the price you paid.
> - Collateral and technical risk. cbBTC is a wrapped Bitcoin asset with custody and redemption dependencies. Smart-contract, wallet, network or settlement failures can delay access to funds or cause losses.
> - Hedge limitations. A difficulty contract has a defined threshold and observation block. Its payout may not match your production losses. It does not directly cover changes in Bitcoin's price, energy costs, equipment performance or downtime.

**What it teaches:** A short label per risk, then the plain consequence. The hedge limit lists what it does not cover.

### E28 · v3 tool, difficulty exposure · 29 Oct 2026 · Keep

**Before**
> Compare the BTC your fleet could produce across two difficulty scenarios. Start with a sample, then enter your own assumptions.

**After**
> Kept as written.

**What it teaches:** What he keeps: what the tool does and how to start, in two plain sentences.

### E29 · v3 glossary, mining difficulty · 29 Oct 2026

**Before**
> A number expressing how hard it is to find a valid Bitcoin block. Difficulty is the dial that holds that average steady as the total computing power pointed at the network changes.

**After**
> Mining difficulty
> A measure of how hard it is to find a valid Bitcoin block relative to the difficulty-one target.
> Difficulty adjusts every 2,016 blocks to target an average block interval of about ten minutes. At the same hashrate, higher difficulty reduces expected BTC production, all else equal.
>
> Difficulty-implied network hashrate
> The network hashrate implied by current difficulty if blocks arrive every ten minutes.
> It is calculated approximately as difficulty × 2³² ÷ 600 hashes per second. It translates difficulty into hashrate terms; it is not a live measurement of mining activity.
>
> 144-block estimated network hashrate
> An estimate of network hashrate based on work and elapsed time over a recent 144-block window.
> It responds to recent block timing and can fluctuate even when difficulty is unchanged. A 144-block window is not always 24 hours. Read it alongside the calculation method and observation time.

**What it teaches:** No metaphor ("the dial"). The technical reference, the adjustment rule, the effect on production, the formula, and for each related measure what it is not.

### E30 · v3 article, reading a hashrate chart · 29 Oct 2026

**Before**
> Network hashrate is inferred from difficulty and block timing, rather than read from a register of mining machines.

**After**
> Bitcoin network hashrate is estimated from difficulty and block timing. It is not a direct count of Bitcoin mining machines.
> A difficulty-implied series assumes ten-minute blocks. A 144-block estimate uses recent block timing and can move more sharply. Neither is a live measurement. Check the method, time window and units before comparing charts.
> Doefin contracts reference mining difficulty at a specified block. A change in a hashrate estimate alone does not determine the contract outcome.

**What it teaches:** "Estimated" and "not a direct count" instead of an image. He ends by tying the topic back to the contract.

### E31 · v3 newsletter page · 29 Oct 2026

**Before**
> A reason to return at the next retarget. Intended cadence: after a difficulty retarget or a new research publication.

**After**
> Follow the difficulty markets
> Get market updates, trading activity and network hashrate insights from Doefin.
> [Subscribe]

**What it teaches:** No internal intentions on a public page, and no cadence.

### E32 · v3 about, intro · 29 Oct 2026

**Before**
> Doefin provides markets on future Bitcoin mining difficulty for professional investors.

**After**
> Doefin provides markets for trading and hedging Bitcoin hashrate exposure.
> Our contracts reference future Bitcoin mining difficulty. We help miners assess that exposure and give professional investors a way to trade their views through defined market outcomes.

**What it teaches:** What Doefin is for comes first, then what the contracts reference, then one line for each kind of reader.

### E33 · v3 about, company details · 29 Oct 2026 · Cut

**Before**
> Ask the team for the current legal entity, contractual terms, access requirements and any authorisation relevant to your organisation and jurisdiction.

**After**
> Cut.

**What it teaches:** He cut it, without a comment.

### E34 · v3 footer · 29 Oct 2026

**Before**
> Markets for Bitcoin mining difficulty. For professional investors. Positions involve risk. Nothing here is investment advice.

**After**
> Trade and hedge Bitcoin hashrate exposure through markets on mining difficulty. For professional investors. You can lose the full amount paid for a position. Nothing here is investment advice.

**What it teaches:** He replaced "Positions involve risk" with "You can lose the full amount paid for a position", replaced our one-liner with his, and kept "For professional investors" without "only".

## Social posts

### E35 · X, a difficulty adjustment · 29 Oct 2026

**Before**
> Difficulty rose 5.92% on 16 Oct, to 140.58 T.
> For the same machines, that is about 5.6% fewer coins.
> The current epoch was 82% done on 27 Oct. If block times hold, the next adjustment lands around 29 Oct.

**After**
> A 5.92% rise in difficulty means about 5.6% less expected BTC production at the same hashrate, all else equal.
> Network growth changes miners' production exposure. Difficulty gives that exposure a public, verifiable reference.

**What it teaches:** One number and its consequence, with the qualifiers. He dropped the date, the level and the epoch forecast, and ended on why difficulty matters: exposure, and a public reference. Attribution unconfirmed for the second line: the export shows it formatted as a heading, just after his version.

### E36 · LinkedIn, an opinion · 29 Oct 2026

**Before**
> Most talk about difficulty risk starts with miners.
> But when a miner borrows against future production, part of that risk sits with the lender.
> If difficulty rises 10%, the same machines make about 9% fewer coins. The loan was sized on the old number.
> I think lenders will be among the first to want a price on it.

**After**
> Difficulty exposure makes Bitcoin mining businesses unbankable.
> When a loan depends on future Bitcoin production, Bitcoin difficulty affects the assumptions behind repayment. For example, a 10% difficulty rise means about 9.1% less expected BTC production at the same hashrate, all else equal.
> I think lenders have a reason to watch this market. A price for future difficulty allows them to estimate future Bitcoin miners' revenues.
> Doefin's proposition is trading and hedging hashrate exposure. Its contracts reference difficulty, so the outcome is defined and publicly verifiable.
> That distinction matters. A difficulty position may offset some exposure, but it does not cover every risk in a mining business or a loan.

**What it teaches:** A claim he will defend, the mechanism, an exact number (9.1%, from 1/1.10 − 1, where we wrote "about 9%"), "I think", what Doefin does, then the limit. His version is longer than our draft.

### E37 · LinkedIn, a product update · 29 Oct 2026

**Before**
> We added a calculator to the website. Enter your fleet's hashrate, change difficulty and see how many coins you would produce.
> It uses public network data and shows its working.
> [link to the calculator]

**After**
> How much does difficulty change your expected Bitcoin production?
> Use Doefin's production calculator to compare difficulty scenarios at your fleet's hashrate.
> Explore the calculator on the Doefin website.

**What it teaches:** Open with the reader's question, not with "we added". Then the tool as the answer, then where to find it.

## Rules in his own words

Not edits, but what he wrote when asked. Quote these when a rule is challenged.

- On words to avoid: "Avoid unqualified promises such as 'guaranteed profit', 'risk-free', 'protect all revenues' or 'native yield'. Do not imply that a position directly delivers hashrate or covers every mining risk. Also avoid using the YES/NO position, but favour saying for example 'buy a position that pays out if difficulty is above X'."
- On words to use: "Use direct language: trade, hedge, hashrate exposure, mining difficulty, expected BTC production, market terms, position cost and payout. Use 'shares' in customer copy and explain once that they are position tokens."
- On what he disagrees with: "Use hashrate to describe the exposure and difficulty to describe what determines the outcome. Keep the distinction clear without repeating the full explanation in every section."
- On contractions: "Never use abbreviations. No: I'm, you're, there's. Yes: I am, you are, there is."
- On his own posts: "Write in my own voice using 'I'. Separate personal opinion from company facts. Apply the same standards for numbers, product claims and risk wording as company posts. Use agreed product language consistently."
- On the newsletter: "Lead with the news and explain why it matters. Cover difficulty markets, trading activity and network hashrate. Link sources and date estimates. Keep the subject line factual. State a publishing cadence only when the team has committed to it. Include relevant risk context when discussing positions."
- On research: "State the main finding early. Give figures a source, date, units and method. Distinguish observations, estimates, forecasts and opinion. Explain assumptions and material uncertainty. Assess forecast hits and misses consistently and make corrections visible."
- On tool text: "Say what the tool estimates. Label inputs and units, show assumptions and explain results in plain language. Distinguish BTC production from revenue and profit. Describe outputs as estimates and show material limitations near the result."
- On emails to partners and investors: "Open with the reason for writing, give the necessary context and end with one clear ask. For example: (1) what happened and deal flow, (2) what I am thinking, (3) idea or next steps, (4) product updates if any, (5) the ask."
- On what comes to him first: "Review new product claims, changes to settlement or collateral wording, financial examples, performance claims and legal or access language before publication. Routine content should use the agreed wording."
- On naming peers: "Name peers only in relevant, factual comparisons supported by current evidence. Do not imply endorsement or affiliation."
- On live prices in posts: "Yes, if possible use dated, time-stamped screenshots with the market and quote units visible. Do not imply that a displayed quote guarantees execution, liquidity or a return."
- On forecast misses: "Yes. Evaluate forecasts with the same method and make material misses and corrections visible."
- On investor and partner decks: "Use the same standards for evidence, product mechanics and risk claims. Adapt the depth and emphasis to the audience."
- On who signs the newsletter: "Use Doefin for company updates. Name the author when a piece presents a personal view."
- On other languages: "Hmmm, maybe yes."
- A writer he likes: Rapha Zagury (@RaphaZagury on X).

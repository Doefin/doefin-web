# Matteo's v3 copy review, 29 Oct 2026

Matteo reviewed 22 lines of v3 copy in the tone check (Keep, Change or Cut, with his own version). His answers are recorded as edits E13 to E34 in `vendor/doefin-brand/brand/matteo/edits.md`. This page says where each one went.

- **In this repository:** applied in this branch (table 1).
- **In Sanity:** the docs, glossary, article, About sections and homepage FAQ are published content. They need an editor in the Studio (table 2). The text to paste is below each row.
- **Judgement calls** made while applying his versions are in table 3. Each one is easy to reverse.

## 1. Applied in code

| # | Where | File | Change |
|---|---|---|---|
| 1 | Homepage hero headline | `app/v3/page.tsx` | "Trade and hedge Bitcoin hashrate exposure." The eyebrow is removed: his version has none. |
| 2 | Homepage hero intro | `app/v3/page.tsx` | His two sentences, one for miners and one for investors. The glossary link on "difficulty" stays. |
| 3 | Homepage how it works | `app/v3/page.tsx` | "Choose a market. Fund your account. Place a trade." with "All done in a few minutes." and his three steps, above the existing market example. |
| 6 | Homepage newsletter | `components/v3/ProductUpdates.tsx` | "Follow the difficulty markets." (his newsletter-page heading) and "Get difficulty market updates, trading activity and network hashrate insights." |
| 7 | Homepage closing | `app/v3/page.tsx` | "Put your hashrate view to work." "Explore the markets or talk to the team about hedging your exposure." Buttons: Enter app, Contact the team. |
| 8 | For miners intro | `components/v3/MinersPage.tsx` | His two sentences. |
| 9 | For miners button | `components/v3/PublicMinersPlanner.tsx` | "Estimate BTC production", with "Compare potential hedge outcomes, their cost and payout." under it. |
| 10 | Funds and desks intro | `components/v3/InstitutionsPage.tsx` | "Trade your view on Bitcoin network hashrate." and his three sentences. |
| 11 | Product intro | `components/v3/pages/ProductPage.tsx` | "Trade hashrate exposure through difficulty markets." and his paragraph. |
| 12 | Product section heading | `components/v3/pages/ProductPage.tsx` | Cut ("A threshold. An observation. A binary outcome."). The eyebrow and paragraph stay. |
| 16 | Tool: difficulty exposure | none | Keep. |
| 19 | Newsletter page | `app/v3/newsletter/page.tsx` | "Follow the difficulty markets." "Get market updates, trading activity and network hashrate insights from Doefin." |
| 20 | About intro | `components/v3/V3About.tsx` | His three sentences as the page summary. |
| 22 | Footer | `components/v3/Chrome.tsx` | His one-liner under the logo, and "For professional investors. You can lose the full amount paid for a position. Nothing here is investment advice." The prototype note stays. |
| | App button, site-wide on v3 | `Chrome.tsx`, `page.tsx`, `ProductPage.tsx` | "Open app" becomes "Enter app" (his pick in decision 4). "Talk to the team" becomes "Contact the team", as in his closing. |

## 2. For an editor in Sanity

### 4 and 5. Homepage FAQ (`homeFaq` items placed in `home-faq-homepage`)

**`faq-exit-before-settlement`, answer.** Replace the first two sentences with:

> You can place a sell order for shares you hold. Execution depends on available liquidity and price, so a full exit is not guaranteed.

Keep "Cancelling an open order does not sell an existing position."

**`faq-risks`, answer.** Replace the whole answer with:

> You can lose the full amount paid for a position. You may not be able to sell before settlement. Funding and payouts also depend on cbBTC, smart contracts, networks and the settlement process. A difficulty position may offset some mining losses, but does not cover every source of production or revenue risk.

### 13. Docs: `how-settlement-works`, section "From observation to resolution"

His verdict: Cut. "Too much information. Not needed (already in point 3 'how it works'). Replace with a concise explanation." Replace the section's paragraphs with:

> Each market specifies a difficulty threshold and a Bitcoin block. Yes wins if the difficulty at that block is at or above the threshold; No wins if it is below. Redeem winning shares once the market has resolved under its settlement rules. Calendar dates are estimates; the specified block determines the observation.

### 14. Docs: `how-settlement-works`, section "Read payout separately from profit"

His verdict: replace with a worked example. Retitle the section "Payout example" and replace its paragraphs with:

> Suppose you buy 0.01 Yes shares at 0.40 cbBTC per share. Your position costs 0.004 cbBTC.
>
> If Yes wins, you redeem 0.01 cbBTC: a profit of 0.006 cbBTC before fees. If Yes loses, the payout is zero and you lose the 0.004 cbBTC paid, plus fees.
>
> This is an illustrative example, not a live quote. A payout includes the amount you originally paid; it is not all profit.

This is a financial example, so it is one of the things Matteo reviews before publication. It is his own text, so his edit counts as that review.

### 15. Docs: `risks-and-limitations`, summary

Replace "Review the limits of execution, payout, collateral and operational cover before using a market." with his list (as the opening section, or the summary plus a list):

> Risks and limitations
>
> - Position risk. Losing shares have no settlement payout. You can lose the full position cost.
> - Exit risk. A sell order may not fill, or may fill only in part. The available price may be below the price you paid.
> - Collateral and technical risk. cbBTC is a wrapped Bitcoin asset with custody and redemption dependencies. Smart-contract, wallet, network or settlement failures can delay access to funds or cause losses.
> - Hedge limitations. A difficulty contract has a defined threshold and observation block. Its payout may not match your production losses. It does not directly cover changes in Bitcoin's price, energy costs, equipment performance or downtime.

### 17. Glossary: `mining-difficulty`

Short definition (95 characters, under the 160 limit):

> A measure of how hard it is to find a valid Bitcoin block relative to the difficulty-one target.

First body paragraph, replacing the one with "the dial":

> Difficulty adjusts every 2,016 blocks to target an average block interval of about ten minutes. At the same hashrate, higher difficulty reduces expected BTC production, all else equal.

He also wrote two definitions that read as their own glossary terms. If they do not exist yet, they are candidates for new entries (new slugs are permanent, so choose them with care):

> **Difficulty-implied network hashrate.** The network hashrate implied by current difficulty if blocks arrive every ten minutes. It is calculated approximately as difficulty × 2³² ÷ 600 hashes per second. It translates difficulty into hashrate terms; it is not a live measurement of mining activity.
>
> **144-block estimated network hashrate.** An estimate of network hashrate based on work and elapsed time over a recent 144-block window. It responds to recent block timing and can fluctuate even when difficulty is unchanged. A 144-block window is not always 24 hours. Read it alongside the calculation method and observation time.

### 18. Article: `reading-a-hashrate-chart-honestly`, section "An estimate from observable inputs"

Replace the first paragraph ("Network hashrate is inferred from difficulty and block timing, rather than read from a register of mining machines. …") with:

> Bitcoin network hashrate is estimated from difficulty and block timing. It is not a direct count of Bitcoin mining machines.
>
> A difficulty-implied series assumes ten-minute blocks. A 144-block estimate uses recent block timing and can move more sharply. Neither is a live measurement. Check the method, time window and units before comparing charts.
>
> Doefin contracts reference mining difficulty at a specified block. A change in a hashrate estimate alone does not determine the contract outcome.

### 21. About: section "Information for an organisational review"

His verdict: Cut, with no comment. Delete the sentence "Ask the team for the current legal entity, contractual terms, access requirements and any authorisation relevant to your organisation and jurisdiction." Whether the rest of that section stays is a question for him.

## 3. Judgement calls

| # | What we did | Why | To reverse |
|---|---|---|---|
| 1 | Removed the hero eyebrow ("For miners planning BTC production") | His version of the hero has no eyebrow, and his intro speaks to miners and investors | Restore the `<p className="v37-eyebrow …">` line |
| 3 | Kept the market example under his three steps | He replaced the heading, not the example | Delete the `<MarketExample />` block |
| 6 | Used "Follow the difficulty markets." as the homepage newsletter heading | He gave that heading on the newsletter page; on the homepage he gave only the line under it | Change the `<h2>` |
| 7 | Made "Enter app" the primary button in the closing panel | He listed it first, as `< Enter app >`, before `<Contact the team >` | Swap the two classes |
| 8 | Kept the heading "Plan your production." above his intro | He rewrote the sentence under it; a page needs an `<h1>` | Change the `<h1>` |
| 9 | Left the second planner option as "No position" with its Yes/No chip | He reviewed only the first option | Change the tuple in `PublicMinersPlanner.tsx` |
| 10 | Replaced the whole intro, including the sentence for mining CFOs | His version replaces the paragraph the excerpt came from | Restore the CFO sentence |
| 22 | Kept "This prototype contains illustrative content." in the footer | It is a fact about v3, not brand copy | Remove it at launch |

## Not done here

- Rows of the "Website lines to rewrite" table that are not on v3 (for example the order error message, which lives in the app, `doefin-frontend`).
- Wording across the rest of v3 that the new rules flag but Matteo did not review, such as "retarget", "YES/NO" and "position tokens" in other components. `npm run check:brand -- --all` lists them; the `doefin-voice-editor` agent can propose fixes for review.

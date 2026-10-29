# v3 copy rewritten in Matteo's voice, 29 Oct 2026

Every visible line of v3 was rewritten in Matteo's voice, using the voice model in `vendor/doefin-brand/brand/matteo/`.

- **Live doefin.com** (`doefin-frontend`) is not part of this change.
- **Matteo's own lines** from his v3 review (PR #6, `docs/copy-review-2026-10-29.md`) are unchanged.
- **The copy around his lines** was rewritten so each page reads as one voice and does not repeat him.

The work comes in two parts:

- **Code** (this branch). About 250 strings across 70 files: pages, components, tool microcopy, worked examples, navigation, metadata and share images.
- **Sanity** (drafts, not yet written). 192 of 607 strings across 49 documents: docs, glossary, homepage FAQ, About, tool guides, articles and research.
  - The rewrites are in `studio/rewrites/2026-10-29-v3-voice.json`, one row per string, each with a Keep, Change, Cut or Matteo verdict and a note.
  - Matteo's own docs, FAQ, glossary and article rewrites from the tone check are in the same file, marked `Matteo`.

## Putting the Sanity rewrites in the Studio

Run these from the repository root. The scripts use the normal Studio login (`--with-user-token`), never a new token.

```
npm run check:voice-drafts                 # no login: every row still matches the live text, limits, brand rules
npm --prefix studio run plan:voice-drafts  # shows the drafts it would create; writes nothing
npm --prefix studio run write:voice-drafts # writes them as drafts
```

**What `write:voice-drafts` does:**
- It creates one draft per changed document and never publishes anything.
- An editor reviews each draft in the Studio. To accept it, publish it; to keep the live text, discard it.
- It skips any document whose live text has changed since the rewrite, or that already has a draft, and says which ones.
- `--only=<id>,<id>` limits it to some documents.

**After the drafts are published:**
- Update the migration seeds (`content/v3-docs.ts`, `content/glossary.ts`, `content/tool-guides.ts`, `content/v3-editorial.ts`, `content/v3-research.ts`, `content/home-faq.ts`) to match.
  - The runtime parity checks compare rendered pages with those seeds.
- Bump `updatedAt` on any glossary term whose definition changed, if the change counts as a review.

## For Matteo: what needs your review

These fall under the five kinds of copy you review. Most keep the meaning and change only the words; the full text and the reason for each change are in the JSON notes and the PR diff.

| Kind | Where |
|---|---|
| Settlement wording | **Homepage:** the note under the production scenario ("A Doefin position pays a fixed amount or nothing…").<br>**Product:** at-a-glance list ("Yes wins at or above the threshold; No wins below it.").<br>**Settlement page:** table caption.<br>**Funds and desks:** panel ("Buy Yes or No shares", "Fixed per share").<br>**`content/docs.ts`.**<br>**Sanity docs:** overview, what Doefin settles on, how settlement works, key terms, managing and redeeming positions, smart contracts.<br>**Sanity FAQ:** market settlement.<br>**Sanity:** the last section of "How difficulty adjustment works", and two tool-guide limits. |
| Collateral wording | **Sanity docs:** collateral tokens, getting collateral, split and merge in managing positions.<br>**Product, settlement and `content/docs.ts`:** "BTC-denominated token". |
| Financial examples | **Homepage:** market example (60 paid, 100 payout).<br>**Planner:** result and summary lines.<br>**Miners page:** notes.<br>**Tools:** the two worked examples in `content/tools.ts`.<br>**Payback:** the payback table header.<br>**Sanity:** the fleet-payback and hosting walkthroughs, where only spelling changed. |
| Performance claims | **About:** research paragraph (Sanity).<br>**Research archive:** note ("The prototype's dated forecasts and scoreboard are illustrative…"). |
| Legal or access | **Sanity docs:** overview opening ("Doefin lets professional investors…").<br>**Sanity:** About conflict-of-interest paragraph.<br>**Terms:** one serial comma removed. |
| New product claims | **Navigation:** descriptions for For miners ("Estimate the effect of rising difficulty on expected BTC production, and hedge part of it.") and For funds and desks ("Trade your view on Bitcoin network hashrate."). |

## Questions only Matteo or Reza can answer

The editors left these alone because they could not confirm the facts.

1. **Collateral.**
   - The product page, the settlement page and `content/docs.ts` say every position settles in a BTC-denominated token, and the tone check (E05) says cbBTC.
   - But the market explorer shows USDC markets, and the Sanity collateral docs mention stablecoins. Which is right?
2. **Observation block and settlement block.**
   - Your how-it-works and funds intro say "settlement block".
   - The market data has two separate blocks, for example observation 987,840 and settlement 987,846.
3. **"Above" or "at or above".** Your product intro says "above or below a specified level"; every other page says "at or above".
4. **The author profile** (Sanity, shown on About) says Doefin Research "publishes difficulty forecasts… with every restatement logged". The methodology page says the forecast archive has zero published records.
5. **The "Difficulty forecast" link note** on glossary and guide pages says "The current epoch, with its confidence interval". The difficulty page shows a point estimate only.
6. **Figures with no source:**
   - "two to three times too narrow" (glossary, confidence interval);
   - ±16% and ±6% for one-day and seven-day hashrate estimates (glossary, hashrate);
   - "about five modern machines" for 1,000 TH/s (tools).
7. **About, "Information for an organisational review":** after your cut (E33), should the rest of the section stay?

## Judgement calls

| What | Why | To reverse |
|---|---|---|
| Planner second option: "Buy No shares", with "Pays if difficulty is below the threshold." | "No position" (from PR #6) read as "no position at all" once the chip was in sentence case | `PublicMinersPlanner.tsx`, the `premium` tuple |
| Kept "Find the step you need" on the homepage | It overlaps your how-it-works steps (E24), but its three docs links are the returning-user path, and the journey check requires them | Delete the section and update `check-p1-journey` |
| Site title and tagline are now your headline | The default title read "Bitcoin mining difficulty, forecast honestly." The share images said "We publish the error bar.", which the prototype does not support | `lib/site.ts`, `app/opengraph-image.tsx`, `app/v3/social-image/route.tsx` |
| Added three items from your own text | The 2,016-block rule (E29), 1/(1 + d) − 1 (thinking.md), and difficulty × 2³² ÷ 600 (E29), in a tool guide, an academy article and the glossary | The rows say which |
| Cut six glossary paragraphs | Each repeated a FAQ answer on the same page. Two points only they made were moved into the FAQ | Set those rows to `Keep` |
| Corrected the hashprice FAQ | It said a fleet below its all-in cost "loses money every hour it stays on". That is only true below the power cost | The row in the JSON |
| Mapped your four risks onto the risks page | Position and exit, collateral and technical, hedge limitations, in your words (E27). "Resolve open questions before funding" stays | The `docs-risks-and-limitations` rows |
| "unlock the wallet" became "open your wallet"; "BUY orders" became "buy orders" | The checker flags "unlock"; "buy" is in running text. If the app label reads "BUY", revert | Two rows in `docs-connecting-a-wallet` and `docs-withdrawing-funds` |
| Yes and No chips are in sentence case everywhere | Your decision on YES/NO | `AudienceControls.tsx` |

## Checks

- **Pass:**
  - typecheck and build;
  - `check:tools`, `check:links` and `check:voice-drafts`;
  - the 19 other `scripts/check-*.mjs` contract checks;
  - against a running build: `check-p1-journey`, `check:crawlable` (84 pages), `check:seo` and `check-research-http`.
  - `check:brand` finds nothing to cut in the lines added.
- **Four runtime checks fail, and the cause is not this change:** `check-docs-runtime`, `check-editorial-runtime`, `check-glossary-runtime` and `check-tool-guides-runtime`.
  - Their mocked Sanity has no research documents, so `/v3/resources` returns 500 ("Sanity research collection is unavailable").
  - This branch changes no data code. They were not run against the previous commit to prove the failure was already there.
- **What `check:brand --base` still reports is expected:**
  - mostly live Sanity text, which changes when the drafts are published;
  - "—" placeholders in empty data cells;
  - "92.30 T", which renders as "92.30T" (the checker adds a space at a React text boundary).

## Not changed

- The live doefin.com (`doefin-frontend`).
- The Sanity migration seeds.
- The internal prototype review page.
- Calculator text that only renders outside v3 mode.

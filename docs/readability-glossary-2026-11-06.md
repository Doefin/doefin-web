# Hashprice FAQ readability refinement, 6 Nov 2026

Local proposal only, frozen for independent review. No Sanity draft, publication or other remote write was made.

## Exact scope

`studio/rewrites/2026-11-06-readability-glossary.json` contains three keyed answer rows for `glossary-hashprice`, type `glossaryTerm`. Only `faq[_key=="faq-0"].a`, `faq[_key=="faq-1"].a` and `faq[_key=="faq-2"].a` change. Questions, FAQ keys/order, document identity/type, slug, canonical slug, short definition, body and every other field stay unchanged. No other glossary document or short definition is targeted. About and Block subsidy, including existing drafts, are outside this proposal.

The baseline is `work/brand-copy-validation/readability-current-published-2026-11-06.json`. A fresh, public published-perspective API read of this one document matched all three FAQ objects before validation. This confirms the published baseline, not the absence of private drafts. No draft was inspected or modified.

## Before and after

### `faq[_key=="faq-0"].a`

Before:

> Whether the machines are worth running. When hashprice falls below a fleet's power cost per terahash, the machines lose money for every hour they run.

After:

> Expected mining revenue per unit of hashrate per day, before electricity and other operating costs. Whether a machine is worth running also depends on its efficiency, electricity price, other applicable costs and actual power and pool terms. Compare revenue and costs using the same currency, hashrate basis and time period.

### `faq[_key=="faq-1"].a`

Before:

> Because publishers calculate it differently. Most differences come from the Bitcoin price used: which exchanges are included, how they are weighted and when the price is recorded. Few publishers disclose which exchanges they use.

After:

> Publishers can use different transaction-fee averaging windows, Bitcoin prices for USD conversion and observation times. Check each publisher's calculation method, units and timestamp, including whether pool fees are deducted, before comparing figures.

### `faq[_key=="faq-2"].a`

Before:

> It was coined by Luxor in 2019 and is now the industry standard unit for mining revenue per unit of hashrate.

After:

> Luxor says it coined the term in 2019. Hashprice is a revenue metric, quoted in BTC or a currency such as USD per unit of hashrate per day.

## Editorial decisions and primary evidence

- FAQ 0: replace the categorical operating verdict with the expected-revenue measure and the conditions needed to compare it with costs. [Luxor's hashprice documentation](https://docs.luxor.tech/hashrateindex/hashprice) defines the measure. [Intelligent Miner](https://docs.luxor.tech/platform/commander/intelligent-miner) documents machine hashrate/power profiles, electricity charges, operating constraints and transition costs. The matched-unit comparison follows from comparing revenue with costs; it is not a recommendation to operate a machine.
- FAQ 1: remove the unsupported “most differences” and “few publishers” claims. Luxor documents a transaction-fee averaging window and a USD conversion method. [Revenue & Payments](https://docs.luxor.tech/platform/mining/revenue-payments) distinguishes pool fees from spot FPPS. Different values for those inputs can produce different figures: this is an inference from the calculation, not a comparative survey or ranking of publishers. The answer asks readers to check each method and timestamp.
- FAQ 2: retain 2019 as an attributed statement from Luxor's hashprice documentation. Replace “industry standard unit” with the metric and how it is quoted. No industry-adoption claim is retained. No machine, electricity or hashrate physical unit is being redefined.

The editing approach follows Matteo's habits 3 and 4: a precise measure with its limit, and E30: name the calculation rather than use an abstraction. Brand source: vendored Doefin v0.2.0, commit `936bc5c`. The Doefin humanise skill and voice-editor procedure were used for an editorial pass; this is ready for Fardin's reading, not human sign-off.

## Validation and review lines

- `check-voice-drafts.mjs` with the supplied baseline: 1 document, 3 of 3 answer strings changed, no conflicts, 0 CHECK and 0 STYLE.
- Repeated against the fresh single-document public snapshot in `/tmp/readability-glossary-fresh-published.json`: same result.
- `planVoiceDrafts`/`parsePath` assertions confirmed exactly the three keyed `.a` paths, one proposed `faq` patch, unchanged questions/keys/order, preserved non-FAQ fields and no mutation of the input snapshot. A simulated existing hashprice draft blocked planning. This tests the protection; it does not claim the current private draft state was read.
- Python web-channel checker on extracted final answers: 0 CUT, 0 CHECK and 0 STYLE. There are no contextual CHECK matches to escalate. Necessary revenue/cost and methodology qualifications were retained.
- No new financial example, position outcome, payout, return, suitability or service promise was introduced. Existing body examples remain outside scope.

Fardin and Matteo should read the revised FAQ 0 operating-decision explanation and the FAQ 1 methodology correction before publication because their factual meaning changes. FAQ 2's attributed history should be read with its linked source. These are editorial review lines, not an assertion that automated checking approved publication. The three questions were deliberately preserved, including their reader-facing purpose.

No runtime/UI change is made by this artifact. A local rewrite JSON does not change the published glossary. Any later draft application needs a fresh published-text comparison and existing-draft check in the normal workflow.

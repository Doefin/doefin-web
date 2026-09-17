# Website concepts: A and B

The original experience is served at `/v1`. The connected product-acquisition preview
starts at `/v2`. Run `npm run dev` and open those paths on the local server.

Version B has its own Product, Tools, Data & Research, and Learn navigation.
Every page has a **V1 / V2** switch that opens the corresponding page
(or its nearest matching hub) in the other version. Links stay inside B when a B
destination exists. The broader original library is explicitly linked in new tabs.

The root `/` redirects to `/v1`. Older unprefixed page URLs redirect to their V1
equivalents; `/home-v2` and its descendants redirect to `/v2`. Existing bookmarks
therefore remain useful. Assets, feeds, robots.txt and sitemap.xml remain shared.

## Review routes

| Page | Version B route | What to compare |
|---|---|---|
| Homepage | `/v2` | Visitor problem, product explanation and next action |
| Product overview | `/v2/product` | Mechanics and audience paths |
| Mining operators | `/v2/for/miners` | Exposure calculator as the primary next step |
| Funds and desks | `/v2/for/institutions` | Markets, collateral, settlement, risk and human contact |
| Settlement | `/v2/product/settlement` | Worked threshold example, then app handoff |
| Tools hub | `/v2/tools` | Choose a tool by the question it answers |
| Exposure calculator | `/v2/tools/difficulty-exposure` | Settlement action beside the result |
| Hosting calculator | `/v2/tools/hosting-effective-rate` | Save quote A, edit quote B, compare effective costs |
| Payback calculator | `/v2/tools/fleet-payback` | Investigate production sensitivity after payback |
| Learn hub | `/v2/learn` | Outcome-oriented learning paths |
| Tutorial | `/v2/learn/difficulty-exposure` | Prerequisites, ordered steps, annotated example, expected outcomes |
| Data & Research | `/v2/research` | Evidence first, with a route to future updates |
| Sample report | `/v2/research/evaluating-a-forecast` | Summary, evidence table, reproducible method, limits and downloadable CSV |

## Walkthroughs for the CEO

Show each version independently before comparing them.

1. **Mining operator:** homepage → miner page → exposure calculator → settlement → app.
   Can the visitor explain the difference between production exposure and a binary payout?
2. **Learner:** Learn → tutorial → open worked example → enter own assumptions.
   Can they complete the task without someone explaining the inputs?
3. **Research reader:** report → inspect evidence → download CSV → preview research email.
   Can they distinguish evidence from an illustrative example?
4. **Institutional visitor:** institutional page → mechanics → app or team contact.
   Can they identify the information needed for an internal review?
5. **Hosting buyer:** calculator → save quote A → change inputs for quote B.
   Does the comparison make the effective-cost difference clear?

This is a qualitative concept comparison. It does not assign live visitors to
experiments or collect conversion analytics.

## Shared implementation

- Original pages are grouped under `app/v1`, with Version 2 under `app/v2`. A shared
  link component prefixes original content links with `/v1`. A small route-aware
  chrome component selects B navigation only under `/v2` and adds the version switch; the root layout
  remains a server component and page content is rendered into the initial HTML.
- Both versions use the same calculator components. B enables exact-number inputs,
  adjacent result actions and bounded URL inputs. Shared safeguards reject
  nonfinite URL numbers and avoid a hosting-rate division by zero.
- Exposure arithmetic lives in `lib/exposure.ts`. The tutorial uses that same
  function, so its displayed numbers match its prefilled calculator link.
- Tutorial steps, report rows and explicit related-content relationships live in
  `content/preview.ts`, read through `content/index.ts`. They provide concrete
  examples of the structured content a future CMS must support.
- The report table, mean error and downloadable CSV derive from the same rows.
- All 13 B pages are noindex/nofollow and absent from the production sitemap.

## Prototype boundaries

The research data is synthetic and clearly labelled. The annotated tutorial figure
is a code-rendered example of the calculator, with shared calculation results.
Research updates demonstrate a sample email; email collection and delivery are
not connected. Contact links open an email draft; app links lead to the existing
trading app. No CMS, account system or trading behaviour was added.

The calculators retain their simplified assumptions. B surfaces those limits
beside the tools; these models are not a complete operational or investment model.
The saved hosting quote lasts for the current page visit; calculator inputs remain
shareable through the URL.

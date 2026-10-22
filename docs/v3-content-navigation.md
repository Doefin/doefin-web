# V3 content and navigation implementation

Implemented 22 October 2026. This is an initial journey for observation, not a validated conversion or retention result. The user owns visual design; this change reuses existing V3 CSS, components and artwork and adds no generated images.

## Audience and evidence boundary

The working primary use case is miners whose expected BTC production changes with difficulty. Expertise in mining does not establish familiarity with Doefin. No fleet-size cutoff, job title or geography is established. Funds and desks remain available in navigation and a lower homepage resource link; their secondary rank is inferred from the miner conversations. The full Transync archive was not read.

## Content order

1. Miner relevance; name the YES/NO instrument, planner/tutorial choices, full-loss qualifier and early technical/risk links. Header Open app remains direct on desktop and mobile.
2. One normalized production scenario: 1 BTC / 1.10 ≈ 0.909 BTC, about 9.09% below the baseline. State fixed assumptions, separate production sensitivity from binary contract sizing, and link to calculator/settlement.
3. Existing both-outcome worked purchase, including cost, total payout and net result before fees. Keep the real app capture in a native disclosure; the summary itself states its 19 October 2026 capture date and that it is not live. Expanding preserves the explanation that market-implied pricing is not a forecast or quote.
4. Three concise setup guides: sign in, collateral and first order. Returning visitors retain app and position-management access.
5. Product/team context, technical evidence to request and risks. These links do not certify an audit or establish performance.
6. Tutorial, hosting/payback utilities, a selected educational article, library and funds/desks path. Hosting-bill comparison is a separate question from production exposure; businesses can operate owned and hosted fleets.
7. Existing FAQ, educational reading and contact. No cadence or delivery promise.
8. Same planner action and team contact, followed by existing legal footer.

The order, exact CTA preference and capture disclosure are hypotheses for P2 observation. They do not imply audience validation or retention improvement.

## Bookmark compatibility

The retained miner backlink `/v3#who-its-for` resolves at the production-relevance heading. Existing `audience-title`, `product-title`, `inside-the-product`, `how-it-works`, `tools-and-learning` and FAQ heading/section IDs remain available despite the revised hierarchy. Focused checks inspect incoming V3 homepage fragments as well as outgoing homepage links.

## Previously unlinked routes

`/v3/product` is deliberately retained as the canonical short product introduction and now receives a contextual entry from Resources (“Understand the market”). It links onward to settlement, audience paths and the app. Docs remains the task/reference library; it is not a second top-level product introduction.

The five retained calculator example routes are owned by the P0 correction work: link them from their matching calculator after correcting their claims and keep return links. No route is deleted. Root verification reconciles all 84 routes after all agents finish; this note is not a fresh full crawl.

## Data and delivery honesty

The resources hub explicitly labels research and data as synthetic educational examples, not measured estimator performance or a verified record. Its `#updates` section offers contact and clearly states disconnected newsletter/automatic-alert delivery. The shared Subscribe component already renders a V3-only library/contact section without a form; it has no simulated subscription success in V3. Legacy form behavior was not changed. Homepage noindex metadata remains.

## Measurement boundary

Annotated links use P2's bounded `data-v3-cta` and `data-v3-placement` dictionary. They are normal navigable links and do not collect data on their own. App, planner, tutorial and contact clicks are click proxies, never confirmed trades, understanding or delivered messages. P2 owns opt-in runtime, consent, adapters and definitions.

## Verification

`node scripts/check-p1-journey.mjs --source-only` checks navigation destinations against the route/content registry plus the normalized production arithmetic. The full command additionally checks served HTML for key primary actions, loss/capture disclosure, setup/trust/resources links, destination status and anchor targets. Supply `BASE_URL` for the rebuilt local instance. Run the root build and full 84-route crawl after all agents finish.

Browser acceptance remains the root audit: 320/390/768/1440px, 200% zoom, reading order/overflow, header menu keyboard and Escape/focus return, FAQ/disclosure operation, focus visibility, contrast, touch targets and reduced motion. A source/type check alone is not this evidence.

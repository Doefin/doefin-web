# V3 correctness corrections

Scope: content and behavior only; no new visual direction, illustrations, publication, newsletter backend or orders. The source checkout remains a local preview.

## Production and educational examples

The difficulty guide and calculator hints now describe a constant-difficulty production sensitivity model. Sample values are explicitly illustrative. Applicability follows ownership of mining output, not a minimum fleet size, machine count, job title, country or whether BTC is immediately sold. Mixed businesses can assess the mining output they own separately from hosting fees.

Removed unsupported fleet cutoffs, percentage-of-bills action rules, reserve instructions, claimed published forecast intervals, hedge-cost/size assertions and statements equating a finite simulation with “never.” Hosting/payback guides and hints now use input ranges and stated sample scenarios rather than unsourced market benchmarks or provider-quality ratings. Their walkthroughs reproduce the actual models.

Five retained educational examples now carry calculator inputs and replay URLs. Calculator pages link to their matching examples and input guides; examples link back to their seeded calculator and guide. The shared example template uses “Illustrative inputs” and has no subscription form. These changes also affect the legacy pages that share these content modules/template.

Arithmetic checked against production code:

| Scenario | Reproduced result |
| --- | --- |
| 1 EH/s, 4 epochs, 127.48 T, fees 0.05 BTC/block, −2.4%/+7% | 28.057 BTC unchanged; 28.747/26.222 BTC scenario output; 2.525 BTC spread; 1.836 BTC lower production in harder case |
| $0.065/kWh, 5% management, 3% power-factor adjustment, 4% downtime, 6% curtailment, 2% pool fee | Equivalent $0.0796/kWh, 22% uplift |
| $0.045/kWh, same fees, 4% downtime, 20% curtailment | Equivalent $0.0653/kWh, 45% uplift |
| $0.078/kWh, 3% management, 0% power-factor adjustment, 1.5% downtime, 0% curtailment, 2% pool fee | Equivalent $0.0832/kWh, 7% uplift |
| 1,000 TH/s, 15 J/TH, $0.045/kWh, $20,000 initial outlay, $90,000/BTC, 127.48 T, 48 months | Power $16.20/day; payback month 24 at 0% monthly growth, month 38 at 1.5%, no payback within 48 months at 4.5%; high-growth final balance −$17,282 |

Production output is distinct from operating cost, cash flow, contract collateral payout, entry cost and trading fees. A binary contract observes a single block; a payout may over- or under-offset production changes. The full entry cost can be lost. None of the educational models establishes a trade size or hedge economics.

## Market-data recovery

`publicPlannerDataState` is a shared pure gate. A missing, stale, malformed-date, future-dated, refreshing or failed snapshot cannot unlock continuation/app review. An eligible fresh recovery clears the error; older overlapping requests cannot overwrite it. Last-known values remain visible but cannot authorize a market handoff.

The planner shows named standalone difficulty-calculator and worked-tutorial links when data fails, becomes stale or has no eligible cbBTC market. That calculator needs no market-data connection and retains explicit sample-input limitations. Existing support verification and exact market/side checks remain in the app-review button; no amount/order is sent.

## Optional QA measurement

Planner state, progression and visibility signals use the P2 enum-only QA API. There is no collection or transmission by default. State-transition keys retain recovery transitions; per-scenario visibility revisions are local counters and contain no input values. A navigation request is an action signal, not evidence the app loaded or a trade occurred. A 25% intersection of the outcomes panel is a panel-visibility proxy, not proof both cards were read.

## Checks and limits

- `node scripts/check-p0-corrections.mjs` executes the actual exposure helper, extracts the actual hosting formula/payback simulation for arithmetic replay, and exercises the actual market hook with deterministic fetch failures and request ordering.
- `node --experimental-strip-types --no-warnings scripts/check-tools.mjs` verifies hint labels, reachable presets and copy size.
- `node --experimental-strip-types --no-warnings scripts/check-public-markets.mjs` verifies exact-decimal production and existing market identity/URL/input guards.
- Root owns final build, routing and desktop/mobile browser checks. Deterministic checks do not recertify live upstream availability, settlement execution or production delivery.

Outside this ownership, existing V3 data/forecast surfaces explicitly describe synthetic values and do not establish forecast accuracy. Resources says newsletter delivery and automatic alerts are not connected. Preview indexing remains unchanged by these corrections.

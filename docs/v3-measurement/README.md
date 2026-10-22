# V3 measurement readiness — 22 October 2026

Status: interactive prototype with optional controlled local QA; collector unavailable; no baseline collected; no participants observed; no executed-fill integration; editorial delivery not ready. This document does not certify audience validation or increased retention. The miner focus comes from partial meeting evidence; exact CTA/order remains a hypothesis.

Existing `/api/analytics` reads supply Bitcoin market data, not visitor analytics. No existing visitor analytics provider was found in app/components/lib/scripts. No provider, dependency, visitor identity, cookie or network collector is added. An internal reviewer can explicitly enable a bounded, enum-only session log as described below.

`MeasurementBoundary` is mounted in V3 only. It is off unless a reviewer starts local review at `/v3/prototype-review`, or the build explicitly sets `NEXT_PUBLIC_V3_MEASUREMENT_QA=enabled`. Restart/rebuild after changing that environment setting. Leave it unset for normal preview/production. The review control needs no credentials. Opt-in is controlled QA enablement, not visitor consent or approval for collection. Enabled builds dispatch sanitized `doefin:v3:measurement` CustomEvents on `window`; they are local signals only. With the explicit review control enabled, the last 100 sanitized events also live in this tab's session storage across navigation and reload. Stopping review clears the flag and log; closing the tab ends the session. No storage fallback exists when session storage is unavailable. A deliberate authorized sink and privacy/consent review are separate work before collection.

Local QA example: attach `window.addEventListener('doefin:v3:measurement', event => console.log(event.detail))` in the browser console. Use controlled fictional inputs; do not attach an external sink. Verify disabled builds emit nothing and enabled builds emit expected enum-only payloads. Source and pure tests are not substitutes for browser interaction verification.

Tests: `node --experimental-strip-types --no-warnings scripts/check-v3-measurement.mjs`. The runtime rejects extra keys, unknown strings and trade events. Event names are deliberately limited. Every event includes journeyVersion `miner-first-content-v1`, not a user or session ID. A bounded set of 256 non-emitted internal keys suppresses repeated rendering within a mounted page; it is not durable cross-session dedup or an analytics denominator. It clears on route change. Never use a wallet, email, URL, participant ID, order ID or other personal identifier as a key.

Integration contracts:

- Real CTA anchors/buttons: `data-v3-cta` enum from `ctas` and `data-v3-placement` enum from `placements` in `lib/v3-measurement.ts`. Trusted primary click intent captured before Next Link handles navigation; a click later cancelled by another handler still does not prove navigation. No href, text or query is collected. Entry is `homepage` or `other-v3`.
- Explicit actions: `emitV3Measurement(name, payload, dedupeKey?)`. Use `useV3MeasurementView(ref, name, payload, key, eligible)` for a result/panel visibility proxy; 25% intersection is a reproducible proxy, never reading/comprehension. For the planner this means part of the combined outcomes panel is visible, not proof that each card was seen. There is no dwell threshold. Missing IntersectionObserver disables view signals.
- Calculator: a real changed numeric input, valid computed result and observed result region are all necessary. Presets/defaults/loaded examples remain sample/example signals; URL loading alone is not user use. No result values are emitted.
- Planner: estimate action, eligible selection, both-outcomes visibility and app handoff are separate. Stale/error/removed/invalid/empty/unavailable/loading states are not progress. Successful app opening is not an executed trade.
- Tutorial has no discrete final completion action in its current static article. Report step visibility only. Do not emit `tutorial_completion` from final-step render/scroll; the typed event is reserved for a future actual final-step action.

Read the dictionary, observation protocol, report template and delivery gate before any operational use.

## Prototype review additions

`page_view` records a coarse route category (not a URL, query, title or referrer). `identification_request` has a fixed kind and `demo-preview` result; it never means a confirmed subscriber or delivered email. No draft or preview can increment an actual identified-person numerator.

Use `/v3/prototype-review` to enable the local log, follow a journey in the same tab, inspect its events and optionally download sanitized JSON. The log omits user/visitor identifiers, form fields, company, emails, wallets, raw numeric inputs and results. It is a developer inspection surface, not an analytics dashboard or evidence of retention/conversion. Production collection requires an approved provider, consent design, purpose/retention rules and verified server-side outcome integration.

Provider integration reference for later activation: https://posthog.com/docs/getting-started/install. This prototype sends no event to that API.

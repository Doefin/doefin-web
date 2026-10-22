# Event dictionary

All payload fields are strict enum values or the specified literal true flags; extra keys are rejected. Common journeyVersion: `miner-first-content-v1`. No timestamp, URL, input amount, query, free text or identity is emitted. Website data alone cannot identify distinct people or first/repeat traders.

| Event | Condition and fields | Interpretation limit |
|---|---|---|
| homepage_cta_click | Trusted primary anchor/button click intent, captured before Next routing; cta, placement, entry | Click only; includes labeled header/contextual clicks on other V3 pages, distinguish entry |
| tutorial_step_visit | step 1–4, signal visible-proxy; observed section | Section visibility only |
| tutorial_completion | Reserved: step 4, signal final-step-action | Unavailable in current static article; no comprehension inference |
| calculator_meaningful_use | tool, source user, inputChanged/resultValid/resultVisible all true | Useful interaction proxy; no position suitability/activation |
| calculator_sample_view | tool, source sample/example, resultValid/resultVisible true | Defaults/preset/loaded example, not personalized use |
| calculator_invalid | tool, source user/sample/example | Invalid calculation; not use success |
| planner_progress | stage estimate/selection/both-outcomes-visible/app-handoff, state ready; signal action except outcomes visible-proxy | Separate steps; outcomes means 25% combined-panel visibility, not both cards individually seen; no executable quote, reading or trade |
| planner_state | state loading/unavailable/stale/empty/selection-removed/invalid/error/ready; signal state-change | Availability signal, not progress |
| planner_handoff_result | state navigation-requested/recheck-failed/unavailable; signal action | Navigation request/recheck outcome, never order fill |
| first_or_repeat_trade | Unavailable; rejected by website API | Requires authorized app executed-fill integration |

CTA enum: planner, tutorial, calculator, app, risk, evidence, resources, contact, settlement, setup, institutions, hosting, payback, overview. Placement enum: hero, header, scenario, product, setup, trust, resources, faq, closing, footer, contextual. Tool enum: difficulty-exposure, hosting-effective-rate, fleet-payback.

Future app trade policy must be approved before collection: stable fill identifiers deduplicate fills; partial fills count as legitimate executions but must be reported separately from fully filled orders. Decide whether a trade count is fills or grouped orders and report both if appropriate. Agree a permitted privacy-preserving person definition for first/repeat classification, lookback and unknown-history handling; browser repeat visits cannot substitute. No event, identifier or app integration exists here for this purpose.

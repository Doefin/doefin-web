# Doefin V3 — implementation brief

Date: 2026-10-19. Status: working prototype; user requested implementation, not production rollout.

## Purpose and scope

Build a concise public introduction for mining operators, funds and trading desks. Help a visitor understand the product, explore exposure, inspect evidence, contact the team or open the separate application. Preserve V1/V2 as comparison baselines; add `/v3` and a coherent supporting library. No account creation, email delivery, live-data integration or production domain migration.

## References and decisions

- User-requested direction: five compact sections, V2 product clarity with V1 library depth, progressive disclosure, useful links, and realistic llms.txt expectations.
- Historical reference: existing V2, Manrope, dark Doefin grounds and wordmark, brand tokens. Preserve visual continuity; V2's lengthy opening and repeated journeys are the weaknesses to correct.
- Strategy source: [Doefin Website Rationale v2](https://claude.ai/artifact/RhY6Bo5bGPeGeWFB66pZg5). Content supports evaluation and repeat visits as well as discovery. Source statistics and legal assertions are not independently verified or imported as new public claims.

## Direction: refine and complete

An editorial introduction to a precise market: short, large headline paired with an inspectable binary-contract example. Quiet dark surfaces, blue emphasis, clear horizontal divisions, compact explanations. This is a provisional implementation of the agreed structure, not a newly approved visual design.

1. Hero: explain Bitcoin difficulty markets, primary exposure action, visible team contact and app handoff, quieter explanation anchor.
2. Product: three short mechanics steps, visible limitation, full settlement link.
3. Audience: two distinct questions and useful destinations; team contact alongside the institutional path.
4. Resources: selected calculator, methodology and research entries; full library through a dedicated hub.
5. FAQ/final action: native accessible disclosures plus contact/app actions.

Retain existing Manrope, palette and radii. One contract example is the focal element; no stock imagery or fabricated social proof. Numbers are illustrative and labelled with date and units. No automatic animations. Mobile places the message and primary action before the example, with wrapping controls and an explicit menu.

## Ownership

- Lead: homepage, resource hub, V3 chrome, sample interaction, honest V3 subscription fallback, validation and integration.
- Route worker: V3 server route registry, context-aware links, metadata and small shared-source/download-link fixes.
- Content reviewer: initial content recommendations and independent rendered desktop/mobile critique.

## Acceptance

Inspect 1440px desktop and 390px/320px mobile. Test menu keyboard/dismissal, FAQ, illustrative outcomes, navigation and enhanced calculator URL state. Build, typecheck, crawlability, SEO, tools and link checks must pass, with existing editorial warnings separated. Preview stays noindex, outside the production sitemap; final consolidation and publishing remain a later explicit rollout.

## Implementation and review — 19 October 2026

Implemented on `codex/doefin-web-v3`. The homepage and resources hub are new server-rendered pages; a registry reuses the existing product, tools and reference content with V3-aware internal links. There are 68 built V3 pages plus the sample CSV endpoint. V1 and V2 remain available through the footer comparison links.

Independent rendered review found three concrete issues, all corrected: research copy promised disconnected email delivery; team contact appeared too late on mobile; and the app link wrapped at 320px. V3 now has an explicitly labelled sample research hub, honest subscription fallbacks, hero contact link, compact mobile mechanics, and a single-line app link. Reports and figures on supporting pages carry a visible prototype notice.

Validation completed:

- Production build and TypeScript passed. Crawlability checks passed; SEO checks passed across 145 rendered pages.
- 33 versioned-path cases and all 68 built V3 pages passed route, canonical, robots and internal-link checks. Unknown V3 routes return 404; sample CSV returns 200 with the expected CSV content type and synthetic-data label.
- Existing tool calculation checks passed. Content-link checks had zero failures and ten existing editorial warnings.
- Rendered review at 1440px, 390px and 320px; no horizontal overflow at those sizes. Desktop and full mobile screenshots inspected.
- Mobile menu open/close, Escape/focus return, link dismissal, native FAQ expansion, and 129/130/135 T sample outcomes verified.
- Calculator input changed the result and URL; shared hashrate restored after hydration. Zero starting difficulty clamps to 1 T and produces finite results.
- Final production homepage browser error log was empty. This is focused prototype verification, not a full accessibility or performance audit.

Local preview: `npm run dev -- --hostname 127.0.0.1 --port 3036`, then open `/v3`. A production preview can be run after `npm run build` with `npm run start -- --hostname 127.0.0.1 --port 3037`.

## Production follow-up

V3 is a local reviewable prototype, not a deployed domain migration. Existing root redirects, sitemap, feed and `/llms.txt` continue to describe V1. Some reused structured-data identities still point to their source V1 pages; the V3 HTML canonical and Open Graph URLs are V3-specific. Consolidate all of these when selecting the final root routes, then remove preview noindex only from the chosen production pages. `llms.txt` remains supplementary to crawlable HTML and useful linked documentation.

Research, market figures and examples are illustrative; email delivery and live data are not connected. The app action points to `https://app.doefin.com` and team contact opens the existing public contact email. Neither external destination was exercised as an account or communication workflow.

## V3.1 refinement — 19 October 2026

User-approved scope: retain five homepage sections, improve the hero and audience paths, correct docs/research claims, and add a forwardable scenario brief. Keep the same visual system and `/v3` route. Bring audience choices before mechanics, shorten the hero/example on mobile, and make concrete tasks the primary actions. This is a refinement of the current concept, not a new visual direction.

Ownership: lead owns homepage, market example, audience pages, shared chrome, integration and browser verification; content worker owns V3 docs/research/data/about content and route registry; scenario worker owns the exposure brief, calculator integration, URL parser extraction and focused tests. Preserve V1/V2 and unrelated source.

The brief must use exactly the calculator's current inputs/results, identify its assumptions/date and model limitations, and offer copy link, a self-contained printable HTML download, and a draft email. No email is sent, no signup is simulated, and no user inputs are transmitted automatically. Docs use existing frontend documentation and source; unsupported research claims are removed or explicitly synthetic. Production data feeds, email subscriptions, analytics and domain consolidation remain outside this iteration.

### V3.1 implementation and verification

The final homepage keeps five sections: hero, audience paths, mechanics, selected resources, and FAQ/final action. The hero leads to calculating exposure or evaluating a market. Dedicated miner and institutional pages provide specific next steps. On mobile, visitors can expand the contract example; the audience section begins around 1,148px at a 390px viewport, approximately 970px earlier than in the prior V3 review.

Thirteen V3 guides now explain the source-supported workflows. Research, forecast evaluation, data and selected editorial pages distinguish synthetic examples from measured evidence. Source references and the remaining deployment-verification boundary are recorded in `docs/v3-content-provenance.md`.

The exposure calculator creates a scenario brief from its seven current inputs. Visitors can copy a reproducible link, download a self-contained printable HTML brief, or prepare an email draft. Local links are explicitly identified as usable on the originating computer; the downloaded brief remains forwardable. Clipboard failure exposes a selectable link instead of silently failing.

Independent rendered review identified three issues that were fixed: excessive mobile example height, ambiguous payout terminology, and local links that could appear externally shareable. The final example is expandable on mobile, defines contract payout and links to settlement terms, and local brief actions explain the link limitation.

Validation completed on the final production build:

- Build and TypeScript passed; crawlability and SEO checks passed across 156 rendered HTML pages.
- Route checks passed 33 path cases, 68 reused route mappings and 79 built V3 pages. All 13 guides are built; V1/V2 calculator pages do not expose V3 brief actions.
- Thirteen scenario-brief checks passed, including 128 boundary combinations. Existing tool checks passed. Link checks reported zero failures and ten existing editorial warnings.
- Rendered desktop at 1440px and mobile at 390px/320px showed no horizontal overflow. Mobile example expansion, the zero-payout case and equality at the threshold were verified.
- Calculator edits propagated into the brief, copied URL and download; shared inputs restored after reload. Actual clipboard copying and a forced clipboard-rejection fallback were both verified. The temporary rejection override was removed afterward.
- The downloaded HTML printed to one A4 page, with inputs, results and limitations present and no visible clipping. Email draft content was inspected without sending a message.
- The final homepage browser error log was empty, and `git diff --check` passed. Desktop, full-page and mobile screenshots were saved in the task's `outputs` directory.

Preview: `http://127.0.0.1:3037/v3`. This remains an unpublished, noindex prototype. Current deployment assets, networks, fees, audits, legal entity/access claims and inherited legal pages still require owner review before launch. Live feeds, subscription delivery and final root/sitemap/llms.txt consolidation remain production follow-up; this iteration does not establish a full accessibility or performance audit.

## V3.2 refinement — 19 October 2026

User-approved scope: keep five sections; simplify the hero and mobile reading flow; correct metadata claims; add decision context to the scenario brief. Retain the palette, typography, desktop product specimen and `/v3` route. The hero leads with the effect of difficulty on Bitcoin production; the institutional action remains a parallel path. Mobile uses a compact contract-example summary, shorter audience copy, reduced section spacing and a two-column footer. Detail stays available through explicit controls and linked pages.

Ownership: lead — homepage, market example, chrome and final integration; metadata worker — shared factual metadata, llms.txt, social previews and explicit versioned schema paths; scenario worker — optional brief context and export checks; independent reviewer — rendered desktop/mobile critique.

Optional brief context includes the intended reader, decision to discuss and open questions. It is held in component memory and included only in the reviewed download/email draft; copied URLs continue to contain numeric calculator inputs only. No signup, live research, analytics, publishing or domain migration is added. Existing prototype noindex remains intentional. Shared claims must describe available educational content and tools, not unverified research performance.

### V3.2 verification

- Production build and TypeScript passed. Crawlability passed; SEO checked 156 rendered pages. The V3 route check passed 33 path cases, 68 reused mappings and 79 built pages.
- Metadata regression checks passed across all 79 built V3 pages and five representative served pages. Unsupported shared forecasting claims and unverified entity attributes are removed. V3 social-image tags and a 1200 × 630 PNG are present. Retained glossary/guide structured-data paths now match V3 via explicit server props, while V1 defaults are preserved.
- Scenario tests passed 18 checks including 128 input-boundary combinations and context handling (blank fields, limits, newlines, Unicode, escaping and URL exclusion). Tool checks passed; link checks retained zero failures and ten existing editorial warnings.
- Desktop 1440px and mobile 390px/320px were inspected without horizontal overflow. At 390px, total height fell from 5,312px to 4,189px (21%); audience choices begin at 756px versus 1,148px, and the footer is 650px versus 984px. This measures layout, not user comprehension or conversion.
- Independent rendered review found one consequential wording issue: the compact example could imply touching the threshold at any time. It now specifies the observation block and labels the example date. The final production capture excludes development controls.
- Browser checks verified mobile example expansion, 129 T and equality-at-130 T outcomes, menu Escape/focus restoration, hero-to-calculator navigation and FAQ expansion. Edited inputs (2 EH/s and $65,000.25 BTC price) matched the brief results; discussion context appeared in the preview, actual downloaded HTML and inspected email draft. Actual clipboard content contained only the seven numeric inputs. Reload restored numeric inputs and cleared context as disclosed. No email was sent.
- The downloaded brief with representative context printed cleanly to one A4 page and retained results and limitations. Longer notes may extend the printout. Final homepage browser error log was empty, and `git diff --check` passed.

Final review captures are `outputs/doefin-v32-desktop.jpg`, `outputs/doefin-v32-full.jpg` and `outputs/doefin-v32-mobile.jpg` in the task directory. Preview remains `http://127.0.0.1:3037/v3`.

Remaining rollout work is unchanged: verified legal/deployment information, actual published research, live feeds/subscriptions/measurement, and root/canonical/sitemap/feed consolidation. The retained example and legal-page breadcrumb schemas still use V1 identities and should be included in that consolidation. This iteration corrects factual metadata claims without asserting production readiness or measured search/AI visibility.

## V3.3 information architecture — 19 October 2026

Accepted direction: product-led public website, coherent documentation, optional utilities. The previous calculator-led acquisition concept is historical and was rejected as the homepage's organising idea. Preserve the five-section constraint, brand palette and V1/V2 comparison baselines. Retain /v3 for review; production domain migration remains separate.

Homepage sequence: what Doefin is → who it serves → static contract example → evidence and limitations → next step. Primary action is Open app; explanatory links lead to Docs. No homepage calculator, scenario form, outcome selector or mandatory disclosure. Risk and example labels remain visible. Visual hypothesis: a generous typographic opening, two compact audience explanations, and one annotated contract example as the focal element in the mechanics section. On mobile, read in the same order without data entry or expanding the example.

Navigation: How it works, Docs, About, Open app. Docs: Understand Doefin, Use the app, Reference, with persistent desktop navigation and compact native mobile navigation. Research samples and calculators remain optional further reading, not product proof. Explain what is actually documented and what needs verification rather than inventing credibility signals.

Ownership: lead — homepage, static market example, shared V3 chrome, metadata alignment, integration and rendered QA; supporting-routes worker — docs content/index/article layout; route-architecture worker — audience pages and secondary resource entry points; content-review agent — independent final rendered critique. Workers preserve unrelated edits. Acceptance: visitor can identify the product and next step without entering numbers; exactly five homepage sections; Docs has useful linkable HTML; desktop/mobile and keyboard navigation work; route/metadata/build checks remain valid.

References: user-approved information architecture review, NN/G homepage principles and progressive disclosure, GOV.UK accordion guidance, Diátaxis reader needs, Google Search Central AI features guidance. These are design heuristics, not measured visitor comprehension or conversion.

### V3.3 implementation and verification

Implemented five product-led homepage sections, simplified main/footer navigation, a static annotated 1-unit/0-unit contract example, and read-only audience entry pages. Removed homepage calculator/brief prompts and FAQ gates. Existing utilities remain available through secondary reading paths. Eighteen Docs pages now share three intent groups, desktop sidebar, mobile browse disclosure, active-page indication, section anchors and related/previous/next navigation; all thirteen existing guide slugs remain valid. Metadata/social copy matches the product-led direction.

Independent rendered review identified ambiguous payout wording and inconsistent 320px outcome alignment. Both were corrected and rereviewed. The docs composition was independently inspected at desktop and mobile widths with no consequential remaining visual issue identified. This is a design review, not a user-comprehension or conversion study.

Final production build and TypeScript pass. Crawlability passes; SEO structural checks pass 161 rendered pages. Route checks pass 33 versioning cases, 68 retained route mappings and 84 built V3 pages. Metadata checks pass across the 84 built pages and five served examples. Content-link checks report zero failures and ten existing editorial warnings. `git diff --check` passes.

Browser checks: 1440/390/320px homepage and Docs captures show no horizontal overflow; home has exactly five sections and no inputs/buttons/disclosures in its main content. Mobile menu open/close, Escape/focus return, same-page anchor dismissal, Docs entry, keyboard disclosure, automatic closure after article navigation, active sidebar link and article anchors pass. Six supporting routes were checked at 320/1440px. Home example and Docs content remain readable with JavaScript disabled; native Docs navigation remains usable. Final checks report no page errors.

A production-only hydration mismatch on unmatched V3 URLs was found in the inherited path-dependent chrome. The standalone `app/global-not-found.tsx` fallback, using Next 16's documented experimental `globalNotFound` option, now returns an actual 404 without choosing a different chrome at hydration. This is the only framework-config change; root version redirects are unchanged. Older tag indexes now link back to the relevant Docs references.

Final screenshots: `outputs/doefin-v33-preview.png`, `doefin-v33-desktop.png`, `doefin-v33-mobile.png`, `doefin-v33-small.png`, `doefin-v33-docs-desktop.png`, and overview article captures at desktop/mobile/small in the task directory. Temporary dev server stopped. Production preview runs at http://127.0.0.1:3037/v3; Docs at /v3/docs. The existing in-app preview tab was refreshed.

This remains an unpublished noindex comparison. Final domain/root redirects, sitemap/feed/llms.txt consolidation and removal of superseded public routes belong to the production rollout. Legal/deployment evidence and real research remain owner validation items. No external account workflow, email delivery or financial action was performed.

## V3.4 landing expansion — 19 October 2026

User-approved sequence: hero → concrete miner and trader use cases → Inside the product → static contract mechanics → five practical FAQ answers → app/contact and optional updates. This supersedes the five-section limit for the homepage only. The user explicitly excluded People and evidence because material is not ready. Docs content, routes and composition are accepted and must remain unchanged.

Refinement mode: retain the existing palette, typography, hero and primary Open app action. Make the authentic app capture the new visual focal point. Desktop shows the market detail; mobile pairs its readable question with close crops of the YES/NO choices and three plain-language explanations. The source image remains unmodified. It is a dated screenshot, not a live quote, interactive trading form or proof of liquidity. The static settlement example remains visibly illustrative.

Reference: user selected the live Chrome market at /app/markets/cbBTC/979776/137.2?side=yes and approved its screenshot for the product section. Captured 19 October 2026; original files are in task outputs, with the viewport image copied to public/images/v3/market-detail-2026-10-19.jpg. No fake data, customers, team material or research claims are added.

Ownership: lead — homepage, product/FAQ components, homepage version label, integration and rendered checks. Content reviewer — read-only FAQ source validation and newsletter destination check; then independent rendered critique. Source baselines and Docs hashes are stored under task outputs/v34-baseline. No recursive delegation or edits to shared content by reviewers.

FAQ uses native details/summary with answers in server-rendered HTML and links to the existing Docs. Subscriptions have no configured provider, so the optional updates area offers a labelled email enquiry and explicitly says signup is unavailable. It neither collects email addresses nor claims subscription success. No backend, production publishing or domain migration is part of this pass.

Independent rendered critique identified two corrections: the first mobile chart crop omitted the YES/NO interface described in its annotation, and the old settlement example used an unrelated threshold/block. Mobile now shows legible crops of the actual choice tiles; the desktop keeps the full product view. The illustrative example now uses 137.2 T and block 979,776 from the capture, while explicitly distinguishing hypothetical observations and an assumed 1-unit payout from actual outcomes or quotes.

### V3.4 verification and handoff

Production build, TypeScript, crawlability and SEO checks pass (161 rendered pages). Version checks pass 33 cases; metadata checks pass across 84 built V3 pages and five served pages. Content-link checks retain zero failures and the ten pre-existing editorial warnings. All homepage internal destinations exist in the prerender manifest; five FAQ answers are present in the built HTML. `git diff --check` passes.

Rendered production views at 1440, 390 and 320 CSS pixels have no document overflow. Product images load at each width. All five FAQ disclosures were exercised with Enter/Space in development; the production exit answer and its Docs destination were verified. Mobile menu expansion, Escape and focus return pass in production. The final test tab has no browser error logs. This is focused QA, not a complete accessibility or performance audit.

Six fingerprints confirm Docs content, index/article layout and route files stayed byte-for-byte unchanged. The copied screenshot matches its original hash. The homepage footer reports V3.4; supporting pages retain their V3.3 label and accepted composition. No signup provider, analytics or account/financial action was added.

The independent reviewer inspected the final desktop/mobile/small captures and found no consequential remaining visual issue. User acceptance is still separate from that review. Captures: task outputs/doefin-v34-desktop.jpg, doefin-v34-mobile.jpg, doefin-v34-small.jpg, doefin-v34-product-small.jpg and doefin-v34-product-desktop.jpg. The temporary development server is stopped. The production preview remains http://127.0.0.1:3037/v3, with the existing preview tab refreshed. Unpublished/noindex status and domain rollout remain unchanged.

## V3.5 focused landing polish — 19 October 2026

User approved the five corrections from the strict V3.4 review: clearer hero benefits, shorter audience copy, a simpler mobile product preview, distinct product/mechanics roles, and a quieter updates contact. Keep six sections, existing visual system and the accepted Docs architecture. No additional proof, people, calculators or signup service.

The hero names the traded subject and the two reasons to care: exploring a hedge against rising difficulty or taking a view on its next move. Each audience has one benefit, one short explanation and a link. The authentic screenshot shows the product; mobile adds a readable question and noninteractive outcome labels without repeating tiny price quotes. Settlement mechanics explain observation, resolution and payout, with the same threshold/block and explicit hypothetical outcomes. The updates enquiry becomes one secondary email link, without an unavailable-signup panel.

Ownership: lead — page copy, mechanics illustration, homepage version label, integration and verification; product worker — ProductPreview.tsx only; independent critic — read-only rendered review. Existing source changes are preserved. Scoped baseline and ten protected fingerprints are stored in task outputs/v35-baseline. Docs, FAQ, source image and routing/discovery configuration remain unchanged. This is a local noindex refinement; no publication or domain migration is included.

### V3.5 verification and handoff

The independent rendered review confirmed distinct audience/product/settlement roles and readable mobile condition labels. Its two follow-ups were applied: define T beside the mobile question and remove repeated observation-block labels from the payout rows. The final pass also keeps each numerical threshold and its unit together and removes the repeated professional-investor phrase below the hero action.

- Final production build, including TypeScript, passes. Crawlability and SEO checks passed during this iteration across 161 HTML pages; metadata validation passed 84 built and five served V3 pages. Final HTML assertions confirm six sections, five native FAQ disclosures, the current copy and V3.5 label. Fourteen homepage internal destinations are built. `git diff --check` and a scoped whitespace check pass.
- Ten protected fingerprints are unchanged: accepted Docs modules/content, FAQ, route registry, source image and discovery/routing files. The real screenshot remains unmodified. Existing edits outside this iteration are preserved.
- Final production captures at 1440, 390 and 320 CSS pixels show no horizontal overflow and the product image loads. At 390px the closed-FAQ page is 4,679px tall, versus 5,628px in V3.4; the reduction is layout evidence, not a measured comprehension or conversion result. Final desktop height is 3,881px; 320px height is 5,136px.
- The hero anchor places the mechanics below the sticky header. FAQ Enter/Space expansion and closure pass; the revealed managing-positions guide has the expected URL. Mobile menu Escape closes it and returns focus to the trigger. The browser error log is empty. This remains focused QA, not a full accessibility or performance audit.
- Final captures are task outputs/doefin-v35-preview.jpg, doefin-v35-desktop.jpg, doefin-v35-mobile.jpg, doefin-v35-small.jpg, doefin-v35-product-mobile.jpg and doefin-v35-product-small.jpg. The temporary QA tab is closed and viewport overrides reset. The existing preview tab is refreshed at http://127.0.0.1:3037/v3; the production-mode local server remains running.

No deployment, user study, measured SEO/AI visibility or subscription integration is claimed. Existing noindex and rollout boundaries remain unchanged.

## V3.6 practical relevance and product framing — 19 October 2026

User approved the remaining V3.5 review recommendations. Keep six homepage sections and accepted Docs. Add a concrete, static planning example on the existing miner page, promote the payout/profit distinction in the homepage example, and focus the product screenshot on the question and price chart. The existing miner audience link points to the example anchor. No new homepage section, calculator, trading flow or performance claim.

Lead owns homepage link, market example, screenshot framing, per-route version label and verification. Miner content worker owns MinersPage.tsx only; independent reviewer inspects final renders. Scoped baseline and ten protected fingerprints are in task outputs/v36-baseline.

The product uses a CSS crop of the unmodified, user-selected 19 October capture: x14/y175/w918/h512 in its 1440×756 original. This excludes the empty order form and navigation without changing displayed market values. The full screenshot remains linked. Mobile retains readable question/outcome text; the caption states that pricing is historical and is not a forecast. This is a presentation refinement, not a fresh live capture.

The miner example holds fleet hashrate, uptime and reward assumptions fixed, contrasts baseline and higher-difficulty production, and lists fit considerations before a decision. No invented market prices, hedge size or profit is shown. A sub-threshold outcome can pay zero despite lower production; the fixed payout does not automatically match a production loss. The homepage settlement card states payout versus profit in normal-sized text alongside the example.

Home and miner routes are marked V3.6. Supporting pages retain their accepted version and composition. User testing requires actual target-user participation and is not represented by internal review. No publishing, account action or domain/discovery migration is included.

### V3.6 verification and handoff

The final miner example includes a visible hypothetical +10% difficulty / approximately 9.1% lower expected BTC comparison, verified from the inverse-difficulty ratio (1 / 1.10). It assumes that relative difficulty level throughout the month and fixes hashrate, uptime and rewards. These numbers describe production sensitivity, not hedge effectiveness or returns.

- Final production build including TypeScript passes. Crawlability, SEO (161 HTML pages), and metadata checks (84 built plus five served V3 pages) passed during this iteration. Final focused checks confirm the six-section homepage, new anchored miner example and preserved protected content. Internal destinations and fragments on both changed pages are valid. Scoped whitespace and git diff checks pass.
- Ten protected fingerprints remain unchanged: Docs content/layout modules, FAQ, route registry, original screenshot and discovery/routing files. The homepage miner link navigates to the new planning section with its heading below the sticky header on desktop and mobile.
- Home and miner views at 1440, 390 and 320 CSS pixels show no horizontal overflow. The image loads, screenshot framing excludes the order form, the mobile question remains readable, and the payout/profit statement is visually prominent. The test-tab browser error log is empty. Focused QA does not establish a complete accessibility/performance audit or user comprehension.
- Independent rendered review found no consequential remaining issue in the three changes. It checked screenshot framing/disclosure, payout/profit prominence, and the scenario's stated assumptions and limitations. No user study or conversion result is claimed.
- Evidence is in task outputs/doefin-v36-desktop.jpg, doefin-v36-mobile.jpg, doefin-v36-small.jpg, doefin-v36-product-desktop.jpg, doefin-v36-product-mobile.jpg, doefin-v36-payout-desktop.jpg and doefin-v36-miner-{desktop,mobile,small}.jpg. The preview remains http://127.0.0.1:3037/v3; local only with the existing noindex configuration.

## V3.7 visual direction — 19 October 2026

User rejected V3.6's visual execution as flat, plain and inconsistent with the frontend. The earlier 8/10 blended assessment overweighted content/structure; it is not visual acceptance. Accepted implementation direction: custom vector hero, coherent icons, stronger surfaces, frontend blue/violet styling, restrained motion. Preserve the six sections, copy/claims, app/contact routes and accepted Docs. Keep V1/V2, screenshot pixels, discovery configuration and miner content unchanged.

Visual target: the public face of the trading app, with an asymmetric hero pairing concise copy and a custom block/observation vector; blue/violet light, layered surfaces, readable white and secondary type, and an authentic product stage. Two compact audience cards use distinct icons; mechanics uses matching block/threshold/settlement icons. Product screenshot remains factual and dated. Motion is finite and reduced-motion aware: hero assembly, subtle entrances, control feedback and native disclosure transitions. No fake live quotes, financial interaction or new content section.

Reference: current doefin-frontend tailwind.config.js, components/UI/Button.tsx and styles/Home/Home.css. Reuse its Manrope, navy grounds, brand-blue/violet gradient, 12px buttons and 22px panels. These references inform styling; the previous frontend's rotating copy and perpetual pulses are not required.

Ownership: lead — page composition, scoped styling, motion, navigation styling on home only, QA and integration; vector worker — HeroVisual.tsx, HeroVisual.module.css and BrandIcon.tsx only; independent critic — rendered review. Baseline and protected fingerprints: task outputs/v37-baseline. No production publish or Notion change is included in this pass.

### V3.7 verification and handoff

Implemented the selected direction in a landing-scoped stylesheet, retaining six sections and the existing facts/actions. The hero now pairs a custom SVG block/observation scene with the concise message. Audience and mechanics icons share a 24px/1.5px-stroke family; layered surfaces distinguish product, mechanics and the closing action. The frontend's actual primary gradient is reused and confirmed in computed browser styles. The homepage footer reports V3.7; the miner page remains V3.6 and other supporting pages retain their existing version.

Motion is finite: CSS hero/illustration entrances and path draw, short button/link feedback, one-time section entrances and native FAQ/menu transitions. Content remains visible before hydration; no new package or financial interaction was introduced. Reduced-motion runtime checks show hero/vector animations and CTA transitions disabled. JavaScript-disabled HTML retains all six sections and five FAQ answers; the native funding disclosure was opened through browser input. Normal settings were restored afterward.

Independent rendered critique identified an isolated word in the 390px audience heading and slower mobile pacing. Removed the forced heading break and compacted mobile illustration/card/section spacing. Final 390px height is 5,627px, versus 5,817px in the first V3.7 render. The reviewer found no consequential remaining issue in the rerenders; the 320px heading wrap is acceptable with optional future polish. This is an internal visual review, not user acceptance or measured comprehension.

Final optimized build/TypeScript passes. Crawlability checks pass; structural SEO checks cover 161 HTML pages, and metadata checks cover 84 built plus five served V3 pages. Twelve protected file fingerprints remain unchanged, including Docs, global/shared styles, discovery/routing and original screenshot. ProductPreview, MarketExample, HomeFaq and MinersPage also remain byte-for-byte unchanged. Six homepage sections, loaded images and no horizontal overflow were checked at 1440/390/320px. Mobile menu Escape/focus return, FAQ keyboard closure, Docs navigation and absence of landing styling on Docs pass. Browser error log is empty. This is focused QA, not a complete accessibility/performance audit.

Final visual evidence: task outputs/doefin-v37-hero.jpg, doefin-v37-desktop.jpg, doefin-v37-mobile.jpg, doefin-v37-mobile-hero.jpg, doefin-v37-small.jpg and audience/FAQ viewport captures. The temporary development server is stopped; the production-mode local preview remains http://127.0.0.1:3037/v3. No deployment, domain migration or Notion update was performed.

## V3.8 product-led hero — 19 October 2026

Refinement approved after the strict V3.7 review: explain the binary market in the hero, compact its mobile footprint, improve supporting labels, and make motion carry meaning. Keep the six-section sequence, frontend palette, Docs, screenshot, FAQ and downstream mechanics. V3.7's good technical checks do not imply visual or user acceptance.

The opening pairs the existing headline with concise YES/NO copy and an illustrative market rule: observe difficulty at block 979,776, compare with 137.2 T, then show both possible outcomes. Values come from the existing captured market; there is no invented observed value, actual resolution or live quote. Both outcomes and labels stay readable from first paint. A brief once-only highlight follows block, threshold and both branches; reduced motion is static. Mobile gets a compact diagram with HTML labels, not a scaled-down desktop canvas. Selected disclosures/captions become 13px with clearer foreground contrast.

Ownership: lead — homepage copy/layout, scoped label styles, version label, integration and verification; vector worker — HeroVisual.tsx and HeroVisual.module.css only; independent critic — exact rendered desktop/mobile result. Existing work is preserved in task outputs/v38-baseline; protected Docs/product/FAQ/routes/screenshot fingerprints establish the scope boundary. No new service, financial interaction, dependency, publication or Notion update.

### V3.8 verification and handoff

The implemented hero explains the market rule with a block reference, threshold comparison and two equal outcome branches. Desktop is 292px tall; the mobile diagram is 196px with readable HTML labels. No selected outcome, live observation, trading control or forecast is implied. Hero text is visible immediately, with motion concentrated on the explanatory vector. Selected risk notes and screenshot/mechanics captions are 13px and #B1BDD4.

Independent critique inspected the exact 1440, 768, 390 and 320px renders and found the earlier generic-blockchain ambiguity resolved. It identified only minor optional spacing between the comparison/outcome labels at 768px. This is internal visual review, not measured visitor comprehension or user acceptance.

Optimized build and TypeScript pass. Crawlability passes; structural SEO checks cover 161 rendered pages and metadata checks cover 89 built/served V3 pages. The build retains the existing metadataBase configuration warning; this pass did not alter metadata or discovery settings. Fifteen protected file fingerprints remain unchanged, including Docs content/layout, routes, product/FAQ/mechanics components and original screenshot. The homepage still contains exactly six sections.

Browser checks: desktop/tablet/mobile layouts fit without horizontal overflow. Final production views were checked at 1440, 390 and 320px; images load and the error log is empty. Runtime styles confirm the frontend's exact primary gradient and 13px supporting captions. The one-time sequence begins with observation emphasis, then threshold, then draws both branches to completion. Reduced motion disables all hero animation/CTA transitions. JavaScript-disabled content preserves the full rule, six sections and five native FAQ disclosures; the funding answer opens. Mobile menu Escape returns focus, and client navigation to Docs removes all landing scope classes. Temporary browser overrides were reset. These are focused checks, not a full performance/accessibility audit.

Final evidence: task outputs/doefin-v38-hero.jpg, doefin-v38-desktop.jpg, doefin-v38-mobile-hero.jpg, doefin-v38-mobile.jpg, doefin-v38-small-hero.jpg and doefin-v38-small.jpg. Tablet evidence is doefin-v38-tablet-hero.jpg from the same source revision in development. The user's existing preview tab was refreshed to V3.8 at http://127.0.0.1:3037/v3. Production-mode local preview remains running; no deployment, domain migration or Notion mutation.

## V3.9 wording, timing and mobile sequence — 19 October 2026

Approved scope: natural hero wording, a slower deliberate motion sequence, and the product section before the audience cards on mobile only. Six sections, desktop ordering, frontend styling and accepted Docs remain. The diagram now asks “Will difficulty reach 137.2 T?” at the specified block, with the same illustrative condition and both outcomes. No new claim, live result or control is introduced.

Motion starts once at 65% diagram visibility, waits 1.2 seconds, then highlights the block (0.9s), threshold (0.9s), and both branches (1.2s). The sequence completes 4.2 seconds after becoming eligible; labels/static paths never depend on playback. Reduced motion and no-JavaScript views remain static.

Only Audience/Product receive a small responsive wrapper. CSS establishes their intended layout before hydration; useSyncExternalStore synchronizes their actual DOM/keyboard order with the 767px breakpoint. Content is server-rendered once. Progressive reading-flow helps the no-JavaScript CSS layout in supporting browsers; without JavaScript in older browsers, reading/tab order retains the server's desktop order, while both independent sections remain available. No positive tabindex or duplicated mobile content.

Ownership: lead implementation and runtime checks; independent critic read-only advice and rendered review. Scoped V3.8 baseline and protected Docs/product/FAQ/routes fingerprints are in task outputs/v39-baseline. No dependency, publishing or Notion change.

### V3.9 verification and handoff

Hero copy now opens with a plain question and keeps “Trade YES or NO” together. Independent rendered review checked 1440/390/320px layouts and found no new consequential layout issue. Final production captures confirm the wording, six sections, loaded images, no horizontal overflow and an empty browser error log. At 390px, the product section starts at 678px, approximately 900px earlier than V3.8. Desktop retains audience before product. Keyboard navigation follows the mobile DOM order: hero link, product app link, full screenshot, then audience links.

Runtime verification confirms that a diagram below the visibility threshold does not animate. Once eligible, the one-time sequence uses the planned delays/durations and completes both branches. Reduced motion disables animation without affecting section ordering. JavaScript-disabled content keeps all six sections, five FAQs and the complete static rule; mobile visual ordering remains product first, subject to the older-browser reading-order fallback documented above.

Optimized build and TypeScript pass. Crawlability checks pass; structural SEO checks cover 161 rendered pages and metadata checks cover 89 built/served V3 pages. Fifteen protected fingerprints remain unchanged, including Docs, routes, product/FAQ/mechanics content and the original screenshot. The existing metadataBase build warning remains. These are focused checks, not a full accessibility/performance audit or measured visitor comprehension.

Final production evidence: task outputs/doefin-v39-hero.jpg, doefin-v39-mobile-opening.jpg and doefin-v39-mobile.jpg. The existing user preview tab was refreshed to V3.9 at http://127.0.0.1:3037/v3. Temporary browser overrides were reset and the QA tab closed. The production-mode local preview remains running; no external deployment or Notion update.

## V3.10 clarity — 19 October 2026

Approved scope: explain buying YES/NO position tokens, observing difficulty at the specified block, reading the product chart and receiving a payout. Keep six sections, mobile product-first sequence, established colors/motion and accepted Docs. Give each section a distinct job without adding a lesson to the hero.

Hero introduces what is bought and uses the inclusive threshold at a specified block. Mechanics distinguishes an earlier threshold crossing from the observation, then resolution and redemption. The product preview replaces its repeated mobile outcome transcript with a readable explanation of the daily YES price-history line. The payout example removes undefined “units” and specifies one position token, the stated funding-token payout before fees, and net result after purchase cost and fees. The miner card connects a winning YES payout to a possible partial offset with cost/size/timing limits.

Lead owns implementation and rendered QA. Source explorer verifies chart/payout language against local doefin-frontend; independent critic reviews the resulting desktop/mobile renders. Baseline and 14 protected fingerprints are in task outputs/v310-baseline. No changes to Docs, discovery configuration, original screenshot pixels, interaction behavior or deployment are intended.

### V3.10 verification and handoff

Independent screenshot/source review found the four requested explanations clearer and no consequential new wording or layout defect. The product panel now explains its chart rather than repeating the hero condition; at 390px it is approximately 105px shorter than V3.9. The payout panel explicitly identifies one YES token and gross payout before fees, with purchase cost and fee subtraction distinguished from profit. Embedded chart details remain small on mobile; the readable explanation and full-image link provide context without claiming that all chart values can be inspected inline.

TypeScript, optimized build, whitespace and crawlability checks pass. Structural SEO checks cover 161 rendered pages; metadata checks cover 89 built/served V3 pages. Fourteen protected fingerprints remain unchanged, including Docs, FAQ, miner page, motion/order behavior, discovery and original screenshot. The existing metadataBase configuration warning remains; no metadata migration was included.

Rendered 1440/390/320px layouts fit without horizontal overflow. Final production desktop/mobile views show six sections, the intended breakpoint order, loaded images and no browser error logs. Reduced-motion verification disables hero animation. These focused checks and internal critique do not establish measured visitor comprehension or a full accessibility/performance audit.

Final production evidence: task outputs/doefin-v310-hero.jpg, doefin-v310-desktop.jpg, doefin-v310-mobile-hero.jpg, doefin-v310-mobile-product.jpg, doefin-v310-mobile-payout.jpg and doefin-v310-mobile.jpg. Narrow 320px evidence is from the same source in development. The existing preview tab was refreshed to V3.10 at http://127.0.0.1:3037/v3; QA tab/viewport overrides were cleaned up. Local production preview remains running; no external deployment, commit or Notion update.


## V3.11 unified payout section — 19 October 2026

Approved scope: replace the separate process and YES-only example with one static payout panel. Keep the six sections, existing page sequence and accepted Docs. Show the observation block and threshold once, then both conditional outcomes with YES and NO token results. Separate the gross payout from profit after purchase cost and fees. Desktop presents equal outcome cards side by side; mobile stacks them with compact spacing and readable labels. No calculator, tabs or selected outcome.

Lead owns the section wrapper, obsolete style cleanup, version label, documentation and runtime verification. The payout worker owns MarketExample.tsx and its new CSS module; an independent critic reviews exact renders. Baseline and 17 protected fingerprints are in task outputs/v311-baseline. All homepage content outside this section is protected by exact before/after snapshots.

### V3.11 verification and handoff

The final panel shows both conditional outcomes and both position tokens together, with one shared observation rule. Fixed gross payout is explicitly separated from profit or loss after costs and fees. Independent critique of the exact desktop/390px renders found no consequential clarity or layout defect and recommended retaining the readable mobile rows. Final polish replaces “Contract payout” with “Fixed payout” and shortens the threshold label so both values align at 320px. This is internal visual review, not measured visitor comprehension or user acceptance.

The 390px payout section is 1,066px tall, down from 1,322px in V3.10 (about 19%). Desktop uses two equal outcome cards; mobile stacks them without interactive controls. Final production views at 1440/390/320px have no horizontal overflow. Images load and the browser error log is empty. Reduced-motion checks disable CTA and settlement-link transitions. The new settlement-guide link opens the accepted documentation page, which retains its own styling.

TypeScript, optimized build and whitespace checks pass. Crawlability passes; structural SEO checks cover 161 rendered pages and metadata checks cover 89 built/served V3 pages. The existing metadataBase configuration warning remains. Seventeen protected file fingerprints are unchanged, including Docs, hero/motion/order, FAQ, product preview, routing/discovery and original screenshot. Exact before/after snapshots confirm homepage content outside the payout section is unchanged, and the homepage still has six sections. These are focused checks, not a full accessibility/performance audit.

Final production evidence: task outputs/doefin-v311-desktop-payout.jpg, doefin-v311-mobile-payout.jpg, doefin-v311-small-payout.jpg and doefin-v311-mobile.jpg. The existing preview tab was refreshed to V3.11 at http://127.0.0.1:3037/v3. Temporary browser overrides and QA tab are cleaned up. Production-mode local preview remains running; no external deployment, commit or Notion update.


## V3.12 payout meaning and mobile hierarchy — 19 October 2026

Approved scope: make zero payouts and the non-refunded purchase cost explicit, distinguish gross payout from profit, emphasize the outcome results, and compact mobile within the same six sections. Keep Docs and all other homepage content/style unchanged.

The panel now labels settlement payouts per token before fees, gives YES and NO equal result columns within each scenario, and places “Payout is not profit” directly after the outcome cards. Its equation precedes the explicit losing-token explanation. Supporting funding-token and market-term details follow. Reference block/threshold values are visually quieter; results are larger. Mobile uses a two-line equation where space permits and a deliberate three-line arrangement on narrow screens. No new interaction, data claim or example amount.

Lead owns implementation and runtime checks. Independent reviewer checks content semantics and exact renders. The V3.11 baseline and 19 protected file fingerprints are in task outputs/v312-baseline, including the complete homepage, landing stylesheet, Docs, hero/product/FAQ/motion/order and discovery configuration.

### V3.12 verification and handoff

The final 390px section is 1,001px tall (V3.11: 1,066px); at 320px it is 1,121px (V3.11: 1,145px). The profit heading appears 629px after the section starts at 390px, approximately 194px earlier than V3.11. Results are larger than the reference values, and both outcomes remain visible with no controls or hidden content. The main gain is earlier comprehension with a modest height reduction despite the added loss explanation.

Independent review of the exact desktop/390/320 renders found no consequential meaning or layout blocker. It noted that the 320px result columns are near their minimum comfortable width, so type was not reduced further. A focused overflow check confirms every payout value fits its column. This is internal critique, not user acceptance or measured visitor comprehension.

TypeScript, optimized build, whitespace and crawlability checks pass. Structural SEO checks cover 161 rendered pages; metadata checks cover 89 built/served V3 pages. The existing metadataBase configuration warning remains. Nineteen protected fingerprints are unchanged, including the complete homepage and landing stylesheet, accepted Docs, original screenshot, hero, FAQ, product content, motion/order behavior and discovery settings. The homepage still contains six sections.

Rendered checks cover 1440/768/390/320px; final production desktop/390/320 views show no horizontal overflow, loaded images and no browser error logs. Production evidence: task outputs/doefin-v312-desktop-payout.jpg, doefin-v312-mobile-payout.jpg, doefin-v312-small-payout.jpg and doefin-v312-mobile.jpg. The tablet capture is from the same source in development. Existing preview tab refreshed to V3.12 at http://127.0.0.1:3037/v3; QA tab and viewport overrides cleaned up. Production preview remains running. No external deployment, commit or Notion update.


## V3.13 alternative payout composition — 19 October 2026

The user requested another solution after the V3.12 critique. Treat this as dissatisfaction with composition, not a spacing defect; earlier internal scores do not imply user approval. Preserve six sections, Docs, content boundaries and frontend styling. The V3.12 files and 19 protected fingerprints are saved in task outputs/v313-baseline.

Two isolated studies were rendered at 1440 and 390px: a comparison matrix (lead) and a three-stage settlement flow (worker). Files and captures remain in task outputs/v313-studies. The lead selected the matrix provisionally because it lets visitors compare YES and NO in fixed columns against two difficulty outcomes. The flow reintroduced a sequential reading task. Independent critique supported the matrix and requested an earlier unit definition and equal Fixed/zero emphasis.

The integrated composition uses an open observation context with the existing block icon, one semantic comparison table, a separate unboxed profit strip, and concise settlement notes with the existing Docs link. It replaces the nested panel/scenario cards. Both outcomes are always visible, including on mobile. Table headers identify each row and column; its caption identifies a settlement example and per-token payouts before fees. T is defined beside the difficulty header, and Fixed/zero have equal size and weight. No financial controls or invented amounts. Existing section entrances and reduced-motion behavior are unchanged.

Ownership: lead — matrix study, production component/CSS, version label, docs, integration and QA; flow worker — isolated flow.html only; independent critic — read-only study choice and final rendered review. Protected homepage, shared landing CSS, Docs, other sections and discovery remain unchanged.


## V3.14 purchase-to-outcome story — 19 October 2026

The user explicitly rejected the V3.13 matrix and requested a concept grounded in best practices. That rejection supersedes the earlier internal recommendation. V3.13 is retained in outputs/v314-baseline; no claim of user approval is made.

Visitor task: understand what happens to a purchase, including the difference between gross payout and gain/loss. Two new directions were rendered: a threshold-scale illustration (worker-owned isolated study) and a whole-position worked example (lead-owned component study). The purchase story is the provisional implementation: one YES position costing 60, branching into a hypothetical 100 payout/40 gain or zero payout/60 loss, before fees. The numbers are assumptions expressed in the same funding token, not actual quotes or per-token payout constants. A 60/40 segmented bar visually separates recovering cost from gain. Both outcomes remain visible without controls. Mobile presents the purchase, measurement and two compact endings in reading order. Other six-section content, Docs, discovery and motion remain protected.

Reference basis: Nielsen Norman Group's usability heuristics (https://www.nngroup.com/articles/ten-usability-heuristics/) recommend familiar language, natural order, recognition and removing competing information; progressive disclosure (https://www.nngroup.com/articles/progressive-disclosure/) supports moving detailed settlement rules to the existing Docs destination. These are heuristics supporting the content hierarchy, not evidence that a particular layout has been user-tested. The threshold study clarifies which side wins, but retains abstract payout amounts; the story addresses the visitor's financial consequence directly.

Ownership: lead — story implementation, integration, QA and this brief; threshold worker — outputs/v314-studies/threshold.html only; independent critic — read-only content guardrails and exact rendered comparison. The current component remains static/server-rendered, with the existing section entrance and reduced-motion behavior. No new interactive controls, dependencies or claimed live data.

### V3.14 verification and handoff

The independent rendered comparison favored the purchase story for explaining the financial consequence, while finding the threshold study shorter but repetitive of the hero. Two recommendations were applied: remove the duplicate profit paragraph below the diagram, and explicitly name difficulty as the measured variable. This remains a proposed design; internal critique and technical checks are not user acceptance or measured comprehension.

The final production section was inspected at 1440, 768, 390 and 320 CSS pixels. All fit without horizontal overflow. Desktop uses one purchase branching into two endings; mobile retains both endings as aligned rows. The 390px section is approximately 1,023px high: this direction prioritizes a concrete worked example rather than claiming a shorter section. Loaded images, six sections and the V3.14 version label were verified; no browser error logs were reported. Evidence is in task outputs/doefin-v314-{desktop,mobile,small,tablet}-payout.jpg.

TypeScript, optimized build, crawlability, whitespace checks, 161-page structural SEO checks and 89-page V3 metadata checks pass. Nineteen protected file hashes are unchanged, including the entire homepage wrapper, shared landing stylesheet, Docs, hero/product/FAQ, motion/order behavior and discovery configuration. The existing metadataBase build warning remains outside scope. No new dependencies, interactions, external deployment, commit or Notion changes. Local production preview remains on port3037; temporary development/study servers are stopped.

## V3.15 clarity and reading order — 19 October 2026

User-authorized refinement of the V3.14 purchase story: make both result headings identify the held YES position, explain example units as whole-purchase totals in the token used to pay, increase mobile label readability, and move payout before audience cards. Preserve six sections and accepted Docs. This retains the worked-example concept rather than opening another visual direction.

Reading order is now hero → product preview → payout → audience → FAQ → next step on every viewport. The page renders that order directly in its server HTML; the former breakpoint-driven IntroSections wrapper and its CSS ordering rules are no longer used. The existing module is preserved. All six section bodies remain unchanged in the homepage source; their order alone changes. The payout component remains static, with the same illustrative amounts and existing section reveal. No real asset, current quote, per-token payout constant or new interaction is introduced.

Lead owns page order, removal of obsolete ordering styles, version label, documentation, integration and QA. Payout worker owns MarketExample.tsx and its CSS module. Independent reviewer checks the resulting desktop/mobile evidence. Baseline sections, files and 17 protected file hashes are saved in task outputs/v315-baseline. Docs, original screenshot, hero, product, audience copy, FAQ, discovery and motion logic are protected.

### V3.15 verification and handoff

Both result headings now identify the held YES position and each amount is labeled Your payout. The introduction identifies whole-purchase totals in the token used to pay, separately from YES-token counts, and retains an assumed winning payout before fees. Mobile outcome headings are 15px; material example labels are at least 13px. Thresholds sit beneath their outcome headings at narrow widths. The cost/gain bar uses shorter labels and corrected selector specificity so its two intended colors render distinctly.

Independent review of exact desktop/390/320 renders found the earlier ownership ambiguity resolved and no new clipping, overlap or factual contradiction. Larger labels make the section slightly taller: approximately 1,080px at 390px and 1,125px at 320px. At 390px the section starts around 1,448px rather than 2,384px. The improvements are readability and earlier arrival, not a claimed reduction in section height. These are rendered observations and internal critique, not user comprehension testing or acceptance.

The production preview was inspected at 1440/768/390/320px, with no horizontal overflow and no browser error logs. The six-section order is verified in both server HTML and the hydrated DOM. The settlement-guide link opens the existing /v3/docs/how-settlement-works page. TypeScript, optimized build, crawlability, 161-page SEO checks, 89-page V3 metadata checks and touched-file whitespace checks pass. Seventeen protected hashes and all six original homepage section bodies are unchanged; only their order and the payout child component change. Existing metadataBase warning remains outside scope.

Production evidence: task outputs/doefin-v315-desktop-payout.jpg, doefin-v315-tablet-payout.jpg, doefin-v315-mobile-payout.jpg and doefin-v315-small-payout.jpg. Local preview remains on port3037; temporary development server is stopped. No external deployment, commit or Notion update.


## V3.16 payout colors and mobile density — 19 October 2026

User-authorized refinement of the existing purchase story: profit uses Doefin frontend green #3EC875; loss uses red-orange #F05122. Cost and total payout remain neutral. The cost bar is brighter slate, and both financial results retain explicit text so color is supplementary. The introduction describes whole-purchase totals in the token used to pay; both result labels now read Total payout, the winning result reads +40 profit, and the bar consistently uses profit. No asset, quote, token quantity or payout promise is invented.

Lead owned the payout component, its CSS, landing version label and this record. Independent read-only reviewer checked the exact 1440/390/320 renders and found no blocking issue. Mobile spacing was tightened without smaller type; two-line Total payout labels fit at 320px. Measured payout-section height is 992.7px at 390px (previously 1079.8px) and 1037.9px at 320px (previously 1125.0px), a reduction of about 87px. Desktop remains 921.4px; tablet is 939.0px. No horizontal overflow at 1440/768/390/320px and no browser error logs. Settlement guide navigation works. These are rendered checks and internal critique, not newcomer testing or user acceptance.

Optimized build, TypeScript, crawlability, 161-page SEO checks and 84-page built V3 metadata checks pass. Sixty-five protected file hashes confirm unchanged section order, all other landing content, Docs, screenshot, motion and discovery configuration. Existing build warnings are unchanged. Evidence is in task outputs/doefin-v316-{desktop,tablet,mobile,small}-payout.jpg. Production preview is served on localhost:3037. No external deployment, commit or Notion update.


## V3.17 product-updates form prototype — 19 October 2026

User requested an email input and submit button with stronger design and best-practice behavior, then explicitly chose a form prototype only. A new scoped ProductUpdates client leaf replaces the small email-enquiry line within the existing sixth section. Lead owns implementation and verification; a read-only explorer checked integration availability, and an independent critic reviewed source and exact desktop/mobile renders. No subscription provider or real endpoint exists in either local website or frontend checkout. The legacy shared Subscribe component is intentionally left unchanged.

The panel uses the existing dark navy/blue visual language, a small original envelope SVG, a short benefit statement, visible Email address label, one field and Subscribe button. Desktop uses copy/form columns; tablet stacks copy above inline controls; mobile stacks the controls. The main app CTA keeps visual priority. Fields use type=email, inputMode, autocomplete, 16px text and 52px controls. Focus rings, reduced-motion behavior, field-adjacent errors, aria-invalid, descriptive error links and a live status support keyboard and assistive-technology use. Sources: https://www.w3.org/WAI/tutorials/forms/labels/ and https://www.w3.org/WAI/tutorials/forms/notifications/. This is guidance-informed implementation, not a complete accessibility certification.

Empty and malformed submissions display actionable errors; correction clears the error. Valid submission says only Preview complete and confirms that no email was submitted or saved. There is no fetch, storage or provider action, no simulated email delivery or subscription confirmation. Controls are disabled before hydration and without JavaScript so native form submission cannot leak an address into the URL. The prototype has no artificial loading state. The visible preview notice remains throughout. Before real collection, the team must choose the provider and actual confirmation/unsubscribe behavior; the linked existing Privacy page is currently a legal-content placeholder. No new frequency, delivery schedule, subscriber count or subscription-policy claim is made.

Rendered checks pass at 1440/768/390/320px without horizontal overflow. Empty, malformed, corrected and Enter-submitted cases, focus behavior, no-JavaScript fallback, reduced motion and clearing on reload were verified. Observed requests during form interaction were only page-prefetch GETs; no submission POST or email payload. Privacy link opens the existing V3 page. Browser error log is empty. The independent review found no blocking issue; this does not establish user acceptance or real subscriber delivery.

Optimized build and TypeScript pass after the final field/error wrapper adjustment. Crawlability, 161-page SEO and 84-page V3 metadata checks passed for the same content before that wrapper-only change. Sixty-five protected hashes and the first five section bodies remain unchanged; the sixth section retains the app/contact CTA and adds the form panel. Docs, payout, hero, screenshot and discovery configuration are unchanged. Evidence: task outputs/doefin-v317-desktop-updates.jpg, doefin-v317-tablet-updates.jpg, doefin-v317-mobile-updates.jpg, doefin-v317-small-error.jpg and doefin-v317-mobile-complete.jpg. Local preview on port3037; no deployment, commit or Notion mutation.


## V3.18 audience, chart caption and lighter closing — 19 October 2026

User-authorized refinement keeps the six sections and existing Docs. The hero eyebrow now identifies mining operators, funds and trading desks, without another paragraph. Product-preview alt text and caption describe the captured chart's hourly order-book midpoint; historical-trade wording is removed. The closing invitation is shorter. The subscription says Get Doefin product updates, specifies new features and changes to the app, and uses an outlined action beneath the primary Open app CTA. The envelope moves alongside the heading; redundant helper copy is removed. Mobile spacing is reduced while retaining 48px controls, 16px input text, visible labels and prototype disclosure. No new subscription claims or collection mechanism.

Lead owned the homepage, scoped shared CSS, chart caption, version label, integration and QA. The subscription worker owned ProductUpdates.tsx and its CSS module. A read-only source explorer checked the chart discrepancy; an independent critic reviewed the final desktop/tablet/390/320 renders and found no blocking defect. This is internal verification, not user acceptance or comprehension testing.

At 390px the closing section measures 709.2px versus about 897px in V3.17 (about 21% shorter), and the subscription panel is 362.1px versus about 424px. Hero height stays 601.2px. The closing section measures 739.1px at 1440, 787.6px at 768 and 811.0px at 320. All four widths fit without horizontal overflow. Empty and malformed input, correction, Enter submission, neutral preview status, clearing on reload and reduced-motion transitions were checked. Interaction requests were only page-prefetch GETs; no email payload or POST. Browser error log is empty. The subscription handler is byte-identical to the V3.17 baseline.

Optimized build, TypeScript, crawlability, 161-page structural SEO checks and 84-page built V3 metadata checks pass. Sixty-four protected file hashes confirm unchanged Docs, payout, audience/FAQ components, original capture, motion and discovery files. Six sections retain their server-rendered order. Existing JSON-module experimental warnings remain. Evidence: task outputs/doefin-v318-desktop-hero.jpg, doefin-v318-desktop-product.jpg, doefin-v318-desktop-closing.jpg, doefin-v318-tablet-closing.jpg, doefin-v318-mobile-hero.jpg, doefin-v318-mobile-closing.jpg, doefin-v318-small-hero.jpg, doefin-v318-small-closing.jpg and doefin-v318-small-complete.jpg. Local production preview remains on port3037. No deployment, commit or Notion mutation.


## V3.19 separated subscription and final action — 19 October 2026

The user rejected adjacent subscription and Your next step panels and required at least one full section between them. ProductUpdates now follows the audience cards and their risk note, inside the existing fourth section. The complete FAQ is between subscription and the final app/contact action. Six sections, all wording, Docs, prototype behavior and other styling remain intact; only placement and the panel's surrounding top space change (40px desktop, 28px mobile). Independent source review found no semantic/order issue. Production renders at 1440 and 390px confirm the same reading order without horizontal overflow or browser errors. Build and TypeScript pass. Sixty-seven protected file hashes are unchanged, including subscription logic and all accepted Docs. Evidence: task outputs/doefin-v319-desktop-order.jpg and doefin-v319-mobile-order.jpg. Local preview on port3037; no external publication.


## V3.20 independent subscription section — 19 October 2026

User accepted the V3.19 reading order but rejected the visual connection between Who it is for and subscription, requesting equal section treatment. The latest request supersedes retaining six sections by nesting subscription inside audience. The page now has seven named sections: hero, product, payout, audience, subscription, FAQ, final app/contact action. Original section copy and order remain intact. ProductUpdates is now a sibling section with a stable H2, shared gutters, shared heading scale and 90px desktop / 48px mobile section padding. A separate full-width background and top divider establish the boundary; the nested card shell is removed. The small Stay informed eyebrow reuses the decorative envelope. The outlined Subscribe action remains subordinate to Open app.

Strict V3.19 assessment: order 8.5/10, mobile flow 7.5/10, subscription independence 4/10. Those are heuristic review scores, not measured user results. The mobile render showed audience cards, risk note and subscription inside one uninterrupted background, so the prior source-only approval did not establish perceptual separation. An independent rendered review now finds the audience/subscription/FAQ boundaries clear on mobile and desktop. Mobile page height increases by about 96px at 390px; the new band is 486px high, with readable 48px controls and 16px input text. No claim that the whole landing is now compact or user-tested.

Verified rendered layouts at 1440/768/390/320px with no horizontal overflow. Form label references the unique H2; empty validation and Enter-submitted neutral completion work. Handler logic remains byte-identical; no subscription service or persistence was added. Sixty-five protected hashes confirm unchanged Docs, payout, original capture, motion and discovery files. Original six section bodies are preserved except extracting the form from audience. Build, TypeScript, crawlability and 161-page SEO checks pass; browser error log is empty. Evidence: task outputs/doefin-v320-{desktop,mobile,tablet,small}-subscription.jpg. Local preview on port 3037, version V3.20. No external deployment, commit or Notion update.

Reference boundaries: W3C heading guidance supports organizing sections with headings (https://www.w3.org/WAI/tutorials/page-structure/headings/). Google Search AI guidance says ordinary SEO practices, indexability, accessible text and internal links remain relevant; no extra AI file or schema is required (https://developers.google.com/search/docs/appearance/ai-features). These support the retained Docs architecture and semantic section structure, not a guarantee of ranking or AI citations. V3 remains an intentionally noindex prototype.

## V3.21 mobile preview and payout refinement — 19 October 2026

User approved V3.20 and authorized a clearer mobile product preview, a more compact payout section and final QA. Approved colors, seven-section order, independent subscription design and accepted Docs are protected. Subscription remains a local form prototype. Lead owns ProductPreview, its scoped CSS, version label, integration and QA; the payout worker owns MarketExample and its CSS; an independent reviewer checks the final rendered evidence.

Below 768px the product preview displays the captured market question and 68% YES value as readable HTML, followed by a magnified October detail from the original screenshot. The plot uses unchanged image pixels with explicit axes and dates. App capture summary, In this capture, October detail and the dated Not live disclosure distinguish this presentation from a live quote. The full screenshot remains available. Desktop retains its existing screenshot composition. No generated chart values, new image asset, dependency or interaction is introduced.

Payout retains the same illustrative whole-position totals, both visible YES outcomes, gross payout versus profit/loss, measurement block, inclusive threshold, redemption and fees. Mobile places the position and purchase cost together, shortens repeated wording and tightens spacing without reducing material labels below 13px. Green profit and red-orange loss remain unchanged. At 390px the payout section decreases from 992.7px to 874.9px; at 320px from 1037.9px to 918.1px. The clearer product preview is taller. Combined product/payout height increases only 17.8px at 390px and 5.2px at 320px; this is a readability improvement, not a claim that the whole landing is shorter.

### V3.21 verification and handoff

Final renders at 1440/768/390/320px have no horizontal overflow. Independent inspection of all eight product/payout renders found no blocking clipping, ambiguity or layout defects. One H1, seven sections in the approved order, unique IDs, valid fragment targets and loaded images were verified in the browser. Mobile menu Enter/Escape and focus return, FAQ keyboard disclosure, settlement-guide navigation, reduced motion, and readable no-JavaScript content pass. The unchanged subscription has 16px input text and 48px controls; empty/malformed feedback, correction, Enter completion, disabled no-JavaScript fallback and clearing on reload pass. Valid prototype submission produces neutral feedback with no network request or address in the URL.

Optimized build, TypeScript, crawlability, 161-page structural SEO checks, 84-page built V3 metadata checks and 33 route cases pass. The final browser reload reported no failed requests or error logs. Sixty-six protected file hashes remain unchanged, covering shared styling, section order, subscription, Docs, source image, motion and discovery. Evidence is saved in task outputs/doefin-v321-{desktop,tablet,mobile,small}-{product,payout}.jpg and doefin-v321-layout-metrics.json.

These are local production-build checks and internal visual review; real-device coverage, user comprehension, production Core Web Vitals and live subscription delivery are not established. No external deployment, commit, Notion update or provider integration. Local preview remains on port 3037 with label V3.21.

## V3.22 probability and purchase clarity — 19 October 2026

User-authorized copy refinement only. The mobile 68% label now reads Market-implied chance of YES, retaining In this capture and the dated Not live disclosure. Mobile and desktop captions distinguish market pricing from a Doefin forecast, executable quote or Bitcoin difficulty. The original capture is unchanged.

The payout is labeled Illustrative purchase and Example position, with Separate from the chart beside the purchase. Its assumed 100-unit combined winning payout is explained as tokens held multiplied by the stated payout per token. All figures remain whole-position totals in the payment token, before fees. The 60 cost, 100 gross payout, 40 profit, zero losing payout and 60 loss are unchanged. No actual quantity, per-token constant, collateral asset or current quote is invented.

Lead owned the three changed TSX files and integration; a read-only specialist verified the quantity relationship against local Docs/frontend source and reviewed the final narrow-mobile/desktop renders. No blocker was identified. Both scoped stylesheets and 70 protected file hashes are unchanged, including shared colors, seven-section order, subscription design and handler, Docs, source image, motion and discovery.

Optimized build, TypeScript, crawlability, 161-page SEO and 84-page built V3 metadata checks pass. Renders at 320/390/768/1440px fit without horizontal overflow; images load, the browser error log is empty, and approved section order and prototype disclosure remain visible. The added explanation increases payout height by about 45px on mobile; desktop height is unchanged. Evidence: task outputs/doefin-v322-{small,mobile,tablet,desktop}-{product,payout}.jpg and doefin-v322-layout-metrics.json. This is local rendered QA, not user-comprehension testing. Preview remains on port 3037, V3.22; no publication or provider integration.

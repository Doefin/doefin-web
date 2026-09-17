# Doefin website review — 17 September 2026

The existing Next.js site is a useful foundation. Its strongest assets are open educational content, calculators, worked examples, and visible methodology. Its main weakness is that these pieces do not yet form a complete, credible journey into the product. A CMS will improve publishing, but it will not resolve positioning, unsupported claims, incomplete onboarding, or nonfunctional subscriptions.

Recommendation: keep the frontend, clarify the product and audience promise, complete one useful journey end to end, and choose the CMS by testing a real editorial workflow. Payload and Sanity are the leading candidates for this stack; WordPress remains viable when editorial familiarity outweighs integration and operating costs.

**Scope and evidence**

Reviewed all 29 page route templates, the content records, shared components, content graph, metadata, calculators, and repository checks. Inspected the running homepage and hosting calculator in Chrome, including a reproducible invalid result. Built 64 public HTML pages and crawled all 63 sitemap URLs locally. Reviewed the adjacent trading application's package manifest and documentation inventory, plus backend dependency manifests, to ground the stack assessment.

This is an implementation and editorial review of the local prototype, not a measurement of the deployed site's traffic or conversion rate. No production analytics, customer interviews, or independent underlying research dataset was available. Full mobile visual/accessibility and performance validation remain outstanding: browser automation became unreliable during responsive inspection. Responsive findings below that are based on code are identified accordingly. No application behavior was changed.

The working commercial assumption is that the website should attract suitable mining operators and institutional users, with research subscriptions as a supporting relationship. If growing a standalone research audience is the first-launch objective, the current homepage emphasis becomes more appropriate.

**1. Marketing and the visitor journey**

The homepage explains an approach to forecasting before it explains Doefin. Its hero, “Every difficulty forecast is a bare number. We publish the error bar,” establishes a research differentiator, but leaves a new visitor to discover the product category and audience further down the page. The first two actions lead to a forecast and research. The prominent “Open app” control has little product context around it.

Keep uncertainty and reproducibility as proof. Lead with the user's problem and explain how the publication, tools, and trading venue relate. Bring the miner/institution paths closer to the opening. A short product explanation or annotated interface image would do more here than another general content card.

Proposed journeys, using existing routes where possible:

| Visitor need | Useful entry | Practical next step | Decision or ongoing relationship |
|---|---|---|---|
| Understand mining difficulty | Academy or glossary | Worked example, then difficulty exposure calculator | Settlement explanation; research updates if useful |
| Assess an operation's exposure | Miner page or difficulty article | Calculator with the visitor's inputs | Product mechanics and suitability information, then app |
| Compare hosting offers | Hosting guide/calculator | Compare contract scenarios; payback or exposure analysis when relevant | Continue with the relevant mining-economics content |
| Evaluate Doefin as a venue | Institution page | Settlement, collateral, fees, risks, market mechanics | App and the configured human contact |
| Learn to use the product | Documentation | Wallet, collateral, order, position, redemption tutorials | Relevant destination inside the app |
| Track the research | Forecast, scoreboard, report | Inspect actual evidence and history | Working research subscription |

The current site has 27 onward-navigation bands, 19 subscription placements, and four app-CTA placements across its route templates. There are no unintended route-level navigation dead ends. The problem is relevance and fulfillment:

- `content/graph.ts:41` derives related posts, academy articles, and reports. It does not select tools, tool guides, or product docs. Add an explicit practical-next-step relationship so an article can lead to its matching calculator while retaining related reading.
- `app/for/miners/page.tsx:89` says to size exposure but sends the primary onward buttons to a lesson and the forecast. Link directly to `/tools/difficulty-exposure`.
- `app/tools/[tool]/page.tsx:95` places the app action after examples, FAQ, and related links. Move the relevant action beside the result.
- The same “Hedge what you just measured” pitch appears for hosting cost, payback, and difficulty exposure. Those quantities are different. The published product docs describe settlement on difficulty. Hosting and payback should lead to the appropriate next analysis; exposure can lead to product mechanics and the app.
- `content/docs.ts:41` contains ten unavailable documents. Two short published documents cannot yet support the complete decision/onboarding journey. Existing MDX documentation in `../doefin-frontend/app/docs/` is a practical starting point, subject to checking it against the current product.

Keep educational pages useful without requiring an email. Use contextual links at the point where the reader needs a calculation. Avoid treating all page visits as readiness to trade. The existing local funnel instructions are helpful design intent, but several counts and legal-policy comments are stale; reconcile them with the current product before using them as release rules.

**2. Design and showcasing tutorials, tools, and articles**

The observed presentation is consistent: strong typography, restrained colors, predictable panels, and clear result figures. Preserve those foundations. Presets, collapsed input help, readable tables, and a separate long tool guide are especially useful.

The site needs clearer differences between content formats. Today there are two blog posts, three academy lessons, one report, three tool guides, nineteen glossary entries, and two published product documents. Six equal top-level categories make that small corpus feel more fragmented than it needs to be.

Suggested navigation structure to test: **Product**, **Tools**, **Data & research**, **Learn**, plus a clearly labelled **Trading app** destination. Keep existing URLs; navigation grouping does not require changing them. Tutorials, glossary, and product docs can remain distinct destinations within Learn. Add search when the actual tutorial/document corpus makes it useful, rather than launching many sparse filters.

For tutorials, provide a clear outcome, prerequisites, ordered steps, annotated screenshots, an example result, and a next task. Cards should show whether an item is a concept explanation, walkthrough, calculator guide, or research report. Use reading time/level where it helps selection. Do not add stock imagery simply to make articles look richer; diagrams and product screenshots should explain something.

The general article model at `content/types.ts:23` supports only strings and headings. It cannot author images, captions, videos/transcripts, lists, code samples, embedded tables, or inline rich links. Dedicated tool-guide templates have more structure, but a scalable tutorial library needs reusable content blocks.

Source-based responsive findings: `ToolShell` stacks inputs above results below the `lg` breakpoint. A visitor adjusting six sliders can lose sight of the answer. Test a compact sticky result or a clear “View result” control on phones. Sliders need paired numeric inputs for precise professional use; some current guides tell visitors to modify the URL to enter missing assumptions or work around slider limits. Put those inputs in the interface. Recheck small secondary text, focus states, range-control value announcements, and horizontally scrolling tables on real mobile layouts.

**3. Copy and content credibility**

The voice has useful specificity, but too much of it judges other publishers or explains the site's internal strategy. “Honestly,” “no incumbent can,” “every estimator,” and “never” are repeated more often than the supporting evidence warrants. Concrete statements with dates and scope will be more persuasive to an audience expected to check the arithmetic.

| Current copy or behavior | Recommended direction |
|---|---|
| “Every difficulty forecast is a bare number.” | “Understand how Bitcoin difficulty changes your mining revenue.” Keep an evidence-backed uncertainty claim beneath it. |
| “No incumbent can publish a league table they appear in.” | “Compare the estimators included in our study, including Doefin, using the same scoring method.” Use only once the study is available. |
| “Hedge what you just measured” on every calculator | For exposure: “See how difficulty contracts settle.” For hosting: “Compare another contract.” For payback: “Explore your difficulty exposure.” |
| “One field, and it is the difference between a subscriber count and knowing who is actually reading.” | “Choose your role so we can make the updates more relevant.” Make the field optional unless needed for a defined purpose. |
| Documentation “published here … so it can be found by search” | “Learn how to fund an account, place orders, and manage positions.” Publish the corresponding instructions. |
| “Cheaper power or a lower price paid is the only fix.” | “Under these assumptions, the fleet does not recover its cost within the modelled period.” |
| “We have sent a confirmation link” in an unwired preview | “Preview complete — no subscription was created.” Use the email claim only after successful delivery initiation. |

A possible homepage opening, subject to the confirmed launch objective:

> **Understand how Bitcoin difficulty changes your mining revenue.**
>
> Explore mining economics, test scenarios with your own numbers, and learn how Doefin's difficulty markets work. Research and tools for mining operators, funds, and trading desks.
>
> **Calculate your exposure** · **How Doefin works**

For a research-led launch, use a more focused opening such as “Bitcoin difficulty forecasts with the uncertainty in view,” once forecasts are actually published. Prototype pages should call the forecast a preview consistently.

The most serious credibility issues are concrete:

1. **Claims marked measured lack checkable evidence.** `content/research.ts:21` publishes 4.67 pp, 3.0 pp, and 0 of 4 as measured figures. Its source records at lines 44–46 have labels but no URLs. The linked methodology contains a short description, not the study inputs, observations, estimator captures, calculation code, and scoring results. This does not establish the figures are false; it means the visitor cannot verify them as promised. Attach the evidence or classify/withhold the claims appropriately.
2. **A report is mostly assertions.** The flagship report has four short body paragraphs plus findings and FAQs. A publishable study needs named sources, observation dates/heights, sample size, scoring definitions, raw or downloadable results, and limitations. Repeating a number in a key-figure card and FAQ does not supply independent support.
3. **Illustrative status is inconsistent across content.** Sample-data panels carry badges, which is good. Other pages assert that forecasts are published to an immutable archive and that data is freely available, while the homepage says no forecast is published and Resources lists planned endpoints. Make prototype versus operational status consistent across body copy, metadata, structured data, and feeds.
4. **Promises cannot yet be fulfilled.** Research copy promises an emailed report/data pack without a delivery implementation. The newsletter's “no partner offers” promise should also be reconciled with the form's mention of recommending other publications.
5. **Model limits need to be visible beside the result.** The payback model uses a fixed subsidy for 48 months. The guide and collapsed caveats explicitly disclose the omitted halving, so this is not an undisclosed code assumption. However, the headline payback result still invites more confidence than the model supports. Incorporate the relevant subsidy schedule or foreground this as a deliberately simplified scenario. Replace finite-horizon conclusions such as “never” with the actual model horizon.
6. **Some factual statements need narrower framing.** Claims that fees are below 1%, theoretical bands are always two to three times too narrow, or a small difficulty move is below the size worth hedging need dated evidence and assumptions. The 2,015-interval discussion should clearly distinguish elapsed intervals from the protocol target timespan; Bitcoin Core makes that distinction in its [retarget implementation](https://github.com/bitcoin/bitcoin/blob/master/src/pow.cpp).
7. **Trust pages are unfinished.** Terms and Privacy explicitly say they await drafting. The About FAQ asks whether Doefin is regulated but answers with registration location and audience. Supply a direct, verified answer to the question. Add real team/reviewer credentials and external profiles where available; do not invent analysts or social proof. The existing organization author is a legitimate starting point, but its visible byline is not linked to its profile.

**4. Implementation findings and verification**

The frontend is Next.js 16.3.3, React 19, TypeScript, Tailwind 3, and Recharts. Its server-rendered pages, canonical metadata, generated feeds, article headings, source components, and HTML counterparts to charts are good foundations. The adjacent trading frontend uses Next.js 14 and React 18; the backend manifests show Python/FastAPI and PostgreSQL. These are related technology choices, not interchangeable framework versions.

| Priority | Finding and evidence | Action |
|---|---|---|
| Before public acquisition | `Subscribe.tsx:47–60` reports email delivery after only setting local React state. | Implement the selected subscription workflow with success/error handling, or keep an honest noncollecting preview. |
| Before relying on calculators | Hosting rate zero is allowed and divides by zero at `HostingCalculator.tsx:59`. Chrome reproduced “NaN%” at `/tools/hosting-effective-rate?rate=0`. | Handle zero explicitly and test actual model boundaries. |
| Before relying on shared scenarios | `toolkit.tsx:208` accepts any numeric URL value except NaN, including Infinity, negatives and out-of-range values. `months` also controls the payback loop. | Validate finite numbers, ranges, step sizes, horizon bounds and cross-field constraints. Reuse the same rules for controls and URLs. |
| Before measuring the funnel | `toolkit.tsx:220–225` rebuilds the query using only calculator keys, removing campaign parameters and anchors. | Preserve approved attribution parameters/anchors while updating scenario inputs. |
| Before measuring the funnel | `next.config.mjs` has a PostHog proxy, but no analytics initialization/events exist in this website. | Add a deliberately scoped measurement plan and working implementation. A proxy alone records nothing. |
| Before CMS integration | Content functions are synchronous; routes use `dynamicParams = false`; landing and methodology copy also lives in JSX. | Implement an actual content adapter and publishing strategy. New slugs otherwise need a rebuild; this is not a one-file swap. |
| Before CMS integration | `lib/seo.ts:84` serializes JSON-LD directly into a script without escaping `<`. | Safely serialize CMS-authored text before it reaches this sink. This is an integration risk, not evidence of an existing attack. See [Next.js JSON-LD guidance](https://nextjs.org/docs/app/guides/json-ld). |
| Quality gate | `npm run lint` invokes removed `next lint` and fails. | Configure ESLint or another explicit supported lint command. [Next.js 16 migration guidance](https://nextjs.org/docs/app/guides/upgrading/version-16). |
| Discovery | Sitemap omits `/methodology/difficulty-index`; tag archives have no page links because tags are plain labels. | Include the methodology. Link useful topic archives or defer their indexation while they duplicate single-item listings. |
| Quality gate | HTTP auditor fails to decode apostrophes and reports two visible FAQs as hidden. JSON mode also exits zero regardless of findings. | Align HTML parsing with the better build-output check; make machine-readable mode preserve meaningful failure status. |
| Content quality gate | Word-count checks include shared navigation/footer; link checks parse source strings and cover only part of the corpus. | Check main content and real rendered links. Do not equate word count or schema presence with completeness or accuracy. |

The current static approach can work with a CMS using publish-triggered rebuilds, or change to cached server fetching and revalidation. Choose deliberately, including draft preview, new slugs, removed content, redirects, sitemap/feed refresh, and failure recovery. Next.js documents the behavior of non-generated paths under [`dynamicParams = false`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params).

Verification results:

- Production build passed with `npm run build -- --webpack`; generated 64 public HTML pages. The default Turbopack attempts hit environment restrictions involving font access and process port binding, so they do not establish a production code failure.
- TypeScript passed after the completed build. An initial concurrent typecheck/build encountered transient generated-type files; the sequential verification passed.
- `check:crawlable`: passed for its five sampled pages.
- `check:seo`: passed across all 64 generated pages.
- `check:tools`: passed. It checks microcopy/presets, not mathematical correctness or URL boundaries.
- `check:links`: zero failures, ten warnings. These are limited-corpus warnings, not proof that ten live hyperlinks are broken.
- Local HTTP crawl: all 63 sitemap URLs returned 200. One title-length advisory; two FAQ false positives were manually checked against decoded HTML and confirmed visible.
- No duplicate IDs were found in the generated public pages.
- `npm run lint`: failed because of the unsupported command.

A useful first measurement model is entry content → practical link → calculator interaction → mechanics page → app handoff → completed activation. Also track confirmed email subscription. Report conversion by audience/content cohort; do not call an app-link click an activated user. The app already declares `posthog-js`, but actual cross-property identity/activation tracking was not audited here. Avoid capturing raw emails, wallet identifiers, or confidential calculator inputs as routine content analytics.

**5. CMS choice for the existing stack**

The CMS should manage editorial content, reusable page sections, media, sources, and relationships. Calculations, live mining data, forecasts, and trading execution should remain owned by their respective application/services. Keep the content database and credentials separate from the trading database even if both use PostgreSQL.

| Option | Why it fits | Tradeoff for Doefin | When to choose it |
|---|---|---|---|
| Payload + Next.js + separate PostgreSQL database | TypeScript content schemas, Next.js integration, relationships, drafts and preview; close to the existing engineering skills | Engineering owns CMS deployment, migrations, storage, backups, permissions and upgrades | First technical candidate if the team wants control and will own operations |
| Sanity + current Next.js frontend | Managed content backend, structured content, real-time collaboration and visual preview integration | Hosted-service dependency, schema/query learning, and plan/role limits to evaluate | Prefer when editorial speed and reducing infrastructure work matter most |
| Headless WordPress + current Next.js frontend | Familiar WordPress authoring; custom content types exposed through REST | Operate PHP/WordPress as well as Next.js; implement preview, media, relationships and cache refresh across them | Choose when the actual editors already depend on WordPress |
| Traditional WordPress website | Conventional integrated publishing and theme workflow | Existing React templates/calculators need porting, custom blocks or an integration boundary; this is a larger frontend change | Choose if an independent WordPress team will own the site and the application-like tools are secondary |

These capabilities were checked against official documentation: Payload supports installation in an existing Next.js application and its current documented compatibility includes this site's Next.js version ([installation](https://payloadcms.com/docs/getting-started/installation)); PostgreSQL has a first-party adapter ([database](https://payloadcms.com/docs/database/postgres)); server-side live preview is documented ([preview](https://payloadcms.com/docs/live-preview/server)). Sanity documents its [Next.js integration](https://www.sanity.io/docs/nextjs/introduction) and [visual editing](https://www.sanity.io/docs/nextjs/visual-editing-with-next-js-app-router). WordPress exposes [custom content types through REST](https://developer.wordpress.org/rest-api/extending-the-rest-api/adding-rest-api-support-for-custom-content-types/).

My initial preference is Payload for technical ownership, with Sanity as an equally serious candidate if CMS operations would distract the team. WordPress is not inherently worse for SEO or content marketing; it has less direct reuse of this particular application. A final selection requires knowing who publishes, their existing editor experience, required approvals, localization, and the hosting/support budget. No subscription-price comparison or deployment proof of concept has been performed.

Use one short authoring trial to decide: a nondeveloper creates a tutorial with screenshots and ordered steps, relates it to a glossary term and calculator, previews it, gets it reviewed, publishes it, changes its URL with a redirect, and restores a previous version. Verify the chosen plan/configuration supports the required roles. This is more informative than comparing plugin counts.

Minimum content model:

- A shared article model with kind (lesson/note), title, summary, audience, level, topic, rich blocks, author, reviewer, dates, explicit practical next step, and SEO fields.
- Reports with findings, evidence references, dated key figures, limitations, dataset/download assets and version history.
- Glossary terms and product documentation, each with related items and a clear publication state.
- Media with alt text, captions, attribution, and optional video transcripts.
- Approved landing-page sections and global navigation/settings, so routine marketing edits do not require JSX changes.
- Tools represented by descriptive content and relationships in the CMS; formulas and validated input specifications stay in code.

Do not build a course platform, personalization engine, or broad content taxonomy merely to launch the first useful tutorials.

**6. Recommended sequence**

1. Agree on the primary audience and first-launch outcome. Revise the homepage promise and show the connection to the product.
2. Resolve trust and functionality gaps: evidence for measured claims, consistent prototype status, truthful forms/deliverables, calculator validation and model framing, and actual Terms/Privacy content.
3. Complete a miner journey and a product-onboarding journey using the existing routes. Add practical article-to-tool links and contextual result actions.
4. Trial Payload and/or Sanity with one real tutorial and one report; include WordPress if editor familiarity makes it a serious contender. Select based on the demonstrated workflow and ownership cost.
5. Migrate content into the chosen model, connect publishing/preview/revalidation and email fulfillment, fix the quality checks, and measure the two journeys.

The next design investment should make the product understandable and the content actionable. More pages and a new CMS should follow that clarity.

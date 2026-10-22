# V3 resource discovery refinement

Date: 22 October 2026. Mode: refine the existing V3, not a new visual direction.

## Purpose

Help a reader reach mining education, calculators and research examples from the product introduction. Preserve the seven-section homepage, existing palette/type/assets, Docs content, V1/V2/V4 and honest prototype disclosures.

## Direct discovery revision — user approved

The user found an umbrella Resources entry insufficient: tools, glossary, articles and Academy were still too easy to miss. Approved scope now replaces the homepage's preview-only updates section with concrete Tools and learning entries, while retaining seven sections. The earlier constraint preserving that section is superseded for this revision.

- Main navigation becomes How it works, Tools, Learn disclosure, Docs and Open app. About remains in the footer; Resources remains the full directory.
- Desktop Learn opens direct links with short descriptions: Academy, Articles, Mining glossary and Research examples. Support click, keyboard Tab/Enter/Escape, focus leaving and outside-click dismissal. Mobile exposes these destinations directly when navigation opens, without a nested disclosure.
- The homepage features the exposure calculator, difficulty-adjustment guide and mining glossary, plus direct article/research links.
- Inline difficulty links to its definition; the miner audience path adds a calculator action; the market screenshot links to prices/probability Docs. Do not link the market-price chart as though it were a network-hashrate chart.
- This is a refinement of the existing visual system. No live service, legal copy, public indexing, V1/V2/V4 or trading behavior changes.

## Design contract

- The current live V3 is the accepted visual baseline; the rationale deck is strategic context, not approval of a replacement design.
- Add one Resources navigation item on desktop/mobile and a useful footer library group. Highlight Resources while browsing its families.
- Organize the server-rendered resource hub around three tasks: understand the market, compare mining scenarios, and prepare a review. Follow with calculators, education/articles, definitions and explicitly synthetic research/data examples.
- Use the existing Manrope, dark surfaces, pale-blue links, 22px panels and thin borders. Larger task panels introduce the paths; compact editorial rows expose the content without repeating large cards for everything.
- Keep sections stacked and jump links wrapping at 320px; all links need visible focus and usable target sizes. No new animation or hidden primary content.
- Connect Learn and Docs to the full library, the miner journey to its scenario brief, and the institutional journey to concrete review questions.
- Standardize the chrome preview label to V3; do not imply that historical page-specific labels identify separate releases.

## Boundaries

No connected signup/alerts/data feed/CRM, claims of measured research or forecasting accuracy, legal publication, analytics collection, domain/indexing migration or trading actions. The direct-discovery revision removes the preview-only signup from the homepage; it introduces no subscription service.

## Ownership and verification

Lead owns implementation and integration. The existing V3 inspection subagent will independently critique the exact desktop/mobile renders after implementation; it makes no changes. Check build, TypeScript, crawlability, SEO and V3 route metadata/links, plus navigation, keyboard dismissal, representative audience paths and 320/390/768/1440px rendering. No conversion or user-comprehension claim follows from these checks.

## First refinement verification (before direct discovery)

- Production build and explicit TypeScript check passed. Crawlability passed for all 15 sampled pages; structural SEO passed across 162 rendered pages. V3 route/mapping checks and metadata checks passed across all 84 built V3 HTML pages.
- Existing 33 versioned-path cases, 18 scenario checks including 128 boundary combinations, and tool microcopy checks passed. Content links had zero failures and ten existing editorial warnings.
- New Resources renders at 320/390/768/1440px passed overflow, heading, fragment, image, browser-error, no-JavaScript and reduced-motion checks. The unchanged landing composition also had no overflow/errors at those widths. Its generic image scan flags the intentionally hidden lazy alternate of the responsive capture; separate checks confirmed every visible image loaded at all four widths.
- Keyboard open/Escape/focus return, Resources navigation/menu dismissal, sticky-header anchor clearance, all 25 unique resource destinations/fragments, and library connections in Docs/Learn/miner pages passed. The institutional card reaches its visible review checklist. V2's original library links and new-tab behavior remain intact.
- Independent rendered critique inspected desktop and narrow-mobile captures plus Learn/checklist states and found no consequential craft or UX issue. This is focused prototype review, not accessibility certification or measured user acceptance.
- Local production preview: `npm run start -- --hostname 127.0.0.1 --port 3046`, then `/v3` or `/v3/resources`. This refinement has not been published to Vercel.

## Direct-discovery verification

- Final production build and explicit TypeScript passed. Crawlability covered 15 sample pages, structural SEO 162 rendered pages, and V3 metadata/routing all 84 V3 HTML pages plus 68 reused mappings.
- Keyboard Enter/Tab/Escape, focus return, outside-click and focus-leave dismissal passed for the desktop Learn disclosure. Each of its four content destinations navigated directly and closed the disclosure.
- Mobile exposes all four learning destinations directly. Escape/focus return, link dismissal, menu scrolling at 320×480 and reset across the desktop/mobile breakpoint passed.
- At 320/390/768/1024/1440px, the homepage retained seven sections, one H1, no document overflow and no running animations with reduced motion. Every visible image loaded; the desktop disclosure stayed within the viewport.
- Featured calculator, Academy, glossary, article and research destinations returned HTTP 200. Contextual definition, calculator and market-price guide links were checked. Featured content and links remained visible without JavaScript. No browser page errors occurred in these journeys.
- Captures and interaction results are in the calling chat's outputs/v3-direct-discovery directory. Section-only captures hide the sticky header during capture to avoid an element-screenshot artifact; full-page/viewport captures retain the actual navigation.
- Independent review inspected desktop, 320/390px cards and the live 320px homepage and found no consequential product issue. A capture-only header visibility artifact was corrected by waiting for style restoration and repaint before refreshing all viewport captures; the final interaction checks passed again.
- This is a local preview, not a Vercel deployment or measured improvement in discovery/conversion.

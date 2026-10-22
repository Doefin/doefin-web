# V3 audience access and desk explorer

## Scope and audience

The user rejected the text-heavy audience pages and asked to reuse the app miners planner for public miners. This piece makes both audience destinations visible from the homepage opening, navigation and footer, and gives funds and desks a distinct contract-comparison workflow. The app `/app/miners` is a historical functional reference for the other workstream; it is not a visual approval for this new composition.

## Direction

A compact desk workspace, with a list of actual contract terms beside a larger inspector. The signature is the relationship between threshold, observation block, collateral and YES/NO reference prices. This gives the visitor a concrete object to evaluate. Type scale distinguishes the contract question from metadata; price and block figures use tabular digits. Selected state uses brand blue, while gains/losses are not implied through decoration.

The alternative considered was a diligence-first editorial page. It retains the old page's chief weakness: several reading tasks before the user can inspect an actual instrument. The workspace is provisionally selected; the reading framework follows it rather than leading the page.

## Primary action and boundaries

Select a contract and outcome, then review that exact market in the app. The shared action checks availability again before navigation. Selection is stored by the shared immutable identity, never an array index. Removed selections produce an unavailable state and require an explicit new choice.

Prices are indicative reference values, not size-specific executable quotes, forecasts or probabilities. Unpriced or ambiguous markets are excluded by the shared adapter and the page discloses that exclusion. Source time is shown in UTC; unavailable, stale, loading, refresh-error and empty states are explicit. No fake market fallback, wallet connection or order execution is included.

The contract list becomes a bounded scroll area on mobile; explicit selection brings the inspector into view. The app handoff uses the new strict route and requires the coordinated app change to be deployed.

## Discovery

The homepage opening has links labeled For miners and For funds & desks. The header For you disclosure offers both, the mobile menu lists them first, and the footer repeats them. At tablet widths the complete navigation uses the mobile menu to avoid crowded links. Existing learning/resource navigation and lower homepage audience section remain.

## Review status

Production build, TypeScript, route/metadata/SEO checks and browser interactions passed at 320, 390, 640, 768, 1024 and 1440px. Independent rendered review found three miners issues; nearby validation, net outcome figures and result navigation were fixed and rechecked. Working-state renders use explicit fixtures; actual restricted-location data remains unavailable. The release handshake blocks the new app destination until the frontend supports it. No deployment or orders were performed.

## Audience controls refinement — 22 October 2026

User requested more careful colors, token chips and an improved collateral selector on both audience pages. The accepted page structure and financial behavior stay intact. Workspace surfaces now use quiet ink/surface values; a blue border and selection rail identify the active contract rather than filling all selected surfaces blue. YES and NO are neutral, explicitly labeled outcome tags. Green/red remain reserved for known positive/negative net results; zero and unknown results remain neutral.

A shared currency chip pairs a readable symbol with a small typographic identifier (₿, cb, $ or a generic initial). These are intentionally typographic badges, not invented official token logos; no matching token assets were present in the website's public assets. Chips appear in contract lists, collateral filters, inspector headings and numerical summaries. Long symbols truncate visually inside the chip while retaining their complete accessible text.

The collateral filter now uses a controlled portal listbox, with token-chip options, a selected check, keyboard arrows/Home/End, Enter/Space selection, Escape/Tab dismissal and outside-pointer dismissal. Focus stays on the combobox trigger. The menu is bounded to the available viewport space and avoids clipping by the explorer. Refresh disables it. A removed collateral value remains visible as unavailable until the user explicitly chooses another value; no replacement contract or filter is selected automatically. Production build and built route/metadata checks pass. Rendered fixture checks pass at 320–1440px, including first-open menu anchoring, keyboard selection/dismissal, long symbols and lists, refresh/removal states, and retained market selection when choosing the current collateral. Filled action labels measure 5.44:1 contrast. No browser errors or mutation requests were observed; working states use explicit fixture data.

# Newsletter readability refinement, 6 Nov 2026

Codex editorial pass for Fardin to read. Source changes are complete and frozen for independent review. Build, served HTML and desktop/mobile browser verification belong to the parent task.

## Reader task and structure

The reader can inspect historical findings and obtain the public report or CSV without providing an email address. Trying the local preferences demo is optional.

| Before | After | Editorial decision |
| --- | --- | --- |
| Header explains the sample, demo and public access across two paragraphs. | One paragraph states the sample's purpose and public access. | Change: name the reader's task plainly. |
| Sample and always-open preferences form share a desktop row. | Sample comes first in a readable column. A closed native disclosure follows. | Change: defer the optional interaction. |
| A second report-and-dataset email demo repeats the email and consent fields. | Removed from this page; public report, CSV and forecast archive links follow the optional preferences demo. | Cut: one optional form and clear destinations. |
| Broad demo explanation precedes the form's own notice. | The disclosure label identifies the optional demo. The unchanged form explains its limits at the decision point. | Cut repetition, following Matteo's habit 6 and E24/E25. |

## Qualifiers and anchors retained

- Sample remains explicitly “Example email · Not sent or scheduled”. Its original historical data bindings are unchanged: 25 adjustments, 11 increases, 14 decreases and a 3.75% mean absolute change; 12 Nov 2025–16 Oct 2026; source capture 22 Oct 2026.
- Source provenance remains beside the findings: mempool.space link, fixed historical window, no live feed and no documented independent Bitcoin-node check.
- Forecast limits remain in the sample: observations do not measure forecast accuracy or predict the next adjustment; evaluation requires a prior record; the archive has no published predictions.
- The sample footer retains the distinct research-commentary limitation and its inactive unsubscribe link. Its hypothetical live-service preference-management/unsubscribe statement remains conditional. The existing short notice was retained because each sentence carries a distinct qualification.
- Shared `NewsletterForm` still supplies the demo/no-subscription/no-email/no-saved-details notice, clearing behaviour, validation, consent, privacy link, hypothetical confirmation/unsubscribe statement and preview outcome. `NewsletterForm.tsx` and `NewsletterDelivery.tsx` match HEAD byte for byte. Other pages retain their delivery demos.
- `#sample-issue` remains on the sample. `#signup` now targets the disclosure's always-visible, keyboard-operable summary. `#preferences-title` is its visible heading. Incoming signup links reach the control that reveals the form rather than hidden content.
- Public report, CSV and forecast archive destinations remain unchanged. The form's `/privacy` and sample return links remain unchanged. Existing metadata and indexing policy are unchanged.

No subscription service, publishing cadence, delivery promise, backend or CMS change was introduced. No seed or vendored brand file was changed.

## Evidence

- `node scripts/check-newsletter.mjs`: 49 total checks passed, including delivery validation and concise-brief completeness/escaping. This is source-contract evidence, not a browser or email-delivery test.
- `node scripts/check-p1-journey.mjs --source-only`: passed, including 1 incoming homepage fragment target and 8 distinct literal destinations. This checks broader navigation source only.
- Focused source assertions verified ordering, visible summary anchor, one `NewsletterForm`, absence of page-level `NewsletterDelivery`, retained destinations and exact historical figures. TypeScript transpilation reported no syntax errors. Shared components were compared directly with HEAD.
- `npm run check:brand`: vendored brand v0.2.0 (`936bc5c`) intact; 0 CUT, 0 CHECK and 0 STYLE.
- Extracted page prose checked with the brand's Python checker, web channel: 0 CUT, 0 CHECK and 0 STYLE. Historical figures were independently resolved from the unchanged local capture and summary function. No contextual CHECK passage needs escalation; the necessary historical, forecast and research-commentary qualifications remain.
- No new product, settlement, collateral, performance, financial-example or eligibility claim was drafted. The public-access statement restates existing page behaviour. Fardin's editorial reading and the parent's independent/browser review remain separate from these automated checks.

## Design evidence

[NN/G progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) recommends deferring secondary features and making the route to them obvious. Applied here: keep the sample and public destinations available, label the optional preference disclosure clearly and put incoming fragment targets on its visible control.

[GOV.UK user needs guidance](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/identify-user-needs/) starts with the reader's task and recognisable language. Applied here: lead with reading findings and obtaining public data; avoid making an email demo a prerequisite.

Next.js's installed Link guide was consulted for fragment navigation. Native disclosure keeps the existing client form mounted in the served page without adding page-level state or a hidden fragment target.

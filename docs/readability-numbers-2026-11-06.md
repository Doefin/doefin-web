# Data number readability, 6 November 2026

The current and estimated difficulty figures now use trillions, and hashrate windows use readable EH/s. Both the server panels and browser recovery panels use the same formatter. Exact values remain in native `details` elements.

## Before and after

These are test fixtures representing the live format problem, not a new network observation.

| Figure | Previous primary text | New primary text |
| --- | --- | --- |
| Current difficulty | `148364561003867.4` | `~148.36T` |
| Estimated next difficulty | `143809999999999.9` | `~143.81T` |
| Hashrate | `1039.876543210123456789123456789012345678 EH/s` | `~1,039.88 EH/s` |
| Estimated difficulty change | `-3.071235%` | `~−3.07%` |

Each exact disclosure repeats the source block and its timestamp or response time. Hashrate rows retain their averaging window, original H/s string and exact EH/s conversion. Difficulty retains the original numeric values, source ratio and existing ratio × 100 result. Source status, freshness checks, unknown source age, estimate labels and unavailable forecast range remain in place.

## Presentation policy

- Display up to two decimal places in T, EH/s and percentage units. Remove trailing fractional zeroes. Group thousands with commas. Do not insert a space before T.
- Prefix `~` only when nonzero digits were discarded. Round halfway values away from zero. This marker describes presentation rounding, not the reliability of the estimate.
- Display zero without a sign. Normalise negative zero. Keep nonzero values below 0.01 visible using two significant digits; values below 0.000001 use scientific notation. For example, `0.000012` stays exact, `0.000012345` becomes `~0.000012`, and `0.000000012345` becomes `~1.2e−8`.
- Reject malformed or unavailable values. Difficulty and hashrate reject negative nonzero values; percentage changes retain their sign. No substitute data is introduced.
- Decimal strings use decimal point shifts and digit rounding. Their coefficient length is unrestricted by this helper. Exponents are bounded to ±1,000 to bound expansion, wider than the unchanged API contract's ±100 limit.

The narrow helper leaves `lib/format.ts` and all its existing callers unchanged. API contracts, fetches, parsers, fallback effects, abort handling and freshness logic are unchanged. Numeric difficulty fields are already JavaScript numbers when supplied to these components. The exact disclosure preserves `String(sourceNumber)`; it cannot recover precision or lexical formatting lost before the component received that number. Hashrate strings retain all original digits.

## Evidence and limits

`node scripts/check-readable-numbers.mjs` passes 86 numeric cases, plus React server markup checks for both the normal server panels and the browser recovery render. It checks rounding boundaries, carries, trailing zeroes, scientific input, long coefficients and decimal tails, tiny and negative values, malformed values, exact disclosure labels and source context, immutable fixture objects, failure states, missing windows and freshness branches.

`node scripts/check-bitcoin-analytics.mjs` passes the existing analytics conversion, contract and browser request regressions. The recovery rendering check injects hook state and skips effects; the existing analytics regression verifies request/parser outcomes. These checks do not claim a live browser request or production deployment.

The extracted rendered final prose passed the Python checker with 0 CUT and 0 STYLE. One CHECK remains in the existing browser recovery sentence: “Forecast range: unavailable; this endpoint returns a point estimate only.” Here “returns” describes an API response, not financial returns. The repository brand check also passes with 0 CUT and 0 STYLE. Its CHECK in `V3Scoreboard.tsx` is outside this package.

Build, global typecheck, responsive browser checks and live endpoint verification belong to the integrating parent task. No CMS data, migration seeds, vendored brand files, endpoints or provider assumptions were changed.

## Research basis

[ONS rounding guidance](https://service-manual.ons.gov.uk/content/numbers/rounding) recommends choosing precision for the intended use, retaining detail in the data, and adjusting precision when small values would disappear. Two decimals in these displayed units retain useful differences while shortening the primary reading.

The [GOV.UK data style guide](https://www.ethnicity-facts-figures.service.gov.uk/style-guide/data-style-guide/) supports comma grouping, explaining differences between rounded displays and exact data, and distinguishing small positive values from zero. Its whole-number or one-decimal rule of thumb concerns its statistical publishing context; it does not establish a universal decimal limit for Bitcoin difficulty and hashrate.

[NN/g progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) supports placing secondary detail behind a clearly labelled control. Native `details` keeps the exact source text in server HTML without requiring JavaScript to reveal it. Browser recovery data still appears only after the existing client request; an unavailable server response remains explicit.

## Parent browser finding

A forced server-failure run recovered successfully from the public API in Chrome. The old global “data service unavailable/no source values shown” text remained above the recovered values. Parent scoped the failure badge/headings/messages explicitly to the server request, keeping HTTP categories and state logic unchanged. The browser success statement and real source values remain distinct. Independent recheck and final build are recorded in the integration report.

# Independent plain-language review, 6 Nov 2026

The revised copy is materially clearer. It generally explains the subject instead
of giving the reader a list of instructions to review it. I found no major factual
regression introduced by the proposed rewrites. One minor search-description
inaccuracy was corrected during review. Six explicit factual-clarity proposals
now address the inherited glossary claims identified below. Protected interval
terminology still has a stated scope limit; this is not blanket fact certification.

This is a Codex editorial judgement, not human sign-off, publication approval or a
runtime result. The parent still owns build checks, rendered desktop/mobile
reading, current Studio draft-state checks and any authorised CMS application.

## Evidence and method

Read `CLAUDE.md`, the `doefin-humanise` skill, the brand instructions, Matteo's
thinking and relevant actual edits, voice, compliance, website, content-type,
decision and voice-editor guidance. The pinned brand is v0.2.0,
`936bc5c25899ee237bb5a4ecaae54bc192038cf4`.

Compared source changes with `10c516b`, the merged `origin/main` baseline. Read
before/after CMS rows and reconstructed the complete proposed research documents,
articles, task docs, calculator guides and glossary entries in memory from the raw
published documents. Kept neighbouring sections and unchanged qualifications in
the reading. Used the 84-page live HTML snapshot to identify the existing page
context, rather than treating the old migration seeds as current CMS content.

Independently resolved every proposed keyed path against
`work/brand-copy-validation/plain-language-raw-published-2026-11-06.json`:

| Plan | Rows | Before-value mismatches |
| --- | ---: | ---: |
| Research | 25 | 0 |
| Articles and Academy | 33 | 0 |
| Tools | 45 | 0 |
| Docs | 26 | 0 |
| Glossary | 10 | 0 |

The initial 133 rows all matched. The final focused recheck also independently
matched all six appended glossary rows, bringing the total to 139. None targets a
short definition, Block subsidy or About. The six are separately labelled factual
clarifications for Matteo rather than routine humanisation.

The raw response contains 53 published documents and no draft IDs. These matches
prove that the proposals fit the saved published baseline. They do not establish
the current draft contents, lack of active editing, application or publication.
The query-shaped fixture and per-worker fresh baselines are separate evidence;
none is a reason to overwrite a later Studio edit.

`git diff --check 10c516b` passed during this review. No browser, CMS write, commit
or push was performed. I did not substitute worker checker scores for reading the
copy, or independently rerun the parent's shared build and browser checks.

## Category evaluation

Scores are out of 10 in the order clarity, natural phrasing, flow, economy and
useful specificity. They describe the reviewed copy, not its authorship.

| Category | Editorial verdict | Scores | Evidence and remaining limit |
| --- | --- | --- | --- |
| Research and data | Accept wording | 8.7 / 8.5 / 8.4 / 8.2 / 9.0 | “Where the data comes from” and “How the changes were calculated” identify what the reader gets. “Size of the gap” correctly explains absolute error. The observed report still distinguishes sourced historical data, synthetic forecasts, zero archive records and independently provable publication. Technical provenance remains dense because its distinctions matter. |
| Institutions | Accept wording | 8.6 / 8.5 / 8.3 / 8.2 / 8.8 | “Compare BTC production scenarios”, “Prepare a scenario brief” and “Read how trading and settlement work” replace generic review headings with distinct tasks. The explorer explains indicative pricing separately from executable size and liquidity. Internal review and product-document review remain separate sections, with some justified approval repetition. |
| Articles and Academy | Accept wording | 8.7 / 8.6 / 8.6 / 8.5 / 8.6 | The difficulty-growth article now explains why holding other inputs constant matters. The hashprice lesson names revenue, costs and units. The range lesson distinguishes point error, coverage, width and evidence. Matteo's hashrate explanation remains intact. These are concise educational pages, not invented opinion pieces. |
| Home, product and resource navigation | Accept wording; sensitive mechanics still for Matteo | 8.7 / 8.6 / 8.5 / 8.3 / 8.7 | The 1 BTC example keeps its assumptions and arithmetic. “Check the product and its risks” and “Check the data and the calculations” are more useful headings. Funding remains market-specific. Desktop/mobile screenshot captions are responsive alternatives, not duplicate body copy. |
| Calculators and guides | Accept wording; financial/mechanics context still for Matteo | 8.6 / 8.4 / 8.2 / 8.1 / 9.0 | Inputs, units, fixed assumptions and excluded costs remain. “Not reached in ... months” corrects the old suggestion of inevitable later payback. Pool fees are an equivalent comparison adjustment, not an electricity invoice. The longer guides remain necessarily detailed; several “inputs” and “assumptions” references repeat because they qualify separate outputs. |
| Task documentation | Accept wording; identified factual clarification below | 8.7 / 8.5 / 8.6 / 8.4 / 8.9 | Instructions distinguish setup, submission, fills, holdings, redemption and withdrawal. “Completing setup does not mean the order has filled” is immediately clear. Order cancellation/replacement can fail separately; funds and transaction references are not treated as confirmation. Independent task pages need their own applicable warnings. |
| Glossary | Accept the four rewrites and six explicit factual-clarity proposals | 8.6 / 8.4 / 8.3 / 8.4 / 8.5 | Pool luck explains variability by chance; hashprice explains the exchange basket. The appended proposals resolve the identified epoch, range-evidence, hashrate-band and USD-denomination issues without invented figures. Approved short definitions and Block subsidy remain untouched. Protected interval terminology remains outside correction scope. |

## Findings and resolutions

### Minor introduced issue, resolved: aliases are broader than abbreviations

`components/v3/GlossaryBrowser.tsx:39` and the visible helper at line 41 originally
changed “aliases” to “abbreviations”. The search also matches “error bar”,
“prediction interval”, “retarget period” and “network hashrate”. Those are other
names, not abbreviations. The parent changed both the accessible and visible
descriptions to “other names”. I re-read the current implementation; this resolves
the finding without changing the search, aliases or definitions.

### Summary lengths, resolved without inventing a schema limit

Editorial summaries have no schema maximum, but are sent directly to `seo()` by
`V3Editorial.tsx:39`. The SEO check uses 160 characters with a 20-character
tolerance. The earlier 161/166-character summaries were not schema failures.
The parent shortened the two Academy summaries to 146 and 143 characters. They
retain expected production/date uncertainty and the distinction between a range
and evidence of accuracy.

The observed report has a separate `seoSummary`; its earlier 211-character body
summary did not violate a 160-character CMS rule. The current 141-character body
summary is easier to scan and still calls the data a fixed snapshot and excludes
forecast-performance interpretation. The counts remain in the first section;
they were not discarded from the report. Other current article summaries are
133–155 characters. No field cap was silently applied to body paragraphs.

### Major inherited meaning issue, resolved by explicit proposal

`glossary-epoch`, `body[0]`, says that “production, forecasts and settlement all
align to epoch boundaries”. The unchanged first sentence about difficulty staying
fixed within an epoch is useful. The blanket second clause is broader than the
product/docs rule: each market specifies its own observation block. It can make a
reader assume a settlement schedule that the market has not specified.

Suggested correction grounded in the existing product documentation: keep the
first sentence, then use “An epoch groups blocks under one difficulty level. A
Doefin market uses its specified observation block; check that market’s terms.”
Treat this as a separately identified factual clarification, not a mere synonym
change or a claim that the old wording was verified. It does not require changing
the approved short definition, slug or references.

Final recheck: accepted the actual appended proposal. It keeps difficulty fixed
during an epoch, identifies epochs as useful comparison periods and directs the
reader to the market’s observation and settlement blocks. It makes no unsupported
claim that arbitrary non-boundary blocks are permitted. No required edit remains.

### Inherited evidence questions, not rewrite regressions

- `glossary-confidence-interval`, `body[1]` and `faq[_key=="faq-1"].a`: the assertion that theoretical bands are typically two to three times too narrow, and that an interval only means something once fitted, needs a stated method and evidence. A theoretical model also needs evaluation; fitting alone is not validation. Preserve the protected definition. If the numerical claim has no source, a transparent proposal is to explain that a range needs its assumptions, construction and evaluation, as the current methodology already does, without inventing replacement figures.
- `glossary-hashrate`, `faq[_key=="faq-1"].a`: the ±16% one-day and ±6% seven-day bands do not state a confidence level or construction method. The article correctly avoids turning a recent move into measured noise. Do not extend that restraint into a false claim that the glossary figures have been independently verified. Supply the method/source, or propose a non-numerical explanation that shorter windows vary more, retaining the fact that these are estimates.
- `glossary-hashprice`, `body[0]`: “Hashprice falls ... when the Bitcoin price falls” needs its USD denomination condition; the approved short definition already supplies that distinction. A separate clarification could say “USD-denominated hashprice also falls when the Bitcoin price falls, all else equal.” This is inherited, not introduced by the FAQ rewrite.

Final focused recheck: accepted all five actual appended rows addressing those
three bullets, in addition to the epoch row above:

- Confidence interval body and FAQ question/answer: both theoretical and fitted ranges need outcome testing. The question no longer presupposes that theory makes intervals too narrow. The answer reports coverage alongside width over a stated evaluation period and explains that fitting alone does not prove performance on new forecasts. The unsupported “two to three” assertion is removed, with no replacement numerical claim.
- Hashrate FAQ answer: irregular block arrivals explain fluctuation over short windows. It asks for the calculation, window, timestamp and uncertainty range. The context-free ±16%/±6% claims and “usually noise” conclusion are removed without replacing them with another unsourced band.
- Hashprice body: the BTC-price effect is explicitly limited to USD-denominated hashprice. The 10% difficulty rise, about 9.1% effect and all-else-equal qualification remain.

All six appended before-values match the saved raw published documents by exact
keyed path. They are reviewable draft proposals, not evidence that published copy
changed. No required wording correction remains in these rows. The parent should
identify the six as factual clarifications in the handoff, since removing
unsupported numerical claims goes beyond ordinary word substitution.

Residual protected scope: the Confidence interval short definition and aliases
combine confidence/prediction-interval terminology. They were not changed under
the instruction to preserve approved short definitions. This review does not
claim to have resolved that taxonomy or independently verified every retained
technical assertion in the glossary.

## Meaning and scope checks

- Production remains expected, conditional on hashrate/time/difficulty/reward assumptions, and separate from costs, profit, payout and suitable position size. The home calculation still gives 1 ÷ 1.10 ≈ 0.909 BTC and a 0.091 BTC shortfall. The calculator formulas, dynamic values and sample figures are not edited.
- Absolute-error instructions explicitly ignore direction before averaging. Signed differences cannot cancel. Percentage changes remain distinct from percentage-point errors; forecast ranges and coverage remain distinct from observed historical variation.
- Rolling hashrate estimates remain separate from difficulty-implied hashrate, machine counts, synthetic chart values and forecast ranges. Data-age, absent-range and unavailable-response qualifications remain.
- Threshold equality still belongs to Yes. Observation, resolution and redemption remain separate stages. Market-specific collateral and payouts retain full collateralisation and wrapped-token/technical risks. Full-loss, incomplete-exit, fee and hedge-limit warnings remain at the relevant points.
- The compact `ResearchArchiveSummary` is used on the observed report only. It removes a real repeat of findings/provenance already explained in that article. It retains the source/capture date, downloads, citation link, forecast-archive status and `prospective-archive` anchor. The default variant remains elsewhere. Removing the self-link to the same report is appropriate in this variant.
- No proposed row targets About, Block subsidy, a glossary `shortDef`, a slug, ID, anchor, reference or migration seed. The tracked diff has no vendor edit. Labels, routes, URLs, controls and calculations remain, apart from the expressly approved compact presentation and wording changes.

The following factual clarifications should be visible in the review record:
`docs-overview` now says that a filled buy adds shares and a filled sell reduces
them, supported by the unchanged Managing positions page; source product/docs
collateral language no longer generalises a BTC token to every market; payback
wording respects the finite simulated period; the six appended glossary rows
address the inherited issues above. These changes are supported by
existing scope/source facts, but they are more than cosmetic substitutions.

## Acceptance document status

The source and proposal work meets the editorial intent of points 1–8 in
`docs/humanise-acceptance-2026-11-06.md`, with the factual clarifications and
protected-scope limit above explicit. The category records include before/after reasons,
checker evidence and exact sensitive passages. Necessary risk repetition and
independently readable task warnings should remain; they are not filler.

Point 9 remains with the parent: combined checks, a built reading at desktop and
mobile widths, and resolution or explicit disposition of required findings. No
saved proposal, source diff, checker pass or this review proves that new text is
in Sanity drafts, published or deployed. Sensitive settlement/collateral,
financial-example, performance and legal/access passages still go to Matteo in
the established review flow.

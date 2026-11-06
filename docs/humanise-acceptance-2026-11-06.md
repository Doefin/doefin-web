# Plain-language editorial pass, 6 Nov 2026

The task is to make the website as clear, natural and easy to understand as its
subject allows. This pass starts from merged PR #8 on `origin/main` (`10c516b`).
Each content category has a separate worker assignment. The parent reviews every
result and uses an independent reviewer before accepting the combined change.

## Definition of done for every category

1. Read each passage with its heading, neighbouring sections, action and limits.
   Keep wording that already works. Rewrite the whole thought when the problem
   is its structure, rather than replacing individual words.
2. Put the reader's question or useful point first. Use concrete subjects and
   verbs, familiar words and descriptive headings. Explain specialist terms when
   the reader needs them. Every section must add a distinct point.
3. Remove repeated explanation and internal process commentary. Keep every
   distinct warning and qualification. Repetition required at a decision point
   is not automatically filler. Responsive variants are not duplicate prose.
4. Preserve facts, figures, units, dates, sources, uncertainty, example status,
   fees, losses, market conditions and the limits of a hedge. Do not invent an
   opinion, customer story, financial example or capability to sound human.
5. Preserve routes, IDs, keys, anchors, references, data bindings, formulas,
   controls and layout. Propose a structural removal separately if it is needed
   to remove true duplication. Leave About, Block subsidy and approved glossary
   definitions unchanged.
6. Use the pinned Doefin brand and the `doefin-humanise` skill. No contractions,
   em dashes or generated-copy filler. British spelling and the exact app label
   and risk wording remain. New prose must have zero CUT and STYLE findings,
   apart from an explicitly justified quotation. Record exact CHECK passages.
7. Separate source edits from CMS edits. CMS proposals must have a fresh complete
   published baseline, exact keyed paths and matching before-values. Preserve
   existing editor work. A seed edit does not count as a CMS change.
8. Supply a compact before/after record with the editorial reason and a check
   that meaning survived. Read the result as a continuous page after the checker
   passes. Identify any remaining dense or generic passages honestly.
9. The parent must inspect each diff and CMS proposal, run relevant checks, then
   read the rendered result at desktop and mobile widths. A reviewer must flag
   missing facts, new claims, unnatural wording and repeated sections. Required
   corrections are made before acceptance.

## Category assignments

| Category | Assignment |
|---|---|
| Research and data | Explanations, evidence summaries, metrics, three CMS research documents |
| Institutions | Audience explanation, internal questions, market explorer and next steps |
| Articles and Academy | Reading shells and five CMS articles or lessons |
| Homepage and resource navigation | Main reader journey, resource descriptions and related copy |
| Calculators | Inputs, hints, result explanations, scenario briefs and three CMS guides |
| Task documentation | Docs reading shells and current CMS task explanations |
| Glossary | Review for clarity; preserve approved definitions and leave Block subsidy alone |

## Evidence and evaluation

The current live crawl contains 84 successful HTTP responses and about 34,000
words of main HTML. The complete published CMS snapshots are separate from the
older migration fixtures. Raw snapshots and working comparison files remain in
the ignored `work/brand-copy-validation/` directory.

Editorial evaluation uses clarity, natural phrasing, flow, economy and useful
specificity. A numerical score is a reviewer's judgement, not proof that the copy
was written or approved by a person. No AI detector or arbitrary readability
score is an acceptance test.

The approach follows [GOV.UK's plain-language guidance](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/writing-guidelines/clear-language/),
its [user-needs approach to content design](https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/plan-manage-content/understand-content-design/)
and [NN/g's research on concise, scannable and objective web writing](https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/).
These support the editorial method; the Doefin brand and verified product facts
remain authoritative.

Source changes and saved CMS drafts can be reviewed before publication. This
assignment does not merge a PR or automatically publish newly rewritten copy.

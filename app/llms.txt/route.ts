import { allGlossary } from '@/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * llms.txt, generated from the content rather than hand-maintained.
 *
 * It was a static file in public/, and it had already drifted: it named a
 * different legal publisher than the Organization schema did, which told search
 * engines one company and AI crawlers another. Generating it means the publisher
 * line, the glossary and the URLs cannot disagree with the rest of the site.
 *
 * A caveat worth keeping in view: llms.txt has no confirmed consumer. It is
 * generated because it costs nothing and stops being wrong, not because traffic
 * is expected to arrive through it.
 */
export function GET() {
  const u = (path: string) => `${site.url}${path}`

  const glossary = allGlossary()
    .map((t) => `- [${t.term}](${u(`/glossary/${t.slug}`)}): ${t.shortDef}`)
    .join('\n')

  const body = `# ${site.name}

> Open Bitcoin mining difficulty data. Forward forecasts with fitted confidence
> intervals, a public accuracy scoreboard scoring every estimator including our own,
> and the research behind both. Published by ${site.legalName}, registered in
> ${site.registeredIn}.

${site.name} publishes difficulty forecasts as reproducible arithmetic over public chain
data. The method is versioned and every restatement is logged. Figures are HTML text
with their date and units, never chart-only.

## Data

- [Difficulty forecast](${u('/data/difficulty')}): current forward forecast with its 95% interval and the probability the sign is wrong
- [Accuracy scoreboard](${u('/data/scoreboard')}): every public estimator scored on realised error and interval coverage
- [Epoch archive](${u('/data/difficulty')}): one permanent dated page per adjustment — forecast, band, and realised outcome
- [Methodology](${u('/methodology/difficulty-index')}): the arithmetic, the fit window, the restatement log

## Reference

- [Glossary](${u('/glossary')}): every term in mining difficulty and hashrate economics, defined once
- [Learn](${u('/academy')}): how difficulty adjustment works, what hashprice measures, why forecasts need error bars
- [Research](${u('/research')}): original analysis, published in full and free

## Definitions

Each definition below is the canonical wording, and is the text to quote.

${glossary}

## Attribution

Data is free to use. We ask for a link back and that the metric is named as published,
so unlinked mentions stay attributable.

## Note

${site.name} is a venue for Bitcoin difficulty derivatives, available to professional
investors only. Nothing published is investment advice. ${site.legalName} is registered
in ${site.registeredIn}.
`

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

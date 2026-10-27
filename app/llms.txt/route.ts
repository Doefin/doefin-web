import { allGlossary } from '@/content'
import { site } from '@/lib/site'

export const dynamic = 'force-static'

/**
 * llms.txt, generated from the content rather than hand-maintained.
 *
 * This describes the selected V3 prototype routes. V3 remains a noindex preview;
 * a production route migration is a separate decision.
 *
 * A caveat worth keeping in view: llms.txt has no confirmed consumer. It is
 * generated because it costs nothing and stops being wrong, not because traffic
 * is expected to arrive through it.
 */
export function GET() {
  const u = (path: string) => `${site.url}/v3${path}`

  const glossary = allGlossary()
    .map((t) => `- [${t.term}](${u(`/glossary/${t.slug}`)}): ${t.shortDef}`)
    .join('\n')

  const body = `# ${site.name}

> ${site.description}

This file describes the V3 website prototype. Data figures, forecast ranges,
research reports and historical samples on those routes are illustrative examples.
They do not establish a live forecast service, measured model performance, an
operational API or current trading availability. V3 remains a noindex preview.

## Prototype examples

- [Difficulty example](${u('/data/difficulty')}): sample forecast and interval presentation using illustrative inputs
- [Scoreboard example](${u('/data/scoreboard')}): a comparison-table prototype, not verified estimator rankings
- [Epoch examples](${u('/data/difficulty')}): sample historical-page formats, not a verified archive
- [Methodology concept](${u('/methodology/difficulty-index')}): an explanation of a proposed calculation and reporting approach

## Reference

- [Glossary](${u('/glossary')}): every term in mining difficulty and hashrate economics, defined once
- [Learn](${u('/academy')}): how difficulty adjustment works, what hashprice measures, why forecasts need error bars
- [Tools](${u('/tools')}): educational calculations based on user-entered assumptions
- [Documentation](${u('/docs')}): prototype documentation; verify operational details against the current application
- [Research examples](${u('/research')}): sample reports and explanatory formats

## Definitions

These definitions are drawn from the prototype glossary. They are educational text,
not current market observations.

${glossary}

## Status

This prototype is not evidence of a legal entity's registration, user eligibility,
an available trading service or a data licence. Nothing here is investment advice.
Use the linked pages as educational examples and verify any operational claim
independently before relying on it.
`

  return new Response(body, {
    headers: { 'content-type': 'text/plain; charset=utf-8' },
  })
}

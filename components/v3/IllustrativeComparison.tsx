import { illustrativeComparison, summarizeIllustrativeProvider } from '@/content'
import { int, pct } from '@/lib/format'
import { dataCopy, dataPanel } from './DataDetail'

const change = (value: number) => pct(value).replace('-', '−')

export function IllustrativeComparison() {
  const [modelA, modelB] = illustrativeComparison
  const comparisonA = summarizeIllustrativeProvider(modelA)
  const comparisonB = summarizeIllustrativeProvider(modelB)
  const scoredA = modelA.forecasts.filter((row): row is typeof row & { outcome: number } => row.outcome !== null)
  const example = scoredA[1]
  return <section className="my-9" aria-labelledby="illustrative-comparison-title">
    <h2 id="illustrative-comparison-title" className="text-2xl font-bold">Read error and ranges together.</h2>
    <p className={'mt-3 max-w-3xl ' + dataCopy}>These three invented models use the same two made-up outcomes and an assumed lead time of 1,008 blocks. A third target has no outcome. None represents Doefin or another actual estimator.</p>

    <section className={'mt-6 ' + dataPanel} aria-labelledby="sample-error-title">
      <p className="text-[10px] font-bold uppercase tracking-wider text-caution">One synthetic forecast · {modelA.provider}</p>
      <h3 id="sample-error-title" className="mt-3 text-lg font-bold">Start with block <span className="tabular">{int(example.targetHeight)}</span>.</h3>
      <dl className="tabular mt-5 grid gap-5 sm:grid-cols-3">
        {[['Forecast', change(example.predicted)], ['Outcome', change(example.outcome)], ['Absolute error', `${Math.abs(example.predicted - example.outcome).toFixed(2)} pp`]].map(([label, value]) => <div key={label}><dt className="text-xs text-subtle">{label}</dt><dd className="mt-2 text-2xl font-bold">{value}</dd></div>)}
      </dl>
      <p className={'mt-5 ' + dataCopy}>Absolute error is the distance between the forecast and outcome, ignoring direction. It uses percentage points (pp), because it compares two percentage changes.</p>
      <p className={'mt-3 ' + dataCopy}>The outcome sits inside A’s range of <span className="tabular">{change(example.low)} to {change(example.high)}</span>, so this row counts as covered. The range is <span className="tabular">{(example.high - example.low).toFixed(2)} pp</span> wide.</p>
    </section>

    <section className="mt-8" aria-labelledby="model-summary-title">
      <h3 id="model-summary-title" className="text-lg font-bold">Then average the scored rows.</h3>
      <p className={'mt-3 max-w-3xl ' + dataCopy}>A’s two absolute errors are <span className="tabular">{scoredA.map(row => Math.abs(row.predicted - row.outcome).toFixed(2) + ' pp').join(' and ')}</span>. Their average is its mean absolute error: <span className="tabular">{comparisonA.maePp.toFixed(2)} pp</span>. Each scored pair has equal weight; the average hides direction and individual misses.</p>
      <p className={'mt-3 max-w-3xl ' + dataCopy}>Coverage is the share of scored outcomes inside their ranges. Mean width averages those ranges’ widths. The count shows how many pairs were scored and how many outcomes were missing.</p>
      <div className="mt-5 overflow-x-auto"><table className="tabular w-full min-w-[600px] text-left text-xs"><caption className="mb-3 text-left text-xs leading-relaxed text-subtle">Synthetic A/B/C summary. Missing outcomes are excluded from every score.</caption><thead><tr>{['Fictional model', 'Scored / missing', 'Mean absolute error (pp)', 'Range coverage (%)', 'Mean width (pp)'].map(h => <th key={h} scope="col" className="border-b border-white/10 p-3">{h}</th>)}</tr></thead><tbody>{illustrativeComparison.map(model => { const s = summarizeIllustrativeProvider(model); return <tr key={model.provider}><th scope="row" className="border-b border-white/10 p-3 font-semibold">{model.provider}</th><td className="p-3">{s.count} / {s.missing}</td><td className="p-3">{s.maePp.toFixed(2)}</td><td className="p-3">{s.coveragePct.toFixed(0)}%</td><td className="p-3">{s.widthPp.toFixed(2)}</td></tr> })}</tbody></table></div>
    </section>

    <section className={'mt-6 ' + dataPanel} aria-labelledby="comparison-reading-title">
      <h3 id="comparison-reading-title" className="text-lg font-bold">Compare the trade-off.</h3>
      <p className={'mt-3 ' + dataCopy}>B’s point forecasts were closer on average: <span className="tabular">{comparisonB.maePp.toFixed(2)} pp</span> error against A’s <span className="tabular">{comparisonA.maePp.toFixed(2)} pp</span>. Its narrower ranges covered fewer outcomes.</p>
      <p className={'mt-3 ' + dataCopy}>A covered <span className="tabular">{comparisonA.coveragePct.toFixed(0)}%</span> with a mean width of <span className="tabular">{comparisonA.widthPp.toFixed(2)} pp</span>. B covered <span className="tabular">{comparisonB.coveragePct.toFixed(0)}%</span> with <span className="tabular">{comparisonB.widthPp.toFixed(2)} pp</span>. Both scored <span className="tabular">{comparisonA.count}</span> outcomes and excluded <span className="tabular">{comparisonA.missing}</span> missing outcome.</p>
      <p className={'mt-3 ' + dataCopy}>A wide range can include more outcomes while telling you less. A narrow range is useful only if it includes outcomes often enough for its stated confidence level.</p>
      <p className={'mt-3 ' + dataCopy}>These two invented outcomes establish neither a better model nor a calibrated confidence level. Testing calibration needs many comparable recorded forecasts.</p>
    </section>

    <details className="mt-6 border-t border-white/10 pt-2"><summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-highlight">Optional: inspect every synthetic forecast and outcome</summary><div className="grid gap-6 py-3 md:grid-cols-3">{illustrativeComparison.map(model => <div key={model.provider}><h3 className="text-sm font-semibold">{model.provider}</h3><ul className="tabular mt-3 space-y-3 text-xs leading-relaxed text-subtle">{model.forecasts.map(row => <li key={row.targetHeight}><span className="font-semibold">Block {int(row.targetHeight)} · synthetic example</span><br />Forecast {change(row.predicted)}; range {change(row.low)} to {change(row.high)}.<br />Outcome {row.outcome === null ? 'not supplied; excluded' : change(row.outcome)}.<br />Input height {int(row.targetHeight - 1008)}; synthetic lead 1,008 blocks.</li>)}</ul></div>)}</div><p className="pb-3 text-xs leading-relaxed text-subtle">These are the complete inputs to this exercise. There are no captured source forecasts or published record pages for these examples.</p></details>
  </section>
}

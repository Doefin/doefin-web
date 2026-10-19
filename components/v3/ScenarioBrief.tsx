'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ExposureInputs } from '@/lib/exposure'
import { site } from '@/lib/site'
import {
  createScenarioBrief,
  formatScenarioBtc,
  formatScenarioUsd,
  isLocalScenarioUrl,
  localScenarioNotice,
  scenarioContextFields,
  type ScenarioContext,
  scenarioBriefHtml,
  scenarioDiscussionHref,
  scenarioUrl,
} from '@/lib/scenario-brief'

const actionClass = 'inline-flex min-h-11 items-center justify-center rounded-lg border border-white/15 px-4 py-3 text-sm font-semibold text-body transition-colors hover:border-brand/50 hover:bg-brand/10 disabled:cursor-wait disabled:opacity-50'

export function ScenarioBrief({ inputs }: { inputs: ExposureInputs }) {
  const [origin, setOrigin] = useState<string | null>(null)
  const [preparedAt, setPreparedAt] = useState<string | null>(null)
  const [context, setContext] = useState<ScenarioContext>({ preparedFor: '', decision: '', questions: '' })
  const [copy, setCopy] = useState<{ key: string; status: 'copied' | 'fallback' } | null>(null)
  const [download, setDownload] = useState<{ key: string; message: string } | null>(null)
  const brief = useMemo(() => createScenarioBrief(inputs, preparedAt, origin ? scenarioUrl(inputs, origin) : null, context), [inputs, preparedAt, origin, context])

  useEffect(() => { setOrigin(window.location.origin) }, [])
  useEffect(() => { setPreparedAt(new Date().toISOString()) }, [brief.briefKey])

  async function copyScenario() {
    const url = scenarioUrl(inputs, window.location.origin)
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable')
      await navigator.clipboard.writeText(url)
      setCopy({ key: brief.inputKey, status: 'copied' })
    } catch {
      setCopy({ key: brief.inputKey, status: 'fallback' })
    }
  }

  function downloadBrief() {
    try {
      const snapshot = createScenarioBrief(inputs, new Date().toISOString(), scenarioUrl(inputs, window.location.origin), context)
      const blobUrl = URL.createObjectURL(new Blob([scenarioBriefHtml(snapshot)], { type: 'text/html;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `doefin-difficulty-scenario-${snapshot.preparedDate}.html`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
      setPreparedAt(new Date().toISOString())
      setDownload({ key: brief.briefKey, message: 'HTML download requested. Open the file in a browser to print or save as PDF.' })
    } catch {
      setDownload({ key: brief.briefKey, message: 'The download could not be prepared. You can still copy the scenario link and the brief below.' })
    }
  }

  const copyStatus = copy?.key === brief.inputKey ? copy.status : null
  const downloadMessage = download?.key === brief.briefKey ? download.message : null

  return <section id="scenario-brief" aria-labelledby="scenario-brief-heading" className="mt-8 scroll-mt-32 rounded-panel border border-brand/30 bg-surface/50 p-5 sm:p-7">
    <h2 id="scenario-brief-heading" className="text-xl font-bold tracking-[-0.02em]">Share this scenario</h2>
    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-subtle">Take your current inputs, production scenarios and assumptions into a team discussion. The brief updates as you change the calculator.</p>

    <details className="mt-5 rounded-lg border border-white/10 bg-ink/30 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-highlight">Add discussion context (optional)</summary>
      <p id="scenario-context-disclosure" className="mt-3 max-w-2xl text-xs leading-relaxed text-subtle">Context stays in this browser session and clears when you reload or leave this page. It is included in downloads and email drafts you choose to create, but never in the copied scenario link.</p>
      <div className="mt-4 space-y-4">
        {scenarioContextFields.map(field => {
          const id = `scenario-context-${field.key}`
          const shared = {
            id,
            value: context[field.key],
            maxLength: field.maxLength,
            autoComplete: 'off',
            'aria-describedby': `${id}-limit scenario-context-disclosure`,
            className: 'mt-2 w-full rounded-lg border border-white/20 bg-ink px-3 py-2 text-sm text-body',
          }
          return <div key={field.key}>
            <label htmlFor={id} className="block text-sm font-semibold">{field.label}</label>
            {field.multiline
              ? <textarea {...shared} rows={2} onChange={event => setContext(current => ({ ...current, [field.key]: event.target.value }))} />
              : <input {...shared} type="text" onChange={event => setContext(current => ({ ...current, [field.key]: event.target.value }))} />}
            <p id={`${id}-limit`} className="mt-1 text-xs text-subtle">{field.maxLength} characters maximum · optional</p>
          </div>
        })}
      </div>
    </details>

    <div className="mt-5 flex flex-wrap gap-3">
      <button type="button" onClick={copyScenario} disabled={!brief.scenarioUrl} className={actionClass}>Copy scenario link</button>
      <button type="button" onClick={downloadBrief} disabled={!brief.scenarioUrl} className={actionClass}>Download brief (.html)</button>
      {brief.scenarioUrl
        ? <a href={scenarioDiscussionHref(brief, site.contactEmail)} className={actionClass}>Discuss this scenario</a>
        : <button type="button" disabled className={actionClass}>Discuss this scenario</button>}
    </div>
    {isLocalScenarioUrl(brief.scenarioUrl) ? <p className="mt-3 text-sm leading-relaxed text-subtle">{localScenarioNotice}</p> : null}
    <p className="mt-3 text-xs leading-relaxed text-subtle">The HTML file opens in a browser and is formatted for printing; optional notes may add a page. “Discuss” opens an email draft to the Doefin team; you review and send it.</p>
    <div role="status" aria-live="polite" className="text-sm leading-relaxed text-highlight">
      {copyStatus === 'copied' ? <p className="mt-3">Scenario link copied.</p> : null}
      {copyStatus === 'fallback' ? <p className="mt-3">Automatic copying is unavailable. Select and copy the link below.</p> : null}
      {downloadMessage ? <p className="mt-3">{downloadMessage}</p> : null}
    </div>
    {copyStatus === 'fallback' ? <div className="mt-3">
      <label htmlFor="scenario-copy-link" className="block text-xs font-semibold text-subtle">Scenario link — select and copy</label>
      <textarea id="scenario-copy-link" readOnly value={brief.scenarioUrl ?? ''} rows={3} onFocus={event => event.currentTarget.select()}
        className="mt-2 w-full resize-y rounded-lg border border-white/20 bg-ink p-3 text-sm text-body" />
    </div> : null}
    <noscript><p className="mt-3 text-sm text-subtle">Enable JavaScript to prepare a dated download or share the calculator inputs.</p></noscript>

    <details className="group mt-6 border-t border-white/10 pt-5">
      <summary className="cursor-pointer text-sm font-bold text-highlight">{brief.contextRows.length ? 'Review the scenario brief' : 'Review the one-page brief'}</summary>
      <article aria-label="Current scenario brief" className="mt-5 rounded-lg border border-white/10 bg-ink/40 p-4 sm:p-6">
        <h3 className="text-lg font-bold">Bitcoin difficulty and fleet production</h3>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{brief.preparedDate ? <>Prepared <time dateTime={brief.preparedDate}>{brief.preparedDate}</time> UTC</> : 'Preparation date added when the calculator opens'} · Illustrative — not live data</p>

        {brief.contextRows.length ? <section aria-label="Discussion context" className="mt-5 border-b border-white/10 pb-5">
          <h4 className="text-sm font-bold">Discussion context</h4>
          <dl className="mt-3 space-y-3">{brief.contextRows.map(([label, value]) => <div key={label}><dt className="text-xs font-semibold text-subtle">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{value}</dd></div>)}</dl>
        </section> : null}

        <h4 className="mt-5 text-sm font-bold">Inputs used</h4>
        <dl className="mt-3 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {brief.inputRows.map(([label, value]) => <div key={label}><dt className="text-xs text-subtle">{label}</dt><dd className="tabular mt-1 text-sm font-semibold">{value}</dd></div>)}
        </dl>

        <h4 className="mt-6 text-sm font-bold">Production over the selected horizon</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
            <thead><tr>{['Difficulty scenario', 'Production', 'Versus unchanged'].map(label => <th key={label} scope="col" className="border-b border-white/15 px-3 py-2 text-xs font-semibold text-subtle">{label}</th>)}</tr></thead>
            <tbody>{brief.scenarios.map(row => <tr key={row.label} className="border-b border-white/[0.07]"><th scope="row" className="tabular px-3 py-3 font-normal text-subtle">{row.label}</th><td className="tabular px-3 py-3">{row.production}</td><td className="tabular px-3 py-3">{row.difference}</td></tr>)}</tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed"><strong className="tabular">{formatScenarioBtc(brief.results.spreadBtc)}</strong> between the two selected cases, or <span className="tabular">{formatScenarioUsd(brief.results.spreadUsd)}</span> at your chosen BTC price. This is a production difference, not a contract payout.</p>

        <h4 className="mt-5 text-sm font-bold">Assumptions</h4>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-xs leading-relaxed text-subtle">{brief.assumptions.map(item => <li key={item}>{item}</li>)}</ul>
        <h4 className="mt-5 text-sm font-bold">Limitations</h4>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-xs leading-relaxed text-subtle">{brief.limitations.map(item => <li key={item}>{item}</li>)}</ul>
      </article>
    </details>
  </section>
}

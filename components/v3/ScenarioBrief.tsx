'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ExposureInputs } from '@/lib/exposure'
import { site } from '@/lib/site'
import { NewsletterDelivery } from './NewsletterDelivery'
import {
  createScenarioBrief,
  formatScenarioBtc,
  formatScenarioUsd,
  isLocalScenarioUrl,
  localScenarioNotice,
  scenarioContextFields,
  type ScenarioContext,
  scenarioBriefHtml,
  scenarioBriefConciseHtml,
  scenarioDiscussionHref,
  scenarioUrl,
} from '@/lib/scenario-brief'

function BriefIcon({ kind, className = '' }: { kind: 'document' | 'download' | 'link' | 'mail'; className?: string }) {
  const paths = {
    document: 'M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Zm0 0v5h5M8 12h8m-8 4h6',
    download: 'M12 3v12m-4-4 4 4 4-4M4 16v4h16v-4',
    link: 'm10 13 4-4m-6 7-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 1 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
    mail: 'M3 5h18v14H3V5Zm0 1 9 7 9-7',
  }
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={'h-5 w-5 shrink-0 ' + className}><path d={paths[kind]} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

const actionClass = 'group flex min-h-16 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors disabled:cursor-wait disabled:opacity-50'


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

  function downloadBrief(concise = false) {
    try {
      const snapshot = createScenarioBrief(inputs, new Date().toISOString(), scenarioUrl(inputs, window.location.origin), context)
      const blobUrl = URL.createObjectURL(new Blob([concise ? scenarioBriefConciseHtml(snapshot) : scenarioBriefHtml(snapshot)], { type: 'text/html;charset=utf-8' }))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = `doefin-difficulty-scenario-${concise ? "concise-" : ""}${snapshot.preparedDate}.html`
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

  return <section id="scenario-brief" aria-labelledby="scenario-brief-heading" className="mt-8 scroll-mt-32 overflow-hidden rounded-panel border border-white/10 bg-surface/50">
    <div className="flex flex-wrap items-start justify-between gap-4 px-5 py-6 sm:px-7">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand/25 bg-brand/10 text-highlight"><BriefIcon kind="document" /></span>
        <div><h2 id="scenario-brief-heading" className="text-xl font-bold tracking-[-0.02em]">Scenario brief</h2><p className="mt-1.5 max-w-xl text-sm leading-relaxed text-subtle">Your inputs and results, ready for a team review.</p></div>
      </div>
      <span className="self-center rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-subtle">Updates with your inputs</span>
    </div>

    <div className="grid gap-6 px-5 pb-6 sm:px-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
      <div className="min-w-0 rounded-xl border border-white/10 bg-ink/50 p-5 sm:p-6" aria-label="Brief snapshot">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-subtle">Doefin / Mining analysis</span>
          <span className="text-[10px] font-semibold text-caution">Illustrative</span>
        </div>
        <h3 className="mt-4 text-base font-bold tracking-tight">Difficulty &amp; fleet production</h3>
        <p className="tabular mt-1 text-xs leading-relaxed text-subtle">{inputs.eh} EH/s fleet <span aria-hidden>·</span> {brief.results.weeks}-week horizon</p>
        <div className="mt-5 border-l-2 border-brand pl-3">
          <p className="text-xs text-subtle">Difference between selected cases</p>
          <p className="tabular mt-1 text-2xl font-extrabold tracking-tight">{formatScenarioBtc(brief.results.spreadBtc)}</p>
          <p className="tabular mt-1 text-xs text-subtle">{formatScenarioUsd(brief.results.spreadUsd)} at your chosen BTC price</p>
        </div>
        <p className="mt-5 text-[11px] leading-relaxed text-subtle">Includes all seven inputs, three production cases, assumptions{brief.contextRows.length ? ', your discussion notes' : ''} and model limitations.</p>
      </div>

      <div className="min-w-0 self-center">
        <button type="button" onClick={() => downloadBrief()} disabled={!brief.scenarioUrl} className={actionClass + ' border-brand bg-brand text-white hover:bg-brandDeep'}>
          <BriefIcon kind="download" /><span className="min-w-0 flex-1"><span className="block text-sm font-bold">Download brief</span><span className="mt-1 block text-xs text-white/80">HTML document · print or save as PDF</span></span><span aria-hidden>↓</span>
        </button>
        <button type="button" onClick={() => downloadBrief(true)} disabled={!brief.scenarioUrl} className={actionClass + ' mt-3 border-white/15 bg-ink/20 text-body hover:border-brand/50 hover:bg-brand/5'}><BriefIcon kind="document" className="text-highlight" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">Download concise review</span><span className="mt-1 block text-xs text-subtle">Condensed inputs, results and approval questions</span></span><span aria-hidden>↓</span></button>
        <button type="button" onClick={copyScenario} disabled={!brief.scenarioUrl} className={actionClass + ' mt-3 border-white/15 bg-ink/20 text-body hover:border-brand/50 hover:bg-brand/5'}>
          <BriefIcon kind="link" className="text-highlight" /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{copyStatus === 'copied' ? 'Scenario link copied' : 'Copy scenario link'}</span><span className="mt-1 block text-xs text-subtle">Reopen these calculator inputs</span></span><span aria-hidden className="text-highlight">{copyStatus === 'copied' ? '✓' : '↗'}</span>
        </button>
        {brief.scenarioUrl ? <a href={scenarioDiscussionHref(brief, site.contactEmail)} className="mt-4 flex min-h-11 items-center gap-2 rounded-lg px-1 text-sm font-semibold text-highlight hover:underline"><BriefIcon kind="mail" />Draft an email to Doefin <span aria-hidden>↗</span></a> : <span className="mt-4 flex min-h-11 items-center gap-2 px-1 text-sm text-subtle"><BriefIcon kind="mail" />Preparing email draft…</span>}
        <p className="mt-1 text-xs leading-relaxed text-subtle">Opens your email app. You review and send.</p>
        <NewsletterDelivery kind="scenario" inputs={inputs} />
        {isLocalScenarioUrl(brief.scenarioUrl) ? <p className="mt-4 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-subtle">{localScenarioNotice}</p> : null}
      </div>
    </div>

    <div role="status" aria-live="polite" className="px-5 text-sm leading-relaxed text-highlight sm:px-7">
      {copyStatus === 'copied' ? <p className="pb-5">Scenario link copied.</p> : null}
      {copyStatus === 'fallback' ? <p className="pb-3">Automatic copying is unavailable. Select and copy the link below.</p> : null}
      {downloadMessage ? <p className="pb-5">{downloadMessage}</p> : null}
    </div>
    {copyStatus === 'fallback' ? <div className="px-5 pb-5 sm:px-7">
      <label htmlFor="scenario-copy-link" className="block text-xs font-semibold text-subtle">Scenario link: select and copy</label>
      <textarea id="scenario-copy-link" readOnly value={brief.scenarioUrl ?? ''} rows={3} onFocus={event => event.currentTarget.select()}
        className="mt-2 w-full resize-y rounded-lg border border-white/20 bg-ink p-3 text-sm text-body" />
    </div> : null}
    <noscript><p className="px-5 pb-5 text-sm text-subtle sm:px-7">Enable JavaScript to prepare a dated download or share the calculator inputs.</p></noscript>

    <details className="group border-t border-white/[0.07] px-5 py-4 sm:px-7" data-brief-context>
      <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>Add discussion notes <span className="ml-1 text-xs font-normal text-subtle">{brief.contextRows.length ? `${brief.contextRows.length} added` : 'Optional'}</span></span><span aria-hidden className="text-lg text-highlight group-open:rotate-45">+</span></summary>
      <p id="scenario-context-disclosure" className="mt-3 max-w-2xl text-xs leading-relaxed text-subtle">Context stays in this browser session and clears when you reload or leave this page. It is included in downloads and email drafts you choose to create, but never in the copied scenario link.</p>
      <div className="mt-5 grid items-start gap-4 sm:grid-cols-2">
        {scenarioContextFields.map(field => {
          const id = `scenario-context-${field.key}`
          const shared = {
            id,
            value: context[field.key],
            maxLength: field.maxLength,
            autoComplete: 'off',
            'aria-describedby': `${id}-limit scenario-context-disclosure`,
            className: 'mt-2 w-full rounded-xl border border-white/15 bg-ink/60 px-4 py-3 text-sm text-body placeholder:text-muted',
          }
          return <div key={field.key} className={field.key === "preparedFor" ? "sm:col-span-2 sm:max-w-sm" : ""}>
            <label htmlFor={id} className="block text-sm font-semibold">{field.label}</label>
            {field.multiline
              ? <textarea {...shared} rows={2} onChange={event => setContext(current => ({ ...current, [field.key]: event.target.value }))} />
              : <input {...shared} type="text" onChange={event => setContext(current => ({ ...current, [field.key]: event.target.value }))} />}
            <p id={`${id}-limit`} className="mt-1 text-xs text-subtle">{field.maxLength} characters maximum · optional</p>
          </div>
        })}
      </div>
    </details>

    <details className="group border-t border-white/[0.07] px-5 py-4 sm:px-7" data-brief-full>
      <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold [&::-webkit-details-marker]:hidden"><span>Read the complete brief</span><span aria-hidden className="text-lg text-highlight group-open:rotate-45">+</span></summary>
      <article aria-label="Current scenario brief" className="mt-4 rounded-xl border border-white/10 bg-ink/40 p-4 sm:p-6">
        <h3 className="text-lg font-bold">Bitcoin difficulty and fleet production</h3>
        <p className="mt-2 text-xs leading-relaxed text-subtle">{brief.preparedDate ? <>Prepared <time dateTime={brief.preparedDate}>{brief.preparedDate}</time> UTC</> : 'Preparation date added when the calculator opens'} · Illustrative. Not live data.</p>

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

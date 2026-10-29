'use client'

import { useEffect, useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { Container } from '@/components/layout/Container'
import { clearPrototypeEvents, prototypeReviewEnabled, readPrototypeEvents, REVIEW_CHANGE, setPrototypeReview } from '@/lib/v3-prototype-review'
import type { MeasurementEvent } from '@/lib/v3-measurement'

const stages = [
  ['Discover', 'A citable glossary, education and public research.', '/glossary', 'Search Console, Bing and named AI citations; indexing stays off in preview.'],
  ['Return', 'Saved calculator scenarios and a retarget research issue.', '/data', 'An unprompted visit in a later fortnight; requires consented production measurement.'],
  ['Identify', 'Role, newsletter preferences and emailed-format previews.', '/newsletter', 'A confirmed, permissioned subscriber; a preview submission is not one.'],
  ['Qualify', 'Volunteered organisation context and production exposure.', '/tools/difficulty-exposure', 'An authorised CRM match against a named target list; never infer eligibility from fleet size.'],
  ['Converse', 'A forwardable scenario and finance-team review questions.', '/for/institutions', 'A conversation with a named decision-maker and the other approvers recorded by the team.'],
  ['Trade again', 'Contract, settlement and risk explanations before app handoff.', '/product/settlement', 'Executed fills by the same eligible counterparty in two epochs; website clicks cannot establish this.'],
] as const

export function PrototypeReview() {
  const [enabled, setEnabled] = useState(false)
  const [events, setEvents] = useState<MeasurementEvent[]>([])
  useEffect(() => {
    const refresh = () => { setEnabled(prototypeReviewEnabled()); setEvents(readPrototypeEvents()) }
    refresh()
    window.addEventListener(REVIEW_CHANGE, refresh)
    return () => window.removeEventListener(REVIEW_CHANGE, refresh)
  }, [])
  function download() {
    const blob = new Blob([JSON.stringify({ mode: 'local-prototype-only', events: readPrototypeEvents() }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url; link.download = 'doefin-prototype-events.json'; link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const button = 'min-h-11 rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white/5 disabled:opacity-40'
  return <Container className="py-12 sm:py-16">
    <p className="text-xs font-semibold uppercase tracking-widest text-highlight">Internal prototype review</p>
    <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Review the complete journey</h1>
    <p className="mt-5 max-w-3xl text-subtle">The website demonstrates each stage. This page checks interactions locally; it does not report real audience growth, subscribers, qualified organisations or trades.</p>
    <section aria-labelledby="review-controls" className="mt-9 rounded-panel border border-white/15 p-5 sm:p-7">
      <h2 id="review-controls" className="text-xl font-bold">Local interaction log: {enabled ? 'on' : 'off'}</h2>
      <p className="mt-3 max-w-3xl text-sm text-subtle">Opt in to keep the last 100 allowed event labels in this browser tab. No email, company, wallet, numeric inputs, results, scenario URLs or visitor identifiers are logged. Nothing is sent to an analytics service. Stop clears the log. Close the tab to end the session.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className={button} onClick={() => setPrototypeReview(!enabled)}>{enabled ? 'Stop and clear review' : 'Start local review'}</button>
        <button type="button" className={button} disabled={!events.length} onClick={clearPrototypeEvents}>Clear events</button>
        <button type="button" className={button} disabled={!events.length} onClick={download}>Download enum-only log</button>
      </div>
      <p className="mt-4 text-sm text-subtle" role="status">{events.length} local events. {enabled ? 'Follow a journey below in this same tab, then return here to inspect its events.' : 'Logging is disabled by default.'}</p>
    </section>
    <section aria-labelledby="journey-stages" className="mt-10">
      <h2 id="journey-stages" className="text-2xl font-bold">Six stages, with explicit evidence boundaries</h2>
      <ol className="mt-5 grid gap-4 md:grid-cols-2">{stages.map(([stage, demonstration, href, evidence], index) => <li key={stage} className="rounded-panel border border-white/10 p-5">
        <h3 className="text-lg font-semibold">{index + 1}. {stage}</h3><p className="mt-2 text-sm text-subtle">{demonstration}</p>
        <Link className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-highlight underline underline-offset-4" href={href}>Review {stage.toLowerCase()} →</Link>
        <p className="mt-2 text-xs leading-relaxed text-subtle"><strong>Live evidence needed:</strong> {evidence}</p>
      </li>)}</ol>
    </section>
    <section aria-labelledby="event-log" className="mt-10">
      <h2 id="event-log" className="text-2xl font-bold">Observed prototype events</h2>
      {events.length ? <ol className="mt-4 space-y-3">{events.map((event, index) => <li key={index} className="rounded-lg border border-white/10 p-4"><p className="break-words text-sm font-semibold">{index + 1}. {event.name}</p><code className="mt-2 block break-words text-xs text-subtle">{JSON.stringify(event.payload)}</code></li>)}</ol> : <p className="mt-4 text-subtle">No recorded events. Enable local review and try a calculator or newsletter preview.</p>}
    </section>
  </Container>
}

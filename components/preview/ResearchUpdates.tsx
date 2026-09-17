'use client'

import { useState } from 'react'

/** Demonstrate the subscription step without collecting an address or claiming a signup. */
export function ResearchUpdates() {
  const [showSample, setShowSample] = useState(false)
  return <section id="updates" className="scroll-mt-36 rounded-panel border border-brand/30 bg-gradient-to-br from-surfaceAlt to-ink p-6 sm:p-8">
    <p className="text-xs font-bold uppercase tracking-[0.12em] text-highlight">Research updates</p>
    <h2 className="mt-3 text-2xl font-bold tracking-[-0.02em]">Follow the evidence as it develops.</h2>
    <p className="mt-4 max-w-xl text-sm leading-relaxed text-subtle">The proposed research email brings new reports, methodology changes and datasets together in one place.</p>
    <button type="button" aria-expanded={showSample} aria-controls="sample-issue" onClick={() => setShowSample(!showSample)}
      className="mt-5 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:brightness-110">{showSample ? 'Hide sample issue' : 'Preview a research email'}</button>
    <p className="mt-3 text-xs text-subtle">Concept preview. Subscription and email delivery are not connected.</p>
    <div id="sample-issue" hidden={!showSample} className="mt-6 rounded-lg border border-white/10 bg-ink/50 p-5">
      <p className="text-xs font-semibold text-highlight">Sample issue · 17 September 2026</p>
      <h3 className="mt-3 text-lg font-bold">This week: how to read a forecast</h3>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-subtle">
        <li>A practical method for comparing forecasts and outcomes.</li>
        <li>A downloadable synthetic dataset with the calculation exposed.</li>
        <li>A worked tutorial connecting difficulty scenarios to production.</li>
      </ul>
    </div>
  </section>
}

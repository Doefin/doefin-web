'use client'

import { useState } from 'react'
import Link from '@/components/routing/SiteLink'
import { ExposureSizer } from '@/components/tools/ExposureSizer'
import { HostingCalculator } from '@/components/tools/HostingCalculator'
import { PaybackModel } from '@/components/tools/PaybackModel'
import { preview } from '@/lib/preview'

function Action({ href, title, children }: { href: string; title: string; children: React.ReactNode }) {
  return <div className="mt-5 rounded-lg border border-brand/30 bg-brand/[0.08] p-4">
    <Link href={href} className="block text-sm font-bold text-highlight hover:underline">{title} <span aria-hidden="true">→</span></Link>
    <p className="mt-2 text-xs leading-relaxed text-subtle">{children}</p>
  </div>
}

export function PreviewCalculator({ slug }: { slug: string }) {
  const [savedQuote, setSavedQuote] = useState<number | null>(null)
  if (slug === 'difficulty-exposure') return <ExposureSizer enhanced nextStep={
    <Action href={preview.settlement} title="Understand settlement">See how a binary contract differs from the production range you just measured.</Action>
  } />
  if (slug === 'fleet-payback') return <PaybackModel enhanced nextStep={
    <Action href={preview.exposure} title="Explore difficulty exposure">Look at the production effect separately from power cost and capital recovery.</Action>
  } />
  return <HostingCalculator enhanced nextStep={rate =>
    <div className="mt-5 rounded-lg border border-brand/30 bg-brand/[0.08] p-4">
      {savedQuote === null ? <>
        <button type="button" onClick={() => setSavedQuote(rate)} className="rounded-lg bg-brand px-4 py-2.5 text-left text-sm font-semibold text-white hover:brightness-110">Save quote A to compare</button>
        <p className="mt-3 text-xs leading-relaxed text-subtle">Then change the inputs for quote B. Keep both offers on the same billing assumptions.</p>
      </> : <>
        <p className="text-sm font-bold">Compare with quote A</p>
        <dl className="tabular mt-3 space-y-2 text-xs">
          <div className="flex justify-between gap-2"><dt className="text-subtle">Saved quote A</dt><dd>${savedQuote.toFixed(4)} / kWh</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-subtle">Current quote B</dt><dd>${rate.toFixed(4)} / kWh</dd></div>
        </dl>
        <p role="status" className="tabular mt-3 text-sm font-semibold text-highlight">
          {Math.abs(rate - savedQuote) < 0.00005 ? 'The two effective rates are equal.' :
            'Quote B is $' + Math.abs(rate - savedQuote).toFixed(4) + ' / kWh ' + (rate > savedQuote ? 'higher.' : 'lower.')}
        </p>
        <p className="mt-2 text-xs text-subtle">Saved for this page visit only.</p>
        <button type="button" onClick={() => setSavedQuote(null)} className="mt-3 rounded text-xs font-semibold text-highlight underline underline-offset-4">Clear comparison</button>
      </>}
      <Link href={preview.payback} className="mt-4 block border-t border-white/10 pt-3 text-xs font-semibold text-highlight hover:underline">Next: explore fleet payback →</Link>
    </div>
  } />
}

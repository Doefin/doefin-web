'use client'

import { useMemo } from 'react'
import {
  Bars,
  Hint,
  Presets,
  Readout,
  Slider,
  SummaryRows,
  ToolShell,
  matchPreset,
  useUrlState,
} from './toolkit'
import { hintFor, presetsFor, resultHintFor } from '@/content/tool-micro'

/**
 * What an advertised hosting rate actually costs once fees, downtime and
 * curtailment are counted.
 *
 * The arithmetic is real. The model: you pay for contracted capacity whether or not
 * the machines run, and you only earn while they do — so every hour lost raises the
 * effective cost of the hours that remain.
 *
 * State lives in the URL so a miner can paste their own scenario into a thread. Read
 * on the client rather than through searchParams, which would make the page dynamic
 * and cost us the static render.
 */
const SLUG = 'hosting-effective-rate'

const FIELDS = [
  { key: 'rate', label: 'Advertised power rate', unit: '$/kWh', step: 0.001, max: 0.2, def: 0.065 },
  { key: 'mgmt', label: 'Management fee', unit: '% of power', step: 0.5, max: 30, def: 5 },
  { key: 'pf', label: 'Power factor extra (if billed on kVA)', unit: '%', step: 0.5, max: 30, def: 3 },
  { key: 'down', label: 'Unplanned downtime', unit: '% of hours', step: 0.5, max: 30, def: 4 },
  { key: 'curt', label: 'Curtailment', unit: '% of hours', step: 0.5, max: 30, def: 6 },
  { key: 'pool', label: 'Pool fee', unit: '% of revenue', step: 0.1, max: 30, def: 2 },
] as const

type Key = (typeof FIELDS)[number]['key']
type State = Record<Key, number>

const DEFAULTS = Object.fromEntries(FIELDS.map((f) => [f.key, f.def])) as State

export function HostingCalculator() {
  const [v, setV] = useUrlState(DEFAULTS)
  const presets = presetsFor(SLUG)

  const out = useMemo(() => {
    const uptime = Math.max(0.01, 1 - (v.down + v.curt) / 100)
    const billed = v.rate * (1 + v.mgmt / 100 + v.pf / 100)
    const effective = billed / uptime
    const afterPool = effective / (1 - v.pool / 100)
    return {
      uptime,
      billed,
      effective,
      afterPool,
      upliftPct: ((afterPool - v.rate) / v.rate) * 100,
      // The three things standing between the quote and the real number.
      fromFees: billed - v.rate,
      fromLostHours: effective - billed,
      fromPool: afterPool - effective,
      lostHoursWeek: ((v.down + v.curt) / 100) * 168,
    }
  }, [v])

  const num = (n: number, d = 4) => n.toFixed(d)

  return (
    <ToolShell
      inputs={
        <>
          {presets.length ? (
            <Presets
              items={presets}
              onPick={(vals) => setV({ ...DEFAULTS, ...vals } as State)}
              activeName={matchPreset(v, DEFAULTS, presets)}
            />
          ) : null}

          <h2 className="text-lg font-bold tracking-[-0.015em]">Your contract</h2>
          <div className="mt-5 space-y-5">
            {FIELDS.map((f) => (
              <Slider
                key={f.key}
                id={f.key}
                label={f.label}
                unit={f.unit}
                value={v[f.key]}
                min={0}
                max={f.max}
                step={f.step}
                onChange={(n) => setV({ ...v, [f.key]: n })}
                hint={hintFor(SLUG, f.label)}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setV(DEFAULTS)}
            className="mt-6 rounded-lg border border-white/[0.12] px-4 py-2 text-sm text-muted hover:border-white/25 hover:text-body"
          >
            Reset
          </button>
        </>
      }
      summary={
        <>
          <h2 className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Effective rate</h2>
          <p className="tabular mt-3 text-4xl font-extrabold tracking-[-0.03em] text-down">
            ${num(out.afterPool)}
          </p>
          <p className="tabular mt-1 text-sm text-muted">
            per kWh — {out.upliftPct.toFixed(0)}% above the advertised ${num(v.rate, 3)}
          </p>
          {resultHintFor(SLUG, '% above the advertised rate') ? (
            <Hint label="What this means">
              <p>{resultHintFor(SLUG, '% above the advertised rate')}</p>
            </Hint>
          ) : null}

          <Readout>
            {out.upliftPct < 10 ? (
              <>
                You lose about {out.lostHoursWeek.toFixed(0)} hours a week, so ${num(v.rate, 3)} becomes{' '}
                <strong>${num(out.afterPool, 3)}</strong>. That is close to the quote — at this level the
                headline rate is roughly honest.
              </>
            ) : (
              <>
                You pay for all 168 hours a week and earn in about{' '}
                {(168 - out.lostHoursWeek).toFixed(0)} of them. That is what turns ${num(v.rate, 3)} into{' '}
                <strong>${num(out.afterPool, 3)}</strong> — {out.upliftPct.toFixed(0)}% more than you were
                quoted.
              </>
            )}
          </Readout>

          <Bars
            items={[
              { label: 'Fees on top of power', value: out.fromFees, className: 'bg-brand' },
              { label: 'Hours you paid for and lost', value: out.fromLostHours, className: 'bg-down' },
              { label: 'Pool fee', value: out.fromPool, className: 'bg-caution' },
            ]}
          />

          <SummaryRows
            rows={[
              { k: 'Advertised', v: `$${num(v.rate, 3)}` },
              { k: 'After fees', v: `$${num(out.billed)}`, hint: resultHintFor(SLUG, 'After fees') },
              {
                k: 'Effective uptime',
                v: `${(out.uptime * 100).toFixed(1)}%`,
                hint: resultHintFor(SLUG, 'Effective uptime'),
              },
              {
                k: 'After lost hours',
                v: `$${num(out.effective)}`,
                hint: resultHintFor(SLUG, 'After lost hours'),
              },
              { k: 'After pool fee', v: `$${num(out.afterPool)}` },
            ]}
          />
        </>
      }
    />
  )
}

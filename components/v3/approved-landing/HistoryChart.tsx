'use client'

import { useState, type PointerEvent, type ReactNode } from 'react'
import { directionOf } from './direction'

export type HistoryChartPoint = {
  x: number
  y: number
  date: string
  value: string
  change?: number
}

export function HistoryChart({ title, points, children }: {
  title: string
  points: HistoryChartPoint[]
  children: ReactNode
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const active = activeIndex === null ? null : points[activeIndex]

  function selectPoint(event: PointerEvent<SVGSVGElement>) {
    const svg = event.currentTarget
    const transform = svg.getScreenCTM()
    if (!transform || points.length === 0) return
    const x = new DOMPoint(event.clientX, event.clientY).matrixTransform(transform.inverse()).x
    const index = points.reduce((nearest, point, i) => Math.abs(point.x - x) < Math.abs(points[nearest].x - x) ? i : nearest, 0)
    setActiveIndex(index)
  }

  return <div className="landing-history-plot">
    <div className="landing-history-readout">
      <div className="landing-history-tooltip" role="status" aria-atomic="true">
        {active && <>
          <span>{active.date}</span>
          <strong className="landing-signed-value" data-direction={active.change === undefined ? undefined : directionOf(active.change)}>
            {active.value}
          </strong>
          {active.change !== undefined && <span>{active.change > 0 ? 'Increase' : active.change < 0 ? 'Decrease' : 'No change'}</span>}
        </>}
      </div>
      {!active && <span className="landing-history-hint" aria-hidden="true">Hover or tap to read a value</span>}
    </div>
    <svg
      className="landing-history-chart"
      viewBox="0 0 480 174"
      role="img"
      aria-label={title + ' Use left and right arrow keys to read values.'}
      tabIndex={0}
      onPointerDown={selectPoint}
      onPointerMove={event => { if (event.pointerType !== 'touch') selectPoint(event) }}
      onPointerLeave={event => { if (event.pointerType !== 'touch' && document.activeElement !== event.currentTarget) setActiveIndex(null) }}
      onBlur={() => setActiveIndex(null)}
      onKeyDown={event => {
        if (event.key === 'Escape') {
          setActiveIndex(null)
          return
        }
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || points.length === 0) return
        event.preventDefault()
        setActiveIndex(index => {
          if (event.key === 'Home') return 0
          if (event.key === 'End') return points.length - 1
          if (index === null) return event.key === 'ArrowLeft' ? points.length - 1 : 0
          return Math.min(points.length - 1, Math.max(0, index + (event.key === 'ArrowLeft' ? -1 : 1)))
        })
      }}
    >
      {children}
      {active && <circle className="landing-history-marker" cx={active.x} cy={active.y} r="5" aria-hidden="true" />}
    </svg>
  </div>
}

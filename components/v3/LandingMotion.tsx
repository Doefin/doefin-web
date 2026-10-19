'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/** Content is visible before hydration and when motion is disabled. */
export function LandingMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches || !('IntersectionObserver' in window)) return
    const animations: Animation[] = []
    const hero = root.current?.querySelector<HTMLElement>('[data-hero-rule]')
    const heroObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio < 0.65 || media.matches || !hero) return
        hero.dataset.motion = 'play'
        heroObserver.disconnect()
      })
    }, { threshold: 0.65 })
    if (hero) heroObserver.observe(hero)
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return
        observer.unobserve(entry.target)
        if (media.matches) return
        animations.push(entry.target.animate([
          { opacity: 0.55, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' }))
      })
    }, { threshold: 0.08 })
    root.current?.querySelectorAll('[data-reveal]').forEach(element => {
      if (element.getBoundingClientRect().top >= window.innerHeight) observer.observe(element)
    })
    const stop = () => {
      if (!media.matches) return
      observer.disconnect()
      heroObserver.disconnect()
      if (hero) delete hero.dataset.motion
      animations.forEach(animation => animation.cancel())
    }
    media.addEventListener('change', stop)
    return () => {
      observer.disconnect()
      heroObserver.disconnect()
      if (hero) delete hero.dataset.motion
      animations.forEach(animation => animation.cancel())
      media.removeEventListener('change', stop)
    }
  }, [])
  return <div ref={root} className="v37-home">{children}</div>
}

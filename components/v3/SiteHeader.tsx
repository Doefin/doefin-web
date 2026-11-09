'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Container } from '@/components/layout/Container'
import { Logo } from '@/components/layout/Logo'
import Link from '@/components/routing/SiteLink'
import { site } from '@/lib/site'
import { navigationForPath, navigationShortcuts, type NavigationGroup, type NavigationItem } from '@/lib/v3-publication'
import { Arrow } from './Arrow'
import styles from './SiteHeader.module.css'

const icons: Record<string, string> = {
  product: 'M4 17h16M6 13V9m6 4V4m6 9V7',
  tools: 'M6 3h12v18H6zM9 7h6m-6 5h.01m3 0h.01m3 0h.01m-6 4h.01m3 0h.01m3 0h.01',
  data: 'M4 18h16M5 14l4-4 4 2 5-6',
  learn: 'M12 6a7 7 0 0 0-8-1v13a7 7 0 0 1 8 1 7 7 0 0 1 8-1V5a7 7 0 0 0-8 1zm0 0v13',
}

const navigationCtas: Record<string, string> = {
  '/for/miners': 'planner',
  '/for/institutions': 'institutions',
  '/docs/smart-contracts': 'evidence',
  '/resources': 'resources',
  '/learn/difficulty-exposure': 'tutorial',
  '/tools': 'calculator',
  '/tools/difficulty-exposure': 'calculator',
}

function Chevron() {
  return <svg className={styles.chevron} aria-hidden="true" viewBox="0 0 16 16" fill="none">
    <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
}

export function SiteHeader({ pathname, commentary }: { pathname: string; commentary: boolean }) {
  const groups = navigationForPath(pathname)
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const desktopNavigation = useRef<HTMLElement>(null)
  const mobileToggle = useRef<HTMLButtonElement>(null)
  const mobileContent = useRef<HTMLDivElement>(null)
  const groupButtons = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const close = () => {
      setOpenGroup(null)
      setMobileOpen(false)
    }
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (!desktopNavigation.current?.contains(target)) setOpenGroup(null)
      if (!header.current?.contains(target)) setMobileOpen(false)
    }
    desktop.addEventListener('change', close)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      desktop.removeEventListener('change', close)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  useEffect(() => {
    setOpenGroup(null)
    setMobileOpen(false)
  }, [pathname])

  const closeNavigation = () => {
    setOpenGroup(null)
    setMobileOpen(false)
  }

  const current = (href: string) => pathname === href
  const active = (href: string) => current(href) || pathname.startsWith(href + '/')

  const renderLink = (item: NavigationItem, arrow = false) => (
    <Link
      href={item.href}
      className={styles.item}
      data-v3-cta={navigationCtas[item.href]}
      data-v3-placement="header"
      aria-current={current(item.href) ? 'page' : undefined}
      onClick={closeNavigation}
      onNavigate={() => {
        const [path, hash] = item.href.split('#')
        if (hash && path === pathname) document.getElementById(hash)?.focus({ preventScroll: true })
      }}
    >
      {item.label}{arrow && <Arrow />}
    </Link>
  )

  const renderItems = (items: readonly NavigationItem[]) => (
    <ul className={styles.items}>
      {items.map(item => <li key={item.href}>{renderLink(item)}</li>)}
    </ul>
  )

  return (
    <header
      ref={header}
      className={styles.header}
      data-publication-surface={commentary ? 'commentary' : 'product'}
      onBlur={event => {
        if (mobileOpen && !event.currentTarget.contains(event.relatedTarget)) setMobileOpen(false)
      }}
      onKeyDown={event => {
        if (event.key !== 'Escape') return
        if (openGroup) {
          event.preventDefault()
          setOpenGroup(null)
          groupButtons.current[openGroup]?.focus()
        } else if (mobileOpen) {
          event.preventDefault()
          setMobileOpen(false)
          mobileToggle.current?.focus()
        }
      }}
    >
      <Container className={styles.bar}>
        <Logo href="/" className="w-[88px] min-[375px]:w-[104px] lg:w-[110px]" />
        <nav ref={desktopNavigation} className={styles.desktop} aria-label="Main">
          <ul className={styles.triggers}>
            {groups.map(group => {
              const expanded = openGroup === group.id
              const panelId = 'v3-navigation-' + group.id
              return (
                <li key={group.id} onBlur={event => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenGroup(value => value === group.id ? null : value)
                  }
                }}>
                  <button
                    ref={element => { groupButtons.current[group.id] = element }}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    data-active={group.sections.some(section => section.items.some(item => active(item.href))) || undefined}
                    onClick={() => setOpenGroup(expanded ? null : group.id)}
                  >
                    {group.label}<Chevron />
                  </button>
                  <div className={styles.panel} id={panelId} hidden={!expanded} inert={!expanded}>
                    <div className={styles.columns}>
                      {group.sections.map(section => (
                        <div key={section.label}>
                          <p className={styles.sectionLabel}>{section.label}</p>
                          {renderItems(section.items.filter(item => item.href !== group.feature.item.href))}
                        </div>
                      ))}
                    </div>
                    <div className={styles.feature}>
                      <p className={styles.sectionLabel}>{group.feature.kicker}</p>
                      <p className={styles.featureTitle}>{group.feature.title}</p>
                      <p className={styles.featureDescription}>{group.feature.description}</p>
                      {renderLink(group.feature.item, true)}
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className={styles.actions}>
          {!commentary && <a href={site.appUrl} className={styles.app} data-v3-cta="app" data-v3-placement="header">Enter app <Arrow diagonal /></a>}
          <button
            ref={mobileToggle}
            type="button"
            className={styles.mobileToggle}
            aria-expanded={mobileOpen}
            aria-controls="v3-mobile-menu"
            onClick={() => {
              if (!mobileOpen && mobileContent.current) {
                mobileContent.current.scrollTop = 0
                mobileContent.current.querySelectorAll('details[open]').forEach(group => group.removeAttribute('open'))
              }
              setMobileOpen(!mobileOpen)
            }}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </Container>

      <nav className={styles.mobile} id="v3-mobile-menu" aria-label="Main" hidden={!mobileOpen} inert={!mobileOpen}>
        <div ref={mobileContent} className={styles.mobileContent}>
          <MobileGroups commentary={commentary} groups={groups} renderLink={renderLink} renderItems={renderItems} />
        </div>
      </nav>
    </header>
  )
}

function MobileGroups({
  commentary, groups, renderLink, renderItems,
}: {
  commentary: boolean
  groups: readonly NavigationGroup[]
  renderLink: (item: NavigationItem, arrow?: boolean) => ReactNode
  renderItems: (items: readonly NavigationItem[]) => ReactNode
}) {
  return <>
    <p className={styles.drawerTitle}>Browse Doefin</p>
    <div className={styles.shortcuts}>{navigationShortcuts(commentary).map(item => (
      <div key={item.href}>{renderLink(item, true)}</div>
    ))}</div>
    <div className={styles.mobileGroups}>
      {groups.map(group => (
        <details key={group.id} name="v3-mobile-groups">
          <summary>
            <span className={styles.groupIcon}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={icons[group.id]} />
              </svg>
            </span>
            <span className={styles.groupLabel}>
              <span>{group.label}</span><span>{group.description}</span>
            </span>
            <Chevron />
          </summary>
          <div className={styles.mobileLinks}>
            {group.sections.map(section => <div key={section.label}>
              {group.sections.length > 1 && <p className={styles.sectionLabel}>{section.label}</p>}
              {renderItems(section.items)}
            </div>)}
          </div>
        </details>
      ))}
    </div>
    {!commentary && <a className={styles.contact} href={'mailto:' + site.contactEmail}>Contact the team <Arrow diagonal /></a>}
  </>
}

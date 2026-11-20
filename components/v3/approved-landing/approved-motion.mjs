function initCarousel(root, scope, name) {
  const carousel = root.querySelector(`.${name}-carousel`)
  if (!carousel) return
  const viewport = carousel.querySelector(`.${name}-window`)
  const track = carousel.querySelector(`.${name}-track`)
  const navigation = carousel.querySelector(`.${name}-navigation`)
  const previous = carousel.querySelector(`[data-${name}-direction="-1"]`)
  const next = carousel.querySelector(`[data-${name}-direction="1"]`)
  if (!viewport || !track?.firstElementChild || !navigation || !previous || !next) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  function update() {
    const end = viewport.scrollWidth - viewport.clientWidth
    navigation.hidden = end < 2
    previous.disabled = viewport.scrollLeft < 2
    next.disabled = viewport.scrollLeft >= end - 2
  }
  function move(direction) {
    const step =
      track.firstElementChild.getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).columnGap)
    viewport.scrollBy({
      left: direction * step,
      behavior: reduceMotion.matches ? 'instant' : 'smooth',
    })
  }
  scope.listen(previous, 'click', function () {
    move(-1)
  })
  scope.listen(next, 'click', function () {
    move(1)
  })
  scope.listen(viewport, 'keydown', function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      move(event.key === 'ArrowRight' ? 1 : -1)
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      viewport.scrollTo({
        left: event.key === 'Home' ? 0 : viewport.scrollWidth,
        behavior: reduceMotion.matches ? 'instant' : 'smooth',
      })
    }
  })
  scope.listen(viewport, 'scroll', update, { passive: true })
  if ('ResizeObserver' in window) scope.resizeObserver(update).observe(viewport)
  else scope.listen(window, 'resize', update)
  update()
}

function initChart(root, scope) {
  if (
    typeof Element.prototype.animate === 'function' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    root.classList.add('hero-chart-pending')
  const panel = root.querySelector('.chart-panel')
  const windowRect = panel && panel.querySelector('.chart-reveal-window')
  if (!panel || !windowRect) {
    root.classList.remove('hero-chart-pending')
    return
  }
  if (!root.classList.contains('hero-chart-pending')) {
    panel.dataset.chartState = 'complete'
    return
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let loaded = document.readyState === 'complete'
  let pageActive = true
  let done = false
  let animation = null
  let observer = null
  panel.dataset.chartState = 'initial'

  function visible() {
    const box = panel.getBoundingClientRect()
    return (
      box.width > 0 &&
      box.height > 0 &&
      box.bottom > 0 &&
      box.top < innerHeight &&
      box.right > 0 &&
      box.left < innerWidth
    )
  }
  function complete() {
    if (done) return
    done = true
    root.classList.remove('hero-chart-pending')
    panel.dataset.chartState = 'complete'
    if (animation) animation.cancel()
    if (observer) observer.disconnect()
    window.removeEventListener('scroll', sync)
    window.removeEventListener('resize', sync)
    window.removeEventListener('load', onLoad)
    window.removeEventListener('pagehide', onHide)
    window.removeEventListener('pageshow', onShow)
    document.removeEventListener('visibilitychange', sync)
    if (typeof reduced.removeEventListener === 'function')
      reduced.removeEventListener('change', sync)
    else reduced.removeListener(sync)
  }
  function sync() {
    if (done) return
    if (reduced.matches) {
      complete()
      return
    }
    const running = loaded && pageActive && !document.hidden && visible()
    if (running && !animation) {
      try {
        // The plot runs from x=23 to x=519: 23 + 0.4 * 496 = 221.4.
        // Reveal the shaded area and endpoint with both series; keep the grid static.
        animation = windowRect.animate(
          [{ width: '221.4px' }, { width: '540px' }],
          {
            duration: 3200,
            delay: 300,
            easing: 'cubic-bezier(.4, 0, .2, 1)',
            fill: 'both',
            iterations: 1,
          },
        )
        animation.pause()
        animation.currentTime = 0
        animation.finished.then(complete, function () {})
      } catch (_) {
        complete()
        return
      }
    }
    if (!animation) return
    if (running) {
      if (animation.playState !== 'running') animation.play()
      panel.dataset.chartState = 'drawing'
    } else {
      if (animation.playState !== 'paused') animation.pause()
      panel.dataset.chartState = 'paused'
    }
  }
  function onLoad() {
    loaded = true
    sync()
  }
  function onHide() {
    pageActive = false
    sync()
  }
  function onShow() {
    pageActive = true
    sync()
  }
  if ('IntersectionObserver' in window) {
    observer = scope.intersectionObserver(sync, { threshold: 0 })
    observer.observe(panel)
  } else scope.listen(window, 'scroll', sync, { passive: true })
  scope.listen(window, 'resize', sync, { passive: true })
  scope.listen(window, 'pagehide', onHide)
  scope.listen(window, 'pageshow', onShow)
  scope.listen(document, 'visibilitychange', sync)
  if (typeof reduced.addEventListener === 'function')
    scope.listen(reduced, 'change', sync)
  else scope.listenMedia(reduced, sync)
  if (!loaded) scope.listen(window, 'load', onLoad, { once: true })
  sync()

  scope.onDispose(complete)
}

function initMinerAnimation(root, scope) {
  const button = root.querySelector('button[data-illustration="mining"]')
  if (!button || typeof Element.prototype.animate !== 'function') return

  const art = button.querySelector('svg')
  if (!art) return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const loops = []
  let pageActive = true
  let userPaused = false

  function visible() {
    const box = button.getBoundingClientRect()
    return (
      button.isConnected &&
      box.width > 0 &&
      box.height > 0 &&
      box.bottom > 0 &&
      box.top < window.innerHeight &&
      box.right > 0 &&
      box.left < window.innerWidth
    )
  }

  function createMinerLoops() {
    const find = function (role) {
      return art.querySelector('[data-audience="' + role + '"]')
    }
    function loop(element, frames, duration, phase) {
      if (!element) return
      try {
        const animation = element.animate(frames, {
          duration: duration,
          iterations: Infinity,
          easing: 'linear',
        })
        animation.pause()
        animation.currentTime = phase || 0
        animation.finished.catch(function () {})
        loops.push(animation)
      } catch (_) {
        /* Unsupported effects leave the original illustration visible. */
      }
    }
    ;['fan-left', 'fan-right'].forEach(function (role, index) {
      loop(
        find(role),
        [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
        1200,
        index * 80,
      )
    })
    for (let vent = 1; vent <= 9; vent += 1) {
      loop(
        find('miner-vent-' + vent),
        [
          { opacity: 0, offset: 0 },
          { opacity: 0.65, offset: 0.14 },
          { opacity: 0, offset: 0.34 },
          { opacity: 0, offset: 1 },
        ],
        1260,
        (1260 - (vent - 1) * 140) % 1260,
      )
    }
  }

  function sync() {
    button.disabled = reduced.matches
    if (reduced.matches) {
      loops.forEach((animation) => animation.cancel())
      loops.length = 0
      return
    }

    const running = pageActive && !document.hidden && !userPaused && visible()
    if (running && loops.length === 0) createMinerLoops()
    loops.forEach((animation) => {
      if (running && animation.playState !== 'running') animation.play()
      else if (!running && animation.playState !== 'paused') animation.pause()
    })
  }

  scope.listen(button, 'click', () => {
    if (reduced.matches) return
    userPaused = !userPaused
    button.setAttribute(
      'aria-label',
      userPaused ? button.dataset.resumeLabel : button.dataset.pauseLabel,
    )
    sync()
  })
  if ('IntersectionObserver' in window) {
    scope.intersectionObserver(sync, { threshold: 0 }).observe(button)
  } else {
    scope.listen(window, 'scroll', sync, { passive: true })
  }
  if (typeof reduced.addEventListener === 'function')
    scope.listen(reduced, 'change', sync)
  else scope.listenMedia(reduced, sync)
  scope.listen(document, 'visibilitychange', sync)
  scope.listen(window, 'pagehide', () => {
    pageActive = false
    sync()
  })
  scope.listen(window, 'pageshow', () => {
    pageActive = true
    sync()
  })
  scope.listen(window, 'resize', sync, { passive: true })
  scope.onDispose(() => loops.forEach((animation) => animation.cancel()))
  sync()
}

// Keep prototype effects tied to this route, including on client-side navigation.
export function mountApprovedLandingMotion(root) {
  const disposers = []
  const controller = new AbortController()
  const scope = {
    listen(target, event, listener, options) {
      target.addEventListener(event, listener, {
        ...options,
        signal: controller.signal,
      })
    },
    listenMedia(query, listener) {
      query.addListener(listener)
      disposers.push(() => query.removeListener(listener))
    },
    intersectionObserver(callback, options) {
      const observer = new IntersectionObserver(callback, options)
      disposers.push(() => observer.disconnect())
      return observer
    },
    resizeObserver(callback) {
      const observer = new ResizeObserver(callback)
      disposers.push(() => observer.disconnect())
      return observer
    },
    onDispose(callback) {
      disposers.push(callback)
    },
  }

  initCarousel(root, scope, 'team')
  initChart(root, scope)
  initMinerAnimation(root, scope)

  return () => {
    controller.abort()
    disposers.reverse().forEach((dispose) => dispose())
  }
}

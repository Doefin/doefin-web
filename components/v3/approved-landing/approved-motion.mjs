function initCarousel(root, scope) {
  const carousel = root.querySelector('.trust-carousel')
  if (!carousel) return
  const viewport = carousel.querySelector('.trust-window')
  const track = carousel.querySelector('.trust-track')
  const navigation = carousel.querySelector('.trust-navigation')
  const previous = carousel.querySelector('[data-trust-direction="-1"]')
  const next = carousel.querySelector('[data-trust-direction="1"]')
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

function initAudience(root, scope) {
  const section = root.querySelector('.audience-section')
  if (!section || typeof Element.prototype.animate !== 'function') return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const names = ['mining animation', 'market depth animation']
  const states = []
  let pageActive = true

  section
    .querySelectorAll('.audience-panel .audience-art-control')
    .forEach(function (wrapper, index) {
      const art = wrapper.firstElementChild
      const panel = wrapper.closest('.audience-panel')
      if (
        !art ||
        art.tagName.toLowerCase() !== 'svg' ||
        !panel ||
        index >= names.length
      )
        return
      const button = wrapper
      button.disabled = reduced.matches
      button.setAttribute('aria-label', 'Pause ' + names[index])
      button.dataset.audienceState = 'idle'
      const state = {
        button: button,
        art: art,
        panel: panel,
        index: index,
        userPaused: false,
        running: false,
        initialized: false,
        generation: 0,
        loops: [],
        bars: [],
      }
      states.push(state)
      scope.listen(button, 'click', function () {
        if (reduced.matches) return
        state.userPaused = !state.userPaused
        button.setAttribute(
          'aria-label',
          (state.userPaused ? 'Resume ' : 'Pause ') + names[index],
        )
        sync(state)
      })
    })
  if (!states.length) return
  section.dataset.audienceMotionReady = 'true'
  scope.onDispose(() => {
    delete section.dataset.audienceMotionReady
  })

  function visible(state) {
    const box = state.button.getBoundingClientRect()
    return (
      state.button.isConnected &&
      box.width > 0 &&
      box.height > 0 &&
      box.bottom > 0 &&
      box.top < window.innerHeight &&
      box.right > 0 &&
      box.left < window.innerWidth
    )
  }

  function allowed(state) {
    return (
      pageActive &&
      !document.hidden &&
      !reduced.matches &&
      !state.userPaused &&
      visible(state)
    )
  }

  function createMinerLoops(state) {
    const find = function (role) {
      return state.art.querySelector('[data-audience="' + role + '"]')
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
        state.loops.push(animation)
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

  function createBars(state) {
    ;['left', 'right'].forEach(function (side) {
      for (let row = 1; row <= 6; row += 1) {
        const element = state.art.querySelector(
          '[data-audience="depth-' + side + '-' + row + '"]',
        )
        if (!element || element.tagName.toLowerCase() !== 'rect') continue
        const width = parseFloat(element.getAttribute('width'))
        if (!(width > 0)) continue
        state.bars.push({
          element: element,
          left: side === 'left',
          maximum: side === 'left' ? 82 : 79,
          width: width,
          target: width,
          duration: 0,
          animation: null,
          finished: false,
          failed: false,
        })
      }
    })
  }

  function startLeg(state, bar, fromWidth) {
    if (!state.running || !allowed(state) || bar.failed) return
    const span = bar.maximum - 16
    let target = 16 + Math.random() * span
    // Keep each newly sampled movement visible without creating a repeating pattern.
    if (Math.abs(target - fromWidth) < 7)
      target = 16 + ((target - 16 + span / 2) % span)
    const duration = (900 + Math.random() * 1400) * 1.8
    const generation = state.generation
    const previous = bar.animation
    let animation
    try {
      animation = bar.element.animate(
        [
          {
            x: (bar.left ? 99 - fromWidth : 109) + 'px',
            width: fromWidth + 'px',
          },
          { x: (bar.left ? 99 - target : 109) + 'px', width: target + 'px' },
        ],
        {
          duration: duration,
          easing: 'cubic-bezier(.45, 0, .2, 1)',
          iterations: 1,
          fill: 'forwards',
        },
      )
      animation.pause()
      animation.currentTime = 0
    } catch (_) {
      bar.failed = true
      return
    }
    bar.animation = animation
    bar.target = target
    bar.duration = duration
    bar.finished = false
    // Install the new geometry before removing the previous held final frame.
    if (previous) previous.cancel()
    animation.finished.then(
      function () {
        if (state.generation !== generation || bar.animation !== animation)
          return
        bar.width = target
        bar.finished = true
        if (state.running && allowed(state)) startLeg(state, bar, target)
        else sync(state)
      },
      function () {
        /* Cancellation invalidates this leg; it must not spawn another. */
      },
    )
    animation.play()
  }

  function reset(state) {
    state.generation += 1
    state.running = false
    state.loops.forEach(function (animation) {
      animation.cancel()
    })
    state.bars.forEach(function (bar) {
      if (bar.animation) bar.animation.cancel()
    })
    state.loops.length = 0
    state.bars.length = 0
    state.initialized = false
    state.button.dataset.audienceState = 'idle'
    delete state.panel.dataset.minerRunning
  }

  function sync(state) {
    state.button.disabled = reduced.matches
    if (reduced.matches) {
      if (state.initialized || state.running) reset(state)
      return
    }
    state.running = allowed(state)
    if (state.running && !state.initialized) {
      state.initialized = true
      if (state.index === 0) createMinerLoops(state)
      else createBars(state)
    }
    if (state.index === 0) {
      state.loops.forEach(function (animation) {
        if (state.running && animation.playState !== 'running') animation.play()
        else if (!state.running && animation.playState !== 'paused')
          animation.pause()
      })
      if (state.running) state.panel.dataset.minerRunning = 'true'
      else delete state.panel.dataset.minerRunning
    } else {
      state.bars.forEach(function (bar) {
        const animation = bar.animation
        if (!state.running) {
          if (animation && animation.playState !== 'paused') animation.pause()
          return
        }
        if (!animation) {
          startLeg(state, bar, bar.width)
          return
        }
        // A finish callback may be queued during a pause/resume. Replacing the
        // leg changes its identity, so the old callback cannot create a duplicate.
        const atEnd =
          typeof animation.currentTime === 'number' &&
          animation.currentTime >= bar.duration
        if (bar.finished || animation.playState === 'finished' || atEnd) {
          startLeg(state, bar, bar.target)
        } else if (animation.playState !== 'running') {
          animation.play()
        }
      })
    }
    state.button.dataset.audienceState = state.running
      ? 'playing'
      : state.initialized
        ? 'paused'
        : 'idle'
  }

  function syncAll() {
    states.forEach(sync)
  }

  if ('IntersectionObserver' in window) {
    const byElement = new Map(
      states.map(function (state) {
        return [state.button, state]
      }),
    )
    const observer = scope.intersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const state = byElement.get(entry.target)
          if (state) sync(state)
        })
      },
      { threshold: 0 },
    )
    states.forEach(function (state) {
      observer.observe(state.button)
    })
  } else {
    scope.listen(window, 'scroll', syncAll, { passive: true })
  }
  if (typeof reduced.addEventListener === 'function')
    scope.listen(reduced, 'change', syncAll)
  else scope.listenMedia(reduced, syncAll)
  scope.listen(document, 'visibilitychange', syncAll)
  scope.listen(window, 'pagehide', function () {
    pageActive = false
    syncAll()
  })
  scope.listen(window, 'pageshow', function () {
    pageActive = true
    syncAll()
  })
  // Geometry is expressed in SVG units, so resizing preserves the current phase.
  scope.listen(window, 'resize', syncAll, { passive: true })
  syncAll()

  scope.onDispose(() => {
    pageActive = false
    syncAll()
  })
}

function initReasons(root, scope) {
  const section = root.querySelector('.why-section')
  if (!section || typeof Element.prototype.animate !== 'function') return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktop = window.matchMedia('(min-width: 901px)')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const easeOut = 'cubic-bezier(.22, 1, .36, 1)'
  const easeTravel = 'cubic-bezier(.4, 0, .2, 1)'
  const labels = [
    'Replay measurable drivers illustration',
    'Replay different market views illustration',
    'Replay Bitcoin verification illustration',
  ]
  const states = []
  const entryTimers = new Set()
  let entryStarted = reduced.matches
  let manualOwner = null

  section
    .querySelectorAll('.why-panel .why-art-control')
    .forEach(function (wrapper, index) {
      const art = wrapper.firstElementChild
      const panel = wrapper.closest('.why-panel')
      if (
        !art ||
        art.tagName.toLowerCase() !== 'svg' ||
        !panel ||
        index >= labels.length
      )
        return
      const button = wrapper
      button.setAttribute('aria-label', labels[index])
      button.disabled = reduced.matches
      button.dataset.whyState = 'idle'
      const state = {
        button: button,
        art: art,
        panel: panel,
        index: index,
        seen: reduced.matches,
        inView: false,
        entryQueued: false,
        playing: false,
        token: 0,
        hoverTimer: null,
        pointerInside: false,
        hoverPlayed: false,
        animations: new Set(),
      }
      states.push(state)

      // The full panel previews on deliberate hover; only the art is clickable.
      scope.listen(panel, 'pointerenter', function (event) {
        if (
          !finePointer.matches ||
          event.pointerType === 'touch' ||
          reduced.matches
        )
          return
        state.pointerInside = true
        state.hoverPlayed = false
        clearHover(state)
        state.hoverTimer = scope.timeout(function () {
          state.hoverTimer = null
          if (!state.pointerInside || state.hoverPlayed) return
          state.hoverPlayed = true
          requestManual(state)
        }, 120)
      })
      scope.listen(panel, 'pointerleave', function () {
        state.pointerInside = false
        clearHover(state)
      })
      scope.listen(panel, 'pointercancel', function () {
        state.pointerInside = false
        clearHover(state)
      })
      scope.listen(button, 'focus', function () {
        if (button.matches(':focus-visible')) requestManual(state)
      })
      scope.listen(button, 'click', function () {
        requestManual(state)
      })
    })
  if (!states.length) return
  section.dataset.whyMotionReady = 'true'
  scope.onDispose(() => {
    delete section.dataset.whyMotionReady
  })

  function clearHover(state) {
    if (state.hoverTimer !== null) window.clearTimeout(state.hoverTimer)
    state.hoverTimer = null
  }

  function cancelEntry() {
    entryTimers.forEach(function (timer) {
      window.clearTimeout(timer)
    })
    entryTimers.clear()
    states.forEach(function (state) {
      state.entryQueued = false
    })
  }

  function stop(state) {
    clearHover(state)
    state.token += 1
    state.animations.forEach(function (animation) {
      animation.cancel()
    })
    state.animations.clear()
    state.playing = false
    state.button.dataset.whyState = 'idle'
    delete state.panel.dataset.whyActive
    if (manualOwner === state) manualOwner = null
  }

  function onScreen(state) {
    const bounds = state.button.getBoundingClientRect()
    return (
      bounds.width > 0 &&
      bounds.height > 0 &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      bounds.right > 0 &&
      bounds.left < window.innerWidth
    )
  }

  function requestManual(state) {
    if (reduced.matches || document.hidden || !onScreen(state)) return
    cancelEntry()
    entryStarted = true
    states.forEach(function (other) {
      clearHover(other)
      if (desktop.matches) other.seen = true
      if (other !== state) stop(other)
    })
    state.seen = true
    manualOwner = state
    // A focus/click pair or repeated hover cannot restart an active scene.
    if (!state.playing) play(state)
  }

  function startEntry() {
    if (entryStarted || reduced.matches || document.hidden || manualOwner)
      return
    entryStarted = true
    states.forEach(function (state, index) {
      state.entryQueued = true
      const timer = scope.timeout(function () {
        entryTimers.delete(timer)
        state.entryQueued = false
        if (manualOwner || !onScreen(state)) return
        state.seen = true
        play(state)
      }, index * 350)
      entryTimers.add(timer)
    })
  }

  function play(state) {
    if (
      state.playing ||
      reduced.matches ||
      document.hidden ||
      !state.button.isConnected ||
      !onScreen(state)
    )
      return
    state.playing = true
    state.button.dataset.whyState = 'playing'
    state.panel.dataset.whyActive = 'true'
    const token = ++state.token
    const jobs = []
    const find = function (role) {
      return state.art.querySelector('[data-why="' + role + '"]')
    }

    function animate(element, frames, duration, delay, easing) {
      if (!element) return
      let animation
      try {
        animation = element.animate(frames, {
          duration: duration,
          delay: delay || 0,
          easing: easing || easeOut,
          fill: 'backwards',
          iterations: 1,
        })
      } catch (_) {
        return // Unsupported effects leave the complete static artwork intact.
      }
      state.animations.add(animation)
      jobs.push(
        animation.finished.then(
          function () {
            state.animations.delete(animation)
            animation.cancel()
          },
          function () {
            state.animations.delete(animation)
          },
        ),
      )
    }

    function strokeLength(path, subpaths) {
      if (!path || typeof path.getTotalLength !== 'function') return 0
      let length
      try {
        length = path.getTotalLength() / (subpaths || 1)
      } catch (_) {
        return 0
      }
      const style = getComputedStyle(path)
      if (style.vectorEffect === 'non-scaling-stroke') {
        const matrix = path.getScreenCTM()
        if (matrix) length *= Math.hypot(matrix.a, matrix.b)
      }
      return length + (parseFloat(style.strokeWidth) || 1) * 2
    }

    function revealStroke(path, duration, delay, hold, subpaths) {
      const length = strokeLength(path, subpaths)
      if (!(length > 0)) return
      const dash = length + ' ' + length
      const finish = hold ? duration / (duration + hold) : 1
      const frames = [
        { strokeDasharray: dash, strokeDashoffset: length, offset: 0 },
        { strokeDasharray: dash, strokeDashoffset: 0, offset: finish },
      ]
      if (hold)
        frames.push({ strokeDasharray: dash, strokeDashoffset: 0, offset: 1 })
      animate(path, frames, duration + (hold || 0), delay, 'linear')
    }

    function traceOverlay(path, duration, delay) {
      const length = strokeLength(path)
      if (!(length > 0)) return
      const dash = length + ' ' + length
      animate(
        path,
        [
          {
            opacity: 0,
            strokeDasharray: dash,
            strokeDashoffset: length,
            offset: 0,
          },
          {
            opacity: 1,
            strokeDasharray: dash,
            strokeDashoffset: length,
            offset: 0.04,
          },
          {
            opacity: 1,
            strokeDasharray: dash,
            strokeDashoffset: 0,
            offset: 0.78,
          },
          { opacity: 0, strokeDasharray: dash, strokeDashoffset: 0, offset: 1 },
        ],
        duration,
        delay,
        'linear',
      )
    }

    function packetAlong(packet, path, duration, delay) {
      if (!packet || !path || typeof path.getPointAtLength !== 'function')
        return
      let length
      try {
        length = path.getTotalLength()
      } catch (_) {
        return
      }
      if (!(length > 0)) return
      const frames = []
      for (let index = 0; index <= 32; index += 1) {
        const point = path.getPointAtLength((length * index) / 32)
        frames.push({
          transform: 'translate(' + point.x + 'px, ' + point.y + 'px)',
          opacity: index === 0 || index === 32 ? 0 : 1,
          offset: index / 32,
        })
      }
      animate(packet, frames, duration, delay, easeTravel)
    }

    function strokePulse(element, accent, duration, delay) {
      if (!element) return
      const resting =
        element.getAttribute('stroke') || getComputedStyle(element).stroke
      animate(
        element,
        [
          { stroke: resting, offset: 0 },
          { stroke: accent, offset: 0.3 },
          { stroke: accent, offset: 0.65 },
          { stroke: resting, offset: 1 },
        ],
        duration,
        delay,
        easeTravel,
      )
    }

    function outlinePulse(element, duration, delay, peak) {
      animate(
        element,
        [
          { opacity: 0, offset: 0 },
          { opacity: peak || 0.85, offset: 0.28 },
          { opacity: peak || 0.85, offset: 0.58 },
          { opacity: 0, offset: 1 },
        ],
        duration,
        delay,
        easeTravel,
      )
    }

    if (state.index === 0) {
      // Inputs converge on the ASIC, then its output is measured on the plot.
      outlinePulse(find('input-btc-ring'), 600, 0, 0.8)
      revealStroke(find('price-signal'), 520, 0)
      strokePulse(find('energy-frame'), '#B7CFF3', 650, 0)
      traceOverlay(find('input-btc-trace'), 650, 150)
      traceOverlay(find('input-energy-trace'), 650, 150)
      packetAlong(find('btc-packet'), find('input-btc-trace'), 520, 240)
      packetAlong(find('energy-packet'), find('input-energy-trace'), 520, 240)
      for (let core = 1; core <= 4; core += 1) {
        const frame = find('core-' + core)
        if (!frame) continue
        const restingStroke = getComputedStyle(frame).stroke
        animate(
          frame,
          [
            {
              fill: '#E7F0FF',
              fillOpacity: 0,
              stroke: restingStroke,
              offset: 0,
            },
            {
              fill: '#E7F0FF',
              fillOpacity: 0.2,
              stroke: '#FFFFFF',
              offset: 0.3,
            },
            {
              fill: '#E7F0FF',
              fillOpacity: 0.2,
              stroke: '#FFFFFF',
              offset: 0.6,
            },
            {
              fill: '#E7F0FF',
              fillOpacity: 0,
              stroke: restingStroke,
              offset: 1,
            },
          ],
          500,
          700 + (core - 1) * 100,
          easeTravel,
        )
      }
      outlinePulse(find('chip-outline'), 650, 800, 0.8)
      traceOverlay(find('output-trace'), 550, 1200)
      revealStroke(find('hashrate-signal'), 900, 1500)
      animate(
        find('hashrate-area'),
        [{ opacity: 0 }, { opacity: 0.09 }],
        650,
        1750,
      )
      animate(
        find('hashrate-point'),
        [{ opacity: 0 }, { opacity: 1 }],
        180,
        2320,
      )
    } else if (state.index === 1) {
      revealStroke(find('history'), 650, 0)
      animate(find('origin'), [{ opacity: 0.35 }, { opacity: 1 }], 200, 650)
      outlinePulse(find('origin-ring'), 500, 600, 0.9)
      // The two views share identical timing and strength; neither is chosen.
      revealStroke(find('view-up'), 800, 850, 550)
      revealStroke(find('view-down'), 800, 850, 550)
      ;['view-up-head', 'view-down-head'].forEach(function (role) {
        animate(
          find(role),
          [
            { opacity: 0, offset: 0 },
            { opacity: 1, offset: 150 / 550 },
            { opacity: 1, offset: 1 },
          ],
          550,
          1650,
          'linear',
        )
      })
    } else if (state.index === 2) {
      // The chain establishes the source, then measurement and verification resolve.
      ;[1, 2, 3].forEach(function (block, index) {
        const group = find('block-' + block)
        const face = group && group.querySelector('rect:nth-of-type(2)')
        strokePulse(face, '#C4DAFA', 650, index * 280)
      })
      revealStroke(find('block-link-1'), 360, 180)
      revealStroke(find('block-link-2'), 360, 460)
      traceOverlay(find('output-trace'), 650, 850)
      traceOverlay(find('measurement-trace'), 700, 1200)
      strokePulse(find('measurement-marker'), '#FFFFFF', 650, 1550)
      revealStroke(find('verification-tick'), 420, 1820)
      strokePulse(find('verification-frame'), '#C4DAFA', 650, 1740)
    }

    Promise.all(jobs).then(function () {
      if (state.token !== token) return
      state.playing = false
      state.button.dataset.whyState = 'idle'
      delete state.panel.dataset.whyActive
      if (manualOwner === state) manualOwner = null
    })
  }

  if ('IntersectionObserver' in window) {
    const byElement = new Map(
      states.map(function (state) {
        return [state.button, state]
      }),
    )
    const observer = scope.intersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const state = byElement.get(entry.target)
          if (!state) return
          state.inView = entry.isIntersecting
          if (!entry.isIntersecting) {
            stop(state)
            return
          }
          if (entry.intersectionRatio < 0.45 || state.seen || state.entryQueued)
            return
          if (desktop.matches && !entryStarted) {
            startEntry()
          } else if (!manualOwner) {
            // A panel that was outside the first tour still gets its first reveal.
            state.seen = true
            play(state)
          }
        })
        if (
          !states.some(function (state) {
            return state.inView
          })
        )
          cancelEntry()
      },
      { threshold: [0, 0.45] },
    )
    states.forEach(function (state) {
      observer.observe(state.button)
    })
  } else {
    // Static entry remains useful without observation; explicit replay still works.
    const cancelOffscreen = function () {
      states.forEach(function (state) {
        if (!onScreen(state)) stop(state)
      })
    }
    scope.listen(window, 'scroll', cancelOffscreen, { passive: true })
    scope.listen(window, 'resize', cancelOffscreen, { passive: true })
  }

  function stopAll() {
    cancelEntry()
    states.forEach(stop)
    manualOwner = null
  }
  function updatePreference() {
    stopAll()
    entryStarted = true
    states.forEach(function (state) {
      state.seen = true
      state.button.disabled = reduced.matches
    })
  }
  function updateLayout() {
    stopAll()
    entryStarted = states.some(function (state) {
      return state.seen
    })
  }
  let artSizes = states.map(function (state) {
    const bounds = state.art.getBoundingClientRect()
    return { width: bounds.width, height: bounds.height }
  })
  function updateArtSize() {
    let changed = false
    const next = states.map(function (state, index) {
      const bounds = state.art.getBoundingClientRect()
      if (
        Math.abs(bounds.width - artSizes[index].width) > 0.5 ||
        Math.abs(bounds.height - artSizes[index].height) > 0.5
      )
        changed = true
      return { width: bounds.width, height: bounds.height }
    })
    artSizes = next
    if (changed) updateLayout()
  }
  if (typeof reduced.addEventListener === 'function')
    scope.listen(reduced, 'change', updatePreference)
  else scope.listenMedia(reduced, updatePreference)
  if (typeof desktop.addEventListener === 'function')
    scope.listen(desktop, 'change', updateLayout)
  else scope.listenMedia(desktop, updateLayout)
  scope.listen(document, 'visibilitychange', function () {
    if (document.hidden) stopAll()
  })
  scope.listen(window, 'pagehide', stopAll)
  scope.listen(window, 'resize', updateArtSize, { passive: true })

  scope.onDispose(stopAll)
}

function initWalkthrough(root, scope) {
  const section = root.querySelector('.how-section')
  if (!section || typeof Element.prototype.animate !== 'function') return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const desktop = window.matchMedia('(min-width: 901px)')
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
  const easeOut = 'cubic-bezier(.22, 1, .36, 1)'
  const easeTravel = 'cubic-bezier(.4, 0, .2, 1)'
  const entryPace = 0.68
  const handoffEnds = [1890, 1910, 2060]
  const labels = [
    'Replay market selection illustration',
    'Replay account funding illustration',
    'Replay position choice illustration',
    'Replay trade or settlement illustration',
  ]
  const states = []
  const tourTimers = new Set()
  let tourStarted = reduced.matches
  let manualOwner = null

  section
    .querySelectorAll('.how-step .how-art-control')
    .forEach(function (wrapper, index) {
      const art = wrapper.querySelector('.how-art')
      if (!art || index >= labels.length) return
      const button = wrapper
      button.setAttribute('aria-label', labels[index])
      button.disabled = reduced.matches
      button.dataset.motionState = 'idle'
      const state = {
        button: button,
        art: art,
        step: button.closest('.how-step'),
        index: index,
        seen: reduced.matches,
        inView: false,
        playing: false,
        kind: null,
        token: 0,
        hoverTimer: null,
        pointerInside: false,
        hoverPlayed: false,
        animations: new Set(),
      }
      states.push(state)

      scope.listen(button, 'pointerenter', function (event) {
        if (
          !finePointer.matches ||
          event.pointerType === 'touch' ||
          reduced.matches
        )
          return
        state.pointerInside = true
        state.hoverPlayed = false
        clearHover(state)
        state.hoverTimer = scope.timeout(function () {
          state.hoverTimer = null
          if (!state.pointerInside || state.hoverPlayed) return
          state.hoverPlayed = true
          requestManual(state)
        }, 120)
      })
      scope.listen(button, 'pointerleave', function () {
        state.pointerInside = false
        clearHover(state)
      })
      scope.listen(button, 'pointercancel', function () {
        state.pointerInside = false
        clearHover(state)
      })
      scope.listen(button, 'focus', function () {
        if (button.matches(':focus-visible')) requestManual(state)
      })
      scope.listen(button, 'click', function () {
        requestManual(state)
      })
    })
  if (!states.length) return
  section.dataset.motionReady = 'true'
  scope.onDispose(() => {
    delete section.dataset.motionReady
  })

  function clearHover(state) {
    if (state.hoverTimer !== null) window.clearTimeout(state.hoverTimer)
    state.hoverTimer = null
  }

  function cancelTour() {
    tourTimers.forEach(function (timer) {
      window.clearTimeout(timer)
    })
    tourTimers.clear()
  }

  function stop(state) {
    clearHover(state)
    state.token += 1
    state.animations.forEach(function (animation) {
      animation.cancel()
    })
    state.animations.clear()
    state.playing = false
    state.kind = null
    state.button.dataset.motionState = 'idle'
    delete state.step.dataset.motionActive
    if (manualOwner === state) manualOwner = null
  }

  function onScreen(state) {
    const bounds = state.button.getBoundingClientRect()
    return (
      bounds.width > 0 &&
      bounds.height > 0 &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      bounds.right > 0 &&
      bounds.left < window.innerWidth
    )
  }

  function requestManual(state) {
    if (reduced.matches || document.hidden || !onScreen(state)) return
    cancelTour()
    tourStarted = true
    states.forEach(function (other) {
      clearHover(other)
      if (desktop.matches) other.seen = true
      if (other !== state) stop(other)
    })
    state.seen = true
    manualOwner = state
    // Hover, focus and click may arrive together. Keep the current run intact.
    if (state.playing) {
      state.kind = 'manual'
      return
    }
    play(state, 'manual')
  }

  function startTour() {
    if (tourStarted || reduced.matches || document.hidden || manualOwner) return
    tourStarted = true
    let nextStart = 0
    states.forEach(function (state, index) {
      state.seen = true
      const timer = scope.timeout(function () {
        tourTimers.delete(timer)
        if (!manualOwner && onScreen(state)) play(state, 'entry')
      }, nextStart)
      nextStart += (handoffEnds[index] || 0) * entryPace
      tourTimers.add(timer)
    })
  }

  function play(state, kind) {
    if (
      state.playing ||
      reduced.matches ||
      document.hidden ||
      !state.button.isConnected ||
      !onScreen(state)
    )
      return
    state.playing = true
    state.kind = kind
    state.button.dataset.motionState = 'playing'
    state.step.dataset.motionActive = 'true'
    const token = ++state.token
    const jobs = []
    const pace = kind === 'entry' && desktop.matches ? entryPace : 1
    const find = function (role) {
      return state.art.querySelector('[data-motion="' + role + '"]')
    }

    function animate(element, frames, duration, delay, easing) {
      if (!element) return
      let animation
      try {
        animation = element.animate(frames, {
          duration: duration * pace,
          delay: (delay || 0) * pace,
          easing: easing || easeOut,
          fill: 'backwards',
          iterations: 1,
        })
      } catch (_) {
        return
      }
      state.animations.add(animation)
      jobs.push(
        animation.finished.then(
          function () {
            state.animations.delete(animation)
            animation.cancel()
          },
          function () {
            state.animations.delete(animation)
          },
        ),
      )
    }

    function timeline(element, frames, duration) {
      const total = duration || 2200
      animate(
        element,
        frames.map(function (frame) {
          const result = Object.assign({}, frame)
          result.offset = result.at / total
          delete result.at
          result.easing = result.easing || easeTravel
          return result
        }),
        total,
        0,
        'linear',
      )
    }

    function pulse(element, accent, duration, delay) {
      if (!element) return
      const resting =
        element.getAttribute('stroke') || getComputedStyle(element).stroke
      animate(
        element,
        [
          { stroke: resting, offset: 0 },
          { stroke: accent, offset: 0.35 },
          { stroke: accent, offset: 0.65 },
          { stroke: resting, offset: 1 },
        ],
        duration,
        delay,
        easeTravel,
      )
    }

    function lengthForStroke(path) {
      if (!path || typeof path.getTotalLength !== 'function') return 0
      let length
      try {
        length = path.getTotalLength()
      } catch (_) {
        return 0
      }
      const style = getComputedStyle(path)
      if (style.vectorEffect === 'non-scaling-stroke') {
        const matrix = path.getScreenCTM()
        if (matrix) length *= Math.hypot(matrix.a, matrix.b)
      }
      return length + (parseFloat(style.strokeWidth) || 1) * 2
    }

    function drawOverlay(path, duration, delay) {
      const length = lengthForStroke(path)
      if (!(length > 0)) return
      const dash = length + ' ' + length
      animate(
        path,
        [
          {
            opacity: 0,
            strokeDasharray: dash,
            strokeDashoffset: length,
            offset: 0,
          },
          {
            opacity: 1,
            strokeDasharray: dash,
            strokeDashoffset: length,
            offset: 0.06,
          },
          {
            opacity: 1,
            strokeDasharray: dash,
            strokeDashoffset: 0,
            offset: 0.76,
          },
          { opacity: 0, strokeDasharray: dash, strokeDashoffset: 0, offset: 1 },
        ],
        duration,
        delay,
        'linear',
      )
    }

    function travelPacket(packet, path, duration, delay) {
      if (!packet || !path || typeof path.getPointAtLength !== 'function')
        return
      let length
      try {
        length = path.getTotalLength()
      } catch (_) {
        return
      }
      if (!(length > 0)) return
      const frames = []
      for (let index = 0; index <= 40; index += 1) {
        const progress = index / 40
        const point = path.getPointAtLength(length * progress)
        frames.push({
          transform: 'translate(' + point.x + 'px, ' + point.y + 'px)',
          opacity: index === 0 || index === 40 ? 0 : 1,
          offset: progress,
        })
      }
      animate(packet, frames, duration, delay, easeTravel)
    }

    function handoff(delay) {
      const signal = state.step.querySelector('.how-handoff i')
      if (!signal) return
      const track = signal.parentElement
      const vertical = !desktop.matches
      const distance = Math.max(
        0,
        vertical
          ? track.clientHeight - signal.offsetHeight
          : track.clientWidth - signal.offsetWidth,
      )
      const travel = vertical
        ? 'translateY(' + distance + 'px)'
        : 'translateX(' + distance + 'px)'
      animate(
        signal,
        [
          { opacity: 0, transform: 'translate(0, 0)', offset: 0 },
          { opacity: 1, transform: 'translate(0, 0)', offset: 0.12 },
          { opacity: 1, transform: travel, offset: 0.86 },
          { opacity: 0, transform: travel, offset: 1 },
        ],
        380,
        delay,
        easeTravel,
      )
    }

    if (kind === 'entry') {
      animate(
        find('scene'),
        [
          { opacity: 0.55, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        340,
        0,
      )
    }

    if (state.index === 0) {
      timeline(find('cursor'), [
        { at: 0, transform: 'translate(24px, 24px)', opacity: 0 },
        { at: 180, transform: 'translate(18px, 14px)', opacity: 1 },
        { at: 480, transform: 'translate(0, -31px)', opacity: 1 },
        { at: 760, transform: 'translate(0, -31px)', opacity: 1 },
        { at: 1080, transform: 'translate(0, 0)', opacity: 1 },
        { at: 1180, transform: 'translate(0, 2px)', opacity: 1 },
        { at: 1300, transform: 'translate(0, 0)', opacity: 1 },
        { at: 2200, transform: 'translate(0, 0)', opacity: 1 },
      ])
      timeline(find('selection-group'), [
        { at: 0, transform: 'translateY(-31px)', opacity: 0.35 },
        { at: 480, transform: 'translateY(-31px)', opacity: 0.72 },
        { at: 760, transform: 'translateY(-31px)', opacity: 0.72 },
        { at: 1120, transform: 'translateY(0)', opacity: 1 },
        { at: 2200, transform: 'translateY(0)', opacity: 1 },
      ])
      pulse(find('selection'), '#B9CEFF', 640, 1060)
      animate(find('radio'), [{ opacity: 0.3 }, { opacity: 1 }], 250, 1120)
      animate(
        find('click-ring'),
        [
          { opacity: 0, transform: 'scale(.45)', offset: 0 },
          { opacity: 0.75, transform: 'scale(.8)', offset: 0.18 },
          { opacity: 0, transform: 'scale(2.25)', offset: 1 },
        ],
        520,
        1120,
      )
      handoff(1510)
    } else if (state.index === 1) {
      animate(
        find('receipt'),
        [
          { opacity: 0.65, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        420,
        0,
      )
      timeline(find('coin'), [
        { at: 0, transform: 'translateY(0)', opacity: 1 },
        { at: 300, transform: 'translateY(-12px)', opacity: 1 },
        { at: 540, transform: 'translateY(-12px)', opacity: 1 },
        { at: 1080, transform: 'translateY(68px)', opacity: 1 },
        { at: 1400, transform: 'translateY(68px)', opacity: 0 },
        { at: 1510, transform: 'translateY(0)', opacity: 0 },
        { at: 1900, transform: 'translateY(0)', opacity: 0 },
        { at: 2200, transform: 'translateY(0)', opacity: 1 },
      ])
      pulse(find('opening'), '#B5CEEF', 1050, 330)
      drawOverlay(find('deposit-trail'), 830, 530)
      animate(
        find('latch'),
        [
          { transform: 'translateX(0)', offset: 0 },
          { transform: 'translateX(4px)', offset: 0.35 },
          { transform: 'translateX(0)', offset: 1 },
        ],
        480,
        980,
        easeTravel,
      )
      animate(
        find('wallet-confirm'),
        [
          { opacity: 0, offset: 0 },
          { opacity: 0.9, offset: 0.3 },
          { opacity: 0, offset: 1 },
        ],
        750,
        1150,
      )
      handoff(1530)
    } else if (state.index === 2) {
      timeline(find('above-card'), [
        { at: 0, transform: 'translateY(20px) scale(.9)', opacity: 0.35 },
        { at: 420, transform: 'translateY(0) scale(1)', opacity: 1 },
        { at: 580, transform: 'scale(1)', opacity: 1 },
        { at: 730, transform: 'scale(1.035)', opacity: 1 },
        { at: 920, transform: 'scale(1.035)', opacity: 1 },
        { at: 1080, transform: 'scale(1)', opacity: 1 },
        { at: 2200, transform: 'scale(1)', opacity: 1 },
      ])
      timeline(find('below-card'), [
        { at: 0, transform: 'translateY(-20px) scale(.9)', opacity: 0.35 },
        { at: 420, transform: 'translateY(0) scale(1)', opacity: 1 },
        { at: 1120, transform: 'scale(1)', opacity: 1 },
        { at: 1270, transform: 'scale(1.035)', opacity: 1 },
        { at: 1460, transform: 'scale(1.035)', opacity: 1 },
        { at: 1620, transform: 'scale(1)', opacity: 1 },
        { at: 2200, transform: 'scale(1)', opacity: 1 },
      ])
      drawOverlay(find('threshold-scan'), 680, 100)
      pulse(find('above'), '#8BDCB4', 500, 580)
      pulse(find('below'), '#F3A4AA', 500, 1120)
      animate(
        find('above-arrow'),
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-5px)', offset: 0.45 },
          { transform: 'translateY(0)' },
        ],
        500,
        580,
        easeTravel,
      )
      animate(
        find('below-arrow'),
        [
          { transform: 'translateY(0)' },
          { transform: 'translateY(5px)', offset: 0.45 },
          { transform: 'translateY(0)' },
        ],
        500,
        1120,
        easeTravel,
      )
      handoff(1680)
    } else if (state.index === 3) {
      animate(find('source'), [{ opacity: 0.65 }, { opacity: 1 }], 340, 0)
      const tradePath = find('trade-trace')
      const settlePath = find('settle-trace')
      drawOverlay(tradePath, 800, 200)
      travelPacket(find('packet-trade'), tradePath, 640, 240)
      drawOverlay(find('exchange-forward-trace'), 480, 640)
      drawOverlay(find('exchange-return-trace'), 480, 820)
      animate(
        find('trade-contract'),
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(3px)', offset: 0.45 },
          { transform: 'translateX(0)' },
        ],
        620,
        620,
        easeTravel,
      )
      animate(
        find('trade-coin'),
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-3px)', offset: 0.45 },
          { transform: 'translateX(0)' },
        ],
        620,
        800,
        easeTravel,
      )
      drawOverlay(settlePath, 830, 1040)
      travelPacket(find('packet-settle'), settlePath, 640, 1080)
      animate(
        find('sand-top'),
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0.15, transform: 'translateY(4px)', offset: 0.8 },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        800,
        1290,
        easeTravel,
      )
      animate(
        find('sand-bottom'),
        [{ opacity: 0.3 }, { opacity: 1, offset: 0.75 }, { opacity: 1 }],
        650,
        1330,
        easeTravel,
      )
      animate(
        find('sand-stream'),
        [
          { opacity: 0 },
          { opacity: 1, offset: 0.2 },
          { opacity: 1, offset: 0.75 },
          { opacity: 0 },
        ],
        620,
        1340,
        'linear',
      )
      animate(
        find('check'),
        [
          { opacity: 0, offset: 0 },
          { opacity: 0, offset: 0.9 },
          { opacity: 1, offset: 1 },
        ],
        2150,
        0,
        'linear',
      )
      animate(
        find('settle-contract'),
        [{ opacity: 0.72 }, { opacity: 1 }],
        380,
        1650,
      )
      drawOverlay(find('check-trace'), 460, 1690)
    }

    Promise.all(jobs).then(function () {
      if (state.token !== token) return
      state.playing = false
      state.kind = null
      state.button.dataset.motionState = 'idle'
      delete state.step.dataset.motionActive
      if (manualOwner === state) manualOwner = null
    })
  }

  if ('IntersectionObserver' in window) {
    const byElement = new Map(
      states.map(function (state) {
        return [state.button, state]
      }),
    )
    const observer = scope.intersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          const state = byElement.get(entry.target)
          if (!state) return
          state.inView = entry.isIntersecting
          if (!entry.isIntersecting) {
            stop(state)
            return
          }
          if (entry.intersectionRatio < 0.45 || state.seen) return
          if (desktop.matches) {
            startTour()
          } else {
            state.seen = true
            if (!manualOwner) play(state, 'entry')
          }
        })
        if (
          !states.some(function (state) {
            return state.inView
          })
        )
          cancelTour()
      },
      { threshold: [0, 0.45] },
    )
    states.forEach(function (state) {
      observer.observe(state.button)
    })
  } else {
    const cancelOffscreen = function () {
      states.forEach(function (state) {
        if (!onScreen(state)) stop(state)
      })
    }
    scope.listen(window, 'scroll', cancelOffscreen, { passive: true })
    scope.listen(window, 'resize', cancelOffscreen, { passive: true })
  }

  function stopAll() {
    cancelTour()
    states.forEach(stop)
    manualOwner = null
  }
  function updatePreference() {
    stopAll()
    tourStarted = true
    states.forEach(function (state) {
      state.seen = true
      state.button.disabled = reduced.matches
    })
  }
  function updateLayout() {
    stopAll()
    tourStarted = true
    states.forEach(function (state) {
      state.seen = true
    })
  }
  if (typeof reduced.addEventListener === 'function')
    scope.listen(reduced, 'change', updatePreference)
  else scope.listenMedia(reduced, updatePreference)
  if (typeof desktop.addEventListener === 'function')
    scope.listen(desktop, 'change', updateLayout)
  else scope.listenMedia(desktop, updateLayout)
  scope.listen(document, 'visibilitychange', function () {
    if (document.hidden) stopAll()
  })
  scope.listen(window, 'pagehide', stopAll)

  scope.onDispose(stopAll)
}

// Keep prototype effects tied to this route, including on client-side navigation.
export function mountApprovedLandingMotion(root) {
  const disposers = []
  const controller = new AbortController()
  const timers = new Set()
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
    timeout(callback, delay) {
      const timer = window.setTimeout(() => {
        timers.delete(timer)
        callback()
      }, delay)
      timers.add(timer)
      return timer
    },
    onDispose(callback) {
      disposers.push(callback)
    },
  }

  initCarousel(root, scope)
  initChart(root, scope)
  initAudience(root, scope)
  initReasons(root, scope)
  initWalkthrough(root, scope)

  return () => {
    controller.abort()
    timers.forEach((timer) => window.clearTimeout(timer))
    disposers.reverse().forEach((dispose) => dispose())
  }
}

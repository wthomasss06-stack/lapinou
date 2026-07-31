export type ViewportMetrics = {
  vw: number
  vh: number
  dvh: number
  isMobile: boolean
  mobileBreakpoint: number
}

const MOBILE_BREAKPOINT = 900

let cached: ViewportMetrics | null = null

function readFromWindow(): ViewportMetrics {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const dvh = window.visualViewport?.height ?? vh

  return {
    vw,
    vh,
    dvh,
    isMobile: vw <= MOBILE_BREAKPOINT - 1,
    mobileBreakpoint: MOBILE_BREAKPOINT,
  }
}

function applyCssVars(metrics: ViewportMetrics) {
  const root = document.documentElement
  root.style.setProperty('--nav-vw', `${metrics.vw}px`)
  root.style.setProperty('--nav-vh', `${metrics.vh}px`)
  root.style.setProperty('--nav-dvh', `${metrics.dvh}px`)
  root.setAttribute('data-nav-ready', '')
}

/** Calcule une fois les métriques écran (depuis le loader ou au 1er besoin). */
export function ensureViewportMetrics(): ViewportMetrics {
  if (cached) return cached
  if (typeof window === 'undefined') {
    cached = {
      vw: 390,
      vh: 844,
      dvh: 844,
      isMobile: true,
      mobileBreakpoint: MOBILE_BREAKPOINT,
    }
    return cached
  }

  cached = readFromWindow()
  applyCssVars(cached)
  return cached
}

export function getViewportMetrics(): ViewportMetrics {
  return cached ?? ensureViewportMetrics()
}

export function isNavLayoutReady(): boolean {
  return cached !== null
}

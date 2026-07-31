const LOADER_DONE_KEY = 'cf-loader-done'

/** Refresh (F5) → rejouer. Retour client vers l'accueil → sauter. */
export function shouldPlayLoader(): boolean {
  if (typeof window === 'undefined') return true

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (nav?.type === 'reload') return true

  try {
    if (sessionStorage.getItem(LOADER_DONE_KEY) === '1') return false
  } catch {
    // mode privé / quota
  }

  return true
}

export function markLoaderDone(): void {
  try {
    sessionStorage.setItem(LOADER_DONE_KEY, '1')
  } catch {
    // ignore
  }
}

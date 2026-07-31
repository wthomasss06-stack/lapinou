'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'
import Navbar from '@/components/Navbar'
import { ensureViewportMetrics } from '@/lib/viewportMetrics'

/** Navbar persistante (hors /admin) — évite remount + recalcul GSAP à chaque page. */
export default function SiteChrome() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    ensureViewportMetrics()
  }, [])

  if (pathname.startsWith('/admin')) return null

  return <Navbar />
}

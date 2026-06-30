'use client'
import { useEffect } from 'react'

// Enregistre le service worker une fois l'app montée côté client.
// N'a aucun effet en dev par défaut pour éviter les soucis de cache pendant le développement,
// sauf si NEXT_PUBLIC_ENABLE_SW_DEV=1 est explicitement défini.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const isDev = process.env.NODE_ENV === 'development'
    const forceDevSw = process.env.NEXT_PUBLIC_ENABLE_SW_DEV === '1'
    if (isDev && !forceDevSw) return

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Échec silencieux — le site reste utilisable sans PWA
      })
    })
  }, [])

  return null
}

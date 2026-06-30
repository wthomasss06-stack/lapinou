// web/public/sw.js
// Service worker minimal — rend l'app installable (PWA) et garde un fallback
// offline simple pour le shell de l'app. On NE cache PAS les appels /api/*
// (données dynamiques : lapins, réservations) pour éviter d'afficher du stale data.

const CACHE_NAME = 'lapinou-shell-v1'
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS)).catch(() => {})
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // Ne jamais intercepter les appels API (toujours réseau frais)
  if (url.pathname.startsWith('/api') || url.origin !== self.location.origin) {
    return
  }

  // Stratégie network-first avec fallback cache pour le shell statique
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {})
        return response
      })
      .catch(() => caches.match(request))
  )
})

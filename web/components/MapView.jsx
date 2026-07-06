'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Navigation2, MapPin, Locate, AlertTriangle, X } from 'lucide-react'

// Token Mapbox (déjà utilisé dans le projet)
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ''

// Point du Coin Lapin — Azaguié Gare, Côte d'Ivoire
const DEST = { lat: 5.6315, lng: -4.0805, label: 'Coin Lapin · Azaguié Gare' }

// ─── Haversine (distance à vol d'oiseau) ──────────────────────────────────────
function haversine(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const s = x => Math.sin(x / 2) ** 2
  const c = s(dLat) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * s(dLng)
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

// ─── Chargement Mapbox GL JS ──────────────────────────────────────────────────
function loadMapbox() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject()
    if (window.mapboxgl) return resolve(window.mapboxgl)
    if (!document.getElementById('mb-css')) {
      const link = document.createElement('link')
      link.id = 'mb-css'
      link.rel = 'stylesheet'
      link.href = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css'
      document.head.appendChild(link)
    }
    const script = document.createElement('script')
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js'
    script.onload = () => resolve(window.mapboxgl)
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// ─── Récupère l'itinéraire réel depuis l'API Directions Mapbox ────────────────
async function fetchRoute(origin, dest) {
  const url =
    `https://api.mapbox.com/directions/v5/mapbox/driving/` +
    `${origin.lng},${origin.lat};${dest.lng},${dest.lat}` +
    `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
  const r = await fetch(url)
  if (!r.ok) return null
  const data = await r.json()
  return data.routes?.[0] || null
}

export default function MapView() {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const [phase, setPhase]           = useState('idle')    // idle | locating | ready | error
  const [geoError, setGeoError]     = useState('')
  const [userCoords, setUserCoords] = useState(null)
  const [distanceLabel, setDistanceLabel] = useState(null)
  const [durationLabel, setDurationLabel] = useState(null)

  // ── 1. Lecture sessionStorage au montage ────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = sessionStorage.getItem('lapinou_client_location')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p?.lat && p?.lng) setUserCoords({ lat: p.lat, lng: p.lng })
      } catch (_) {}
    }
  }, [])

  // ── 2. Demande de géolocalisation ────────────────────────────────────────────
  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setGeoError('Géolocalisation non supportée par votre navigateur.')
      return
    }
    setPhase('locating')
    setGeoError('')
    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoords(coords)
        sessionStorage.setItem('lapinou_client_location', JSON.stringify(coords))
        window.dispatchEvent(new Event('lapinou_location_ready'))
      },
      err => {
        const msgs = {
          1: "Permission refusée. Autorisez la localisation pour voir l'itinéraire.",
          2: 'Position indisponible. Vérifiez votre GPS.',
          3: 'Délai dépassé. Réessayez.',
        }
        setGeoError(msgs[err.code] || 'Erreur de géolocalisation.')
        setPhase('idle')
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    )
  }, [])

  // ── 3. Initialisation / mise à jour de la carte ──────────────────────────────
  useEffect(() => {
    let mounted = true

    async function buildMap() {
      try {
        const mapboxgl = await loadMapbox()
        if (!mounted || !containerRef.current) return
        mapboxgl.accessToken = MAPBOX_TOKEN

        if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }

        const center = userCoords
          ? [(userCoords.lng + DEST.lng) / 2, (userCoords.lat + DEST.lat) / 2]
          : [DEST.lng, DEST.lat]

        const map = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/dark-v11',
          center,
          zoom: userCoords ? 8 : 11,
          attributionControl: false,
        })
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right')
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right')
        mapRef.current = map

        // ── Marqueur destination (Coin Lapin) ─────────────────────────────────
        const destEl = document.createElement('div')
        destEl.innerHTML = `
          <div style="
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            background:linear-gradient(135deg,#B8834A,#C2693D);
            transform:rotate(-45deg);border:3px solid #050505;
            box-shadow:0 4px 14px rgba(0,0,0,.5);
          "></div>`
        new mapboxgl.Marker({ element: destEl, anchor: 'bottom' })
          .setLngLat([DEST.lng, DEST.lat])
          .setPopup(new mapboxgl.Popup({ offset: 30 }).setHTML(
            `<b style="font-size:13px;color:#050505">🐇 Coin Lapin</b><br/>
             <span style="font-size:11px;color:#A89678">Azaguié Gare, Côte d'Ivoire</span>`
          ))
          .addTo(map)

        if (userCoords) {
          // ── Marqueur utilisateur ───────────────────────────────────────────
          const userEl = document.createElement('div')
          userEl.innerHTML = `
            <div style="position:relative;width:20px;height:20px;">
              <div style="
                width:20px;height:20px;background:#C2693D;border-radius:50%;
                border:3px solid #fff;box-shadow:0 0 0 6px rgba(194,105,61,.25);
                animation:lapinouPulse 2s infinite;
              "></div>
            </div>`
          new mapboxgl.Marker({ element: userEl })
            .setLngLat([userCoords.lng, userCoords.lat])
            .setPopup(new mapboxgl.Popup({ offset: 18 }).setText('📍 Votre position'))
            .addTo(map)

          // ── Distance à vol d'oiseau ────────────────────────────────────────
          const dist = haversine(userCoords, DEST)
          setDistanceLabel(dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`)

          // ── Fit bounds préliminaire ────────────────────────────────────────
          const bounds = new mapboxgl.LngLatBounds()
          bounds.extend([userCoords.lng, userCoords.lat])
          bounds.extend([DEST.lng, DEST.lat])
          map.fitBounds(bounds, { padding: 60, maxZoom: 13 })

          // ── Route réelle via Directions API ───────────────────────────────
          fetchRoute(userCoords, DEST).then(route => {
            if (!route || !mounted) return

            const mins = Math.round(route.duration / 60)
            if (mounted) setDurationLabel(mins < 60 ? `${mins} min` : `${Math.floor(mins/60)}h${String(mins%60).padStart(2,'0')}`)

            map.on('load', () => {
              if (!mounted) return
              if (!map.getSource('route')) {
                map.addSource('route', { type: 'geojson', data: route.geometry })
                // Halo
                map.addLayer({
                  id: 'route-halo', type: 'line', source: 'route',
                  layout: { 'line-join': 'round', 'line-cap': 'round' },
                  paint: { 'line-color': '#B8834A', 'line-width': 10, 'line-opacity': 0.15 },
                })
                // Ligne principale
                map.addLayer({
                  id: 'route-line', type: 'line', source: 'route',
                  layout: { 'line-join': 'round', 'line-cap': 'round' },
                  paint: { 'line-color': '#B8834A', 'line-width': 4, 'line-opacity': 0.9 },
                })
                // Pointillés animés par-dessus
                map.addLayer({
                  id: 'route-dash', type: 'line', source: 'route',
                  layout: { 'line-join': 'round', 'line-cap': 'butt' },
                  paint: { 'line-color': '#fff', 'line-width': 2, 'line-dasharray': [0, 4, 3], 'line-opacity': 0.5 },
                })
              }

              // Re-fit avec la vraie géométrie
              const coords = route.geometry.coordinates
              const b = new mapboxgl.LngLatBounds()
              coords.forEach(c => b.extend(c))
              map.fitBounds(b, { padding: 60, maxZoom: 13 })
            })
          }).catch(() => {})
        }

        if (mounted) setPhase('ready')
      } catch (err) {
        if (mounted) setPhase('error')
      }
    }

    buildMap()
    return () => {
      mounted = false
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null }
    }
  }, [userCoords])

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-wider">
          <MapPin size={13} className="text-caramel" />
          Localisation &amp; itinéraire
        </div>
        {/* Bouton GPS */}
        {!userCoords ? (
          <button
            onClick={requestLocation}
            disabled={phase === 'locating'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                       bg-caramel/15 border border-caramel/30 text-caramel text-[11px] font-semibold
                       hover:bg-caramel/25 active:scale-95 transition-all duration-150
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {phase === 'locating' ? (
              <>
                <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Localisation…
              </>
            ) : (
              <>
                <Locate size={11} />
                Voir mon itinéraire
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => { setUserCoords(null); sessionStorage.removeItem('lapinou_client_location'); setDistanceLabel(null); setDurationLabel(null) }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full
                       bg-brand-card border border-brand-border text-white/30 text-[10px]
                       hover:text-white/60 hover:border-white/20 transition-all duration-150"
          >
            <X size={9} /> Réinitialiser
          </button>
        )}
      </div>

      {/* Carte */}
      <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-darker shadow-inner h-[300px] w-full">
        <div ref={containerRef} className="h-full w-full z-10" />

        {/* Overlay chargement */}
        {(phase === 'idle' || phase === 'locating') && !userCoords && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-darker/90 z-20 gap-3">
            <div className="w-10 h-10 rounded-full bg-caramel/15 border border-caramel/30 flex items-center justify-center">
              <Navigation2 size={18} className="text-caramel" />
            </div>
            <p className="text-white/40 text-xs text-center px-4">
              Cliquez <span className="text-caramel font-semibold">Voir mon itinéraire</span><br />
              pour tracer votre route vers le Coin Lapin
            </p>
          </div>
        )}

        {phase === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-brand-darker/90 z-20">
            <p className="text-white/40 text-xs">Carte indisponible</p>
          </div>
        )}

        {/* Légende superposée */}
        {phase === 'ready' && (
          <div className="absolute bottom-2 left-2 z-20 backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2 rounded-xl text-[10px] space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--green)] shadow-sm shadow-[rgba(var(--green-rgb),0.5)]" />
              <span className="text-white/70">Coin Lapin (Azaguié Gare)</span>
            </div>
            {userCoords && (
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--lime)] shadow-sm shadow-[rgba(var(--lime-rgb),0.5)]" />
                <span className="text-white/70">
                  Votre position
                  {distanceLabel && <> · <span className="text-caramel font-semibold">{distanceLabel}</span></>}
                  {durationLabel && <> · <span className="text-white/50">{durationLabel} en voiture</span></>}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message d'erreur géo */}
      {geoError && (
        <div className="flex items-start gap-2 text-xs text-[var(--lime)] bg-[rgba(var(--lime-rgb),0.1)] border border-[rgba(var(--lime-rgb),0.2)] rounded-xl px-3 py-2">
          <AlertTriangle size={13} className="shrink-0 mt-0.5" />
          <span>{geoError}</span>
        </div>
      )}

      {/* Style animation pulse */}
      <style>{`
        @keyframes lapinouPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(79,172,254,.5); }
          50% { box-shadow: 0 0 0 10px rgba(79,172,254,0); }
        }
      `}</style>
    </div>
  )
}

'use client'
import { useEffect, useRef, useState } from 'react'

const AZAGUIE_COORDS = [5.6315, -4.0805] // Coordonnées d'Azaguié Gare, Côte d'Ivoire

export default function MapView({ clientLat = null, clientLng = null }) {
  const mapContainerRef = useRef(null)
  const mapRef = useRef(null)
  const [clientCoords, setClientCoords] = useState(null)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  // 1. Charge les fichiers Leaflet CDN si non présents
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Injecte CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    // Injecte JS
    if (!window.L) {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => setScriptsLoaded(true)
      document.body.appendChild(script)
    } else {
      setScriptsLoaded(true)
    }
  }, [])

  // 2. Détermine la position du client (prop ou sessionStorage)
  useEffect(() => {
    if (clientLat && clientLng) {
      setClientCoords([parseFloat(clientLat), parseFloat(clientLng)])
    } else {
      const localLoc = sessionStorage.getItem('lapinou_client_location')
      if (localLoc) {
        try {
          const parsed = JSON.parse(localLoc)
          if (parsed && parsed.lat && parsed.lng) {
            setClientCoords([parsed.lat, parsed.lng])
          }
        } catch (e) {
          console.error(e)
        }
      }
    }

    // Ecoute les mises à jour de position
    const handleLocationReady = () => {
      const updatedLoc = sessionStorage.getItem('lapinou_client_location')
      if (updatedLoc) {
        const parsed = JSON.parse(updatedLoc)
        setClientCoords([parsed.lat, parsed.lng])
      }
    }
    window.addEventListener('lapinou_location_ready', handleLocationReady)
    return () => window.removeEventListener('lapinou_location_ready', handleLocationReady)
  }, [clientLat, clientLng])

  // 3. Initialise et met à jour la carte
  useEffect(() => {
    if (!scriptsLoaded || !window.L || !mapContainerRef.current) return

    const L = window.L

    // Détruit l'ancienne instance si elle existe
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Créer la carte
    const map = L.map(mapContainerRef.current, {
      zoomControl: true,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    // Ajouter le fond de carte OpenStreetMap (sombre pour coller à la charte)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    // Icônes personnalisées
    const CustomIcon = L.Icon.extend({
      options: {
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
      }
    })

    const greenIcon = new CustomIcon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png' })
    const goldIcon = new CustomIcon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png' })

    // Marqueur Azaguié Gare (Coin Lapin)
    L.marker(AZAGUIE_COORDS, { icon: goldIcon })
      .addTo(map)
      .bindPopup('<b>Notre Coin Lapin</b><br/>Azaguié Gare')
      .openPopup()

    // Si on a la position du client, on la rajoute
    if (clientCoords) {
      L.marker(clientCoords, { icon: greenIcon })
        .addTo(map)
        .bindPopup('<b>Votre position</b>')

      // Tracer une ligne en pointillés (itinéraire)
      L.polyline([clientCoords, AZAGUIE_COORDS], {
        color: '#B8834A',
        weight: 3,
        dashArray: '5, 10',
        opacity: 0.7
      }).addTo(map)

      // Ajuste la vue pour englober les deux points
      const bounds = L.latLngBounds([clientCoords, AZAGUIE_COORDS])
      map.fitBounds(bounds, { padding: [40, 40] })
    } else {
      // Vue centrée sur Azaguié Gare par défaut
      map.setView(AZAGUIE_COORDS, 11)
    }

  }, [scriptsLoaded, clientCoords])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-brand-border bg-brand-darker shadow-inner h-[280px] w-full">
      <div ref={mapContainerRef} className="h-full w-full z-10" />
      
      {/* Légende */}
      <div className="absolute bottom-2 left-2 z-20 glass px-2.5 py-1.5 rounded-lg text-[10px] space-y-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FFD700]" />
          <span>Ferme (Azaguié Gare)</span>
        </div>
        {clientCoords && (
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#2ECC71]" />
            <span>Votre position</span>
          </div>
        )}
      </div>
    </div>
  )
}

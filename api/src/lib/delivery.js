// api/src/lib/delivery.js
// Zones de livraison Lapinou — résolution automatique depuis lat/lng
// Pattern de calcul de distance identique à Nexura frontend/components/ui/MapView.js (haversine)

// Centre de référence : Azaguié Gare (Coin Lapin / ferme) — même point que web/components/MapView.jsx
const FARM_COORDS = { lat: 5.6315, lng: -4.0805 }

// Centre approximatif d'Abidjan (commune du Plateau) — sert à délimiter la zone "Abidjan"
const ABIDJAN_CENTER = { lat: 5.3364, lng: -4.0267 }

// Rayons en kilomètres
const ABIDJAN_RADIUS_KM = 25   // Grand Abidjan (communes incluses)
const AZAGUIE_RADIUS_KM = 20   // Azaguié et alentours (Agboville axe, Anyama, etc.)

const ZONES = {
  abidjan:      { label: 'Abidjan',                 fee: 2000 },
  azaguie:      { label: 'Azaguié et alentours',     fee: 1000 },
  pays_profond: { label: 'Reste de la Côte d\'Ivoire', fee: 3000 },
}

// ─── Distance haversine (km) — identique au pattern Nexura ───────────────────
function haversine(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const sin2 = x => Math.sin(x / 2) ** 2
  const c = sin2(dLat) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sin2(dLng)
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

// ─── Résout la zone de livraison depuis des coordonnées GPS ──────────────────
// Règle :
//   1. Si le point est dans le rayon "Abidjan"      → zone "abidjan"
//   2. Sinon si dans le rayon "Azaguié"              → zone "azaguie"
//   3. Sinon                                          → zone "pays_profond"
// Azaguié étant proche d'Abidjan, on teste Abidjan en premier pour éviter
// qu'un client en plein Abidjan ne tombe par erreur dans la zone Azaguié.
function resolveZone(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) {
    return null
  }
  const point = { lat: parseFloat(lat), lng: parseFloat(lng) }

  const distAbidjan = haversine(point, ABIDJAN_CENTER)
  if (distAbidjan <= ABIDJAN_RADIUS_KM) return 'abidjan'

  const distFarm = haversine(point, FARM_COORDS)
  if (distFarm <= AZAGUIE_RADIUS_KM) return 'azaguie'

  return 'pays_profond'
}

// ─── Calcule { zone, fee, label } depuis lat/lng ──────────────────────────────
function computeDelivery(lat, lng) {
  const zone = resolveZone(lat, lng)
  if (!zone) return { zone: null, fee: 0, label: null }
  return { zone, fee: ZONES[zone].fee, label: ZONES[zone].label }
}

module.exports = { ZONES, resolveZone, computeDelivery, haversine, FARM_COORDS, ABIDJAN_CENTER }

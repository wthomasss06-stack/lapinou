// web/lib/delivery.js
// Miroir front de api/src/lib/delivery.js — sert uniquement à l'AFFICHAGE
// (preview du frais avant soumission). Le calcul faisant foi reste côté API,
// qui re-calcule et persiste la zone/le frais au moment de la réservation.

export const FARM_COORDS = { lat: 5.6315, lng: -4.0805 }       // Azaguié Gare
export const ABIDJAN_CENTER = { lat: 5.3364, lng: -4.0267 }    // Plateau, Abidjan

const ABIDJAN_RADIUS_KM = 25
const AZAGUIE_RADIUS_KM = 20

export const DELIVERY_ZONES = {
  abidjan:      { label: 'Abidjan',                      fee: 2000 },
  azaguie:      { label: 'Azaguié et alentours',         fee: 1000 },
  pays_profond: { label: "Reste de la Côte d'Ivoire",    fee: 3000 },
}

function haversine(a, b) {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const sin2 = x => Math.sin(x / 2) ** 2
  const c = sin2(dLat) + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * sin2(dLng)
  return R * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
}

export function resolveDeliveryZone(lat, lng) {
  if (lat == null || lng == null || Number.isNaN(lat) || Number.isNaN(lng)) return null
  const point = { lat: parseFloat(lat), lng: parseFloat(lng) }

  if (haversine(point, ABIDJAN_CENTER) <= ABIDJAN_RADIUS_KM) return 'abidjan'
  if (haversine(point, FARM_COORDS) <= AZAGUIE_RADIUS_KM) return 'azaguie'
  return 'pays_profond'
}

export function getDeliveryPreview(lat, lng) {
  const zone = resolveDeliveryZone(lat, lng)
  if (!zone) return null
  return { zone, ...DELIVERY_ZONES[zone] }
}

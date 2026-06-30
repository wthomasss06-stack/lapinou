// web/lib/status.js
// Même logique que Nexura STATUT_CHOICES — centralisé pour l'UI

export const STATUS = {
  AVAILABLE: 'available',
  SOLD:      'sold',
}

export const STATUS_LABEL = {
  available: 'Disponible',
  sold:      'Épuisé',
}

export const STATUS_COLOR = {
  available: 'bg-emerald-100 text-emerald-700',
  sold:      'bg-red-100    text-red-600',
}

// True si la fiche n'a plus de stock disponible (grisée côté client)
export function isUnavailable(rabbit) {
  return rabbit.status === STATUS.SOLD || (rabbit.stock != null && rabbit.stock <= 0)
}

// Quantité maximum sélectionnable pour une réservation (plafonnée à 50 par sécurité)
export function maxReservable(rabbit) {
  return Math.max(0, Math.min(rabbit.stock ?? 0, 50))
}

// Label humain du genre
export const GENDER_LABEL = { male: 'Mâle', female: 'Femelle', mixed: 'Lot mixte' }

// Format prix FCFA
export function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'
}

// ─── Résolution d'URL photo ────────────────────────────────────────────────────
// Les photos vivent désormais sur Cloudinary (URL absolue https://res.cloudinary.com/...).
// On garde une compatibilité avec d'anciennes entrées qui stockaient un chemin
// local relatif (/uploads/xxx.jpg) — auquel cas on préfixe par l'API.
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:4000'

export function resolvePhotoUrl(url) {
  if (!url) return null
  if (/^https?:\/\//i.test(url)) return url // déjà une URL absolue (Cloudinary)
  return `${API_URL}${url}` // ancien chemin relatif local
}

// api/src/lib/pricing.js
// ═══════════════════════════════════════════════════════════════════
//  Tarification — SOURCE DE VÉRITÉ côté serveur
//
//  Prix du kilo fixe (6 000 FCFA) : tout le catalogue se déduit du poids.
//  Le prix d'une fiche = poids × tarif/kg. Les remises par format (duo, lot)
//  s'appliquent sur le total d'une commande, pas sur le prix d'une fiche.
//  Quand l'admin saisit un poids (kg) sur une fiche, le prix est calculé
//  ici — jamais fait confiance à un prix envoyé par le navigateur.
//
//  Miroir côté front (affichage du simulateur) : web/lib/pricing.ts
//  → pour changer le tarif sans toucher au code, définir PRICE_PER_KG
//    sur Render ET NEXT_PUBLIC_PRICE_PER_KG sur Vercel avec la même valeur.
// ═══════════════════════════════════════════════════════════════════

const DEFAULT_PRICE_PER_KG = 6000 // FCFA / kg

// Bornes de validation d'un poids saisi en admin. 15 kg couvre largement le
// Géant des Flandres (race la plus lourde du catalogue) avec de la marge.
const MIN_WEIGHT_KG = 0.1
const MAX_WEIGHT_KG = 15

function resolvePricePerKg(raw) {
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : DEFAULT_PRICE_PER_KG
}

const PRICE_PER_KG = resolvePricePerKg(process.env.PRICE_PER_KG)

function badRequest(message) {
  const err = new Error(message)
  err.status = 400
  return err
}

/**
 * Convertit une saisie de poids en nombre de kg.
 * Accepte un nombre ou une chaîne (virgule ou point décimal : "1,5" / "1.5").
 * Retourne null si le champ est vide (= pas de poids renseigné).
 * Lève une erreur 400 claire si la valeur est invalide ou hors bornes.
 */
function parseWeightKg(value) {
  if (value === null || value === undefined) return null
  if (typeof value === 'string' && value.trim() === '') return null

  const kg = typeof value === 'string'
    ? Number(value.trim().replace(',', '.'))
    : Number(value)

  if (!Number.isFinite(kg)) {
    throw badRequest('Poids invalide : saisissez un nombre en kg (ex : 1,5).')
  }
  if (kg < MIN_WEIGHT_KG || kg > MAX_WEIGHT_KG) {
    throw badRequest(`Poids hors limites : entre ${MIN_WEIGHT_KG} et ${MAX_WEIGHT_KG} kg.`)
  }
  // Arrondi au gramme : évite les 1.2000000000000002 issus d'un calcul flottant
  return Math.round(kg * 1000) / 1000
}

/** Prix en FCFA (entier) pour un poids en kg. */
function priceForWeight(kg, pricePerKg = PRICE_PER_KG) {
  return Math.round(kg * pricePerKg)
}

/**
 * Applique la règle « poids saisi ⇒ prix déduit » sur un payload de fiche lapin.
 *
 *  - poids renseigné  → `weight` est normalisé et `price` est ÉCRASÉ par
 *                       poids × tarif/kg (le prix éventuellement envoyé est ignoré)
 *  - poids absent     → payload inchangé (prix manuel conservé / exigé par l'appelant)
 *  - clé `weight` absente du payload (PATCH partiel) → rien n'est touché
 */
function applyWeightPricing(data) {
  if (!data || !Object.prototype.hasOwnProperty.call(data, 'weight')) return data

  const weight = parseWeightKg(data.weight)
  if (weight === null) return { ...data, weight: null }

  return { ...data, weight, price: priceForWeight(weight) }
}

/** Infos publiques exposées par GET /api/pricing (lecture du tarif en vigueur). */
function getPublicPricing() {
  return {
    pricePerKg: PRICE_PER_KG,
    currency: 'XOF',
    minWeightKg: MIN_WEIGHT_KG,
    maxWeightKg: MAX_WEIGHT_KG,
  }
}

module.exports = {
  DEFAULT_PRICE_PER_KG,
  PRICE_PER_KG,
  MIN_WEIGHT_KG,
  MAX_WEIGHT_KG,
  resolvePricePerKg,
  parseWeightKg,
  priceForWeight,
  applyWeightPricing,
  getPublicPricing,
}

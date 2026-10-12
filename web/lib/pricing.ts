// web/lib/pricing.ts
// ═══════════════════════════════════════════════════════════════════
//  Tarification — SOURCE DE VÉRITÉ côté front (affichage)
//
//  Un seul prix du kilo, fixe. Tout ce que le site affiche (simulateur,
//  formats, ticker, CGV, FAQ, JSON-LD) se déduit de PRICE_PER_KG et des
//  remises ci-dessous.
//
//  Le prix réellement enregistré en base est calculé par l'API
//  (api/src/lib/pricing.js) — ce fichier n'est que le miroir d'affichage.
//  Pour changer le tarif sans toucher au code : même valeur dans
//  PRICE_PER_KG (Render) et NEXT_PUBLIC_PRICE_PER_KG (Vercel).
// ═══════════════════════════════════════════════════════════════════

const DEFAULT_PRICE_PER_KG = 6000 // FCFA / kg

const envPrice = Number(process.env.NEXT_PUBLIC_PRICE_PER_KG)
export const PRICE_PER_KG: number = Number.isFinite(envPrice) && envPrice > 0 ? envPrice : DEFAULT_PRICE_PER_KG

// Plage du simulateur de la landing
export const SIM_MIN_KG = 1
export const SIM_MAX_KG = 3
export const SIM_STEP_KG = 0.1
export const SIM_DEFAULT_KG = 1.5
export const SIM_QUICK_PICKS_KG = [1, 1.5, 2, 2.5, 3]

/** Prix en FCFA (entier) pour un poids en kg — même règle que l'API. */
export function priceForKg(kg: number, pricePerKg: number = PRICE_PER_KG): number {
  return Math.round(kg * pricePerKg)
}

/** Ramène une valeur de slider au pas de 0,1 kg (évite 2.3000000000000003). */
export function snapKg(kg: number): number {
  const snapped = Math.round(kg / SIM_STEP_KG) * SIM_STEP_KG
  return Math.round(snapped * 10) / 10
}

/** 6000 → « 6 000 » (espace insécable : jamais de retour à la ligne dans un prix). */
export function formatNumber(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')
}

/** 9000 → « 9 000 FCFA » */
export function formatFcfa(n: number): string {
  return `${formatNumber(n)}\u00A0FCFA`
}

/** 1.5 → « 1,5 kg » ; 3 → « 3 kg » */
export function formatKg(kg: number): string {
  const text = (Math.round(kg * 10) / 10).toString().replace('.', ',')
  return `${text}\u00A0kg`
}

// ─── Formats de vente (la « grille ») ─────────────────────────────────────────
// Le prix d'un format n'est pas fixe : il dépend du poids.
//   total = poids total × PRICE_PER_KG − remise
// La remise est un montant en FCFA retiré du total (0 pour l'unité).
export type PriceFormat = {
  id: 'unite' | 'duo' | 'resto'
  icon: string
  label: string
  /** Nombre de lapins du format */
  rabbits: number
  /** Remise en FCFA sur le total (0 = aucune) */
  discount: number
  /** « Poids × 6 000 FCFA » / « Poids total × 6 000 FCFA » */
  formula: string
}

function buildFormat(id: PriceFormat['id'], icon: string, label: string, rabbits: number, discount: number): PriceFormat {
  const weightWord = rabbits === 1 ? 'Poids' : 'Poids total'
  return { id, icon, label, rabbits, discount, formula: `${weightWord}\u00A0×\u00A0${formatFcfa(PRICE_PER_KG)}` }
}

export const PRICE_FORMATS: PriceFormat[] = [
  buildFormat('unite', '🐇', "À l'unité", 1, 0),
  buildFormat('duo', '🐇🐇', 'Duo', 2, 1000),
  buildFormat('resto', '📦', 'Lot restaurateur', 6, 3500),
]

/** Accès direct par id (JSON-LD, CGV, ticker, FAQ…) */
export function getFormat(id: PriceFormat['id']): PriceFormat {
  return PRICE_FORMATS.find((f) => f.id === id) as PriceFormat
}

/** Total d'une commande d'un format donné pour un poids total en kg. */
export function totalForFormat(format: PriceFormat, totalKg: number): number {
  return Math.max(0, priceForKg(totalKg) - format.discount)
}

/** « 1 lapin » / « 2 lapins » */
export function formatRabbits(n: number): string {
  return `${n}\u00A0lapin${n > 1 ? 's' : ''}`
}

/** « −1 000 FCFA » (vrai signe moins), « 0 FCFA » si aucune remise. */
export function formatDiscount(discount: number): string {
  return discount > 0 ? `\u2212${formatFcfa(discount)}` : formatFcfa(0)
}

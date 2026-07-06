// lib/whatsapp.js
// process.env.NEXT_PUBLIC_WHATSAPP est stocké au format international
// complet sans "+" (ex. "2250142507750" = indicatif 225 + numéro local).
// Ce helper formate ce numéro pour un AFFICHAGE lisible ("+225 01 42 50 77 50")
// — à ne pas confondre avec l'URL wa.me, qui utilise directement les chiffres
// bruts (process.env.NEXT_PUBLIC_WHATSAPP.replace(/\D/g, '')).
export function formatWhatsappDisplay(raw) {
  const digits = (raw || '').replace(/\D/g, '')
  if (!digits) return ''

  // Côte d'Ivoire : indicatif 225 + 10 chiffres (plan de numérotation 2021 —
  // le premier chiffre du numéro local est conservé, pas un préfixe à retirer).
  if (digits.startsWith('225') && digits.length === 13) {
    const local = digits.slice(3)
    const pairs = local.match(/.{1,2}/g)?.join(' ') ?? local
    return `+225 ${pairs}`
  }

  // Repli générique si le numéro ne correspond pas au format ivoirien attendu.
  return `+${digits}`
}

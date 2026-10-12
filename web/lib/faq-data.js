// lib/faq-data.js
// FAQ courte de la home (6 questions) — extraite de components/FaqSection.tsx
// pour être partagée avec le schema JSON-LD FAQPage (app/page.tsx) sans
// dupliquer le texte à deux endroits.
import { PRICE_PER_KG, formatFcfa, getFormat } from './pricing'

const DUO_DISCOUNT = formatFcfa(getFormat('duo').discount)
const LOT_DISCOUNT = formatFcfa(getFormat('resto').discount)

export const HOME_FAQS = [
  { q: "Quel est le prix d'un lapin à Azaguié ?", a: `Chez Florence, le prix se calcule au poids : ${formatFcfa(PRICE_PER_KG)} le kilo. Un lapin de 1,5 kg revient donc à ${formatFcfa(PRICE_PER_KG * 1.5)}. Le format Duo (2 lapins) bénéficie d'une remise de ${DUO_DISCOUNT} sur le total, et le lot restaurateur (6 lapins) d'une remise de ${LOT_DISCOUNT}.` },
  { q: 'Comment commander un lapin ?', a: 'La commande se fait exclusivement via WhatsApp au +225 01 42 50 77 50. Envoyez-nous un message avec la race et le format souhaité. Nous confirmons la disponibilité et organisons le retrait ou la livraison.' },
  { q: 'Les lapins sont-ils sains ?', a: 'Oui. Chaque lapin est examiné avant la vente : poids vérifié, pelage contrôlé, comportement observé. Nous ne vendons aucun animal malade. Un suivi après-vente est également proposé.' },
  { q: 'Où puis-je retirer ma commande ?', a: 'Le retrait se fait sur place à Azaguié Gare. La livraison est également possible selon votre zone à Abidjan. Contactez-nous sur WhatsApp pour organiser la livraison.' },
  { q: 'Quels modes de paiement acceptez-vous ?', a: 'Nous acceptons le paiement en espèces au retrait, ainsi que les transferts Mobile Money (Orange Money, MTN Mobile Money, Wave). Le paiement se fait à la livraison ou au retrait.' },
  { q: "Proposez-vous des conseils d'élevage ?", a: 'Oui, nous proposons un suivi après-vente avec des conseils de conservation et d\u2019élevage. Nous accompagnons également les éleveurs débutants dans la mise en place de leur élevage.' },
]

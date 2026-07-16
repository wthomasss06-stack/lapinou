// Tarifs — port fidèle de chez-florence-landing.html. Les 3 formules et
// leurs prix étaient déjà justes dans l'ancienne mouture (mêmes classes
// .pricing-grid/.price-card, déjà ciblées par lib/useGsapLenis.ts) ; ce
// qui change : price-tag/price-amount/price-sub/price-badge/price-features/
// price-cta (au lieu de price-card-label/-amount/-desc/-divider/-btn), et
// les CTA WhatsApp qui utilisent désormais NEXT_PUBLIC_WHATSAPP comme
// partout ailleurs dans le vrai projet (au lieu du numéro codé en dur du
// HTML isolé).
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waLink = (message: string) =>
  WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}` : '#'

const TIERS = [
  {
    tag: 'Format Simple',
    amount: '15 000',
    sub: 'FCFA · 1 lapin, environ 2 kg',
    features: ['Environ 2 kg', 'Lapin sélectionné et pesé', 'Disponible toute la semaine', 'Retrait ou livraison'],
    message: "Bonjour, je suis intéressé par le format à l'unité (15 000 FCFA).",
    popular: false,
  },
  {
    tag: 'Le Duo',
    amount: '25 000',
    sub: 'FCFA · 2 lapins, environ 1,6 kg chacun',
    features: ['Environ 1,6 kg par lapin', 'Le format le plus demandé', 'Idéal pour un repas en famille', 'Retrait ou livraison'],
    message: 'Bonjour, je suis intéressé par le format Duo (25 000 FCFA).',
    popular: true,
  },
  {
    tag: 'Format Restaurateur',
    amount: '80 000',
    sub: 'FCFA · Lot de 6 lapins',
    features: ['Lot de 6 lapins', 'Tarif préférentiel volume', 'Pour restaurateurs & mini-restos', 'Livraison possible selon zone'],
    message: 'Bonjour, je suis intéressé par le format Restaurateur (lot de 6, 80 000 FCFA).',
    popular: false,
  },
]

export default function PricingSection() {
  return (
    <section id="tarifs" data-theme="dark">
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 05 — Tarifs</div>
          <div className="section-title reveal-text">
            Un Tarif Pour
            <br />
            Chaque Besoin
          </div>
        </div>
        <div className="section-desc">
          Le prix dépend du poids et de la quantité — à l&apos;unité, en duo,
          ou en gros pour les professionnels.
        </div>
      </div>

      <div className="pricing-grid">
        {TIERS.map((tier) => (
          <div className={`price-card reveal-text${tier.popular ? ' popular' : ''}`} key={tier.tag}>
            {tier.popular && <div className="price-badge">Le plus demandé</div>}
            <div className="price-tag">{tier.tag}</div>
            <div className="price-amount">{tier.amount}</div>
            <div className="price-sub">{tier.sub}</div>
            <ul className="price-features">
              {tier.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              href={waLink(tier.message)}
              target="_blank"
              rel="noopener noreferrer"
              className="price-cta hover-target"
            >
              Réserver
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

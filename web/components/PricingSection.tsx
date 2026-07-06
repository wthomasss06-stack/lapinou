'use client'
import { CheckCircle2 } from 'lucide-react'

// No. 05 — Tarifs. Vrais tarifs (poids/quantité), repris d'indexc.html.
// Les .price-card apparaissent en fondu/translation à l'entrée dans le
// viewport (lib/useGsapLenis.ts, toggleActions "play none none reverse").
const PLANS = [
  {
    id: 'unite',
    label: "À l'Unité",
    amount: '15 000',
    desc: '1 lapin, environ 2 kg',
    features: ['Environ 2 kg', 'Lapin sélectionné et pesé', 'Disponible toute la semaine', 'Retrait ou livraison'],
    featured: false,
  },
  {
    id: 'duo',
    label: 'Le Duo',
    amount: '25 000',
    desc: '2 lapins, environ 1,6 kg chacun',
    features: ['Environ 1,6 kg par lapin', 'Le format le plus demandé', 'Idéal pour un repas en famille', 'Retrait ou livraison'],
    featured: true,
  },
  {
    id: 'restaurateur',
    label: 'Format Restaurateur',
    amount: '80 000',
    desc: 'Lot de 6 lapins — restaurants & mini-restos',
    features: ['Lot de 6 lapins', 'Tarif préférentiel volume', 'Pour restaurateurs & mini-restos', 'Livraison possible selon zone'],
    featured: false,
  },
]

export default function PricingSection() {
  return (
    <section id="sec-pricing">
      <div className="eyebrow" data-no="No. 05">(Tarifs)</div>
      <h2 className="pricing-title">Un tarif pour chaque besoin</h2>
      <p className="pricing-sub">
        Le prix dépend du poids et de la quantité — à l&apos;unité, en duo, ou en gros pour les professionnels.
      </p>

      <div className="pricing-grid">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`price-card${plan.featured ? ' price-card--featured' : ''}`}>
            <div className="price-card-label">{plan.label}</div>
            <div className="price-card-amount">
              {plan.amount}
              <span>FCFA</span>
            </div>
            <div className="price-card-desc">{plan.desc}</div>
            <a href="#page5" className="price-card-btn">Réserver</a>
            <div className="price-card-divider" />
            <ul className="price-card-features">
              {plan.features.map((f) => (
                <li key={f}>
                  <CheckCircle2 size={15} strokeWidth={2} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

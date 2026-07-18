'use client'
import { useRef } from 'react'
import { useTilt3D } from '@/lib/useTilt3D'
import RainbowText from './RainbowText'

// Section Tarifs restaurée en grille (en plus de la Ligne 2 du
// TrustMarquee, qui garde le résumé en ticker). Les boutons pointent
// vers le formulaire de contact du footer, pas WhatsApp directement.
const PLANS = [
  { id: 'unite', badge: null, label: "À l'Unité", amount: '15 000', desc: '1 lapin, environ 2 kg', features: ['Environ 2 kg', 'Lapin sélectionné et pesé', 'Disponible toute la semaine', 'Retrait ou livraison'] },
  { id: 'duo', badge: 'Le plus demandé', label: 'Le Duo', amount: '25 000', desc: '2 lapins, environ 1,6 kg chacun', features: ['Environ 1,6 kg par lapin', 'Le format le plus demandé', 'Idéal pour un repas en famille', 'Retrait ou livraison'] },
  { id: 'resto', badge: null, label: 'Format Restaurateur', amount: '80 000', desc: 'Lot de 6 lapins — restaurants & mini-restos', features: ['Lot de 6 lapins', 'Tarif préférentiel volume', 'Pour restaurateurs & mini-restos', 'Livraison possible selon zone'] },
]

export default function TarifsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  useTilt3D(gridRef)

  return (
    <section id="tarifs">
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 05 — Tarifs</div>
          <h2 className="section-title reveal-text">
            Un Tarif Pour
            <br />
            Chaque Besoin
          </h2>
        </div>
        <RainbowText
          text="Le prix dépend du poids et de la quantité — à l'unité, en duo, ou en gros pour les professionnels."
          variant="white"
          className="section-desc"
        />
      </div>

      <div className="pricing-grid" ref={gridRef}>
        {PLANS.map((plan) => (
          <div key={plan.id} className={`price-card reveal-text${plan.badge ? ' featured' : ''}`} data-tilt data-base-scale={plan.badge ? '1.03' : '1'}>
            {plan.badge && <div className="price-badge">{plan.badge}</div>}
            <div className="price-tag">{plan.label}</div>
            <div className="price-amount">
              {plan.amount}<span>FCFA</span>
            </div>
            <div className="price-sub">{plan.desc}</div>
            <a href="#contact" className="price-cta hover-target">
              Commander
            </a>
            <ul className="price-features">
              {plan.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

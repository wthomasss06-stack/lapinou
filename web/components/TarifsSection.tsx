'use client'
import { useRef } from 'react'
import { useTilt3D } from '@/lib/useTilt3D'
import ArrowButton from './ArrowButton'
import RainbowText from './RainbowText'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''

// Port direct de <section id="tarifs"> (index.html).
const PLANS = [
  { id: 'unite', badge: null, label: "À l'Unité", amount: '15 000', desc: '1 lapin, environ 2 kg', features: ['Environ 2 kg', 'Lapin sélectionné et pesé', 'Disponible toute la semaine', 'Retrait ou livraison'], msg: "Bonjour, je suis intéressé par le format à l'unité (15 000 FCFA)." },
  { id: 'duo', badge: 'Le plus demandé', label: 'Le Duo', amount: '25 000', desc: '2 lapins, environ 1,6 kg chacun', features: ['Environ 1,6 kg par lapin', 'Le format le plus demandé', 'Idéal pour un repas en famille', 'Retrait ou livraison'], msg: 'Bonjour, je suis intéressé par le format Duo (25 000 FCFA).' },
  { id: 'resto', badge: null, label: 'Format Restaurateur', amount: '80 000', desc: 'Lot de 6 lapins — restaurants & mini-restos', features: ['Lot de 6 lapins', 'Tarif préférentiel volume', 'Pour restaurateurs & mini-restos', 'Livraison possible selon zone'], msg: 'Bonjour, je suis intéressé par le format Restaurateur (lot de 6, 80 000 FCFA).' },
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
            <div className="price-cta-wrap">
              <ArrowButton href={WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(plan.msg)}` : '#'} external solid={!!plan.badge}>
                Réserver
              </ArrowButton>
            </div>
            <ul className="price-features">
              {plan.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

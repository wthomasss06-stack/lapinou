'use client'
import { useRef } from 'react'
import { useTilt3D } from '@/lib/useTilt3D'
import RainbowText from './RainbowText'

// Section Tarifs restaurée en grille (en plus de la Ligne 2 du
// TrustMarquee, qui garde le résumé en ticker).
// CRO : les boutons "Commander" pointaient vers le formulaire générique du
// footer (#contact — 4 champs à remplir avant réponse par email). Ils
// ouvrent désormais directement WhatsApp avec un message pré-rempli
// mentionnant le format choisi — même logique que ReserveButton sur les
// fiches lapin, cohérente avec "la commande se fait exclusivement via
// WhatsApp" annoncé dans la FAQ et les CGV. Le formulaire du footer reste
// disponible pour les questions plus générales.
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || '2250142507750'

const PLANS = [
  { id: 'unite', badge: null, label: "À l'Unité", amount: '15 000', desc: '1 lapin, environ 2 kg', features: ['Environ 2 kg', 'Lapin sélectionné et pesé', 'Disponible toute la semaine', 'Retrait ou livraison'] },
  { id: 'duo', badge: 'Le plus demandé', label: 'Le Duo', amount: '25 000', desc: '2 lapins, environ 1,6 kg chacun', features: ['Environ 1,6 kg par lapin', 'Le format le plus demandé', 'Idéal pour un repas en famille', 'Retrait ou livraison'] },
  { id: 'resto', badge: null, label: 'Format Restaurateur', amount: '80 000', desc: 'Lot de 6 lapins — restaurants & mini-restos', features: ['Lot de 6 lapins', 'Tarif préférentiel volume', 'Pour restaurateurs & mini-restos', 'Livraison possible selon zone'] },
]

function waHrefForPlan(plan: typeof PLANS[number]) {
  const text = `Bonjour ! Je suis intéressé(e) par le format *${plan.label}* (${plan.amount} FCFA — ${plan.desc}). Quelles sont les disponibilités ?`
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}

export default function TarifsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  useTilt3D(gridRef)

  return (
    <section id="tarifs" data-theme="maroon">
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
            <a href={waHrefForPlan(plan)} target="_blank" rel="noopener noreferrer" className="price-cta hover-target">
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

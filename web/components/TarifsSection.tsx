'use client'
import { useEffect, useRef } from 'react'
import { useTilt3D } from '@/lib/useTilt3D'
import RainbowText from './RainbowText'
import ArrowButton from './ArrowButton'
import CharSplitHeading from './CharSplitHeading'
import SectionHead from './SectionHead'
import PriceSimulator from './PriceSimulator'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'
import { RABBIT_PROJECTILE_POOL, wireRabbitProjectiles } from '@/lib/rabbitProjectiles'
import { PRICE_PER_KG, PRICE_FORMATS, SIM_MIN_KG, SIM_MAX_KG, formatFcfa, formatKg, formatNumber, formatRabbits } from '@/lib/pricing'

// Section Tarifs : un prix du kilo fixe (lib/pricing.ts).
//  1. Le simulateur (la balance, PriceSimulator) calcule le prix d'un poids de 1 à 3 kg.
//  2. La grille des formats reprend les cartes de l'ancienne section (tilt 3D,
//     badge « Le plus demandé », bouton Commander, liste de points) avec les
//     nouveaux tarifs : prix selon le poids, remise sur le total.
//     Au survol (souris) ou au toucher (doigt) d'une carte, des lapins-projectiles
//     partent du point de contact : 1 (unité), 2 (duo), 6 (lot) — voir
//     lib/rabbitProjectiles.ts.
// Les boutons « Commander » pointent vers le formulaire de contact du
// footer (#contact) — pas WhatsApp direct.
const PLANS = PRICE_FORMATS.map((f) => ({
  ...f,
  badge: f.id === 'duo' ? 'Le plus demandé' : null,
  // Remise affichée en grand : « 0 », « −1 000 », « −3 500 » (en FCFA, sur le total)
  amount: f.discount > 0 ? `\u2212${formatNumber(f.discount)}` : '0',
  features: [formatRabbits(f.rabbits), f.formula, 'Selon le poids'],
}))

export default function TarifsSection() {
  const gridRef = useRef<HTMLDivElement>(null)
  useTilt3D(gridRef)

  // Lapins-projectiles : autant de lapins que de lapins dans le format
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const cards = grid.querySelectorAll<HTMLElement>('.price-card')
    const cleanups = PLANS.map((plan, i) =>
      cards[i] ? wireRabbitProjectiles(cards[i], plan.rabbits, RABBIT_PROJECTILE_POOL) : () => {}
    )
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section id="tarifs" data-theme="rust">
      <SectionHead
        number={3}
        eyebrow="Tarifs"
        title={(
          <CharSplitHeading
            lines={['Un Seul Prix,', 'Au Kilo']}
            images={CHEZ_FLORENCE_IMAGE_POOL}
            as="h2"
            className="section-title reveal-text"
          />
        )}
        desc={(
          <RainbowText
            text={`Un tarif unique : ${formatFcfa(PRICE_PER_KG)} le kilo. Choisissez un poids de ${formatKg(SIM_MIN_KG)} à ${formatKg(SIM_MAX_KG)}, le prix se calcule tout seul.`}
            variant="white"
            className="section-desc"
          />
        )}
      />

      <PriceSimulator />

      <div className="pricing-grid" ref={gridRef} style={{ marginTop: 'clamp(28px, 4vw, 44px)' }}>
        {PLANS.map((plan) => (
          <div key={plan.id} className={`price-card reveal-text${plan.badge ? ' featured' : ''}`} data-tilt data-base-scale={plan.badge ? '1.03' : '1'}>
            {plan.badge && <div className="price-badge">{plan.badge}</div>}
            <div className="price-tag"><span aria-hidden="true">{plan.icon}</span> {plan.label}</div>
            <div className="price-amount" style={plan.discount === 0 ? { opacity: 0.55 } : undefined}>
              {plan.amount}<span>FCFA</span>
            </div>
            <div className="price-sub">de remise sur le total</div>
            <ArrowButton href="#contact" solid block className="price-cta">
              Commander
            </ArrowButton>
            <ul className="price-features">
              {plan.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

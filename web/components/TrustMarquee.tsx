'use client'
import { CheckCircle2 } from 'lucide-react'
import './TrustMarquee.css'

// Adapté de TrustStacksMarquee (fourni par Aka) — 3 bandes "sticker"
// en flux normal (pas de position absolute, donc plus de chevauchement
// avec le texte de la section suivante). Ligne 1 reprend l'ancien
// marquee (Notre Histoire) tel quel ; Ligne 2 remplace la grille tarifs
// (#tarifs, cible du lien Navbar) ; Ligne 3 est nouvelle (livraison).

const AVAILABILITY = [
  'Disponible', 'Retrait Rapide', 'Qualité Contrôlée', 'Prêt à la Vente',
  'En Stock', 'Environ 2 kg', 'Lapin Frais', 'Sélectionné', 'Pesé avec Soin',
]

const PRICES = [
  { label: "À l'unité", amount: '15 000' },
  { label: 'Le Duo', amount: '25 000' },
  { label: 'Restaurateur (lot de 6)', amount: '80 000' },
]

const DELIVERY = [
  { zone: 'Abidjan', price: '2 000 FCFA' },
  { zone: 'Azaguié & environs (Agboville, Adzopé)', price: '1 000 FCFA' },
  { zone: 'Autres villes', price: '3 000 FCFA' },
]

function AvailabilityBand() {
  const set = (hidden: boolean) => (
    <div className="tm-band-set" aria-hidden={hidden || undefined}>
      {AVAILABILITY.map((item, i) => (
        <span className="tm-item" key={i}>
          <CheckCircle2 />
          {item}
        </span>
      ))}
    </div>
  )
  return (
    <div className="tm-band tm-band--availability">
      <div className="tm-band-track tm-band-track--left">
        {set(false)}
        {set(true)}
      </div>
    </div>
  )
}

function PricingBand() {
  const set = (hidden: boolean) => (
    <div className="tm-band-set" aria-hidden={hidden || undefined}>
      {PRICES.map((p, i) => (
        <span className="tm-price-item" key={i}>
          <span className="tm-price-label">{p.label}</span>
          <span className="tm-price-value">{p.amount}<span>FCFA</span></span>
          <span className="tm-sep">•</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="tm-band tm-band--pricing">
      <div className="tm-band-track tm-band-track--right">
        {set(false)}
        {set(true)}
      </div>
    </div>
  )
}

function DeliveryBand() {
  const set = (hidden: boolean) => (
    <div className="tm-band-set" aria-hidden={hidden || undefined}>
      {DELIVERY.map((d, i) => (
        <span className="tm-delivery-item" key={i}>
          <strong>{d.price}</strong>{d.zone}
          <span className="tm-delivery-sep">•</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="tm-band tm-band--delivery">
      <div className="tm-band-track tm-band-track--left">
        {set(false)}
        {set(true)}
      </div>
    </div>
  )
}

export default function TrustMarquee() {
  return (
    <section className="tm-section" aria-label="Disponibilité, tarifs et livraison">
      <AvailabilityBand />
      <PricingBand />
      <DeliveryBand />
    </section>
  )
}

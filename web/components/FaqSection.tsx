'use client'
import { useState } from 'react'
import ArrowButton from './ArrowButton'

// Port direct de <section id="faq"> (index.html). Version complète et
// catégorisée sur /aide — cette section reste volontairement courte (les
// 6 questions de la maquette) pour ne pas dupliquer /aide sur la home.
const FAQS = [
  { q: "Quel est le prix d'un lapin à Abidjan ?", a: "Chez Florence, les prix commencent à 8 500 FCFA pour un lapin Hollandais et atteignent 15 000 FCFA pour un lapin de 2 kg. Le format Duo (2 lapins) est à 25 000 FCFA. Les restaurateurs bénéficient d'un tarif préférentiel à 80 000 FCFA le lot de 6." },
  { q: 'Comment commander un lapin ?', a: 'La commande se fait exclusivement via WhatsApp au +225 01 42 50 77 50. Envoyez-nous un message avec la race et le format souhaité. Nous confirmons la disponibilité et organisons le retrait ou la livraison.' },
  { q: 'Les lapins sont-ils sains ?', a: 'Oui. Chaque lapin est examiné avant la vente : poids vérifié, pelage contrôlé, comportement observé. Nous ne vendons aucun animal malade. Un suivi après-vente est également proposé.' },
  { q: 'Où puis-je retirer ma commande ?', a: 'Le retrait se fait sur place à Azaguié Gare. La livraison est également possible selon votre zone à Abidjan. Contactez-nous sur WhatsApp pour organiser la livraison.' },
  { q: 'Quels modes de paiement acceptez-vous ?', a: 'Nous acceptons le paiement en espèces au retrait, ainsi que les transferts Mobile Money (Orange Money, MTN Mobile Money, Wave). Le paiement se fait à la livraison ou au retrait.' },
  { q: "Proposez-vous des conseils d'élevage ?", a: 'Oui, nous proposons un suivi après-vente avec des conseils de conservation et d\u2019élevage. Nous accompagnons également les éleveurs débutants dans la mise en place de leur élevage.' },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="faq-section">
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 10 — Questions Fréquentes</div>
          <h2 className="section-title reveal-text">
            Vous Avez
            <br />
            Des Questions ?
          </h2>
        </div>
      </div>

      <div className="faq-grid">
        {FAQS.map((item, i) => {
          const isOpen = open === i
          return (
            <div className="faq-item reveal-text" key={item.q}>
              <div
                className={`faq-question hover-target${isOpen ? ' active' : ''}`}
                onClick={() => setOpen(isOpen ? null : i)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(isOpen ? null : i) }}
              >
                {item.q}
              </div>
              <div className={`faq-answer${isOpen ? ' open' : ''}`}>{item.a}</div>
            </div>
          )
        })}
      </div>

      <div className="projects-cta-row">
        <ArrowButton href="/aide">Voir toutes les questions</ArrowButton>
      </div>
    </section>
  )
}

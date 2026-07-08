'use client'
import { useState } from 'react'

// Page 2 — Notre Histoire / Nos Garanties.
// Le texte "above-intro" est révélé par clip-path scrubé au scroll, les
// titres "Nos"/"Garanties" par SplitText (chars, 3D flip) et #hover-img par
// un suivi souris GSAP — toute la logique vit dans lib/useGsapLenis.ts et
// cible ces éléments par sélecteur, comme dans index.html.
//
// Mobile (pas de souris/hover) : chaque item devient un accordéon tap-to-
// open (voir .hover-item-content / .hover-item-image dans home-cinematic.css)
// inspiré de gemini-code — image + description se révèlent au tap, le
// survol desktop (#hover-img qui suit le curseur) est inchangé.
const GARANTIES = [
  {
    id: 1,
    label: '01. Santé Vérifiée',
    desc: "Chaque lapin est examiné avant la vente : poids, pelage et comportement contrôlés avec soin.",
    img: "url('/IMAGES/Snapchat-1244423645.webp')",
  },
  {
    id: 2,
    label: '02. Pesée & Classement',
    desc: 'Chaque lapin est pesé et classé avec précision — du format simple au lot pour les restaurateurs.',
    img: "url('/IMAGES/Snapchat-1244900246.webp')",
  },
  {
    id: 3,
    label: '03. Suivi Après-Vente',
    desc: "Conseils de conservation et d'élevage disponibles après chaque achat.",
    img: "url('/IMAGES/Snapchat-1671304199.webp')",
  },
  {
    id: 4,
    label: '04. Remise en Main Propre',
    desc: 'Retrait sur place ou livraison encadrée, selon votre disponibilité et votre zone.',
    img: "url('/IMAGES/Snapchat-468138222.webp')",
  },
]

export default function GarantiesSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  return (
    <div id="page2">
      <div id="a-propos" />
      <div id="page2-heading-1">(Notre Histoire)</div>

      <div id="intro-container">
        <div id="behind-intro">
          Nous élevons et sélectionnons nos lapins avec soin — pesée précise, bonne santé, et un
          accompagnement complet du choix jusqu&apos;à la vente.
        </div>
        <div id="above-intro">
          Nous élevons et sélectionnons nos lapins avec soin — pesée précise, bonne santé, et un
          accompagnement complet du choix jusqu&apos;à la vente.
        </div>
      </div>

      <svg id="scroll-line" width="100%" height="2" viewBox="0 0 1000 2" preserveAspectRatio="none">
        <line x1="0" y1="1" x2="1000" y2="1" stroke="#ffffff" strokeWidth={12} strokeLinecap="round" />
      </svg>

      <div id="page2-heading-wrap">
        <span id="page2-heading-2" className="giant-heading split-heading-1">Nos</span>{' '}
        <span id="page2-heading-3" className="giant-heading split-heading-1">Garanties</span>
      </div>
      <div id="page2-small-heading">Nos engagements :</div>
      <div id="page2-small-heading-2">── Santé · Race · Suivi</div>

      <div id="skills-container">
        {GARANTIES.map((g, i) => (
          <div
            key={g.id}
            id={`skills-container-${g.id}`}
            className={`hover-item${openId === g.id ? ' is-open' : ''}`}
            data-img={g.img}
            onClick={() => setOpenId((prev) => (prev === g.id ? null : g.id))}
          >
            <div id={`skill-${g.id}a`}>{g.label}</div>
            <div className="hover-item-content">
              <div id={`skill-${g.id}b`}>{g.desc}</div>
              <div className="hover-item-image" style={{ backgroundImage: g.img }} />
            </div>
          </div>
        ))}
      </div>

      <div id="hover-img" />
    </div>
  )
}

'use client'
import { useState } from 'react'
import ArrowButton from './ArrowButton'
import HoverFadeText from './HoverFadeText'
import { HOME_FAQS as FAQS } from '@/lib/faq-data'

// Port direct de <section id="faq"> (index.html). Version complète et
// catégorisée sur /aide — cette section reste volontairement courte (les
// 6 questions de la maquette) pour ne pas dupliquer /aide sur la home.
// Données dans lib/faq-data.js — réutilisées par le schema JSON-LD FAQPage
// (app/page.tsx) pour l'AEO/GEO (ChatGPT, Perplexity, Gemini).

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="faq-section" data-theme="rust">
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
                <HoverFadeText>{item.q}</HoverFadeText>
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

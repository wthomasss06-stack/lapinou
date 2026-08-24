'use client'
import { useEffect, useRef, useState } from 'react'
import CharSplitHeading from './CharSplitHeading'
import SectionHead from './SectionHead'
import { CHEZ_FLORENCE_IMAGE_POOL } from '@/lib/chezFlorenceLetters'

// Port de <section id="temoignages"> (index.html) — converti en carousel
// auto-défilant (toutes les 5s), en pause tant que la souris est dessus.
const TESTIMONIALS = [
  { initials: 'AK', name: 'Aminata K.', role: 'Cliente particulière · Côte d’Ivoire', text: "J'ai commandé le format Duo pour un repas de famille. Les lapins étaient bien pesés, en excellente santé. La livraison a été rapide. Je recommande vivement !" },
  { initials: 'KB', name: 'Koffi B.', role: 'Chef restaurateur · Cocody', text: 'En tant que restaurateur, j\u2019apprécie la régularité et la qualité. Le lot de 6 est parfait pour mon restaurant. Les lapins sont toujours frais et bien préparés.' },
  { initials: 'TA', name: 'Thomas A.', role: 'Éleveur PME · Bingerville', text: 'Je revends les lapins dans ma boutique. Chez Florence me fournit en volume avec des prix intéressants. Le suivi est excellent, ils répondent toujours vite sur WhatsApp.' },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section
      id="temoignages"
      className="testimonials-section" data-theme="maroon"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <SectionHead
        number={5}
        eyebrow="Témoignages"
        title={(
          <CharSplitHeading
            lines={['Ils Nous', 'Font Confiance']}
            images={CHEZ_FLORENCE_IMAGE_POOL}
            as="h2"
            className="section-title reveal-text"
          />
        )}
      />

      <div className="testimonials-track">
        {TESTIMONIALS.map((t, i) => (
          <div className={`testimonial-card${i === active ? ' is-active' : ''}`} key={t.name}>
            <div className="testimonial-stars">★★★★★</div>
            <div className="testimonial-text">&quot;{t.text}&quot;</div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">{t.initials}</div>
              <div>
                <div className="testimonial-name">{t.name}</div>
                <div className="testimonial-role">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials-dots">
        {TESTIMONIALS.map((t, i) => (
          <button
            key={t.name}
            className={`testimonials-dot${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Avis ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

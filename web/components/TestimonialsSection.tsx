'use client'
import { useEffect, useRef, useState } from 'react'

// Port de <section id="temoignages"> (index.html) — converti en carousel
// auto-défilant (toutes les 5s), en pause tant que la souris est dessus.
const TESTIMONIALS = [
  { initials: 'AK', name: 'Aminata K.', role: 'Cliente particulière · Abidjan', text: "J'ai commandé le format Duo pour un repas de famille. Les lapins étaient bien pesés, en excellente santé. La livraison a été rapide. Je recommande vivement !" },
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
      <div className="section-head">
        <div>
          <div className="eyebrow">No. 09 — Témoignages</div>
          <h2 className="section-title reveal-text">
            Ils Nous
            <br />
            Font Confiance
          </h2>
        </div>
      </div>

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

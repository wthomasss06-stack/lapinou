// Port direct de <section id="temoignages"> (index.html).
const TESTIMONIALS = [
  { initials: 'AK', name: 'Aminata K.', role: 'Cliente particulière · Abidjan', text: "J'ai commandé le format Duo pour un repas de famille. Les lapins étaient bien pesés, en excellente santé. La livraison a été rapide. Je recommande vivement !" },
  { initials: 'KB', name: 'Koffi B.', role: 'Chef restaurateur · Cocody', text: 'En tant que restaurateur, j\u2019apprécie la régularité et la qualité. Le lot de 6 est parfait pour mon restaurant. Les lapins sont toujours frais et bien préparés.' },
  { initials: 'TA', name: 'Thomas A.', role: 'Éleveur PME · Bingerville', text: 'Je revends les lapins dans ma boutique. Chez Florence me fournit en volume avec des prix intéressants. Le suivi est excellent, ils répondent toujours vite sur WhatsApp.' },
]

export default function TestimonialsSection() {
  return (
    <section id="temoignages" className="testimonials-section">
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
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t) => (
          <div className="testimonial-card reveal-text" key={t.name}>
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
    </section>
  )
}

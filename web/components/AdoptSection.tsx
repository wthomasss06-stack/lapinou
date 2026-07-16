import { formatWhatsappDisplay } from '@/lib/whatsapp'

// Footer — port fidèle de chez-florence-landing.html (#contact). Affiché
// sur TOUTES les pages du site (/aide, /admin, /rabbits/[slug]…), voir
// Footer.tsx qui ré-exporte ce composant tel quel.
//
// Pas de 'use client' : ce composant est désormais 100% présentationnel.
// Le bouton magnétique (magnetic-btn-wrapper/magnetic-btn) est piloté par
// lib/useGsapLenis.ts UNIQUEMENT sur la home (seule page où <ScrollFX />
// est monté) — sur les autres pages c'est un bouton WhatsApp statique,
// dégradation acceptée (pas d'effet magnétique hors home).
//
// L'ancien formulaire de contact (ContactSection.tsx, réel appel API
// sendContactMessage) n'est plus utilisé ici : chez-florence-landing.html
// ne prévoit qu'un CTA WhatsApp direct + coordonnées. ContactSection.tsx
// reste disponible dans le projet si tu veux le réintégrer quelque part.
const WHATSAPP_RAW = process.env.NEXT_PUBLIC_WHATSAPP || ''
const WHATSAPP = WHATSAPP_RAW.replace(/\D/g, '')
const WHATSAPP_URL = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'
const EMAIL = 'wthomasss06@gmail.com'

export default function AdoptSection() {
  return (
    <footer id="contact" className="home-footer-section" data-theme="dark">
      <div className="footer-main">
        <h2 className="footer-title">
          Parlons de
          <br />
          votre lapin.
        </h2>
        <p className="footer-sub">
          Une question sur une race, un prix, une disponibilité ? Écrivez-nous
          — on vous répond vite.
        </p>

        <div className="magnetic-btn-wrapper hover-target">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="magnetic-btn">
            WhatsApp
          </a>
        </div>

        <div className="contact-details">
          <div className="contact-item">
            <div className="contact-label">Email</div>
            <div className="contact-value">
              <a href={`mailto:${EMAIL}`} className="hover-target">
                {EMAIL}
              </a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-label">WhatsApp</div>
            <div className="contact-value">
              <a href={WHATSAPP_URL} className="hover-target" target="_blank" rel="noopener noreferrer">
                {formatWhatsappDisplay(WHATSAPP_RAW) || 'Nous écrire'}
              </a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-label">Adresse</div>
            <div className="contact-value">Abidjan, Côte d&apos;Ivoire</div>
          </div>
          <div className="contact-item">
            <div className="contact-label">Horaires</div>
            <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h · Dim fermé</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 CHEZ FLORENCE — TOUS DROITS RÉSERVÉS</div>
        <div className="footer-links">
          <a href="/aide" className="hover-target">Aide</a>
          <a href="/confidentialite" className="hover-target">Confidentialité</a>
          <a href="/conditions" className="hover-target">Conditions</a>
        </div>
      </div>
    </footer>
  )
}

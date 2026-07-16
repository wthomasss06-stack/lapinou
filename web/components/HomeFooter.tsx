import MagneticButton from './MagneticButton'
import './HomeFooter.css'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waHref = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'

// Port direct de <footer id="contact"> (index.html). Remplace
// AdoptSection/ContactSection — pas de formulaire ici, la maquette est
// volontairement WhatsApp-first (cohérent avec les CGV : "la commande
// s'effectue exclusivement via WhatsApp").
export default function HomeFooter() {
  return (
    <footer id="contact">
      <div className="footer-main">
        <h2 className="footer-title">Parlons de<br />votre lapin.</h2>
        <p className="footer-sub">
          Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite.
        </p>

        <MagneticButton className="magnetic-btn-wrapper hover-target">
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="magnetic-btn">
            WhatsApp
          </a>
        </MagneticButton>

        <div className="contact-details">
          <div className="contact-item">
            <div className="contact-label">Email</div>
            <div className="contact-value">
              <a href="mailto:wthomasss06@gmail.com" className="hover-target">wthomasss06@gmail.com</a>
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-label">WhatsApp</div>
            <div className="contact-value">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover-target">+225 01 42 50 77 50</a>
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
          <a href="/#faq" className="hover-target">FAQ</a>
          <a href="/#tarifs" className="hover-target">Tarifs</a>
          <a href="/aide" className="hover-target">Aide</a>
          <a href="/confidentialite" className="hover-target">Confidentialité</a>
          <a href="/conditions" className="hover-target">Conditions</a>
          <a href={waHref} target="_blank" rel="noopener noreferrer" className="hover-target">WhatsApp</a>
        </div>
      </div>
    </footer>
  )
}

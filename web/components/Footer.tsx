'use client'
import Link from 'next/link'
import RainbowText from './RainbowText'
import MapView from './MapView'
import ContactMorphButton from './ContactMorphButton'
import HoverFadeText from './HoverFadeText'
import './Footer.css'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waHref = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'

const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Nos Lapins', href: '/#lapins' },
  { label: 'Tarifs', href: '/#tarifs' },
  { label: 'Notre Histoire', href: '/#histoire' },
  { label: 'FAQ', href: '/#faq' },
]
const INFO_LINKS = [
  { label: 'Aide', href: '/aide' },
  { label: 'Conditions Générales', href: '/conditions' },
  { label: 'Confidentialité', href: '/confidentialite' },
]

// Footer unique du site — structure reprise de footer.html (AKATech) :
// grille de nav (Navigation/Informations/Action) sur fond dégradé, gros
// lettrage en dégradé métallique. Les liens Aide/Conditions/Confidentialité
// vivent ici désormais (déplacés depuis la carte "Informations" de la nav).
export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-main">
        <h2 className="footer-title elastic-title">Parlons de<br />votre lapin.</h2>
        <RainbowText
          text="Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite."
          variant="white"
          className="footer-sub"
        />

        <div className="footer-grid">
          {/* Colonne info + localisation — le bouton WhatsApp qui vivait ici
              est parti en colonne droite, devenu ContactMorphButton */}
          <div className="footer-info-col">
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
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h</div>
              </div>
            </div>
          </div>

          {/* Bouton magnétique → formulaire de contact, en face des
              coordonnées de la colonne gauche. Ex-bouton WhatsApp. */}
          <div className="footer-contact-col">
            <ContactMorphButton />
          </div>
        </div>

        {/* Grille de navigation — port de .nav-grid (footer.html) */}
        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <h3>Navigation</h3>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target"><HoverFadeText>{l.label}</HoverFadeText></Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-nav-col">
            <h3>Informations</h3>
            <ul>
              {INFO_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target"><HoverFadeText>{l.label}</HoverFadeText></Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-nav-col footer-nav-action">
            <h3>Commander</h3>
            <div className="footer-map-card">
              <MapView />
            </div>
          </div>
        </div>

        <div className="footer-giant-type" aria-hidden="true">CHEZ FLORENCE</div>
      </div>

      <div className="footer-bottom">
        <RainbowText text="© 2026 Chez Florence — Tous droits réservés" variant="white" className="footer-copyright" />
      </div>
    </footer>
  )
}

'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import MagneticButton from './MagneticButton'
import RainbowText from './RainbowText'
import MapView from './MapView'
import { sendContactMessage } from '@/lib/api'
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
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await sendContactMessage(form)
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

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
          {/* Colonne info + WhatsApp + localisation */}
          <div className="footer-info-col">
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
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h</div>
              </div>
            </div>
          </div>

          {/* Formulaire minimaliste */}
          <div className="footer-form-card">
            {status === 'sent' ? (
              <div className="footer-form-success">
                <p>Message envoyé — on vous répond très vite.</p>
                <button type="button" className="btn-minimal" onClick={() => setStatus('idle')}>Écrire un autre message</button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="footer-form">
                <div className="form-row">
                  <div className="field-group">
                    <label className="field-label" htmlFor="f-name">Nom complet *</label>
                    <input id="f-name" name="name" type="text" required className="input-minimal" placeholder="Votre nom" value={form.name} onChange={onChange} />
                  </div>
                  <div className="field-group">
                    <label className="field-label" htmlFor="f-email">Email *</label>
                    <input id="f-email" name="email" type="email" required className="input-minimal" placeholder="vous@email.com" value={form.email} onChange={onChange} />
                  </div>
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="f-subject">Sujet</label>
                  <input id="f-subject" name="subject" type="text" className="input-minimal" placeholder="Race, prix, disponibilité..." value={form.subject} onChange={onChange} />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="f-message">Message *</label>
                  <textarea id="f-message" name="message" required rows={4} className="input-minimal" placeholder="Votre message..." value={form.message} onChange={onChange} />
                </div>
                <button type="submit" className="btn-minimal" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Envoi...' : 'Envoyer'} <ArrowRight size={15} />
                </button>
                {status === 'error' && <p className="footer-form-error">Un souci est survenu — écrivez-nous plutôt sur WhatsApp.</p>}
              </form>
            )}
          </div>
        </div>

        {/* Grille de navigation — port de .nav-grid (footer.html) */}
        <div className="footer-nav-grid">
          <div className="footer-nav-col">
            <h3>Navigation</h3>
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target">{l.label}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-nav-col">
            <h3>Informations</h3>
            <ul>
              {INFO_LINKS.map((l) => (
                <li key={l.href}><Link href={l.href} className="hover-target">{l.label}</Link></li>
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

'use client'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import MagneticButton from './MagneticButton'
import RainbowText from './RainbowText'
import { sendContactMessage } from '@/lib/api'
import './Footer.css'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, '') || ''
const waHref = WHATSAPP ? `https://wa.me/${WHATSAPP}` : '#'

// Footer unique du site. Formulaire adapté de contact_section_variants.html
// [PRENUM 4 : MONOCHROME] — coins nets, libellés mono, input bordé sans
// remplissage — porté sur la palette du projet (paper/ink/rust) plutôt
// que le noir/blanc littéral de la référence.
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
        <h2 className="footer-title">Parlons de<br />votre lapin.</h2>
        <RainbowText
          text="Une question sur une race, un prix, une disponibilité ? Écrivez-nous — on vous répond vite."
          variant="white"
          className="footer-sub"
        />

        <div className="footer-grid">
          {/* Colonne info + WhatsApp */}
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
                <div className="contact-label">Adresse</div>
                <div className="contact-value">Abidjan, Côte d&apos;Ivoire</div>
              </div>
              <div className="contact-item">
                <div className="contact-label">Horaires</div>
                <div className="contact-value">Lun–Ven 8h–18h · Sam 9h–14h · Dim fermé</div>
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
      </div>

      <div className="footer-bottom">
        <RainbowText text="© 2026 Chez Florence — Tous droits réservés" variant="white" className="footer-copyright" />
      </div>
    </footer>
  )
}

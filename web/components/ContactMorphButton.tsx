'use client'
import { useEffect, useRef, useState } from 'react'
import { Mail, Send } from 'lucide-react'
import HoverFadeText from './HoverFadeText'
import { sendContactMessage } from '@/lib/api'
import './Footer.css'
import './ContactMorphButton.css'

// Bouton magnétique WhatsApp → devient ce composant : même mécanique de
// morph que contact_lapin.html (ressort width/height/opacity piloté par
// requestAnimationFrame, bouton qui se réduit en petit rond ancré au coin
// du panneau déplié), mais la fonction WhatsApp est retirée — le panneau
// qui se déploie EST notre vrai formulaire de contact (mêmes champs et
// même appel API que l'ancienne carte statique du footer), pas les
// champs jetables de la démo. Le suivi magnétique du curseur (identique
// à MagneticButton.tsx) ne reste actif qu'à l'état fermé : une fois
// déplié, le panneau ne doit plus bouger sous la souris.
const STIFFNESS = 0.18
const FRICTION = 0.65

const PANEL_H = 480
const BTN_CLOSED_W = 210
const BTN_CLOSED_H = 56
const BTN_OPEN_SIZE = 56
const CORNER_GAP = 20

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function ContactMorphButton() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const [isExpanded, setIsExpanded] = useState(false)
  const isExpandedRef = useRef(false)
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  // Cibles/valeurs courantes du ressort — mêmes noms que contact_lapin.html
  // pour garder la correspondance avec l'original.
  const panelAnim = useRef({ currentW: 0, currentH: BTN_CLOSED_H, currentOpacity: 0, targetW: 0, targetH: BTN_CLOSED_H, targetOpacity: 0, vxW: 0, vxH: 0, vxO: 0 })
  const btnAnim = useRef({ currentW: BTN_CLOSED_W, currentH: BTN_CLOSED_H, currentX: 0, currentY: 0, targetX: 0, targetY: 0, targetW: BTN_CLOSED_W, targetH: BTN_CLOSED_H, vxW: 0, vxH: 0, vxX: 0, vxY: 0 })
  const panelWRef = useRef(360)

  const getPanelWidth = () => (typeof window === 'undefined' ? 360 : Math.min(360, window.innerWidth - 64))

  const openPanel = () => {
    const w = getPanelWidth()
    panelWRef.current = w
    panelAnim.current.targetW = w
    panelAnim.current.targetH = PANEL_H
    panelAnim.current.targetOpacity = 1
    btnAnim.current.targetW = BTN_OPEN_SIZE
    btnAnim.current.targetH = BTN_OPEN_SIZE
    btnAnim.current.targetX = w - BTN_OPEN_SIZE - CORNER_GAP
    btnAnim.current.targetY = PANEL_H - BTN_OPEN_SIZE - CORNER_GAP
    setIsExpanded(true)
    isExpandedRef.current = true
  }

  const closePanel = () => {
    panelAnim.current.targetW = 0
    panelAnim.current.targetH = BTN_CLOSED_H
    panelAnim.current.targetOpacity = 0
    btnAnim.current.targetW = BTN_CLOSED_W
    btnAnim.current.targetH = BTN_CLOSED_H
    btnAnim.current.targetX = 0
    btnAnim.current.targetY = 0
    setIsExpanded(false)
    isExpandedRef.current = false
  }

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      await sendContactMessage(form)
      setStatus('sent')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  const onBtnClick = () => {
    if (!isExpanded) { openPanel(); return }
    if (status === 'sent') { closePanel(); setTimeout(() => setStatus('idle'), 400); return }
    if (status === 'idle' || status === 'error') onSubmit()
  }

  // Fermeture au clic à l'extérieur (jamais pendant un envoi en cours).
  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!isExpandedRef.current || status === 'sending') return
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) closePanel()
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [status])

  // Boucle à ressort — port direct de contact_lapin.html (STIFFNESS/FRICTION),
  // appliquée ici via des refs React plutôt que des variables globales.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      const p = panelAnim.current
      const b = btnAnim.current

      p.vxW += (p.targetW - p.currentW) * STIFFNESS; p.vxW *= FRICTION; p.currentW += p.vxW
      p.vxH += (p.targetH - p.currentH) * STIFFNESS; p.vxH *= FRICTION; p.currentH += p.vxH
      p.vxO += (p.targetOpacity - p.currentOpacity) * STIFFNESS; p.vxO *= FRICTION; p.currentOpacity += p.vxO

      b.vxW += (b.targetW - b.currentW) * STIFFNESS; b.vxW *= FRICTION; b.currentW += b.vxW
      b.vxH += (b.targetH - b.currentH) * STIFFNESS; b.vxH *= FRICTION; b.currentH += b.vxH
      b.vxX += (b.targetX - b.currentX) * STIFFNESS; b.vxX *= FRICTION; b.currentX += b.vxX
      b.vxY += (b.targetY - b.currentY) * STIFFNESS; b.vxY *= FRICTION; b.currentY += b.vxY

      if (panelRef.current) {
        panelRef.current.style.width = `${p.currentW}px`
        panelRef.current.style.height = `${p.currentH}px`
        panelRef.current.style.opacity = String(p.currentOpacity)
      }
      if (btnRef.current) {
        btnRef.current.style.width = `${b.currentW}px`
        btnRef.current.style.height = `${b.currentH}px`
        btnRef.current.style.transform = `translate3d(${b.currentX}px, ${b.currentY}px, 0)`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Suivi magnétique du curseur — actif seulement pill fermée (repris de
  // MagneticButton.tsx) : passe par les MÊMES targetX/targetY que le
  // morph, pour ne jamais faire concurrence à deux systèmes sur le même
  // transform.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return
    const wrapper = wrapRef.current
    if (!wrapper) return
    const onMove = (e: MouseEvent) => {
      if (isExpandedRef.current) return
      const r = wrapper.getBoundingClientRect()
      btnAnim.current.targetX = (e.clientX - (r.left + r.width / 2)) * 0.4
      btnAnim.current.targetY = (e.clientY - (r.top + r.height / 2)) * 0.4
    }
    const onLeave = () => {
      if (isExpandedRef.current) return
      btnAnim.current.targetX = 0
      btnAnim.current.targetY = 0
    }
    wrapper.addEventListener('mousemove', onMove)
    wrapper.addEventListener('mouseleave', onLeave)
    return () => {
      wrapper.removeEventListener('mousemove', onMove)
      wrapper.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="cm-wrap" ref={wrapRef}>
      <div className="cm-panel" ref={panelRef}>
        <div className="cm-panel-inner" style={{ width: panelWRef.current }}>
          {status === 'sent' ? (
            <div className="footer-form-success">
              <p>Message envoyé — on vous répond très vite.</p>
              <button type="button" className="btn-minimal" onClick={() => { closePanel(); setStatus('idle') }}>
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="footer-form">
              <h3 className="cm-form-title">Nous écrire</h3>
              <div className="form-row">
                <div className="field-group">
                  <label className="field-label" htmlFor="cm-name">Nom complet *</label>
                  <input id="cm-name" name="name" type="text" required className="input-minimal" placeholder="Votre nom" value={form.name} onChange={onChange} />
                </div>
                <div className="field-group">
                  <label className="field-label" htmlFor="cm-email">Email *</label>
                  <input id="cm-email" name="email" type="email" required className="input-minimal" placeholder="vous@email.com" value={form.email} onChange={onChange} />
                </div>
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="cm-subject">Sujet</label>
                <input id="cm-subject" name="subject" type="text" className="input-minimal" placeholder="Race, prix, disponibilité..." value={form.subject} onChange={onChange} />
              </div>
              <div className="field-group">
                <label className="field-label" htmlFor="cm-message">Message *</label>
                <textarea id="cm-message" name="message" required rows={3} className="input-minimal" placeholder="Votre message..." value={form.message} onChange={onChange} />
              </div>
              {status === 'error' && <p className="footer-form-error">Un souci est survenu — réessayez ou écrivez-nous par email.</p>}
              <div className="cm-arrow-clearance" />
            </form>
          )}
        </div>
      </div>

      <button
        ref={btnRef}
        type="button"
        className="cm-btn hover-target"
        onClick={onBtnClick}
        aria-label={isExpanded ? 'Envoyer le message' : 'Nous contacter'}
      >
        <span className={`cm-state cm-state-closed ${isExpanded ? 'is-hidden' : ''}`}>
          <Mail size={17} strokeWidth={2.2} />
          <HoverFadeText>Nous contacter</HoverFadeText>
        </span>
        <span className={`cm-state cm-state-open ${isExpanded ? 'is-visible' : ''}`}>
          {status === 'sending' ? <span className="cm-spinner" /> : <Send size={18} strokeWidth={2.2} />}
        </span>
      </button>
    </div>
  )
}

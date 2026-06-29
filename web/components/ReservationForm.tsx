'use client'
// web/components/ReservationForm.tsx
// Formulaire actif uniquement sur les lapins "available"
// Après soumission → confirmation + lien WhatsApp

import { useState } from 'react'
import { rabbitsApi } from '@/lib/api'
import { CheckCircle2, MessageCircle } from 'lucide-react'

// Même clé que Nexura frontend/lib/config.js → NEXT_PUBLIC_WHATSAPP
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP

interface ReservationFormProps {
  slug: string
  rabbitName: string
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export default function ReservationForm({ slug, rabbitName }: ReservationFormProps) {
  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    message:   '',
  })
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('loading')
    setErrorMsg('')

    // Récupère la position du client depuis le sessionStorage si disponible
    let latitude: number | null = null
    let longitude: number | null = null
    if (typeof window !== 'undefined') {
      const localLoc = sessionStorage.getItem('lapinou_client_location')
      if (localLoc) {
        try {
          const parsed = JSON.parse(localLoc)
          if (parsed && parsed.lat && parsed.lng) {
            latitude = parsed.lat
            longitude = parsed.lng
          }
        } catch (err) {
          console.error('Erreur lecture coordonnées:', err)
        }
      }
    }

    try {
      await rabbitsApi.reserve(slug, {
        ...form,
        latitude,
        longitude
      })
      setState('success')
      playSuccessSound()
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue. Veuillez réessayer.')
      setState('error')
    }
  }

  function playSuccessSound() {
    if (typeof window === 'undefined') return
    const consentData = localStorage.getItem('lapinou_cookie_consent')
    if (!consentData) return
    try {
      const parsed = JSON.parse(consentData)
      if (!parsed.sound) return
    } catch (e) {
      return
    }

    const AudioContext = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContext) return
    try {
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      // Note harmonieuse cristalline (A5 à 880Hz)
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      
      osc.start()
      osc.stop(ctx.currentTime + 0.8)
    } catch (err) {
      console.error('Erreur lecture son:', err)
    }
  }

  // ── Succès ────────────────────────────────────────────────────────────────
  if (state === 'success') {
    const waText = `Bonjour, j'ai soumis une réservation pour ${rabbitName} sur votre site. Pouvons-nous convenir d'un rendez-vous ?`
    const waUrl  = WHATSAPP
      ? `https://wa.me/${WHATSAPP.replace(/\D/g, '')}?text=${encodeURIComponent(waText)}`
      : null

    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={22} className="text-sage shrink-0" />
          <h3 className="font-bold text-sage">Réservation envoyée !</h3>
        </div>
        <p className="text-sm text-white/60">
          Un email de confirmation vous a été envoyé. Le vendeur vous contactera
          prochainement pour confirmer votre rendez-vous.
        </p>
        {waUrl && (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4
                       rounded-xl bg-[#25D366] text-white font-semibold text-sm
                       hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={16} /> Confirmer via WhatsApp
          </a>
        )}
      </div>
    )
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="font-display font-bold text-white text-lg">Réserver {rabbitName}</h2>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Prénom" name="firstName" value={form.firstName} onChange={onChange} required />
        <Field label="Nom"    name="lastName"  value={form.lastName}  onChange={onChange} required />
      </div>

      <Field label="Email"     name="email" type="email" value={form.email} onChange={onChange} required />
      <Field label="Téléphone" name="phone" type="tel"   value={form.phone} onChange={onChange} required
             placeholder="+225 07 00 00 00 00" />

      <div>
        <label className="block text-xs font-medium text-white/50 mb-1">
          Message <span className="text-white/30">(facultatif)</span>
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={onChange}
          rows={3}
          placeholder="Vos disponibilités, questions…"
          className="input-dark w-full rounded-xl px-3 py-2 text-sm resize-none"
        />
      </div>

      {state === 'error' && (
        <p className="text-sm text-terracotta bg-terracotta/10 rounded-lg px-3 py-2">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="btn-neon w-full py-3 px-4 rounded-xl text-sm font-bold
                   disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {state === 'loading' ? 'Envoi…' : 'Envoyer ma demande de réservation'}
      </button>

      <p className="text-xs text-white/30 text-center">
        Votre demande n'engage à rien. Le vendeur vous contactera pour confirmer.
      </p>
    </form>
  )
}

// ─── Champ input réutilisable ─────────────────────────────────────────────────
interface FieldProps {
  label: string
  name: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  placeholder?: string
}

function Field({ label, name, type = 'text', value, onChange, required, placeholder }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-white/50 mb-1">
        {label} {required && <span className="text-white/30">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="input-dark w-full rounded-xl px-3 py-2 text-sm"
      />
    </div>
  )
}

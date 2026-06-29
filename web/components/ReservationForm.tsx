'use client'
// web/components/ReservationForm.tsx
// Flux : remplir le formulaire → cliquer le bouton WhatsApp vert
//   → envoie la réservation à l'API (email admin) + ouvre WhatsApp avec message intelligent
// Aucun email au client.

import { useEffect, useState } from 'react'
import { rabbitsApi } from '@/lib/api'
import { formatPrice } from '@/lib/status'
import { MessageCircle, Truck, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'

const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP

// Zones de livraison — miroir de api/src/lib/delivery.js
const DELIVERY_ZONES = [
  { key: 'abidjan',      label: 'Abidjan',                    fee: 2000, color: 'text-sky-400',    bg: 'bg-sky-400/10 border-sky-400/20' },
  { key: 'azaguie',      label: 'Azaguié & alentours',        fee: 1000, color: 'text-sage',        bg: 'bg-sage/10 border-sage/20' },
  { key: 'pays_profond', label: 'Reste de la Côte d\'Ivoire', fee: 3000, color: 'text-caramel',     bg: 'bg-caramel/10 border-caramel/20' },
]

interface ReservationFormProps {
  slug: string
  rabbitName: string
  rabbitPrice?: number
}

interface FormState {
  firstName: string
  lastName: string
  email: string
  phone: string
  message: string
}

export default function ReservationForm({ slug, rabbitName, rabbitPrice }: ReservationFormProps) {
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

    // Coordonnées GPS si dispo
    let latitude: number | null = null
    let longitude: number | null = null
    if (typeof window !== 'undefined') {
      try {
        const loc = sessionStorage.getItem('lapinou_client_location')
        if (loc) {
          const parsed = JSON.parse(loc)
          if (parsed?.lat && parsed?.lng) { latitude = parsed.lat; longitude = parsed.lng }
        }
      } catch (_) {}
    }

    try {
      // 1. Créer la réservation en base + envoyer l'email à l'admin
      await rabbitsApi.reserve(slug, { ...form, latitude, longitude })

      // 2. Ouvrir WhatsApp avec message pré-rempli intelligent
      if (WHATSAPP && typeof window !== 'undefined') {
        const waNum = WHATSAPP.replace(/\D/g, '')
        const waText = `Bonjour ! Je viens de réserver *${rabbitName}* sur votre site Lapinou 🐇\n\n` +
          `Voici mes coordonnées :\n` +
          `• Prénom : ${form.firstName}\n` +
          `• Nom : ${form.lastName}\n` +
          `• Téléphone : ${form.phone}\n\n` +
          `Quand seriez-vous disponible pour un rendez-vous ?`
        const waUrl = `https://wa.me/${waNum}?text=${encodeURIComponent(waText)}`
        window.open(waUrl, '_blank', 'noopener,noreferrer')
      }

      setState('success')
      playSuccessSound()
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue. Veuillez réessayer.')
      setState('error')
    }
  }

  function playSuccessSound() {
    if (typeof window === 'undefined') return
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    try {
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.7)
    } catch (_) {}
  }

  // ── Succès ────────────────────────────────────────────────────────────────
  if (state === 'success') {
    return (
      <div className="rounded-2xl border border-sage/30 bg-sage/10 p-6 space-y-3 text-center">
        <CheckCircle2 size={36} className="text-sage mx-auto" />
        <h3 className="font-bold text-sage text-lg">Réservation envoyée !</h3>
        <p className="text-sm text-white/60 leading-relaxed">
          Votre demande a bien été enregistrée.<br />
          WhatsApp s'est ouvert pour finaliser le rendez-vous.<br />
          <span className="text-white/40 text-xs">L'annonce est maintenant grisée.</span>
        </p>
        {WHATSAPP && (
          <a
            href={`https://wa.me/${WHATSAPP.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4
                       rounded-xl bg-[#25D366] text-white font-semibold text-sm
                       hover:bg-[#1ebe5d] transition-colors"
          >
            <MessageCircle size={16} /> Ouvrir WhatsApp à nouveau
          </a>
        )}
      </div>
    )
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="font-display font-bold text-white text-lg">Réserver {rabbitName}</h2>
        <p className="text-xs text-white/40 mt-0.5">
          Remplissez vos infos · WhatsApp s'ouvrira automatiquement
        </p>
      </div>

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
          rows={2}
          placeholder="Vos disponibilités, questions…"
          className="input-dark w-full rounded-xl px-3 py-2 text-sm resize-none"
        />
      </div>

      {/* Zones de livraison */}
      <div className="rounded-xl border border-brand-border bg-brand-darker/50 p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/35 mb-1">
          <Truck size={11} className="text-caramel" />
          Frais de livraison selon votre zone
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {DELIVERY_ZONES.map(z => (
            <div key={z.key} className={`flex items-center justify-between rounded-lg border px-3 py-2 ${z.bg}`}>
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className={z.color} />
                <span className="text-xs text-white/70">{z.label}</span>
              </div>
              <span className={`text-xs font-bold ${z.color}`}>{formatPrice(z.fee)}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-white/25 leading-relaxed">
          La zone est déterminée automatiquement selon votre position lors de la soumission.
        </p>
      </div>

      {state === 'error' && (
        <div className="flex items-start gap-2 text-sm text-terracotta bg-terracotta/10 rounded-lg px-3 py-2">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'loading'}
        className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl
                   bg-[#25D366] hover:bg-[#1ebe5d] active:bg-[#17a354]
                   text-white font-bold text-sm transition-all duration-200
                   shadow-lg shadow-[#25D366]/25
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {state === 'loading' ? (
          <>
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            Envoi en cours…
          </>
        ) : (
          <>
            <MessageCircle size={17} />
            Réserver via WhatsApp
          </>
        )}
      </button>

      <p className="text-[10px] text-white/25 text-center leading-relaxed">
        En cliquant, votre demande est enregistrée et WhatsApp s'ouvre automatiquement
        pour finaliser le rendez-vous avec le vendeur.
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
